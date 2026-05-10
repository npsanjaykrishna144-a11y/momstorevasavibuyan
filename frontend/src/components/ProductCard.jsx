import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card glass-panel" style={{ padding: '0' }}>
      <img src={product.imageUrl} alt={product.title} className="product-image" />
      <div className="product-content" style={{ padding: '20px' }}>
        <h3 className="product-title">{product.title}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>
          <button 
            className="btn btn-primary"
            onClick={() => onAddToCart(product)}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
