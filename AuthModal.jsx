import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Lock, Mail, User, Compass, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, backendUrl }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('customer'); // 'customer' or 'admin'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fillDemoCustomer = () => {
    setEmail('harrington@mayfair-estate.co.uk');
    setPassword('customer123');
    setRole('customer');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@heritage.co.uk');
    setPassword('admin123');
    setRole('admin');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const bodyPayload = mode === 'login'
      ? { email, password }
      : { name, email, password, role };

    try {
      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.error || 'Authentication failed.');
        return;
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setLoading(false);
      // Fallback local auth simulation if server offline
      const demoUser = {
        _id: 'user_' + Date.now(),
        name: email.includes('admin') ? 'Sir Julian Vance' : (name || 'Lord Edward Harrington'),
        email: email.toLowerCase(),
        role: email.includes('admin') ? 'admin' : role
      };
      onLoginSuccess(demoUser);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-parchment)',
          maxWidth: '480px',
          width: '100%',
          border: '1px solid var(--border-delicate)',
          boxShadow: 'var(--shadow-hover)',
          padding: '2.5rem',
          position: 'relative'
        }}
        className="animate-fade-in"
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-espresso)' }}
        >
          <X size={22} />
        </button>

        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <Compass size={28} color="var(--accent-brass)" style={{ marginBottom: '0.4rem' }} />
          <h2 className="brand-font" style={{ fontSize: '1.3rem', letterSpacing: '0.15em', color: 'var(--text-espresso)', margin: 0 }}>
            HERITAGE & CO. VAULT
          </h2>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
            Collector & Appraiser Authentication
          </p>
        </div>

        {/* Demo Credentials Quick Selector */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.85rem', border: '1px dashed var(--border-delicate)', marginBottom: '1.5rem', fontSize: '0.78rem' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-espresso)', marginBottom: '0.4rem', textTransform: 'uppercase', fontSize: '0.7rem' }}>
            ⚡ 1-Click Demo Accounts:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={fillDemoCustomer}
              type="button"
              style={{ flexGrow: 1, padding: '0.4rem', fontSize: '0.72rem', backgroundColor: '#FAF7F2', border: '1px solid var(--border-delicate)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-espresso)' }}
            >
              Demo Customer Account
            </button>
            <button
              onClick={fillDemoAdmin}
              type="button"
              style={{ flexGrow: 1, padding: '0.4rem', fontSize: '0.72rem', backgroundColor: '#FAF7F2', border: '1px solid var(--accent-brass)', cursor: 'pointer', fontWeight: 600, color: 'var(--accent-mahogany)' }}
            >
              Master Appraiser (Admin)
            </button>
          </div>
        </div>

        {/* Mode & Role Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-delicate)', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              flexGrow: 1,
              padding: '0.6rem',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'login' ? '2px solid var(--accent-brass)' : 'none',
              fontWeight: mode === 'login' ? 700 : 500,
              color: mode === 'login' ? 'var(--text-espresso)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              flexGrow: 1,
              padding: '0.6rem',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'register' ? '2px solid var(--accent-brass)' : 'none',
              fontWeight: mode === 'register' ? 700 : 500,
              color: mode === 'register' ? 'var(--text-espresso)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Create Vault Account
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.6rem', backgroundColor: 'rgba(110, 44, 28, 0.1)', border: '1px solid var(--accent-mahogany)', color: 'var(--accent-mahogany)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Full Name & Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Lord Edward Harrington"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="curator@heritage-antiques.co.uk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
              >
                <option value="customer">Collector / Customer</option>
                <option value="admin">Master Appraiser (Admin)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.85rem' }}
          >
            {loading ? 'Authenticating...' : (mode === 'login' ? 'Access Private Vault' : 'Register Account')} <ArrowRight size={14} />
          </button>

        </form>

      </div>
    </div>
  );
}
