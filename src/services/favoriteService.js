import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export const favoriteService = {
  // Get user favorites product IDs
  async getUserFavorites(userId) {
    if (!isSupabaseConfigured()) {
      const saved = JSON.parse(localStorage.getItem('sathsarkaar_saved') || '[]');
      return { favoriteProductIds: saved, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', userId);

      if (error) throw error;
      const ids = data.map(f => f.product_id);
      return { favoriteProductIds: ids, error: null };
    } catch (err) {
      console.error('Fetch favorites error:', err);
      return { favoriteProductIds: [], error: err.message };
    }
  },

  // Toggle favorite
  async toggleFavorite(userId, productId, isCurrentlySaved) {
    if (!isSupabaseConfigured()) {
      const saved = JSON.parse(localStorage.getItem('sathsarkaar_saved') || '[]');
      const updated = isCurrentlySaved
        ? saved.filter(id => id !== productId)
        : [...saved, productId];
      localStorage.setItem('sathsarkaar_saved', JSON.stringify(updated));
      return { isSaved: !isCurrentlySaved, error: null };
    }

    try {
      if (isCurrentlySaved) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);

        if (error) throw error;
        return { isSaved: false, error: null };
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, product_id: productId });

        if (error) throw error;
        return { isSaved: true, error: null };
      }
    } catch (err) {
      console.error('Toggle favorite error:', err);
      return { isSaved: isCurrentlySaved, error: err.message };
    }
  }
};
