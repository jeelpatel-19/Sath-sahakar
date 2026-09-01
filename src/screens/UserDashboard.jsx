import React, { useState, useEffect } from 'react';
import {
  Package, Edit, Trash2, CheckCircle, PlusCircle,
  Heart, MessageSquare, User, MapPin, X, Check, ShoppingBag, ShoppingCart, Truck, Clock
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import ChatSystem from './ChatSystem';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { authService } from '../services/authService';

export default function UserDashboard({
  products,
  setProducts,
  currentUser,
  setCurrentUser,
  savedProductIds,
  onToggleSaveProduct,
  chats,
  setChats,
  activeChatId,
  setActiveChatId,
  onNavigateSell,
  onSelectProduct,
  defaultTab = 'listings'
}) {
  const [dashboardTab, setDashboardTab] = useState(defaultTab);
  const [editingProduct, setEditingProduct] = useState(null);

  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('ઇલેક્ટ્રોનિક્સ');
  const [editCondition, setEditCondition] = useState('સારી સ્થિતિ');
  const [editDescription, setEditDescription] = useState('');

  const [profileName, setProfileName] = useState(currentUser?.name || currentUser?.full_name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileLocation, setProfileLocation] = useState(currentUser?.location || currentUser?.city || '');
  const [savedSettingsMsg, setSavedSettingsMsg] = useState(false);

  // Load real orders from Database
  useEffect(() => {
    if (currentUser?.id) {
      setLoadingOrders(true);
      Promise.all([
        orderService.getBuyerOrders(currentUser.id),
        orderService.getSellerOrders(currentUser.id)
      ]).then(([buyerRes, sellerRes]) => {
        if (buyerRes.orders) setBuyerOrders(buyerRes.orders);
        if (sellerRes.orders) setSellerOrders(sellerRes.orders);
      }).finally(() => setLoadingOrders(false));
    }
  }, [currentUser?.id, dashboardTab]);

  const [myDbProducts, setMyDbProducts] = useState([]);

  // Load real user listings explicitly from Supabase using currentUser.id
  useEffect(() => {
    let isMounted = true;
    async function loadUserProducts() {
      if (!currentUser?.id) return;
      const { products: fetchedProducts } = await productService.getProducts({ sellerId: currentUser.id });
      if (isMounted && fetchedProducts) {
        setMyDbProducts(fetchedProducts);
      }
    }
    loadUserProducts();
    return () => { isMounted = false; };
  }, [currentUser?.id, products]);

  // myProducts comes directly from query matching currentUser.id (never containing other users' items)
  const sourceProducts = myDbProducts.length > 0 ? myDbProducts : products;
  const myProducts = sourceProducts.filter(p =>
    Boolean(currentUser?.id) && (String(p.sellerId) === String(currentUser.id) || String(p.seller_id) === String(currentUser.id))
  );

  const soldProducts = myProducts.filter(p => p.status === 'sold');
  const favoriteProducts = products.filter(p => savedProductIds.includes(p.id));

  const handleToggleSold = async (id) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    if (prod.status !== 'sold') {
      await productService.markAsSold(id);
    }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'sold' ? 'available' : 'sold' } : p));
  };

  const handleDeleteListing = async (id) => {
    if (window.confirm('શું તમે ખરેખર આ વસ્તુ કાઢી નાખવા માંગો છો?')) {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const { success } = await orderService.updateOrderStatus(orderId, newStatus);
    if (success) {
      setSellerOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setBuyerOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setEditTitle(prod.title || '');
    setEditPrice(prod.price || '');
    setEditCategory(prod.category || 'ઇલેક્ટ્રોનિક્સ');
    setEditCondition(prod.condition || 'સારી સ્થિતિ');
    setEditDescription(prod.description || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
      ...p,
      title: editTitle,
      price: Number(editPrice),
      category: editCategory,
      condition: editCondition,
      description: editDescription
    } : p));
    setEditingProduct(null);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (setCurrentUser && currentUser) {
      const updatedUser = {
        ...currentUser,
        name: profileName,
        full_name: profileName,
        phone: profilePhone,
        location: profileLocation,
        city: profileLocation
      };
      setCurrentUser(updatedUser);
      if (currentUser.id) {
        await authService.updateProfile(currentUser.id, {
          name: profileName,
          phone: profilePhone,
          city: profileLocation
        });
      }
    }
    setSavedSettingsMsg(true);
    setTimeout(() => setSavedSettingsMsg(false), 3000);
  };

  const TABS = [
    { key: 'listings', icon: <Package size={16} />, label: `મારી વસ્તુઓ (${myProducts.length})` },
    { key: 'buyer-orders', icon: <ShoppingCart size={16} />, label: `મારા ઓર્ડર (${buyerOrders.length})` },
    { key: 'seller-orders', icon: <Truck size={16} />, label: `મળેલા ઓર્ડર (${sellerOrders.length})` },
    { key: 'favorites', icon: <Heart size={16} />, label: `સાચવેલી (${favoriteProducts.length})` },
    { key: 'messages', icon: <MessageSquare size={16} />, label: `સંદેશા (${chats.length})` },
    { key: 'profile', icon: <User size={16} />, label: 'પ્રોફાઇલ' },
  ];

  return (
    <div className="desktop-container main-content" style={{ paddingTop: 36 }}>
      {/* Top Banner */}
      <div className="dashboard-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '1.8rem', fontWeight: 900,
            boxShadow: '0 4px 16px rgba(22,163,74,0.3)'
          }}>
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}>
              {currentUser?.name || 'મારું એકાઉન્ટ'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 3, fontFamily: 'var(--font-guj)' }}>
              <MapPin size={13} color="var(--primary)" />
              {currentUser?.location || 'ગુજરાત'} • ખરીદ-વેચ એકાઉન્ટ
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{currentUser?.email}</p>
          </div>
        </div>

        <button
          id="btn-dashboard-sell"
          onClick={onNavigateSell}
          className="btn-sell-nav"
        >
          <PlusCircle size={17} /> વસ્તુ ઉમેરો
        </button>
      </div>

      {/* Dashboard Tabs */}
      <div className="dashboard-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            id={`dash-tab-${tab.key}`}
            className={`dashboard-tab ${dashboardTab === tab.key ? 'active' : ''}`}
            onClick={() => setDashboardTab(tab.key)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: MY LISTINGS */}
      {dashboardTab === 'listings' && (
        <div>
          {myProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 24px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '2px dashed rgba(22,163,74,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 14 }}>📦</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>
                હજી કોઈ વસ્તુ ઉમેરી નથી
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 8, marginBottom: 24, fontFamily: 'var(--font-guj)' }}>
                પ્રથમ વસ્તુ ઉમેરો અને ખરીદારો સુધી પહોંચો.
              </p>
              <button onClick={onNavigateSell} className="btn-hero-primary" style={{ margin: '0 auto', display: 'inline-flex' }}>
                <PlusCircle size={18} /> વસ્તુ ઉમેરો
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {myProducts.map(prod => {
                const isSold = prod.status === 'sold';
                return (
                  <div key={prod.id} className="dashboard-item-card" style={{ opacity: isSold ? 0.72 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1 }}>
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200'}
                        alt={prod.title}
                        style={{ width: 76, height: 76, borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <h3
                            onClick={() => onSelectProduct(prod)}
                            style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-guj)', textDecoration: isSold ? 'line-through' : 'none' }}
                          >
                            {prod.title}
                          </h3>
                          {isSold && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff', background: '#dc2626', padding: '2px 9px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-guj)' }}>
                              વેચાઈ ગઈ
                            </span>
                          )}
                        </div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)', marginBottom: 4 }}>
                          ₹{Number(prod.price).toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: 10, fontFamily: 'var(--font-guj)' }}>
                          <span>📂 {prod.category}</span>
                          <span>•</span>
                          <span>🏷 {prod.condition}</span>
                          <span>•</span>
                          <span>📍 {prod.location}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <button
                        id={`btn-toggle-sold-${prod.id}`}
                        onClick={() => handleToggleSold(prod.id)}
                        style={{
                          padding: '8px 14px', border: '1.5px solid',
                          borderColor: isSold ? 'rgba(22,163,74,0.3)' : 'rgba(22,163,74,0.3)',
                          borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                          fontFamily: 'var(--font-guj)',
                          background: isSold ? 'var(--primary-light)' : '#fff',
                          color: isSold ? 'var(--primary)' : 'var(--text-secondary)',
                          transition: 'var(--transition)'
                        }}
                      >
                        <CheckCircle size={14} />
                        {isSold ? 'ઉપલબ્ધ' : 'વેચાઈ ગઈ'}
                      </button>

                      <button
                        id={`btn-edit-${prod.id}`}
                        onClick={() => handleOpenEdit(prod)}
                        style={{ padding: '8px 14px', border: '1.5px solid var(--border-color)', background: '#fff', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-guj)', transition: 'var(--transition)' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <Edit size={14} /> ફેરફાર
                      </button>

                      <button
                        id={`btn-delete-${prod.id}`}
                        onClick={() => handleDeleteListing(prod.id)}
                        style={{ padding: '8px 14px', border: '1.5px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#dc2626', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-guj)', transition: 'var(--transition)' }}
                      >
                        <Trash2 size={14} /> કાઢો
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: BUYER ORDERS */}
      {dashboardTab === 'buyer-orders' && (
        <div>
          {buyerOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 24px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '2px dashed rgba(22,163,74,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 14 }}>🛍️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>
                તમે હજુ સુધી કોઈ ખરીદી કરી નથી
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 8, fontFamily: 'var(--font-guj)' }}>
                માર્કેટપ્લેસમાંથી તમારી પસંદગીની વસ્તુ "હમણાં ખરીદો" વડે ઓર્ડર કરો.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {buyerOrders.map(ord => (
                <div key={ord.id} style={{
                  background: '#ffffff', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)', padding: '20px 24px',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid #f3f4f6', pb: 10 }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                        ઓર્ડર #: {ord.id.slice(0, 8)}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 12 }}>
                        📅 {new Date(ord.created_at || Date.now()).toLocaleDateString('gu-IN')}
                      </span>
                    </div>
                    <span style={{
                      padding: '4px 14px', borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-guj)',
                      background: ord.payment_status === 'paid' ? '#ecfdf5' : '#fef2f2',
                      color: ord.payment_status === 'paid' ? '#047857' : '#dc2626'
                    }}>
                      {ord.payment_status === 'paid' ? '✓ ચુકવણી સફળ' : 'ચુકવણી બાકી'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <img
                        src={ord.product?.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200'}
                        alt="prod"
                        style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-guj)', margin: '0 0 4px 0' }}>
                          {ord.product?.title || 'ખરીદાયેલ વસ્તુ'}
                        </h4>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-guj)' }}>
                          જથ્થો: {ord.quantity} નંગ • વેચનાર: {ord.seller?.full_name || 'ગ્રાહક'}
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--primary)', marginTop: 2 }}>
                          ₹{Number(ord.total_amount || ord.unit_price).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontFamily: 'var(--font-guj)' }}>
                        ઓર્ડર સ્થિતિ:
                      </span>
                      <span style={{
                        background: 'var(--primary-light)', color: 'var(--primary-dark)',
                        padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem', fontWeight: 800, fontFamily: 'var(--font-guj)', display: 'inline-block'
                      }}>
                        {ord.status || 'ઓર્ડર મળ્યો'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: SELLER ORDERS */}
      {dashboardTab === 'seller-orders' && (
        <div>
          {sellerOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 24px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '2px dashed rgba(22,163,74,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 14 }}>📦</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>
                તમને હજુ સુધી કોઈ ઓર્ડર મળ્યો નથી
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 8, fontFamily: 'var(--font-guj)' }}>
                જ્યારે કોઈ તમારી વસ્તુ ખરીદશે, ત્યારે ઓર્ડરની વિગતો અહીં દેખાશે.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {sellerOrders.map(ord => (
                <div key={ord.id} style={{
                  background: '#ffffff', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)', padding: '20px 24px',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid #f3f4f6', pb: 10 }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                        ઓર્ડર #: {ord.id.slice(0, 8)}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 12 }}>
                        📅 {new Date(ord.created_at || Date.now()).toLocaleDateString('gu-IN')}
                      </span>
                    </div>
                    <span style={{
                      padding: '4px 14px', borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-guj)',
                      background: '#ecfdf5', color: '#047857'
                    }}>
                      ✓ ચુકવણી મળેલ ({ord.payment_status || 'Paid'})
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <img
                        src={ord.product?.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200'}
                        alt="prod"
                        style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-guj)', margin: '0 0 4px 0' }}>
                          {ord.product?.title || 'વેચાયેલ વસ્તુ'}
                        </h4>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-guj)' }}>
                          ખરીદનાર: <strong>{ord.buyer_name || ord.buyer?.full_name}</strong> (📞 {ord.buyer_phone})
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-guj)' }}>
                          સરનામું: {ord.shipping_address || 'સ્થાનિક પિકઅપ'}
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--primary)', marginTop: 2 }}>
                          રકમ: ₹{Number(ord.total_amount || ord.unit_price).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Order Status Update Controls */}
                    <div style={{ background: '#f9fafb', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border-color)' }}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, marginBottom: 6, fontFamily: 'var(--font-guj)' }}>
                        ઓર્ડર ની સ્થિતિ બદલો:
                      </label>
                      <select
                        className="form-select"
                        value={ord.status || 'ઓર્ડર મળ્યો'}
                        onChange={e => handleUpdateOrderStatus(ord.id, e.target.value)}
                        style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-guj)' }}
                      >
                        <option value="ઓર્ડર મળ્યો">ઓર્ડર મળ્યો</option>
                        <option value="તૈયાર">તૈયાર</option>
                        <option value="મોકલાયો">મોકલાયો (Dispatched)</option>
                        <option value="પૂર્ણ">પૂર્ણ (Completed)</option>
                        <option value="રદ">રદ (Cancelled)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: SAVED */}
      {dashboardTab === 'favorites' && (
        <div>
          {favoriteProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 24px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '2px dashed rgba(22,163,74,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 14 }}>❤️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>કોઈ સાચવેલી વસ્તુ નથી</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 8, fontFamily: 'var(--font-guj)' }}>
                વસ્તુ પર ❤️ ક્લિક કરો — અહીં દેખાશે.
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {favoriteProducts.map(prod => (
                <div key={prod.id} className="product-card" onClick={() => onSelectProduct(prod)} id={`fav-prod-${prod.id}`}>
                  <div className="product-card-img-wrapper">
                    <img src={prod.images?.[0]} alt={prod.title} className="product-card-img" />
                    <button className="product-fav-btn saved" onClick={e => { e.stopPropagation(); onToggleSaveProduct(prod.id); }}>
                      <Heart size={15} fill="#ef4444" />
                    </button>
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-card-title">{prod.title}</h3>
                    <div className="product-card-price">₹{Number(prod.price).toLocaleString('en-IN')}</div>
                    <div className="product-card-meta">
                      <span>{prod.location}</span>
                      <span className="condition-tag">{prod.condition}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: MESSAGES */}
      {dashboardTab === 'messages' && (
        <ChatSystem
          chats={chats}
          setChats={setChats}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          onSelectProduct={onSelectProduct}
        />
      )}

      {/* TAB: SOLD */}
      {dashboardTab === 'sold' && (
        <div>
          {soldProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 24px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '2px dashed rgba(22,163,74,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 14 }}>🛍️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>
                હજી કોઈ વસ્તુ વેચાઈ નથી
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 8, fontFamily: 'var(--font-guj)' }}>
                "વેચાઈ ગઈ" ચિહ્ન લગાવો — અહીં દેખાશે.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {soldProducts.map(prod => (
                <div key={prod.id} style={{
                  background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                  padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 18, opacity: 0.75, boxShadow: 'var(--shadow-xs)'
                }}>
                  <img src={prod.images?.[0]} alt={prod.title} style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 800, fontFamily: 'var(--font-guj)', textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.98rem' }}>{prod.title}</h3>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, color: 'var(--primary)' }}>₹{Number(prod.price).toLocaleString('en-IN')}</div>
                  </div>
                  <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.76rem', fontWeight: 800, padding: '4px 12px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-guj)' }}>
                    ✓ વેચાઈ ગઈ
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: PROFILE */}
      {dashboardTab === 'profile' && (
        <div className="form-card" style={{ margin: 0, maxWidth: 680 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 20, fontFamily: 'var(--font-guj)' }}>
            👤 પ્રોફાઇલ ફેરફાર
          </h3>

          {savedSettingsMsg && (
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 800, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-guj)' }}>
              <Check size={16} /> પ્રોફાઇલ સ્ટ ✓
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label className="form-label">પૂરું નામ</label>
              <input type="text" className="form-input" value={profileName} onChange={e => setProfileName(e.target.value)} required id="profile-name" />
            </div>

            <div className="form-group">
              <label className="form-label">મોબાઇલ નંબર</label>
              <input type="tel" className="form-input" value={profilePhone} onChange={e => setProfilePhone(e.target.value)} id="profile-phone" />
            </div>

            <div className="form-group">
              <label className="form-label">શહેર / સ્થળ</label>
              <select className="form-select" value={profileLocation} onChange={e => setProfileLocation(e.target.value)} id="profile-location">
                {['અમદાવાદ', 'સુરત', 'વડોદરા', 'રાજકોટ', 'ભાવનગર', 'જામનગર', 'ગાંધીનગર', 'આણંદ'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button type="submit" id="btn-save-profile" className="btn-primary-lg" style={{ width: 'auto', padding: '12px 28px', marginTop: 8 }}>
              <Check size={18} /> ફેરફાર સ્ ✓
            </button>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setEditingProduct(null); }}>
          <div className="modal-content" style={{ maxWidth: 580 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>
                ✏️ વસ્તુ ફેરફાર
              </h3>
              <button
                id="btn-close-edit"
                onClick={() => setEditingProduct(null)}
                style={{ background: 'var(--bg-secondary)', border: 'none', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">વસ્તુનું નામ</label>
                <input type="text" className="form-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} required id="edit-title" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">કિંમત (₹)</label>
                  <input type="number" className="form-input" value={editPrice} onChange={e => setEditPrice(e.target.value)} required id="edit-price" />
                </div>
                <div className="form-group">
                  <label className="form-label">શ્રેણી</label>
                  <select className="form-select" value={editCategory} onChange={e => setEditCategory(e.target.value)} id="edit-category">
                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">સ્થિતિ</label>
                <select className="form-select" value={editCondition} onChange={e => setEditCondition(e.target.value)} id="edit-condition">
                  <option value="નવી">નવી</option>
                  <option value="લગભગ નવી">લગભગ નવી</option>
                  <option value="સારી સ્થિતિ">સારી સ્થિતિ</option>
                  <option value="સામાન્ય સ્થિતિ">સામાન્ય સ્થિતિ</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">વર્ણન</label>
                <textarea rows={3} className="form-textarea" value={editDescription} onChange={e => setEditDescription(e.target.value)} id="edit-description" />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button type="submit" id="btn-save-edit" className="btn-primary-lg" style={{ flex: 1 }}>
                  <Check size={17} /> ફેરફાર સ્ ✓
                </button>
                <button
                  type="button"
                  id="btn-cancel-edit"
                  onClick={() => setEditingProduct(null)}
                  style={{ padding: '12px 20px', border: '1px solid var(--border-color)', background: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-guj)' }}
                >
                  રદ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
