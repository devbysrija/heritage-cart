import React from 'react';
import { Compass, Award, Shield, ArrowRight, BookOpen, Clock } from 'lucide-react';

export default function HeroSection({ onExploreCatalog, onExploreMap, stats }) {
  return (
    <section style={{ position: 'relative', borderBottom: '1px solid var(--border-delicate)', overflow: 'hidden' }}>
      
      {/* Main Grid Hero Layout */}
      <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '540px', alignItems: 'stretch' }}>
        
        {/* Left Column: Scholarly Content & Minimalism Typography */}
        <div style={{ padding: '4rem 3rem 4rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'var(--bg-parchment)' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="badge-era" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={13} /> CURATED PRIVATE COLLECTION • LONDON 1884
            </span>
          </div>

          <h2 style={{ fontSize: '3.2rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--text-espresso)', marginBottom: '1.5rem' }}>
            Where History <br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent-brass)', fontWeight: 400 }}>Meets Contemporary</span> Minimalism
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '520px' }}>
            Heritage & Co. offers an authenticated gallery of 17th, 18th, and 19th-century horological masterpieces, maritime instruments, and hand-bound cartography. Every piece is accompanied by a vault-certified Certificate of Authenticity.
          </p>

          {/* CTA Button Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button onClick={onExploreCatalog} className="btn-primary">
              Explore Collection <ArrowRight size={16} />
            </button>
            <button onClick={onExploreMap} className="btn-secondary">
              London Map Explorer
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-delicate)' }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
                {stats?.totalValuation || '£1.4M+'}
              </div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Catalog Valuation
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--accent-brass)' }}>
                {stats?.totalItems || '100%'}
              </div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Authenticated Vault Items
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--accent-mahogany)' }}>
                {stats?.centurySpan || '3 Centuries'}
              </div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Historic Provenance
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Warm Golden Hour Photography Presentation */}
        <div style={{ position: 'relative', minHeight: '400px', backgroundColor: '#1E1714', overflow: 'hidden' }}>
          
          <img
            src="/images/hero_desk.jpg"
            alt="Scholar Mahogany Desk with Brass Sextant, Old Books & Parchment Map"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92, filter: 'contrast(1.05) saturate(1.1)' }}
          />

          {/* Warm Golden Lighting Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(250, 247, 242, 0.4) 0%, transparent 40%, rgba(30, 23, 20, 0.6) 100%)',
            pointerEvents: 'none'
          }} />

          {/* Featured Quote Card Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            right: '2rem',
            backgroundColor: 'rgba(250, 247, 242, 0.92)',
            backdropFilter: 'blur(8px)',
            padding: '1.5rem',
            border: '1px solid var(--border-delicate)',
            boxShadow: 'var(--shadow-gallery)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-brass)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
              <Award size={14} /> Featured Historical Artifact
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-espresso)' }}>
              1888 Maritime Brass Navigational Sextant
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-body)', marginTop: '0.3rem', margin: 0, fontStyle: 'italic' }}>
              "Engraved by Troughton & Simms of Fleet Street. Precision silver scale in original mahogany case."
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
