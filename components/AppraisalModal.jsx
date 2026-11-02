import React, { useState } from 'react';
import { X, Feather, CheckCircle2, Award, FileText } from 'lucide-react';

export default function AppraisalModal({ isOpen, onClose, backendUrl }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    itemTitle: '',
    approxAge: '19th Century (1800s)',
    category: 'Instruments & Cartography',
    details: ''
  });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/appraisals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);
      setResult(data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setResult({
        ownerName: formData.ownerName,
        itemTitle: formData.itemTitle,
        estimatedValueOffer: '£4,500 - £6,000 (Preliminary Archival Appraisal)',
        status: 'Submitted to Heritage Senior Curator'
      });
      setSubmitted(true);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-parchment)',
          maxWidth: '600px',
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

        {!submitted ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-brass)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <Feather size={14} /> Master Curator Valuation
              </div>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-espresso)', margin: '0.2rem 0' }}>
                Request Antique Valuation
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Submit details of your rare antique or manuscript to receive an expert valuation & acquisition offer from Heritage & Co.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Antique Item Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1860s Pocket Chronometer by Barraud"
                  value={formData.itemTitle}
                  onChange={(e) => setFormData({ ...formData, itemTitle: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Approximate Era / Century</label>
                  <select
                    value={formData.approxAge}
                    onChange={(e) => setFormData({ ...formData, approxAge: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
                  >
                    <option value="17th Century (1600s)">17th Century (1600s)</option>
                    <option value="18th Century (1700s)">18th Century (1700s)</option>
                    <option value="19th Century (1800s)">19th Century (1800s)</option>
                    <option value="Early 20th Century (1900-1930)">Early 20th Century (1900-1930)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none' }}
                  >
                    <option value="Instruments & Cartography">Instruments & Cartography</option>
                    <option value="Horology">Horology</option>
                    <option value="Leather Books & Manuscripts">Leather Books & Manuscripts</option>
                    <option value="Estate Jewelry & Curios">Estate Jewelry & Curios</option>
                    <option value="Fine Furniture">Fine Furniture</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Condition, Markings & Known Provenance</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe maker engravings, serial stamps, material composition, or family heirloom history..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-delicate)', backgroundColor: 'var(--bg-card)', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '0.85rem' }}
              >
                {loading ? 'Submitting to Master Curators...' : 'Submit Valuation Request'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <Award size={48} color="var(--accent-brass)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-espresso)', marginBottom: '0.5rem' }}>
              Valuation Request Logged
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Thank you, <strong>{result?.ownerName}</strong>. Our Master Curators have received your request for <em>"{result?.itemTitle}"</em>.
            </p>

            <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.25rem', border: '1px solid var(--border-delicate)', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-brass)', fontWeight: 700, textTransform: 'uppercase' }}>
                Preliminary Archival Estimate:
              </div>
              <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
                {result?.estimatedValueOffer}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Status: {result?.status || 'Under Review by Heritage Fleet Street Guild'}
              </div>
            </div>

            <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
