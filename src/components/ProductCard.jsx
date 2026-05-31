import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product, delay = 0 }) {
  const { addToCart, loading } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = async () => {
    await addToCart(product._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="product-img-wrap">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="product-img-fallback">{product.emoji}</div>
        )}
        <span className="product-category">{product.unit}</span>
      </div>

      <div className="product-body">
        <div className="product-emoji">{product.emoji}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          <div className="product-price">
            <span className="price-currency">₹</span>
            <span className="price-amount">{product.price}</span>
            <span className="price-unit">/ {product.unit}</span>
          </div>
          <button
            className={`add-btn ${added ? 'added' : ''}`}
            onClick={handleAdd}
            disabled={loading || added}
          >
            {added ? '✓ Added' : '+ Add'}
          </button>
        </div>

        {product.stock < 30 && (
          <div className="stock-warning">⚡ Only {product.stock} left</div>
        )}
      </div>
    </div>
  );
}
