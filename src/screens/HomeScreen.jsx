import React, { useState } from 'react';
import {
  Search, MapPin, PlusCircle, ArrowRight, Sparkles,
  Tv, Armchair, BookOpen, Home, Utensils, Shirt,
  Clock, Heart, ShieldCheck, Zap, Users, TrendingUp, ChevronRight
} from 'lucide-react';
import { CATEGORIES, GUJARAT_CITIES } from '../data/mockData';

const ICON_MAP = { Tv, Armchair, BookOpen, Home, Utensils, Shirt };

/* ─────────────────────────────────────────
   Inline SVG illustration: marketplace scene
   People exchanging laptop, books, chair, etc.
───────────────────────────────────────── */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Marketplace illustration">
      {/* Background circle */}
      <circle cx="260" cy="210" r="190" fill="#bbf7d0" opacity="0.4" />
      <circle cx="260" cy="210" r="140" fill="#dcfce7" opacity="0.5" />

      {/* Ground */}
      <ellipse cx="260" cy="370" rx="220" ry="22" fill="#a7f3d0" opacity="0.5" />

      {/* Left person — seller */}
      {/* Body */}
      <rect x="80" y="200" width="50" height="90" rx="14" fill="#4ade80" />
      {/* Head */}
      <circle cx="105" cy="185" r="26" fill="#fbbf24" />
      {/* Eyes */}
      <circle cx="97" cy="183" r="3" fill="#1f2937" />
      <circle cx="113" cy="183" r="3" fill="#1f2937" />
      {/* Smile */}
      <path d="M97 193 Q105 200 113 193" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Hair */}
      <path d="M82 178 Q90 158 120 165 Q130 170 128 183" fill="#1f2937" opacity="0.8" />
      {/* Arms */}
      <rect x="130" y="210" width="42" height="14" rx="7" fill="#4ade80" />
      <rect x="38" y="210" width="42" height="14" rx="7" fill="#4ade80" />
      {/* Legs */}
      <rect x="85" y="285" width="18" height="50" rx="8" fill="#16a34a" />
      <rect x="107" y="285" width="18" height="50" rx="8" fill="#16a34a" />
      {/* Shoes */}
      <ellipse cx="94" cy="337" rx="14" ry="7" fill="#1f2937" />
      <ellipse cx="116" cy="337" rx="14" ry="7" fill="#1f2937" />

      {/* Right person — buyer */}
      {/* Body */}
      <rect x="390" y="200" width="50" height="90" rx="14" fill="#fb923c" />
      {/* Head */}
      <circle cx="415" cy="185" r="26" fill="#fde68a" />
      {/* Eyes */}
      <circle cx="407" cy="183" r="3" fill="#1f2937" />
      <circle cx="423" cy="183" r="3" fill="#1f2937" />
      {/* Smile */}
      <path d="M407 193 Q415 200 423 193" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Hair */}
      <path d="M395 175 Q415 155 435 168 Q440 173 438 185" fill="#7c3aed" opacity="0.8" />
      {/* Arms */}
      <rect x="340" y="210" width="50" height="14" rx="7" fill="#fb923c" />
      <rect x="440" y="210" width="42" height="14" rx="7" fill="#fb923c" />
      {/* Legs */}
      <rect x="395" y="285" width="18" height="50" rx="8" fill="#ea580c" />
      <rect x="417" y="285" width="18" height="50" rx="8" fill="#ea580c" />
      {/* Shoes */}
      <ellipse cx="404" cy="337" rx="14" ry="7" fill="#1f2937" />
      <ellipse cx="426" cy="337" rx="14" ry="7" fill="#1f2937" />

      {/* CENTER TABLE */}
      <rect x="198" y="260" width="124" height="14" rx="7" fill="#a7f3d0" />
      <rect x="208" y="270" width="14" height="55" rx="6" fill="#6ee7b7" />
      <rect x="298" y="270" width="14" height="55" rx="6" fill="#6ee7b7" />

      {/* LAPTOP on table */}
      <rect x="215" y="230" width="70" height="44" rx="6" fill="#1f2937" />
      <rect x="218" y="233" width="64" height="38" rx="4" fill="#3b82f6" opacity="0.8" />
      <rect x="222" y="237" width="56" height="30" rx="2" fill="#1d4ed8" opacity="0.5" />
      {/* Screen glow lines */}
      <rect x="226" y="241" width="32" height="3" rx="1" fill="#93c5fd" opacity="0.8" />
      <rect x="226" y="247" width="24" height="3" rx="1" fill="#93c5fd" opacity="0.6" />
      <rect x="226" y="253" width="28" height="3" rx="1" fill="#93c5fd" opacity="0.4" />
      {/* Laptop base */}
      <rect x="207" y="272" width="86" height="6" rx="3" fill="#374151" />

      {/* BOOKS floating */}
      <rect x="152" y="130" width="52" height="68" rx="6" fill="#ef4444" />
      <rect x="157" y="134" width="42" height="58" rx="4" fill="#fca5a5" />
      <rect x="162" y="138" width="32" height="4" rx="2" fill="#ef4444" />
      <rect x="162" y="145" width="26" height="3" rx="1" fill="#ef4444" opacity="0.5" />
      <rect x="162" y="151" width="29" height="3" rx="1" fill="#ef4444" opacity="0.4" />

      {/* CHAIR floating right */}
      <rect x="332" y="130" width="56" height="8" rx="4" fill="#a78bfa" />
      <rect x="347" y="136" width="8" height="50" rx="3" fill="#7c3aed" />
      <rect x="367" y="136" width="8" height="50" rx="3" fill="#7c3aed" />
      <rect x="336" y="164" width="54" height="30" rx="6" fill="#c4b5fd" />
      <rect x="337" y="135" width="10" height="40" rx="3" fill="#5b21b6" />
      <rect x="375" y="135" width="10" height="40" rx="3" fill="#5b21b6" />

      {/* MIXING BOWL / KITCHEN ITEM */}
      <ellipse cx="260" cy="145" rx="30" ry="16" fill="#fcd34d" />
      <path d="M230 145 Q260 175 290 145" fill="#fbbf24" />
      <ellipse cx="260" cy="145" rx="26" ry="12" fill="#fef3c7" />
      <rect x="253" y="118" width="14" height="28" rx="4" fill="#f59e0b" />

      {/* SHIRT floating */}
      <path d="M440 80 L450 90 L462 82 L472 90 L468 82 L480 82 L480 130 L440 130 Z" fill="#34d399" />
      <path d="M450 90 Q460 100 472 90" fill="#059669" />

      {/* Arrows between people showing exchange */}
      <path d="M170 225 Q215 215 245 222" stroke="#16a34a" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" markerEnd="url(#arrow)" opacity="0.6" />
      <path d="M370 222 Q340 212 285 220" stroke="#f97316" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" opacity="0.6" />

      {/* Stars / sparkles */}
      <circle cx="160" cy="260" r="4" fill="#fbbf24" />
      <circle cx="156" cy="254" r="2" fill="#fbbf24" opacity="0.6" />
      <circle cx="165" cy="256" r="2" fill="#fbbf24" opacity="0.6" />

      <circle cx="360" cy="100" r="4" fill="#f97316" />
      <circle cx="354" cy="94" r="2" fill="#f97316" opacity="0.6" />
      <circle cx="365" cy="97" r="2" fill="#f97316" opacity="0.6" />

      {/* Heart */}
      <path d="M258 98 C258 94 262 90 267 90 C272 90 275 94 275 98 C275 106 267 113 267 113 C267 113 258 106 258 98Z" fill="#ef4444" opacity="0.7" transform="scale(0.8) translate(60, 10)" />

      {/* Floating price tag */}
      <rect x="305" y="285" width="80" height="36" rx="10" fill="#ffffff" filter="url(#shadow)" stroke="#e5e7eb" strokeWidth="1" />
      <text x="318" y="303" fontSize="10" fontWeight="700" fill="#16a34a" fontFamily="Inter, sans-serif">₹18,000</text>
      <text x="318" y="315" fontSize="8" fill="#9ca3af" fontFamily="Inter, sans-serif">HP Laptop</text>

      <rect x="132" y="285" width="68" height="36" rx="10" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
      <text x="144" y="303" fontSize="10" fontWeight="700" fill="#f97316" fontFamily="Inter, sans-serif">₹250</text>
      <text x="144" y="315" fontSize="8" fill="#9ca3af" fontFamily="Inter, sans-serif">પુસ્તક</text>

      {/* Shadow filter */}
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.1" />
        </filter>
      </defs>
    </svg>
  );
}

export default function HomeScreen({
  products,
  onSelectProduct,
  onNavigateSell,
  onSelectCategory,
  searchQuery,
  setSearchQuery
}) {
  const [localSearch, setLocalSearch] = useState('');

  const handleSearch = () => {
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      onSelectCategory('all');
    }
  };

  // Recent products from DB
  const recentProducts = [...products]
    .filter(p => p.status !== 'sold')
    .slice(0, 8);

  return (
    <div style={{ flex: 1 }}>

      {/* ── HERO SECTION ── */}
      <section className="hero-section">
        <div className="hero-inner">
          {/* Left Content */}
          <div className="hero-content fade-in-up">
            <div className="hero-badge">
              <Sparkles size={14} />
              ગુજરાતની સ્થાનિક માર્કેટ
            </div>

            <h1 className="hero-h1">
              વસ્તુઓ આપો,{' '}
              <span className="highlight">સહકારથી</span>
              <br />
              આગળ વધો.
            </h1>

            <p className="hero-sub">
              તમારી પાસે ઉપયોગી વસ્તુ છે?
              <br />
              તે કોઈની જરૂરિયાત બની શકે છે. સીધો કૉલ, ઝડપી ડીલ.
            </p>

            <div className="hero-cta-group">
              <button
                id="btn-hero-sell"
                className="btn-hero-primary"
                onClick={onNavigateSell}
              >
                <PlusCircle size={20} />
                વેચાણ કરો
              </button>
              <button
                id="btn-hero-browse"
                className="btn-hero-secondary"
                onClick={() => onSelectCategory('all')}
              >
                <Search size={18} />
                અમારી વસ્તુ
              </button>
            </div>

            {/* Quick trust line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 32 }}>
              {[
                { icon: '✅', text: 'મફત ઉમેરો' },
                { icon: '📞', text: 'સીધો કૉલ' },
                { icon: '🔒', text: 'સ્થાનિક લોકો' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <span>{item.icon}</span>{item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hero-illustration">
            <HeroIllustration />
          </div>
        </div>

        {/* Wave bottom */}
        <div style={{ lineHeight: 0, marginTop: 16 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60 }} fill="white">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── BENEFITS BAR ── */}
      <section className="benefits-bar">
        <div className="desktop-container">
          <div className="benefits-grid">
            {[
              {
                icon: '🆓',
                bg: '#dcfce7',
                title: 'સરળ અને મફત',
                desc: 'વસ્તુ ઉમેરવી સરળ છે, કોઈ ચાર્જ નહીં.'
              },
              {
                icon: '🛡️',
                bg: '#dbeafe',
                title: 'વિશ્વાસ અને સુરક્ષા',
                desc: 'સ્થાનિક લોકો સાથે સીધી વાત.'
              },
              {
                icon: '⚡',
                bg: '#fff7ed',
                title: 'ઝડપી કૉલ',
                desc: 'કૉલ અથવા સંદેશ દ્વારા વાત કરો.'
              },
              {
                icon: '📍',
                bg: '#f5f3ff',
                title: 'સ્થાનિક સહકાર',
                desc: 'તમારી નજીકની વસ્તુઓ શોધો.'
              }
            ].map((b, i) => (
              <div key={i} className="benefit-card">
                <div className="benefit-icon" style={{ background: b.bg }}>
                  <span style={{ fontSize: '1.4rem' }}>{b.icon}</span>
                </div>
                <div>
                  <div className="benefit-title">{b.title}</div>
                  <div className="benefit-desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="stats-section">
        <div className="desktop-container">
          <div className="stats-grid">
            {[
              { number: '10,000+', label: 'વસ્તુઓ ઉપલબ્ધ' },
              { number: '5,000+', label: 'સક્રિય સભ્યો' },
              { number: '2,500+', label: 'વસ્તુઓ વેચાઈ' },
              { number: '8,000+', label: 'સફળ ડીલ' }
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <span className="stat-number">{s.number}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES SECTION ── */}
      <section className="section-pad" style={{ background: '#fff' }}>
        <div className="desktop-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">અમારી મુખ્ય શ્રેણીઓ</h2>
              <p className="section-subtitle">6 શ્રેણીઓ — રોજ જીવનની ઉપયોગી વસ્તુઓ</p>
            </div>
            <button
              id="btn-view-all-cats"
              className="view-all-btn"
              onClick={() => onSelectCategory('all')}
            >
              બધું જુઓ <ArrowRight size={16} />
            </button>
          </div>

          <div className="categories-grid-6">
            {CATEGORIES.map(cat => {
              const catCount = products.filter(p =>
                p.category === cat.name || p.category === cat.nameEn || p.category === cat.id
              ).length;

              return (
                <div
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  className="category-card-premium"
                  onClick={() => {
                    onSelectCategory(cat.name);
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="category-card-img"
                    />
                  </div>
                  <div className="category-card-body">
                    <div>
                      <div className="category-card-name">{cat.name}</div>
                      <div className="category-card-count">
                        {catCount > 0 ? `${catCount} વસ્તુઓ` : cat.description.substring(0, 28) + '...'}
                      </div>
                    </div>
                    <div className="category-card-arrow">
                      વસ્તુઓ જુઓ <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BIG SEARCH BAR ── */}
      <section className="section-pad-sm" style={{ background: 'var(--bg-page)' }}>
        <div className="desktop-container">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 className="section-title">તમને શું જોઈએ છે?</h2>
            <p className="section-subtitle" style={{ marginTop: 6 }}>
              Laptop, Books, Chair, Mixer, Jacket — ગમે તે શોધો
            </p>
          </div>
          <div className="big-search-bar">
            <Search size={20} color="var(--text-muted)" />
            <input
              id="home-search-input"
              type="text"
              className="big-search-input"
              placeholder="ઉદા. Laptop, ખુરશી, Mix Grinder, પુસ્તક..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button
              id="home-search-btn"
              className="big-search-btn"
              onClick={handleSearch}
            >
              <Search size={16} /> શોધો
            </button>
          </div>
        </div>
      </section>

      {/* ── RECENTLY ADDED PRODUCTS ── */}
      <section className="section-pad" style={{ background: '#fff' }}>
        <div className="desktop-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <span style={{ color: 'var(--primary)', marginRight: 8 }}>🕐</span>
                તાજેતરમાં ઉમેરાયેલી વસ્તુઓ
              </h2>
              <p className="section-subtitle">સભ્યો દ્વારા ઉમેરાયેલ નવી વસ્તુઓ</p>
            </div>
            <button
              id="btn-view-all-products"
              className="view-all-btn"
              onClick={() => onSelectCategory('all')}
            >
              બધી વસ્તુઓ <ArrowRight size={16} />
            </button>
          </div>

          {recentProducts.length === 0 ? (
            /* Empty State */
            <div style={{
              textAlign: 'center', padding: '72px 24px',
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              borderRadius: 'var(--radius-lg)',
              border: '2px dashed rgba(22,163,74,0.25)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>🛍️</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 10 }}>
                હજી કોઈ વસ્તુ ઉમેરાઈ નથી
              </h3>
              <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 440, margin: '0 auto 28px auto', lineHeight: 1.65 }}>
                સૌ પ્રથમ વસ્તુ ઉમેરો અને બીજા સભ્યોને ખરીદવાની તક આપો!
              </p>
              <button
                id="btn-empty-sell"
                className="btn-hero-primary"
                onClick={onNavigateSell}
                style={{ margin: '0 auto', display: 'inline-flex' }}
              >
                <PlusCircle size={18} /> પ્રથમ વસ્તુ ઉમેરો
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {recentProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  prod={prod}
                  onSelect={() => onSelectProduct(prod)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── NEARBY CITIES ── */}
      <section className="section-pad-sm" style={{ background: 'var(--bg-page)' }}>
        <div className="desktop-container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <span style={{ color: 'var(--accent)', marginRight: 8 }}>📍</span>
                તમારી નજીકની વસ્તુઓ
              </h2>
              <p className="section-subtitle">શહેર પ્રમાણે શોધો</p>
            </div>
          </div>
          <div className="cities-row">
            {['અમદાવાદ', 'સુરત', 'વડોદરા', 'રાજકોટ', 'ભાવનગર', 'જામનગર', 'ગાંધીનગર', 'આણંદ'].map(city => (
              <button
                key={city}
                id={`city-${city}`}
                className="city-chip"
                onClick={() => {
                  setSearchQuery(city);
                  onSelectCategory('all');
                }}
              >
                <MapPin size={13} /> {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELL CTA BANNER ── */}
      <section className="section-pad" style={{ background: '#fff' }}>
        <div className="desktop-container">
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #15803d 60%, #166534 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '56px 64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-hero)'
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: -60, right: 60, width: 220, height: 220, background: 'rgba(255,255,255,0.07)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: 520 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                padding: '5px 16px', borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', marginBottom: 18
              }}>
                💡 ઘરની નકામી વસ્તુ?
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 12 }}>
                "તમારી પાસે નકામી વસ્તુ છે?
                <br />
                <span style={{ color: '#bbf7d0' }}>કોઈ માટે ઉપયોગી બની શકે!"</span>
              </h2>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, marginBottom: 0 }}>
                આજે જ ઉમેરો — બિલ્કુલ મફત, ઝડપી, અને સરળ.
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
              <button
                id="btn-cta-sell"
                onClick={onNavigateSell}
                style={{
                  background: '#ffffff',
                  color: 'var(--primary)',
                  border: 'none',
                  padding: '18px 36px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-guj)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  transition: 'var(--transition)'
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.25)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'; }}
              >
                <PlusCircle size={22} /> વસ્તુ વેચો હવે
              </button>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginTop: 12 }}>
                ₹0 ચાર્જ • 2 મિનિટ
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Product Card Component ── */
function ProductCard({ prod, onSelect }) {
  const [saved, setSaved] = useState(false);

  const condClass = prod.condition === 'નવી' ? 'new'
    : prod.condition === 'સારી સ્થિતિ' ? 'good'
      : prod.condition === 'સામાન્ય સ્થિતિ' ? 'fair'
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
        {prod.condition === 'નવી' && prod.status !== 'sold' && (
          <div className="product-card-badge badge-new">નવી</div>
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
        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-guj)', fontWeight: 600 }}>
          વેચનાર: {prod.sellerName || 'સ્થાનિક વેચનાર'}
        </div>
      </div>
    </div>
  );
}
