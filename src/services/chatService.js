import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export const chatService = {
  // Get or Create Conversation between Buyer and Seller for a Product
  async getOrCreateConversation({ productId, buyerId, sellerId }) {
    if (!isSupabaseConfigured()) {
      return {
        conversation: {
          id: `chat-${productId}-${buyerId}`,
          productId,
          buyerId,
          sellerId
        },
        error: null
      };
    }

    try {
      // 1. Check existing conversation
      const { data: existing, error: findError } = await supabase
        .from('conversations')
        .select('*')
        .eq('product_id', productId)
        .eq('buyer_id', buyerId)
        .eq('seller_id', sellerId)
        .maybeSingle();

      if (existing) {
        return { conversation: existing, error: null };
      }

      // 2. Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          product_id: productId,
          buyer_id: buyerId,
          seller_id: sellerId
        })
        .select()
        .single();

      if (createError) throw createError;
      return { conversation: newConv, error: null };
    } catch (err) {
      console.error('Get/Create conversation error:', err);
      return { conversation: null, error: err.message };
    }
  },

  // Fetch all conversations for a user
  async getUserConversations(userId) {
    if (!isSupabaseConfigured()) {
      const saved = JSON.parse(localStorage.getItem('sathsarkaar_chats') || '[]');
      return { conversations: saved, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          product:products(id, title, price, status, product_images(image_url)),
          buyer:profiles!conversations_buyer_id_fkey(full_name, avatar_url),
          seller:profiles!conversations_seller_id_fkey(full_name, avatar_url),
          messages(id, text, sender_id, is_read, created_at)
        `)
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formatted = data.map(conv => {
        const sortedMsgs = conv.messages ? conv.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) : [];
        const lastMsg = sortedMsgs[sortedMsgs.length - 1];
        const otherPerson = conv.buyer_id === userId ? conv.seller : conv.buyer;
        const unread = sortedMsgs.filter(m => m.sender_id !== userId && !m.is_read).length;

        const prodImg = conv.product?.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80';

        return {
          id: conv.id,
          productId: conv.product_id,
          productTitle: conv.product?.title || 'વસ્તુ',
          productPrice: conv.product?.price || 0,
          productImage: prodImg,
          otherPersonName: otherPerson?.full_name || 'ગ્રાહક',
          otherPersonAvatar: otherPerson?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          unreadCount: unread,
          lastMessage: lastMsg?.text || 'ચેટ શરૂ કરો...',
          lastMessageTime: lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          messages: sortedMsgs.map(m => ({
            id: m.id,
            sender: m.sender_id === userId ? 'user' : 'other',
            text: m.text,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }))
        };
      });

      return { conversations: formatted, error: null };
    } catch (err) {
      console.error('Get conversations error:', err);
      return { conversations: [], error: err.message };
    }
  },

  // Send Message
  async sendMessage({ conversationId, senderId, receiverId, text }) {
    if (!isSupabaseConfigured()) {
      const newMsg = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return { message: newMsg, error: null };
    }

    try {
      const { data: msg, error: msgErr } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          receiver_id: receiverId,
          text: text,
          is_read: false
        })
        .select()
        .single();

      if (msgErr) throw msgErr;

      // Update conversation updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Create Notification for receiver
      await supabase.from('notifications').insert({
        user_id: receiverId,
        title: 'નવો સંદેશ મળ્યો',
        message: text.substring(0, 40) + '...',
        type: 'chat',
        link: `/messages`
      });

      return { message: msg, error: null };
    } catch (err) {
      console.error('Send message error:', err);
      return { message: null, error: err.message };
    }
  },

  // Realtime subscription for conversation messages
  subscribeToMessages(conversationId, callback) {
    if (!isSupabaseConfigured()) return () => {};

    const channel = supabase
      .channel(`conversation_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
