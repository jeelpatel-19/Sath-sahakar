import React, { useState } from 'react';
import { 
  Send, Image as ImageIcon, ArrowLeft, MoreVertical, 
  Check, CheckCheck, ShieldOff, Flag, Tag, Sparkles, X 
} from 'lucide-react';

export default function ChatScreen({ chats, setChats, activeChatId, setActiveChatId }) {
  const [inputText, setInputText] = useState('');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showOfferInChat, setShowOfferInChat] = useState(false);
  const [customOfferAmount, setCustomOfferAmount] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId);

  const handleSendMessage = (textToSend = inputText, type = 'text', offerVal = null) => {
    if (!textToSend.trim() && type === 'text') return;
    if (!activeChatId) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      type: type,
      offerPrice: offerVal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = chats.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          lastMessage: textToSend,
          lastMessageTime: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    setChats(updatedChats);
    setInputText('');

    // Simulate seller real-time reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "Sounds great! When can you come by for pickup?",
        "Yes, I can do that price. Meet me near campus library tomorrow!",
        "Thanks for reaching out! The item is in pristine condition."
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const sellerMsg = {
        id: `m-seller-${Date.now()}`,
        sender: 'seller',
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prevChats => prevChats.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastMessage: randomReply,
            lastMessageTime: 'Just now',
            messages: [...c.messages, sellerMsg]
          };
        }
        return c;
      }));
    }, 2000);
  };

  const handleSendOfferInChat = () => {
    if (!customOfferAmount) return;
    const amount = Number(customOfferAmount);
    handleSendMessage(`Offered ₹${amount}`, 'offer', amount);
    setShowOfferInChat(false);
    setCustomOfferAmount('');
  };

  return (
    <div style={{ background: 'var(--bg-app)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* If No Active Chat Selected -> Show Conversations List */}
      {!activeChatId || !activeChat ? (
        <div style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>Messages & Offers</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {chats.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={chat.sellerAvatar} alt={chat.sellerName} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', border: '2px solid #fff' }}></span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>{chat.sellerName}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{chat.lastMessageTime}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', truncate: true }}>
                    {chat.productTitle}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                    {chat.lastMessage}
                  </div>
                </div>

                {chat.unreadCount > 0 && (
                  <span className="unread-badge" style={{ position: 'static' }}>{chat.unreadCount}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Conversation Thread View */
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-light)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => setActiveChatId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
                <ArrowLeft size={20} />
              </button>
              <img src={activeChat.sellerAvatar} alt={activeChat.sellerName} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{activeChat.sellerName}</div>
                <div style={{ fontSize: '0.7rem', color: isTyping ? 'var(--primary)' : '#10b981', fontWeight: 600 }}>
                  {isTyping ? 'typing...' : 'Online'}
                </div>
              </div>
            </div>

            <button onClick={() => setShowOptionsModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Embedded Product Summary Bar */}
          <div style={{ background: 'var(--bg-secondary)', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={activeChat.productImage} alt="prod" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeChat.productTitle}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>₹{activeChat.productPrice}</span>
              <button 
                onClick={() => setShowOfferInChat(true)}
                style={{ fontSize: '0.7rem', fontWeight: 700, background: 'var(--primary)', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '12px', cursor: 'pointer' }}
              >
                Make Offer
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeChat.messages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  {/* Offer Card Bubble */}
                  {msg.type === 'offer' ? (
                    <div style={{ background: isUser ? 'var(--primary-light)' : 'var(--bg-card)', border: '1px solid var(--primary-ring)', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
                      <Tag size={18} color="var(--primary)" style={{ margin: '0 auto 4px auto' }} />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price Offer</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{msg.offerPrice}</div>
                      <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>Offer Active</div>
                    </div>
                  ) : (
                    /* Regular Text Bubble */
                    <div style={{
                      background: isUser ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'var(--bg-card)',
                      color: isUser ? '#ffffff' : 'var(--text-main)',
                      padding: '10px 14px',
                      borderRadius: isUser ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                      fontSize: '0.84rem',
                      boxShadow: 'var(--shadow-sm)',
                      border: isUser ? 'none' : '1px solid var(--border-light)'
                    }}>
                      {msg.text}
                    </div>
                  )}

                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {msg.time} {isUser && <CheckCheck size={12} color="#10b981" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Send Input Bar */}
          <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => alert('Simulated Photo Attachment: Image uploaded to chat!')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <ImageIcon size={20} />
            </button>

            <input 
              type="text" 
              className="input-field" 
              placeholder="Type message..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{ borderRadius: 'var(--radius-full)', paddingLeft: '14px', fontSize: '0.84rem' }}
            />

            <button 
              onClick={() => handleSendMessage()}
              style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Offer Modal inside Chat */}
      {showOfferInChat && (
        <div className="modal-overlay">
          <div className="bottom-sheet">
            <div className="sheet-handle"></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Send Offer Amount</h3>
              <button onClick={() => setShowOfferInChat(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Offer Price (₹)</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="e.g. 2200" 
                value={customOfferAmount}
                onChange={(e) => setCustomOfferAmount(e.target.value)}
                style={{ fontSize: '1.2rem', fontWeight: 800 }}
              />
            </div>
            <button onClick={handleSendOfferInChat} className="btn-primary">
              Send Offer in Chat
            </button>
          </div>
        </div>
      )}

      {/* Options Modal (Block/Report) */}
      {showOptionsModal && (
        <div className="modal-overlay">
          <div className="bottom-sheet">
            <div className="sheet-handle"></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px' }}>Chat Settings</h3>
            <button 
              onClick={() => { alert('User Blocked'); setShowOptionsModal(false); }}
              className="btn-secondary" 
              style={{ marginBottom: '8px', color: '#dc2626' }}
            >
              <ShieldOff size={16} /> Block User
            </button>
            <button 
              onClick={() => { alert('Reported User'); setShowOptionsModal(false); }}
              className="btn-secondary" 
              style={{ marginBottom: '8px' }}
            >
              <Flag size={16} /> Report Conversation
            </button>
            <button onClick={() => setShowOptionsModal(false)} className="btn-secondary">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
