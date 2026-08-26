import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('અમદાવાદ');
  const [isSuccess, setIsSuccess] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'forgot') {
      setForgotSent(true);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      onAuthSuccess({
        id: `usr-${Date.now()}`,
        name: name || (email ? email.split('@')[0] : 'ગ્રાહક'),
        email: email || 'user@example.com',
        phone: phone || '+91 98765 43210',
        location: location || 'ગુજરાત',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: 460 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{
                width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
              }}>🤝</div>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-guj)' }}>
                સાથ સહકાર
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'var(--font-guj)', color: 'var(--text-primary)' }}>
              {mode === 'login' && 'તમારા એકાઉન્ટમાં લૉગ ઇન કરો'}
              {mode === 'signup' && 'નવું એકાઉન્ટ બનાવો'}
              {mode === 'forgot' && 'પાસવર્ડ ફરીથી સેટ કરો'}
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-guj)', marginTop: 2 }}>
              {mode === 'login' && 'ગુજરાતની સ્થાનિક માર્કેટ — ₹0 ચાર્જ'}
              {mode === 'signup' && 'વસ્તુ વેચો, ખરીદો — સ્થાનિક સભ્ય બનો'}
              {mode === 'forgot' && 'ઇ-મેઇલ ઉમેરો, રીસેટ લિંક મળશે'}
            </p>
          </div>
          <button
            id="btn-auth-close"
            onClick={onClose}
            style={{ background: 'var(--bg-secondary)', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '36px 10px' }}>
            <div style={{ width: 64, height: 64, background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={36} color="var(--primary)" />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>
              {mode === 'login' ? 'સ્વાગત છે!' : 'એકાઉન્ટ બન્યું!'}
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 6, fontFamily: 'var(--font-guj)' }}>
              {mode === 'login' ? 'લૉગ ઇન સફળ...' : 'ખૂબ ખૂબ અભિનંદન!'}
            </p>
          </div>
        ) : (
          <>
            {/* Mode Tabs */}
            {mode !== 'forgot' && (
              <div style={{
                display: 'flex', background: 'var(--bg-secondary)',
                padding: 5, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                marginBottom: 22, gap: 4
              }}>
                {[
                  { key: 'login', label: 'લૉગિન' },
                  { key: 'signup', label: 'સાઇન અપ' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    id={`auth-tab-${tab.key}`}
                    onClick={() => setMode(tab.key)}
                    style={{
                      flex: 1, padding: '10px 16px', border: 'none',
                      borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-guj)',
                      fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)',
                      background: mode === tab.key ? '#ffffff' : 'transparent',
                      color: mode === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
                      boxShadow: mode === tab.key ? 'var(--shadow-xs)' : 'none'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Forgot Sent */}
            {mode === 'forgot' && forgotSent ? (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <CheckCircle2 size={42} color="var(--primary)" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-guj)' }}>
                  રીસેટ લિંક મોકલ્યું!
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '6px 0 20px 0', fontFamily: 'var(--font-guj)' }}>
                  <strong>{email}</strong> પર ચેક કરો.
                </p>
                <button
                  id="auth-back-to-login"
                  type="button"
                  onClick={() => { setForgotSent(false); setMode('login'); }}
                  className="btn-primary-lg"
                >
                  લૉગિન પર પાછા જાઓ
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {mode === 'signup' && (
                  <div className="form-group">
                    <label className="form-label">
                      <User size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                      પૂરું નામ *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="ઉદા. રાજ પટેલ"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      id="auth-name"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    <Mail size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                    ઇ-મેઇલ *
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    id="auth-email"
                  />
                </div>

                {mode === 'signup' && (
                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                      મોબાઇલ નંબર *
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      id="auth-phone"
                    />
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="form-group">
                    <label className="form-label">
                      <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                      તમારું શહેર *
                    </label>
                    <select
                      className="form-select"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      id="auth-city"
                    >
                      {['અમદાવાદ', 'સુરત', 'વડોદરા', 'રાજકોટ', 'ભાવનગર', 'જામનગર', 'ગાંધીનગર', 'આણંદ'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}

                {mode !== 'forgot' && (
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>
                        <Lock size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                        પાસવર્ડ *
                      </span>
                      {mode === 'login' && (
                        <button
                          type="button"
                          id="btn-forgot-password"
                          onClick={() => setMode('forgot')}
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-guj)' }}
                        >
                          પાસવર્ડ ભૂલી ગયા?
                        </button>
                      )}
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      id="auth-password"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary-lg"
                  id="btn-auth-submit"
                  style={{ marginTop: 10 }}
                >
                  {mode === 'login' && 'લૉગ ઇન કરો'}
                  {mode === 'signup' && 'એકાઉન્ટ બનાવો'}
                  {mode === 'forgot' && 'રીસેટ લિંક મોકલો'}
                  <ArrowRight size={18} />
                </button>

                {mode === 'forgot' && (
                  <button
                    type="button"
                    id="btn-back-login"
                    onClick={() => setMode('login')}
                    style={{ width: '100%', marginTop: 10, background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-guj)' }}
                  >
                    ← લૉગિન પર પાછા
                  </button>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
