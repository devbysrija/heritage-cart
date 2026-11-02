/**
 * Heritage Antiques Platform - Header & Vault Navigation
 * Signed by srh
 */
import React, { useState, useRef, useEffect } from 'react';
import { Compass, ShoppingBag, Search, ShieldCheck, MapPin, Feather, PlusCircle, UserCheck, LogOut, Award, User, ChevronDown, Clock, Package, Gavel } from 'lucide-react';

export default function Navbar({
  cartCount,
  onOpenCart,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAppraisal,
  onOpenAdmin,
  onOpenAuth,
  onOpenCustomerDashboard,
  onOpenAdminDashboard,
  onOpenAuctionDesk,
  currentUser,
  onSwitchUser,
  onLogout,
  dbStatus
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isArbiter = currentUser?.role === 'mid_admin' || currentUser?.role === 'admin';

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(250, 247, 242, 0.96)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-delicate)' }}>
      
      {/* Top Banner Ticker with Persona Quick Switcher */}
      <div style={{ backgroundColor: 'var(--text-espresso)', color: '#FAF7F2', padding: '0.4rem 1.5rem', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-brass)' }}>
            <Compass size={12} /> ESTABLISHED LONDON 1884
          </span>
          <span style={{ color: '#D5C8B8', fontStyle: 'italic', display: 'none', mdDisplay: 'inline' }}>
            Vault Certified Provenance • Fleet Street Auction Guild
          </span>
        </div>

        {/* 1-Click Fast Persona Switcher in Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ color: '#D5C8B8', fontSize: '0.68rem', marginRight: '0.2rem' }}>Test As:</span>
          
          <button
            onClick={() => onSwitchUser && onSwitchUser('mid_admin')}
            style={{
              backgroundColor: currentUser?.role === 'mid_admin' ? 'var(--accent-brass)' : 'rgba(255,255,255,0.12)',
              color: currentUser?.role === 'mid_admin' ? '#1E1714' : '#FAF7F2',
              border: '1px solid var(--accent-brass)',
              padding: '0.15rem 0.5rem',
              fontSize: '0.65rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            title="Mid-Level Auction Admin (Makes Final Call)"
          >
            <Gavel size={10} /> Mid-Level Admin
          </button>

          <button
            onClick={() => onSwitchUser && onSwitchUser('customer_harrington')}
            style={{
              backgroundColor: currentUser?.email === 'harrington@mayfair-estate.co.uk' ? 'var(--accent-brass)' : 'rgba(255,255,255,0.12)',
              color: currentUser?.email === 'harrington@mayfair-estate.co.uk' ? '#1E1714' : '#FAF7F2',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '0.15rem 0.5rem',
              fontSize: '0.65rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Lord Edward Harrington (Bidder A)"
          >
            Lord Harrington
          </button>

          <button
            onClick={() => onSwitchUser && onSwitchUser('customer_cavendish')}
            style={{
              backgroundColor: currentUser?.email === 'eleanor@cavendish-manor.co.uk' ? 'var(--accent-brass)' : 'rgba(255,255,255,0.12)',
              color: currentUser?.email === 'eleanor@cavendish-manor.co.uk' ? '#1E1714' : '#FAF7F2',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '0.15rem 0.5rem',
              fontSize: '0.65rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Lady Eleanor Cavendish (Bidder B)"
          >
            Lady Cavendish
          </button>

          <span style={{ color: '#888', margin: '0 0.3rem' }}>|</span>

          <span style={{ color: '#D5C8B8', fontSize: '0.68rem' }}>
            Vault DB: <strong style={{ color: dbStatus?.includes('Atlas') ? '#A3E635' : '#FACC15' }}>{dbStatus?.includes('Atlas') ? 'MongoDB Atlas' : 'Local Engine'}</strong>
          </span>
        </div>
      </div>

      {/* Main Clean Header Bar */}
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('catalog')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <div style={{ width: '38px', height: '38px', border: '1px solid var(--accent-brass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-espresso)' }}>
            <Compass size={20} color="var(--accent-brass)" />
          </div>
          <div>
            <h1 className="brand-font" style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, letterSpacing: '0.18em', color: 'var(--text-espresso)' }}>
              HERITAGE <span style={{ color: 'var(--accent-brass)', fontWeight: 400 }}>& CO.</span>
            </h1>
            <p style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--text-muted)', margin: 0 }}>
              Curators of Rare Antiques • London
            </p>
          </div>
        </div>

        {/* Clean Center Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'catalog' ? 700 : 500,
              color: activeTab === 'catalog' ? 'var(--text-espresso)' : 'var(--text-body)',
              cursor: 'pointer',
              borderBottom: activeTab === 'catalog' ? '2px solid var(--accent-brass)' : '2px solid transparent',
              paddingBottom: '0.3rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            Catalog Gallery
          </button>

          {/* DEDICATED LIVE BIDDING SALON TAB */}
          <button
            onClick={() => setActiveTab('auction')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'auction' ? 700 : 500,
              color: activeTab === 'auction' ? 'var(--text-espresso)' : 'var(--text-body)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderBottom: activeTab === 'auction' ? '2px solid var(--accent-brass)' : '2px solid transparent',
              paddingBottom: '0.3rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Gavel size={15} color="var(--accent-brass)" /> Live Bidding Salon
            <span style={{ backgroundColor: 'var(--accent-brass)', color: '#1E1714', borderRadius: '10px', padding: '0.05rem 0.4rem', fontSize: '0.65rem', fontWeight: 700 }}>
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'map' ? 700 : 500,
              color: activeTab === 'map' ? 'var(--text-espresso)' : 'var(--text-body)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderBottom: activeTab === 'map' ? '2px solid var(--accent-brass)' : '2px solid transparent',
              paddingBottom: '0.3rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            <MapPin size={14} color="var(--accent-brass)" /> London Map Explorer
          </button>

          <button
            onClick={() => setActiveTab('guarantee')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'guarantee' ? 700 : 500,
              color: activeTab === 'guarantee' ? 'var(--text-espresso)' : 'var(--text-body)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderBottom: activeTab === 'guarantee' ? '2px solid var(--accent-brass)' : '2px solid transparent',
              paddingBottom: '0.3rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            <ShieldCheck size={14} color="var(--accent-emerald)" /> Authenticity Standards
          </button>
        </nav>

        {/* Right Section: Search & Uncluttered "My Account" Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          
          {/* Quick Search */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search 17th-19th Century..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-delicate)',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                fontSize: '0.78rem',
                color: 'var(--text-espresso)',
                outline: 'none',
                width: '180px',
                transition: 'var(--transition-smooth)'
              }}
            />
            <Search size={14} style={{ position: 'absolute', left: '0.65rem', color: 'var(--text-muted)' }} />
          </div>

          {/* MY ACCOUNT DROPDOWN BUTTON */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                backgroundColor: 'var(--text-espresso)',
                color: '#FAF7F2',
                border: '1px solid var(--text-espresso)',
                padding: '0.55rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                transition: 'var(--transition-smooth)'
              }}
            >
              {currentUser?.role === 'mid_admin' ? (
                <Gavel size={15} color="var(--accent-brass)" />
              ) : currentUser?.role === 'admin' ? (
                <Award size={15} color="var(--accent-brass)" />
              ) : (
                <User size={15} color="var(--accent-brass)" />
              )}
              
              <span>
                {currentUser ? (currentUser.name?.split(' ')[0] || 'My Account') : 'My Account'}
              </span>

              {/* Cart Counter Badge inside Account Button */}
              {cartCount > 0 && (
                <span style={{
                  backgroundColor: 'var(--accent-brass)',
                  color: '#1E1714',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  marginLeft: '0.1rem'
                }}>
                  {cartCount}
                </span>
              )}

              <ChevronDown size={14} color="#D5C8B8" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            {/* SLEEK DROPDOWN MENU */}
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  width: '280px',
                  backgroundColor: 'var(--bg-parchment)',
                  border: '1px solid var(--border-delicate)',
                  boxShadow: 'var(--shadow-hover)',
                  padding: '0.5rem 0',
                  zIndex: 200
                }}
                className="animate-fade-in"
              >
                {/* Account Info Header */}
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-brass)', fontWeight: 700 }}>
                    {currentUser ? (
                      currentUser.role === 'mid_admin'
                        ? '⚖️ Mid-Level Auction Administrator'
                        : currentUser.role === 'admin'
                        ? '🏛️ Master Appraiser (Senior)'
                        : '🎩 Authenticated Collector'
                    ) : 'Guest Collector'}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-espresso)' }}>
                    {currentUser ? currentUser.name : 'Sign In to Access Vault'}
                  </div>
                  {currentUser && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                  )}
                </div>

                {/* Dropdown Options */}
                <div style={{ padding: '0.25rem 0' }}>
                  
                  {/* Shopping Cart */}
                  <button
                    onClick={() => {
                      onOpenCart();
                      setDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.825rem',
                      color: 'var(--text-espresso)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <ShoppingBag size={15} color="var(--accent-brass)" /> Vault Cart
                    </span>
                    {cartCount > 0 ? (
                      <span style={{ backgroundColor: 'var(--accent-brass)', color: '#1E1714', borderRadius: '10px', padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>
                        {cartCount} items
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Empty</span>
                    )}
                  </button>

                  {/* Customer Bids & Awards */}
                  {currentUser && (
                    <button
                      onClick={() => {
                        onOpenCustomerDashboard();
                        setDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.825rem',
                        color: 'var(--text-espresso)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Gavel size={15} color="var(--accent-brass)" /> My Active Bids & Awards
                    </button>
                  )}

                  {/* Request Appraisal */}
                  <button
                    onClick={() => {
                      onOpenAppraisal();
                      setDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.825rem',
                      color: 'var(--text-espresso)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Feather size={15} color="var(--accent-brass)" /> Request Antique Appraisal
                  </button>

                  {/* Customer Purchases & Certificates */}
                  {currentUser && (
                    <button
                      onClick={() => {
                        onOpenCustomerDashboard();
                        setDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.825rem',
                        color: 'var(--text-espresso)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Package size={15} color="var(--accent-emerald)" /> My Purchases & Certificates
                    </button>
                  )}

                  {/* MID-LEVEL ADMIN & SENIOR ADMIN WORKSPACES */}
                  {isArbiter && (
                    <>
                      <div style={{ borderTop: '1px solid var(--border-delicate)', margin: '0.35rem 0' }} />
                      
                      {/* AUCTION FINAL CALL DESK */}
                      <button
                        onClick={() => {
                          onOpenAuctionDesk();
                          setDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.65rem 1rem',
                          textAlign: 'left',
                          background: '#FAF5EE',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          fontSize: '0.825rem',
                          color: 'var(--accent-mahogany)',
                          fontWeight: 700
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FAF5EE'}
                      >
                        <Gavel size={15} color="var(--accent-brass)" /> ⚖️ Auction Final Call Desk
                      </button>

                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={() => {
                            onOpenAdminDashboard();
                            setDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.65rem 1rem',
                            textAlign: 'left',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            fontSize: '0.825rem',
                            color: 'var(--text-espresso)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Award size={15} color="var(--accent-brass)" /> Master Appraiser Desk
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onOpenAdmin();
                          setDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.65rem 1rem',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          fontSize: '0.825rem',
                          color: 'var(--text-espresso)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <PlusCircle size={15} color="var(--accent-brass)" /> Add Antique to Catalog
                      </button>
                    </>
                  )}

                </div>

                {/* Footer Action: Sign In or Sign Out */}
                <div style={{ borderTop: '1px solid var(--border-delicate)', paddingTop: '0.35rem', marginTop: '0.25rem' }}>
                  {!currentUser ? (
                    <button
                      onClick={() => {
                        onOpenAuth();
                        setDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        color: 'var(--accent-brass)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <User size={15} /> Sign In / Register Account
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onLogout();
                        setDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.825rem',
                        color: 'var(--accent-mahogany)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(110, 44, 28, 0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={15} /> Sign Out of Vault
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </header>
  );
}
