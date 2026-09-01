import React from 'react';
import { Sparkles, ShieldCheck, PhoneCall, PlusCircle, Search, Users, CheckCircle } from 'lucide-react';

export default function AboutScreen({ onNavigateSell, onNavigateHome }) {
  return (
    <div className="desktop-container main-content" style={{ paddingTop: 36, paddingBottom: 60 }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #15803d 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '48px 40px',
        marginBottom: 36,
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.18)', padding: '6px 16px',
          borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 800,
          marginBottom: 16
        }}>
          <Sparkles size={16} /> ગુજરાતનું વિશ્વાસપાત્ર લોકલ પ્લેટફોર્મ
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'var(--font-guj)', marginBottom: 12, lineHeight: 1.25 }}>
          🤝 સાથ સહકાર (Sath Sahakar) વિશે
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, maxWidth: 680, fontFamily: 'var(--font-guj)' }}>
          સાથ સહકાર એ સ્થાનિક લોકો વચ્ચે જૂની અને ઉપયોગી વસ્તુઓની ખરીદી અને વેચાણ માટેનું સીધું, મફત અને પારદર્શક પ્લેટફોર્મ છે.
        </p>
      </div>

      {/* 2-Column Details Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
        {/* Left Column: What is Sath Sahakar */}
        <div style={{
          background: '#ffffff', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)', padding: 28, boxShadow: 'var(--shadow-xs)'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-guj)', marginBottom: 16 }}>
            💡 સાથ સહકાર શું છે?
          </h2>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: 'var(--font-guj)', marginBottom: 16 }}>
            આપણા ઘરમાં ઘણી એવી વસ્તુઓ હોય છે જે આપણા ઉપયોગમાં નથી હોતી પણ બીજા માટે ખૂબ જ ઉપયોગી સાબિત થઈ શકે છે. સાથ સહકાર વડે તમે આવી વસ્તુઓ સરળતાથી વેચી શકો છો અને વ્યાજબી કિંમતે ખરીદી શકો છો.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'var(--font-guj)' }}>
            {[
              'કોઈ પણ મધ્યસ્થી (Broker) વગર સીધો કૉલ અથવા ચેટ.',
              '100% મફત લિસ્ટિંગ — કોઈ હિડન ચાર્જ નથી.',
              'તમારા શહેર અને વિસ્તારના લોકો સાથે સીધો વ્યવહાર.'
            ].map((text, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <CheckCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: How to Buy & Sell */}
        <div style={{
          background: '#ffffff', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)', padding: 28, boxShadow: 'var(--shadow-xs)'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-guj)', marginBottom: 16 }}>
            🔄 વસ્તુ કેવી રીતે ખરીદવી અને વેચવી?
          </h2>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-guj)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <PlusCircle size={18} /> 1. વસ્તુ વેચવા માટે:
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: 'var(--font-guj)', margin: 0 }}>
              "વેચાણ કરો" બટન પર ક્લિક કરો, ફોટો ઉમેરો, કિંમત અને વિગતો ભરો અને પ્રકાશિત કરો.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ea580c', fontFamily: 'var(--font-guj)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Search size={18} /> 2. વસ્તુ ખરીદવા માટે:
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: 'var(--font-guj)', margin: 0 }}>
              હોમ પેજ પરથી તમારી પસંદગીની વસ્તુ શોધો, વેચનારને સીધો કૉલ અથવા ચેટ કરો અને ડીલ નક્કી કરો.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Guidelines Card */}
      <div style={{
        background: '#f0fdf4', border: '1.5px solid rgba(22,163,74,0.3)',
        borderRadius: 'var(--radius-lg)', padding: 30, boxShadow: 'var(--shadow-xs)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-dark)', fontFamily: 'var(--font-guj)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={22} color="var(--primary)" /> સુરક્ષિત વ્યવહાર માટેની સલાહ
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, fontFamily: 'var(--font-guj)' }}>
          <div style={{ background: '#ffffff', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, fontSize: '0.92rem' }}>📍 જાહેર જગ્યાએ મળો</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>વસ્તુ ચકાસવા માટે દિવસના સમયે જાહેર જગ્યાએ મુલાકાત કરો.</div>
          </div>
          <div style={{ background: '#ffffff', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, fontSize: '0.92rem' }}>🔍 વસ્તુ રૂબરૂ તપાસો</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>ચુકવણી કરતા પહેલા વસ્તુની સ્થિતિ બરાબર ચકાસી લો.</div>
          </div>
          <div style={{ background: '#ffffff', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, fontSize: '0.92rem' }}>🔒 એડવાન્સ પેમેન્ટ ન કરો</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>વસ્તુ જોયા વિના અજાણી વ્યક્તિને એડવાન્સ પૈસા ન મોકલો.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
