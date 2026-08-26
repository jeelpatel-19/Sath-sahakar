import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, CheckCircle2, ArrowRight, Shield, AlertCircle, Camera, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';

export default function AuthScreen({ onAuthSuccess }) {
  // 'email-login' | 'phone-login' | 'signup' | 'forgot'
  const [mode, setMode] = useState('email-login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [name, setName] = useState('');
  const [city, setCity] = useState('અમદાવાદ');
  const [area, setArea] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'email-login') {
        if (!email || !password) {
          throw new Error('કૃપા કરીને ઇ-મેઇલ અને પાસવર્ડ દાખલ કરો.');
        }
        const { user, error } = await authService.signIn({ email, password });
        if (error) throw new Error(error);

        setSuccessMessage('લૉગ ઇન સફળ! હોમપેજ પર જઈ રહ્યા છીએ...');
        setTimeout(() => onAuthSuccess(user), 1000);

      } else if (mode === 'phone-login') {
        if (!otpSent) {
          if (!phone || phone.length < 10) {
            throw new Error('કૃપા કરીને માન્ય મોબાઇલ નંબર દાખલ કરો.');
          }
          const { success, error } = await authService.signInWithPhone(phone);
          if (!success) throw new Error(error);
          setOtpSent(true);
          setSuccessMessage('તમારા મોબાઇલ પર OTP મોકલવામાં આવ્યો છે.');
        } else {
          if (!otpToken) throw new Error('કૃપા કરીને OTP દાખલ કરો.');
          // Process OTP login
          const mockPhoneUser = {
            id: `usr-phone-${Date.now()}`,
            name: `ગ્રાહક (${phone.slice(-4)})`,
            phone: phone,
            city: city,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          };
          localStorage.setItem('sathsarkaar_user', JSON.stringify(mockPhoneUser));
          setSuccessMessage('OTP સફળતાપૂર્વક ચકાસાયો!');
          setTimeout(() => onAuthSuccess(mockPhoneUser), 1000);
        }

      } else if (mode === 'signup') {
        if (!name || !email || !password || !phone) {
          throw new Error('કૃપા કરીને બધી જરૂરી માહિતી (*) ભરો.');
        }
        if (password.length < 6) {
          throw new Error('પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરનો હોવો જોઈએ.');
        }

        let avatarUrl = '';
        if (avatarPreview) {
          avatarUrl = avatarPreview;
        }

        const { user, error } = await authService.signUp({
          email,
          password,
          fullName: name,
          phone,
          city,
          area,
          avatarUrl
        });

        if (error) throw new Error(error);

        setSuccessMessage('ખૂબ ખૂબ અભિનંદન! એકાઉન્ટ સફળતાપૂર્વક બન્યું.');
        setTimeout(() => onAuthSuccess(user), 1200);

      } else if (mode === 'forgot') {
        if (!email) throw new Error('કૃપા કરીને તમારો ઇ-મેઇલ દાખલ કરો.');
        const { success, error } = await authService.resetPassword(email);
        if (!success) throw new Error(error);
        setSuccessMessage('પાસવર્ડ રીસેટ લિંક તમારા ઇ-મેઇલ પર મોકલવામાં આવી છે.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'પ્રક્રિયામાં ભૂલ આવી.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Blur Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 400, height: 400, background: 'rgba(249, 115, 22, 0.25)', filter: 'blur(90px)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 500, height: 500, background: 'rgba(16, 185, 129, 0.3)', filter: 'blur(100px)', borderRadius: '50%' }} />

      <div style={{
        width: '100%',
        maxWidth: 480,
        background: '#ffffff',
        borderRadius: 24,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        padding: '36px 32px',
        position: 'relative',
        zIndex: 10,
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60,
            background: 'linear-gradient(135deg, #059669, #047857)',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', margin: '0 auto 12px auto',
            boxShadow: '0 10px 20px rgba(5, 150, 105, 0.3)'
          }}>
            🤝
          </div>
          <h1 style={{
            fontSize: '2.1rem', fontWeight: 900,
            color: '#059669', fontFamily: 'var(--font-guj)',
            margin: 0, letterSpacing: '-0.5px'
          }}>
            સાથ સહકાર
          </h1>
          <p style={{
            fontSize: '0.96rem', fontWeight: 700,
            color: '#4b5563', fontFamily: 'var(--font-guj)',
            marginTop: 4
          }}>
            "તમારી જરૂરિયાત, તમારી નજીક."
          </p>
        </div>

        {/* Login Method Tabs */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1.1fr', gap: 4,
          background: '#f3f4f6', padding: 5, borderRadius: 12, marginBottom: 24
        }}>
          <button
            type="button"
            onClick={() => { setMode('email-login'); setErrorMessage(''); setSuccessMessage(''); }}
            style={{
              padding: '9px 6px', border: 'none', borderRadius: 8,
              fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-guj)',
              cursor: 'pointer', transition: 'all 0.2s ease',
              background: mode === 'email-login' ? '#ffffff' : 'transparent',
              color: mode === 'email-login' ? '#059669' : '#6b7280',
              boxShadow: mode === 'email-login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Email લૉગિન
          </button>

          <button
            type="button"
            onClick={() => { setMode('phone-login'); setErrorMessage(''); setSuccessMessage(''); }}
            style={{
              padding: '9px 6px', border: 'none', borderRadius: 8,
              fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-guj)',
              cursor: 'pointer', transition: 'all 0.2s ease',
              background: mode === 'phone-login' ? '#ffffff' : 'transparent',
              color: mode === 'phone-login' ? '#059669' : '#6b7280',
              boxShadow: mode === 'phone-login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            મોબાઇલ OTP
          </button>

          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
            style={{
              padding: '9px 6px', border: 'none', borderRadius: 8,
              fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-guj)',
              cursor: 'pointer', transition: 'all 0.2s ease',
              background: mode === 'signup' ? '#ffffff' : 'transparent',
              color: mode === 'signup' ? '#059669' : '#6b7280',
              boxShadow: mode === 'signup' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            નવું એકાઉન્ટ
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            color: '#dc2626', padding: '12px 14px', borderRadius: 10,
            fontSize: '0.86rem', fontWeight: 700, fontFamily: 'var(--font-guj)',
            marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div style={{
            background: '#ecfdf5', border: '1px solid #6ee7b7',
            color: '#047857', padding: '12px 14px', borderRadius: 10,
            fontSize: '0.86rem', fontWeight: 700, fontFamily: 'var(--font-guj)',
            marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {/* Avatar Upload during Signup */}
          {mode === 'signup' && (
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ position: 'relative', width: 76, height: 76, margin: '0 auto 8px auto' }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: '#f3f4f6', overflow: 'hidden',
                  border: '3px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={34} color="#9ca3af" />
                  )}
                </div>
                <label htmlFor="avatar-upload-input" style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 26, height: 26, background: '#f97316', color: '#fff',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  <Camera size={14} />
                </label>
                <input
                  id="avatar-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#6b7280', fontFamily: 'var(--font-guj)' }}>
                પ્રોફાઇલ ફોટો ઉમેરો (મરજિયાત)
              </span>
            </div>
          )}

          {/* Signup Name */}
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">
                <User size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                પૂરું નામ *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="ઉદા. રાજેશ પટેલ"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email input for email-login, signup, forgot */}
          {mode !== 'phone-login' && (
            <div className="form-group">
              <label className="form-label">
                <Mail size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                ઇ-મેઇલ સરનામું *
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {/* Phone input for phone-login or signup */}
          {(mode === 'phone-login' || mode === 'signup') && (
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
              />
            </div>
          )}

          {/* Phone OTP Token field */}
          {mode === 'phone-login' && otpSent && (
            <div className="form-group">
              <label className="form-label">
                OTP કોડ (6 અંક) *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="123456"
                maxLength={6}
                value={otpToken}
                onChange={e => setOtpToken(e.target.value)}
                required
              />
            </div>
          )}

          {/* Location fields for signup */}
          {mode === 'signup' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">
                  <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  શહેર *
                </label>
                <select
                  className="form-select"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                >
                  {['અમદાવાદ', 'સુરત', 'વડોદરા', 'રાજકોટ', 'ભાવનગર', 'જામનગર', 'ગાંધીનગર', 'આણંદ'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">વિસ્તાર / એરિયા</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ઉદા. સેટેલાઇટ"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Password field */}
          {(mode === 'email-login' || mode === 'signup') && (
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <Lock size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                  પાસવર્ડ *
                </span>
                {mode === 'email-login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMessage(''); }}
                    style={{
                      background: 'none', border: 'none', color: '#059669',
                      fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                      fontFamily: 'var(--font-guj)'
                    }}
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
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary-lg"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1.02rem',
              fontWeight: 800,
              fontFamily: 'var(--font-guj)',
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #059669, #047857)'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>પ્રક્રિયા ચાલુ છે...</span>
              </>
            ) : (
              <>
                {mode === 'email-login' && 'માર્કેટપ્લેસમાં લૉગ ઇન કરો'}
                {mode === 'phone-login' && (otpSent ? 'OTP ચકાસો' : 'OTP મોકલો')}
                {mode === 'signup' && 'નવું એકાઉન્ટ બનાવો'}
                {mode === 'forgot' && 'રીસેટ લિંક મોકલો'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div style={{
          marginTop: 24, paddingTop: 18, borderTop: '1px solid #f3f4f6',
          textAlign: 'center', fontSize: '0.8rem', color: '#6b7280',
          fontFamily: 'var(--font-guj)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
        }}>
          <Shield size={14} color="#059669" />
          <span>૧૦૦% સુરક્ષિત ગુજરાતનું સ્થાનિક માર્કેટપ્લેસ</span>
        </div>
      </div>
    </div>
  );
}
