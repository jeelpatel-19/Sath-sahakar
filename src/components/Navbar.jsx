import React from 'react';
import { Home, ShoppingBag, Plus, Package, User } from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={`bottom-nav-item ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => setCurrentTab('home')}
        id="mobile-nav-home"
      >
        <Home size={20} />
        <span>હોમ</span>
      </button>

      <button 
        className={`bottom-nav-item ${currentTab === 'categories' ? 'active' : ''}`}
        onClick={() => setCurrentTab('categories')}
        id="mobile-nav-categories"
      >
        <ShoppingBag size={20} />
        <span>અમારી વસ્તુ</span>
      </button>

      <button 
        className="bottom-nav-sell-btn"
        onClick={() => setCurrentTab('sell')}
        title="વેચાણ કરો"
        id="mobile-nav-sell"
      >
        <Plus size={26} strokeWidth={2.8} />
      </button>

      <button 
        className={`bottom-nav-item ${currentTab === 'listings' ? 'active' : ''}`}
        onClick={() => setCurrentTab('listings')}
        id="mobile-nav-listings"
      >
        <Package size={20} />
        <span>મારી વસ્તુઓ</span>
      </button>

      <button 
        className={`bottom-nav-item ${currentTab === 'profile' ? 'active' : ''}`}
        onClick={() => setCurrentTab('profile')}
        id="mobile-nav-profile"
      >
        <User size={20} />
        <span>પ્રોફાઇલ</span>
      </button>
    </nav>
  );
}
