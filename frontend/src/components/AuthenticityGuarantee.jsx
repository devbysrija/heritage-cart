import React from 'react';
import { ShieldCheck, Compass, Award, Search, Lock, CheckCircle2 } from 'lucide-react';

export default function AuthenticityGuarantee() {
  return (
    <section style={{ backgroundColor: 'var(--bg-card)', padding: '5rem 1.5rem', borderBottom: '1px solid var(--border-delicate)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
            <ShieldCheck size={16} /> Heritage Vault Verification Standard
          </div>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-espresso)', marginBottom: '0.75rem' }}>
            Our 4-Stage Authenticity Guarantee
          </h2>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Every piece offered by Heritage & Co. undergoes rigorous archival forensic examination before receiving its tamper-evident Certificate of Authenticity.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          
          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-parchment)', border: '1px solid var(--border-delicate)', boxShadow: 'var(--shadow-gallery)' }}>
            <div style={{ width: '48px', height: '48px', border: '1px solid var(--accent-brass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-brass)', marginBottom: '1.25rem' }}>
              <Search size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-espresso)', marginBottom: '0.5rem' }}>
              1. Physical & Material Analysis
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
              Spectrographic metal analysis, wood grain dating, and optical lens inspection to confirm period authenticity.
            </p>
          </div>

          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-parchment)', border: '1px solid var(--border-delicate)', boxShadow: 'var(--shadow-gallery)' }}>
            <div style={{ width: '48px', height: '48px', border: '1px solid var(--accent-brass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-brass)', marginBottom: '1.25rem' }}>
              <Compass size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-espresso)', marginBottom: '0.5rem' }}>
              2. Maker Stamp Verification
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
              Cross-referenced with Guild Archives (Fleet Street, Bloomsbury, Strand) for original master artisan signatures.
            </p>
          </div>

          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-parchment)', border: '1px solid var(--border-delicate)', boxShadow: 'var(--shadow-gallery)' }}>
            <div style={{ width: '48px', height: '48px', border: '1px solid var(--accent-brass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-brass)', marginBottom: '1.25rem' }}>
              <Award size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-espresso)', marginBottom: '0.5rem' }}>
              3. Provenance Chain Audit
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
              Unbroken ownership documentation verified across noble estate sales, museum loans, and private library registries.
            </p>
          </div>

          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-parchment)', border: '1px solid var(--border-delicate)', boxShadow: 'var(--shadow-gallery)' }}>
            <div style={{ width: '48px', height: '48px', border: '1px solid var(--accent-brass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-brass)', marginBottom: '1.25rem' }}>
              <Lock size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-espresso)', marginBottom: '0.5rem' }}>
              4. Sealed Vault Certificate
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
              Includes official wax-sealed Certificate of Authenticity backed by our 100% Lifetime Money-Back Guarantee.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
