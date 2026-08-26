import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { INITIAL_PRODUCTS } from '../data/mockData';

// Image Compression Helper
const compressImage = (file, maxWidth = 1000, quality = 0.8) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve(file);

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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, compressedFile);

      if (error) {
        console.warn('Storage bucket upload failed, converting to Data URL:', error.message);
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
      throw err;
    }
  },

  // Fetch products with search, filter, and sorting
  async getProducts({ category, searchQuery, condition, minPrice, maxPrice, sortBy, sellerId } = {}) {
    if (!isSupabaseConfigured()) {
      let filtered = [...INITIAL_PRODUCTS];
      if (sellerId) filtered = filtered.filter(p => p.sellerId === sellerId);
      if (category && category !== 'all') filtered = filtered.filter(p => p.category === category);
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
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
        .select(`
          *,
          seller:profiles!products_seller_id_fkey(full_name, phone, avatar_url, city),
          product_images(image_url, sort_order)
        `)
        .eq('is_active', true);

      if (sellerId) query = query.eq('seller_id', sellerId);
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

      const formattedProducts = data.map(item => {
        const imagesArr = item.product_images && item.product_images.length > 0
          ? item.product_images.sort((a, b) => a.sort_order - b.sort_order).map(img => img.image_url)
          : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'];

        return {
          id: item.id,
          title: item.title,
          category: item.category,
          price: Number(item.price),
          condition: item.condition,
          brand: item.brand || '',
          location: item.location || item.city || 'અમદાવાદ',
          description: item.description,
          quantity: item.quantity,
          contactNumber: item.phone_number || item.seller?.phone || '+91 98765 43210',
          deliveryOption: item.delivery_option || 'સ્થાનિક પિકઅપ',
          status: item.status || (item.quantity <= 0 ? 'sold' : 'available'),
          sellerId: item.seller_id,
          sellerName: item.seller?.full_name || 'સ્થાનિક ગ્રાહક',
          sellerAvatar: item.seller?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          postedDate: new Date(item.created_at).toLocaleDateString('gu-IN', { month: 'short', day: 'numeric' }),
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

  // Create new product
  async createProduct(productData, imageFiles = []) {
    if (!isSupabaseConfigured()) {
      const imagesArr = [];
      for (const file of imageFiles) {
        imagesArr.push(URL.createObjectURL(file));
      }

      const newProd = {
        id: `prod-${Date.now()}`,
        ...productData,
        images: imagesArr.length ? imagesArr : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'],
        postedDate: 'હમણાં',
        status: 'available'
      };
      return { product: newProd, error: null };
    }

    try {
      // 1. Upload images
      const imageUrls = [];
      for (const file of imageFiles) {
        const url = await this.uploadImage(file);
        imageUrls.push(url);
      }

      if (imageUrls.length === 0) {
        imageUrls.push('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80');
      }

      // 2. Insert product record
      const { data: product, error: prodError } = await supabase
        .from('products')
        .insert({
          seller_id: productData.sellerId,
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
          status: 'available'
        })
        .select()
        .single();

      if (prodError) throw prodError;

      // 3. Insert product images
      const imageRecords = imageUrls.map((url, idx) => ({
        product_id: product.id,
        image_url: url,
        sort_order: idx
      }));

      await supabase.from('product_images').insert(imageRecords);

      return {
        product: {
          ...product,
          images: imageUrls
        },
        error: null
      };
    } catch (err) {
      console.error('Create product error:', err);
      return { product: null, error: err.message || 'વસ્તુ પ્રકાશિત કરવામાં નિષ્ફળતા આવી.' };
    }
  },

  // Mark product as sold
  async markAsSold(productId) {
    if (!isSupabaseConfigured()) return { success: true };

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

  // Delete product
  async deleteProduct(productId) {
    if (!isSupabaseConfigured()) return { success: true };

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
  }
};
