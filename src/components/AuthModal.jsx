import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Lock, Mail, User, Compass, ArrowRight, Gavel, Award } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, backendUrl }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('customer'); // 'customer' | 'mid_admin' | 'admin'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fillDemoCustomer1 = () => {
    setName('Lord Edward Harrington');
    setEmail('harrington@mayfair-estate.co.uk');
    setPassword('customer123');
    setRole('customer');
  };

  const fillDemoCustomer2 = () => {
    setName('Lady Eleanor Cavendish');
    setEmail('eleanor@cavendish-manor.co.uk');
    setPassword('customer123');
    setRole('customer');
  };

  const fillDemoMidAdmin = () => {
    setName('Arthur Wellesley');
    setEmail('mid.admin@heritage.co.uk');
    setPassword('mid123');
    setRole('mid_admin');
  };

  const fillDemoAdmin = () => {
    setName('Sir Julian Vance');
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
      let resolvedRole = role;
      let resolvedName = name;
      if (email.includes('mid.admin')) {
        resolvedRole = 'mid_admin';
        resolvedName = 'Arthur Wellesley';
      } else if (email.includes('admin')) {
        resolvedRole = 'admin';
        resolvedName = 'Sir Julian Vance';
      } else if (email.includes('eleanor')) {
        resolvedRole = 'customer';
        resolvedName = 'Lady Eleanor Cavendish';
      } else if (!resolvedName) {
        resolvedName = 'Lord Edward Harrington';
      }

      const demoUser = {
        _id: 'user_' + Date.now(),
        name: resolvedName,
        email: email.toLowerCase(),
        role: resolvedRole
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
          maxWidth: '520px',
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
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Compass size={28} color="var(--accent-brass)" style={{ marginBottom: '0.4rem' }} />
          <h2 className="brand-font" style={{ fontSize: '1.3rem', letterSpacing: '0.15em', color: 'var(--text-espresso)', margin: 0 }}>
            HERITAGE & CO. VAULT
          </h2>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
            Collector & Auction Arbiter Authentication
          </p>
        </div>

        {/* Demo Credentials Quick Selector */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.85rem', border: '1px dashed var(--border-delicate)', marginBottom: '1.5rem', fontSize: '0.78rem' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-espresso)', marginBottom: '0.4rem', textTransform: 'uppercase', fontSize: '0.7rem' }}>
            ⚡ Quick Test Personas (Bidders & Arbiter):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            <button
              onClick={fillDemoMidAdmin}
              type="button"
              style={{ padding: '0.45rem', fontSize: '0.72rem', backgroundColor: '#FAF5EE', border: '1px solid var(--accent-brass)', cursor: 'pointer', fontWeight: 700, color: 'var(--accent-mahogany)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Gavel size={12} color="var(--accent-brass)" /> <strong>Mid-Level Admin</strong> (Arbiter)
            </button>
            <button
              onClick={fillDemoAdmin}
              type="button"
              style={{ padding: '0.45rem', fontSize: '0.72rem', backgroundColor: '#FAF7F2', border: '1px solid var(--border-delicate)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-espresso)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Award size={12} color="var(--accent-brass)" /> Senior Appraiser
            </button>
            <button
              onClick={fillDemoCustomer1}
              type="button"
              style={{ padding: '0.45rem', fontSize: '0.72rem', backgroundColor: '#FAF7F2', border: '1px solid var(--border-delicate)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-espresso)', textAlign: 'left' }}
            >
              🎩 Lord Harrington (Bidder A)
            </button>
            <button
              onClick={fillDemoCustomer2}
              type="button"
              style={{ padding: '0.45rem', fontSize: '0.72rem', backgroundColor: '#FAF7F2', border: '1px solid var(--border-delicate)', cursor: 'pointer', fontWeight: 600, color: 'var(--text-espresso)', textAlign: 'left' }}
            >
              💎 Lady Cavendish (Bidder B)
            </button>
          </div>
        </div>

        {/* Mode Switcher */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {mode === 'register' && (
            <>
              <div>
                <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                  Full Name / Title
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lord Edward Harrington"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', fontSize: '0.85rem' }}
                >
                  <option value="customer">Collector (Can Bid & Acquire)</option>
                  <option value="mid_admin">Mid-Level Auction Admin (Makes Final Call)</option>
                  <option value="admin">Master Appraiser (Senior Admin)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="collector@heritage.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {errorMsg && (
            <div style={{ padding: '0.6rem', backgroundColor: 'rgba(110,44,28,0.1)', border: '1px solid var(--accent-mahogany)', color: 'var(--accent-mahogany)', fontSize: '0.8rem' }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          >
            {loading ? 'Authenticating...' : (mode === 'login' ? 'Sign In to Vault' : 'Complete Registration')} <ArrowRight size={15} />
          </button>

        </form>

      </div>
    </div>
  );
}
