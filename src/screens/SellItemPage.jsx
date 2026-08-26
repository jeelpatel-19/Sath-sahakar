import React, { useState } from 'react';
import { Camera, PlusCircle, CheckCircle2, X, UploadCloud, AlertCircle, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { productService } from '../services/productService';

export default function SellItemPage({ onPublishProduct, currentUser }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ઇલેક્ટ્રોનિક્સ');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('સારી સ્થિતિ');
  const [brand, setBrand] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState('સ્થાનિક રૂબરૂ / પિકઅપ');
  const [location, setLocation] = useState(currentUser ? (currentUser.city || currentUser.location) : 'અમદાવાદ');
  const [contactNumber, setContactNumber] = useState(currentUser ? currentUser.phone : '+91 98765 43210');
  const [sellerName, setSellerName] = useState(currentUser ? (currentUser.name || currentUser.full_name) : 'ગ્રાહક');

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    if (!title.trim() || !price || imagePreviews.length === 0) {
      setErrorMsg('કૃપા કરી ઓછામાં ઓછો 1 ફોટો, વસ્તુનું નામ, અને કિંમત ઉમેરો.');
      return;
    }
    setErrorMsg('');
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
        location: location.trim() || 'ગુજરાત',
        city: location.trim() || 'અમદાવાદ',
        quantity: Number(quantity || 1),
        sellerName: sellerName.trim() || 'ગ્રાહક',
        contactNumber: contactNumber.trim() || '+91 98765 43210',
        phone_number: contactNumber.trim() || '+91 98765 43210',
        deliveryOption
      };

      const { product, error } = await productService.createProduct(productPayload, imageFiles);

      if (error) throw new Error(error);

      // Add fallback previews if images returned are empty
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
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 10 }}>
          વસ્તુ સફળ રીતે ઉમેરાઈ!
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.65 }}>
          તમારી વસ્તુ હવે marketplace માં ઉપલબ્ધ છે.<br />
          ખરીદનારા ટૂંક સમયમાં સંપર્ક કરશે.
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
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.4px', color: 'var(--text-primary)' }}>
              તમારી વસ્તુ વેચો
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              ફોર્મ ભરો અને સ્થાનિક ખરીદારો સુધી પહોંચો.
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
            display: 'flex', alignItems: 'center', gap: 9
          }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Photos */}
          <div className="form-group">
            <label className="form-label">📷 વસ્તુના ફોટા ઉમેરો *</label>
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
              }}
                onMouseOver={e => { e.currentTarget.style.background = '#bbf7d0'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'var(--primary-light)'; }}
              >
                <UploadCloud size={28} />
                <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>ફોટો ઉમેરો</span>
                <input type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Sample photos */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>નમૂના ફોટો:</span>
              {[
                { label: '+ Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80' },
                { label: '+ Sofa', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80' },
                { label: '+ Books', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' },
                { label: '+ Kitchen', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=80' },
                { label: '+ Clothes', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80' },
              ].map(s => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => handleAddPresetPhoto(s.url)}
                  style={{
                    fontSize: '0.75rem', padding: '5px 10px',
                    border: '1px solid var(--border-color)', background: '#fff',
                    borderRadius: 6, cursor: 'pointer', fontWeight: 600,
                    transition: 'var(--transition)', color: 'var(--text-secondary)'
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Title */}
          <div className="form-group">
            <label className="form-label">વસ્તુનું નામ *</label>
            <input
              type="text"
              className="form-input"
              placeholder="ઉદા. HP Pavilion Laptop, Wooden Study Desk"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              id="sell-title"
            />
          </div>

          {/* Category & Brand Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">શ્રેણી પસંદ કરો *</label>
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
                placeholder="ઉદા. HP, Samsung, Ikea"
                value={brand}
                onChange={e => setBrand(e.target.value)}
              />
            </div>
          </div>

          {/* Price & Quantity & Condition Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">કિંમત (₹) *</label>
              <input
                type="number"
                className="form-input"
                placeholder="ઉદા. 15000"
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
              <label className="form-label">વસ્તુની સ્થિતિ *</label>
              <select
                className="form-select"
                value={condition}
                onChange={e => setCondition(e.target.value)}
                id="sell-condition"
              >
                <option value="નવી">નવી</option>
                <option value="લગભગ નવી">લગભગ નવી</option>
                <option value="સારી સ્થિતિ">સારી સ્થિતિ</option>
                <option value="સામાન્ય સ્થિતિ">સામાન્ય સ્થિતિ</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">વર્ણન</label>
            <textarea
              rows={4}
              className="form-textarea"
              placeholder="વસ્તુની ઉંમર, ખાસ વિગતો, ઉપયોગ, ફીચર્સ..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              id="sell-description"
            />
          </div>

          {/* Contact / Location */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 22, marginTop: 8 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 18, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              📍 સ્થળ અને સંપર્ક
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">વેચનારનું નામ *</label>
                <input
                  type="text"
                  className="form-input"
                  value={sellerName}
                  onChange={e => setSellerName(e.target.value)}
                  required
                  id="sell-seller-name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">મોબાઇલ નંબર *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  required
                  id="sell-phone"
                />
              </div>

              <div className="form-group">
                <label className="form-label">સ્થળ / શહેર *</label>
                <select
                  className="form-select"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  id="sell-location"
                >
                  {['અમદાવાદ', 'સુરત', 'વડોદરા', 'રાજકોટ', 'ભાવનગર', 'જામનગર', 'ગાંધીનગર', 'આણંદ', 'મહેસાણા', 'નડિયાદ'].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPublishing}
            className="btn-primary-lg"
            style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
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
