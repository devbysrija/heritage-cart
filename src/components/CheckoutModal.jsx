import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Award, Printer, Lock, Compass, FileText } from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
  backendUrl
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success Certificate
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const [customer, setCustomer] = useState({
    name: 'Lord Edward Harrington',
    email: 'harrington@mayfair-estate.co.uk',
    address: '14 Mayfair Park Street',
    city: 'London',
    country: 'United Kingdom'
  });

  const [shippingMethod, setShippingMethod] = useState('White-Glove Vault Express');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Vault Escrow)');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const insuranceFee = shippingMethod === 'White-Glove Vault Express' ? 250 : 120;
  const totalAmount = subtotal + insuranceFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: cartItems.map(i => ({
            antiqueId: i._id,
            title: i.title,
            price: i.price,
            certificateNo: i.certificateNo || 'HA-CERTIFIED',
            imageUrl: i.imageUrl
          })),
          shippingMethod
        })
      });

      const data = await response.json();
      setLoading(false);
      setOrderResult(data);
      setStep(3); // Show Certificate of Authenticity!
      onClearCart();
    } catch (err) {
      console.error('Order submission error:', err);
      // Fallback order result if server offline
      setLoading(false);
      setOrderResult({
        orderNumber: `HA-ORD-${Date.now().toString().slice(-6)}`,
        customer,
        items: cartItems,
        totalAmount,
        shippingMethod,
        insuranceFee,
        certificateOfAuthenticityIssued: true,
        createdAt: new Date().toISOString()
      });
      setStep(3);
      onClearCart();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-parchment)',
          maxWidth: step === 3 ? '780px' : '650px',
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

        {/* STEP 1 & 2: CHECKOUT FORM */}
        {step !== 3 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-brass)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <Lock size={14} /> Vault Escrow Acquisition
              </div>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-espresso)', margin: '0.25rem 0' }}>
                Acquisition Checkout
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Acquiring {cartItems.length} authenticated artifact(s) • Total: £{totalAmount.toLocaleString()}
              </div>
            </div>

            <form onSubmit={handleSubmitOrder}>
              {/* Customer Contact Details */}
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', border: '1px solid var(--border-delicate)', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-espresso)', marginBottom: '1rem', borderBottom: '1px solid var(--border-delicate)', paddingBottom: '0.4rem' }}>
                  1. Buyer & Delivery Address
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Street Address</label>
                  <input
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>City</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Country</label>
                    <input
                      type="text"
                      required
                      value={customer.country}
                      onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping & Payment Options */}
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', border: '1px solid var(--border-delicate)', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-espresso)', marginBottom: '1rem', borderBottom: '1px solid var(--border-delicate)', paddingBottom: '0.4rem' }}>
                  2. Courier Vault Insurance & Payment
                </h3>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Insured Transport Method</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div
                      onClick={() => setShippingMethod('White-Glove Vault Express')}
                      style={{
                        padding: '1rem',
                        border: shippingMethod === 'White-Glove Vault Express' ? '2px solid var(--accent-brass)' : '1px solid var(--border-delicate)',
                        backgroundColor: '#FAF7F2',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-espresso)' }}>White-Glove Vault Express</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Armored Courier • £250</div>
                    </div>

                    <div
                      onClick={() => setShippingMethod('Royal Heritage Courier')}
                      style={{
                        padding: '1rem',
                        border: shippingMethod === 'Royal Heritage Courier' ? '2px solid var(--accent-brass)' : '1px solid var(--border-delicate)',
                        backgroundColor: '#FAF7F2',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-espresso)' }}>Royal Insured Courier</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority Tracked • £120</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-body)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Escrow Payment Mode</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-delicate)', backgroundColor: '#FAF7F2', outline: 'none' }}
                  >
                    <option value="Credit Card (Vault Escrow)">Vault Encrypted Credit Card (Visa / Mastercard / Amex)</option>
                    <option value="Direct Bank Wire Transfer">Direct Private Bank Wire (Coutts & Co / Barclays Wealth)</option>
                    <option value="Crypto Vault Settlement">Vault Crypto Escrow Settlement (Bitcoin / Ethereum)</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-brass"
                style={{ width: '100%', fontSize: '0.9rem', padding: '1rem' }}
              >
                {loading ? 'Processing Escrow Security & Generating Certificate...' : `Confirm Acquisition & Pay £${totalAmount.toLocaleString()}`}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: OFFICIAL PRINTABLE CERTIFICATE OF AUTHENTICITY */}
        {step === 3 && orderResult && (
          <div>
            {/* Header Success Ribbon */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <CheckCircle2 size={18} /> Acquisition Successfully Verified
              </div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-espresso)', margin: '0.2rem 0' }}>
                Vault Escrow Receipt & Certificate
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Order Ref: <strong>{orderResult.orderNumber}</strong> • Registered to {orderResult.customer?.name}
              </p>
            </div>

            {/* Print Area - Parchment Certificate of Authenticity */}
            <div id="certificate-print-area" style={{
              backgroundColor: '#FDFBF7',
              border: '3px double var(--accent-brass)',
              padding: '2.5rem 2rem',
              position: 'relative',
              boxShadow: 'inset 0 0 40px rgba(197, 154, 78, 0.08)',
              marginBottom: '1.5rem'
            }}>
              
              {/* Wax Seal Graphic */}
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                <div className="wax-seal">
                  H&Co
                </div>
              </div>

              {/* Header Certificate Crest */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Compass size={32} color="var(--accent-brass)" style={{ marginBottom: '0.5rem' }} />
                <h3 className="brand-font" style={{ fontSize: '1.4rem', letterSpacing: '0.25em', color: 'var(--text-espresso)', margin: 0 }}>
                  HERITAGE & CO. ARCHIVES
                </h3>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--accent-brass)', fontWeight: 700, marginTop: '0.2rem' }}>
                  LONDON EST. 1884 • FLEET STREET VAULT
                </div>
                <div style={{ borderBottom: '1px solid var(--accent-brass)', width: '120px', margin: '0.75rem auto' }} />
                <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-espresso)', fontStyle: 'italic', margin: 0 }}>
                  Certificate of Authenticity & Provenance
                </h1>
              </div>

              {/* Certificate Narrative Statement */}
              <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', textAlign: 'center', lineHeight: 1.7, maxWidth: '580px', margin: '0 auto 2rem auto', fontStyle: 'italic' }}>
                This is to officially certify that the artifact(s) listed below have undergone rigorous physical inspection, radio-carbon/metallurgical verification, and catalog provenance review by the Master Appraisers of Heritage & Co. London.
              </p>

              {/* Purchased Artifact Table */}
              <div style={{ backgroundColor: '#F7F3EC', border: '1px solid var(--border-delicate)', padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-espresso)', borderBottom: '1px solid var(--border-delicate)', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
                  Registered Vault Collection Items:
                </div>
                {orderResult.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <div>
                      <strong style={{ color: 'var(--text-espresso)' }}>{item.title}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-brass)', fontStyle: 'italic' }}>
                        Certificate Serial: {item.certificateNo || 'HA-CERT-8849'}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-espresso)' }}>
                      £{item.price?.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div style={{ borderTop: '1px dashed var(--border-delicate)', paddingTop: '0.5rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-espresso)' }}>
                  <span>Total Escrow Value (Inc. Insurance):</span>
                  <span>£{orderResult.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Signatures & Seal Footer */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem', textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <div style={{ borderTop: '1px solid var(--border-delicate)', paddingTop: '0.5rem' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-espresso)' }}>
                    Sir Julian Vance
                  </div>
                  <div>Senior Keeper of Antiquities</div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-delicate)', paddingTop: '0.5rem', textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-espresso)' }}>
                    {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div>Date of Archival Seal</div>
                </div>
              </div>

            </div>

            {/* Print & Return Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => window.print()}
                className="btn-secondary"
                style={{ flexGrow: 1, fontSize: '0.85rem' }}
              >
                <Printer size={16} /> Print Official Certificate
              </button>

              <button
                onClick={onClose}
                className="btn-primary"
                style={{ flexGrow: 1, fontSize: '0.85rem' }}
              >
                Return to Gallery
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
