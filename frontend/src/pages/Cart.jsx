import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const items = cart.items || [];

  if (!isLoggedIn) {
    return (
      <div className="page">
        <div className="container cart-empty-page">
          <span className="empty-icon">🔐</span>
          <h2>Login to view your cart</h2>
          <p>You need to be logged in to manage your cart.</p>
          <Link to="/login" className="btn btn-primary btn-lg">Login</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container cart-empty-page">
          <span className="empty-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/" className="btn btn-primary btn-lg">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="container">
        <h1 className="page-title fade-up">
          <span>🛒</span> Your Cart
        </h1>
        <p className="page-sub fade-up">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map((item, i) => {
              const p = item.product;
              if (!p) return null;
              return (
                <div key={item._id} className="cart-item fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="cart-item-img">
                    <img src={p.image} alt={p.name} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                    <div className="img-fallback" style={{display:'none'}}>{p.emoji}</div>
                  </div>
                  <div className="cart-item-info">
                    <span className="item-emoji">{p.emoji}</span>
                    <h3 className="item-name">{p.name}</h3>
                    <p className="item-price">₹{p.price} / {p.unit}</p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(p._id, item.quantity - 1)}
                      >−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(p._id, item.quantity + 1)}
                      >+</button>
                    </div>
                    <div className="item-subtotal">₹{p.price * item.quantity}</div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(p._id)}
                      title="Remove"
                    >✕</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="cart-summary scale-in">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-rows">
              {items.map(item => item.product && (
                <div key={item._id} className="summary-row">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="divider"></div>
            <div className="summary-row summary-delivery">
              <span>Delivery</span>
              <span className="delivery-free">{cartTotal >= 299 ? 'FREE 🎉' : '₹40'}</span>
            </div>
            <div className="divider"></div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{cartTotal >= 299 ? cartTotal : cartTotal + 40}</span>
            </div>
            {cartTotal < 299 && (
              <p className="delivery-hint">Add ₹{299 - cartTotal} more for free delivery</p>
            )}
            <button
              className="btn btn-primary btn-lg checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>
            <Link to="/" className="continue-link">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
