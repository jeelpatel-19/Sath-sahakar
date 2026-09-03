// TEST
import React, { useState, useEffect } from 'react';
import DesktopHeader from './components/DesktopHeader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import SellItemPage from './screens/SellItemPage';
import ProductDetailScreen from './screens/ProductDetailScreen';
import UserDashboard from './screens/UserDashboard';
import AdminDashboard from './screens/AdminDashboard';
import ChatSystem from './screens/ChatSystem';
import SellerProfileScreen from './screens/SellerProfileScreen';
import AboutScreen from './screens/AboutScreen';

import { authService } from './services/authService';
import { productService } from './services/productService';
import { favoriteService } from './services/favoriteService';
import { chatService } from './services/chatService';

import { INITIAL_PRODUCTS, INITIAL_USER_PROFILE } from './data/mockData';

export default function App() {
  // Navigation State: 'home' | 'categories' | 'sell' | 'listings' | 'messages' | 'profile' | 'productDetail' | 'sellerProfile' | 'admin'
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Products Data Store
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Saved Wishlist / Favorites Item IDs
  const [savedProductIds, setSavedProductIds] = useState([]);

  // Chat Threads Data Store
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // 1. Initial Auth Session Check
  useEffect(() => {
    async function checkSession() {
      try {
        const sessionData = await authService.getSession();
        if (sessionData && sessionData.user) {
          setCurrentUser(sessionData.user);
        } else {
          // Check localStorage fallback user
          const savedUser = localStorage.getItem('sathsarkaar_user');
          if (savedUser) setCurrentUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsAuthChecking(false);
      }
    }

    checkSession();

    // Subscribe to Auth State changes
    const unsubscribe = authService.onAuthStateChange((event, user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // 2. Load Products & User Data when authenticated
  useEffect(() => {
    async function loadInitialData() {
      setLoadingProducts(true);
      // Fetch Products from Supabase DB (shared across all users)
      const { products: dbProducts } = await productService.getProducts();
      if (dbProducts) {
        setProducts(dbProducts);
      }
      setLoadingProducts(false);

      if (currentUser?.id) {
        // Fetch Favorites
        const { favoriteProductIds } = await favoriteService.getUserFavorites(currentUser.id);
        if (favoriteProductIds) setSavedProductIds(favoriteProductIds);

        // Fetch Conversations
        const { conversations } = await chatService.getUserConversations(currentUser.id);
        if (conversations) {
          setChats(conversations);
          if (conversations.length > 0) {
            setActiveChatId(prev => (prev && conversations.some(c => c.id === prev) ? prev : conversations[0].id));
          } else {
            setActiveChatId(null);
          }
        }
      }
    }

    loadInitialData();
  }, [currentUser?.id]);

  // Handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    setCurrentTab('home');
  };

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setCurrentTab('home');
  };

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setCurrentTab('productDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSeller = (sellerId) => {
    setSelectedSellerId(sellerId);
    setCurrentTab('sellerProfile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaveProduct = async (prodId) => {
    const isCurrentlySaved = savedProductIds.includes(prodId);
    setSavedProductIds(prev =>
      isCurrentlySaved ? prev.filter(id => id !== prodId) : [...prev, prodId]
    );

    if (currentUser?.id) {
      await favoriteService.toggleFavorite(currentUser.id, prodId, isCurrentlySaved);
    }
  };

  const handlePublishProduct = async (newProd) => {
    // Re-fetch latest shared products from Supabase DB
    const { products: dbProducts } = await productService.getProducts();
    if (dbProducts && dbProducts.length > 0) {
      setProducts(dbProducts);
    } else if (newProd) {
      setProducts(prev => [newProd, ...prev]);
    }
    setSelectedProduct(newProd);
    setCurrentTab('productDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order) => {
    // Refresh products stock status
    setProducts(prev => prev.map(p => {
      if (p.id === order.product_id || p.id === order.productId) {
        const remainingQty = Math.max(0, (p.quantity || 1) - (order.quantity || 1));
        return {
          ...p,
          quantity: remainingQty,
          status: remainingQty === 0 ? 'sold' : p.status
        };
      }
      return p;
    }));
    setCurrentTab('listings');
  };

  const handleStartChatWithSeller = async (prod) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    const sellerId = prod.seller_id || prod.sellerId;

    // Do not allow chatting with self
    if (sellerId && sellerId === currentUser.id) {
      return;
    }

    const { conversation, isNew } = await chatService.getOrCreateConversation({
      productId: prod.id,
      buyerId: currentUser.id,
      sellerId: sellerId || 'usr-seller-default'
    });

    if (conversation) {
      // If newly created conversation or no messages exist yet, send automatic interest message
      if (isNew) {
        const itemTitle = prod.title ? prod.title : 'આ વસ્તુ';
        const initText = `મને ${itemTitle} ખરીદવામાં રસ છે.`;
        const { error: sendErr } = await chatService.sendMessage({
          conversationId: conversation.id,
          senderId: currentUser.id,
          receiverId: sellerId || currentUser.id,
          text: initText
        });
        if (sendErr) {
          console.error('Failed to send interest message:', sendErr);
          alert(`સંદેશ મોકલવામાં ક્ષતિ આવી: ${sendErr}`);
        }
      }

      // Re-fetch conversations for current user
      const { conversations } = await chatService.getUserConversations(currentUser.id);
      if (conversations) {
        setChats(conversations);
      }
      setActiveChatId(conversation.id);
    }

    setCurrentTab('messages');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadMessagesCount = chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  // Requirement #1: MANDATORY FIRST SCREEN IS LOGIN if user is not authenticated!
  if (isAuthChecking) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#059669', color: '#ffffff', fontFamily: 'var(--font-guj)', fontSize: '1.2rem', fontWeight: 800
      }}>
        🤝 સાથ સહકાર - લોડ થઈ રહ્યું છે...
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Fixed Top Header Navigation */}
      <DesktopHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Pages Router */}
      {currentTab === 'home' && (
        <HomeScreen
          products={products}
          onSelectProduct={handleSelectProduct}
          onNavigateSell={() => setCurrentTab('sell')}
          onSelectCategory={(catName) => {
            if (catName !== 'all') setSearchQuery(catName);
            setCurrentTab('categories');
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectSeller={handleSelectSeller}
        />
      )}

      {currentTab === 'categories' && (
        <CategoriesScreen
          products={products}
          onSelectCategory={(catName) => console.log(catName)}
          onSelectProduct={handleSelectProduct}
          onSelectSeller={handleSelectSeller}
        />
      )}

      {currentTab === 'sell' && (
        <SellItemPage
          onPublishProduct={handlePublishProduct}
          currentUser={currentUser}
        />
      )}

      {currentTab === 'listings' && (
        <UserDashboard
          products={products}
          setProducts={setProducts}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          savedProductIds={savedProductIds}
          onToggleSaveProduct={handleToggleSaveProduct}
          chats={chats}
          setChats={setChats}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          onNavigateSell={() => setCurrentTab('sell')}
          onSelectProduct={handleSelectProduct}
          defaultTab="listings"
        />
      )}

      {currentTab === 'messages' && (
        <div className="desktop-container main-content">
          <ChatSystem
            chats={chats}
            setChats={setChats}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            onSelectProduct={handleSelectProduct}
            currentUser={currentUser}
          />
        </div>
      )}

      {currentTab === 'profile' && (
        <UserDashboard
          products={products}
          setProducts={setProducts}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          savedProductIds={savedProductIds}
          onToggleSaveProduct={handleToggleSaveProduct}
          chats={chats}
          setChats={setChats}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          onNavigateSell={() => setCurrentTab('sell')}
          onSelectProduct={handleSelectProduct}
          defaultTab="profile"
        />
      )}

      {currentTab === 'productDetail' && selectedProduct && (
        <ProductDetailScreen
          product={selectedProduct}
          onBack={() => setCurrentTab('home')}
          isSaved={savedProductIds.includes(selectedProduct.id)}
          onToggleSave={handleToggleSaveProduct}
          onStartChat={handleStartChatWithSeller}
          currentUser={currentUser}
          onOrderSuccess={handleOrderSuccess}
          onSelectSeller={handleSelectSeller}
        />
      )}

      {currentTab === 'sellerProfile' && (
        <SellerProfileScreen
          sellerId={selectedSellerId}
          products={products}
          onSelectProduct={handleSelectProduct}
          onBack={() => setCurrentTab('home')}
          savedProductIds={savedProductIds}
          onToggleSaveProduct={handleToggleSaveProduct}
        />
      )}

      {currentTab === 'about' && (
        <AboutScreen
          onNavigateSell={() => setCurrentTab('sell')}
          onNavigateHome={() => setCurrentTab('home')}
        />
      )}

      {currentTab === 'admin' && (
        <AdminDashboard
          products={products}
          setProducts={setProducts}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {/* Auth Modal for re-authenticating / account switching */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Mobile Bottom Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}
