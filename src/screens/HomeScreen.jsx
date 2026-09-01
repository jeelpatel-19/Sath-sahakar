import React, { useState } from 'react';
import {
  Search, MapPin, PlusCircle, Heart, Tag, SlidersHorizontal, Grid, X
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function HomeScreen({
  products,
  onSelectProduct,
  onNavigateSell,
  onSelectCategory,
  searchQuery = '',
  setSearchQuery,
  onSelectSeller
}) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter products directly on Home Marketplace
  const activeProducts = (products || []).filter(p => {
    // Hide sold items from active marketplace
    if (p.status === 'sold' || (p.quantity !== undefined && p.quantity <= 0)) {
      return false;
    }

    // Filter by Category
    const matchesCat = activeCategory === 'all' ||
      p.category === activeCategory ||
      (activeCategory === 'રસોડાની વસ્તુઓ' && (p.category === 'રસોડાની વસ્તુઓ' || p.category === 'ઘરવપરાશની વસ્તુઓ'));

    // Filter by Search Query
    const q = localSearch.trim().toLowerCase();
    const matchesSearch = !q ||
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (setSearchQuery) setSearchQuery(localSearch);
  };

  return (
    <div className="desktop-container main-content" style={{ paddingTop: 28, paddingBottom: 60 }}>
      {/* ── 1. SEARCH SECTION ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #15803d 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 36px',
        marginBottom: 28,
        boxShadow: 'var(--shadow-sm)',
        color: '#ffffff'
      }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 900, fontFamily: 'var(--font-guj)', marginBottom: 8 }}>
          શું જોઈએ છે? (What are you looking for?)
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.9)', marginBottom: 20, fontFamily: 'var(--font-guj)' }}>
          Laptop, Perfume, ખુરશી, Phone, પુસ્તક — સ્થાનિક લોકો પાસેથી સીધી ખરીદી કરો.
        </p>

        <form onSubmit={handleSearchSubmit} className="big-search-bar" style={{ background: '#ffffff', borderRadius: 'var(--radius-full)', padding: '6px 10px 6px 20px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          <Search size={22} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <input
            id="home-search-input"
            type="text"
            className="big-search-input"
            placeholder="વસ્તુ શોધો... (ઉદા. Laptop, ખુરશી, Perfume)"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '1rem', fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => { setLocalSearch(''); if (setSearchQuery) setSearchQuery(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
            >
              <X size={18} />
            </button>
          )}
          <button
            type="submit"
            id="home-search-btn"
            className="big-search-btn"
            style={{
              background: 'var(--primary)', color: '#ffffff', border: 'none',
              padding: '10px 24px', borderRadius: 'var(--radius-full)',
              fontSize: '0.94rem', fontWeight: 800, fontFamily: 'var(--font-guj)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <Search size={16} /> શોધો
          </button>
        </form>
      </div>

      {/* ── 2. CATEGORY SELECTOR CHIPS ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}>
            શ્રેણી પસંદ કરો (Categories)
          </h2>
          {activeCategory !== 'all' && (
            <button
              onClick={() => setActiveCategory('all')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-guj)' }}
            >
              બધી શ્રેણીઓ જુઓ
            </button>
          )}
        </div>

        <div style={{
          display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6,
          scrollbarWidth: 'none', msOverflowStyle: 'none'
        }}>
          <button
            id="cat-chip-all"
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '10px 20px', borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-guj)', fontSize: '0.88rem', fontWeight: 800,
              cursor: 'pointer', transition: 'var(--transition)', flexShrink: 0,
              background: activeCategory === 'all' ? 'var(--primary)' : '#ffffff',
              color: activeCategory === 'all' ? '#ffffff' : 'var(--text-secondary)',
              border: activeCategory === 'all' ? 'none' : '1px solid var(--border-color)',
              boxShadow: activeCategory === 'all' ? '0 4px 14px rgba(22,163,74,0.3)' : 'var(--shadow-xs)'
            }}
          >
            બધી ({products.filter(p => p.status !== 'sold').length})
          </button>

          {CATEGORIES.map(cat => {
            const count = products.filter(p => p.status !== 'sold' && (p.category === cat.name || p.category === cat.nameEn || p.category === cat.id)).length;
            const isActive = activeCategory === cat.name;

            return (
              <button
                key={cat.id}
                id={`cat-chip-${cat.id}`}
                onClick={() => setActiveCategory(cat.name)}
                style={{
                  padding: '10px 18px', borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-guj)', fontSize: '0.88rem', fontWeight: 800,
                  cursor: 'pointer', transition: 'var(--transition)', flexShrink: 0,
                  background: isActive ? 'var(--primary)' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: isActive ? 'none' : '1px solid var(--border-color)',
                  boxShadow: isActive ? '0 4px 14px rgba(22,163,74,0.3)' : 'var(--shadow-xs)'
                }}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. MARKETPLACE PRODUCTS GRID ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderBottom: '2px solid var(--border-color)', paddingBottom: 12 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}>
            🛍️ વેચાણ માટેની વસ્તુઓ (Products for Sale)
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700, marginLeft: 10 }}>
              ({activeProducts.length} વસ્તુઓ)
            </span>
          </h2>

          <button
            onClick={onNavigateSell}
            id="btn-home-add-product"
            className="btn-sell-nav"
            style={{ padding: '8px 18px', fontSize: '0.86rem' }}
          >
            <PlusCircle size={16} /> વસ્તુ ઉમેરો
          </button>
        </div>

        {activeProducts.length === 0 ? (
          /* Empty Marketplace State */
          <div style={{
            textAlign: 'center', padding: '72px 24px',
            background: '#ffffff', borderRadius: 'var(--radius-lg)',
            border: '2px dashed rgba(22,163,74,0.2)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>🛍️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-guj)', marginBottom: 8 }}>
              કોઈ વસ્તુ મળી નથી
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-guj)', marginBottom: 24, maxWidth: 420, margin: '0 auto 24px auto' }}>
              {localSearch ? `"${localSearch}" માટે કોઈ પરિણામ નથી.` : 'અન્ય શ્રેણી પસંદ કરો અથવા પ્રથમ વસ્તુ ઉમેરો.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  style={{ padding: '10px 20px', border: '1px solid var(--border-color)', background: '#ffffff', borderRadius: 'var(--radius-full)', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-guj)' }}
                >
                  ક્લિયર શોધો
                </button>
              )}
              <button
                onClick={onNavigateSell}
                className="btn-hero-primary"
                style={{ padding: '10px 24px' }}
              >
                <PlusCircle size={18} /> પ્રથમ વસ્તુ ઉમેરો
              </button>
            </div>
          </div>
        ) : (
          /* Real Marketplace Grid */
          <div className="products-grid">
            {activeProducts.map(prod => (
              <ProductCard
                key={prod.id}
                prod={prod}
                onSelect={() => onSelectProduct(prod)}
                onSelectSeller={onSelectSeller}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Product Card Component ── */
function ProductCard({ prod, onSelect, onSelectSeller }) {
  const [saved, setSaved] = useState(false);

  const condClass = prod.condition === 'નવી' || prod.condition === 'નવું' ? 'new'
    : prod.condition === 'સારી સ્થિતિ' || prod.condition === 'સારી સ્થિતિમાં' ? 'good'
      : 'good';

  return (
    <div className="product-card" onClick={onSelect} id={`prod-card-${prod.id}`}>
      <div className="product-card-img-wrapper">
        <img
          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80'}
          alt={prod.title}
          className="product-card-img"
        />
        {prod.status === 'sold' && (
          <div className="product-card-badge badge-sold">વેચાઈ ગયું</div>
        )}
        <button
          className={`product-fav-btn ${saved ? 'saved' : ''}`}
          onClick={e => { e.stopPropagation(); setSaved(!saved); }}
          aria-label="Save product"
          title="સાચવો"
        >
          <Heart size={16} fill={saved ? '#ef4444' : 'none'} />
        </button>
      </div>
      <div className="product-card-body">
        <h3 className="product-card-title">{prod.title}</h3>
        <div className="product-card-price">
          ₹{Number(prod.price).toLocaleString('en-IN')}
        </div>
        <div className="product-card-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={11} style={{ flexShrink: 0 }} />
            {prod.location}
          </span>
          <span className={`condition-tag ${condClass}`}>{prod.condition}</span>
        </div>
        <div
          onClick={(e) => {
            if (onSelectSeller && (prod.sellerId || prod.seller_id)) {
              e.stopPropagation();
              onSelectSeller(prod.sellerId || prod.seller_id);
            }
          }}
          style={{
            fontSize: '0.75rem', color: 'var(--primary)', marginTop: 6,
            fontFamily: 'var(--font-guj)', fontWeight: 700, cursor: 'pointer',
            display: 'inline-block'
          }}
          title="વેચનાર પ્રોફાઇલ જુઓ"
        >
          વેચનાર: {prod.sellerName || 'સ્થાનિક વેચનાર'} 👤
        </div>
      </div>
    </div>
  );
}
