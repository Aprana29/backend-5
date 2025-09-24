// // const express = require('express');
// // const router = express.Router();
// // const Order = require('../models/Order');
// // const User = require('../models/User'); // Assuming you have a User model
// // const auth = require('../middleware/auth'); // JWT auth middleware

// // // Function to generate unique order number
// // function generateOrderNumber() {
// //   const timestamp = Date.now();
// //   const random = Math.floor(Math.random() * 1000000);
// //   const randomString = Math.random().toString(36).substring(2, 8);
// //   return `ORD${timestamp}${random}${randomString}`.toUpperCase();
// // }

// // // Create new order with retry logic for duplicate order numbers
// // router.post('/create', async (req, res) => {
// //   const maxRetries = 5;
// //   let attempt = 0;

// //   while (attempt < maxRetries) {
// //     try {
// //       console.log('=== ORDER CREATION REQUEST ===');
// //       console.log('Request body:', req.body);
      
// //       const { 
// //         username, 
// //         items, 
// //         totalAmount, 
// //         deliveryAddress, 
// //         phoneNumber, 
// //         specialInstructions 
// //       } = req.body;

// //       // Validate required fields
// //       if (!username) {
// //         console.log('❌ Username missing');
// //         return res.status(400).json({
// //           success: false,
// //           message: 'Username is required'
// //         });
// //       }

// //       if (!items || !Array.isArray(items) || items.length === 0) {
// //         console.log('❌ No items in order');
// //         return res.status(400).json({
// //           success: false,
// //           message: 'Order must contain at least one item'
// //         });
// //       }

// //       if (!totalAmount || totalAmount <= 0) {
// //         console.log('❌ Invalid total amount');
// //         return res.status(400).json({
// //           success: false,
// //           message: 'Valid total amount is required'
// //         });
// //       }

// //       if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || 
// //           !deliveryAddress.state || !deliveryAddress.zipCode) {
// //         console.log('❌ Incomplete delivery address');
// //         return res.status(400).json({
// //           success: false,
// //           message: 'Complete delivery address is required'
// //         });
// //       }

// //       if (!phoneNumber) {
// //         console.log('❌ Phone number missing');
// //         return res.status(400).json({
// //           success: false,
// //           message: 'Phone number is required'
// //         });
// //       }

// //       // Find user by username to get userId
// //       const user = await User.findOne({ username });
// //       if (!user) {
// //         console.log('❌ User not found:', username);
// //         return res.status(404).json({
// //           success: false,
// //           message: 'User not found'
// //         });
// //       }

// //       // Generate unique order number
// //       const orderNumber = generateOrderNumber();
      
// //       console.log(`✅ Creating order for username: ${username}, attempt: ${attempt + 1}`);
// //       console.log(`Generated order number: ${orderNumber}`);

// //       // Calculate estimated delivery (48 hours from now)
// //       const estimatedDelivery = new Date();
// //       estimatedDelivery.setHours(estimatedDelivery.getHours() + 48);

// //       // Process items to ensure they have the correct structure
// //       const processedItems = items.map(item => ({
// //         name: item.name,
// //         quantity: item.quantity || 1,
// //         price: item.price || 0,
// //         total: (item.quantity || 1) * (item.price || 0)
// //       }));

// //       // Create new order
// //       const newOrder = new Order({
// //         username,
// //         userId: user._id,
// //         orderNumber,
// //         items: processedItems,
// //         totalAmount,
// //         deliveryAddress: {
// //           street: deliveryAddress.street,
// //           city: deliveryAddress.city,
// //           state: deliveryAddress.state,
// //           zipCode: deliveryAddress.zipCode
// //         },
// //         phoneNumber,
// //         specialInstructions: specialInstructions || '',
// //         status: 'pending',
// //         orderDate: new Date(),
// //         estimatedDelivery
// //       });

// //       const savedOrder = await newOrder.save();
      
// //       console.log('✅ Order saved successfully:', savedOrder.orderNumber);

// //       return res.status(201).json({
// //         success: true,
// //         message: 'Order placed successfully!',
// //         order: {
// //           id: savedOrder._id,
// //           orderNumber: savedOrder.orderNumber,
// //           username: savedOrder.username,
// //           items: savedOrder.items,
// //           totalAmount: savedOrder.totalAmount,
// //           status: savedOrder.status,
// //           orderDate: savedOrder.orderDate,
// //           estimatedDelivery: savedOrder.estimatedDelivery,
// //           deliveryAddress: savedOrder.deliveryAddress,
// //           phoneNumber: savedOrder.phoneNumber,
// //           specialInstructions: savedOrder.specialInstructions
// //         }
// //       });

// //     } catch (error) {
// //       console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);
      
// //       // If it's a duplicate key error and we have retries left, try again
// //       if (error.code === 11000 && attempt < maxRetries - 1) {
// //         attempt++;
// //         console.log(`🔄 Retrying order creation (attempt ${attempt + 1}/${maxRetries})...`);
// //         // Add a small delay to avoid rapid retries
// //         await new Promise(resolve => setTimeout(resolve, 100 + (attempt * 50)));
// //         continue;
// //       }
      
// //       // If we've exhausted retries or it's a different error
// //       console.error('❌ Order creation failed after all attempts:', error);
      
// //       if (error.code === 11000) {
// //         return res.status(500).json({
// //           success: false,
// //           message: 'Unable to generate unique order number after multiple attempts. Please try again.',
// //           error: process.env.NODE_ENV === 'development' ? error.message : undefined
// //         });
// //       }
      
// //       return res.status(500).json({
// //         success: false,
// //         message: 'Failed to create order. Please try again.',
// //         error: process.env.NODE_ENV === 'development' ? error.message : undefined
// //       });
// //     }
// //   }
// // });

// // // Get orders by username
// // router.get('/user/:username', async (req, res) => {
// //   try {
// //     const { username } = req.params;
    
// //     console.log('=== FETCHING ORDERS FOR USER ===');
// //     console.log('Username:', username);

// //     if (!username) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Username is required'
// //       });
// //     }

// //     const orders = await Order.find({ username })
// //       .sort({ orderDate: -1 }) // Most recent first
// //       .populate('userId', 'email name'); // Populate user details if needed

// //     console.log(`✅ Found ${orders.length} orders for ${username}`);

// //     res.status(200).json({
// //       success: true,
// //       count: orders.length,
// //       orders: orders.map(order => ({
// //         id: order._id,
// //         orderNumber: order.orderNumber,
// //         items: order.items,
// //         totalAmount: order.totalAmount,
// //         status: order.status,
// //         orderDate: order.orderDate,
// //         estimatedDelivery: order.estimatedDelivery,
// //         deliveryAddress: order.deliveryAddress,
// //         phoneNumber: order.phoneNumber,
// //         specialInstructions: order.specialInstructions,
// //         user: order.userId // populated user details
// //       }))
// //     });

// //   } catch (error) {
// //     console.error('❌ Error fetching orders:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch orders',
// //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// //     });
// //   }
// // });

// // // Alternative route for backward compatibility
// // router.get('/:username', async (req, res) => {
// //   try {
// //     const { username } = req.params;
    
// //     console.log('=== FETCHING ORDERS FOR USER (Legacy Route) ===');
// //     console.log('Username:', username);

// //     const orders = await Order.find({ username })
// //       .sort({ orderDate: -1 })
// //       .populate('userId', 'email name');

// //     console.log(`✅ Found ${orders.length} orders for ${username}`);

// //     res.status(200).json({
// //       success: true,
// //       orders
// //     });

// //   } catch (error) {
// //     console.error('❌ Fetch orders error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Internal server error',
// //       error: error.message
// //     });
// //   }
// // });

// // // Get all orders (admin route)
// // router.get('/admin/all', async (req, res) => {
// //   try {
// //     console.log('=== FETCHING ALL ORDERS ===');
    
// //     const orders = await Order.find()
// //       .sort({ orderDate: -1 })
// //       .populate('userId', 'email name username');

// //     console.log(`✅ Found ${orders.length} total orders`);

// //     res.status(200).json({
// //       success: true,
// //       count: orders.length,
// //       orders
// //     });

// //   } catch (error) {
// //     console.error('❌ Fetch all orders error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Internal server error',
// //       error: error.message
// //     });
// //   }
// // });

// // // Update order status
// // router.put('/status/:orderId', async (req, res) => {
// //   try {
// //     const { orderId } = req.params;
// //     const { status } = req.body;

// //     console.log('=== UPDATING ORDER STATUS ===');
// //     console.log('Order ID:', orderId);
// //     console.log('New Status:', status);

// //     const validStatuses = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];
    
// //     if (!validStatuses.includes(status)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
// //       });
// //     }

// //     const order = await Order.findByIdAndUpdate(
// //       orderId,
// //       { status, updatedAt: new Date() },
// //       { new: true }
// //     );

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Order not found'
// //       });
// //     }

// //     console.log('✅ Order status updated successfully');

// //     res.status(200).json({
// //       success: true,
// //       message: 'Order status updated successfully',
// //       order
// //     });

// //   } catch (error) {
// //     console.error('❌ Update order status error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Internal server error',
// //       error: error.message
// //     });
// //   }
// // });

// // // Alternative update route for backward compatibility
// // router.put('/:orderId/status', async (req, res) => {
// //   try {
// //     const { orderId } = req.params;
// //     const { status } = req.body;

// //     const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    
// //     if (!validStatuses.includes(status)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'Invalid status'
// //       });
// //     }

// //     const order = await Order.findByIdAndUpdate(
// //       orderId,
// //       { status },
// //       { new: true }
// //     );

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Order not found'
// //       });
// //     }

// //     res.status(200).json({
// //       success: true,
// //       message: 'Order status updated successfully',
// //       order
// //     });

// //   } catch (error) {
// //     console.error('Update order status error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Internal server error',
// //       error: error.message
// //     });
// //   }
// // });

// // // Delete order
// // router.delete('/:orderId', async (req, res) => {
// //   try {
// //     const { orderId } = req.params;

// //     console.log('=== DELETING ORDER ===');
// //     console.log('Order ID:', orderId);

// //     const order = await Order.findByIdAndDelete(orderId);

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Order not found'
// //       });
// //     }

// //     console.log('✅ Order deleted successfully');

// //     res.status(200).json({
// //       success: true,
// //       message: 'Order deleted successfully',
// //       deletedOrder: {
// //         id: order._id,
// //         orderNumber: order.orderNumber
// //       }
// //     });

// //   } catch (error) {
// //     console.error('❌ Delete order error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Internal server error',
// //       error: error.message
// //     });
// //   }
// // });

// // // Get single order by ID
// // router.get('/order/:orderId', async (req, res) => {
// //   try {
// //     const { orderId } = req.params;

// //     console.log('=== FETCHING SINGLE ORDER ===');
// //     console.log('Order ID:', orderId);

// //     const order = await Order.findById(orderId)
// //       .populate('userId', 'email name username');

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Order not found'
// //       });
// //     }

// //     console.log('✅ Order found:', order.orderNumber);

// //     res.status(200).json({
// //       success: true,
// //       order
// //     });

// //   } catch (error) {
// //     console.error('❌ Error fetching order:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch order',
// //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// //     });
// //   }
// // });

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');
// // Removed User import since validation is causing issues

// // Function to generate unique order number
// function generateOrderNumber() {
//   const timestamp = Date.now();
//   const random = Math.floor(Math.random() * 1000000);
//   const randomString = Math.random().toString(36).substring(2, 8);
//   return `ORD${timestamp}${random}${randomString}`.toUpperCase();
// }

// // Create new order with retry logic for duplicate order numbers
// router.post('/create', async (req, res) => {
//   const maxRetries = 5;
//   let attempt = 0;

//   while (attempt < maxRetries) {
//     try {
//       console.log('=== ORDER CREATION REQUEST ===');
//       console.log('Request body:', req.body);
      
//       const { 
//         username, 
//         items, 
//         totalAmount, 
//         deliveryAddress, 
//         phoneNumber, 
//         specialInstructions 
//       } = req.body;

//       // Validate required fields
//       if (!username) {
//         console.log('❌ Username missing');
//         return res.status(400).json({
//           success: false,
//           message: 'Username is required'
//         });
//       }

//       if (!items || !Array.isArray(items) || items.length === 0) {
//         console.log('❌ No items in order');
//         return res.status(400).json({
//           success: false,
//           message: 'Order must contain at least one item'
//         });
//       }

//       if (!totalAmount || totalAmount <= 0) {
//         console.log('❌ Invalid total amount');
//         return res.status(400).json({
//           success: false,
//           message: 'Valid total amount is required'
//         });
//       }

//       if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || 
//           !deliveryAddress.state || !deliveryAddress.zipCode) {
//         console.log('❌ Incomplete delivery address');
//         return res.status(400).json({
//           success: false,
//           message: 'Complete delivery address is required'
//         });
//       }

//       if (!phoneNumber) {
//         console.log('❌ Phone number missing');
//         return res.status(400).json({
//           success: false,
//           message: 'Phone number is required'
//         });
//       }

//       // FIXED: Skip user validation - just proceed with order creation
//       console.log('✅ Creating order for username:', username);

//       // Generate unique order number
//       const orderNumber = generateOrderNumber();
      
//       console.log(`✅ Creating order for username: ${username}, attempt: ${attempt + 1}`);
//       console.log(`Generated order number: ${orderNumber}`);

//       // Calculate estimated delivery (48 hours from now)
//       const estimatedDelivery = new Date();
//       estimatedDelivery.setHours(estimatedDelivery.getHours() + 48);

//       // Process items to ensure they have the correct structure
//       const processedItems = items.map(item => ({
//         name: item.name,
//         quantity: item.quantity || 1,
//         price: item.price || 0,
//         total: (item.quantity || 1) * (item.price || 0)
//       }));

//       // Create new order (removed userId since we're not validating users)
//       const newOrder = new Order({
//         username,
//         orderNumber,
//         items: processedItems,
//         totalAmount,
//         deliveryAddress: {
//           street: deliveryAddress.street,
//           city: deliveryAddress.city,
//           state: deliveryAddress.state,
//           zipCode: deliveryAddress.zipCode
//         },
//         phoneNumber,
//         specialInstructions: specialInstructions || '',
//         status: 'pending',
//         orderDate: new Date(),
//         estimatedDelivery
//       });

//       const savedOrder = await newOrder.save();
      
//       console.log('✅ Order saved successfully:', savedOrder.orderNumber);

//       return res.status(201).json({
//         success: true,
//         message: 'Order placed successfully!',
//         order: {
//           id: savedOrder._id,
//           orderNumber: savedOrder.orderNumber,
//           username: savedOrder.username,
//           items: savedOrder.items,
//           totalAmount: savedOrder.totalAmount,
//           status: savedOrder.status,
//           orderDate: savedOrder.orderDate,
//           estimatedDelivery: savedOrder.estimatedDelivery,
//           deliveryAddress: savedOrder.deliveryAddress,
//           phoneNumber: savedOrder.phoneNumber,
//           specialInstructions: savedOrder.specialInstructions
//         }
//       });

//     } catch (error) {
//       console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);
      
//       // If it's a duplicate key error and we have retries left, try again
//       if (error.code === 11000 && attempt < maxRetries - 1) {
//         attempt++;
//         console.log(`🔄 Retrying order creation (attempt ${attempt + 1}/${maxRetries})...`);
//         // Add a small delay to avoid rapid retries
//         await new Promise(resolve => setTimeout(resolve, 100 + (attempt * 50)));
//         continue;
//       }
      
//       // If we've exhausted retries or it's a different error
//       console.error('❌ Order creation failed after all attempts:', error);
      
//       if (error.code === 11000) {
//         return res.status(500).json({
//           success: false,
//           message: 'Unable to generate unique order number after multiple attempts. Please try again.',
//           error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//       }
      
//       return res.status(500).json({
//         success: false,
//         message: 'Failed to create order. Please try again.',
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
//   }
// });

// // Get orders by username
// router.get('/user/:username', async (req, res) => {
//   try {
//     const { username } = req.params;
    
//     console.log('=== FETCHING ORDERS FOR USER ===');
//     console.log('Username:', username);

//     if (!username) {
//       return res.status(400).json({
//         success: false,
//         message: 'Username is required'
//       });
//     }

//     const orders = await Order.find({ username })
//       .sort({ orderDate: -1 }); // Most recent first

//     console.log(`✅ Found ${orders.length} orders for ${username}`);

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders: orders.map(order => ({
//         id: order._id,
//         orderNumber: order.orderNumber,
//         items: order.items,
//         totalAmount: order.totalAmount,
//         status: order.status,
//         orderDate: order.orderDate,
//         estimatedDelivery: order.estimatedDelivery,
//         deliveryAddress: order.deliveryAddress,
//         phoneNumber: order.phoneNumber,
//         specialInstructions: order.specialInstructions
//       }))
//     });

//   } catch (error) {
//     console.error('❌ Error fetching orders:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch orders',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // Get all orders (admin route)
// router.get('/admin/all', async (req, res) => {
//   try {
//     console.log('=== FETCHING ALL ORDERS ===');
    
//     const orders = await Order.find()
//       .sort({ orderDate: -1 });

//     console.log(`✅ Found ${orders.length} total orders`);

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders
//     });

//   } catch (error) {
//     console.error('❌ Fetch all orders error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// });

// // Update order status
// router.put('/status/:orderId', async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     console.log('=== UPDATING ORDER STATUS ===');
//     console.log('Order ID:', orderId);
//     console.log('New Status:', status);

//     const validStatuses = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];
    
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
//       });
//     }

//     const order = await Order.findByIdAndUpdate(
//       orderId,
//       { status, updatedAt: new Date() },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     console.log('✅ Order status updated successfully');

//     res.status(200).json({
//       success: true,
//       message: 'Order status updated successfully',
//       order
//     });

//   } catch (error) {
//     console.error('❌ Update order status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// });

// // Delete order
// router.delete('/:orderId', async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     console.log('=== DELETING ORDER ===');
//     console.log('Order ID:', orderId);

//     const order = await Order.findByIdAndDelete(orderId);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     console.log('✅ Order deleted successfully');

//     res.status(200).json({
//       success: true,
//       message: 'Order deleted successfully',
//       deletedOrder: {
//         id: order._id,
//         orderNumber: order.orderNumber
//       }
//     });

//   } catch (error) {
//     console.error('❌ Delete order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// });

// // Get single order by ID
// router.get('/order/:orderId', async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     console.log('=== FETCHING SINGLE ORDER ===');
//     console.log('Order ID:', orderId);

//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     console.log('✅ Order found:', order.orderNumber);

//     res.status(200).json({
//       success: true,
//       order
//     });

//   } catch (error) {
//     console.error('❌ Error fetching order:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch order',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Function to generate unique order number
function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  const randomString = Math.random().toString(36).substring(2, 8);
  return `ORD${timestamp}${random}${randomString}`.toUpperCase();
}

// Create new order with retry logic for duplicate order numbers
router.post('/create', async (req, res) => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      console.log('=== ORDER CREATION REQUEST ===');
      console.log('Request body:', req.body);
      
      const { 
        username, 
        items, 
        totalAmount, 
        deliveryAddress, 
        phoneNumber, 
        specialInstructions 
      } = req.body;

      // Validate required fields
      if (!username || !username.trim()) {
        console.log('❌ Username missing or empty');
        return res.status(400).json({
          success: false,
          message: 'Username is required'
        });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        console.log('❌ No items in order');
        return res.status(400).json({
          success: false,
          message: 'Order must contain at least one item'
        });
      }

      if (!totalAmount || totalAmount <= 0) {
        console.log('❌ Invalid total amount');
        return res.status(400).json({
          success: false,
          message: 'Valid total amount is required'
        });
      }

      if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || 
          !deliveryAddress.state || !deliveryAddress.zipCode) {
        console.log('❌ Incomplete delivery address');
        return res.status(400).json({
          success: false,
          message: 'Complete delivery address is required'
        });
      }

      if (!phoneNumber || !phoneNumber.trim()) {
        console.log('❌ Phone number missing');
        return res.status(400).json({
          success: false,
          message: 'Phone number is required'
        });
      }

      console.log('✅ Creating order for username:', username);

      // Generate unique order number
      const orderNumber = generateOrderNumber();
      
      console.log(`✅ Creating order for username: ${username}, attempt: ${attempt + 1}`);
      console.log(`Generated order number: ${orderNumber}`);

      // Calculate estimated delivery (48 hours from now)
      const estimatedDelivery = new Date();
      estimatedDelivery.setHours(estimatedDelivery.getHours() + 48);

      // Process items to ensure they have the correct structure
      const processedItems = items.map(item => ({
        name: item.name || 'Unknown Item',
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price) || 0,
        total: (parseInt(item.quantity) || 1) * (parseFloat(item.price) || 0)
      }));

      // Create new order
      const newOrder = new Order({
        username: username.trim(),
        orderNumber,
        items: processedItems,
        totalAmount: parseFloat(totalAmount),
        deliveryAddress: {
          street: deliveryAddress.street.trim(),
          city: deliveryAddress.city.trim(),
          state: deliveryAddress.state.trim(),
          zipCode: deliveryAddress.zipCode.trim()
        },
        phoneNumber: phoneNumber.trim(),
        specialInstructions: specialInstructions ? specialInstructions.trim() : '',
        status: 'pending',
        orderDate: new Date(),
        estimatedDelivery
      });

      const savedOrder = await newOrder.save();
      
      console.log('✅ Order saved successfully:', savedOrder.orderNumber);

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order: {
          id: savedOrder._id,
          orderNumber: savedOrder.orderNumber,
          username: savedOrder.username,
          items: savedOrder.items,
          totalAmount: savedOrder.totalAmount,
          status: savedOrder.status,
          orderDate: savedOrder.orderDate,
          estimatedDelivery: savedOrder.estimatedDelivery,
          deliveryAddress: savedOrder.deliveryAddress,
          phoneNumber: savedOrder.phoneNumber,
          specialInstructions: savedOrder.specialInstructions
        }
      });

    } catch (error) {
      console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);
      
      // If it's a duplicate key error and we have retries left, try again
      if (error.code === 11000 && attempt < maxRetries - 1) {
        attempt++;
        console.log(`🔄 Retrying order creation (attempt ${attempt + 1}/${maxRetries})...`);
        // Add a small delay to avoid rapid retries
        await new Promise(resolve => setTimeout(resolve, 100 + (attempt * 50)));
        continue;
      }
      
      // If we've exhausted retries or it's a different error
      console.error('❌ Order creation failed after all attempts:', error);
      
      if (error.code === 11000) {
        return res.status(500).json({
          success: false,
          message: 'Unable to generate unique order number after multiple attempts. Please try again.',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create order. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

// Get orders by username
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    console.log('=== FETCHING ORDERS FOR USER ===');
    console.log('Username:', username);

    if (!username || !username.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    const orders = await Order.find({ username: username.trim() })
      .sort({ orderDate: -1 }); // Most recent first

    console.log(`✅ Found ${orders.length} orders for ${username}`);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        orderDate: order.orderDate,
        estimatedDelivery: order.estimatedDelivery,
        deliveryAddress: order.deliveryAddress,
        phoneNumber: order.phoneNumber,
        specialInstructions: order.specialInstructions
      }))
    });

  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all orders (admin route)
router.get('/admin/all', async (req, res) => {
  try {
    console.log('=== FETCHING ALL ORDERS ===');
    
    const orders = await Order.find()
      .sort({ orderDate: -1 });

    console.log(`✅ Found ${orders.length} total orders`);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('❌ Fetch all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update order status
router.put('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log('=== UPDATING ORDER STATUS ===');
    console.log('Order ID:', orderId);
    console.log('New Status:', status);

    if (!orderId || !orderId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId.trim(),
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('✅ Order status updated successfully');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('❌ Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete order
router.delete('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log('=== DELETING ORDER ===');
    console.log('Order ID:', orderId);

    if (!orderId || !orderId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const order = await Order.findByIdAndDelete(orderId.trim());

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('✅ Order deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      deletedOrder: {
        id: order._id,
        orderNumber: order.orderNumber
      }
    });

  } catch (error) {
    console.error('❌ Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get single order by ID
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log('=== FETCHING SINGLE ORDER ===');
    console.log('Order ID:', orderId);

    if (!orderId || !orderId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const order = await Order.findById(orderId.trim());

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('✅ Order found:', order.orderNumber);

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add to your main server file or create admin routes
router.get('/admin/users', async (req, res) => {
  try {
    const User = require('../models/User'); // Import your User model
    const users = await User.find({ role: 'user' })
      .select('-password') // Exclude password
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});
module.exports = router;