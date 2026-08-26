import React from 'react';
import { Home, LayoutGrid, Plus, MessageSquare, User } from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab, unreadChatsCount, onOpenSellModal }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => setCurrentTab('home')}
      >
        <Home size={21} />
        <span>Home</span>
      </button>

      <button 
        className={`nav-item ${currentTab === 'categories' ? 'active' : ''}`}
        onClick={() => setCurrentTab('categories')}
      >
        <LayoutGrid size={21} />
        <span>Categories</span>
      </button>

      <button 
        className="nav-sell-btn"
        onClick={onOpenSellModal}
        title="Sell Product"
      >
        <Plus size={28} strokeWidth={2.8} />
      </button>

      <button 
        className={`nav-item ${currentTab === 'messages' ? 'active' : ''}`}
        onClick={() => setCurrentTab('messages')}
      >
        <MessageSquare size={21} />
        <span>Messages</span>
        {unreadChatsCount > 0 && <span className="unread-badge">{unreadChatsCount}</span>}
      </button>

      <button 
        className={`nav-item ${currentTab === 'profile' ? 'active' : ''}`}
        onClick={() => setCurrentTab('profile')}
      >
        <User size={21} />
        <span>Profile</span>
      </button>
    </nav>
  );
}
