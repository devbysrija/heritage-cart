/**
 * Heritage Antiques Platform - Mid-Level Admin Auction Desk & Final Call Console
 * Signed by srh
 */
import React, { useState, useEffect } from 'react';
import { X, Gavel, Award, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Clock, User, ChevronRight, RotateCcw, PlusCircle, Settings, Check } from 'lucide-react';

export default function AuctionDeskModal({
  isOpen,
  onClose,
  currentUser,
  backendUrl,
  onAuctionUpdated
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'awarded' | 'config'
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLot, setSelectedLot] = useState(null);
  const [lotBids, setLotBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);

  // Final Call Action State
  const [finalCallCandidate, setFinalCallCandidate] = useState(null); // The bid being awarded
  const [adminRationale, setAdminRationale] = useState(
    'Awarded by Mid-Level Auction Administrator following provenance vetting and archival storage verification.'
  );
  const [executingFinalCall, setExecutingFinalCall] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Configure Lot for Auction
  const [allAntiques, setAllAntiques] = useState([]);
  const [configLotId, setConfigLotId] = useState('');
  const [configStartingBid, setConfigStartingBid] = useState(3000);
  const [configIncrement, setConfigIncrement] = useState(150);
  const [configReserve, setConfigReserve] = useState(3500);

  useEffect(() => {
    fetchAuctionsData();
  }, []);

  useEffect(() => {
    if (selectedLot) {
      fetchBidsForLot(selectedLot._id);
    }
  }, [selectedLot]);

  const fetchAuctionsData = async () => {
    setLoading(true);
    setActionSuccessMsg('');
    try {
      const res = await fetch(`${backendUrl}/api/antiques`);
      if (res.ok) {
        const data = await res.json();
        setAllAntiques(data);
        const auctionItems = data.filter((item) => item.isAuction);
        setAuctions(auctionItems);
        if (auctionItems.length > 0 && !selectedLot) {
          setSelectedLot(auctionItems[0]);
        }
      }
    } catch (err) {
      console.warn('Error fetching auctions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBidsForLot = async (antiqueId) => {
    setLoadingBids(true);
    try {
      const res = await fetch(`${backendUrl}/api/bids?antiqueId=${antiqueId}`);
      if (res.ok) {
        const data = await res.json();
        setLotBids(data);
      }
    } catch (err) {
      console.warn('Error fetching lot bids:', err);
    } finally {
      setLoadingBids(false);
    }
  };

  const handleSelectLot = (item) => {
    setSelectedLot(item);
    setFinalCallCandidate(null);
    setActionSuccessMsg('');
  };

  const handleInitiateFinalCall = (bid) => {
    setFinalCallCandidate(bid);
    setAdminRationale(
      `Awarded to ${bid.bidder.name} (£${bid.amount.toLocaleString()}) following Mid-Level Admin archival curation assessment.`
    );
  };

  const handleExecuteFinalCall = async () => {
    if (!selectedLot || !finalCallCandidate) return;

    setExecutingFinalCall(true);
    setActionSuccessMsg('');

    try {
      const res = await fetch(`${backendUrl}/api/admin/auctions/${selectedLot._id}/final-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winningBidId: finalCallCandidate._id,
          adminNotes: adminRationale,
          decidedByName: currentUser?.name || 'Arthur Wellesley',
          decidedByEmail: currentUser?.email || 'mid.admin@heritage.co.uk',
          decidedByRole: currentUser?.role === 'admin' ? 'Senior Curator' : 'Mid-Level Auction Administrator'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setActionSuccessMsg(
          `⚖️ FINAL CALL SEALED: Lot "${selectedLot.title}" officially awarded to ${finalCallCandidate.bidder.name} at £${finalCallCandidate.amount.toLocaleString()}!`
        );
        setSelectedLot(data.antique);
        setFinalCallCandidate(null);
        fetchBidsForLot(selectedLot._id);
        fetchAuctionsData();
        if (onAuctionUpdated) onAuctionUpdated();
      } else {
        alert(data.error || 'Failed to execute final call.');
      }
    } catch (err) {
      console.error(err);
      alert('Error communicating with auction engine.');
    } finally {
      setExecutingFinalCall(false);
    }
  };

  const handleReopenLot = async () => {
    if (!selectedLot) return;
    if (!window.confirm(`Reopen bidding for "${selectedLot.title}"? This will cancel the previous final call decision.`)) return;

    try {
      const res = await fetch(`${backendUrl}/api/admin/auctions/${selectedLot._id}/reopen`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccessMsg(`Auction reopened for live bidding.`);
        setSelectedLot(data.antique);
        fetchBidsForLot(selectedLot._id);
        fetchAuctionsData();
        if (onAuctionUpdated) onAuctionUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAuctionOnAntique = async (antiqueId, isAuction) => {
    try {
      const res = await fetch(`${backendUrl}/api/admin/auctions/${antiqueId}/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isAuction,
          startingBid: Number(configStartingBid) || 2000,
          bidIncrement: Number(configIncrement) || 100,
          reservePrice: Number(configReserve) || 2500
        })
      });
      if (res.ok) {
        setActionSuccessMsg(`Lot auction status updated.`);
        fetchAuctionsData();
        if (onAuctionUpdated) onAuctionUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeAuctions = auctions.filter((a) => a.auctionStatus !== 'awarded');
  const awardedAuctions = auctions.filter((a) => a.auctionStatus === 'awarded');
  const displayedAuctions = activeTab === 'active' ? activeAuctions : (activeTab === 'awarded' ? awardedAuctions : auctions);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-parchment)',
          maxWidth: '1100px',
          width: '100%',
          maxHeight: '94vh',
          overflowY: 'auto',
          border: '1px solid var(--border-delicate)',
          boxShadow: 'var(--shadow-hover)',
          padding: '2.5rem',
          position: 'relative'
        }}
        className="animate-fade-in"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-espresso)' }}
        >
          <X size={24} />
        </button>

        {/* Console Header Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-delicate)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-brass)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              <Gavel size={16} /> Heritage Guild Arbiter Console
            </div>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--text-espresso)', margin: '0.2rem 0' }}>
              Mid-Level Administrator Auction Desk
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Authorized Arbiter: <strong>{currentUser?.name || 'Arthur Wellesley'}</strong> ({currentUser?.role === 'admin' ? 'Master Appraiser' : 'Mid-Level Auction Admin'})
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={fetchAuctionsData} className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem' }}>
              <RefreshCw size={14} /> Sync Bidding Desk
            </button>
          </div>
        </div>

        {/* Global Action Success Toast */}
        {actionSuccessMsg && (
          <div
            style={{
              padding: '0.9rem 1.25rem',
              backgroundColor: 'rgba(27, 77, 62, 0.12)',
              border: '1px solid var(--accent-emerald)',
              color: 'var(--accent-emerald)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.5rem'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-delicate)', marginBottom: '1.75rem' }}>
          <button
            onClick={() => { setActiveTab('active'); setFinalCallCandidate(null); }}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'active' ? '2px solid var(--accent-brass)' : 'none',
              fontWeight: activeTab === 'active' ? 700 : 500,
              color: activeTab === 'active' ? 'var(--text-espresso)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
          >
            <Clock size={16} color="var(--accent-brass)" /> Active Lots Awaiting Final Call ({activeAuctions.length})
          </button>

          <button
            onClick={() => { setActiveTab('awarded'); setFinalCallCandidate(null); }}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'awarded' ? '2px solid var(--accent-emerald)' : 'none',
              fontWeight: activeTab === 'awarded' ? 700 : 500,
              color: activeTab === 'awarded' ? 'var(--text-espresso)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
          >
            <Award size={16} color="var(--accent-emerald)" /> Final Calls Executed ({awardedAuctions.length})
          </button>

          <button
            onClick={() => { setActiveTab('config'); setFinalCallCandidate(null); }}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'config' ? '2px solid var(--accent-brass)' : 'none',
              fontWeight: activeTab === 'config' ? 700 : 500,
              color: activeTab === 'config' ? 'var(--text-espresso)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem'
            }}
          >
            <Settings size={16} color="var(--accent-brass)" /> Catalog Auction Enabler
          </button>
        </div>

        {/* TAB 1 & 2: ACTIVE & AWARDED LOTS WORKSPACE */}
        {(activeTab === 'active' || activeTab === 'awarded') && (
          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '2rem', alignItems: 'start' }}>
            
            {/* Left Sub-Column: Auction Lots Roster */}
            <div>
              <h3 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', marginBottom: '0.75rem' }}>
                Select Auction Lot ({displayedAuctions.length})
              </h3>

              {displayedAuctions.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-delicate)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  No lots found in this section.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '540px', overflowY: 'auto' }}>
                  {displayedAuctions.map((lot) => {
                    const isSelected = selectedLot?._id === lot._id;
                    const isLotAwarded = lot.auctionStatus === 'awarded';

                    return (
                      <div
                        key={lot._id}
                        onClick={() => handleSelectLot(lot)}
                        style={{
                          padding: '1rem',
                          backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                          border: isSelected ? '2px solid var(--accent-brass)' : '1px solid var(--border-delicate)',
                          cursor: 'pointer',
                          display: 'flex',
                          gap: '0.75rem',
                          alignItems: 'center',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#1E1714', overflow: 'hidden', flexShrink: 0 }}>
                          <img src={lot.imageUrl} alt={lot.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <div style={{ flexGrow: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.68rem', color: 'var(--accent-brass)', fontWeight: 700, textTransform: 'uppercase' }}>
                              {lot.century}
                            </span>
                            {isLotAwarded ? (
                              <span style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>🏆 Awarded</span>
                            ) : (
                              <span style={{ fontSize: '0.65rem', color: 'var(--accent-brass-hover)', fontWeight: 700 }}>🔴 Live ({lot.totalBidsCount || 0} bids)</span>
                            )}
                          </div>

                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-espresso)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {lot.title}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Lead: <strong style={{ color: 'var(--text-espresso)' }}>£{(lot.currentBid || lot.startingBid)?.toLocaleString()}</strong>
                            </span>
                            <ChevronRight size={14} color="var(--accent-brass)" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Sub-Column: Selected Lot Details & Final Call Actions */}
            {selectedLot ? (
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.75rem', border: '1px solid var(--border-delicate)' }}>
                
                {/* Lot Header Card */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-delicate)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span className="badge-era" style={{ marginBottom: '0.3rem' }}>{selectedLot.category} • {selectedLot.origin}</span>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-espresso)', margin: '0.2rem 0' }}>
                      {selectedLot.title}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Certificate No: {selectedLot.certificateNo || 'HA-CERTIFIED'} • Valuation: {selectedLot.estimatedValue}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Current Leading Offer
                    </div>
                    <div style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
                      £{(selectedLot.currentBid || selectedLot.startingBid)?.toLocaleString()}
                    </div>
                    {selectedLot.auctionStatus === 'awarded' && (
                      <button
                        onClick={handleReopenLot}
                        style={{ marginTop: '0.4rem', background: 'none', border: 'none', color: 'var(--accent-mahogany)', fontSize: '0.72rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'underline' }}
                      >
                        <RotateCcw size={12} /> Reopen for Bidding
                      </button>
                    )}
                  </div>
                </div>

                {/* AWARDED DETAILS CALLOUT IF ALREADY DECIDED */}
                {selectedLot.auctionStatus === 'awarded' && selectedLot.awardedTo && (
                  <div style={{ padding: '1rem 1.25rem', backgroundColor: '#FAF5EE', border: '1px solid var(--accent-brass)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.85rem' }}>
                      <Award size={18} /> Official Final Call Awarded
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-espresso)', marginTop: '0.3rem' }}>
                      Winner: {selectedLot.awardedTo.userName} ({selectedLot.awardedTo.userEmail}) • Price: £{selectedLot.awardedTo.winningBid?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-body)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                      Curator Decision Rationale: "{selectedLot.awardedTo.adminNotes}"
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      Sealed by: {selectedLot.awardedTo.adminDecidedBy} on {new Date(selectedLot.awardedTo.awardedAt).toLocaleString()}
                    </div>
                  </div>
                )}

                {/* FINAL CALL DECISION DRAWER (TRIGGERED WHEN ADMIN CLICKS "MAKE FINAL CALL" ON A BID) */}
                {finalCallCandidate && (
                  <div
                    style={{
                      padding: '1.25rem',
                      backgroundColor: '#FAF7F2',
                      border: '2px solid var(--accent-brass)',
                      marginBottom: '1.5rem',
                      boxShadow: 'var(--shadow-hover)'
                    }}
                    className="animate-fade-in"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-brass)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Gavel size={15} /> Confirm Official Final Call Award
                        </div>
                        <h4 style={{ fontSize: '1.15rem', color: 'var(--text-espresso)', margin: '0.3rem 0' }}>
                          Award Lot to: <span style={{ color: 'var(--accent-emerald)' }}>{finalCallCandidate.bidder.name}</span>
                        </h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Candidate Offer: <strong style={{ color: 'var(--text-espresso)' }}>£{finalCallCandidate.amount.toLocaleString()}</strong> ({finalCallCandidate.bidder.email})
                        </div>
                      </div>

                      <button
                        onClick={() => setFinalCallCandidate(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-espresso)' }}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div style={{ marginTop: '0.85rem' }}>
                      <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                        Curator Award Rationale & Protocol Conditions *
                      </label>
                      <textarea
                        rows={2}
                        value={adminRationale}
                        onChange={(e) => setAdminRationale(e.target.value)}
                        style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FFFFFF', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                      <button
                        onClick={handleExecuteFinalCall}
                        disabled={executingFinalCall}
                        className="btn-primary"
                        style={{ flex: 1, padding: '0.7rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                      >
                        <Gavel size={16} /> {executingFinalCall ? 'Sealing Final Call...' : 'Confirm Final Call & Award Lot'}
                      </button>

                      <button
                        onClick={() => setFinalCallCandidate(null)}
                        className="btn-secondary"
                        style={{ padding: '0.7rem 1.25rem', fontSize: '0.85rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Bidding Log Table */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-espresso)', margin: 0 }}>
                      Candidate Bidders & Offer History ({lotBids.length})
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      As Mid-Level Admin, you may select any qualified bidder to make the final call.
                    </span>
                  </div>

                  {loadingBids ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      Loading lot bids...
                    </div>
                  ) : lotBids.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FAF7F2', border: '1px dashed var(--border-delicate)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      No bids submitted yet for this antique lot.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {lotBids.map((b) => {
                        const isLeading = b.status === 'leading';
                        const isBidAwarded = b.status === 'awarded';

                        return (
                          <div
                            key={b._id}
                            style={{
                              padding: '1rem',
                              backgroundColor: isBidAwarded ? '#FAF5EE' : (isLeading ? '#F7F4EE' : '#FAF7F2'),
                              border: isBidAwarded ? '2px solid var(--accent-emerald)' : (isLeading ? '1px solid var(--accent-brass)' : '1px solid var(--border-delicate)'),
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '1rem'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-espresso)' }}>
                                  {b.bidder.name}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                  ({b.bidder.email})
                                </span>
                                {isBidAwarded && (
                                  <span style={{ fontSize: '0.68rem', backgroundColor: 'var(--accent-emerald)', color: '#FAF7F2', padding: '0.15rem 0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                    🏆 Final Call Winner
                                  </span>
                                )}
                                {isLeading && !isBidAwarded && (
                                  <span style={{ fontSize: '0.68rem', backgroundColor: 'var(--accent-brass)', color: '#1E1714', padding: '0.15rem 0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Leading Offer
                                  </span>
                                )}
                              </div>

                              {b.note && (
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-body)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                                  Collector Note: "{b.note}"
                                </div>
                              )}

                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                Placed on {new Date(b.createdAt).toLocaleDateString()} at {new Date(b.createdAt).toLocaleTimeString()}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
                                  £{b.amount?.toLocaleString()}
                                </span>
                              </div>

                              {selectedLot.auctionStatus !== 'awarded' && (
                                <button
                                  onClick={() => handleInitiateFinalCall(b)}
                                  className="btn-primary"
                                  style={{
                                    padding: '0.5rem 0.85rem',
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    backgroundColor: isLeading ? 'var(--accent-brass)' : 'var(--text-espresso)'
                                  }}
                                >
                                  <Gavel size={14} /> Make Final Call
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Select an auction lot from the left roster to view offers and make final calls.
              </div>
            )}

          </div>
        )}

        {/* TAB 3: CATALOG AUCTION ENABLER CONFIG */}
        {activeTab === 'config' && (
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', border: '1px solid var(--border-delicate)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-espresso)', marginBottom: '0.5rem' }}>
              Enable or Disable Public Auctions on Vault Antiques
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Turn any catalog antique into a live biddable lot. You can set the starting bid price, minimum bid increments, and reserve price.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {allAntiques.map((item) => (
                <div
                  key={item._id}
                  style={{
                    padding: '1.25rem',
                    backgroundColor: '#FAF7F2',
                    border: item.isAuction ? '2px solid var(--accent-brass)' : '1px solid var(--border-delicate)',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ width: '80px', height: '80px', backgroundColor: '#1E1714', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-brass)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {item.category} • £{item.price?.toLocaleString()}
                    </div>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-espresso)', margin: '0.2rem 0' }}>
                      {item.title}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem' }}>
                      <span style={{ fontSize: '0.72rem', color: item.isAuction ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                        {item.isAuction ? `Auction Active (Lead: £${(item.currentBid || item.startingBid)?.toLocaleString()})` : 'Catalog Only (Fixed Price)'}
                      </span>

                      {item.isAuction ? (
                        <button
                          onClick={() => handleToggleAuctionOnAntique(item._id, false)}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.7rem', color: 'var(--accent-mahogany)' }}
                        >
                          Disable Auction
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleAuctionOnAntique(item._id, true)}
                          className="btn-primary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.7rem' }}
                        >
                          Enable Auction
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
