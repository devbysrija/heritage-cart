import React, { useState } from 'react';
import { Search, Filter, Compass, Eye, ShoppingBag, ShieldCheck, Tag, Gavel, Award } from 'lucide-react';

const categories = [
  'All',
  'Instruments & Cartography',
  'Horology',
  'Leather Books & Manuscripts',
  'Estate Jewelry & Curios',
  'Fine Furniture'
];

const centuries = ['All', '18th Century', '19th Century'];

export default function CatalogGrid({
  antiques,
  selectedCategory,
  setSelectedCategory,
  selectedCentury,
  setSelectedCentury,
  sortOption,
  setSortOption,
  maxPriceFilter,
  setMaxPriceFilter,
  onQuickView,
  onAddToCart,
  onOpenBidding,
  loading
}) {
  const [showAuctionsOnly, setShowAuctionsOnly] = useState(false);

  const displayedAntiques = showAuctionsOnly
    ? antiques.filter((i) => i.isAuction)
    : antiques;

  return (
    <section id="catalog-section" style={{ maxWidth: '1320px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      
      {/* Header & Subtitle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-delicate)', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-brass)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>
            <Compass size={14} /> Curated Authenticated Gallery
          </div>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-espresso)', margin: 0 }}>
            Heritage Antique Artifacts
          </h2>
        </div>

        {/* Sort Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Sort Artifacts:
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-delicate)',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              color: 'var(--text-espresso)',
              outline: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)'
            }}
          >
            <option value="newest">Latest Acquisitions</option>
            <option value="bid-desc">Highest Leading Bids</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-asc">Era: Oldest First</option>
            <option value="year-desc">Era: Most Recent First</option>
          </select>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
        
        {/* Category Pills & Live Auction Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setShowAuctionsOnly(false); }}
              style={{
                backgroundColor: (selectedCategory === cat && !showAuctionsOnly) ? 'var(--text-espresso)' : 'var(--bg-card)',
                color: (selectedCategory === cat && !showAuctionsOnly) ? '#FAF7F2' : 'var(--text-espresso)',
                border: '1px solid var(--border-delicate)',
                padding: '0.45rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {cat}
            </button>
          ))}

          {/* Quick Toggle for Live Bidding Lots */}
          <button
            onClick={() => setShowAuctionsOnly(!showAuctionsOnly)}
            style={{
              backgroundColor: showAuctionsOnly ? 'var(--accent-brass)' : '#FAF5EE',
              color: showAuctionsOnly ? '#1E1714' : 'var(--accent-brass-hover)',
              border: '1px solid var(--accent-brass)',
              padding: '0.45rem 1.1rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginLeft: 'auto'
            }}
          >
            <Gavel size={14} /> {showAuctionsOnly ? '✓ Filtering Live Auctions' : '🔨 Filter Live Auctions Only'}
          </button>
        </div>

        {/* Century Pills & Max Price Slider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', backgroundColor: 'var(--bg-card)', padding: '1rem 1.25rem', border: '1px solid var(--border-delicate)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              Historical Era:
            </span>
            {centuries.map((cent) => (
              <button
                key={cent}
                onClick={() => setSelectedCentury(cent)}
                style={{
                  backgroundColor: selectedCentury === cent ? 'var(--accent-brass)' : 'transparent',
                  color: selectedCentury === cent ? '#1E1714' : 'var(--text-body)',
                  border: '1px solid ' + (selectedCentury === cent ? 'var(--accent-brass)' : 'var(--border-delicate)'),
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {cent}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              Max Price: <strong style={{ color: 'var(--text-espresso)' }}>£{Number(maxPriceFilter).toLocaleString()}</strong>
            </span>
            <input
              type="range"
              min="2000"
              max="30000"
              step="1000"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
              style={{ accentColor: 'var(--accent-brass)', cursor: 'pointer', width: '150px' }}
            />
          </div>

        </div>

      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Compass size={32} className="animate-spin" style={{ color: 'var(--accent-brass)', marginBottom: '1rem' }} />
          <p>Consulting Heritage Archives & Vault Records...</p>
        </div>
      ) : displayedAntiques.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-delicate)' }}>
          <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-espresso)' }}>
            No antique artifacts match your criteria.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedCentury('All'); setMaxPriceFilter(30000); setShowAuctionsOnly(false); }}
            className="btn-secondary"
            style={{ marginTop: '1rem' }}
          >
            Reset Catalog Filters
          </button>
        </div>
      ) : (
        /* Crisp Clean Grid Gallery */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem' }}>
          {displayedAntiques.map((item) => {
            const isAuction = item.isAuction;
            const isAwarded = item.auctionStatus === 'awarded';
            const leadBid = item.currentBid || item.startingBid || item.price;

            return (
              <div
                key={item._id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: isAwarded ? '1px solid var(--accent-emerald)' : (isAuction ? '1px solid var(--accent-brass)' : '1px solid var(--border-delicate)'),
                  transition: 'var(--transition-smooth)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-gallery)'
                }}
                className="animate-fade-in"
              >
                {/* Product Thumbnail Container */}
                <div style={{ position: 'relative', height: '280px', overflow: 'hidden', backgroundColor: '#1F1714' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      opacity: 0.95
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />

                  {/* Top Badges */}
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge-era">{item.century}</span>
                    {isAwarded ? (
                      <span style={{ backgroundColor: 'var(--accent-emerald)', color: '#FAF7F2', padding: '0.2rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Award size={12} /> Awarded
                      </span>
                    ) : isAuction ? (
                      <span style={{ backgroundColor: 'rgba(30,23,20,0.92)', color: 'var(--accent-brass)', border: '1px solid var(--accent-brass)', padding: '0.2rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} /> Live Bidding
                      </span>
                    ) : (
                      <span className="badge-rarity">{item.rarity || 'Rare'}</span>
                    )}
                  </div>

                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    <span style={{ backgroundColor: 'rgba(30,23,20,0.85)', color: '#FAF7F2', padding: '0.2rem 0.5rem', fontSize: '0.7rem', border: '1px solid rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
                      Year {item.year}
                    </span>
                  </div>
                </div>

                {/* Product Info Section */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-brass)', fontWeight: 600, marginBottom: '0.35rem' }}>
                      {item.category} • {item.origin}
                    </div>

                    <h3 style={{ fontSize: '1.35rem', color: 'var(--text-espresso)', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                      {item.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                  </div>

                  <div>
                    {/* Price & Provenance Tag */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-delicate)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
                          {isAuction ? (isAwarded ? 'Final Awarded Offer' : 'Leading Auction Bid') : 'Guaranteed Value'}
                        </span>
                        <span style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
                          £{leadBid?.toLocaleString()}
                        </span>
                        {isAuction && !isAwarded && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--accent-brass)', display: 'block' }}>
                            {item.totalBidsCount || 0} offers placed
                          </span>
                        )}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end', fontWeight: 600 }}>
                          <ShieldCheck size={12} /> Certified Vault
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          {item.certificateNo || 'HA-CERTIFIED'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: isAuction ? '1fr 1fr' : '1fr 1.2fr', gap: '0.75rem' }}>
                      <button
                        onClick={() => onQuickView(item)}
                        className="btn-secondary"
                        style={{ padding: '0.65rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={14} /> Provenance
                      </button>

                      {isAuction ? (
                        <button
                          onClick={() => onOpenBidding(item)}
                          className="btn-primary"
                          style={{
                            padding: '0.65rem',
                            fontSize: '0.75rem',
                            backgroundColor: isAwarded ? 'var(--text-espresso)' : 'var(--accent-brass)',
                            color: isAwarded ? '#FAF7F2' : '#1E1714',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Gavel size={14} /> {isAwarded ? 'View Award' : 'Place Bid'}
                        </button>
                      ) : (
                        <button
                          onClick={() => onAddToCart(item)}
                          className="btn-primary"
                          style={{ padding: '0.65rem', fontSize: '0.75rem' }}
                        >
                          <ShoppingBag size={14} /> Add to Cart
                        </button>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
