import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export const authService = {
  // Sign up new user with full profile metadata
  async signUp({ email, password, fullName, phone, city = 'અમદાવાદ', area = '', avatarUrl = '' }) {
    if (!isSupabaseConfigured()) {
      // Offline / Local dev fallback
      const mockUser = {
        id: `usr-${Date.now()}`,
        email,
        name: fullName || email.split('@')[0],
        phone: phone || '+91 98765 43210',
        city: city || 'અમદાવાદ',
        area: area || '',
        avatar: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      localStorage.setItem('sathsarkaar_user', JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            city: city,
            area: area,
            avatar_url: avatarUrl
          }
        }
      });

      if (error) {
        throw new Error('એકાઉન્ટ બનાવવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
      }

      if (data?.user) {
        // Also insert/upsert into profiles table directly
        const profileData = {
          id: data.user.id,
          full_name: fullName,
          email: email,
          phone: phone,
          city: city,
          area: area,
          avatar_url: avatarUrl
        };
        await supabase.from('profiles').upsert(profileData);
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err) {
      console.error('Signup error:', err);
      return { user: null, error: err.message || 'એકાઉન્ટ બનાવવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.' };
    }
  },

  // Log in existing user
  async signIn({ email, password }) {
    if (!isSupabaseConfigured()) {
      const mockUser = {
        id: `usr-demo-1`,
        email,
        name: email.split('@')[0],
        phone: '+91 98765 43210',
        city: 'અમદાવાદ',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      localStorage.setItem('sathsarkaar_user', JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error('ઈમેલ અથવા પાસવર્ડ ખોટો છે.');
      }

      // Fetch user profile
      const profile = await this.getProfile(data.user.id);

      return {
        user: { ...data.user, ...profile },
        session: data.session,
        error: null
      };
    } catch (err) {
      console.error('Login error:', err);
      return { user: null, error: err.message || 'ઈમેલ અથવા પાસવર્ડ ખોટો છે.' };
    }
  },

  // Phone OTP Login
  async signInWithPhone(phone) {
    if (!isSupabaseConfigured()) {
      return { success: true, message: 'OTP મોકલાયો: 123456 (ટેસ્ટ મોડ)' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone
      });

      if (error) throw error;
      return { success: true, data, error: null };
    } catch (err) {
      console.error('Phone OTP error:', err);
      return { success: false, error: err.message || 'OTP મોકલવામાં ભૂલ આવી.' };
    }
  },

  // Password reset email
  async resetPassword(email) {
    if (!isSupabaseConfigured()) {
      return { success: true, message: 'પાસવર્ડ રીસેટ કરવાની લિંક તમારા ઈમેલ પર મોકલવામાં આવી છે.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      console.error('Password reset error:', err);
      return { success: false, error: 'પાસવર્ડ રીસેટ કરવામાં સમસ્યા આવી.' };
    }
  },

  // Sign out user
  async signOut() {
    localStorage.removeItem('sathsarkaar_user');
    if (!isSupabaseConfigured()) return { error: null };

    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err) {
      console.error('Signout error:', err);
      return { error: err.message };
    }
  },

  // Get active session
  async getSession() {
    if (!isSupabaseConfigured()) {
      const saved = localStorage.getItem('sathsarkaar_user');
      return saved ? { user: JSON.parse(saved) } : null;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) return null;

      const profile = await this.getProfile(session.user.id);
      return {
        session,
        user: { ...session.user, ...profile }
      };
    } catch (err) {
      console.error('Get session error:', err);
      return null;
    }
  },

  // Get User Profile from profiles table
  async getProfile(userId) {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) return null;
      return {
        id: data.id,
        name: data.full_name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        area: data.area,
        avatar: data.avatar_url,
        isAdmin: data.is_admin
      };
    } catch (err) {
      console.error('Get profile error:', err);
      return null;
    }
  },

  // Update profile
  async updateProfile(userId, updates) {
    if (!isSupabaseConfigured()) {
      const saved = localStorage.getItem('sathsarkaar_user');
      const current = saved ? JSON.parse(saved) : {};
      const updated = { ...current, ...updates };
      localStorage.setItem('sathsarkaar_user', JSON.stringify(updated));
      return { user: updated, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.name,
          phone: updates.phone,
          city: updates.city,
          area: updates.area,
          avatar_url: updates.avatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { user: data, error: null };
    } catch (err) {
      console.error('Update profile error:', err);
      return { user: null, error: err.message };
    }
  },

  // Auth State Listener
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured()) return () => { };
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getProfile(session.user.id);
        callback(event, { ...session.user, ...profile });
      } else {
        callback(event, null);
      }
    });
  }
};
