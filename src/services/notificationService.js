import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export const notificationService = {
  // Fetch user notifications
  async getUserNotifications(userId) {
    if (!isSupabaseConfigured()) {
      return { notifications: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { notifications: data, error: null };
    } catch (err) {
      console.error('Fetch notifications error:', err);
      return { notifications: [], error: err.message };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    if (!isSupabaseConfigured()) return { success: true };

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      console.error('Mark notification read error:', err);
      return { success: false, error: err.message };
    }
  }
};
