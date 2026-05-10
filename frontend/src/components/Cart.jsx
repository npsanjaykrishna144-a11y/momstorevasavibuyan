import React, { useState } from 'react';
import { X, Trash2, CheckCircle } from 'lucide-react';
import { api } from '../api';

const Cart = ({ items, onClose, onRemove, onOrderSuccess }) => {
  const [customerInfo, setCustomerInfo] = useState({ name: '', address: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.address || !customerInfo.phone) {
      alert("Please fill in all your details to place the order.");
      return;
    }
    setIsLoading(true);
    try {
      await api.placeOrder({
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        items: items.map(i => ({ id: i.id, title: i.title, price: i.price })),
        total: total,
      });
      setOrderPlaced(true);
      if (onOrderSuccess) onOrderSuccess();
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cart-overlay" onClick={!orderPlaced ? onClose : undefined}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        {orderPlaced ? (
          <div className="text-center" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
            <CheckCircle size={72} color="var(--primary)" style={{ marginBottom: '24px' }} />
            <h2 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>Order Placed! 🎉</h2>
            <p style={{ color: '#6b7280', marginBottom: '32px' }}>
              Your order has been received. Keerthana will contact you soon on <strong>{customerInfo.phone}</strong>!
            </p>
            <button className="btn btn-primary" onClick={onClose}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Your Cart</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#6b7280' }}>Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '24px' }}>
                  {items.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div>
                        <div style={{ fontWeight: '600' }}>{item.title}</div>
                        <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{item.price}</div>
                      </div>
                      <button onClick={() => onRemove(index)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '2px solid #f3f4f6', paddingTop: '24px' }}>
                  <div className="flex justify-between items-center mb-6" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <span>Total:</span>
                    <span style={{ color: 'var(--primary)' }}>₹{total}</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Your Delivery Details</h3>
                  <input type="text" placeholder="Full Name" className="input-field" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                  <input type="tel" placeholder="Phone Number" className="input-field" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                  <textarea placeholder="Complete Delivery Address" className="input-field" rows="3" style={{ resize: 'none' }} value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}></textarea>

                  <button className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }} onClick={handlePlaceOrder} disabled={isLoading}>
                    {isLoading ? 'Placing Order...' : 'Place Order ✓'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
