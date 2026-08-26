import React, { useState } from 'react';
import { 
  User, CheckCircle2, Heart, ShoppingBag, ShieldCheck, 
  Settings, HelpCircle, LogOut, Moon, Sun, ChevronRight, Sparkles, MapPin, Award
} from 'lucide-react';

export default function ProfileScreen({ 
  currentUser, 
  products, 
  savedProductIds, 
  onSelectProduct, 
  isDarkMode, 
  setIsDarkMode,
  onOpenAuth 
}) {
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'saved' | 'verify' | 'settings'
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifySubmitted, setVerifySubmitted] = useState(false);

  const myActiveListings = products.filter(p => p.seller.id === currentUser.id || p.seller.name === currentUser.name);
  const savedProducts = products.filter(p => savedProductIds.includes(p.id));

  return (
    <div style={{ padding: '16px' }}>
      {/* Profile Header Card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '16px', boxShadow: 'var(--shadow-sm)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <img src={currentUser.avatar} alt={currentUser.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
            {currentUser.verified && (
              <span style={{ position: 'absolute', bottom: '0', right: '0', background: '#fff', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                <CheckCircle2 size={18} color="#10b981" />
              </span>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {currentUser.name}
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <MapPin size={12} /> {currentUser.collegeName || 'North Campus Community'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Member since {currentUser.memberSince} • ★ {currentUser.rating} Rating
            </div>
          </div>
        </div>

        {/* User Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', borderTop: '1px solid var(--border-light)', marginTop: '14px', paddingTop: '12px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{myActiveListings.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Listings</div>
          </div>

          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-green)' }}>{currentUser.soldItemsCount || 4}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Items Sold</div>
          </div>

          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{savedProductIds.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Saved Items</div>
          </div>
        </div>
      </div>

      {/* Verified Badge Banner if not verified */}
      {!currentUser.verified && (
        <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', borderRadius: 'var(--radius-lg)', padding: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} /> Get Verified Seller Badge
            </div>
            <div style={{ fontSize: '0.76rem', opacity: 0.9, marginTop: '2px' }}>
              Upload Student / Govt ID to boost buyer trust by 4x!
            </div>
          </div>
          <button 
            onClick={() => setShowVerifyModal(true)}
            style={{ background: '#fff', color: '#059669', border: 'none', padding: '6px 14px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
          >
            Apply
          </button>
        </div>
      )}

      {/* Profile Section Tabs */}
      <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
        <button 
          onClick={() => setActiveTab('listings')}
          style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, background: activeTab === 'listings' ? 'var(--primary)' : 'transparent', color: activeTab === 'listings' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' }}
        >
          My Listings
        </button>

        <button 
          onClick={() => setActiveTab('saved')}
          style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, background: activeTab === 'saved' ? 'var(--primary)' : 'transparent', color: activeTab === 'saved' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' }}
        >
          Saved ({savedProductIds.length})
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, background: activeTab === 'settings' ? 'var(--primary)' : 'transparent', color: activeTab === 'settings' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' }}
        >
          Settings
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* MY LISTINGS */}
      {activeTab === 'listings' && (
        <div>
          {myActiveListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <ShoppingBag size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px auto' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>No Active Listings Yet</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tap the + Sell button to post your first item!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myActiveListings.map(prod => (
                <div 
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '10px', display: 'flex', gap: '12px', cursor: 'pointer' }}
                >
                  <img src={prod.images[0]} alt={prod.title} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{prod.title}</h4>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>₹{prod.price}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 700, marginTop: '2px' }}>Status: Live & Active</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SAVED WISHLIST */}
      {activeTab === 'saved' && (
        <div>
          {savedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <Heart size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px auto' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Wishlist is Empty</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tap the heart icon on any product to save it here!</p>
            </div>
          ) : (
            <div className="product-grid">
              {savedProducts.map(prod => (
                <div key={prod.id} className="product-card" onClick={() => onSelectProduct(prod)}>
                  <div className="product-img-wrapper">
                    <img src={prod.images[0]} alt={prod.title} className="product-img" />
                  </div>
                  <div className="product-info">
                    <div className="product-title">{prod.title}</div>
                    <div className="product-price">₹{prod.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SETTINGS SECTION */}
      {activeTab === 'settings' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '8px' }}>
          {/* Dark mode switch */}
          <div 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid var(--border-light)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', fontWeight: 700 }}>
              {isDarkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
              Dark Mode Appearance
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>{isDarkMode ? 'ON' : 'OFF'}</span>
          </div>

          <div 
            onClick={() => setShowVerifyModal(true)}
            style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid var(--border-light)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', fontWeight: 700 }}>
              <ShieldCheck size={18} color="#10b981" />
              Verified Seller Status
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>

          <div 
            onClick={() => alert('Community Guidelines: 1. Meet safely in public campus areas. 2. Price fairly. 3. No upfront advance wire transfers.')}
            style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid var(--border-light)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', fontWeight: 700 }}>
              <HelpCircle size={18} color="var(--primary)" />
              Help Center & Safety Rules
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>

          <div 
            onClick={onOpenAuth}
            style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', fontWeight: 700, color: '#dc2626', cursor: 'pointer' }}
          >
            <LogOut size={18} />
            Switch Account / Log Out
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="modal-overlay">
          <div className="bottom-sheet">
            <div className="sheet-handle"></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' }}>Apply for Verified Badge</h3>
            {verifySubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Documents Submitted!</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admin will review within 2 hours.</p>
                <button onClick={() => setShowVerifyModal(false)} className="btn-primary" style={{ marginTop: '14px' }}>Close</button>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Upload a photo of your Student ID or National ID card.
                </p>
                <div className="form-group">
                  <label className="form-label">College / Institution Name</label>
                  <input type="text" className="input-field" defaultValue="National Institute of Technology" />
                </div>
                <button onClick={() => setVerifySubmitted(true)} className="btn-primary" style={{ marginTop: '10px' }}>
                  Submit ID Document for Review
                </button>
                <button onClick={() => setShowVerifyModal(false)} className="btn-secondary" style={{ marginTop: '8px' }}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
