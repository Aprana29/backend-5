import React, { useState, useEffect } from "react";
import { Shirt, ArrowLeft, ShoppingCart, Plus, Minus, Clock, Star, MapPin, Phone, FileText } from "lucide-react";

const ServicesPage = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    specialInstructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enhanced authentication check
  useEffect(() => {
    console.log('=== SERVICES PAGE AUTH CHECK ===');
    
    // Check multiple storage locations for username
    const localUsername = localStorage.getItem("username");
    const sessionUsername = sessionStorage.getItem("username");
    const localUser = localStorage.getItem("user");
    const sessionUser = sessionStorage.getItem("user");
    
    console.log('localStorage username:', localUsername);
    console.log('sessionStorage username:', sessionUsername);
    console.log('localStorage user:', localUser);
    console.log('sessionStorage user:', sessionUser);
    
    // Try to find username from any source
    let username = localUsername || sessionUsername;
    
    // If no username found, try to extract from user object
    if (!username) {
      try {
        const userObj = JSON.parse(localUser || sessionUser || '{}');
        username = userObj.name || userObj.username || userObj.email;
        console.log('Extracted username from user object:', username);
      } catch (e) {
        console.log('Could not parse user object:', e.message);
      }
    }
    
    if (!username) {
      console.log('No valid authentication found, redirecting to login');
      alert("Please login first to access services");
      window.location.href = '/login';
    } else {
      console.log('Authentication found:', username);
    }
  }, []);

  const services = [
    { id: 1, name: 'Wash & Fold', category: 'standard', price: 15, originalPrice: 18, description: 'Complete wash, dry, and fold service', duration: '24 hours', image: '🧺', popular: true },
    { id: 2, name: 'Dry Cleaning', category: 'premium', price: 25, originalPrice: 30, description: 'Professional dry cleaning service', duration: '48 hours', image: '👔' },
    { id: 3, name: 'Express Wash', category: 'express', price: 20, originalPrice: 22, description: 'Quick wash and dry service', duration: '4 hours', image: '⚡' },
    { id: 4, name: 'Ironing Service', category: 'standard', price: 10, originalPrice: 12, description: 'Professional ironing and pressing', duration: '12 hours', image: '👕' },
    { id: 5, name: 'Delicate Care', category: 'premium', price: 22, originalPrice: 26, description: 'Special care for delicate fabrics', duration: '36 hours', image: '🧵' },
    { id: 6, name: 'Comforter Cleaning', category: 'specialty', price: 35, originalPrice: 40, description: 'Deep cleaning for bulky items', duration: '72 hours', image: '🛏️' }
  ];

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'standard', name: 'Standard' },
    { id: 'premium', name: 'Premium' },
    { id: 'express', name: 'Express' },
    { id: 'specialty', name: 'Specialty' }
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(service => service.category === selectedCategory);

  const addToCart = (service) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === service.id);
      if (existing) {
        return prev.map(item =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const updateQuantity = (serviceId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== serviceId));
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === serviceId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleDeliveryInfoChange = (field, value) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Enhanced checkout function with proper redirect
  const handleCheckout = async () => {
    setIsSubmitting(true);
    
    try {
      // Get username from multiple sources
      let username = localStorage.getItem("username") || sessionStorage.getItem("username");
      
      // If no direct username, try extracting from user object
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
      
      // Validate username
      if (!username) {
        alert("Please login first");
        window.location.href = '/login';
        return;
      }

      // Validate form data
      if (!deliveryInfo.street || !deliveryInfo.city || !deliveryInfo.state || 
          !deliveryInfo.zipCode || !deliveryInfo.phoneNumber) {
        alert("Please fill in all required delivery information");
        return;
      }

      console.log('Placing order for username:', username);

      // Prepare order data
      const orderData = {
        username,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartTotal,
        deliveryAddress: {
          street: deliveryInfo.street,
          city: deliveryInfo.city,
          state: deliveryInfo.state,
          zipCode: deliveryInfo.zipCode
        },
        phoneNumber: deliveryInfo.phoneNumber,
        specialInstructions: deliveryInfo.specialInstructions
      };

      console.log('Order data being sent:', orderData);

      // Send order to backend
      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log('Order response:', data);
      
      if (data.success) {
        // Show success message
        alert(`Order placed successfully! Order #${data.order.orderNumber}\nRedirecting to your orders page...`);
        
        // Clear cart and form
        setCart([]);
        setShowCart(false);
        setShowCheckoutForm(false);
        setDeliveryInfo({
          street: '',
          city: '',
          state: '',
          zipCode: '',
          phoneNumber: '',
          specialInstructions: ''
        });
        
        // Redirect to orders page after a short delay
        setTimeout(() => {
          window.location.href = '/orders';
        }, 2000);
      } else {
        alert(data.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Unable to connect to server. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setShowCheckoutForm(true);
  };

  // Debug function for testing authentication
  const debugAuth = () => {
    console.log('=== AUTHENTICATION DEBUG ===');
    console.log('localStorage:');
    console.log('  username:', localStorage.getItem('username'));
    console.log('  user:', localStorage.getItem('user'));
    
    console.log('sessionStorage:');
    console.log('  username:', sessionStorage.getItem('username'));
    console.log('  user:', sessionStorage.getItem('user'));
    
    // Try to extract username
    let username = localStorage.getItem("username") || sessionStorage.getItem("username");
    if (!username) {
      try {
        const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          username = userObj.name || userObj.username || userObj.email;
        }
      } catch (e) {
        console.log('Error parsing user:', e.message);
      }
    }
    
    console.log('Final detected username:', username);
    alert(`Check console for auth debug info. Detected username: ${username || 'None'}`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.navLeft}>
            <button style={styles.backBtn} onClick={() => window.location.href = '/'}>
              <ArrowLeft size={18} />
              Back to Home
            </button>
            <div style={styles.logo}>
              <Shirt size={24} color="#4F46E5" />
              <span style={styles.logoText}>CleanCare Services</span>
            </div>
          </div>
          <div style={styles.navRight}>
            <button style={styles.ordersBtn} onClick={() => window.location.href = '/orders'}>
              My Orders
            </button>
            <button
              onClick={() => setShowCart(!showCart)}
              style={{
                ...styles.cartBtn,
                ...(cartCount > 0 ? styles.cartBtnActive : {})
              }}
            >
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span style={styles.cartBadge}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.main}>
        {/* Title */}
        <div style={styles.header}>
          <h1 style={styles.title}>Our Professional Services</h1>
          <p style={styles.subtitle}>
            Choose from our comprehensive range of laundry services with free pickup & delivery
          </p>
          <div style={styles.offerBanner}>
            🎉 Limited Time: Up to 17% OFF on all services!
          </div>
        </div>

        <div style={styles.content}>
          {/* Categories */}
          <div style={styles.sidebar}>
            <div style={styles.categoryCard}>
              <h3 style={styles.categoryTitle}>Categories</h3>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    ...styles.categoryBtn,
                    ...(selectedCategory === category.id ? styles.categoryBtnActive : {})
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div style={styles.servicesContainer}>
            <div style={styles.servicesGrid}>
              {filteredServices.map((service) => {
                const cartItem = cart.find(item => item.id === service.id);
                return (
                  <div key={service.id} style={styles.serviceCard}>
                    {service.popular && (
                      <div style={styles.popularBadge}>POPULAR</div>
                    )}
                    <div style={styles.serviceContent}>
                      <div style={styles.serviceHeader}>
                        <div style={styles.serviceIcon}>{service.image}</div>
                        <h3 style={styles.serviceName}>{service.name}</h3>
                      </div>

                      <p style={styles.serviceDesc}>{service.description}</p>

                      <div style={styles.serviceDuration}>
                        <Clock size={16} color="#6B7280" />
                        <span>Ready in {service.duration}</span>
                      </div>

                      <div style={styles.pricing}>
                        <span style={styles.price}>${service.price}</span>
                        <span style={styles.originalPrice}>${service.originalPrice}</span>
                      </div>

                      <div style={styles.rating}>
                        <div style={styles.stars}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill="#FCD34D" color="#FCD34D" />
                          ))}
                        </div>
                        <span style={styles.ratingText}>4.9 (150+)</span>
                      </div>

                      {cartItem ? (
                        <div style={styles.quantityControls}>
                          <button
                            onClick={() => updateQuantity(service.id, cartItem.quantity - 1)}
                            style={styles.quantityBtn}
                          >
                            <Minus size={16} />
                          </button>
                          <span style={styles.quantity}>{cartItem.quantity}</span>
                          <button
                            onClick={() => updateQuantity(service.id, cartItem.quantity + 1)}
                            style={{ ...styles.quantityBtn, ...styles.quantityBtnPlus }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(service)}
                          style={styles.addBtn}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && !showCheckoutForm && (
        <>
          <div style={styles.cartOverlay} onClick={() => setShowCart(false)}></div>
          <div style={styles.cartSidebar}>
            <div style={styles.cartHeader}>
              <h3 style={styles.cartTitle}>Your Cart</h3>
              <button onClick={() => setShowCart(false)} style={styles.cartClose}>✕</button>
            </div>

            {cart.length > 0 ? (
              <>
                <div style={styles.cartItems}>
                  {cart.map((item) => (
                    <div key={item.id} style={styles.cartItem}>
                      <div style={styles.cartItemInfo}>
                        <div style={styles.cartItemIcon}>{item.image}</div>
                        <div>
                          <div style={styles.cartItemName}>{item.name}</div>
                          <div style={styles.cartItemPrice}>${item.price} each</div>
                        </div>
                      </div>
                      <div style={styles.cartItemControls}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={styles.cartQuantityBtn}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={styles.cartQuantity}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ ...styles.cartQuantityBtn, ...styles.cartQuantityBtnPlus }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={styles.cartFooter}>
                  <div style={styles.cartTotal}>
                    <span>Total: </span>
                    <span style={styles.cartTotalAmount}>${cartTotal}</span>
                  </div>
                  <button style={styles.checkoutBtn} onClick={proceedToCheckout}>
                    Proceed to Checkout
                  </button>
                  <p style={styles.cartNote}>Free pickup & delivery included</p>
                </div>
              </>
            ) : (
              <div style={styles.emptyCart}>
                <ShoppingCart size={48} color="#9CA3AF" />
                <p style={styles.emptyCartText}>Your cart is empty</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout Form */}
      {showCheckoutForm && (
        <>
          <div style={styles.cartOverlay} onClick={() => setShowCheckoutForm(false)}></div>
          <div style={styles.checkoutSidebar}>
            <div style={styles.cartHeader}>
              <h3 style={styles.cartTitle}>Checkout Details</h3>
              <button onClick={() => setShowCheckoutForm(false)} style={styles.cartClose}>✕</button>
            </div>

            <div style={styles.checkoutForm}>
              <div style={styles.formSection}>
                <h4 style={styles.sectionTitle}>
                  <MapPin size={18} />
                  Delivery Address *
                </h4>
                <input
                  type="text"
                  placeholder="Street Address *"
                  value={deliveryInfo.street}
                  onChange={(e) => handleDeliveryInfoChange('street', e.target.value)}
                  style={styles.formInput}
                  required
                />
                <div style={styles.formRow}>
                  <input
                    type="text"
                    placeholder="City *"
                    value={deliveryInfo.city}
                    onChange={(e) => handleDeliveryInfoChange('city', e.target.value)}
                    style={{ ...styles.formInput, flex: 1, marginRight: '8px' }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={deliveryInfo.state}
                    onChange={(e) => handleDeliveryInfoChange('state', e.target.value)}
                    style={{ ...styles.formInput, flex: 1, marginLeft: '8px' }}
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="ZIP Code *"
                  value={deliveryInfo.zipCode}
                  onChange={(e) => handleDeliveryInfoChange('zipCode', e.target.value)}
                  style={styles.formInput}
                  required
                />
              </div>

              <div style={styles.formSection}>
                <h4 style={styles.sectionTitle}>
                  <Phone size={18} />
                  Contact Information *
                </h4>
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={deliveryInfo.phoneNumber}
                  onChange={(e) => handleDeliveryInfoChange('phoneNumber', e.target.value)}
                  style={styles.formInput}
                  required
                />
              </div>

              <div style={styles.formSection}>
                <h4 style={styles.sectionTitle}>
                  <FileText size={18} />
                  Special Instructions (Optional)
                </h4>
                <textarea
                  placeholder="Any special instructions for pickup/delivery..."
                  value={deliveryInfo.specialInstructions}
                  onChange={(e) => handleDeliveryInfoChange('specialInstructions', e.target.value)}
                  style={styles.formTextarea}
                />
              </div>

              <div style={styles.orderSummary}>
                <h4 style={styles.summaryTitle}>Order Summary</h4>
                {cart.map((item) => (
                  <div key={item.id} style={styles.summaryItem}>
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={styles.summaryTotal}>
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <p style={styles.summaryNote}>* Free pickup & delivery included</p>
              </div>

              <button 
                style={{
                  ...styles.placeOrderBtn,
                  ...(isSubmitting ? styles.placeOrderBtnDisabled : {})
                }}
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order & Continue'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Floating Cart Button */}
      {cartCount > 0 && !showCart && !showCheckoutForm && (
        <button
          onClick={() => setShowCart(true)}
          style={styles.floatingCart}
        >
          <ShoppingCart size={24} />
          <span style={styles.floatingCartBadge}>{cartCount}</span>
        </button>
      )}
    </div>
  );
};

const styles = {
  container: { fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  nav: { background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 40 },
  navContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' },
  navLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px', padding: '8px 12px', borderRadius: '6px', transition: 'all 0.3s ease' },
  ordersBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: '#10B981', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', padding: '8px 16px', borderRadius: '6px', transition: 'all 0.3s ease', fontWeight: '500' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoText: { fontSize: '20px', fontWeight: 'bold', color: '#1F2937' },
  cartBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: 'none', borderRadius: '8px', background: '#F3F4F6', color: '#6B7280', cursor: 'pointer', fontWeight: '500', fontSize: '14px', transition: 'all 0.3s ease', position: 'relative' },
  cartBtnActive: { background: '#4F46E5', color: 'white' },
  cartBadge: { position: 'absolute', top: '-8px', right: '-8px', background: '#EF4444', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
  header: { textAlign: 'center', marginBottom: '40px', color: 'white' },
  title: { fontSize: '3rem', fontWeight: 'bold', margin: '0 0 16px', textShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  subtitle: { fontSize: '1.2rem', margin: '0 0 20px', opacity: 0.9 },
  offerBanner: { background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)', color: 'white', padding: '12px 24px', borderRadius: '50px', display: 'inline-block', fontWeight: '600', fontSize: '14px' },
  content: { display: 'grid', gridTemplateColumns: '250px 1fr', gap: '30px', alignItems: 'start' },
  sidebar: { position: 'sticky', top: '100px' },
  categoryCard: { background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' },
  categoryTitle: { fontSize: '18px', fontWeight: 'bold', color: '#1F2937', margin: '0 0 16px' },
  categoryBtn: { width: '100%', padding: '12px 16px', margin: '4px 0', border: 'none', borderRadius: '8px', background: 'transparent', color: '#6B7280', cursor: 'pointer', textAlign: 'left', fontWeight: '500', fontSize: '14px', transition: 'all 0.3s ease' },
  categoryBtnActive: { background: '#4F46E5', color: 'white' },
  servicesContainer: { minHeight: '400px' },
  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  serviceCard: { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', transition: 'all 0.3s ease', position: 'relative' },
  popularBadge: { position: 'absolute', top: '12px', left: '12px', background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', zIndex: 10 },
  serviceContent: { padding: '24px' },
  serviceHeader: { textAlign: 'center', marginBottom: '16px' },
  serviceIcon: { fontSize: '3rem', marginBottom: '8px' },
  serviceName: { fontSize: '1.3rem', fontWeight: 'bold', color: '#1F2937', margin: 0 },
  serviceDesc: { color: '#6B7280', fontSize: '14px', textAlign: 'center', marginBottom: '16px', lineHeight: '1.5' },
  serviceDuration: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#6B7280', marginBottom: '16px' },
  pricing: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  price: { fontWeight: 'bold', color: '#4F46E5', fontSize: '18px' },
  originalPrice: { fontSize: '14px', color: '#9CA3AF', textDecoration: 'line-through' },
  rating: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '16px' },
  stars: { display: 'flex', gap: '2px' },
  ratingText: { fontSize: '12px', color: '#6B7280' },
  addBtn: { width: '100%', padding: '10px', border: 'none', borderRadius: '12px', background: '#4F46E5', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.3s ease' },
  quantityControls: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },
  quantityBtn: { background: '#E5E7EB', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer' },
  quantityBtnPlus: { background: '#4F46E5', color: 'white' },
  quantity: { fontWeight: '600' },
  cartOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 50 },
  cartSidebar: { position: 'fixed', top: 0, right: 0, width: '360px', height: '100%', background: 'white', zIndex: 60, display: 'flex', flexDirection: 'column', padding: '20px', boxShadow: '-4px 0 30px rgba(0,0,0,0.2)' },
  checkoutSidebar: { position: 'fixed', top: 0, right: 0, width: '420px', height: '100%', background: 'white', zIndex: 60, display: 'flex', flexDirection: 'column', padding: '20px', boxShadow: '-4px 0 30px rgba(0,0,0,0.2)' },
  cartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  cartTitle: { fontSize: '20px', fontWeight: 'bold', color: '#1F2937' },
  cartClose: { border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#6B7280' },
  cartItems: { flex: 1, overflowY: 'auto', marginBottom: '20px' },
  cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  cartItemInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  cartItemIcon: { fontSize: '2rem' },
  cartItemName: { fontWeight: '600', color: '#1F2937' },
  cartItemPrice: { fontSize: '12px', color: '#6B7280' },
  cartItemControls: { display: 'flex', alignItems: 'center', gap: '6px' },
  cartQuantityBtn: { background: '#E5E7EB', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' },
  cartQuantityBtnPlus: { background: '#4F46E5', color: 'white' },
  cartQuantity: { fontWeight: '600', minWidth: '24px', textAlign: 'center' },
  cartFooter: {},
  cartTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' },
  cartTotalAmount: { color: '#4F46E5' },
  checkoutBtn: { width: '100%', padding: '12px', border: 'none', borderRadius: '12px', background: '#4F46E5', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  cartNote: { fontSize: '12px', color: '#6B7280', marginTop: '8px', textAlign: 'center' },
  emptyCart: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, color: '#6B7280' },
  emptyCartText: { marginTop: '12px', fontSize: '14px' },
  floatingCart: { position: 'fixed', bottom: '24px', right: '24px', width: '60px', height: '60px', borderRadius: '50%', background: '#4F46E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 70, border: 'none', boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)' },
  floatingCartBadge: { position: 'absolute', top: '-4px', right: '-4px', background: '#EF4444', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  
  // Checkout form styles
  checkoutForm: { flex: 1, overflowY: 'auto' },
  formSection: { marginBottom: '24px' },
  sectionTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' },
  formInput: { width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', marginBottom: '12px', fontFamily: 'inherit' },
  formRow: { display: 'flex', gap: '8px' },
  formTextarea: { width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '14px', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' },
  orderSummary: { background: '#F9FAFB', padding: '16px', borderRadius: '8px', marginBottom: '20px' },
  summaryTitle: { fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#6B7280' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', color: '#1F2937', paddingTop: '8px', borderTop: '1px solid #E5E7EB', marginTop: '8px' },
  summaryNote: { fontSize: '12px', color: '#6B7280', marginTop: '8px', fontStyle: 'italic' },
  placeOrderBtn: { width: '100%', padding: '14px', border: 'none', borderRadius: '12px', background: '#4F46E5', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '16px', transition: 'all 0.3s ease' },
  placeOrderBtnDisabled: { background: '#9CA3AF', cursor: 'not-allowed' }
};

export default ServicesPage;



