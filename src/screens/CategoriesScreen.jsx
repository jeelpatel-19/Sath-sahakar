import React, { useState } from 'react';
import {
  Tv, Armchair, BookOpen, Home, Utensils, Shirt,
  Grid, Tag, MapPin, Search, Heart, SlidersHorizontal, X
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

const ICON_MAP = { Tv, Armchair, BookOpen, Home, Utensils, Shirt };

export default function CategoriesScreen({ products, onSelectCategory, onSelectProduct }) {
  const [activeCat, setActiveCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const filteredProducts = products.filter(p => {
    const catMatch = activeCat === 'all' || p.category === activeCat;
    const searchMatch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const condMatch = selectedCondition === 'all' || p.condition === selectedCondition;
    const priceMinMatch = !priceMin || Number(p.price) >= Number(priceMin);
    const priceMaxMatch = !priceMax || Number(p.price) <= Number(priceMax);
    const locationMatch = selectedLocation === 'all' || p.location === selectedLocation;

    return catMatch && searchMatch && condMatch && priceMinMatch && priceMaxMatch && locationMatch;
  });

  const locations = [...new Set(products.map(p => p.location).filter(Boolean))];

  return (
    <div className="desktop-container main-content" style={{ paddingTop: 36 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.5px', fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}>
          🛍️ અમારી વસ્તુ
        </h1>
        <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-guj)' }}>
          સ્થાનિક લોકોએ વેચાણ માટે મૂકેલી નવી અને વપરાયેલી વસ્તુઓ
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28,
        padding: '16px 20px', background: '#ffffff',
        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <button
          id="cat-tab-all"
          onClick={() => setActiveCat('all')}
          style={{
            padding: '9px 18px', border: 'none', borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-guj)', fontSize: '0.88rem', fontWeight: 700,
            cursor: 'pointer', transition: 'var(--transition)',
            background: activeCat === 'all' ? 'var(--primary)' : 'var(--bg-secondary)',
            color: activeCat === 'all' ? '#ffffff' : 'var(--text-secondary)',
            boxShadow: activeCat === 'all' ? '0 4px 12px rgba(22,163,74,0.3)' : 'none'
          }}
        >
          <Grid size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
          બધી ({products.length})
        </button>

        {CATEGORIES.map(cat => {
          const count = products.filter(p => p.category === cat.name || p.category === cat.nameEn || p.category === cat.id).length;
          const isActive = activeCat === cat.name;
          const IconComp = ICON_MAP[cat.icon] || Tv;

          return (
            <button
              key={cat.id}
              id={`cat-tab-${cat.id}`}
              onClick={() => setActiveCat(cat.name)}
              style={{
                padding: '9px 16px', border: 'none', borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-guj)', fontSize: '0.88rem', fontWeight: 700,
                cursor: 'pointer', transition: 'var(--transition)',
                background: isActive ? 'var(--primary)' : 'var(--bg-secondary)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 4px 12px rgba(22,163,74,0.3)' : 'none',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <IconComp size={13} />
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      <div className="browse-layout">
        {/* Filter Panel */}
        <aside className="filter-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 7 }}>
              <SlidersHorizontal size={17} color="var(--primary)" /> ફિલ્ટર
            </h3>
            {(selectedCondition !== 'all' || priceMin || priceMax || selectedLocation !== 'all') && (
              <button
                onClick={() => { setSelectedCondition('all'); setPriceMin(''); setPriceMax(''); setSelectedLocation('all'); }}
                style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-guj)', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <X size={13} /> ક્લિયર
              </button>
            )}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="શોધો..."
              className="form-input"
              style={{ paddingLeft: 36, borderRadius: 'var(--radius-full)', fontSize: '0.85rem' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              id="browse-search"
            />
          </div>

          {/* Price Filter */}
          <div className="filter-section-title">કિંમત (₹)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
            <input
              type="number"
              className="form-input"
              placeholder="ઓછામાં ઓછી"
              value={priceMin}
              onChange={e => setPriceMin(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '9px 12px' }}
              id="filter-price-min"
            />
            <input
              type="number"
              className="form-input"
              placeholder="વધુ ને વધુ"
              value={priceMax}
              onChange={e => setPriceMax(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '9px 12px' }}
              id="filter-price-max"
            />
          </div>

          {/* Condition */}
          <div className="filter-section-title">સ્થિતિ</div>
          {[
            { value: 'all', label: 'બધી સ્થિતિ' },
            { value: 'નવી', label: 'નવી' },
            { value: 'લગભગ નવી', label: 'લગભગ નવી' },
            { value: 'સારી સ્થિતિ', label: 'સારી સ્થિતિ' },
            { value: 'સામાન્ય સ્થિતિ', label: 'સામાન્ય સ્થિતિ' }
          ].map(opt => (
            <label key={opt.value} className="filter-checkbox">
              <input
                type="radio"
                name="condition"
                value={opt.value}
                checked={selectedCondition === opt.value}
                onChange={() => setSelectedCondition(opt.value)}
                style={{ accentColor: 'var(--primary)' }}
              />
              {opt.label}
            </label>
          ))}

          {/* Location */}
          {locations.length > 0 && (
            <>
              <div className="filter-section-title">સ્થળ</div>
              <label className="filter-checkbox">
                <input type="radio" name="location" value="all" checked={selectedLocation === 'all'} onChange={() => setSelectedLocation('all')} style={{ accentColor: 'var(--primary)' }} />
                બધા સ્થળ
              </label>
              {locations.slice(0, 6).map(loc => (
                <label key={loc} className="filter-checkbox">
                  <input type="radio" name="location" value={loc} checked={selectedLocation === loc} onChange={() => setSelectedLocation(loc)} style={{ accentColor: 'var(--primary)' }} />
                  {loc}
                </label>
              ))}
            </>
          )}
        </aside>

        {/* Products Grid */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}>
              {activeCat === 'all' ? 'બધી વસ્તુઓ' : activeCat}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, marginLeft: 8 }}>
                ({filteredProducts.length} વસ્તુઓ)
              </span>
            </h2>
            <select
              className="form-select"
              style={{ width: 180, fontSize: '0.85rem' }}
              onChange={e => {}}
              id="sort-select"
            >
              <option>નવી-પ્રથમ</option>
              <option>ઓછી કિંમત</option>
              <option>વધુ કિંમત</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{
              padding: '64px 24px', background: '#ffffff',
              borderRadius: 'var(--radius-lg)', border: '2px dashed rgba(22,163,74,0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 14 }}>🔍</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>
                {activeCat === 'all' ? 'કોઈ વસ્તુ ઉપલબ્ધ નથી' : `${activeCat} માં કોઈ વસ્તુ નથી`}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 8, fontFamily: 'var(--font-guj)' }}>
                ફિલ્ટર બદલો અથવા અન્ય શ્રેણી જુઓ.
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(prod => (
                <BrowseProductCard key={prod.id} prod={prod} onSelect={() => onSelectProduct(prod)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BrowseProductCard({ prod, onSelect }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="product-card" onClick={onSelect} id={`browse-prod-${prod.id}`}>
      <div className="product-card-img-wrapper">
        <img
          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80'}
          alt={prod.title}
          className="product-card-img"
        />
        {prod.status === 'sold' && <div className="product-card-badge badge-sold">વેચાઈ ગયું</div>}
        <button
          className={`product-fav-btn ${saved ? 'saved' : ''}`}
          onClick={e => { e.stopPropagation(); setSaved(!saved); }}
          aria-label="Save"
          title="સાચવો"
        >
          <Heart size={15} fill={saved ? '#ef4444' : 'none'} />
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
}
