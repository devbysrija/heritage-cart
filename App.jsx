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
import Footer from './components/Footer';

const BACKEND_URL = 'http://localhost:5000';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [antiques, setAntiques] = useState([]);
  const [stats, setStats] = useState(null);
  const [dbStatus, setDbStatus] = useState('Connecting...');
  const [loading, setLoading] = useState(true);

  // Authentication State (Default demo logged in as Customer Lord Harrington for immediate testing)
  const [currentUser, setCurrentUser] = useState({
    _id: "65f020202020202020202002",
    name: "Lord Edward Harrington",
    email: "harrington@mayfair-estate.co.uk",
    role: "customer"
  });

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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAppraisalOpen, setIsAppraisalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Selected Order for viewing printable certificate from dashboard
  const [selectedCertificateOrder, setSelectedCertificateOrder] = useState(null);

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
    if (user.role === 'admin') {
      setIsAdminDashboardOpen(true);
    } else {
      setIsCustomerDashboardOpen(true);
    }
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
        currentUser={currentUser}
        onLogout={handleLogout}
        dbStatus={dbStatus}
      />

      {/* Main Content Sections */}
      <main style={{ flexGrow: 1 }}>
        
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
              loading={loading}
            />

            <LondonMapSection onSelectArtifact={handleSelectArtifactFromMap} />
            <AuthenticityGuarantee />
          </>
        )}

        {activeTab === 'map' && (
          <div style={{ paddingTop: '2rem' }}>
            <LondonMapSection onSelectArtifact={handleSelectArtifactFromMap} />
          </div>
        )}

        {activeTab === 'guarantee' && (
          <div style={{ paddingTop: '2rem' }}>
            <AuthenticityGuarantee />
          </div>
        )}

      </main>

      {/* Modals */}
      <ProductModal
        item={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={() => setCartItems([])}
        backendUrl={BACKEND_URL}
      />

      <AppraisalModal
        isOpen={isAppraisalOpen}
        onClose={() => setIsAppraisalOpen(false)}
        backendUrl={BACKEND_URL}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onAntiqueAdded={handleAntiqueAdded}
        backendUrl={BACKEND_URL}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        backendUrl={BACKEND_URL}
      />

      <CustomerDashboardModal
        isOpen={isCustomerDashboardOpen}
        onClose={() => setIsCustomerDashboardOpen(false)}
        user={currentUser}
        backendUrl={BACKEND_URL}
        onViewCertificate={(order) => {
          setIsCustomerDashboardOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

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
