import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, Heart, Clock, Tag } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function BrowseProductsScreen({ 
  products, 
  onSelectProduct, 
  savedProductIds, 
  onToggleSaveProduct,
  initialSearch = '' 
}) {
  const [query, setQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'low' | 'high'

  const filteredProducts = products.filter(p => {
    const matchesSearch = !query || 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase());

    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesCond = selectedCondition === 'all' || p.condition === selectedCondition;
    const matchesPrice = p.price <= maxPrice;

    return matchesSearch && matchesCat && matchesCond && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'low') return a.price - b.price;
    if (sortBy === 'high') return b.price - a.price;
    return b.id.localeCompare(a.id); // default newest
  });

  return (
    <div className="desktop-container main-content">
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Browse Local Products</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Discover affordable second-hand daily items directly from neighbors in your area.
        </p>
      </div>

      {/* 2-Column Desktop Filter & Feed Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Left Filter Sidebar */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={16} /> Filters
            </h3>
            <button 
              onClick={() => { setQuery(''); setSelectedCategory('all'); setSelectedCondition('all'); setMaxPrice(50000); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Reset All
            </button>
          </div>

          {/* Search Input */}
          <div className="form-group">
            <label className="form-label">Keyword Search</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Title or location..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
            />
          </div>

          {/* Category Filter */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Max Price</span>
              <strong style={{ color: 'var(--primary)' }}>Up to ₹{maxPrice}</strong>
            </label>
            <input 
              type="range" 
              min={100} 
              max={50000} 
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          {/* Condition Filter */}
          <div className="form-group">
            <label className="form-label">Condition</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['all', 'New', 'Like New', 'Good', 'Fair'].map(cond => (
                <label key={cond} style={{ fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="condFilter"
                    checked={selectedCondition === cond}
                    onChange={() => setSelectedCondition(cond)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  {cond === 'all' ? 'Any Condition' : cond}
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Sort By</label>
            <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest Listings First</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Right Products Feed Grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Showing {filteredProducts.length} items
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <Search size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No matching products</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Try adjusting your filter options or search terms.
              </p>
            </div>
          ) : (
            <div className="products-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 0 }}>
              {filteredProducts.map(prod => {
                const isSaved = savedProductIds.includes(prod.id);
                return (
                  <div key={prod.id} className="product-card" onClick={() => onSelectProduct(prod)}>
                    <div className="product-card-img-wrapper">
                      <img src={prod.images[0]} alt={prod.title} className="product-card-img" />
                      <button 
                        className={`product-fav-btn ${isSaved ? 'saved' : ''}`}
                        onClick={(e) => { e.stopPropagation(); onToggleSaveProduct(prod.id); }}
                      >
                        <Heart size={15} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="product-card-body">
                      <h3 className="product-card-title">{prod.title}</h3>
                      <div className="product-card-price">₹{prod.price}</div>
                      <div className="product-card-meta">
                        <span><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: '2px' }} /> {prod.location}</span>
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
    </div>
  );
}
