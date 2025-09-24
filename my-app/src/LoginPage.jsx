
// import React, { useState } from 'react';
// import { Shirt, Eye, EyeOff, Lock, Mail, ArrowLeft, User } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:5000';

// const LoginSimple = () => {
//   const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//     if (message.text) setMessage({ type: '', text: '' });
//   };

//   const handleLogin = async () => {
//     if (!formData.email || !formData.password) {
//       setMessage({ type: 'error', text: 'Please fill in all fields' });
//       return;
//     }

//     setIsLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       console.log('Attempting login for:', formData.email); // Debug log

//       const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: formData.email.trim(),
//           password: formData.password
//         }),
//       });

//       const data = await response.json();
//       console.log('Login response:', data); // Debug log

//       if (data.success && data.user) {
//         // Choose storage type based on "Remember Me" checkbox
//         const storage = formData.rememberMe ? localStorage : sessionStorage;
        
//         console.log('Using storage:', formData.rememberMe ? 'localStorage' : 'sessionStorage'); // Debug log
        
//         // Clear any existing auth data first
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('user');
//         localStorage.removeItem('username');
//         sessionStorage.removeItem('authToken');
//         sessionStorage.removeItem('user');
//         sessionStorage.removeItem('username');
        
//         // Store authentication data in chosen storage
//         storage.setItem('authToken', data.token);
//         storage.setItem('user', JSON.stringify(data.user));
        
//         // Store username for ServicesPage compatibility - multiple fallbacks
//         const username = data.user.name || data.user.username || data.user.email.split('@')[0];
//         storage.setItem('username', username);
        
//         console.log('Stored data:');
//         console.log('- Token:', data.token ? 'Present' : 'Missing');
//         console.log('- User:', data.user);
//         console.log('- Username stored as:', username);
        
//         setMessage({ type: 'success', text: `Welcome back, ${data.user.name}!` });
        
//         // Clear form
//         setFormData({ email: '', password: '', rememberMe: false });
        
//         // Redirect after success
//         setTimeout(() => {
//           console.log('Redirecting to home page...');
//           window.location.href = './services';
//         }, 1500);
        
//       } else {
//         console.error('Login failed:', data.message);
//         setMessage({ type: 'error', text: data.message || 'Login failed' });
//       }
//     } catch (error) {
//       console.error('Network error during login:', error);
//       setMessage({ 
//         type: 'error', 
//         text: 'Cannot connect to server. Please check if backend is running on port 5000.' 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDemoLogin = () => {
//     setFormData(prev => ({
//       ...prev,
//       email: 'demo@cleancare.com',
//       password: 'demo123'
//     }));
//   };

//   const debugStorage = () => {
//     console.log('=== STORAGE DEBUG ===');
//     console.log('localStorage:');
//     console.log('  - username:', localStorage.getItem('username'));
//     console.log('  - user:', localStorage.getItem('user'));
//     console.log('  - authToken:', localStorage.getItem('authToken') ? 'Present' : 'Not found');
    
//     console.log('sessionStorage:');
//     console.log('  - username:', sessionStorage.getItem('username'));
//     console.log('  - user:', sessionStorage.getItem('user'));
//     console.log('  - authToken:', sessionStorage.getItem('authToken') ? 'Present' : 'Not found');
    
//     // Show which one ServicesPage will find
//     const foundUsername = localStorage.getItem('username') || sessionStorage.getItem('username');
//     console.log('ServicesPage will find username:', foundUsername);
    
//     alert('Check console for storage debug info');
//   };

//   const testConnection = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/health`);
//       if (response.ok) {
//         const data = await response.json();
//         setMessage({ type: 'success', text: 'Server connection successful!' });
//       } else {
//         setMessage({ type: 'error', text: 'Server connection failed' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Cannot connect to server on port 5000' });
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <button style={styles.backBtn} onClick={() => window.location.href = '/'}>
//           <ArrowLeft size={18} />
//           Back to Home
//         </button>

//         <div style={styles.header}>
//           <div style={styles.logoContainer}>
//             <Shirt size={32} color="white" />
//           </div>
//           <h1 style={styles.title}>Welcome Back</h1>
//           <p style={styles.subtitle}>Sign in to your CleanCare account</p>
//         </div>

//         <div style={styles.form}>
//           <div style={styles.debugSection}>
//             <button onClick={debugStorage} style={styles.debugBtn}>
//               Debug Storage
//             </button>
//             <button onClick={testConnection} style={styles.testBtn}>
//               Test Server
//             </button>
//           </div>

//           {message.text && (
//             <div style={{
//               ...styles.message,
//               ...(message.type === 'error' ? styles.messageError : styles.messageSuccess)
//             }}>
//               {message.text}
//             </div>
//           )}

//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Email Address</label>
//             <div style={styles.inputContainer}>
//               <Mail size={20} style={styles.inputIcon} />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 style={styles.input}
//                 required
//               />
//             </div>
//           </div>

//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Password</label>
//             <div style={styles.inputContainer}>
//               <Lock size={20} style={styles.inputIcon} />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 style={styles.input}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 style={styles.eyeBtn}
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           <div style={styles.options}>
//             <label style={styles.checkboxLabel}>
//               <input
//                 type="checkbox"
//                 name="rememberMe"
//                 checked={formData.rememberMe}
//                 onChange={handleChange}
//                 style={styles.checkbox}
//               />
//               Remember me
//             </label>
//           </div>

//           <button
//             onClick={handleLogin}
//             disabled={isLoading}
//             style={{
//               ...styles.submitBtn,
//               ...(isLoading ? styles.submitBtnLoading : {})
//             }}
//           >
//             {isLoading ? (
//               <>
//                 <div style={styles.spinner}></div>
//                 Signing in...
//               </>
//             ) : (
//               <>
//                 <User size={18} style={{ marginRight: '8px' }} />
//                 Sign In
//               </>
//             )}
//           </button>

//           {/* <div style={styles.demoInfo}>
//             {/* <p style={styles.demoTitle}>Demo Credentials</p>
//             <p style={styles.demoText}>Email: demo@cleancare.com</p>
//             <p style={styles.demoText}>Password: demo123</p> */}
//             {/* <button onClick={handleDemoLogin} style={styles.demoBtn}>
//               Use Demo Credentials
//             </button> */}
//           {/* </div>  */}
//         </div>
//        <div style={styles.footer}>
//           {/* <p style={styles.footerText}>
//             Don't have an account?{' '}
//             <button style={styles.signupBtn} onClick={() => window.location.href = '/signup'}>
//               Sign up for free
//             </button>
//           </p> */}
//         </div> 
//       </div>
//     </div> 
//   );
// };

// const styles = {
//   container: {
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '20px',
//     fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
//   },
//   card: {
//     background: 'white',
//     borderRadius: '20px',
//     boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
//     width: '100%',
//     maxWidth: '420px',
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   backBtn: {
//     position: 'absolute',
//     top: '20px',
//     left: '20px',
//     background: 'rgba(255,255,255,0.2)',
//     border: 'none',
//     color: 'white',
//     padding: '8px 12px',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px',
//     fontSize: '14px',
//     zIndex: 10,
//   },
//   header: {
//     background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
//     padding: '60px 30px 30px',
//     textAlign: 'center',
//     color: 'white',
//   },
//   logoContainer: {
//     width: '64px',
//     height: '64px',
//     background: 'rgba(255,255,255,0.2)',
//     borderRadius: '50%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: '0 auto 20px',
//   },
//   title: {
//     fontSize: '28px',
//     fontWeight: 'bold',
//     margin: '0 0 8px',
//   },
//   subtitle: {
//     fontSize: '16px',
//     opacity: 0.9,
//     margin: 0,
//   },
//   form: {
//     padding: '30px',
//   },
//   debugSection: {
//     marginBottom: '20px',
//     textAlign: 'center',
//     display: 'flex',
//     gap: '10px',
//     justifyContent: 'center',
//   },
//   debugBtn: {
//     background: '#8B5CF6',
//     color: 'white',
//     border: 'none',
//     padding: '6px 12px',
//     borderRadius: '6px',
//     fontSize: '12px',
//     cursor: 'pointer',
//   },
//   testBtn: {
//     background: '#10B981',
//     color: 'white',
//     border: 'none',
//     padding: '6px 12px',
//     borderRadius: '6px',
//     fontSize: '12px',
//     cursor: 'pointer',
//   },
//   message: {
//     padding: '12px',
//     borderRadius: '8px',
//     marginBottom: '20px',
//     fontSize: '14px',
//     fontWeight: '500',
//   },
//   messageError: {
//     background: '#FEF2F2',
//     color: '#DC2626',
//     border: '1px solid #FECACA',
//   },
//   messageSuccess: {
//     background: '#F0FDF4',
//     color: '#16A34A',
//     border: '1px solid #BBF7D0',
//   },
//   inputGroup: {
//     marginBottom: '20px',
//   },
//   label: {
//     display: 'block',
//     fontSize: '14px',
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: '8px',
//   },
//   inputContainer: {
//     position: 'relative',
//   },
//   input: {
//     width: '100%',
//     padding: '12px 12px 12px 44px',
//     border: '2px solid #E5E7EB',
//     borderRadius: '10px',
//     fontSize: '16px',
//     outline: 'none',
//     boxSizing: 'border-box',
//   },
//   inputIcon: {
//     position: 'absolute',
//     left: '12px',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     color: '#9CA3AF',
//   },
//   eyeBtn: {
//     position: 'absolute',
//     right: '12px',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer',
//     color: '#9CA3AF',
//     padding: '4px',
//   },
//   options: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '25px',
//   },
//   checkboxLabel: {
//     display: 'flex',
//     alignItems: 'center',
//     fontSize: '14px',
//     color: '#374151',
//     cursor: 'pointer',
//   },
//   checkbox: {
//     marginRight: '8px',
//     accentColor: '#4F46E5',
//   },
//   submitBtn: {
//     width: '100%',
//     padding: '14px',
//     background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
//     border: 'none',
//     borderRadius: '10px',
//     color: 'white',
//     fontSize: '16px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: '20px',
//   },
//   submitBtnLoading: {
//     background: '#9CA3AF',
//     cursor: 'not-allowed',
//   },
//   spinner: {
//     width: '18px',
//     height: '18px',
//     border: '2px solid rgba(255,255,255,0.3)',
//     borderTop: '2px solid white',
//     borderRadius: '50%',
//     animation: 'spin 1s linear infinite',
//     marginRight: '8px',
//   },
//   footer: {
//     background: '#F9FAFB',
//     padding: '20px 30px',
//     textAlign: 'center',
//     borderTop: '1px solid #E5E7EB',
//   },
//   footerText: {
//     fontSize: '14px',
//     color: '#6B7280',
//     margin: 0,
//   },
//   signupBtn: {
//     background: 'none',
//     border: 'none',
//     color: '#4F46E5',
//     fontWeight: '500',
//     cursor: 'pointer',
//   },
//   demoInfo: {
//     background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
//     padding: '15px 20px',
//     borderRadius: '10px',
//     border: '1px solid #F59E0B',
//     marginBottom: '20px',
//   },
//   demoTitle: {
//     fontSize: '14px',
//     fontWeight: 'bold',
//     color: '#92400E',
//     margin: '0 0 8px',
//   },
//   demoText: {
//     fontSize: '12px',
//     color: '#92400E',
//     margin: '2px 0',
//   },
//   demoBtn: {
//     background: '#F59E0B',
//     color: 'white',
//     border: 'none',
//     padding: '6px 12px',
//     borderRadius: '6px',
//     fontSize: '12px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     marginTop: '8px',
//   },
// };

// // CSS animation
// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = `
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
//   input:focus {
//     border-color: #4F46E5 !important;
//     box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
//   }
// `;
// document.head.appendChild(styleSheet);

// export default LoginSimple;



import React, { useState, useEffect } from 'react';
import { Shirt, Eye, EyeOff, Lock, Mail, ArrowLeft, User, LogOut } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const LoginSimple = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsLoggedIn(true);
          setCurrentUser(user);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          handleLogout(); // Clear invalid data
        }
      }
    };

    checkAuthStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Attempting login for:', formData.email);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success && data.user) {
        // Choose storage type based on "Remember Me" checkbox
        const storage = formData.rememberMe ? localStorage : sessionStorage;
        
        console.log('Using storage:', formData.rememberMe ? 'localStorage' : 'sessionStorage');
        
        // Clear any existing auth data first
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        localStorage.removeItem('userId'); // Add userId cleanup
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userId'); // Add userId cleanup
        
        // Store authentication data in chosen storage
        storage.setItem('authToken', data.token);
        storage.setItem('user', JSON.stringify(data.user));
        
        // Store username and userId for compatibility
        const username = data.user.name || data.user.username || data.user.email.split('@')[0];
        storage.setItem('username', username);
        storage.setItem('userId', data.user.id || data.user._id || username); // Store user ID
        
        console.log('Stored data:');
        console.log('- Token:', data.token ? 'Present' : 'Missing');
        console.log('- User:', data.user);
        console.log('- Username stored as:', username);
        
        // Update component state
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        setMessage({ type: 'success', text: `Welcome back, ${data.user.name}!` });
        
        // Clear form
        setFormData({ email: '', password: '', rememberMe: false });
        
        // Redirect after success
        setTimeout(() => {
          console.log('Redirecting to services page...');
          window.location.href = './services';
        }, 1500);
        
      } else {
        console.error('Login failed:', data.message);
        setMessage({ type: 'error', text: data.message || 'Login failed' });
      }
    } catch (error) {
      console.error('Network error during login:', error);
      setMessage({ 
        type: 'error', 
        text: 'Cannot connect to server. Please check if backend is running on port 5000.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all authentication data from both storages
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userId');
    
    // Reset component state
    setIsLoggedIn(false);
    setCurrentUser(null);
    setFormData({ email: '', password: '', rememberMe: false });
    setMessage({ type: 'success', text: 'Logged out successfully!' });
    
    console.log('User logged out successfully');
    
    // Redirect to home page after a brief delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const handleDemoLogin = () => {
    setFormData(prev => ({
      ...prev,
      email: 'demo@cleancare.com',
      password: 'demo123'
    }));
  };

  const debugStorage = () => {
    console.log('=== STORAGE DEBUG ===');
    console.log('localStorage:');
    console.log('  - username:', localStorage.getItem('username'));
    console.log('  - user:', localStorage.getItem('user'));
    console.log('  - userId:', localStorage.getItem('userId'));
    console.log('  - authToken:', localStorage.getItem('authToken') ? 'Present' : 'Not found');
    
    console.log('sessionStorage:');
    console.log('  - username:', sessionStorage.getItem('username'));
    console.log('  - user:', sessionStorage.getItem('user'));
    console.log('  - userId:', sessionStorage.getItem('userId'));
    console.log('  - authToken:', sessionStorage.getItem('authToken') ? 'Present' : 'Not found');
    
    // Show which one ServicesPage will find
    const foundUsername = localStorage.getItem('username') || sessionStorage.getItem('username');
    console.log('ServicesPage will find username:', foundUsername);
    
    alert('Check console for storage debug info');
  };

  const testConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: 'Server connection successful!' });
      } else {
        setMessage({ type: 'error', text: 'Server connection failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Cannot connect to server on port 5000' });
    }
  };

  // If user is logged in, show logged-in state
  if (isLoggedIn && currentUser) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <button style={styles.backBtn} onClick={() => window.location.href = '/'}>
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <div style={styles.header}>
            <div style={styles.logoContainer}>
              <User size={32} color="white" />
            </div>
            <h1 style={styles.title}>Welcome Back!</h1>
            <p style={styles.subtitle}>You're already signed in as {currentUser.name}</p>
          </div>

          <div style={styles.form}>
            {message.text && (
              <div style={{
                ...styles.message,
                ...(message.type === 'error' ? styles.messageError : styles.messageSuccess)
              }}>
                {message.text}
              </div>
            )}

            <div style={styles.userInfo}>
              <h3 style={styles.userInfoTitle}>Account Information</h3>
              <div style={styles.userInfoGrid}>
                <div style={styles.userInfoItem}>
                  <span style={styles.userInfoLabel}>Name:</span>
                  <span style={styles.userInfoValue}>{currentUser.name}</span>
                </div>
                <div style={styles.userInfoItem}>
                  <span style={styles.userInfoLabel}>Email:</span>
                  <span style={styles.userInfoValue}>{currentUser.email}</span>
                </div>
                <div style={styles.userInfoItem}>
                  <span style={styles.userInfoLabel}>Username:</span>
                  <span style={styles.userInfoValue}>{currentUser.username}</span>
                </div>
              </div>
            </div>

            <div style={styles.actionButtons}>
              <button
                onClick={() => window.location.href = './services'}
                style={styles.servicesBtn}
              >
                <Shirt size={18} style={{ marginRight: '8px' }} />
                Go to Services
              </button>

              <button
                onClick={handleLogout}
                style={styles.logoutBtn}
              >
                <LogOut size={18} style={{ marginRight: '8px' }} />
                Logout
              </button>
            </div>

            <div style={styles.debugSection}>
              <button onClick={debugStorage} style={styles.debugBtn}>
                Debug Storage
              </button>
              <button onClick={testConnection} style={styles.testBtn}>
                Test Server
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular login form if not logged in
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={() => window.location.href = '/'}>
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <Shirt size={32} color="white" />
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your CleanCare account</p>
        </div>

        <div style={styles.form}>
          <div style={styles.debugSection}>
            <button onClick={debugStorage} style={styles.debugBtn}>
              Debug Storage
            </button>
            <button onClick={testConnection} style={styles.testBtn}>
              Test Server
            </button>
          </div>

          {message.text && (
            <div style={{
              ...styles.message,
              ...(message.type === 'error' ? styles.messageError : styles.messageSuccess)
            }}>
              {message.text}
            </div>
          )}

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

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputContainer}>
              <Lock size={20} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={styles.options}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Remember me
            </label>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              ...styles.submitBtn,
              ...(isLoading ? styles.submitBtnLoading : {})
            }}
          >
            {isLoading ? (
              <>
                <div style={styles.spinner}></div>
                Signing in...
              </>
            ) : (
              <>
                <User size={18} style={{ marginRight: '8px' }} />
                Sign In
              </>
            )}
          </button>

          {/* <div style={styles.demoInfo}> */}
            {/* <p style={styles.demoTitle}>Demo Credentials</p>
            <p style={styles.demoText}>Email: demo@cleancare.com</p>
            <p style={styles.demoText}>Password: demo123</p> */}
            {/* <button onClick={handleDemoLogin} style={styles.demoBtn}>
              Use Demo Credentials
            </button> */}
          {/* </div> */}
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{' '}
            <button style={styles.signupBtn} onClick={() => window.location.href = '/signup'}>
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    zIndex: 10,
  },
  header: {
    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
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
  userInfo: {
    background: '#F8FAFC',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #E2E8F0',
  },
  userInfoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 15px 0',
  },
  userInfoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  userInfoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoLabel: {
    fontSize: '14px',
    color: '#6B7280',
    fontWeight: '500',
  },
  userInfoValue: {
    fontSize: '14px',
    color: '#1F2937',
    fontWeight: '500',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  servicesBtn: {
    flex: 1,
    padding: '14px',
    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    flex: 1,
    padding: '14px',
    background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  debugSection: {
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  debugBtn: {
    background: '#8B5CF6',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  testBtn: {
    background: '#10B981',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  message: {
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
  messageError: {
    background: '#FEF2F2',
    color: '#DC2626',
    border: '1px solid #FECACA',
  },
  messageSuccess: {
    background: '#F0FDF4',
    color: '#16A34A',
    border: '1px solid #BBF7D0',
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
    padding: '4px',
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    accentColor: '#4F46E5',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
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
  signupBtn: {
    background: 'none',
    border: 'none',
    color: '#4F46E5',
    fontWeight: '500',
    cursor: 'pointer',
  },
  demoInfo: {
    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    padding: '15px 20px',
    borderRadius: '10px',
    border: '1px solid #F59E0B',
    marginBottom: '20px',
  },
  demoTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#92400E',
    margin: '0 0 8px',
  },
  demoText: {
    fontSize: '12px',
    color: '#92400E',
    margin: '2px 0',
  },
  demoBtn: {
    background: '#F59E0B',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '8px',
  },
};

// CSS animation
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  input:focus {
    border-color: #4F46E5 !important;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
  }
`;
document.head.appendChild(styleSheet);

export default LoginSimple;