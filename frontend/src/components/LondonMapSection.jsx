import React, { useState } from 'react';
import { MapPin, Compass, Eye, ArrowRight, ExternalLink } from 'lucide-react';

const mapLocations = [
  {
    id: 'fleet-street',
    name: 'Fleet Street Navigational Guild',
    area: 'London EC4Y',
    top: '42%',
    left: '52%',
    artifactTitle: '1888 Maritime Brass Navigational Sextant',
    artifactYear: 1888,
    artifactPrice: '£4,850',
    category: 'Instruments & Cartography',
    historyNote: 'Home to London’s master instrument makers Troughton & Simms. Known for calibrating royal naval scopes during the late Victorian maritime expansion.'
  },
  {
    id: 'bloomsbury',
    name: 'Bloomsbury Horology Vaults',
    area: 'London WC1B',
    top: '32%',
    left: '42%',
    artifactTitle: 'Victorian 18k Gold Skeleton Pocket Watch',
    artifactYear: 1892,
    artifactPrice: '£8,900',
    category: 'Horology',
    historyNote: 'Famous for precision clockmaking ateliers supplying the Royal Astronomical Society and Parliament.'
  },
  {
    id: 'strand',
    name: 'The Strand Cartographic Press',
    area: 'London WC2R',
    top: '48%',
    left: '46%',
    artifactTitle: '1795 Hand-Colored Folio World Atlas',
    artifactYear: 1795,
    artifactPrice: '£12,400',
    category: 'Leather Books & Manuscripts',
    historyNote: 'Royal engraver John Cary operated here in 1795, publishing copperplate maps commissioned by King George III.'
  },
  {
    id: 'mayfair',
    name: 'Mayfair Gemstone Atelier',
    area: 'London W1J',
    top: '50%',
    left: '28%',
    artifactTitle: 'Georgian 1820 Royal Emerald & Diamond Ring',
    artifactYear: 1820,
    artifactPrice: '£16,500',
    category: 'Estate Jewelry',
    historyNote: 'Renowned for handcrafting foil-backed crown jewels for British aristocracy during the Regency era.'
  },
  {
    id: 'greenwich',
    name: 'Greenwich Observatory Guild',
    area: 'London SE10',
    top: '65%',
    left: '78%',
    artifactTitle: '1845 Desktop Refractor Brass Telescope',
    artifactYear: 1845,
    artifactPrice: '£3,600',
    category: 'Instruments',
    historyNote: 'Optical glass testing ground for John Dollond telescopes aligned with the Prime Meridian line.'
  },
  {
    id: 'kensington',
    name: 'Kensington Cabinetmaker Studio',
    area: 'London W8',
    top: '55%',
    left: '18%',
    artifactTitle: '1740 Chippendale Mahogany Writing Desk',
    artifactYear: 1740,
    artifactPrice: '£24,000',
    category: 'Fine Furniture',
    historyNote: 'Artisan workshop producing Cuban mahogany desk masterpieces with hand-carved cabriole legs.'
  }
];

export default function LondonMapSection({ onSelectArtifact }) {
  const [selectedLoc, setSelectedLoc] = useState(mapLocations[0]);

  return (
    <section style={{ backgroundColor: 'var(--bg-card)', padding: '4rem 1.5rem', borderBottom: '1px solid var(--border-delicate)' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-brass)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
            <Compass size={14} /> Provenance & Historical Origins
          </div>
          <h2 style={{ fontSize: '2.4rem', color: 'var(--text-espresso)', marginBottom: '0.75rem' }}>
            London’s Old Town District Map
          </h2>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Explore the historical workshops, guild halls, and antiquarian vaults across 18th & 19th-century London where our authenticated artifacts originated.
          </p>
        </div>

        {/* Map Container & Detail Panel Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* Sepia London Map Canvas */}
          <div style={{
            position: 'relative',
            borderRadius: '4px',
            border: '1px solid var(--border-delicate)',
            boxShadow: 'var(--shadow-gallery)',
            overflow: 'hidden',
            backgroundColor: '#FAF7F2'
          }}>
            <img
              src="/images/london_map.jpg"
              alt="Sepia Hand-Drawn Map of London Old Town District"
              style={{ width: '100%', height: '520px', objectFit: 'cover', filter: 'sepia(0.3) contrast(1.05)' }}
            />

            {/* Decorative Compass Overlay */}
            <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.6rem 1rem', backgroundColor: 'rgba(250, 247, 242, 0.9)', border: '1px solid var(--border-delicate)', fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', color: 'var(--text-espresso)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} color="var(--accent-brass)" /> LONDON OLD TOWN (1884)
            </div>

            {/* Pinpoint Hotspots */}
            {mapLocations.map((loc) => {
              const isActive = selectedLoc?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLoc(loc)}
                  style={{
                    position: 'absolute',
                    top: loc.top,
                    left: loc.left,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: isActive ? 'var(--text-espresso)' : 'var(--accent-brass)',
                    color: '#FAF7F2',
                    border: '2px solid #FAF7F2',
                    borderRadius: '50%',
                    width: isActive ? '36px' : '28px',
                    height: isActive ? '36px' : '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'var(--transition-smooth)',
                    zIndex: isActive ? 10 : 2
                  }}
                  title={`${loc.name} - Click to inspect provenance`}
                >
                  <MapPin size={isActive ? 18 : 14} color={isActive ? 'var(--accent-brass)' : '#1E1714'} />
                </button>
              );
            })}

          </div>

          {/* Location Provenance Panel */}
          {selectedLoc && (
            <div style={{
              backgroundColor: 'var(--bg-parchment)',
              border: '1px solid var(--border-delicate)',
              padding: '2rem',
              boxShadow: 'var(--shadow-gallery)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-brass)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                <MapPin size={14} /> Provenance Vault Record
              </div>

              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-espresso)', marginBottom: '0.25rem' }}>
                {selectedLoc.name}
              </h3>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                DISTRICT: {selectedLoc.area}
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {selectedLoc.historyNote}
              </p>

              {/* Associated Artifact Card Preview */}
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-delicate)', marginBottom: '1.5rem' }}>
                <div className="badge-era" style={{ marginBottom: '0.5rem' }}>
                  {selectedLoc.category} • {selectedLoc.artifactYear}
                </div>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--text-espresso)', margin: '0 0 0.4rem 0' }}>
                  {selectedLoc.artifactTitle}
                </h4>
                <div style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--accent-mahogany)' }}>
                  {selectedLoc.artifactPrice}
                </div>
              </div>

              <button
                onClick={() => onSelectArtifact(selectedLoc.artifactTitle)}
                className="btn-primary"
                style={{ width: '100%', fontSize: '0.8rem' }}
              >
                Inspect Artifact in Catalog <ArrowRight size={14} />
              </button>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
