import React, { useState } from 'react';
import { X } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className="product-card glass-panel" style={{ padding: '0' }}>
        {/* Clickable Image */}
        <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => setLightboxOpen(true)}>
          <img src={product.imageUrl} alt={product.title} className="product-image" />
          <div style={{
            position: 'absolute', bottom: '8px', right: '8px',
            background: 'rgba(0,0,0,0.45)', borderRadius: '8px',
            padding: '3px 8px', color: 'white', fontSize: '0.7rem', fontWeight: '600',
            backdropFilter: 'blur(4px)'
          }}>Tap to zoom</div>
        </div>

        <div className="product-content" style={{ padding: '14px 16px 16px' }}>
          <h3 className="product-title">{product.title}</h3>
          <p className="product-desc">{product.description}</p>
          <div className="product-footer">
            <span className="product-price">₹{product.price}</span>
            <button
              className="btn btn-primary"
              onClick={() => onAddToCart(product)}
              style={{ padding: '9px 16px', fontSize: '0.88rem', minHeight: '40px' }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
            zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px', cursor: 'zoom-out'
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white'
            }}
          ><X size={22} /></button>
          <img
            src={product.imageUrl}
            alt={product.title}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '100%', maxHeight: '85vh',
              borderRadius: '16px', objectFit: 'contain',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
            }}
          />
          <div style={{
            position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)', borderRadius: '50px',
            padding: '10px 24px', color: 'white', textAlign: 'center',
            backdropFilter: 'blur(8px)', minWidth: '200px'
          }}>
            <div style={{ fontWeight: '700', fontSize: '1rem' }}>{product.title}</div>
            <div style={{ color: '#c4b5fd', fontWeight: '600' }}>₹{product.price}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
