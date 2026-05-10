import React, { useState, useEffect } from 'react';
import { ShoppingCart, Phone } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import { api } from '../api';

const Storefront = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mom's details
  const momDetails = {
    name: "Vasavi buyan",
    momName: "Keerthana",
    phone: "+919342617047"
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
    // Optional: Show a small toast or animation here
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Header */}
      <header className="glass-nav">
        <div className="container flex justify-between items-center" style={{ height: '70px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {momDetails.name}
          </h1>
          <div className="flex items-center gap-4">
            <a href="/admin" style={{ fontSize: '0.9rem', color: '#6b7280', textDecoration: 'underline' }}>Admin Login</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="store-header container">
        <h2 className="store-title">Discover Unique Digital Products</h2>
        <p style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '32px' }}>
          Handcrafted and curated with love. Browse our collection below.
        </p>
        <div className="store-contact">
          <Phone size={20} color="var(--primary)" />
          <span>Need help? Chat with {momDetails.momName} on WhatsApp: {momDetails.phone}</span>
        </div>
      </section>

      {/* Product Grid */}
      <main className="container mt-8">
        {isLoading ? (
          <div className="text-center" style={{ padding: '40px' }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center" style={{ padding: '40px', color: '#6b7280' }}>
            No products available right now. Check back later!
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      <button className="floating-cart-btn" onClick={() => setIsCartOpen(true)}>
        <ShoppingCart size={24} />
        {cartItems.length > 0 && (
          <div className="cart-badge">{cartItems.length}</div>
        )}
      </button>

      {/* Cart Modal */}
      {isCartOpen && (
        <Cart 
          items={cartItems} 
          onClose={() => setIsCartOpen(false)} 
          onRemove={handleRemoveFromCart}
          momPhoneNumber={momDetails.phone.replace('+', '')}
        />
      )}
    </div>
  );
};

export default Storefront;
