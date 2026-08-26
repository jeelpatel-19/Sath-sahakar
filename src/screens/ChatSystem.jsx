import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, CheckCheck, PhoneCall, X, Loader2 } from 'lucide-react';
import { chatService } from '../services/chatService';

export default function ChatSystem({ chats, setChats, activeChatId, setActiveChatId, onSelectProduct, currentUser }) {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  // Supabase Realtime Listener for Active Chat
  useEffect(() => {
    if (!activeChat || !activeChat.id || activeChat.id.startsWith('chat-sathsarkaar')) return;

    const unsubscribe = chatService.subscribeToMessages(activeChat.id, (newMsg) => {
      setChats(prevChats => prevChats.map(c => {
        if (c.id === activeChat.id) {
          const exists = c.messages.some(m => m.id === newMsg.id);
          if (exists) return c;
          const formattedMsg = {
            id: newMsg.id,
            sender: newMsg.sender_id === currentUser?.id ? 'user' : 'other',
            text: newMsg.text,
            time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return {
            ...c,
            lastMessage: newMsg.text,
            lastMessageTime: 'હમણાં',
            messages: [...c.messages, formattedMsg]
          };
        }
        return c;
      }));
    });

    return () => unsubscribe();
  }, [activeChat?.id, currentUser?.id]);

  const handleSendMessage = async (textToSend = inputText) => {
    if (!textToSend.trim() || !activeChat) return;

    const text = textToSend.trim();
    setInputText('');
    setIsSending(true);

    const tempMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Optimistic UI update
    setChats(prevChats => prevChats.map(c => {
      if (c.id === activeChat.id) {
        return { ...c, lastMessage: text, lastMessageTime: 'હમણાં', messages: [...c.messages, tempMsg] };
      }
      return c;
    }));

    try {
      if (currentUser?.id && activeChat.id && !activeChat.id.startsWith('chat-sathsarkaar')) {
        await chatService.sendMessage({
          conversationId: activeChat.id,
          senderId: currentUser.id,
          receiverId: activeChat.sellerId || activeChat.buyerId || currentUser.id,
          text: text
        });
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!chats || chats.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '72px 24px',
        background: '#ffffff', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>💬</div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}>
          કોઈ સંદેશ નથી
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 8, fontFamily: 'var(--font-guj)', maxWidth: 380, margin: '8px auto 0 auto', lineHeight: 1.65 }}>
          કોઈ વસ્તુ પર "સંદેશ મોકલો" ક્લિક કરો. Chat અહીં દેખાશે.
        </p>
      </div>
    );
  }

  const QUICK_MSGS = [
    "આ વસ્તુ હજુ ઉપલબ્ધ છે?",
    "શું કિંમતમાં ફેરફાર થઈ શકે?",
    "આ ક્યાંથી ઉઠાવવી?"
  ];

  return (
    <div className="chat-container">
      {/* Left Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          💬 સંદેશા ({chats.length})
        </div>

        <div className="chat-thread-list">
          {chats.map(chat => {
            const isActive = activeChat && activeChat.id === chat.id;
            return (
              <div
                key={chat.id}
                id={`chat-thread-${chat.id}`}
                className={`chat-thread-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveChatId(chat.id)}
              >
                {/* Avatar */}
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 900, fontSize: '1.05rem', flexShrink: 0
                }}>
                  {(chat.sellerName || 'V').charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong style={{ fontSize: '0.87rem', color: 'var(--text-primary)', fontFamily: 'var(--font-guj)' }}>
                      {chat.sellerName}
                    </strong>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{chat.lastMessageTime}</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-guj)' }}>
                    {chat.productTitle}
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2, fontFamily: 'var(--font-guj)' }}>
                    {chat.lastMessage}
                  </div>
                </div>
                {chat.unreadCount > 0 && (
                  <div style={{
                    minWidth: 20, height: 20, borderRadius: 'var(--radius-full)',
                    background: 'var(--primary)', color: '#fff',
                    fontSize: '0.68rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 5px'
                  }}>
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="chat-main">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 900, fontSize: '1.1rem'
                }}>
                  {(activeChat.sellerName || 'V').charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 800, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}>
                    {activeChat.sellerName}
                  </h4>
                  <div style={{ fontSize: '0.72rem', color: isTyping ? 'var(--primary)' : '#16a34a', fontWeight: 700, fontFamily: 'var(--font-guj)' }}>
                    {isTyping ? '✍️ ટાઇપ કરે છે...' : '● ઓનલાઇન'}
                  </div>
                </div>
              </div>

              {/* Product Preview */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#ffffff', padding: '7px 14px',
                borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-xs)'
              }}>
                {activeChat.productImage && (
                  <img src={activeChat.productImage} alt="prod" style={{ width: 36, height: 36, borderRadius: 7, objectFit: 'cover' }} />
                )}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-guj)' }}>
                    {activeChat.productTitle}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{Number(activeChat.productPrice).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {activeChat.messages.map(msg => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                    <div className={`chat-bubble ${isUser ? 'user' : 'seller'}`}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: '0.67rem', color: 'var(--text-muted)', marginTop: 3, padding: '0 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {msg.time}
                      {isUser && <CheckCheck size={11} color="var(--primary)" />}
                    </span>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    background: '#ffffff', border: '1px solid var(--border-color)',
                    padding: '10px 16px', borderRadius: 20, borderBottomLeftRadius: 4,
                    display: 'flex', gap: 4, alignItems: 'center', boxShadow: 'var(--shadow-xs)'
                  }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)',
                        animation: `bounce 1.2s ${i * 0.2}s infinite`
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick message suggestions */}
            <div style={{ padding: '8px 16px', background: '#f9fafb', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {QUICK_MSGS.map((msg, i) => (
                <button
                  key={i}
                  id={`quick-msg-${i}`}
                  onClick={() => handleSendMessage(msg)}
                  style={{
                    background: '#ffffff', border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)', padding: '5px 12px',
                    fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'var(--font-guj)', color: 'var(--text-secondary)',
                    transition: 'var(--transition)'
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {msg}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="chat-input-bar">
              <input
                id="chat-input"
                type="text"
                className="form-input"
                placeholder="સંદેશ લખો..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                style={{ borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-guj)' }}
              />
              <button
                id="btn-send-message"
                onClick={() => handleSendMessage()}
                className="btn-sell-nav"
                style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px', gap: 7 }}
              >
                <Send size={16} /> મોકલો
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontFamily: 'var(--font-guj)' }}>
            વાત શરૂ કરવા chat પસંદ કરો
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
