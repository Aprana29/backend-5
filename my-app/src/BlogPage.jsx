import React, { useState, useEffect } from 'react';
import { 
  Shirt, Calendar, User, Clock, Heart, Share2, BookOpen, Sparkles,
  Droplets, Shield, Leaf, Star, ArrowRight, Search, Filter, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (path) => {
    window.location.href = path;
  };

  const customerReviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      review: "CleanCare has transformed my weekly routine! Their wash-and-fold service is impeccable, and the convenience of doorstep pickup and delivery is unmatched. I've been using their service for over 6 months now.",
      date: "March 15, 2024",
      service: "Wash & Fold"
    },
    {
      name: "Michael Chen",
      rating: 5,
      review: "As a busy professional, CleanCare's express service has been a lifesaver. My clothes come back perfectly clean and pressed, and their customer service team is always responsive and helpful.",
      date: "March 10, 2024",
      service: "Express Service"
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      review: "I was hesitant to try a laundry service at first, but CleanCare exceeded all my expectations. They handle my delicate fabrics with such care, and I love their eco-friendly approach to cleaning.",
      date: "March 8, 2024",
      service: "Dry Cleaning"
    },
    {
      name: "David Thompson",
      rating: 5,
      review: "The quality of service is outstanding! My work shirts have never looked better. The team at CleanCare pays attention to every detail, from stain removal to precise folding.",
      date: "March 5, 2024",
      service: "Ironing Service"
    },
    {
      name: "Lisa Park",
      rating: 5,
      review: "CleanCare has made laundry day a thing of the past for our family. With three kids, the convenience and reliability of their service has been invaluable. Highly recommend!",
      date: "March 2, 2024",
      service: "Wash & Fold"
    }
  ];

  return (
    <div style={styles.container}>
      {/* Header / Navbar */}
      <nav style={{...styles.nav, ...(scrolled ? styles.navScrolled : {})}}>
        <div style={styles.navContent}>
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            {/* <ArrowLeft size={18} /> */}
            Back to Home
          </button>
          <div style={styles.navTitle}>
            <BookOpen size={24} color="#4F46E5" />
            <span>Our Story</span>
          </div>
          <div style={styles.navLogo}>
            <Shirt size={24} color="#4F46E5" />
            <span style={styles.logoText}>CleanCare</span>
          </div>
        </div>
      </nav>

      <div style={styles.main}>
        {/* Hero Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>Our Story</h1>
          <p style={styles.subtitle}>
            Bringing Fresh Laundry & Honest Service to Local Families Since 2023
          </p>
        </div>

        {/* Our Story Section */}
        <section style={styles.storySection}>
          <div style={styles.storyContent}>
            <div style={styles.storyText}>
              <h2 style={styles.storyTitle}>Making Laundry Effortless for Everyone</h2>
              <p style={styles.storyParagraph}>
                Hi, I'm Lana! I started CleanCare to give local families and professionals an easier way to handle laundry without sacrificing freshness or care. With years of experience and a love for efficiency (and the smell of clean linens!), I wanted to create a service that truly understands what busy people need.
              </p>
              <p style={styles.storyParagraph}>
                At CleanCare, we believe that quality laundry service should be accessible to everyone. That's why we've designed our services to be more convenient, more affordable, and more reliable than traditional laundromats or other laundry services. We're not just washing clothes – we're giving you back your precious time.
              </p>
              <p style={styles.storyParagraph}>
                Whether you have a mountain of laundry from the family or need regular service for your business, we tailor our offerings to fit your laundry needs perfectly. Choose CleanCare for reliable, high-quality laundry services that save you time and make your life easier.
              </p>
              
              <div style={styles.accessibilityFeatures}>
                <h3 style={styles.featuresTitle}>Why We're More Accessible</h3>
                <div style={styles.featuresList}>
                  <div style={styles.featureItem}>
                    <div style={styles.featureBullet}>🚚</div>
                    <div>
                      <strong>Free Pickup & Delivery:</strong> No need to leave your home or office - we come to you at your convenience.
                    </div>
                  </div>
                  <div style={styles.featureItem}>
                    <div style={styles.featureBullet}>💰</div>
                    <div>
                      <strong>Transparent Pricing:</strong> No hidden fees or surprise charges - you know exactly what you're paying upfront.
                    </div>
                  </div>
                  <div style={styles.featureItem}>
                    <div style={styles.featureBullet}>⏰</div>
                    <div>
                      <strong>Flexible Scheduling:</strong> Book pickups and deliveries that work with your schedule, including evenings and weekends.
                    </div>
                  </div>
                  <div style={styles.featureItem}>
                    <div style={styles.featureBullet}>📱</div>
                    <div>
                      <strong>Easy Online Booking:</strong> Schedule services, track orders, and manage your account all from your phone or computer.
                    </div>
                  </div>
                  <div style={styles.featureItem}>
                    <div style={styles.featureBullet}>🌱</div>
                    <div>
                      <strong>Eco-Friendly Options:</strong> We use environmentally safe detergents and energy-efficient processes.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section style={styles.reviewsSection}>
          <div style={styles.reviewsContent}>
            <h2 style={styles.reviewsTitle}>What Our Customers Say</h2>
            <p style={styles.reviewsSubtitle}>
              Don't just take our word for it - hear from the families and professionals who trust CleanCare with their laundry needs.
            </p>
            
            <div style={styles.reviewsGrid}>
              {customerReviews.map((review, index) => (
                <div key={index} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewUser}>
                      <div style={styles.reviewAvatar}>
                        <User size={20} color="#4F46E5" />
                      </div>
                      <div style={styles.reviewUserInfo}>
                        <h4 style={styles.reviewName}>{review.name}</h4>
                        <div style={styles.reviewMeta}>
                          <Calendar size={14} color="#6B7280" />
                          <span style={styles.reviewDate}>{review.date}</span>
                          <span style={styles.reviewService}>{review.service}</span>
                        </div>
                      </div>
                    </div>
                    <div style={styles.reviewRating}>
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                  </div>
                  <p style={styles.reviewText}>{review.review}</p>
                  <div style={styles.reviewFooter}>
                    {/* <MessageCircle size={16} color="#4F46E5" /> */}
                    <span style={styles.reviewFooterText}>Verified Customer</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={styles.reviewsCTA}>
              <h3 style={styles.ctaTitle}>Ready to Experience CleanCare?</h3>
              <p style={styles.ctaText}>Join hundreds of satisfied customers who have made the switch to effortless laundry.</p>
              <div style={styles.ctaButtons}>
                <button 
                  style={styles.btnPrimary}
                  onClick={() => navigate('/services')}
                >
                  Schedule Your First Pickup
                </button>
                <button 
                  style={styles.btnSecondary}
                  onClick={() => navigate('/')}
                >
                  View Our Services
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <Shirt size={24} color="#60A5FA" />
            <span style={styles.footerLogoText}>CleanCare</span>
          </div>
          {/* <p style={styles.footerText}>© 2024 CleanCare. All rights reserved.</p> */}
        </div>
      </footer>
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
  
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1F2937'
  },
  
  logoText: {
    color: '#1F2937'
  },
  
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    paddingTop: '120px'
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
    fontSize: '1.3rem',
    opacity: 0.9,
    color: '#FDE68A'
  },
  
  storySection: {
    background: 'white',
    padding: '3rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    marginBottom: '40px'
  },
  
  storyContent: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  
  storyText: {
    textAlign: 'left'
  },
  
  storyTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  
  storyParagraph: {
    fontSize: '1.1rem',
    color: '#4B5563',
    marginBottom: '1.5rem',
    lineHeight: '1.8'
  },
  
  accessibilityFeatures: {
    marginTop: '3rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: '2rem',
    borderRadius: '16px'
  },
  
  featuresTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: '1.5rem'
  },
  
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem'
  },
  
  featureBullet: {
    fontSize: '1.5rem',
    minWidth: '2rem'
  },
  
  reviewsSection: {
    background: 'white',
    padding: '3rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
  },
  
  reviewsContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  
  reviewsTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#1F2937'
  },
  
  reviewsSubtitle: {
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#6B7280'
  },
  
  reviewsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    marginBottom: '4rem'
  },
  
  reviewCard: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid rgba(79, 70, 229, 0.1)',
    transition: 'all 0.3s ease'
  },
  
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  
  reviewUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  
  reviewAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(79, 70, 229, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  reviewUserInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  
  reviewName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#1F2937'
  },
  
  reviewMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#6B7280'
  },
  
  reviewDate: {
    color: '#6B7280'
  },
  
  reviewService: {
    background: '#4F46E5',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.8rem'
  },
  
  reviewRating: {
    display: 'flex',
    gap: '0.25rem'
  },
  
  reviewText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#4B5563',
    marginBottom: '1rem'
  },
  
  reviewFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  reviewFooterText: {
    fontSize: '0.9rem',
    color: '#4F46E5',
    fontWeight: '500'
  },
  
  reviewsCTA: {
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '3rem 2rem',
    borderRadius: '20px',
    marginTop: '2rem'
  },
  
  ctaTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  
  ctaText: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
    opacity: 0.9
  },
  
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
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
    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)'
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
    backdropFilter: 'blur(10px)'
  },
  
  footer: {
    background: '#1F2937',
    color: 'white',
    padding: '2rem',
    textAlign: 'center',
    marginTop: '40px'
  },
  
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  footerLogoText: {
    fontSize: '1.2rem',
    fontWeight: 'bold'
  },
  
  footerText: {
    opacity: 0.7,
    margin: 0
  }
};

export default BlogPage;