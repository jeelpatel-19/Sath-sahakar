import React, { useState } from 'react';
import { PlusCircle, CheckCircle2, X, UploadCloud, AlertCircle, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { productService } from '../services/productService';

export default function SellItemPage({ onPublishProduct, currentUser }) {
  // All inputs start EMPTY as required
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ઇલેક્ટ્રોનિક્સ');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('સારી સ્થિતિમાં');
  const [brand, setBrand] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState('સ્થાનિક રૂબરૂ / પિકઅપ');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [sellerName, setSellerName] = useState('');

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Phone number handler: digits only, max 10 digits
  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 10);
    setContactNumber(digitsOnly);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews(prev => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPresetPhoto = (url) => {
    setImagePreviews(prev => [...prev, url]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('કૃપા કરીને ઉત્પાદનનું નામ દાખલ કરો.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg('કૃપા કરીને યોગ્ય કિંમત દાખલ કરો.');
      return;
    }
    if (imagePreviews.length === 0) {
      setErrorMsg('કૃપા કરીને ઓછામાં ઓછો 1 ફોટો ઉમેરો.');
      return;
    }
    if (!sellerName.trim()) {
      setErrorMsg('કૃપા કરીને તમારું નામ દાખલ કરો.');
      return;
    }
    if (!contactNumber || contactNumber.length !== 10) {
      setErrorMsg('મોબાઇલ નંબર બરાબર 10 અંકનો હોવો જોઈએ.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('કૃપા કરીને સ્થળ / શહેર ઉમેરો.');
      return;
    }

    setIsPublishing(true);

    try {
      const productPayload = {
        sellerId: currentUser?.id || `usr-${Date.now()}`,
        title: title.trim(),
        category,
        description: description.trim() || 'કોઈ વર્ણન નથી.',
        price: Number(price),
        condition,
        brand: brand.trim(),
        location: location.trim(),
        city: location.trim(),
        quantity: Number(quantity || 1),
        sellerName: sellerName.trim(),
        contactNumber: contactNumber.trim(),
        phone_number: contactNumber.trim(),
        deliveryOption
      };

      const { product, error } = await productService.createProduct(productPayload, imageFiles);

      if (error) throw new Error(error);

      if (!product.images || product.images.length === 0) {
        product.images = imagePreviews;
      }

      setIsSuccess(true);
      setTimeout(() => {
        onPublishProduct(product);
      }, 1000);
    } catch (err) {
      console.error('Publish error:', err);
      setErrorMsg(err.message || 'વસ્તુ ઉમેરવામાં સમસ્યા આવી.');
    } finally {
      setIsPublishing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="desktop-container main-content" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{
          width: 80, height: 80,
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px auto',
          boxShadow: '0 8px 32px rgba(22,163,74,0.35)'
        }}>
          <CheckCircle2 size={48} color="#fff" />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 10, fontFamily: 'var(--font-guj)' }}>
          વસ્તુ સફળ રીતે ઉમેરાઈ!
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.65, fontFamily: 'var(--font-guj)' }}>
          તમારી વસ્તુ હવે "અમારી વસ્તુ" માં ઉપલબ્ધ છે.<br />
          ખરીદનારા ટૂંક સમયમાં કૉલ અથવા ચેટ કરશે.
        </p>
      </div>
    );
  }

  return (
    <div className="desktop-container main-content">
      {/* Page Header */}
      <div style={{ maxWidth: 780, margin: '0 auto 0 auto', paddingTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(22,163,74,0.3)'
          }}>
            <PlusCircle size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.4px', color: 'var(--text-primary)', fontFamily: 'var(--font-guj)' }}>
              વેચાણ કરો (Sell Product)
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2, fontFamily: 'var(--font-guj)' }}>
              તમારી વસ્તુની વિગતો ભરો અને સ્થાનિક ખરીદારો સાથે જોડાઓ.
            </p>
          </div>
        </div>
      </div>

      <div className="form-card">
        {errorMsg && (
          <div style={{
            background: '#fef2f2', border: '1.5px solid rgba(239,68,68,0.3)',
            color: '#dc2626', padding: '12px 18px', borderRadius: 'var(--radius-sm)',
            marginBottom: 22, fontSize: '0.9rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-guj)'
          }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Photos */}
          <div className="form-group">
            <label className="form-label">📷 ઉત્પાદનના ફોટા ઉમેરો *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 8 }}>
              {imagePreviews.map((img, idx) => (
                <div key={idx} style={{
                  position: 'relative', height: 120,
                  borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                  border: '1.5px solid var(--border-color)'
                }}>
                  <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
                      setImageFiles(imageFiles.filter((_, i) => i !== idx));
                    }}
                    style={{
                      position: 'absolute', top: 6, right: 6,
                      background: 'rgba(0,0,0,0.65)', color: '#fff',
                      border: 'none', width: 26, height: 26, borderRadius: '50%',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <label style={{
                height: 120, border: '2px dashed rgba(22,163,74,0.4)',
                borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)',
                color: 'var(--primary)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 6, transition: 'var(--transition)'
              }}>
                <UploadCloud size={28} />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>ફોટો ઉમેરો</span>
                <input type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Quick preset sample photos */}
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-guj)' }}>અથવા સેમ્પલ ફોટો પસંદ કરો:</span>
              <button
                type="button"
                id="btn-preset-img-1"
                onClick={() => handleAddPresetPhoto('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80')}
                style={{ fontSize: '0.73rem', background: '#f3f4f6', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font-guj)' }}
              >
                💻 લેપટોપ
              </button>
              <button
                type="button"
                id="btn-preset-img-2"
                onClick={() => handleAddPresetPhoto('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80')}
                style={{ fontSize: '0.73rem', background: '#f3f4f6', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font-guj)' }}
              >
                📱 મોબાઈલ
              </button>
              <button
                type="button"
                id="btn-preset-img-3"
                onClick={() => handleAddPresetPhoto('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80')}
                style={{ fontSize: '0.73rem', background: '#f3f4f6', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font-guj)' }}
              >
                🛋️ સોફા / ફર્નિચર
              </button>
            </div>
          </div>

          {/* Product Title */}
          <div className="form-group">
            <label className="form-label">ઉત્પાદનનું નામ *</label>
            <input
              type="text"
              className="form-input"
              placeholder="ઉદા. Study Table, Mixer Grinder, HP Laptop"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              id="sell-title"
            />
          </div>

          {/* Category & Brand Row */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">કેટેગરી *</label>
              <select
                className="form-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
                id="sell-category"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">બ્રાન્ડ (મરજિયાત)</label>
              <input
                type="text"
                className="form-input"
                placeholder="ઉદા. Samsung, Whirlpool"
                value={brand}
                onChange={e => setBrand(e.target.value)}
              />
            </div>
          </div>

          {/* Price & Quantity & Condition Row */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">કિંમત (₹) *</label>
              <input
                type="number"
                className="form-input"
                placeholder="ઉદા. 5000"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                min={1}
                id="sell-price"
              />
            </div>

            <div className="form-group">
              <label className="form-label">જથ્થો (સ્ટોક)</label>
              <input
                type="number"
                className="form-input"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                min={1}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ઉત્પાદનની સ્થિતિ *</label>
              <select
                className="form-select"
                value={condition}
                onChange={e => setCondition(e.target.value)}
                id="sell-condition"
              >
                <option value="નવું">નવું</option>
                <option value="સારી સ્થિતિમાં">સારી સ્થિતિમાં</option>
                <option value="સામાન્ય સ્થિતિમાં">સામાન્ય સ્થિતિમાં</option>
                <option value="વધુ ઉપયોગ થયેલ">વધુ ઉપયોગ થયેલ</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">વર્ણન</label>
            <textarea
              rows={4}
              className="form-textarea"
              placeholder="ઉત્પાદનની વિગતો, વાપરવાનો સમય, ખાસિયતો..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              id="sell-description"
            />
          </div>

          {/* Contact / Location */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 22, marginTop: 8 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 18, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-guj)' }}>
              📍 સ્થળ અને મોબાઇલ નંબરની વિગતો
            </h3>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">વેચનારનું નામ *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="તમારું પૂરું નામ"
                  value={sellerName}
                  onChange={e => setSellerName(e.target.value)}
                  required
                  id="sell-seller-name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">મોબાઇલ નંબર (૧૦ અંક) *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="૯૮૭૬૫૪૩૨૧૦"
                  value={contactNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  required
                  id="sell-phone"
                />
                {contactNumber && contactNumber.length !== 10 && (
                  <span style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: 4, display: 'block', fontFamily: 'var(--font-guj)' }}>
                    બરાબર ૧૦ અંક હોવા જોઈએ (હમણાં: {contactNumber.length})
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">સ્થળ / શહેર *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ઉદા. સેટેલાઇટ, અમદાવાદ"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                  id="sell-location"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPublishing}
            className="btn-primary-lg"
            style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-guj)' }}
            id="btn-publish"
          >
            {isPublishing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>વસ્તુ પ્રકાશિત થઈ રહી છે...</span>
              </>
            ) : (
              <>
                <PlusCircle size={20} /> વસ્તુ પ્રકાશિત કરો
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
