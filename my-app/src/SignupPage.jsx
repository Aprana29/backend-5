


import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear message when user starts typing
    if (message.text) setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const { name, email, phone, password } = formData;

    // Check if all fields are filled and not just whitespace
    if (!name || !name.trim()) {
      setMessage({ type: 'error', text: 'Full name is required' });
      return false;
    }

    if (!email || !email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return false;
    }

    if (!phone || !phone.trim()) {
      setMessage({ type: 'error', text: 'Phone number is required' });
      return false;
    }

    if (!password || !password.trim()) {
      setMessage({ type: 'error', text: 'Password is required' });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }

    // Validate phone number (remove spaces and dashes for counting)
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (cleanPhone.length < 10) {
      setMessage({ type: 'error', text: 'Phone number must be at least 10 digits' });
      return false;
    }

    // Check if phone contains only digits (after removing spaces/dashes)
    if (!/^\d+$/.test(cleanPhone)) {
      setMessage({ type: 'error', text: 'Phone number must contain only digits' });
      return false;
    }

    // Validate password length
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    console.log('=== SIGNUP ATTEMPT ===');
    console.log('Current form data:', formData);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Prepare data for API (map name to username)
      const apiData = {
        username: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password
      };

      console.log('Sending to API:', apiData);

      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        // Store token and user data
        if (data.token) {
          sessionStorage.setItem('authToken', data.token);
        }
        if (data.user) {
          sessionStorage.setItem('user', JSON.stringify(data.user));
        }
        
        setMessage({ 
          type: 'success', 
          text: `Welcome ${data.user?.username || data.user?.name || formData.name}! Account created successfully.` 
        });
        
        // Clear form
        setFormData({ name: '', email: '', phone: '', password: '' });
        
        // Simulate redirect after success
        setTimeout(() => {
          console.log('User registered successfully:', data.user);
          console.log('Token saved:', data.token ? 'Yes' : 'No');
          // Redirect logic would go here
        }, 2000);
        
      } else {
        setMessage({ type: 'error', text: data.message || 'Signup failed' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check if the server is running on port 5000.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignup = () => {
    setFormData({
      name: 'Demo User',
      email: 'demo@cleancare.com',
      phone: '1234567890',
      password: 'demo123'
    });
    setMessage({ type: 'info', text: 'Demo data loaded. Click "Create Account" to register.' });
  };

  const testServerConnection = async () => {
    try {
      setMessage({ type: 'info', text: 'Testing server connection...' });
      
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Server connection successful! ✅' });
      } else {
        setMessage({ type: 'error', text: 'Server responded but with an error' });
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Cannot connect to server. Make sure backend is running on port 5000.' 
      });
    }
  };

  const getMessageClasses = () => {
    const baseStyle = {
      padding: '12px',
      borderRadius: '10px',
      marginBottom: '20px',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center',
    };

    switch (message.type) {
      case 'error': 
        return {
          ...baseStyle,
          background: '#FEF2F2',
          color: '#DC2626',
          border: '1px solid #FECACA',
        };
      case 'success': 
        return {
          ...baseStyle,
          background: '#F0FDF4',
          color: '#16A34A',
          border: '1px solid #BBF7D0',
        };
      case 'info':
        return {
          ...baseStyle,
          background: '#EFF6FF',
          color: '#2563EB',
          border: '1px solid #DBEAFE',
        };
      default: 
        return baseStyle;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Back Button */}
        <button 
          style={styles.backBtn} 
          onClick={() => console.log('Navigate back')}
          type="button"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <User size={32} color="white" />
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join CleanCare today</p>
        </div>

        {/* Form */}
        <div style={styles.form}>
          {/* Server Connection Test */}
          <div style={styles.testSection}>
            <button 
              type="button" 
              onClick={testServerConnection}
              style={styles.testBtn}
            >
              🔗 Test Server Connection
            </button>
          </div>

          {/* Message Display */}
          {message.text && (
            <div style={getMessageClasses()}>
              {message.text}
            </div>
          )}

          {/* Full Name Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputContainer}>
              <User size={20} style={styles.inputIcon} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputContainer}>
              <Mail size={20} style={styles.inputIcon} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Phone Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <div style={styles.inputContainer}>
              <Phone size={20} style={styles.inputIcon} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputContainer}>
              <Lock size={20} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                style={{...styles.input, paddingRight: '50px'}}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div style={styles.passwordHints}>
            <p style={styles.hintText}>Password must be at least 6 characters long</p>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSignup}
            disabled={isLoading}
            style={{
              ...styles.submitBtn,
              ...(isLoading ? styles.submitBtnLoading : {})
            }}
          >
            {isLoading ? (
              <>
                <div style={styles.spinner}></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </div>

        {/* Footer */}
        {/* <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{' '}
            <button 
              style={styles.loginBtn}
              onClick={() => console.log('Navigate to login')}
              type="button"
            >
              Sign in here
            </button>
          </p>
        </div> */}

        {/* Demo Info */}
        {/* <div style={styles.demoInfo}>
          <p style={styles.demoTitle}>🎯 Demo Account Setup</p>
          <p style={styles.demoText}>Create a demo account for testing:</p>
          <button 
            type="button" 
            style={styles.demoBtn}
            onClick={handleDemoSignup}
          >
            Fill Demo Data
          </button>
          <p style={styles.demoNote}>
            Use this to create the demo@cleancare.com account for login testing
          </p> */}
        {/* </div> */}

        {/* Terms Notice */}
        {/* <div style={styles.termsNotice}>
          <p style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <button style={styles.termsLink} onClick={() => console.log('Navigate to Terms')}>
              Terms of Service
            </button>{' '}
            and{' '}
            <button style={styles.termsLink} onClick={() => console.log('Navigate to Privacy')}>
              Privacy Policy
            </button>
          </p>
        </div> */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #8B5CF6 0%, #a855f7 100%)',
    padding: '20px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  
  card: {
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '420px',
    overflow: 'hidden',
    position: 'relative',
  },

  backBtn: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    zIndex: 10,
  },

  header: {
    background: 'linear-gradient(135deg,#8B5CF6 0%, #a855f7 100%)',
    padding: '60px 30px 30px',
    textAlign: 'center',
    color: 'white',
  },

  logoContainer: {
    width: '64px',
    height: '64px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 8px',
  },

  subtitle: {
    fontSize: '16px',
    opacity: 0.9,
    margin: 0,
  },
  
  form: {
    padding: '30px',
  },

  testSection: {
    marginBottom: '20px',
    textAlign: 'center',
  },

  testBtn: {
    background: '#10B981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  inputGroup: {
    marginBottom: '20px',
  },

  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  },
  
  inputContainer: {
    position: 'relative',
  },
  
  input: {
    width: '100%',
    padding: '12px 12px 12px 44px',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9CA3AF',
  },
  
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9CA3AF',
    padding: '8px',
  },

  passwordHints: {
    marginBottom: '20px',
  },

  hintText: {
    fontSize: '12px',
    color: '#6B7280',
    margin: '0',
  },
  
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },

  submitBtnLoading: {
    background: '#9CA3AF',
    cursor: 'not-allowed',
  },

  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px',
  },

  footer: {
    background: '#F9FAFB',
    padding: '20px 30px',
    textAlign: 'center',
    borderTop: '1px solid #E5E7EB',
  },

  footerText: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0,
  },

  loginBtn: {
    background: 'none',
    border: 'none',
    color: '#ec4899',
    fontWeight: '500',
    cursor: 'pointer',
  },

  demoInfo: {
    background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    padding: '15px 20px',
    margin: '10px',
    borderRadius: '10px',
    border: '1px solid #3B82F6',
  },

  demoTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1E40AF',
    margin: '0 0 8px',
  },

  demoText: {
    fontSize: '12px',
    color: '#1E40AF',
    margin: '2px 0',
  },

  demoBtn: {
    background: '#3B82F6',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '8px',
    marginRight: '8px',
    transition: 'all 0.3s ease',
  },

  demoNote: {
    fontSize: '11px',
    color: '#1E40AF',
    margin: '8px 0 0',
    fontStyle: 'italic',
  },

  termsNotice: {
    padding: '15px 20px',
    background: '#F8FAFC',
    borderTop: '1px solid #E5E7EB',
  },

  termsText: {
    fontSize: '12px',
    color: '#6B7280',
    margin: 0,
    textAlign: 'center',
    lineHeight: '1.4',
  },

  termsLink: {
    color: '#ec4899',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: 'inherit',
    fontWeight: '500',
  },
};

export default SignupPage
