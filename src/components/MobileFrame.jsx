import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Moon, Sun, ShieldAlert, Sparkles, Wifi, Battery, Signal } from 'lucide-react';

export default function MobileFrame({ children, isDarkMode, setIsDarkMode, onViewAdmin, deviceMode, setDeviceMode }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Top Controller Bar */}
      <div className="top-control-bar">
        <div className="brand-badge">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <div>
            ResellLocal <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-green)', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '12px' }}>Everyday Thrift</span>
          </div>
        </div>

        {/* Viewport Frame Switcher */}
        <div className="device-switcher">
          <button 
            className={`device-btn ${deviceMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setDeviceMode('mobile')}
            title="Mobile Viewport Preview"
          >
            <Smartphone size={15} /> Mobile Preview
          </button>
          <button 
            className={`device-btn ${deviceMode === 'fullscreen' ? 'active' : ''}`}
            onClick={() => setDeviceMode('fullscreen')}
            title="Full Web App Layout"
          >
            <Monitor size={15} /> Fullscreen Web
          </button>
        </div>

        {/* Right Actions */}
        <div className="top-actions">
          <button 
            className="icon-btn-pill"
            onClick={onViewAdmin}
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', border: 'none' }}
          >
            <ShieldAlert size={14} /> Admin Dashboard
          </button>

          <button 
            className="icon-btn-pill"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#6366f1" />}
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className={`viewport-container ${deviceMode === 'fullscreen' ? 'fullscreen-mode' : ''}`}>
        {/* Phone Notch */}
        <div className="phone-notch"></div>

        {/* Mobile Status Bar */}
        <div className="mobile-status-bar">
          <span>{currentTime || '09:41'}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={13} />
          </div>
        </div>

        {/* Screen Content Wrapper */}
        <div className="screen-content">
          {children}
        </div>
      </div>
    </div>
  );
}
