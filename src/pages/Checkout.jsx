import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';
import toast from 'react-hot-toast';
import './Checkout.css';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) { resolve(true); return; }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { cart, cartTotal, fetchCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'razorpay'
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const items = cart.items || [];
  const deliveryFee = cartTotal >= 299 ? 0 : 40;
  const total = cartTotal + deliveryFee;

  // ── Cash on Delivery ──────────────────────────────
  const handleCOD = async () => {
    if (!address.trim()) { toast.error('Please enter your delivery address'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/orders/place', { address });
      setOrderId(data._id);
      setPlaced(true);
      await fetchCart();
      toast.success('Order placed! Pay on delivery 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // ── Razorpay ──────────────────────────────────────
  const handleRazorpay = async () => {
    if (!address.trim()) { toast.error('Please enter your delivery address'); return; }
    setLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Failed to load payment gateway. Check your internet.');
      setLoading(false);
      return;
    }

    let razorpayOrderId, amount, currency, keyId;
    try {
      const { data } = await api.post('/orders/create-razorpay-order');
      razorpayOrderId = data.razorpayOrderId;
      amount = data.amount;
      currency = data.currency;
      keyId = data.keyId;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not initiate payment');
      setLoading(false);
      return;
    }

    const options = {
      key: keyId,
      amount,
      currency,
      name: 'VeggieCart',
      description: 'Fresh Vegetables Order',
      image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🥦</text></svg>',
      order_id: razorpayOrderId,
      theme: { color: '#2D5016' },
      handler: async function (response) {
        try {
          const { data: order } = await api.post('/orders/verify-and-place', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            address,
          });
          setOrderId(order._id);
          setPlaced(true);
          await fetchCart();
          toast.success('Payment successful! Order placed 🎉');
        } catch (err) {
          toast.error('Payment verification failed. Contact support.');
        }
      },
      modal: {
        ondismiss: function () {
          toast('Payment cancelled', { icon: 'ℹ️' });
          setLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      toast.error(`Payment failed: ${response.error.description}`);
      setLoading(false);
    });
    rzp.open();
    setLoading(false);
  };

  // ── Submit handler ────────────────────────────────
  const handleSubmit = () => {
    if (paymentMethod === 'cod') handleCOD();
    else handleRazorpay();
  };

  // ── Success screen ────────────────────────────────
  if (placed) {
    return (
      <div className="page">
        <div className="container success-page fade-up">
          <div className="success-icon">🎉</div>
          <h2 className="success-title">Order Placed!</h2>
          <p className="success-sub">
            {paymentMethod === 'cod'
              ? 'Your veggies are on the way. Pay cash on delivery!'
              : 'Payment successful! Your veggies are on the way.'}
          </p>
          <div className="success-id">
            Order ID: <strong>{orderId?.slice(-8).toUpperCase()}</strong>
          </div>
          <div className="success-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')}>
              View My Orders
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main checkout ─────────────────────────────────
  return (
    <div className="page checkout-page">
      <div className="container">
        <h1 className="page-title fade-up"><span>💳</span> Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-left">

            {/* Address */}
            <div className="card checkout-card fade-up">
              <h2 className="card-title">📍 Delivery Address</h2>
              <div className="form-group">
                <label className="form-label">Full Address *</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="House/Flat No., Street, Area, City, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="card checkout-card fade-up" style={{ animationDelay: '100ms' }}>
              <h2 className="card-title">💳 Choose Payment Method</h2>

              <div className="payment-options">

                {/* COD Option */}
                <div
                  className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="option-radio">
                    {paymentMethod === 'cod' && <div className="option-radio-dot" />}
                  </div>
                  <span className="method-icon">💵</span>
                  <div className="method-info">
                    <strong>Cash on Delivery</strong>
                    <p>Pay in cash when your order arrives</p>
                  </div>
                </div>

                {/* Razorpay Option */}
                <div
                  className={`payment-option ${paymentMethod === 'razorpay' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <div className="option-radio">
                    {paymentMethod === 'razorpay' && <div className="option-radio-dot" />}
                  </div>
                  <span className="method-icon">💳</span>
                  <div className="method-info">
                    <strong>Pay Online — Razorpay</strong>
                    <p>UPI · Cards · Net Banking · Wallets</p>
                  </div>
                </div>

              </div>

              {/* COD info box */}
              {paymentMethod === 'cod' && (
                <div className="method-info-box cod-box">
                  <span>🛵</span>
                  <p>No prepayment needed. Keep exact change ready if possible.</p>
                </div>
              )}

              {/* Razorpay test card info box */}
              {paymentMethod === 'razorpay' && (
                <div className="method-info-box rzp-box">
                  <div className="test-mode-banner">
                    <span>🧪</span>
                    <div>
                      <strong>Test Mode Active</strong>
                      <p>No real money is charged</p>
                    </div>
                  </div>
                  <div className="test-cards">
                    <p className="test-cards-title">Use these test card details</p>
                    <div className="test-card-row">
                      <span className="tc-label">Card Number</span>
                      <span className="tc-value">4111 1111 1111 1111</span>
                    </div>
                    <div className="test-card-row">
                      <span className="tc-label">Expiry</span>
                      <span className="tc-value">Any future date</span>
                    </div>
                    <div className="test-card-row">
                      <span className="tc-label">CVV</span>
                      <span className="tc-value">Any 3 digits</span>
                    </div>
                    <div className="test-card-row">
                      <span className="tc-label">OTP</span>
                      <span className="tc-value">1234</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary scale-in">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-rows">
              {items.map(item => item.product && (
                <div key={item._id} className="summary-row checkout-item">
                  <div className="checkout-item-info">
                    <span>{item.product.emoji}</span>
                    <span>{item.product.name} × {item.quantity}</span>
                  </div>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="divider"></div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span style={{
                color: deliveryFee === 0 ? 'var(--sage)' : 'inherit',
                fontWeight: deliveryFee === 0 ? 700 : 400
              }}>
                {deliveryFee === 0 ? 'FREE 🎉' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="divider"></div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            {/* Selected method badge */}
            <div className="selected-method-badge">
              {paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Paying via Razorpay'}
            </div>

            <button
              className="btn btn-primary btn-lg checkout-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : paymentMethod === 'cod'
                  ? `Place Order ₹${total} →`
                  : `Pay ₹${total} →`}
            </button>

            <p className="secure-note">
              {paymentMethod === 'cod'
                ? '🛵 Pay cash when order arrives'
                : '🔒 Secured by Razorpay'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}