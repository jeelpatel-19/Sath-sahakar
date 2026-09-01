import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Package, UserCheck, Star, Heart, Store } from 'lucide-react';
import { productService } from '../services/productService';

export default function SellerProfileScreen({
  sellerId,
  products,
  onSelectProduct,
  onBack,
  savedProductIds = [],
  onToggleSaveProduct
}) {
  const [sellerProfile, setSellerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active products for this seller (REAL count & list)
  const sellerActiveProducts = products.filter(
    p => (p.sellerId === sellerId || p.seller_id === sellerId) && p.status !== 'sold'
  );

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      setLoading(true);
      try {
        const { profile } = await productService.getSellerProfile(sellerId);
        if (isMounted && profile) {
          setSellerProfile(profile);
        }
      } catch (err) {
        console.error('Error fetching seller profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (sellerId) {
      loadProfile();
    } else {
      setLoading(false);
    }

    return () => { isMounted = false; };
  }, [sellerId]);

  // Fallback seller details from product data if profile is loading/not found
  const fallbackProduct = products.find(p => p.sellerId === sellerId || p.seller_id === sellerId);
  const displayName = sellerProfile?.full_name || sellerProfile?.name || fallbackProduct?.sellerName || 'સ્થાનિક વેચનાર';
  const displayLocation = sellerProfile?.city || sellerProfile?.area || fallbackProduct?.location || 'અમદાવાદ';
  const displayAvatar = sellerProfile?.avatar_url || sellerProfile?.avatar || fallbackProduct?.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="desktop-container main-content" style={{ paddingTop: 36, minHeight: '80vh' }}>
      {/* Back Button */}
      <button
        id="btn-seller-profile-back"
        onClick={onBack}
        style={{
          background: '#ffffff', padding: '9px 18px',
          borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.88rem',
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7,
          marginBottom: 24, boxShadow: 'var(--shadow-xs)', color: 'var(--text-secondary)',
          fontFamily: 'var(--font-guj)', border: '1px solid var(--border-color)',
          transition: 'var(--transition)'
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        <ArrowLeft size={16} /> પાછળ
      </button>

      {/* Seller Header Banner / Card */}
      <div style={{
        background: '#ffffff', border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)', padding: '28px 32px',
        boxShadow: 'var(--shadow-sm)', marginBottom: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img
            src={displayAvatar}
            alt={displayName}
            style={{
              width: 80, height: 80, borderRadius: '50%',
              objectFit: 'cover', border: '3px solid var(--primary-light)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)', margin: 0 }}>
                {displayName}
              </h1>
              <span style={{
                background: 'var(--primary-light)', color: 'var(--primary-dark)',
                padding: '3px 10px', borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-guj)',
                display: 'inline-flex', alignItems: 'center', gap: 4
              }}>
                <UserCheck size={13} /> ચકાસાયેલ વેચનાર
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.88rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-guj)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={14} color="var(--primary)" /> {displayLocation}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontWeight: 700 }}>
                <Star size={14} fill="currentColor" /> 4.9 રેટિંગ
              </span>
            </div>
          </div>
        </div>

        {/* Real Active Products Count Badge */}
        <div style={{
          background: 'var(--bg-page)', border: '1.5px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)', padding: '14px 24px',
          textAlign: 'center', minWidth: 180
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'var(--font-guj)', marginBottom: 2 }}>
            સક્રિય સ્ટોર
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-guj)' }}>
            વેચાણ માટેની વસ્તુઓ: {sellerActiveProducts.length}
          </div>
        </div>
      </div>

      {/* Seller Active Products Section */}
      <div>
        <div style={{ marginBottom: 20, borderBottom: '2px solid var(--border-color)', paddingBottom: 12 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Store size={20} color="var(--primary)" />
            {displayName} ની વેચાણ માટેની વસ્તુઓ ({sellerActiveProducts.length})
          </h2>
        </div>

        {sellerActiveProducts.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '64px 24px', background: '#ffffff',
            borderRadius: 'var(--radius-lg)', border: '2px dashed rgba(22,163,74,0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 14 }}>📦</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>
              આ વેચનાર પાસે હાલમાં કોઈ સક્રિય વસ્તુ નથી
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 8, fontFamily: 'var(--font-guj)' }}>
              પાછળ જાઓ અને અન્ય વેચનારની વસ્તુઓ જુઓ.
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {sellerActiveProducts.map(prod => {
              const isSaved = savedProductIds.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  className="product-card"
                  onClick={() => onSelectProduct(prod)}
                  id={`seller-prod-${prod.id}`}
                >
                  <div className="product-card-img-wrapper">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80'}
                      alt={prod.title}
                      className="product-card-img"
                    />
                    <button
                      className={`product-fav-btn ${isSaved ? 'saved' : ''}`}
                      onClick={e => {
                        e.stopPropagation();
                        if (onToggleSaveProduct) onToggleSaveProduct(prod.id);
                      }}
                      aria-label="Save product"
                    >
                      <Heart size={15} fill={isSaved ? '#ef4444' : 'none'} />
                    </button>
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-card-title">{prod.title}</h3>
                    <div className="product-card-price">₹{Number(prod.price).toLocaleString('en-IN')}</div>
                    <div className="product-card-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MapPin size={11} /> {prod.location}
                      </span>
                      <span className="condition-tag">{prod.condition}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
