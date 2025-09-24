import React, { useEffect, useState } from 'react';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const ADMIN_ID = 'admin123';

  // Check if logged-in user is admin
  useEffect(() => {
    const loggedInUserId = localStorage.getItem('userId');
    if (loggedInUserId !== ADMIN_ID) {
      alert('Access denied! Admins only.');
      // You would handle redirect here in your actual router implementation
      return;
    }
  }, []);

  // Fetch users and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // FIXED: Use the correct API endpoint with /api prefix
        const apiBaseUrl = 'http://localhost:5000/api';
        console.log('Attempting to fetch from:', `${apiBaseUrl}/orders/admin/all`);

        // Fetch all orders using the correct endpoint
        const ordersRes = await fetch(`${apiBaseUrl}/orders/admin/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Response status:', ordersRes.status);
        console.log('Response ok:', ordersRes.ok);

        if (!ordersRes.ok) {
          throw new Error(`HTTP error! status: ${ordersRes.status}`);
        }

        const ordersData = await ordersRes.json();
        console.log('Orders data received:', ordersData);

        if (ordersData.success) {
          setOrders(ordersData.orders);
          
          // Extract unique users from orders since orders contain username
          const uniqueUsers = {};
          ordersData.orders.forEach(order => {
            if (!uniqueUsers[order.username]) {
              uniqueUsers[order.username] = {
                username: order.username,
                phoneNumber: order.phoneNumber,
                address: order.deliveryAddress,
                totalOrders: 0,
                totalSpent: 0
              };
            }
            uniqueUsers[order.username].totalOrders++;
            uniqueUsers[order.username].totalSpent += order.totalAmount;
          });
          
          setUsers(Object.values(uniqueUsers));
        } else {
          throw new Error(ordersData.message || 'Failed to fetch orders');
        }

      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError(`Failed to fetch data: ${err.message}. Please check server connection.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserOrders = (username) => {
    return orders.filter(order => order.username === username);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // FIXED: Use correct API endpoint
      const apiBaseUrl = 'http://localhost:5000/api';
      const response = await fetch(`${apiBaseUrl}/orders/status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the order in state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        alert('Order status updated successfully!');
      } else {
        alert('Failed to update order status: ' + data.message);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Error updating order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      out_for_delivery: '#f97316',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '1.2rem'
      }}>
        Loading Admin Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        color: '#ef4444',
        fontSize: '1.1rem'
      }}>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '1rem 2rem',
      marginBottom: '2rem'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#2563eb'
    },
    navButtons: {
      display: 'flex',
      gap: '1rem'
    },
    btnLogin: {
      padding: '0.75rem 1.5rem',
      backgroundColor: 'transparent',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '500'
    },
    mainContent: {
      padding: '0 2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    dashboardHeader: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    title: {
      margin: '0 0 1rem 0',
      color: '#1f2937',
      fontSize: '2rem',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>LaundryPro Admin</div>
          <div style={styles.navButtons}>
            <button 
              style={styles.btnLogin}
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </button>
            <button 
              style={styles.btnLogin}
              onClick={() => {
                localStorage.removeItem('userId');
                window.location.href = '/';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        {/* Dashboard Header */}
        <div style={styles.dashboardHeader}>
          <h1 style={styles.title}>
            Admin Dashboard
          </h1>
        
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center',
              color: 'white'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', opacity: '0.9' }}>Total Users</h3>
              <p style={{ margin: '0', fontSize: '2.5rem', fontWeight: 'bold' }}>
                {users.length}
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center',
              color: 'white'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', opacity: '0.9' }}>Total Orders</h3>
              <p style={{ margin: '0', fontSize: '2.5rem', fontWeight: 'bold' }}>
                {orders.length}
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center',
              color: 'white'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', opacity: '0.9' }}>Total Revenue</h3>
              <p style={{ margin: '0', fontSize: '2.5rem', fontWeight: 'bold' }}>
                ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Users and Orders */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedUser ? '1fr 2fr' : '1fr',
          gap: '2rem'
        }}>
          {/* Users List */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              margin: '0 0 1.5rem 0',
              color: '#1f2937',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.75rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              Users ({users.length})
            </h2>

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {users.map((user, index) => (
                <div
                  key={index}
                  style={{
                    border: selectedUser?.username === user.username ? '2px solid #2563eb' : '1px solid #e5e7eb',
                    padding: '1.25rem',
                    marginBottom: '1rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: selectedUser?.username === user.username ? '#eff6ff' : 'white',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedUser?.username === user.username ? '0 4px 12px rgba(37,99,235,0.2)' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  onClick={() => setSelectedUser(user)}
                  onMouseEnter={(e) => {
                    if (selectedUser?.username !== user.username) {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUser?.username !== user.username) {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                    }
                  }}
                >
                  <h3 style={{
                    margin: '0 0 0.75rem 0',
                    color: '#1f2937',
                    fontSize: '1.2rem',
                    fontWeight: '600'
                  }}>
                    {user.username}
                  </h3>
                  
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    <p style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', minWidth: '60px' }}>Phone:</span> 
                      <span>{user.phoneNumber}</span>
                    </p>
                    <p style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', minWidth: '60px' }}>Orders:</span> 
                      <span style={{ 
                        backgroundColor: '#f3f4f6', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {user.totalOrders}
                      </span>
                    </p>
                    <p style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', minWidth: '60px' }}>Spent:</span> 
                      <span style={{ 
                        backgroundColor: '#dcfce7', 
                        color: '#166534',
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        ${user.totalSpent.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected User Orders */}
          {selectedUser && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                margin: '0 0 1.5rem 0',
                color: '#1f2937',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.75rem',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                Orders for {selectedUser.username}
              </h2>

              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {getUserOrders(selectedUser.username).length > 0 ? (
                  getUserOrders(selectedUser.username).map(order => (
                    <div
                      key={order._id}
                      style={{
                        border: '1px solid #e5e7eb',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        borderRadius: '12px',
                        backgroundColor: '#fafbfc',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = 'none';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        <h4 style={{
                          margin: '0',
                          color: '#1f2937',
                          fontSize: '1.2rem',
                          fontWeight: '600'
                        }}>
                          Order #{order.orderNumber}
                        </h4>
                        
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: '2px solid #e5e7eb',
                            backgroundColor: getStatusColor(order.status),
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div style={{
                        fontSize: '0.95rem',
                        color: '#4b5563',
                        lineHeight: '1.6'
                      }}>
                        <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontWeight: '600', minWidth: '80px', color: '#374151' }}>Date:</span> 
                          <span>{formatDate(order.orderDate)}</span>
                        </p>
                        
                        <div style={{ margin: '1rem 0' }}>
                          <p style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Items:</p>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}>
                            {order.items.map((item, idx) => (
                              <div key={idx} style={{ 
                                margin: '0.5rem 0',
                                padding: '0.5rem 0',
                                borderBottom: idx < order.items.length - 1 ? '1px solid #f3f4f6' : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <span style={{ fontWeight: '500' }}>{item.name}</span>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
                                  <span>Qty: {item.quantity}</span>
                                  <span>${item.price.toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontWeight: '600', minWidth: '80px', color: '#374151' }}>Total:</span> 
                          <span style={{
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '1rem'
                          }}>
                            ${order.totalAmount.toFixed(2)}
                          </span>
                        </p>
                        
                        <div style={{ margin: '1rem 0' }}>
                          <p style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Delivery Address:</p>
                          <div style={{
                            backgroundColor: 'white',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            fontSize: '0.9rem'
                          }}>
                            {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                          </div>
                        </div>
                        
                        {order.specialInstructions && (
                          <div style={{ margin: '1rem 0' }}>
                            <p style={{ fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Special Instructions:</p>
                            <div style={{
                              backgroundColor: '#fef3c7',
                              padding: '0.75rem',
                              borderRadius: '8px',
                              border: '1px solid #fbbf24',
                              fontSize: '0.9rem',
                              fontStyle: 'italic'
                            }}>
                              {order.specialInstructions}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ 
                    color: '#6b7280', 
                    textAlign: 'center', 
                    padding: '3rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '2px dashed #d1d5db'
                  }}>
                    <p style={{ fontSize: '1.1rem', margin: '0' }}>No orders placed yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;