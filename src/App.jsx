/**
 * Heritage Antiques Platform - React Frontend Engine
 * Signed by srh
 */
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LondonMapSection from './components/LondonMapSection';
import CatalogGrid from './components/CatalogGrid';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AppraisalModal from './components/AppraisalModal';
import AdminModal from './components/AdminModal';
import AuthModal from './components/AuthModal';
import CustomerDashboardModal from './components/CustomerDashboardModal';
import AdminAppraiserDashboard from './components/AdminAppraiserDashboard';
import AuthenticityGuarantee from './components/AuthenticityGuarantee';
import BiddingModal from './components/BiddingModal';
import AuctionDeskModal from './components/AuctionDeskModal';
import LiveAuctionSalon from './components/LiveAuctionSalon';
import Footer from './components/Footer';

const BACKEND_URL = 'http://localhost:5000';

const PRESET_USERS = {
  mid_admin: {
    _id: "65f020202020202020202003",
    name: "Arthur Wellesley",
    email: "mid.admin@heritage.co.uk",
    role: "mid_admin"
  },
  customer_harrington: {
    _id: "65f020202020202020202002",
    name: "Lord Edward Harrington",
    email: "harrington@mayfair-estate.co.uk",
    role: "customer"
  },
  customer_cavendish: {
    _id: "65f020202020202020202004",
    name: "Lady Eleanor Cavendish",
    email: "eleanor@cavendish-manor.co.uk",
    role: "customer"
  },
  admin: {
    _id: "65f020202020202020202001",
    name: "Sir Julian Vance",
    email: "admin@heritage.co.uk",
    role: "admin"
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'auction' | 'map' | 'guarantee'
  const [antiques, setAntiques] = useState([]);
  const [stats, setStats] = useState(null);
  const [dbStatus, setDbStatus] = useState('Connecting...');
  const [loading, setLoading] = useState(true);

  // Default demo logged in as Customer Lord Harrington for immediate testing
  const [currentUser, setCurrentUser] = useState(PRESET_USERS.customer_harrington);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCentury, setSelectedCentury] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [maxPriceFilter, setMaxPriceFilter] = useState(30000);

  // Shopping Cart state
  const [cartItems, setCartItems] = useState([]);

  // Modals state
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [biddingItem, setBiddingItem] = useState(null); // Active item for live bidding modal
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAppraisalOpen, setIsAppraisalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAuctionDeskOpen, setIsAuctionDeskOpen] = useState(false); // Mid-Level Admin Final Call Desk

  useEffect(() => {
    fetchHealthAndStats();
  }, []);

  useEffect(() => {
    fetchAntiques();
  }, [selectedCategory, selectedCentury, searchQuery, sortOption, maxPriceFilter]);

  const fetchHealthAndStats = async () => {
    try {
      const healthRes = await fetch(`${BACKEND_URL}/api/health`);
      const healthData = await healthRes.json();
      setDbStatus(healthData.databaseStatus || 'Online');

      const statsRes = await fetch(`${BACKEND_URL}/api/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (err) {
      setDbStatus('In-Memory Vault Mode');
    }
  };

  const fetchAntiques = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedCentury !== 'All') params.append('century', selectedCentury);
      if (searchQuery) params.append('search', searchQuery);
      if (sortOption) params.append('sort', sortOption);
      if (maxPriceFilter) params.append('maxPrice', maxPriceFilter);

      const res = await fetch(`${BACKEND_URL}/api/antiques?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAntiques(data);
      }
    } catch (err) {
      console.warn('Using local fallback catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAntiqueAdded = (newItem) => {
    setAntiques((prev) => [newItem, ...prev]);
    fetchHealthAndStats();
  };

  const handleBidPlaced = (updatedAntique, newBid) => {
    setAntiques((prev) =>
      prev.map((a) => (a._id === updatedAntique._id ? { ...a, ...updatedAntique } : a))
    );
    fetchHealthAndStats();
  };

  const handleClaimAwardedLot = (bid) => {
    const claimItem = {
      _id: bid.antiqueId,
      title: `${bid.antiqueTitle} (Auction Final Call Winner)`,
      price: bid.amount,
      imageUrl: bid.antiqueImageUrl || '/images/brass_sextant.jpg',
      certificateNo: 'HA-FINAL-CALL-AWARDED'
    };
    setCartItems((prev) => [...prev, claimItem]);
    setIsCustomerDashboardOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleSelectArtifactFromMap = (artifactTitle) => {
    setActiveTab('catalog');
    setSearchQuery(artifactTitle);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'mid_admin') {
      setIsAuctionDeskOpen(true);
    } else if (user.role === 'admin') {
      setIsAdminDashboardOpen(true);
    } else {
      setIsCustomerDashboardOpen(true);
    }
  };

  const handleSwitchUser = (personaKey) => {
    const targetUser = PRESET_USERS[personaKey] || PRESET_USERS.customer_harrington;
    setCurrentUser(targetUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="paper-texture" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Sticky Header Navbar */}
      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAppraisal={() => setIsAppraisalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCustomerDashboard={() => setIsCustomerDashboardOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenAuctionDesk={() => setIsAuctionDeskOpen(true)}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        dbStatus={dbStatus}
      />

      {/* Main Content Sections */}
      <main style={{ flexGrow: 1 }}>
        
        {/* TAB 1: CATALOG GALLERY */}
        {activeTab === 'catalog' && (
          <>
            <HeroSection
              onExploreCatalog={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreMap={() => setActiveTab('map')}
              stats={stats}
            />

            <CatalogGrid
              antiques={antiques}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedCentury={selectedCentury}
              setSelectedCentury={setSelectedCentury}
              sortOption={sortOption}
              setSortOption={setSortOption}
              maxPriceFilter={maxPriceFilter}
              setMaxPriceFilter={setMaxPriceFilter}
              onQuickView={(item) => setQuickViewItem(item)}
              onAddToCart={handleAddToCart}
              onOpenBidding={(item) => setBiddingItem(item)}
              loading={loading}
            />

            <LondonMapSection onSelectArtifact={handleSelectArtifactFromMap} />
            <AuthenticityGuarantee />
          </>
        )}

        {/* TAB 2: LIVE BIDDING SALON */}
        {activeTab === 'auction' && (
          <LiveAuctionSalon
            antiques={antiques}
            currentUser={currentUser}
            onOpenBidding={(item) => setBiddingItem(item)}
            onQuickView={(item) => setQuickViewItem(item)}
            onOpenAuctionDesk={() => setIsAuctionDeskOpen(true)}
          />
        )}

        {/* TAB 3: LONDON MAP EXPLORER */}
        {activeTab === 'map' && (
          <div style={{ paddingTop: '2rem' }}>
            <LondonMapSection onSelectArtifact={handleSelectArtifactFromMap} />
          </div>
        )}

        {/* TAB 4: AUTHENTICITY STANDARDS */}
        {activeTab === 'guarantee' && (
          <div style={{ paddingTop: '2rem' }}>
            <AuthenticityGuarantee />
          </div>
        )}

      </main>

      {/* MODALS */}

      {/* Live Bidding Modal (Every User Can Bid) */}
      <BiddingModal
        isOpen={Boolean(biddingItem)}
        onClose={() => setBiddingItem(null)}
        item={biddingItem}
        currentUser={currentUser}
        backendUrl={BACKEND_URL}
        onBidPlaced={handleBidPlaced}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Mid-Level Admin Auction Desk & Final Call Console */}
      <AuctionDeskModal
        isOpen={isAuctionDeskOpen}
        onClose={() => setIsAuctionDeskOpen(false)}
        currentUser={currentUser}
        backendUrl={BACKEND_URL}
        onAuctionUpdated={() => {
          fetchAntiques();
          fetchHealthAndStats();
        }}
      />

      {/* Artifact Quick View Modal */}
      <ProductModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onAddToCart={handleAddToCart}
        onOpenBidding={(item) => setBiddingItem(item)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={() => setCartItems([])}
        backendUrl={BACKEND_URL}
      />

      {/* Appraisal Modal */}
      <AppraisalModal
        isOpen={isAppraisalOpen}
        onClose={() => setIsAppraisalOpen(false)}
        backendUrl={BACKEND_URL}
      />

      {/* Admin Add Antique Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onAntiqueAdded={handleAntiqueAdded}
        backendUrl={BACKEND_URL}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        backendUrl={BACKEND_URL}
      />

      {/* Customer Dashboard Modal */}
      <CustomerDashboardModal
        isOpen={isCustomerDashboardOpen}
        onClose={() => setIsCustomerDashboardOpen(false)}
        user={currentUser}
        backendUrl={BACKEND_URL}
        onViewCertificate={(order) => {
          setIsCustomerDashboardOpen(false);
          setIsCheckoutOpen(true);
        }}
        onClaimAwardedLot={handleClaimAwardedLot}
        onOpenBidding={(item) => setBiddingItem(item)}
      />

      {/* Senior Admin / Master Appraiser Dashboard */}
      <AdminAppraiserDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        user={currentUser}
        backendUrl={BACKEND_URL}
        onAppraisalUpdated={fetchHealthAndStats}
      />

      {/* Classic Scholar's Footer */}
      <Footer onOpenAppraisal={() => setIsAppraisalOpen(true)} />

    </div>
  );
}
