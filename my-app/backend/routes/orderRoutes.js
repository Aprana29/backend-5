// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');
// const User = require('../models/User'); // Assuming you have a User model
// const auth = require('../middleware/auth'); // JWT auth middleware

// // Create new order
// router.post('/create', async (req, res) => {
//   try {
//     const { username, items, totalAmount, deliveryAddress, phoneNumber, specialInstructions } = req.body;

//     // Validate required fields
//     if (!username || !items || !totalAmount) {
//       return res.status(400).json({
//         success: false,
//         message: 'Username, items, and total amount are required'
//       });
//     }

//     // Find user by username to get userId
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Calculate estimated delivery (48 hours from now)
//     const estimatedDelivery = new Date();
//     estimatedDelivery.setHours(estimatedDelivery.getHours() + 48);

//     // Create new order
//     const newOrder = new Order({
//       username,
//       userId: user._id,
//       items,
//       totalAmount,
//       deliveryAddress,
//       phoneNumber,
//       specialInstructions,
//       estimatedDelivery
//     });

//     const savedOrder = await newOrder.save();

//     res.status(201).json({
//       success: true,
//       message: 'Order placed successfully',
//       order: savedOrder
//     });

//   } catch (error) {
//     console.error('Order creation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// });

// // Get orders by username
// router.get('/:username', async (req, res) => {
//   try {
//     const { username } = req.params;

//     const orders = await Order.find({ username })
//       .sort({ createdAt: -1 }) // Most recent first
//       .populate('userId', 'email name'); // Populate user details if needed

//     res.status(200).json({
//       success: true,
//       orders
//     });

//   } catch (error) {
//     console.error('Fetch orders error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// });

// // Get all orders (admin route)
// router.get('/admin/all', async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .populate('userId', 'email name username');

//     res.status(200).json({
//       success: true,
//       orders
//     });

//   } catch (error) {
//     console.error('Fetch all orders error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// });

// // Update order status
// router.put('/:orderId/status', async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status'
//       });
//     }

//     const order = await Order.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Order status updated successfully',
//       order
//     });

//   } catch (error) {
//     console.error('Update order status error:', error);
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

//     const order = await Order.findByIdAndDelete(orderId);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Order deleted successfully'
//     });

//   } catch (error) {
//     console.error('Delete order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// });

// module.exports = router;