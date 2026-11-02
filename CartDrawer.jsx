import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const insuranceFee = cartItems.length > 0 ? 250 : 0;
  const total = subtotal + insuranceFee;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          backgroundColor: 'var(--bg-parchment)',
          borderLeft: '1px solid var(--border-delicate)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-hover)',
          padding: '2rem 1.5rem'
        }}
        className="animate-fade-in"
      >
        {/* Cart Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-delicate)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--accent-brass)" />
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-espresso)', margin: 0 }}>
              Vault Cart ({cartItems.length})
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-espresso)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Item List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingRight: '0.25rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={36} color="var(--border-delicate)" style={{ marginBottom: '1rem' }} />
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--text-espresso)' }}>
                Your vault cart is currently empty.
              </p>
              <p style={{ fontSize: '0.825rem' }}>Explore our authenticated catalog to acquire rare 17th-19th century artifacts.</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-delicate)',
                  alignItems: 'center'
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', border: '1px solid var(--border-delicate)' }}
                />

                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-brass)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {item.century}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-espresso)', margin: '0 0 0.25rem 0', lineHeight: 1.25 }}>
                    {item.title}
                  </h4>
                  <div style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
                    £{item.price?.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(index)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-mahogany)', padding: '0.5rem' }}
                  title="Remove from cart"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cartItems.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-delicate)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '0.5rem' }}>
              <span>Artifacts Subtotal:</span>
              <span>£{subtotal.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-emerald)' }}>
                <Truck size={14} /> White-Glove Vault Insurance:
              </span>
              <span>£{insuranceFee.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)', borderTop: '1px dashed var(--border-delicate)', paddingTop: '0.75rem', marginBottom: '1.5rem' }}>
              <span>Total Acquisition:</span>
              <span style={{ color: 'var(--accent-brass)' }}>£{total.toLocaleString()}</span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
              <ShieldCheck size={14} color="var(--accent-emerald)" /> Authenticity Certified • Escrow Protected
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              Proceed to Vault Checkout <ArrowRight size={16} />
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
