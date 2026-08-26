import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, MapPin, Phone, User, CheckCircle2, AlertCircle, Loader2, Package } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';

export default function CheckoutModal({ isOpen, onClose, product, currentUser, onOrderSuccess }) {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState('સ્થાનિક પિકઅપ');
  const [buyerName, setBuyerName] = useState(currentUser?.name || currentUser?.full_name || '');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(currentUser?.city || 'અમદાવાદ');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const unitPrice = Number(product.price);
  const totalAmount = unitPrice * quantity;
  const availableStock = product.quantity !== undefined ? product.quantity : 1;

  const handlePayNow = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (quantity > availableStock) {
      setErrorMessage(`માત્ર ${availableStock} સ્ટોક ઉપલબ્ધ છે.`);
      return;
    }

    if (!buyerName || !buyerPhone) {
      setErrorMessage('કૃપા કરીને તમારું નામ અને ફોન નંબર દાખલ કરો.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Process Payment via Razorpay SDK & Backend Verification
      const paymentResult = await paymentService.processPayment({
        amount: totalAmount,
        productTitle: product.title,
        buyerName,
        buyerEmail: currentUser?.email || 'buyer@sathsarkaar.com',
        buyerPhone,
        productId: product.id,
        buyerId: currentUser?.id
      });

      if (!paymentResult.verified) {
        throw new Error('ચુકવણી ચકાસણી નિષ્ફળ ગઈ.');
      }

      // 2. Create Order Record in Database
      const orderPayload = {
        buyerId: currentUser?.id || `usr-buyer-${Date.now()}`,
        sellerId: product.sellerId,
        productId: product.id,
        quantity,
        unitPrice,
        totalAmount,
        deliveryOption,
        buyerName,
        buyerPhone,
        shippingAddress,
        razorpayOrderId: paymentResult.razorpay_order_id,
        razorpayPaymentId: paymentResult.razorpay_payment_id,
        razorpaySignature: paymentResult.razorpay_signature
      };

      const { order, error: orderErr } = await orderService.createOrder(orderPayload);
      if (orderErr) throw new Error(orderErr);

      setConfirmedOrder(order);
      if (onOrderSuccess) onOrderSuccess(order);

    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'ચુકવણી પ્રક્રિયામાં સમસ્યા આવી.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget && !isProcessing) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: 520, padding: 28 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, background: 'var(--primary-light)',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
            }}>
              <CreditCard size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)', margin: 0 }}>
                ખરીદી અને ચુકવણી
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-guj)' }}>
                સુરક્ષિત Razorpay પેમેન્ટ સિસ્ટમ
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            style={{ background: 'var(--bg-secondary)', border: 'none', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {confirmedOrder ? (
          /* Confirmation State */
          <div style={{ textAlign: 'center', padding: '24px 10px' }}>
            <div style={{
              width: 72, height: 72, background: 'var(--primary-light)', color: 'var(--primary)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px auto', boxShadow: '0 0 0 8px rgba(22,163,74,0.12)'
            }}>
              <CheckCircle2 size={40} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)', marginBottom: 6 }}>
              ઓર્ડર સફળતાપૂર્વક અપાયો!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-guj)', marginBottom: 20 }}>
              ચુકવણી ચકાસવામાં આવી છે અને વેચનારને સૂચના મોકલવામાં આવી છે.
            </p>

            <div style={{
              background: 'var(--bg-page)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)', padding: 16, textAlign: 'left', marginBottom: 24,
              fontSize: '0.88rem', fontFamily: 'var(--font-guj)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>ઓર્ડર ID:</span>
                <strong>#{confirmedOrder.id ? confirmedOrder.id.slice(0, 8) : 'ORD-1024'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>વસ્તુ:</span>
                <strong>{product.title}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>કુલ ચુકવણી:</span>
                <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>₹{totalAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>સ્થિતિ:</span>
                <strong style={{ color: 'var(--primary)' }}>ચુકવણી સફળ (Paid)</strong>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-primary-lg"
              style={{ width: '100%', fontFamily: 'var(--font-guj)' }}
            >
              પૂર્ણ કરો
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            {errorMessage && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626',
                padding: '10px 14px', borderRadius: 8, fontSize: '0.86rem', fontWeight: 700,
                fontFamily: 'var(--font-guj)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Product Summary Card */}
            <div style={{
              display: 'flex', gap: 14, background: 'var(--bg-page)',
              border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
              padding: 14, marginBottom: 18
            }}>
              <img
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'}
                alt={product.title}
                style={{ width: 68, height: 68, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.96rem', fontWeight: 800, fontFamily: 'var(--font-guj)', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                  {product.title}
                </h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-guj)' }}>
                  વેચનાર: {product.sellerName || 'ગ્રાહક'} • 📍 {product.location}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)', marginTop: 4 }}>
                  ₹{unitPrice.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <form onSubmit={handlePayNow}>
              {/* Quantity Selector */}
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><Package size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> જથ્થો (Quantity)</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>સ્ટોક: {availableStock}</span>
                </label>
                <select
                  className="form-select"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  disabled={availableStock <= 0}
                >
                  {Array.from({ length: Math.min(availableStock, 5) }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} નંગ</option>
                  ))}
                </select>
              </div>

              {/* Delivery / Pickup Option */}
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label">ડિલિવરી / પિકઅપ વિકલ્પ</label>
                <select
                  className="form-select"
                  value={deliveryOption}
                  onChange={e => setDeliveryOption(e.target.value)}
                >
                  <option value="સ્થાનિક પિકઅપ">સ્થાનિક રૂબરૂ પિકઅપ (મફત)</option>
                  <option value="હોમ ડિલિવરી">સ્થાનિક કુરિયર / ડિલિવરી</option>
                </select>
              </div>

              {/* Buyer Contact Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">
                    <User size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> તમારું નામ *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={buyerName}
                    onChange={e => setBuyerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">
                    <Phone size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> મોબાઇલ નંબર *
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={buyerPhone}
                    onChange={e => setBuyerPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 18 }}>
                <label className="form-label">
                  <MapPin size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> પૂરું સરનામું / લેન્ડમાર્ક
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ઉદા. 402, શિવમ એપાર્ટમેન્ટ, સેટેલાઇટ, અમદાવાદ"
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                />
              </div>

              {/* Amount Breakdown */}
              <div style={{
                background: 'var(--primary-light)', border: '1px solid rgba(22,163,74,0.2)',
                borderRadius: 'var(--radius-sm)', padding: 14, marginBottom: 20
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-guj)' }}>
                  <span>એકમ કિંમત ({quantity} નંગ):</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 8, fontFamily: 'var(--font-guj)' }}>
                  <span>પ્લેટફોર્મ ચાર્જ:</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>₹0 (મફત)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary-dark)', fontFamily: 'var(--font-guj)', borderTop: '1px solid rgba(22,163,74,0.2)', paddingTop: 8 }}>
                  <span>કુલ ચૂકવવાની રકમ:</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isProcessing || availableStock <= 0}
                className="btn-primary-lg"
                style={{
                  width: '100%', padding: '14px', fontSize: '1.02rem',
                  fontWeight: 900, fontFamily: 'var(--font-guj)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>ચુકવણી પ્રક્રિયા ચાલુ છે...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>ચુકવણી કરો (₹{totalAmount.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-guj)' }}>
                <ShieldCheck size={14} color="var(--primary)" />
                <span>Razorpay સુરક્ષિત ૧૨૮-bit એન્ક્રિપ્ટેડ ચુકવણી</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
