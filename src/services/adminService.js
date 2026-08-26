import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export const adminService = {
  // Fetch all users
  async getAllUsers() {
    if (!isSupabaseConfigured()) {
      return { users: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { users: data, error: null };
    } catch (err) {
      console.error('Admin get users error:', err);
      return { users: [], error: err.message };
    }
  },

  // Fetch all orders
  async getAllOrders() {
    if (!isSupabaseConfigured()) {
      return { orders: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          product:products(title, price),
          buyer:profiles!orders_buyer_id_fkey(full_name, email),
          seller:profiles!orders_seller_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { orders: data, error: null };
    } catch (err) {
      console.error('Admin get orders error:', err);
      return { orders: [], error: err.message };
    }
  },

  // Delete product (Admin)
  async deleteProductAdmin(productId) {
    if (!isSupabaseConfigured()) return { success: true };

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      console.error('Admin delete product error:', err);
      return { success: false, error: err.message };
    }
  }
};
