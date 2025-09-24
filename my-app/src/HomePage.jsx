import React, { useState, useEffect } from 'react';
import { Shirt, Clock, Star, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CleanCareSimple = () => {
  const navigate = useNavigate(); // Hook inside component
  const [activeService, setActiveService] = useState(-1);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { icon: '🧺', name: 'Wash & Fold', price: '$15', desc: 'Complete wash, dry, and fold service' },
    { icon: '👔', name: 'Dry Cleaning', price: '$25', desc: 'Professional dry cleaning service' },
    { icon: '⚡', name: 'Express Service', price: '$20', desc: 'Quick wash and dry service' },
    { icon: '👕', name: 'Ironing Service', price: '$10', desc: 'Professional ironing and pressing' }
  ];

  return (
    <div style={styles.container}>
      {/* Header / Navbar */}
      <nav style={{...styles.nav, ...(scrolled ? styles.navScrolled : {})}}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <Shirt size={28} style={styles.logoIcon} />
            <span style={styles.logoText}>CleanCare</span>
          </div>
  <div style={styles.navButtons}>
   {/* <button style={styles.btnLogin} onClick={() => navigate('/login')}>Login</button>
  <button style={styles.btnSignup} onClick={() => navigate('/signup')}>Sign Up</button>
  <button style={styles.btnLogin} onClick={() => navigate('/services')}>Services</button>
  <button style={styles.btnSignup} onClick={() => navigate('/orders')}>Orders</button>
  <button style={styles.btnblog} onClick={() => navigate('/blog')}>Blog</button> *
   */}

<button style={styles.btnLogin} onClick={() => navigate('/login')}>Login</button>
<button style={styles.btnSignup} onClick={() => navigate('/signup')}>Sign Up</button>
<button style={styles.btnLogin} onClick={() => navigate('/services')}>Services</button>
<button style={styles.btnSignup} onClick={() => navigate('/orders')}>Orders</button>
<button style={styles.btnLogin} onClick={() => navigate('/blog')}>Blog</button>

  {/* Admin Button */}
  <button
    style={styles.btnLogin} // you can choose btnSignup if you want different style
    onClick={() => {
      const email = prompt('Enter Admin Email:');
      const password = prompt('Enter Admin Password:');

      if (email === 'admin@gmail.com' && password === '123456') {
        localStorage.setItem('userId', 'admin123'); // store admin ID
        alert('Login successful! Redirecting to Admin Dashboard...');
        navigate('/admin'); // redirect to admin page
      } else {
        alert('Invalid credentials! Access denied.');
      }
    }}
  >
    Admin
  </button>
</div>

         
   





        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Professional Laundry Service
            <span style={styles.heroSubtitle}>Made Simple</span>
          </h1>
          <p style={styles.heroText}>
            Experience the convenience of professional laundry care. We pick up, clean, and deliver your clothes with care.
          </p>
          <div style={styles.heroButtons}>
            <button style={styles.btnPrimary}>Book Now</button>
            <button style={styles.btnSecondary}>View Services</button>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statNumber}>5000+</div>
            <div style={styles.statLabel}>Happy Customers</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>Service Available</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>99%</div>
            <div style={styles.statLabel}>Customer Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={styles.services}>
        <h2 style={styles.sectionTitle}>Our Services</h2>
        <div style={styles.serviceGrid}>
          {services.map((service, index) => (
            <div
              key={index}
              style={{
                ...styles.serviceCard,
                ...(activeService === index ? styles.serviceCardActive : {})
              }}
              onMouseEnter={() => setActiveService(index)}
              onMouseLeave={() => setActiveService(-1)}
            >
              <div style={styles.serviceIcon}>{service.icon}</div>
              <h3 style={styles.serviceName}>{service.name}</h3>
              <p style={styles.serviceDesc}>{service.desc}</p>
              <div style={styles.servicePrice}>{service.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose CleanCare?</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}><Clock size={40} color="#4F46E5" /></div>
            <h3 style={styles.featureTitle}>Fast & Reliable</h3>
            <p style={styles.featureText}>Quick turnaround with express options available</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}><Star size={40} color="#10B981" /></div>
            <h3 style={styles.featureTitle}>Premium Quality</h3>
            <p style={styles.featureText}>Professional-grade cleaning with attention to detail</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}><CheckCircle size={40} color="#8B5CF6" /></div>
            <h3 style={styles.featureTitle}>Doorstep Service</h3>
            <p style={styles.featureText}>Free pickup and delivery right to your door</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={styles.contact}>
        <div style={styles.contactGrid}>
          <div>
            <h3 style={styles.contactTitle}>Get in Touch</h3>
            <p style={styles.contactText}>Ready to experience the best laundry service? Contact us today!</p>
            <div style={styles.contactInfo}>
              <div style={styles.contactItem}><Phone size={24} color="#4F46E5" /><div><div style={styles.contactLabel}>Phone</div><div style={styles.contactValue}>(555) 123-4567</div></div></div>
              <div style={styles.contactItem}><Mail size={24} color="#4F46E5" /><div><div style={styles.contactLabel}>Email</div><div style={styles.contactValue}>info@cleancare.com</div></div></div>
              <div style={styles.contactItem}><MapPin size={24} color="#4F46E5" /><div><div style={styles.contactLabel}>Address</div><div style={styles.contactValue}>123 Clean Street, Laundry City</div></div></div>
            </div>
          </div>

          <div style={styles.scheduleCard}>
            <h3 style={styles.scheduleTitle}>Business Hours</h3>
            <div style={styles.scheduleList}>
              <div style={styles.scheduleItem}><span>Mon - Fri:</span><span>7:00 AM - 8:00 PM</span></div>
              <div style={styles.scheduleItem}><span>Saturday:</span><span>8:00 AM - 6:00 PM</span></div>
              <div style={styles.scheduleItem}><span>Sunday:</span><span>9:00 AM - 5:00 PM</span></div>
            </div>
            {/* <button style={styles.scheduleBtn}>Schedule Pickup Now</button> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}><Shirt size={24} color="#60A5FA" /><span style={styles.footerLogoText}>CleanCare</span></div>
          {/* <p style={styles.footerText}>© 2024 CleanCare. All rights reserved.</p>/// */}
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    lineHeight: '1.6',
    margin: 0,
    padding: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
  },
  
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '1rem 0',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
  },
  
  navScrolled: {
    background: 'rgba(255, 255, 255, 0.98)',
    boxShadow: '0 4px 30px rgba(0,0,0,0.15)',
  },
  
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  logoIcon: {
    color: '#4F46E5',
  },
  
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1F2937',
  },
  
  navButtons: {
    display: 'flex',
    gap: '1rem',
  },
  
  btnLogin: {
    padding: '0.5rem 1rem',
    border: '2px solid #4F46E5',
    // background: 'transparent',
    background: '#4F46E5',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  
  btnSignup: {
    padding: '0.5rem 1rem',
    border: 'none',
    background: '#4F46E5',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  
  hero: {
    paddingTop: '8rem',
    paddingBottom: '4rem',
    textAlign: 'center',
    color: 'white',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '8rem 2rem 4rem',
  },
  
  heroContent: {
    marginBottom: '4rem',
  },
  
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  
  heroSubtitle: {
    display: 'block',
    color: '#FDE68A',
    marginTop: '0.5rem',
  },
  
  heroText: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto 2rem',
  },
  
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  
  btnPrimary: {
    padding: '1rem 2rem',
    border: 'none',
    background: '#F59E0B',
    color: 'white',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
  },
  
  btnSecondary: {
    padding: '1rem 2rem',
    border: '2px solid rgba(255,255,255,0.8)',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginTop: '4rem',
  },
  
  stat: {
    textAlign: 'center',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#FDE68A',
    marginBottom: '0.5rem',
  },
  
  statLabel: {
    fontSize: '1rem',
    opacity: 0.9,
  },
  
  services: {
    background: 'white',
    padding: '5rem 2rem',
    textAlign: 'center',
  },
  
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: '3rem',
    textAlign: 'center',
  },
  
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  serviceCard: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: '2rem',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    background: '#4F46E5',
    cursor: 'pointer',
    border: '2px solid transparent',
  },
  
  serviceCardActive: {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    border: '2px solid #4F46E5',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  },
  
  serviceIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  
  serviceName: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    background: '#4F46E5',
    color: '#1F2937',
    marginBottom: '0.5rem',
  },
  
  serviceDesc: {
    color: '#6B7280',
    marginBottom: '1rem',
  },
  
  servicePrice: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  
  features: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '5rem 2rem',
    color: 'white',
  },
  
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  featureCard: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
  },
  
  featureIcon: {
    background: 'rgba(255,255,255,0.2)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
  },
  
  featureTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  
  featureText: {
    opacity: 0.9,
  },
  
  contact: {
    background: 'white',
    padding: '5rem 2rem',
  },
  
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '3rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  contactTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: '1rem',
  },
  
  contactText: {
    color: '#6B7280',
    marginBottom: '2rem',
  },
  
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  
  contactLabel: {
    fontWeight: '600',
    color: '#1F2937',
  },
  
  contactValue: {
    color: '#6B7280',
  },
  
  scheduleCard: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: '2rem',
    borderRadius: '16px',
  },
  
  scheduleTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: '1.5rem',
  },
  
  scheduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  
  scheduleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
  },
  
  scheduleBtn: {
    width: '100%',
    padding: '1rem',
    border: 'none',
    background: '#4F46E5',
    color: 'white',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  footer: {
    background: '#1F2937',
    color: 'white',
    padding: '2rem',
    textAlign: 'center',
  },
  
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  footerLogoText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  
  footerText: {
    opacity: 0.7,
    margin: 0,
  },
};

export default CleanCareSimple;

