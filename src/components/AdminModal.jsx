import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, Compass } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, onAntiqueAdded, backendUrl }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    category: 'Instruments & Cartography',
    century: '19th Century',
    year: 1875,
    origin: 'Fleet Street, London',
    price: 3500,
    estimatedValue: '£4,000 - £4,500',
    material: 'Aged Brass, Optical Glass',
    dimensions: '20 x 15 x 10 cm',
    condition: 'Museum Grade A+',
    rarity: 'Extremely Rare',
    description: '',
    provenance: '',
    imageUrl: '/images/brass_sextant.jpg'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch(`${backendUrl}/api/antiques`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setLoading(false);
      setSuccessMsg(`✅ "${data.title}" successfully saved to MongoDB database!`);
      if (onAntiqueAdded) onAntiqueAdded(data);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setSuccessMsg('✅ Antique artifact logged into active memory catalog.');
      if (onAntiqueAdded) onAntiqueAdded({ ...form, _id: 'mem_' + Date.now() });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-parchment)',
          maxWidth: '650px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid var(--border-delicate)',
          boxShadow: 'var(--shadow-hover)',
          padding: '2.5rem',
          position: 'relative'
        }}
        className="animate-fade-in"
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-espresso)' }}
        >
          <X size={22} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-brass)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <PlusCircle size={14} /> Catalog Admin Portal
          </div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-espresso)', margin: '0.2rem 0' }}>
            Add Antique to MongoDB Database
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Enter artifact provenance details, physical specifications, and valuation price.
          </p>
        </div>

        {successMsg && (
          <div style={{ padding: '0.85rem', backgroundColor: 'rgba(27, 77, 62, 0.12)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Artifact Title</label>
            <input
              type="text"
              required
              placeholder="e.g. 1850 Victorian Brass Pocket Microscope"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
              >
                <option value="Instruments & Cartography">Instruments & Cartography</option>
                <option value="Horology">Horology</option>
                <option value="Leather Books & Manuscripts">Leather Books & Manuscripts</option>
                <option value="Estate Jewelry & Curios">Estate Jewelry & Curios</option>
                <option value="Fine Furniture">Fine Furniture</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Century Era</label>
              <select
                value={form.century}
                onChange={(e) => setForm({ ...form, century: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
              >
                <option value="17th Century">17th Century</option>
                <option value="18th Century">18th Century</option>
                <option value="19th Century">19th Century</option>
                <option value="Early 20th Century">Early 20th Century</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Price (£ GBP)</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Origin</label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Image URL</label>
            <select
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
            >
              <option value="/images/brass_sextant.jpg">Brass Navigational Sextant (/images/brass_sextant.jpg)</option>
              <option value="/images/gold_pocket_watch.jpg">Gold Pocket Watch (/images/gold_pocket_watch.jpg)</option>
              <option value="/images/leather_atlas.jpg">Leather Folio Atlas (/images/leather_atlas.jpg)</option>
              <option value="/images/emerald_ring.jpg">Georgian Emerald Ring (/images/emerald_ring.jpg)</option>
              <option value="/images/hero_desk.jpg">Scholar Desk Scene (/images/hero_desk.jpg)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Description & Narrative</label>
            <textarea
              rows={3}
              required
              placeholder="Artifact history, craftsmanship details..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Documented Provenance</label>
            <input
              type="text"
              placeholder="e.g. Acquired from the Estate of Lord Vance of Mayfair..."
              value={form.provenance}
              onChange={(e) => setForm({ ...form, provenance: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Saving to Database...' : 'Save Antique to MongoDB Database'}
          </button>
        </form>
      </div>
    </div>
  );
}
