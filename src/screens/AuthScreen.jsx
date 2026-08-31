import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, CheckCircle2, ArrowRight, Shield, AlertCircle, Camera, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';

export default function AuthScreen({ onAuthSuccess }) {
  // 'email-login' | 'signup' | 'forgot'
  const [mode, setMode] = useState('email-login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('અમદાવાદ');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Phone number change handler: digits only, max 10 digits
  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'email-login') {
        if (!email || !password) {
          throw new Error('કૃપા કરીને ઈમેલ અને પાસવર્ડ દાખલ કરો.');
        }
        const { user, error } = await authService.signIn({ email, password });
        if (error) {
          throw new Error('ઈમેલ અથવા પાસવર્ડ ખોટો છે.');
        }

        setSuccessMessage('લૉગ ઇન સફળ!');
        setTimeout(() => onAuthSuccess(user), 800);

      } else if (mode === 'signup') {
        if (!name || !email || !password || !phone) {
          throw new Error('કૃપા કરીને બધી જરૂરી માહિતી ભરો.');
        }
        if (phone.length !== 10) {
          throw new Error('મોબાઇલ નંબર બરાબર 10 અંકનો હોવો જોઈએ.');
        }
        if (password.length < 6) {
          throw new Error('પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરનો હોવો જોઈએ.');
        }

        const { user, error } = await authService.signUp({
          email,
          password,
          fullName: name,
          phone,
          city
        });

        if (error) {
          throw new Error('એકાઉન્ટ બનાવવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
        }

        setSuccessMessage('તમારું એકાઉન્ટ સફળતાપૂર્વક બનાવવામાં આવ્યું.');
        setTimeout(() => onAuthSuccess(user), 1000);

      } else if (mode === 'forgot') {
        if (!email) throw new Error('કૃપા કરીને તમારો ઈમેલ દાખલ કરો.');
        const { success, error } = await authService.resetPassword(email);
        if (!success) throw new Error(error);
        setSuccessMessage('પાસવર્ડ રીસેટ કરવાની લિંક તમારા ઈમેલ પર મોકલવામાં આવી છે.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'ઈમેલ અથવા પાસવર્ડ ખોટો છે.');
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
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Blur Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 400, height: 400, background: 'rgba(249, 115, 22, 0.25)', filter: 'blur(90px)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 500, height: 500, background: 'rgba(16, 185, 129, 0.3)', filter: 'blur(100px)', borderRadius: '50%' }} />

      <div style={{
        width: '100%',
        maxWidth: 460,
        background: '#ffffff',
        borderRadius: 24,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        padding: '36px 32px',
        position: 'relative',
        zIndex: 10,
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{
            width: 58, height: 58,
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

        {/* Form Title Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-guj)', color: '#111827', margin: 0 }}>
            {mode === 'email-login' && 'તમારા એકાઉન્ટમાં લોગિન કરો'}
            {mode === 'signup' && 'નવું એકાઉન્ટ બનાવો'}
            {mode === 'forgot' && 'પાસવર્ડ રીસેટ કરો'}
          </h2>
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

          {/* Email input */}
          <div className="form-group">
            <label className="form-label">
              <Mail size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
              ઈમેલ *
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

          {/* Phone input for signup */}
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">
                <Phone size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                મોબાઇલ નંબર (૧૦ અંક) *
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder="૯૮૭૬૫૪૩૨૧૦"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={10}
                required
              />
              {phone && phone.length !== 10 && (
                <span style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: 4, display: 'block', fontFamily: 'var(--font-guj)' }}>
                  બરાબર ૧૦ અંક હોવા જોઈએ (હમણાં: {phone.length})
                </span>
              )}
            </div>
          )}

          {/* Password field */}
          {mode !== 'forgot' && (
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <Lock size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                  પાસવર્ડ *
                </span>
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
                {mode === 'email-login' && 'લોગિન'}
                {mode === 'signup' && 'એકાઉન્ટ બનાવો'}
                {mode === 'forgot' && 'રીસેટ લિંક મોકલો'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation Links */}
        <div style={{ marginTop: 22, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mode === 'email-login' && (
            <>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-guj)' }}
              >
                નવું એકાઉન્ટ બનાવો
              </button>
              <button
                type="button"
                onClick={() => { setMode('forgot'); setErrorMessage(''); setSuccessMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-guj)' }}
              >
                પાસવર્ડ ભૂલી ગયા?
              </button>
            </>
          )}

          {(mode === 'signup' || mode === 'forgot') && (
            <button
              type="button"
              onClick={() => { setMode('email-login'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-guj)' }}
            >
              ← પાછા લોગિન પર જાઓ
            </button>
          )}
        </div>

        {/* Security Badge */}
        <div style={{
          marginTop: 24, paddingTop: 16, borderTop: '1px solid #f3f4f6',
          textAlign: 'center', fontSize: '0.78rem', color: '#6b7280',
          fontFamily: 'var(--font-guj)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
        }}>
          <Shield size={14} color="#059669" />
          <span>૧૦૦% સુરક્ષિત ગુજરાતનું સ્થાનિક માર્કેટપ્લેસ</span>
        </div>
      </div>
    </div>
  );
}
