import React, { useState } from 'react';
import {
  ArrowLeft, Heart, Share2, MapPin, Tag, PhoneCall,
  UserCheck, Clock, Check, X, MessageSquare, Star, AlertCircle, ShoppingBag
} from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';

export default function ProductDetailScreen({
  product,
  onBack,
  isSaved,
  onToggleSave,
  onStartChat,
  currentUser,
  onOrderSuccess,
  onSelectSeller
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!product) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const isSold = product.status === 'sold' || (product.quantity !== undefined && product.quantity <= 0);

  return (
    <div className="desktop-container main-content" style={{ paddingTop: 36 }}>
      {/* Back Button */}
      <button
        id="btn-product-back"
        onClick={onBack}
        style={{
          background: '#ffffff', padding: '9px 18px',
          borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.88rem',
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7,
          marginBottom: 28, boxShadow: 'var(--shadow-xs)', color: 'var(--text-secondary)',
          fontFamily: 'var(--font-guj)', border: '1px solid var(--border-color)',
          transition: 'var(--transition)'
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
      >
        <ArrowLeft size={16} /> પાછળ
      </button>

      {/* 2-Column Responsive Layout */}
      <div className="product-detail-grid">

        {/* Left: Gallery + Description */}
        <div>
          {/* Main Image */}
          <div style={{
            width: '100%', height: 440, background: '#f9fafb',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            border: '1px solid var(--border-color)', marginBottom: 14,
            boxShadow: 'var(--shadow-sm)', position: 'relative'
          }}>
            <img
              src={product.images?.[activeImageIndex] || product.images?.[0]}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {isSold && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{
                  background: 'rgba(239,68,68,0.95)', color: '#fff',
                  fontSize: '1.4rem', fontWeight: 900, padding: '12px 32px',
                  borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-guj)',
                  transform: 'rotate(-5deg)'
                }}>
                  વેચાઈ ગયું
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  id={`thumb-${idx}`}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: 76, height: 76, borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                    border: activeImageIndex === idx ? '2.5px solid var(--primary)' : '1px solid var(--border-color)',
                    cursor: 'pointer', transition: 'var(--transition)',
                    boxShadow: activeImageIndex === idx ? '0 0 0 3px var(--primary-ring)' : 'none'
                  }}
                >
                  <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Description Box */}
          <div style={{
            background: '#ffffff', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)', padding: 26, boxShadow: 'var(--shadow-xs)'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}>
              📋 વર્ણન
            </h2>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.75, whiteSpace: 'pre-line', fontFamily: 'var(--font-guj)' }}>
              {product.description}
            </p>
          </div>
        </div>

        {/* Right: Details + Seller + Actions */}
        <div style={{
          background: '#ffffff', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)', padding: 30, boxShadow: 'var(--shadow-sm)',
          position: 'sticky', top: 88
        }}>
          {/* Category Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)',
            background: 'var(--primary-light)', padding: '5px 14px',
            borderRadius: 'var(--radius-full)', marginBottom: 14, fontFamily: 'var(--font-guj)'
          }}>
            <Tag size={12} /> {product.category}
          </div>

          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span></span>
            <span className={isSold ? 'tag-sold' : 'tag-available'}>
              {isSold ? 'વેચાઈ ગયું' : 'ઉપલબ્ધ'}
            </span>
          </div>

          {/* Product Title */}
          <h1 style={{
            fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)',
            lineHeight: 1.25, marginBottom: 14, fontFamily: 'var(--font-guj)'
          }}>
            {product.title}
          </h1>

          {/* Price */}
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: '2.2rem', fontWeight: 900,
            color: 'var(--primary)', marginBottom: 20, letterSpacing: '-0.5px'
          }}>
            ₹{Number(product.price).toLocaleString('en-IN')}
          </div>

          {/* Specs */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            background: 'var(--bg-page)', padding: 16,
            borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: 22
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600, marginBottom: 2, fontFamily: 'var(--font-guj)' }}>સ્થિતિ</span>
              <strong style={{ fontSize: '0.92rem', fontFamily: 'var(--font-guj)', color: 'var(--primary)' }}>{product.condition}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600, marginBottom: 2, fontFamily: 'var(--font-guj)' }}>સ્થળ</span>
              <strong style={{ fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-guj)' }}>
                <MapPin size={13} color="var(--primary)" /> {product.location}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600, marginBottom: 2, fontFamily: 'var(--font-guj)' }}>ઉમેર્યું</span>
              <strong style={{ fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-guj)' }}>
                <Clock size={13} /> {product.postedDate || 'આજે'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600, marginBottom: 2, fontFamily: 'var(--font-guj)' }}>ચૂકવણી</span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--accent)', fontFamily: 'var(--font-guj)' }}>Razorpay / સ્થાનિક</strong>
            </div>
          </div>

          {/* Seller Box */}
          <div
            id="seller-info-box"
            onClick={() => {
              if (onSelectSeller && (product.sellerId || product.seller_id)) {
                onSelectSeller(product.sellerId || product.seller_id);
              }
            }}
            style={{
              background: 'var(--bg-page)', border: '1.5px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 22,
              cursor: 'pointer', transition: 'var(--transition)'
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', fontFamily: 'var(--font-guj)' }}>
                વેચનારની માહિતી
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>
                પ્રોફાઇલ / સ્ટોર જુઓ →
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-guj)' }}>
                <UserCheck size={18} color="var(--primary)" />
                {product.sellerName || 'સ્થાનિક ગ્રાહક'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#f59e0b', fontWeight: 800, fontSize: '0.85rem' }}>
                <Star size={14} fill="currentColor" /> 4.9
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-guj)' }}>
              📍 {product.location}
            </div>
          </div>

          {/* CTA Buttons */}
          {!isSold ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Buy Now / Want Item Primary CTA */}
              <button
                id="btn-buy-now"
                onClick={() => setShowCheckoutModal(true)}
                className="btn-primary-lg"
                style={{
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)'
                }}
              >
                <ShoppingBag size={19} /> આ વસ્તુ જોઈએ છે
              </button>

              {/* Chat Seller */}
              <button
                id="btn-message-seller"
                onClick={() => onStartChat(product)}
                style={{
                  width: '100%', padding: '13px 24px',
                  background: '#ffffff', color: 'var(--primary)',
                  border: '1.5px solid var(--primary)', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.96rem', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                  fontFamily: 'var(--font-guj)', transition: 'var(--transition)'
                }}
              >
                <MessageSquare size={18} /> વેચનાર સાથે ચેટ કરો
              </button>

              {/* Call Seller */}
              <a
                href={`tel:${product.contactNumber || product.phone_number || product.phone || ''}`}
                id="btn-call-seller"
                style={{
                  width: '100%', padding: '13px 24px',
                  background: 'var(--primary-light)', color: 'var(--primary)',
                  border: '1.5px solid rgba(22,163,74,0.3)', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.96rem', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                  fontFamily: 'var(--font-guj)', transition: 'var(--transition)', textDecoration: 'none'
                }}
              >
                <PhoneCall size={18} /> વેચનારને કૉલ કરો
              </a>

              {/* Save & Share */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button
                  id="btn-save-product"
                  onClick={() => onToggleSave(product.id)}
                  style={{
                    padding: 12, border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontFamily: 'var(--font-guj)', transition: 'var(--transition)',
                    background: isSaved ? 'rgba(239,68,68,0.08)' : '#ffffff',
                    color: isSaved ? '#dc2626' : 'var(--text-primary)',
                    borderColor: isSaved ? 'rgba(239,68,68,0.3)' : 'var(--border-color)'
                  }}
                >
                  <Heart size={16} fill={isSaved ? '#dc2626' : 'none'} />
                  {isSaved ? 'સાચવ્યું' : 'સાચવો'}
                </button>

                <button
                  id="btn-share-product"
                  onClick={handleShare}
                  style={{
                    padding: 12, border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontFamily: 'var(--font-guj)', transition: 'var(--transition)',
                    background: '#ffffff', color: copiedShare ? 'var(--primary)' : 'var(--text-primary)'
                  }}
                >
                  {copiedShare ? <Check size={16} color="var(--primary)" /> : <Share2 size={16} />}
                  {copiedShare ? 'કૉપી!' : 'શેર કરો'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              background: '#fef2f2', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius-sm)', padding: 16, textAlign: 'center',
              fontFamily: 'var(--font-guj)', color: '#dc2626', fontWeight: 700
            }}>
              ⚠️ આ વસ્તુ વેચાઈ ગઈ છે
            </div>
          )}
        </div>
      </div>

      {/* Call Modal */}
      {showContactModal && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setShowContactModal(false); }}>
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>
                📞 વેચનારને કૉલ કરો
              </h3>
              <button
                id="btn-close-call-modal"
                onClick={() => setShowContactModal(false)}
                style={{ background: 'var(--bg-secondary)', border: 'none', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={17} />
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '12px 0 20px 0' }}>
              <div style={{
                width: 64, height: 64, background: 'var(--primary-light)', color: 'var(--primary)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px auto', boxShadow: '0 0 0 8px rgba(22,163,74,0.12)'
              }}>
                <PhoneCall size={30} />
              </div>

              <div style={{
                fontFamily: 'var(--font-sans)', fontSize: '1.6rem', fontWeight: 900,
                color: 'var(--primary)', letterSpacing: '0.5px'
              }}>
                {product.contactNumber || product.phone_number}
              </div>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '8px 0 16px 0', fontFamily: 'var(--font-guj)' }}>
                વેચનાર: <strong>{product.sellerName || 'ગ્રાહક'}</strong> • {product.location}
              </p>

              <div style={{
                background: 'var(--primary-light)', border: '1px solid rgba(22,163,74,0.2)',
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem', color: 'var(--primary-dark)', marginBottom: 20,
                display: 'flex', alignItems: 'flex-start', gap: 8, textAlign: 'left',
                fontFamily: 'var(--font-guj)'
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                જો કૉલ ન ઉઠે, તો ચેટ બટન વડે વાત કરો.
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <a
                  href={`tel:${product.contactNumber || product.phone_number}`}
                  id="link-call-now"
                  className="btn-primary-lg"
                  style={{ textDecoration: 'none', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <PhoneCall size={18} /> વેચનારને કૉલ કરો
                </a>
                <button
                  id="btn-switch-to-chat"
                  onClick={() => { setShowContactModal(false); onStartChat(product); }}
                  style={{
                    flex: 1, padding: '13px 16px', border: '1.5px solid rgba(22,163,74,0.3)',
                    background: 'var(--primary-light)', color: 'var(--primary)',
                    borderRadius: 'var(--radius-sm)', fontWeight: 800, cursor: 'pointer',
                    fontFamily: 'var(--font-guj)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  <MessageSquare size={16} /> ચેટ કરો
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        product={product}
        currentUser={currentUser}
        onOrderSuccess={(order) => {
          if (onOrderSuccess) onOrderSuccess(order);
        }}
      />
    </div>
  );
}
