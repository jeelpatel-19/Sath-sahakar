import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export const orderService = {
  // Create Order in Database
  async createOrder(orderData) {
    if (!isSupabaseConfigured()) {
      const mockOrder = {
        id: `ord-${Date.now()}`,
        ...orderData,
        status: 'ઓર્ડર મળ્યો',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString()
      };
      const saved = JSON.parse(localStorage.getItem('sathsarkaar_orders') || '[]');
      localStorage.setItem('sathsarkaar_orders', JSON.stringify([mockOrder, ...saved]));
      return { order: mockOrder, error: null };
    }

    try {
      // 1. Create order record
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: orderData.buyerId,
          seller_id: orderData.sellerId,
          product_id: orderData.productId,
          quantity: Number(orderData.quantity || 1),
          unit_price: Number(orderData.unitPrice),
          total_amount: Number(orderData.totalAmount),
          delivery_option: orderData.deliveryOption || 'સ્થાનિક પિકઅપ',
          buyer_name: orderData.buyerName,
          buyer_phone: orderData.buyerPhone,
          shipping_address: orderData.shippingAddress || '',
          razorpay_order_id: orderData.razorpayOrderId || '',
          razorpay_payment_id: orderData.razorpayPaymentId || '',
          razorpay_signature: orderData.razorpaySignature || '',
          payment_status: 'paid',
          status: 'ઓર્ડર મળ્યો'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert Payment Record
      await supabase.from('payments').insert({
        order_id: order.id,
        razorpay_order_id: orderData.razorpayOrderId || `sim_${Date.now()}`,
        razorpay_payment_id: orderData.razorpayPaymentId || `pay_${Date.now()}`,
        razorpay_signature: orderData.razorpaySignature || '',
        amount: Number(orderData.totalAmount),
        status: 'captured'
      });

      // 3. Decrement Product Stock Inventory using RPC
      try {
        await supabase.rpc('decrement_product_quantity', {
          p_product_id: orderData.productId,
          p_qty: Number(orderData.quantity || 1)
        });
      } catch (rpcErr) {
        console.warn('RPC stock update fallback:', rpcErr.message);
        // Fallback standard update
        const { data: prod } = await supabase.from('products').select('quantity').eq('id', orderData.productId).single();
        if (prod) {
          const newQty = Math.max(0, prod.quantity - Number(orderData.quantity || 1));
          await supabase.from('products').update({
            quantity: newQty,
            status: newQty === 0 ? 'sold' : 'available'
          }).eq('id', orderData.productId);
        }
      }

      // 4. Create Seller Notification
      await supabase.from('notifications').insert({
        user_id: orderData.sellerId,
        title: 'નવો ઓર્ડર મળ્યો!',
        message: `${orderData.buyerName} એ તમારી વસ્તુનો ઓર્ડર આપ્યો છે.`,
        type: 'order',
        link: `/dashboard?tab=seller-orders`
      });

      return { order, error: null };
    } catch (err) {
      console.error('Create order error:', err);
      return { order: null, error: err.message || 'ઓર્ડર બનાવવામાં સમસ્યા આવી.' };
    }
  },

  // Get buyer orders
  async getBuyerOrders(buyerId) {
    if (!isSupabaseConfigured()) {
      const saved = JSON.parse(localStorage.getItem('sathsarkaar_orders') || '[]');
      return { orders: saved.filter(o => o.buyerId === buyerId), error: null };
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          product:products(id, title, price, status, product_images(image_url)),
          seller:profiles!orders_seller_id_fkey(full_name, phone, city)
        `)
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { orders: data, error: null };
    } catch (err) {
      console.error('Fetch buyer orders error:', err);
      return { orders: [], error: err.message };
    }
  },

  // Get seller orders
  async getSellerOrders(sellerId) {
    if (!isSupabaseConfigured()) {
      const saved = JSON.parse(localStorage.getItem('sathsarkaar_orders') || '[]');
      return { orders: saved.filter(o => o.sellerId === sellerId), error: null };
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          product:products(id, title, price, status, product_images(image_url)),
          buyer:profiles!orders_buyer_id_fkey(full_name, phone, city)
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { orders: data, error: null };
    } catch (err) {
      console.error('Fetch seller orders error:', err);
      return { orders: [], error: err.message };
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    if (!isSupabaseConfigured()) {
      const saved = JSON.parse(localStorage.getItem('sathsarkaar_orders') || '[]');
      const updated = saved.map(o => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem('sathsarkaar_orders', JSON.stringify(updated));
      return { success: true };
    }

    try {
      const { data: order, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      // Notify Buyer
      if (order) {
        await supabase.from('notifications').insert({
          user_id: order.buyer_id,
          title: 'ઓર્ડર સ્થિતિ બદલાઈ!',
          message: `તમારા ઓર્ડર ની નવી સ્થિતિ: ${status}`,
          type: 'order',
          link: `/dashboard?tab=buyer-orders`
        });
      }

      return { success: true, order, error: null };
    } catch (err) {
      console.error('Update order status error:', err);
      return { success: false, error: err.message };
    }
  }
};
