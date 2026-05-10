import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, LogOut, Image as ImageIcon, Package, ShoppingBag } from 'lucide-react';
import { api } from '../api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: '', description: '', price: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    const data = await api.getProducts();
    setProducts(data);
  };

  const loadOrders = async () => {
    const data = await api.getOrders();
    setOrders(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !newProduct.image) {
      alert("Please provide title, price, and image.");
      return;
    }
    setIsLoading(true);
    try {
      await api.addProduct(
        { title: newProduct.title, description: newProduct.description, price: newProduct.price },
        newProduct.image
      );
      setIsAdding(false);
      setNewProduct({ title: '', description: '', price: '', image: null });
      setImagePreview(null);
      loadProducts();
    } catch (error) {
      alert("Failed to add product: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.deleteProduct(id);
      loadProducts();
    } catch (error) {
      alert("Failed to delete product.");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const statusColors = {
    'New': '#f59e0b',
    'Processing': '#3b82f6',
    'Delivered': '#10b981',
    'Cancelled': '#ef4444',
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Header */}
      <header className="glass-nav">
        <div className="container flex justify-between items-center" style={{ height: '70px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            🛍️ Vasavi buyan — Admin
          </h1>
          <div className="flex items-center gap-4">
            <a href="/" style={{ fontSize: '0.9rem', color: '#6b7280', textDecoration: 'underline' }}>View Store</a>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
              <LogOut size={16} style={{ marginRight: '8px' }} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="container" style={{ marginTop: '32px' }}>
        <div className="flex gap-4 mb-8">
          <button
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('orders'); loadOrders(); }}
            style={{ padding: '10px 24px' }}
          >
            <Package size={18} style={{ marginRight: '8px' }} />
            Orders {orders.filter(o => o.status === 'New').length > 0 && `(${orders.filter(o => o.status === 'New').length} New)`}
          </button>
          <button
            className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('products')}
            style={{ padding: '10px 24px' }}
          >
            <ShoppingBag size={18} style={{ marginRight: '8px' }} />
            Products
          </button>
        </div>

        {/* ---- ORDERS TAB ---- */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="mb-8">Customer Orders</h2>
            {orders.length === 0 ? (
              <div className="glass-panel text-center" style={{ padding: '40px', color: '#6b7280' }}>
                No orders yet. Share your store link to start receiving orders!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map(order => (
                  <div key={order.id} className="glass-panel">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 style={{ fontSize: '1.2rem' }}>{order.customerName}</h3>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>📞 {order.customerPhone}</p>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>📍 {order.customerAddress}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '8px' }}>
                          ₹{order.total}
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: `2px solid ${statusColors[order.status] || '#6b7280'}`,
                            color: statusColors[order.status] || '#6b7280',
                            fontWeight: '600',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            background: 'white'
                          }}
                        >
                          <option value="New">🟡 New</option>
                          <option value="Processing">🔵 Processing</option>
                          <option value="Delivered">🟢 Delivered</option>
                          <option value="Cancelled">🔴 Cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                      <p style={{ fontWeight: '600', marginBottom: '8px' }}>Items Ordered:</p>
                      {order.items && order.items.map((item, i) => (
                        <div key={i} className="flex justify-between" style={{ color: '#4b5563', padding: '2px 0' }}>
                          <span>{item.title}</span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ marginTop: '12px', fontSize: '0.8rem', color: '#9ca3af' }}>
                      {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleString('en-IN') : 'Just now'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---- PRODUCTS TAB ---- */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2>Manage Products</h2>
              <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
                {isAdding ? 'Cancel' : <><Plus size={18} style={{ marginRight: '8px' }} /> Add New Product</>}
              </button>
            </div>

            {isAdding && (
              <div className="glass-panel mb-8" style={{ maxWidth: '600px', margin: '0 auto 32px auto' }}>
                <h3 className="mb-6">Add New Product</h3>
                <form onSubmit={handleAddProduct}>
                  <div className="mb-4">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Product Image</label>
                    <div
                      style={{ border: '2px dashed #d1d5db', borderRadius: 'var(--radius-md)', padding: '24px', textAlign: 'center', cursor: 'pointer' }}
                      onClick={() => document.getElementById('imageUpload').click()}
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px' }} />
                      ) : (
                        <div style={{ color: '#6b7280' }}>
                          <ImageIcon size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
                          <p>Click to upload image</p>
                        </div>
                      )}
                      <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </div>
                  </div>

                  <input type="text" placeholder="Product Title" className="input-field" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} required />
                  <textarea placeholder="Product Description" className="input-field" rows="3" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}></textarea>
                  <input type="number" placeholder="Price (₹)" className="input-field" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Product'}
                  </button>
                </form>
              </div>
            )}

            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                    <th style={{ padding: '16px 24px', fontWeight: '600' }}>Image</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600' }}>Title</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600' }}>Price</th>
                    <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No products added yet.</td>
                    </tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <img src={product.imageUrl} alt={product.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                        </td>
                        <td style={{ padding: '16px 24px', fontWeight: '500' }}>{product.title}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--primary)' }}>₹{product.price}</td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button onClick={() => handleDeleteProduct(product.id)} className="btn btn-danger" style={{ padding: '8px 12px' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
