import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page">
      <div className="container">
        <div className="skeleton" style={{ height: 40, width: 200, marginBottom: 32, borderRadius: 8 }} />
        {[1,2].map(i => <div key={i} className="skeleton" style={{ height: 180, marginBottom: 16, borderRadius: 20 }} />)}
      </div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="page">
      <div className="container orders-empty fade-up">
        <span className="empty-icon">📦</span>
        <h2>No orders yet</h2>
        <p>Your order history will appear here.</p>
        <Link to="/" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="page orders-page">
      <div className="container">
        <h1 className="page-title fade-up"><span>📦</span> My Orders</h1>
        <div className="orders-list">
          {orders.map((order, i) => (
            <div key={order._id} className="order-card fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="order-header">
                <div>
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-green' : 'badge-orange'}`}>
                    {order.paymentStatus === 'paid' ? '✓ Paid' : order.paymentStatus}
                  </span>
                </div>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, j) => (
                  <div key={j} className="order-item">
                    <span className="oi-name">{item.name}</span>
                    <span className="oi-qty">× {item.quantity}</span>
                    <span className="oi-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-address">📍 {order.address}</div>
                <div className="order-total">
                  <span>Total</span>
                  <strong>₹{order.totalAmount}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
