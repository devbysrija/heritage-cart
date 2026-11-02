import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ShieldCheck, Feather, Clock, CheckCircle2, XCircle, Award, Printer, Gavel, ArrowUpRight } from 'lucide-react';

export default function CustomerDashboardModal({
  isOpen,
  onClose,
  user,
  backendUrl,
  onViewCertificate,
  onClaimAwardedLot,
  onOpenBidding
}) {
  if (!isOpen || !user) return null;

  const [tab, setTab] = useState('bids'); // 'bids' | 'appraisals' | 'orders'
  const [orders, setOrders] = useState([]);
  const [appraisals, setAppraisals] = useState([]);
  const [userBids, setUserBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const ordRes = await fetch(`${backendUrl}/api/orders?email=${encodeURIComponent(user.email)}`);
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData);
      }

      const appRes = await fetch(`${backendUrl}/api/appraisals?email=${encodeURIComponent(user.email)}`);
      if (appRes.ok) {
        const appData = await appRes.json();
        setAppraisals(appData);
      }

      const bidsRes = await fetch(`${backendUrl}/api/bids?email=${encodeURIComponent(user.email)}`);
      if (bidsRes.ok) {
        const bidsData = await bidsRes.json();
        setUserBids(bidsData);
      }
    } catch (err) {
      console.warn('Dashboard fetch fallback:', err);
    } finally {
      setLoading(false);
    }
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

        {/* Customer Header Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-delicate)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-brass)', fontWeight: 700 }}>
              Private Vault Portfolio
            </div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-espresso)', margin: 0 }}>
              {user.name}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Collector Account: {user.email}
            </div>
          </div>

          <button onClick={fetchUserData} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
            🔄 Refresh Records
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-delicate)' }}>
          <button
            onClick={() => setTab('bids')}
            style={{
              padding: '0.66rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'bids' ? '2px solid var(--accent-brass)' : 'none',
              fontWeight: tab === 'bids' ? 700 : 500,
              color: tab === 'bids' ? 'var(--text-espresso)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
          >
            <Gavel size={16} color="var(--accent-brass)" /> My Active Bids & Awards ({userBids.length})
          </button>

          <button
            onClick={() => setTab('appraisals')}
            style={{
              padding: '0.66rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'appraisals' ? '2px solid var(--accent-brass)' : 'none',
              fontWeight: tab === 'appraisals' ? 700 : 500,
              color: tab === 'appraisals' ? 'var(--text-espresso)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
          >
            <Feather size={16} color="var(--accent-brass)" /> Submitted Appraisals ({appraisals.length})
          </button>

          <button
            onClick={() => setTab('orders')}
            style={{
              padding: '0.66rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'orders' ? '2px solid var(--accent-brass)' : 'none',
              fontWeight: tab === 'orders' ? 700 : 500,
              color: tab === 'orders' ? 'var(--text-espresso)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
          >
            <ShoppingBag size={16} color="var(--accent-emerald)" /> Acquisitions & Certificates ({orders.length})
          </button>
        </div>

        {/* TAB: MY BIDS & AWARDS */}
        {tab === 'bids' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading your auction records...</div>
            ) : userBids.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-delicate)' }}>
                <Gavel size={32} color="var(--border-delicate)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-espresso)' }}>No auction bids submitted yet.</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Explore the Live Bidding Salon to place binding offers on authenticated rare antiques.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {userBids.map((b) => {
                  const isWon = b.status === 'awarded';
                  const isLeading = b.status === 'leading';
                  const isOutbid = b.status === 'outbid';

                  return (
                    <div
                      key={b._id}
                      style={{
                        padding: '1.25rem',
                        backgroundColor: isWon ? '#FAF5EE' : 'var(--bg-card)',
                        border: isWon ? '2px solid var(--accent-emerald)' : '1px solid var(--border-delicate)',
                        boxShadow: 'var(--shadow-gallery)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          {b.antiqueImageUrl && (
                            <div style={{ width: '60px', height: '60px', backgroundColor: '#1E1714', overflow: 'hidden', flexShrink: 0 }}>
                              <img src={b.antiqueImageUrl} alt={b.antiqueTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                          <div>
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-espresso)', margin: '0 0 0.2rem 0' }}>
                              {b.antiqueTitle}
                            </h3>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Your Offer: <strong style={{ color: 'var(--text-espresso)' }}>£{b.amount?.toLocaleString()}</strong> • Placed {new Date(b.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div>
                          {isWon && (
                            <span style={{ backgroundColor: 'rgba(27, 77, 62, 0.15)', color: 'var(--accent-emerald)', border: '1px solid var(--accent-emerald)', padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Award size={14} /> Won by Final Call
                            </span>
                          )}
                          {isLeading && (
                            <span style={{ backgroundColor: 'rgba(197, 154, 78, 0.15)', color: 'var(--accent-brass-hover)', border: '1px solid var(--accent-brass)', padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <CheckCircle2 size={14} /> Currently Leading Offer
                            </span>
                          )}
                          {isOutbid && (
                            <span style={{ backgroundColor: 'rgba(110, 44, 28, 0.12)', color: 'var(--accent-mahogany)', border: '1px solid var(--accent-mahogany)', padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <XCircle size={14} /> Outbid by Another Collector
                            </span>
                          )}
                        </div>
                      </div>

                      {b.note && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-body)', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                          Collector Statement: "{b.note}"
                        </div>
                      )}

                      {/* CONGRATULATIONS AND CLAIM BANNER IF AWARDED */}
                      {isWon && (
                        <div style={{ marginTop: '0.75rem', padding: '0.85rem 1rem', backgroundColor: '#FAF7F2', border: '1px solid var(--accent-brass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-espresso)' }}>
                              🎉 Final Call Award Confirmed by Mid-Level Admin!
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              This antique has been exclusively reserved for you at your winning bid price of £{b.amount?.toLocaleString()}.
                            </div>
                          </div>

                          {onClaimAwardedLot && (
                            <button
                              onClick={() => onClaimAwardedLot(b)}
                              className="btn-primary"
                              style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <ShoppingBag size={14} /> Claim Lot & Proceed to Vault Escrow
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: MY SUBMITTED APPRAISALS */}
        {tab === 'appraisals' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Fetching your appraisal submissions...</div>
            ) : appraisals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-delicate)' }}>
                <Feather size={32} color="var(--border-delicate)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-espresso)' }}>No appraisal requests submitted yet.</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Use the "Request Appraisal" button to submit an antique for valuation by Heritage Master Appraisers.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {appraisals.map((app, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-delicate)',
                      boxShadow: 'var(--shadow-gallery)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div>
                        <span className="badge-era" style={{ marginBottom: '0.3rem' }}>{app.category} • {app.approxAge}</span>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-espresso)', margin: '0.2rem 0' }}>
                          {app.itemTitle}
                        </h3>
                      </div>

                      {/* Status Badges */}
                      <div>
                        {app.status === 'Accepted & Valued' && (
                          <span style={{ backgroundColor: 'rgba(27, 77, 62, 0.12)', color: 'var(--accent-emerald)', border: '1px solid var(--accent-emerald)', padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle2 size={14} /> Accepted & Valued
                          </span>
                        )}
                        {app.status === 'Rejected' && (
                          <span style={{ backgroundColor: 'rgba(110, 44, 28, 0.12)', color: 'var(--accent-mahogany)', border: '1px solid var(--accent-mahogany)', padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <XCircle size={14} /> Acquisition Declined
                          </span>
                        )}
                        {(!app.status || app.status === 'Pending Review') && (
                          <span style={{ backgroundColor: 'rgba(197, 154, 78, 0.15)', color: 'var(--accent-brass-hover)', border: '1px solid var(--accent-brass)', padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Clock size={14} /> Pending Curator Review
                          </span>
                        )}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                      {app.details}
                    </p>

                    <div style={{ padding: '0.85rem 1rem', backgroundColor: '#FAF7F2', borderLeft: '3px solid var(--accent-brass)' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', fontWeight: 700, marginBottom: '0.2rem' }}>
                        Curator Valuation Report
                      </div>
                      <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--accent-brass-hover)' }}>
                        {app.estimatedValueOffer || 'Awaiting Senior Appraiser Consultation'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                        Notes: "{app.appraiserNotes || 'Physical inspection queue at Fleet Street Vaults.'}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACQUISITION ORDERS & CERTIFICATES */}
        {tab === 'orders' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading purchase history...</div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-delicate)' }}>
                <ShoppingBag size={32} color="var(--border-delicate)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-espresso)' }}>No acquisitions recorded under this email address.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {orders.map((ord, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '1.25rem',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-delicate)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-delicate)', paddingBottom: '0.5rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-espresso)' }}>Order Ref: {ord.orderNumber}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Date: {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--accent-brass)' }}>
                          £{ord.totalAmount?.toLocaleString()}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                          <ShieldCheck size={12} style={{ display: 'inline' }} /> Vault Escrowed
                        </span>
                      </div>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      {ord.items?.map((item, itemIdx) => (
                        <div key={itemIdx} style={{ fontSize: '0.85rem', color: 'var(--text-body)', display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span>• {item.title}</span>
                          <span style={{ fontStyle: 'italic', color: 'var(--accent-brass)' }}>Cert Serial: {item.certificateNo || 'HA-CERTIFIED'}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => onViewCertificate(ord)}
                      className="btn-secondary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem' }}
                    >
                      <Printer size={14} /> View Certificate of Authenticity
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
