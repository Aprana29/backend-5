import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, MapPin, Phone, FileText, RefreshCw } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const getUserInfo = () => {
    // Try to get username from multiple sources
    let username = localStorage.getItem("username") || sessionStorage.getItem("username");
    
    if (!username) {
      try {
        const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          username = userObj.name || userObj.username || userObj.email;
        }
      } catch (e) {
        console.error('Error parsing user object:', e);
      }
    }

    return username;
  };

  const fetchUserOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
      const username = getUserInfo();
      
      if (!username) {
        setError('Please login first to view your orders');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      setCurrentUser(username);

      console.log('Fetching orders for username:', username);

      const response = await fetch(`http://localhost:5000/api/orders/user/${encodeURIComponent(username)}`);
      const data = await response.json();

      console.log('Orders response:', data);

      if (data.success) {
        setOrders(data.orders);
        if (data.orders.length === 0) {
          setError('No orders found. Place your first order to see it here!');
        }
      } else {
        setError(data.message || 'Failed to load orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Unable to connect to server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#3B82F6';
      case 'processing': return '#8B5CF6';
      case 'out_for_delivery': return '#06B6D4';
      case 'delivered': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Order Pending';
      case 'confirmed': return 'Order Confirmed';
      case 'processing': return 'Being Processed';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <RefreshCw size={48} color="#4F46E5" style={{ animation: 'spin 1s linear infinite' }} />
          <h2 style={styles.loadingText}>Loading Your Orders...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <button style={styles.backBtn} onClick={() => window.location.href = '/'}>
            <ArrowLeft size={18} />
            Back to Home
          </button>
          <div style={styles.navTitle}>
            <Package size={24} color="#4F46E5" />
            <span>My Orders</span>
          </div>
          <div style={styles.navUser}>
            Welcome, <span style={styles.username}>{currentUser}</span>
          </div>
        </div>
      </nav>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Your Orders</h1>
          <p style={styles.subtitle}>
            Track your laundry service orders and delivery status
          </p>
          <button style={styles.refreshBtn} onClick={fetchUserOrders}>
            <RefreshCw size={16} />
            Refresh Orders
          </button>
        </div>

        {error ? (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>📋</div>
            <h3 style={styles.errorTitle}>Error Loading Orders</h3>
            <p style={styles.errorText}>{error}</p>
            <button style={styles.tryAgainBtn} onClick={fetchUserOrders}>
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIcon}>📦</div>
            <h3 style={styles.emptyTitle}>No Orders Yet</h3>
            <p style={styles.emptyText}>
              You haven't placed any orders yet. Start by browsing our services!
            </p>
            <button 
              style={styles.browseBtn}
              onClick={() => window.location.href = '/services'}
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div style={styles.ordersContainer}>
            {orders.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div style={styles.orderNumber}>
                    <Package size={20} />
                    <span>Order #{order.orderNumber}</span>
                  </div>
                  <div 
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(order.status) + '20',
                      color: getStatusColor(order.status)
                    }}
                  >
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div style={styles.orderContent}>
                  <div style={styles.orderInfo}>
                    <div style={styles.infoSection}>
                      <h4 style={styles.sectionTitle}>Order Details</h4>
                      <div style={styles.orderItems}>
                        {order.items.map((item, index) => (
                          <div key={index} style={styles.orderItem}>
                            <span style={styles.itemName}>{item.name}</span>
                            <span style={styles.itemDetails}>
                              {item.quantity}x ${item.price} = ${item.total}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div style={styles.orderTotal}>
                        <span>Total: </span>
                        <span style={styles.totalAmount}>${order.totalAmount}</span>
                      </div>
                    </div>

                    <div style={styles.infoSection}>
                      <h4 style={styles.sectionTitle}>
                        <MapPin size={16} />
                        Delivery Address
                      </h4>
                      <div style={styles.addressText}>
                        {order.deliveryAddress.street}<br/>
                        {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                      </div>
                    </div>

                    <div style={styles.infoSection}>
                      <h4 style={styles.sectionTitle}>
                        <Phone size={16} />
                        Contact
                      </h4>
                      <div style={styles.contactText}>{order.phoneNumber}</div>
                    </div>

                    {order.specialInstructions && (
                      <div style={styles.infoSection}>
                        <h4 style={styles.sectionTitle}>
                          <FileText size={16} />
                          Special Instructions
                        </h4>
                        <div style={styles.instructionsText}>
                          {order.specialInstructions}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={styles.orderTimeline}>
                    <div style={styles.timelineItem}>
                      <Clock size={16} />
                      <div>
                        <div style={styles.timelineLabel}>Order Placed</div>
                        <div style={styles.timelineDate}>
                          {formatDate(order.orderDate)}
                        </div>
                      </div>
                    </div>
                    {order.estimatedDelivery && (
                      <div style={styles.timelineItem}>
                        <Package size={16} />
                        <div>
                          <div style={styles.timelineLabel}>Estimated Delivery</div>
                          <div style={styles.timelineDate}>
                            {formatDate(order.estimatedDelivery)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  nav: {
    background: 'white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 40
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px'
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'all 0.3s ease'
  },
  navTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1F2937'
  },
  navUser: {
    fontSize: '14px',
    color: '#6B7280'
  },
  username: {
    fontWeight: '600',
    color: '#4F46E5'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    color: 'white'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: '0 0 16px',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  subtitle: {
    fontSize: '1.2rem',
    margin: '0 0 20px',
    opacity: 0.9
  },
  refreshBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    color: 'white'
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '1.5rem',
    fontWeight: '500'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    maxWidth: '500px',
    margin: '0 auto'
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '16px'
  },
  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1F2937',
    margin: '0 0 12px'
  },
  errorText: {
    color: '#6B7280',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  tryAgainBtn: {
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    maxWidth: '500px',
    margin: '0 auto'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1F2937',
    margin: '0 0 12px'
  },
  emptyText: {
    color: '#6B7280',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  browseBtn: {
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px'
  },
  ordersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  orderCard: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 0',
    marginBottom: '16px'
  },
  orderNumber: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1F2937'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  orderContent: {
    padding: '0 24px 24px'
  },
  orderInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  infoSection: {
    marginBottom: '16px'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '8px'
  },
  orderItems: {
    marginBottom: '12px'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    fontSize: '14px'
  },
  itemName: {
    color: '#1F2937'
  },
  itemDetails: {
    color: '#6B7280'
  },
  orderTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#1F2937',
    paddingTop: '8px',
    borderTop: '1px solid #E5E7EB'
  },
  totalAmount: {
    color: '#4F46E5'
  },
  addressText: {
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: '1.4'
  },
  contactText: {
    fontSize: '14px',
    color: '#6B7280'
  },
  instructionsText: {
    fontSize: '14px',
    color: '#6B7280',
    fontStyle: 'italic'
  },
  orderTimeline: {
    display: 'flex',
    gap: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #E5E7EB'
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6B7280'
  },
  timelineLabel: {
    fontSize: '12px',
    fontWeight: '500'
  },
  timelineDate: {
    fontSize: '12px',
    opacity: 0.8
  }
}
export default OrdersPage