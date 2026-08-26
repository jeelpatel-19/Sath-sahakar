import React from 'react';
import { ShieldCheck, Heart, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function Footer({ setCurrentTab }) {
  return (
    <footer className="desktop-footer">
      <div className="desktop-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.4fr',
          gap: 48,
          paddingBottom: 48,
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>

          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, background: 'linear-gradient(135deg, #16a34a, #15803d)',
                borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', boxShadow: '0 4px 14px rgba(22,163,74,0.4)'
              }}>🤝</div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.3px', fontFamily: 'var(--font-guj)' }}>
                  સાથ સહકાર
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>
                  ગુજરાતની સ્થાનિક માર્કેટ
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 320, fontFamily: 'var(--font-guj)' }}>
              "વસ્તુઓ આપો, જરૂરિયાત પૂરી કરો." — સ્થાનિક લોકો સાથે સીધો સંપર્ક, ઝડપી ડીલ, અને ₹0 ચાર્જ.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
                <Phone size={13} />
                <span>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
                <Mail size={13} />
                <span>sahkar@sathsahkar.in</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
                <MapPin size={13} />
                <span>ગુજરાત, ભારત</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: 18, color: '#ffffff', fontFamily: 'var(--font-guj)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
              ઝડપી લિંક
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'હોમ', tab: 'home' },
                { label: 'વસ્તુઓ શોધો', tab: 'categories' },
                { label: 'વસ્તુ વેચો', tab: 'sell' },
                { label: 'મારી વસ્તુઓ', tab: 'listings' },
                { label: 'સંદેશા', tab: 'messages' },
                { label: 'અમારા વિશે', tab: 'about' },
              ].map(l => (
                <li key={l.tab}>
                  <button
                    onClick={() => setCurrentTab(l.tab)}
                    style={{
                      background: 'none', border: 'none',
                      color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                      fontFamily: 'var(--font-guj)', fontWeight: 600, fontSize: '0.88rem',
                      padding: 0, transition: 'var(--transition)',
                      display: 'flex', alignItems: 'center', gap: 5
                    }}
                    onMouseOver={e => { e.currentTarget.style.color = '#4ade80'; }}
                    onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                  >
                    <ArrowRight size={12} /> {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: 18, color: '#ffffff', fontFamily: 'var(--font-guj)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
              શ્રેણીઓ
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CATEGORIES.map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => setCurrentTab('categories')}
                    style={{
                      background: 'none', border: 'none',
                      color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                      fontFamily: 'var(--font-guj)', fontWeight: 600, fontSize: '0.88rem',
                      padding: 0, transition: 'var(--transition)',
                      display: 'flex', alignItems: 'center', gap: 5
                    }}
                    onMouseOver={e => { e.currentTarget.style.color = '#4ade80'; }}
                    onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                  >
                    <ArrowRight size={12} /> {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Box */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: 18, color: '#ffffff', fontFamily: 'var(--font-guj)', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
              સુરક્ષા
            </h4>
            <div style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                <ShieldCheck size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontFamily: 'var(--font-guj)' }}>
                  હંમેશા વેચનાર સાથે સીધો સંપર્ક કરો. જાહેર સ્થળ પર વ્યવહાર કરો.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Heart size={18} color="#f97316" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontFamily: 'var(--font-guj)' }}>
                  ₹0 ચાર્જ — ખરીદ-વેચ બિલ્કુલ મફત.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 28,
          fontSize: '0.82rem',
          color: 'rgba(255,255,255,0.4)',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ fontFamily: 'var(--font-guj)' }}>
            © {new Date().getFullYear()} સાથ સહકાર — ગુજરાતની સ્થાનિક માર્કેટ. સ્નેહ અને <Heart size={12} style={{ verticalAlign: 'middle', color: '#ef4444' }} /> સાથે બનાવ્યું.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#4ade80' }}>●</span> ઉપલબ્ધ &nbsp;|&nbsp; ₹0 ચાર્જ &nbsp;|&nbsp; 100% ગુજરાતી
          </div>
        </div>
      </div>
    </footer>
  );
}
