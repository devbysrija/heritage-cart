import React from 'react';
import { Compass, Mail, MapPin, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Footer({ onOpenAppraisal }) {
  return (
    <footer style={{ backgroundColor: 'var(--text-espresso)', color: '#FAF7F2', paddingTop: '4rem', paddingBottom: '2rem', borderTop: '1px solid var(--accent-brass)' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Compass size={24} color="var(--accent-brass)" />
              <h3 className="brand-font" style={{ fontSize: '1.3rem', color: '#FAF7F2', letterSpacing: '0.15em', margin: 0 }}>
                HERITAGE <span style={{ color: 'var(--accent-brass)' }}>& CO.</span>
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#D5C8B8', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Curators of rare 17th-19th century horology, cartography, estate jewels, and hand-bound manuscripts. Established in Fleet Street, London in 1884.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-brass)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} /> Verified Vault Provenance System
            </div>
          </div>

          {/* Contact & Vault Address */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#FAF7F2', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
              London Atelier & Vault
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#D5C8B8', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--accent-brass)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <span>74 Fleet Street, City of London<br />EC4Y 1BJ, United Kingdom</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--accent-brass)" />
                <span>+44 (0)20 7946 0884</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--accent-brass)" />
                <span>curator@heritage-antiques-london.com</span>
              </li>
            </ul>
          </div>

          {/* Archival Categories */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#FAF7F2', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
              Curated Collections
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#D5C8B8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>• Navigational & Maritime Instruments</li>
              <li>• Victorian & Georgian Horology</li>
              <li>• Folio Maps & Leather Manuscripts</li>
              <li>• Royal Estate Emeralds & Diamonds</li>
              <li>• George II Mahogany Furniture</li>
            </ul>
          </div>

          {/* Appraisal & Journal Newsletter */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#FAF7F2', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
              Archival Journal
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#D5C8B8', lineHeight: 1.5, marginBottom: '1rem' }}>
              Subscribe to receive private vault catalog releases and antique market appraisal reports.
            </p>

            <button
              onClick={onOpenAppraisal}
              className="btn-brass"
              style={{ width: '100%', fontSize: '0.8rem', padding: '0.75rem' }}
            >
              Request Master Valuation <ArrowRight size={14} />
            </button>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div style={{ borderTop: '1px solid rgba(226, 215, 199, 0.15)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: '#8C7E74' }}>
          <div>
            © 1884–2026 HERITAGE & CO. ANTIQUES PLATFORM. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>PRIVACY POLICY</span>
            <span>PROVENANCE CHARTER</span>
            <span>MONGODB ATLAS ESCROW</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
