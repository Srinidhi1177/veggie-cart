import { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/products')
      .then(({ data }) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob-1"></div>
          <div className="hero-blob blob-2"></div>
          <div className="hero-blob blob-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-tag fade-up">🌱 Farm-fresh, delivered daily</div>
          <h1 className="hero-title fade-up" style={{ animationDelay: '100ms' }}>
            The freshest veggies,<br />
            <span className="hero-accent">right at your door</span>
          </h1>
          <p className="hero-sub fade-up" style={{ animationDelay: '200ms' }}>
            Hand-picked from local farms every morning. No preservatives, no compromises.
          </p>
          <div className="hero-search fade-up" style={{ animationDelay: '300ms' }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search vegetables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="hero-stats fade-up" style={{ animationDelay: '400ms' }}>
            <div className="stat"><strong>50+</strong><span>Varieties</span></div>
            <div className="stat-divider"></div>
            <div className="stat"><strong>100%</strong><span>Organic</span></div>
            <div className="stat-divider"></div>
            <div className="stat"><strong>Same-day</strong><span>Delivery</span></div>
          </div>
        </div>

        <div className="hero-veggies">
          {['🍅', '🥕', '🥦', '🧅', '🫑', '🥬'].map((v, i) => (
            <span key={i} className="floating-veggie" style={{ animationDelay: `${i * 0.4}s` }}>{v}</span>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Today's Fresh Pick</h2>
              <p className="section-sub">Harvested this morning, delivered to you</p>
            </div>
            <span className="section-count">{filtered.length} items</span>
          </div>

          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '360px', borderRadius: 'var(--radius-lg)' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🌿</span>
              <h3>No veggies found</h3>
              <p>Try a different search term</p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((product, i) => (
                <ProductCard key={product._id} product={product} delay={i * 60} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Banner */}
      <section className="footer-banner">
        <div className="container">
          <div className="banner-grid">
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹299' },
              { icon: '🌿', title: '100% Organic', desc: 'No pesticides, ever' },
              { icon: '⚡', title: 'Same-Day', desc: 'Order before 12 PM' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Your data is safe' },
            ].map((b) => (
              <div key={b.title} className="banner-item">
                <span className="banner-icon">{b.icon}</span>
                <div>
                  <strong>{b.title}</strong>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
