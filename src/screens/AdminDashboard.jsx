import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Package, Users, Grid, Trash2, CheckCircle,
  PlusCircle, AlertTriangle, Check, ShoppingCart
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { adminService } from '../services/adminService';

export default function AdminDashboard({ products, setProducts, onSelectProduct }) {
  const [activeTab, setActiveTab] = useState('listings');
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);
  const [newCatName, setNewCatName] = useState('');

  const [reportsList, setReportsList] = useState([
    { id: 'rep-1', itemTitle: 'HP Pavilion Laptop', reason: 'ખોટી માહિતી', reportedBy: 'raj@gmail.com', status: 'બાકી' },
    { id: 'rep-2', itemTitle: 'Study Table', reason: 'ફોન ઉઠાવતા નથી', reportedBy: 'priya@gmail.com', status: 'બાકી' }
  ]);

  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    adminService.getAllUsers().then(res => {
      if (res.users && res.users.length > 0) {
        setUsersList(res.users.map(u => ({
          id: u.id,
          name: u.full_name,
          email: u.email,
          phone: u.phone || '+91 98765 43210',
          city: u.city || 'અમદાવાદ',
          status: 'સક્રિય'
        })));
      }
    });

    adminService.getAllOrders().then(res => {
      if (res.orders) setOrdersList(res.orders);
    });
  }, []);

  const handleDeleteListing = (id) => {
    if (window.confirm('શું તમે ખરેખર આ વસ્તુ કાઢી નાખવા માંગો છો?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleDismissReport = (id) => {
    setReportsList(prev => prev.filter(r => r.id !== id));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat = { id: `cat-${Date.now()}`, name: newCatName.trim(), icon: 'Grid', description: 'કસ્ટમ શ્રેણી' };
    setCategoriesList([...categoriesList, newCat]);
    setNewCatName('');
  };

  const TABS = [
    { key: 'listings', icon: <Package size={15} />, label: `વસ્તુઓ જોવા (${products.length})` },
    { key: 'reports', icon: <AlertTriangle size={15} />, label: `રિપોર્ટ્સ (${reportsList.length})` },
    { key: 'categories', icon: <Grid size={15} />, label: `શ્રેણીઓ (${categoriesList.length})` },
    { key: 'users', icon: <Users size={15} />, label: `Users (${usersList.length})` },
  ];

  return (
    <div className="desktop-container main-content" style={{ paddingTop: 36 }}>
      {/* Admin Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
        border: '1px solid rgba(124,58,237,0.15)', borderRadius: 'var(--radius-lg)',
        padding: '24px 32px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', background: 'rgba(124,58,237,0.1)', padding: '4px 12px', borderRadius: 'var(--radius-full)', marginBottom: 10 }}>
            <ShieldCheck size={13} /> Admin Control Panel
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}>
            Platform Administration
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-guj)', marginTop: 3 }}>
            વસ્તુઓ મેનેજ કરો, રિપોર્ટ્સ જોઓ, Users સંભાળો.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {[
            { val: products.length, label: 'વસ્તુઓ', color: 'var(--primary)' },
            { val: reportsList.length, label: 'રિપોર્ટ', color: '#ef4444' },
            { val: usersList.length, label: 'Users', color: '#7c3aed' }
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--border-color)', padding: '12px 18px', borderRadius: 'var(--radius-sm)', textAlign: 'center', boxShadow: 'var(--shadow-xs)', minWidth: 72 }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: s.color, fontFamily: 'var(--font-sans)' }}>{s.val}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'var(--font-guj)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="dashboard-tabs" style={{ marginBottom: 24 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            id={`admin-tab-${tab.key}`}
            className={`dashboard-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: ALL LISTINGS */}
      {activeTab === 'listings' && (
        <div>
          {products.length === 0 ? (
            <div style={{ padding: '56px', background: '#fff', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '2px dashed rgba(22,163,74,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📦</div>
              <h3 style={{ fontFamily: 'var(--font-guj)', fontWeight: 800 }}>Platform પર કોઈ વસ્તુ નથી</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {products.map(prod => (
                <div key={prod.id} style={{
                  background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                  padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                    <img src={prod.images?.[0]} alt={prod.title} style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                    <div>
                      <h4
                        onClick={() => onSelectProduct(prod)}
                        style={{ fontSize: '0.98rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}
                      >
                        {prod.title}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-guj)', marginTop: 2 }}>
                        ₹{Number(prod.price).toLocaleString('en-IN')} • {prod.category} • {prod.sellerName} • {prod.location}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-guj)',
                      background: prod.status === 'sold' ? '#fef2f2' : 'var(--primary-light)',
                      color: prod.status === 'sold' ? '#dc2626' : 'var(--primary)'
                    }}>
                      {prod.status === 'sold' ? 'વેચાઈ ગઈ' : 'ઉપલબ્ધ'}
                    </span>
                    <button
                      id={`admin-delete-${prod.id}`}
                      onClick={() => handleDeleteListing(prod.id)}
                      style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.25)', padding: '7px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-guj)' }}
                    >
                      <Trash2 size={14} /> કાઢો
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: REPORTS */}
      {activeTab === 'reports' && (
        <div>
          {reportsList.length === 0 ? (
            <div style={{ padding: '56px', background: '#fff', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '2px dashed rgba(22,163,74,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
              <h3 style={{ fontFamily: 'var(--font-guj)', fontWeight: 800 }}>કોઈ રિપોર્ટ નથી</h3>
              <p style={{ fontFamily: 'var(--font-guj)', color: 'var(--text-muted)', marginTop: 6 }}>બધા community reports check થઈ ગયા.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reportsList.map(rep => (
                <div key={rep.id} style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-xs)' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#dc2626', fontFamily: 'var(--font-guj)' }}>
                      ⚠️ {rep.itemTitle}
                    </h4>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', marginTop: 3, fontFamily: 'var(--font-guj)' }}>
                      કારણ: <strong>{rep.reason}</strong>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {rep.reportedBy} દ્વારા
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      id={`dismiss-report-${rep.id}`}
                      onClick={() => handleDismissReport(rep.id)}
                      style={{ padding: '8px 14px', border: '1px solid var(--border-color)', background: '#fff', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-guj)' }}
                    >
                      <Check size={14} color="var(--primary)" /> ઠીક છે
                    </button>
                    <button
                      id={`action-report-${rep.id}`}
                      onClick={() => handleDismissReport(rep.id)}
                      style={{ padding: '8px 14px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-guj)' }}
                    >
                      <Trash2 size={14} /> વસ્તુ કાઢો
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: CATEGORIES */}
      {activeTab === 'categories' && (
        <div>
          <form onSubmit={handleAddCategory} style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 20, marginBottom: 24, display: 'flex', gap: 12, boxShadow: 'var(--shadow-xs)' }}>
            <input
              type="text"
              className="form-input"
              placeholder="નવી શ્રેણીનું નામ..."
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              style={{ flex: 1, fontFamily: 'var(--font-guj)' }}
              id="admin-new-category"
            />
            <button type="submit" id="btn-add-category" className="btn-sell-nav" style={{ borderRadius: 'var(--radius-sm)' }}>
              <PlusCircle size={17} /> ઉમેરો
            </button>
          </form>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {categoriesList.map(cat => (
              <div key={cat.id} style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-xs)' }}>
                <div>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 800, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}>{cat.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-guj)' }}>
                    {products.filter(p => p.category === cat.name).length} વસ્તુઓ
                  </span>
                </div>
                {cat.id.startsWith('cat-') && (
                  <button
                    onClick={() => setCategoriesList(categoriesList.filter(c => c.id !== cat.id))}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 4 }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: USERS */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {usersList.map(u => (
            <div key={u.id} style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>
                  {u.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}>{u.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {u.email} • {u.phone}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--primary-dark)', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-guj)' }}>
                ✓ {u.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
