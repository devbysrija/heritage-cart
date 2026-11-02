/**
 * Heritage Antiques Platform - Live Bidding Salon Modal
 * Signed by srh
 */
import React, { useState, useEffect } from 'react';
import { X, Gavel, ShieldCheck, Clock, Award, CheckCircle2, AlertCircle, ArrowUpRight, User, FileText, Send, Sparkles } from 'lucide-react';

export default function BiddingModal({
  isOpen,
  onClose,
  item,
  currentUser,
  backendUrl,
  onBidPlaced,
  onOpenAuth
}) {
  if (!isOpen || !item) return null;

  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [collectorNote, setCollectorNote] = useState('');
  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  const minIncrement = item.bidIncrement || 100;
  const currentLeadAmount = item.currentBid || item.startingBid || item.price || 1000;
  const minRequiredBid = item.currentBid ? item.currentBid + minIncrement : (item.startingBid || item.price);

  useEffect(() => {
    fetchBids();
    setBidAmount(minRequiredBid.toString());
    setFeedback(null);
  }, [item]);

  useEffect(() => {
    if (currentUser) {
      setGuestName(currentUser.name);
      setGuestEmail(currentUser.email);
    }
  }, [currentUser]);

  const fetchBids = async () => {
    setLoadingBids(true);
    try {
      const res = await fetch(`${backendUrl}/api/bids?antiqueId=${item._id}`);
      if (res.ok) {
        const data = await res.json();
        setBids(data);
      }
    } catch (err) {
      console.warn('Error fetching bids:', err);
    } finally {
      setLoadingBids(false);
    }
  };

  const handleIncrement = (increment) => {
    const base = Number(bidAmount) || minRequiredBid;
    setBidAmount((base + increment).toString());
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const name = currentUser?.name || guestName.trim();
    const email = currentUser?.email || guestEmail.trim();
    const amount = Number(bidAmount);

    if (!name || !email) {
      setFeedback({ type: 'error', message: 'Please provide your collector name and email to place an authenticated bid.' });
      return;
    }

    if (isNaN(amount) || amount < minRequiredBid) {
      setFeedback({
        type: 'error',
        message: `Your bid must be at least £${minRequiredBid.toLocaleString()} (minimum increment: £${minIncrement.toLocaleString()}).`
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${backendUrl}/api/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          antiqueId: item._id,
          bidder: {
            userId: currentUser?._id || '',
            name,
            email
          },
          amount,
          note: collectorNote
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Failed to register bid.' });
      } else {
        setFeedback({
          type: 'success',
          message: `Congratulations! Your offer of £${amount.toLocaleString()} is now the LEADING bid!`
        });
        setCollectorNote('');
        fetchBids();
        if (onBidPlaced) onBidPlaced(data.antique, data.bid);
        setBidAmount((amount + minIncrement).toString());
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error communicating with the Vault. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const isAwarded = item.auctionStatus === 'awarded';
  const isCuratorReview = item.auctionStatus === 'curator_review';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-parchment)',
          maxWidth: '960px',
          width: '100%',
          maxHeight: '92vh',
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
            padding: '0.4rem'
          }}
        >
          <X size={22} />
        </button>

        {/* Header Ribbon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-delicate)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-brass)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              <Gavel size={15} /> Heritage Salon • Live Public Auction
            </div>
            <h2 style={{ fontSize: '1.65rem', color: 'var(--text-espresso)', margin: '0.2rem 0' }}>
              {item.title}
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Lot Ref: <strong>{item.certificateNo || 'HA-VAULT-LOT'}</strong> • {item.origin} (Circa {item.year})
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            {isAwarded ? (
              <span style={{ backgroundColor: 'rgba(27, 77, 62, 0.15)', color: 'var(--accent-emerald)', border: '1px solid var(--accent-emerald)', padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Award size={14} /> Final Call Awarded
              </span>
            ) : (
              <span style={{ backgroundColor: 'rgba(197, 154, 78, 0.15)', color: 'var(--accent-brass-hover)', border: '1px solid var(--accent-brass)', padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E', display: 'inline-block' }} /> Live Bidding Open
              </span>
            )}
          </div>
        </div>

        {/* AWARD BANNER IF FINAL CALL WAS MADE */}
        {isAwarded && item.awardedTo && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#FAF5EE',
              border: '2px solid var(--accent-brass)',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              boxShadow: 'var(--shadow-gallery)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--text-espresso)', color: 'var(--accent-brass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Gavel size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-brass)', fontWeight: 700 }}>
                  Official Final Call Executed
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-espresso)' }}>
                  Awarded to: <span style={{ color: 'var(--accent-emerald)' }}>{item.awardedTo.userName}</span> at £{item.awardedTo.winningBid?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-body)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                  "{item.awardedTo.adminNotes}"
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', minWidth: '180px' }}>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Decided by Arbiter
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-espresso)' }}>
                {item.awardedTo.adminDecidedBy || 'Arthur Wellesley (Mid-Level Admin)'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {item.awardedTo.awardedAt ? new Date(item.awardedTo.awardedAt).toLocaleDateString() : 'Curator Record Sealed'}
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Main Workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem' }}>
          
          {/* Left Column: Artifact Overview & Live Bid Book */}
          <div>
            
            {/* Visual Box & Lead Bid Box */}
            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', backgroundColor: 'var(--bg-card)', padding: '1rem', border: '1px solid var(--border-delicate)' }}>
              <div style={{ width: '130px', height: '130px', backgroundColor: '#1E1714', overflow: 'hidden', flexShrink: 0 }}>
                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                  Current Leading Offer
                </div>
                <div style={{ fontSize: '2.1rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)', lineHeight: 1.1 }}>
                  £{(item.currentBid || item.startingBid || item.price)?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-mahogany)', marginTop: '0.2rem' }}>
                  Starting Price: £{(item.startingBid || item.price)?.toLocaleString()} • Min Increment: £{minIncrement}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={13} /> {item.reservePrice && item.currentBid >= item.reservePrice ? 'Reserve Met' : 'Under Vault Guarantee'}
                </div>
              </div>
            </div>

            {/* Historical Narrative Brief */}
            <div style={{ marginBottom: '1.5rem', fontSize: '0.825rem', color: 'var(--text-body)', lineHeight: 1.55 }}>
              <p style={{ margin: '0 0 0.5rem 0' }}>{item.description}</p>
              <div style={{ padding: '0.6rem 0.8rem', backgroundColor: '#FAF7F2', borderLeft: '3px solid var(--accent-brass)', fontSize: '0.78rem', fontStyle: 'italic' }}>
                Provenance: "{item.provenance}"
              </div>
            </div>

            {/* Bidding Activity Stream */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} color="var(--accent-brass)" /> Official Bidding Log ({bids.length} Offers)
                </h4>
                <button onClick={fetchBids} style={{ background: 'none', border: 'none', color: 'var(--accent-brass)', fontSize: '0.72rem', cursor: 'pointer', textDecoration: 'underline' }}>
                  Refresh Log
                </button>
              </div>

              {loadingBids ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Consulting Fleet Street auction records...
                </div>
              ) : bids.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-delicate)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  No collector offers logged yet. Be the first to open bidding!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {bids.map((b) => (
                    <div
                      key={b._id}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: b.status === 'awarded' ? '#FAF5EE' : (b.status === 'leading' ? '#F7F4EE' : 'var(--bg-card)'),
                        border: b.status === 'awarded' ? '1px solid var(--accent-emerald)' : (b.status === 'leading' ? '1px solid var(--accent-brass)' : '1px solid var(--border-delicate)'),
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-espresso)' }}>
                            {b.bidder.name}
                          </span>
                          {b.status === 'awarded' && (
                            <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--accent-emerald)', color: '#FAF7F2', padding: '0.1rem 0.4rem', fontWeight: 700, textTransform: 'uppercase' }}>
                              🏆 Won by Final Call
                            </span>
                          )}
                          {b.status === 'leading' && (
                            <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--accent-brass)', color: '#1E1714', padding: '0.1rem 0.4rem', fontWeight: 700, textTransform: 'uppercase' }}>
                              Leading Offer
                            </span>
                          )}
                          {b.status === 'outbid' && (
                            <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(110,44,28,0.1)', color: 'var(--accent-mahogany)', padding: '0.1rem 0.4rem', textTransform: 'uppercase' }}>
                              Outbid
                            </span>
                          )}
                        </div>
                        {b.note && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.15rem' }}>
                            "{b.note}"
                          </div>
                        )}
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(b.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
                          £{b.amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Bid Submission Console */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', border: '1px solid var(--border-delicate)' }}>
            
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-espresso)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Send size={16} color="var(--accent-brass)" /> Place Collector Bid
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              All bids are verified with the Heritage Vault Escrow. Final determination of award is made by the Mid-Level Auction Administrator.
            </p>

            {isAwarded ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#FAF7F2', border: '1px solid var(--border-delicate)' }}>
                <Award size={36} color="var(--accent-brass)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '1.1rem', color: 'var(--text-espresso)', marginBottom: '0.3rem' }}>
                  Auction Concluded
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  The Mid-Level Administrator has executed the final call on this lot. Bidding is now closed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBid} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Collector Identity */}
                {currentUser ? (
                  <div style={{ padding: '0.75rem', backgroundColor: '#FAF7F2', border: '1px solid var(--border-delicate)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-brass)', fontWeight: 700 }}>
                        Bidding as Authenticated Collector
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-espresso)' }}>
                        {currentUser.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                    </div>
                    <User size={18} color="var(--accent-brass)" />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                        Your Full Name / Estate *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lord Edward Harrington"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', fontSize: '0.825rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. collector@mayfair-estate.co.uk"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', fontSize: '0.825rem' }}
                      />
                    </div>
                  </div>
                )}

                {/* Bid Amount Input */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', fontWeight: 700 }}>
                      Bid Amount (£ GBP) *
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-brass)', fontWeight: 600 }}>
                      Min Next Bid: £{minRequiredBid.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-espresso)', fontWeight: 700 }}>
                      £
                    </span>
                    <input
                      type="number"
                      required
                      min={minRequiredBid}
                      step="50"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem 0.65rem 2rem',
                        fontSize: '1.25rem',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 700,
                        border: '1px solid var(--border-delicate)',
                        backgroundColor: '#FAF7F2',
                        color: 'var(--text-espresso)'
                      }}
                    />
                  </div>

                  {/* Quick Increment Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                    {[minIncrement, minIncrement * 2, 500, 1000].map((inc, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleIncrement(inc)}
                        style={{
                          flex: 1,
                          padding: '0.35rem 0.2rem',
                          backgroundColor: '#FAF7F2',
                          border: '1px solid var(--border-delicate)',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                          color: 'var(--text-espresso)'
                        }}
                      >
                        +{inc >= 1000 ? `£${inc / 1000}k` : `£${inc}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collector Provenance / Statement Note */}
                <div>
                  <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Collector Statement / Acquisition Purpose (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Acquiring for private gallery restoration or family estate collection..."
                    value={collectorNote}
                    onChange={(e) => setCollectorNote(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', fontSize: '0.78rem', resize: 'vertical' }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Reviewed by the Mid-Level Admin when executing the final call decision.
                  </span>
                </div>

                {/* Feedback Alerts */}
                {feedback && (
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: feedback.type === 'success' ? 'rgba(27, 77, 62, 0.1)' : 'rgba(110, 44, 28, 0.1)',
                      border: `1px solid ${feedback.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-mahogany)'}`,
                      color: feedback.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-mahogany)'
                    }}
                  >
                    {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{feedback.message}</span>
                  </div>
                )}

                {/* Submit Bid Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: submitting ? 'wait' : 'pointer'
                  }}
                >
                  <Gavel size={16} /> {submitting ? 'Registering Offer with Vault...' : `Submit Binding Bid (£${Number(bidAmount || 0).toLocaleString()})`}
                </button>

                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                  White-glove courier inspection reserved upon mid-level admin confirmation.
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
