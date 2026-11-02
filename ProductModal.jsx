import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Award, ShoppingBag, Compass, CheckCircle2, FileText } from 'lucide-react';

export default function ProductModal({ item, onClose, onAddToCart }) {
  if (!item) return null;

  const [activeImage, setActiveImage] = useState(item.imageUrl);
  const [reservedSuccess, setReservedSuccess] = useState(false);

  const handleReserve = () => {
    setReservedSuccess(true);
    setTimeout(() => {
      setReservedSuccess(false);
    }, 4000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-parchment)',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid var(--border-delicate)',
          boxShadow: 'var(--shadow-hover)',
          position: 'relative',
          padding: '2rem'
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
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge-era">{item.century}</span>
                <span className="badge-rarity">{item.rarity}</span>
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
                  Acquisition Valuation
                </div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
                  £{item.price?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-mahogany)', marginTop: '0.2rem' }}>
                  Auction Estimate: {item.estimatedValue || '£5,000 - £6,000'}
                </div>
              </div>

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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  onClick={handleReserve}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                >
                  Reserve Inspection
                </button>

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
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
