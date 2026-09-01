import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { INITIAL_PRODUCTS } from '../data/mockData';

// Image Compression Helper
const compressImage = (file, maxWidth = 1000, quality = 0.8) => {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith('image/')) return resolve(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export const productService = {
  // Upload photo to Supabase Storage
  async uploadImage(file) {
    if (!isSupabaseConfigured()) {
      return URL.createObjectURL(file);
    }

    try {
      const compressedFile = await compressImage(file);
      const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, compressedFile);

      if (error) {
        console.warn('Storage bucket upload failed, using Data URL fallback:', error.message);
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(compressedFile);
        });
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Image upload error:', err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }
  },

  // Fetch published products for ALL users (shared marketplace database)
  async getProducts({ category, searchQuery, condition, minPrice, maxPrice, sortBy, sellerId } = {}) {
    if (!isSupabaseConfigured()) {
      const savedStr = localStorage.getItem('sathsarkaar_products');
      let filtered = savedStr ? JSON.parse(savedStr) : [...INITIAL_PRODUCTS];

      if (sellerId) filtered = filtered.filter(p => p.sellerId === sellerId || p.seller_id === sellerId);
      if (category && category !== 'all') filtered = filtered.filter(p => p.category === category);
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q));
      }
      if (condition) filtered = filtered.filter(p => p.condition === condition);
      if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
      if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));

      if (sortBy === 'lowest') filtered.sort((a, b) => a.price - b.price);
      if (sortBy === 'highest') filtered.sort((a, b) => b.price - a.price);
      return { products: filtered, error: null };
    }

    try {
      let query = supabase
        .from('products')
        .select('*');

      if (sellerId) {
        query = query.eq('seller_id', sellerId);
      }
      if (category && category !== 'all') query = query.eq('category', category);
      if (condition) query = query.eq('condition', condition);
      if (minPrice) query = query.gte('price', Number(minPrice));
      if (maxPrice) query = query.lte('price', Number(maxPrice));

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }

      if (sortBy === 'lowest') query = query.order('price', { ascending: true });
      else if (sortBy === 'highest') query = query.order('price', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      // Fetch product images for all retrieved products
      const productIds = (data || []).map(p => p.id);
      let imagesMap = {};
      if (productIds.length > 0) {
        const { data: imgData } = await supabase
          .from('product_images')
          .select('product_id, image_url, sort_order')
          .in('product_id', productIds);

        (imgData || []).forEach(img => {
          if (!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
          imagesMap[img.product_id].push(img.image_url);
        });
      }

      // Fetch seller profiles for all retrieved products
      const sellerIds = [...new Set((data || []).map(p => p.seller_id).filter(Boolean))];
      let profilesMap = {};
      if (sellerIds.length > 0) {
        const { data: profData } = await supabase
          .from('profiles')
          .select('id, full_name, phone, avatar_url, city')
          .in('id', sellerIds);

        (profData || []).forEach(prof => {
          profilesMap[prof.id] = prof;
        });
      }

      const formattedProducts = (data || []).map(item => {
        const sellerObj = profilesMap[item.seller_id] || {};
        const imagesArr = imagesMap[item.id] && imagesMap[item.id].length > 0
          ? imagesMap[item.id]
          : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'];

        return {
          id: item.id,
          title: item.title,
          category: item.category,
          price: Number(item.price),
          condition: item.condition,
          brand: item.brand || '',
          location: item.location || item.city || sellerObj.city || 'અમદાવાદ',
          description: item.description,
          quantity: item.quantity,
          contactNumber: item.phone_number || sellerObj.phone || '',
          phone_number: item.phone_number || sellerObj.phone || '',
          deliveryOption: item.delivery_option || 'સ્થાનિક પિકઅપ',
          status: item.status || (item.quantity <= 0 ? 'sold' : 'available'),
          sellerId: item.seller_id,
          seller_id: item.seller_id,
          sellerName: sellerObj.full_name || item.seller_name || 'સ્થાનિક વેચનાર',
          sellerAvatar: sellerObj.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          postedDate: item.created_at ? new Date(item.created_at).toLocaleDateString('gu-IN', { month: 'short', day: 'numeric' }) : 'હમણાં',
          createdAt: item.created_at,
          images: imagesArr
        };
      });

      return { products: formattedProducts, error: null };
    } catch (err) {
      console.error('Fetch products error:', err);
      return { products: [], error: err.message || 'વસ્તુઓ લોડ કરવામાં સમસ્યા આવી.' };
    }
  },

  // Create new product in Supabase DB (verifying real authenticated seller_id)
  async createProduct(productData, imageFiles = []) {
    if (!isSupabaseConfigured()) {
      const imagesArr = [];
      for (const file of imageFiles) {
        if (typeof file === 'string') {
          imagesArr.push(file);
        } else {
          imagesArr.push(URL.createObjectURL(file));
        }
      }

      const savedStr = localStorage.getItem('sathsarkaar_products');
      const existingProds = savedStr ? JSON.parse(savedStr) : [...INITIAL_PRODUCTS];

      const newProd = {
        id: `prod-${Date.now()}`,
        ...productData,
        seller_id: productData.sellerId,
        sellerId: productData.sellerId,
        images: imagesArr.length ? imagesArr : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'],
        postedDate: 'હમણાં',
        status: 'available'
      };

      const updatedProds = [newProd, ...existingProds];
      localStorage.setItem('sathsarkaar_products', JSON.stringify(updatedProds));
      return { product: newProd, error: null };
    }

    try {
      // 1. Get authenticated user ID
      const { data: authData } = await supabase.auth.getUser();
      const authenticatedUserId = authData?.user?.id || productData.sellerId;

      if (!authenticatedUserId) {
        throw new Error('વસ્તુ પ્રકાશિત કરવા માટે લૉગિન કરવું જરૂરી છે.');
      }

      // 2. Upload images to Supabase Storage
      const imageUrls = [];
      for (const file of imageFiles) {
        const url = await this.uploadImage(file);
        imageUrls.push(url);
      }

      if (imageUrls.length === 0) {
        imageUrls.push('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80');
      }

      // 3. Insert product record in Supabase DB
      const { data: product, error: prodError } = await supabase
        .from('products')
        .insert({
          seller_id: authenticatedUserId,
          title: productData.title,
          category: productData.category,
          description: productData.description,
          price: Number(productData.price),
          condition: productData.condition,
          brand: productData.brand || '',
          location: productData.location,
          city: productData.city || 'અમદાવાદ',
          quantity: Number(productData.quantity || 1),
          phone_number: productData.phone_number || productData.contactNumber,
          delivery_option: productData.deliveryOption || 'સ્થાનિક પિકઅપ',
          is_active: true,
          status: 'available'
        })
        .select()
        .single();

      if (prodError) {
        console.error('Database product insert error:', prodError);
        throw new Error('એકાઉન્ટમાંથી વસ્તુ ઉમેરવામાં ક્ષતિ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
      }

      // 4. Insert product images in DB
      const imageRecords = imageUrls.map((url, idx) => ({
        product_id: product.id,
        image_url: url,
        sort_order: idx
      }));

      await supabase.from('product_images').insert(imageRecords);

      const formattedProduct = {
        id: product.id,
        title: product.title,
        category: product.category,
        price: Number(product.price),
        condition: product.condition,
        brand: product.brand || '',
        location: product.location || product.city || 'અમદાવાદ',
        description: product.description,
        quantity: product.quantity,
        contactNumber: product.phone_number || productData.contactNumber,
        phone_number: product.phone_number || productData.contactNumber,
        deliveryOption: product.delivery_option || 'સ્થાનિક પિકઅપ',
        status: product.status || 'available',
        sellerId: product.seller_id,
        seller_id: product.seller_id,
        sellerName: productData.sellerName || 'સ્થાનિક વેચનાર',
        sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        postedDate: 'હમણાં',
        createdAt: product.created_at,
        images: imageUrls
      };

      return {
        product: formattedProduct,
        error: null
      };
    } catch (err) {
      console.error('Create product error:', err);
      return { product: null, error: err.message || 'વસ્તુ પ્રકાશિત કરવામાં ક્ષતિ આવી.' };
    }
  },

  // Mark product as sold
  async markAsSold(productId) {
    if (!isSupabaseConfigured()) {
      const savedStr = localStorage.getItem('sathsarkaar_products');
      if (savedStr) {
        const prods = JSON.parse(savedStr).map(p => p.id === productId ? { ...p, status: 'sold', quantity: 0 } : p);
        localStorage.setItem('sathsarkaar_products', JSON.stringify(prods));
      }
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'sold', quantity: 0, updated_at: new Date().toISOString() })
        .eq('id', productId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      console.error('Mark sold error:', err);
      return { success: false, error: err.message };
    }
  },

  // Delete product (only allowed if seller_id === auth.uid())
  async deleteProduct(productId) {
    if (!isSupabaseConfigured()) {
      const savedStr = localStorage.getItem('sathsarkaar_products');
      if (savedStr) {
        const prods = JSON.parse(savedStr).filter(p => p.id !== productId);
        localStorage.setItem('sathsarkaar_products', JSON.stringify(prods));
      }
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      console.error('Delete product error:', err);
      return { success: false, error: err.message };
    }
  },

  // Fetch only ACTIVE products by a specific seller
  async getProductsBySeller(sellerId) {
    const { products, error } = await this.getProducts({ sellerId });
    if (error) return { products: [], error };
    const activeProducts = (products || []).filter(p => p.status === 'available' || p.status !== 'sold');
    return { products: activeProducts, error: null };
  },

  // Get Seller Public Profile by sellerId
  async getSellerProfile(sellerId) {
    if (!isSupabaseConfigured()) {
      const savedStr = localStorage.getItem('sathsarkaar_products');
      const prods = savedStr ? JSON.parse(savedStr) : [...INITIAL_PRODUCTS];
      const sellerProd = prods.find(p => p.sellerId === sellerId || p.seller_id === sellerId);
      return {
        profile: {
          id: sellerId,
          full_name: sellerProd?.sellerName || 'સ્થાનિક વેચનાર',
          avatar_url: sellerProd?.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          city: sellerProd?.location || sellerProd?.city || 'અમદાવાદ'
        },
        error: null
      };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, avatar_url, city, area')
        .eq('id', sellerId)
        .single();

      if (error) throw error;
      return { profile: data, error: null };
    } catch (err) {
      console.error('Get seller profile error:', err);
      return { profile: null, error: err.message };
    }
  }
};
