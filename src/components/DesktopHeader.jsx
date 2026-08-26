import React, { useState } from 'react';
import {
  Search, PlusCircle, User, ShieldCheck,
  LogOut, MessageSquare, Package, Bell, ChevronDown, Users, Info, Phone
} from 'lucide-react';

export default function DesktopHeader({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuth,
  onLogout,
  unreadMessagesCount = 0
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="desktop-header">
      <div className="desktop-container header-inner">

        {/* Logo */}
        <div
          className="brand-logo"
          onClick={() => setCurrentTab('home')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setCurrentTab('home')}
        >
          <div className="brand-logo-icon">
            🤝
          </div>
          <div className="brand-logo-text">
            <span className="brand-logo-name">સાથ સહકાર</span>
            <span className="brand-logo-tagline">વસ્તુઓ આપો, જરૂરિયાત પૂરી કરો.</span>
          </div>
        </div>

        {/* Global Search */}
        <div className="header-search">
          <Search size={17} className="header-search-icon" />
          <input
            type="text"
            className="header-search-input"
            placeholder="તમને શું જોઈએ છે? શોધો..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                setCurrentTab('categories');
              }
            }}
            aria-label="Search products"
          />
        </div>

        {/* Nav Links */}
        <nav className="nav-links" aria-label="Main navigation">
          <button
            id="nav-home"
            className={`nav-link ${currentTab === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentTab('home')}
          >
            હોમ
          </button>

          <button
            id="nav-browse"
            className={`nav-link ${currentTab === 'categories' ? 'active' : ''}`}
            onClick={() => setCurrentTab('categories')}
          >
            અમારી વસ્તુ
          </button>

          <button
            id="nav-sell"
            className={`nav-link ${currentTab === 'sell' ? 'active' : ''}`}
            onClick={() => setCurrentTab('sell')}
          >
            વેચાણ કરો
          </button>

          <button
            id="nav-listings"
            className={`nav-link ${currentTab === 'listings' ? 'active' : ''}`}
            onClick={() => setCurrentTab('listings')}
          >
            <Package size={14} />
            મારી વસ્તુઓ
          </button>

          <button
            id="nav-messages"
            className={`nav-link ${currentTab === 'messages' ? 'active' : ''}`}
            onClick={() => setCurrentTab('messages')}
          >
            <MessageSquare size={14} />
            ચેટ
            {unreadMessagesCount > 0 && (
              <span className="badge-count">{unreadMessagesCount}</span>
            )}
          </button>

          <button
            id="nav-about"
            className={`nav-link ${currentTab === 'about' ? 'active' : ''}`}
            onClick={() => setCurrentTab('about')}
          >
            અમારા વિશે
          </button>

          <button
            id="nav-admin"
            className={`nav-link ${currentTab === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentTab('admin')}
            style={{ color: '#7c3aed' }}
            title="Admin"
          >
            <ShieldCheck size={14} />
          </button>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Orange Sell CTA */}
          <button
            id="btn-sell-header"
            className="btn-sell-nav"
            onClick={() => setCurrentTab('sell')}
          >
            <PlusCircle size={16} />
            વેચાણ કરો
          </button>

          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                id="btn-user-menu"
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--primary-light)', border: '1.5px solid rgba(22,163,74,0.25)',
                  borderRadius: 'var(--radius-full)', padding: '7px 14px',
                  cursor: 'pointer', transition: 'var(--transition)'
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800
                }}>
                  {currentUser.name?.charAt(0) || 'U'}
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-guj)' }}>
                  {currentUser.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="var(--primary)" />
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: '#fff', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  minWidth: 200, zIndex: 300, overflow: 'hidden'
                }}>
                  <button onClick={() => { setCurrentTab('profile'); setShowUserMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-guj)', color: 'var(--text-secondary)', transition: 'var(--transition)' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--primary-light)'}
                    onMouseOut={e => e.currentTarget.style.background = 'none'}
                  >
                    <User size={15} /> પ્રોફાઇલ
                  </button>
                  <button onClick={() => { setCurrentTab('listings'); setShowUserMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-guj)', color: 'var(--text-secondary)', transition: 'var(--transition)' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--primary-light)'}
                    onMouseOut={e => e.currentTarget.style.background = 'none'}
                  >
                    <Package size={15} /> મારી વસ્તુઓ
                  </button>
                  <div style={{ height: 1, background: 'var(--border-color)', margin: '4px 0' }} />
                  <button onClick={() => { onLogout(); setShowUserMenu(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-guj)', color: '#ef4444', transition: 'var(--transition)' }}
                    onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseOut={e => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={15} /> લૉગઆઉટ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                id="btn-login-header"
                className="btn-login-header"
                onClick={onOpenAuth}
              >
                લૉગિન
              </button>
              <button
                id="btn-signup-header"
                className="btn-signup-header"
                onClick={onOpenAuth}
              >
                સાઇન અપ
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
