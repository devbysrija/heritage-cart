/**
 * Heritage Antiques Platform - Live Auction Salon Gallery
 * Signed by srh
 */
import React, { useState } from 'react';
import { Gavel, Award, ShieldCheck, Clock, Eye, Sparkles, Filter, ChevronRight, UserCheck } from 'lucide-react';

export default function LiveAuctionSalon({
  antiques,
  currentUser,
  onOpenBidding,
  onQuickView,
  onOpenAuctionDesk
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'awarded'

  const auctionItems = antiques.filter((item) => item.isAuction);
  const activeItems = auctionItems.filter((item) => item.auctionStatus !== 'awarded');
  const awardedItems = auctionItems.filter((item) => item.auctionStatus === 'awarded');

  const displayedItems = filter === 'active' ? activeItems : (filter === 'awarded' ? awardedItems : auctionItems);

  const totalBidsCount = auctionItems.reduce((acc, i) => acc + (i.totalBidsCount || 0), 0);
  const highestBid = Math.max(...auctionItems.map((i) => i.currentBid || 0), 0);

  const isArbiter = currentUser?.role === 'mid_admin' || currentUser?.role === 'admin';

  return (
    <section style={{ maxWidth: '1320px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
      
      {/* Salon Header Hero */}
      <div
        style={{
          backgroundColor: '#FAF5EE',
          border: '1px solid var(--border-delicate)',
          padding: '2.5rem',
          marginBottom: '3rem',
          position: 'relative',
          boxShadow: 'var(--shadow-gallery)'
        }}
        className="animate-fade-in"
      >
        <div style={{ maxWidth: '750px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-brass)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.5rem' }}>
            <Gavel size={16} /> Heritage Vault • Live Public Auction Salon
          </div>
          <h2 style={{ fontSize: '2.6rem', color: 'var(--text-espresso)', margin: '0 0 0.8rem 0', lineHeight: 1.15 }}>
            Rare Antique Bidding & Discretionary Awards
          </h2>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
            Every authenticated collector is invited to submit live binding offers on our museum-grade lots. In the grand tradition of London auction guilds, our Mid-Level Auction Administrator reviews all collector submissions to make the authoritative <strong>Final Call</strong> on who is awarded custodianship.
          </p>
        </div>

        {/* Live Metrics Ticker */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginTop: '2rem', borderTop: '1px solid var(--border-delicate)', paddingTop: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
              Active Auction Lots
            </span>
            <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
              {activeItems.length} Open Lots
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
              Collector Bids Placed
            </span>
            <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--accent-brass-hover)' }}>
              {totalBidsCount} Binding Offers
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
              Highest Lead Offer
            </span>
            <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
              £{highestBid.toLocaleString()}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
              Final Calls Executed
            </span>
            <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--accent-emerald)' }}>
              {awardedItems.length} Lots Awarded
            </span>
          </div>
        </div>

        {/* Arbiter Action Shortcut if logged in as Admin */}
        {isArbiter && (
          <div style={{ marginTop: '1.5rem', padding: '0.85rem 1.25rem', backgroundColor: 'var(--text-espresso)', color: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Gavel size={18} color="var(--accent-brass)" />
              <span style={{ fontSize: '0.825rem' }}>
                You are currently logged in as <strong>{currentUser.name}</strong> ({currentUser.role === 'admin' ? 'Senior Appraiser' : 'Mid-Level Admin'}). You hold discretionary final call authority.
              </span>
            </div>
            <button
              onClick={onOpenAuctionDesk}
              style={{
                backgroundColor: 'var(--accent-brass)',
                color: '#1E1714',
                border: 'none',
                padding: '0.45rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              Open Arbiter Final Call Desk <ChevronRight size={14} />
            </button>
          </div>
        )}

      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-delicate)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.5rem 1.1rem',
              backgroundColor: filter === 'all' ? 'var(--text-espresso)' : 'var(--bg-card)',
              color: filter === 'all' ? '#FAF7F2' : 'var(--text-espresso)',
              border: '1px solid var(--border-delicate)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            All Auction Lots ({auctionItems.length})
          </button>

          <button
            onClick={() => setFilter('active')}
            style={{
              padding: '0.5rem 1.1rem',
              backgroundColor: filter === 'active' ? 'var(--text-espresso)' : 'var(--bg-card)',
              color: filter === 'active' ? '#FAF7F2' : 'var(--text-espresso)',
              border: '1px solid var(--border-delicate)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🔴 Live Bidding Open ({activeItems.length})
          </button>

          <button
            onClick={() => setFilter('awarded')}
            style={{
              padding: '0.5rem 1.1rem',
              backgroundColor: filter === 'awarded' ? 'var(--text-espresso)' : 'var(--bg-card)',
              color: filter === 'awarded' ? '#FAF7F2' : 'var(--text-espresso)',
              border: '1px solid var(--border-delicate)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🏆 Final Calls Awarded ({awardedItems.length})
          </button>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Showing {displayedItems.length} authenticated auction lots
        </div>
      </div>

      {/* Auction Lots Grid */}
      {displayedItems.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-delicate)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-espresso)' }}>
            No auction lots match this category.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))', gap: '2.5rem' }}>
          {displayedItems.map((item) => {
            const isAwarded = item.auctionStatus === 'awarded';
            const leadPrice = item.currentBid || item.startingBid || item.price;

            return (
              <div
                key={item._id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: isAwarded ? '1px solid var(--accent-emerald)' : '1px solid var(--border-delicate)',
                  boxShadow: 'var(--shadow-gallery)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
                className="animate-fade-in"
              >
                {/* Visual Header */}
                <div style={{ position: 'relative', height: '280px', overflow: 'hidden', backgroundColor: '#1E1714' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95 }}
                  />

                  {/* Status Badges */}
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.4rem' }}>
                    <span className="badge-era">{item.century}</span>
                    {isAwarded ? (
                      <span style={{ backgroundColor: 'var(--accent-emerald)', color: '#FAF7F2', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Award size={12} /> Awarded
                      </span>
                    ) : (
                      <span style={{ backgroundColor: 'rgba(30, 23, 20, 0.9)', color: '#FAF7F2', border: '1px solid var(--accent-brass)', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} /> Live Bidding
                      </span>
                    )}
                  </div>

                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    <span style={{ backgroundColor: 'rgba(30, 23, 20, 0.85)', color: '#FAF7F2', padding: '0.2rem 0.5rem', fontSize: '0.7rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                      Year {item.year}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-brass)', fontWeight: 700, marginBottom: '0.3rem' }}>
                      {item.category} • {item.origin}
                    </div>

                    <h3 style={{ fontSize: '1.35rem', color: 'var(--text-espresso)', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                      {item.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>

                    {/* AWARD CALLOUT ON CARD */}
                    {isAwarded && item.awardedTo && (
                      <div style={{ padding: '0.75rem 0.9rem', backgroundColor: '#FAF5EE', borderLeft: '3px solid var(--accent-emerald)', marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                          🏆 Final Call Awarded To:
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-espresso)' }}>
                          {item.awardedTo.userName} (£{item.awardedTo.winningBid?.toLocaleString()})
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.15rem' }}>
                          "{item.awardedTo.adminNotes}"
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Bidding Valuation Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-delicate)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
                          {isAwarded ? 'Final Award Price' : 'Current Leading Offer'}
                        </span>
                        <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
                          £{leadPrice?.toLocaleString()}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--accent-brass-hover)', fontWeight: 600, display: 'block' }}>
                          {item.totalBidsCount || 0} Offers Placed
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Starting: £{(item.startingBid || item.price)?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: isArbiter ? '1fr 1fr 1fr' : '1fr 1.3fr', gap: '0.6rem' }}>
                      <button
                        onClick={() => onQuickView(item)}
                        className="btn-secondary"
                        style={{ padding: '0.6rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={13} /> Details
                      </button>

                      <button
                        onClick={() => onOpenBidding(item)}
                        className="btn-primary"
                        style={{ padding: '0.6rem', fontSize: '0.75rem', backgroundColor: isAwarded ? 'var(--text-espresso)' : 'var(--accent-brass)', color: isAwarded ? '#FAF7F2' : '#1E1714' }}
                      >
                        <Gavel size={14} /> {isAwarded ? 'View Decision' : 'Place Bid'}
                      </button>

                      {isArbiter && (
                        <button
                          onClick={onOpenAuctionDesk}
                          style={{
                            backgroundColor: '#1E1714',
                            color: 'var(--accent-brass)',
                            border: '1px solid var(--accent-brass)',
                            padding: '0.6rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Gavel size={13} /> Final Call
                        </button>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
