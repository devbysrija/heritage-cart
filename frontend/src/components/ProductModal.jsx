import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Award, ShoppingBag, Compass, CheckCircle2, FileText, Gavel } from 'lucide-react';

export default function ProductModal({ item, onClose, onAddToCart, onOpenBidding }) {
  if (!item) return null;

  const [activeImage, setActiveImage] = useState(item.imageUrl);
  const [reservedSuccess, setReservedSuccess] = useState(false);

  const handleReserve = () => {
    setReservedSuccess(true);
    setTimeout(() => {
      setReservedSuccess(false);
    }, 4000);
  };

  const isAuction = item.isAuction;
  const isAwarded = item.auctionStatus === 'awarded';
  const leadPrice = item.currentBid || item.startingBid || item.price;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-parchment)',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid var(--border-delicate)',
          boxShadow: 'var(--shadow-hover)',
          position: 'relative',
          padding: '2.25rem'
        }}
        className="animate-fade-in"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-espresso)',
            padding: '0.5rem'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Left Column: Image Viewer */}
          <div>
            <div style={{ position: 'relative', height: '360px', backgroundColor: '#1E1714', border: '1px solid var(--border-delicate)', overflow: 'hidden', marginBottom: '1rem' }}>
              <img
                src={activeImage}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', backgroundColor: 'rgba(30,23,20,0.85)', color: '#FAF7F2', padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Award size={14} color="var(--accent-brass)" /> Vault Inspection Grade: A+
              </div>
            </div>

            {/* Thumbnail selector */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[item.imageUrl, ...(item.gallery || [])].filter((v, i, a) => a.indexOf(v) === i).map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  style={{
                    width: '64px',
                    height: '64px',
                    padding: 0,
                    border: activeImage === imgUrl ? '2px solid var(--accent-brass)' : '1px solid var(--border-delicate)',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                >
                  <img src={imgUrl} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>

            {/* Physical Specs Sheet */}
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-delicate)', fontSize: '0.825rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-espresso)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border-delicate)', paddingBottom: '0.4rem' }}>
                Physical & Material Specifications
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', color: 'var(--text-body)' }}>
                <div><strong>Materials:</strong> {item.material || 'Aged Brass & Silver'}</div>
                <div><strong>Dimensions:</strong> {item.dimensions || '24 x 18 x 12 cm'}</div>
                <div><strong>Origin:</strong> {item.origin}</div>
                <div><strong>Condition:</strong> {item.condition}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Provenance & Purchase Action */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge-era">{item.century}</span>
                {isAwarded ? (
                  <span style={{ backgroundColor: 'var(--accent-emerald)', color: '#FAF7F2', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Award size={12} /> Final Call Awarded
                  </span>
                ) : isAuction ? (
                  <span style={{ backgroundColor: 'rgba(30,23,20,0.9)', color: 'var(--accent-brass)', border: '1px solid var(--accent-brass)', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} /> Live Bidding Open
                  </span>
                ) : (
                  <span className="badge-rarity">{item.rarity}</span>
                )}
              </div>

              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-espresso)', marginBottom: '0.5rem', lineHeight: 1.25 }}>
                {item.title}
              </h2>

              <div style={{ fontSize: '0.85rem', color: 'var(--accent-brass)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.25rem' }}>
                <MapPin size={14} /> {item.origin} (Circa {item.year})
              </div>

              {/* Price & Auction Estimate */}
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-delicate)', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                  {isAuction ? (isAwarded ? 'Final Awarded Offer' : 'Current Leading Offer') : 'Acquisition Valuation'}
                </div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
                  £{leadPrice?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-mahogany)', marginTop: '0.2rem' }}>
                  {isAuction ? `Starting Bid: £${(item.startingBid || item.price)?.toLocaleString()} • ${item.totalBidsCount || 0} Offers Placed` : `Auction Estimate: ${item.estimatedValue || '£5,000 - £6,000'}`}
                </div>
              </div>

              {/* Award Callout if Concluded */}
              {isAwarded && item.awardedTo && (
                <div style={{ padding: '0.85rem 1rem', backgroundColor: '#FAF5EE', borderLeft: '3px solid var(--accent-emerald)', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    🏆 Awarded by Mid-Level Admin Final Call
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-espresso)' }}>
                    Custody Awarded To: {item.awardedTo.userName} at £{item.awardedTo.winningBid?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                    "{item.awardedTo.adminNotes}"
                  </div>
                </div>
              )}

              {/* Description & Provenance Note */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-espresso)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Historical Narrative
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#FAF7F2', borderLeft: '3px solid var(--accent-brass)', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.825rem', color: 'var(--text-espresso)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={14} color="var(--accent-brass)" /> Documented Provenance
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-body)', fontStyle: 'italic', margin: 0 }}>
                  "{item.provenance}"
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  Certificate ID: {item.certificateNo || 'HA-1888-TS-0491'}
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div>
              {reservedSuccess && (
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(27, 77, 62, 0.1)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} /> Private Viewing Reserved! A Heritage Specialist will contact you within 24 hours.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: isAuction ? '1fr 1.3fr' : '1fr 1fr', gap: '1rem' }}>
                <button
                  onClick={handleReserve}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                >
                  Reserve Inspection
                </button>

                {isAuction ? (
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenBidding) onOpenBidding(item);
                    }}
                    className="btn-primary"
                    style={{
                      fontSize: '0.8rem',
                      backgroundColor: isAwarded ? 'var(--text-espresso)' : 'var(--accent-brass)',
                      color: isAwarded ? '#FAF7F2' : '#1E1714',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Gavel size={16} /> {isAwarded ? 'View Final Call Record' : 'Place Live Bid'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onAddToCart(item);
                      onClose();
                    }}
                    className="btn-primary"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <ShoppingBag size={16} /> Acquire Artifact
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
