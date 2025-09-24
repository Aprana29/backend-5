

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const deliveryAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  }
});

const orderSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // Add orderId field to match the database index
  orderId: {
    type: String,
    unique: true,
    sparse: true // Allows null values but ensures uniqueness when present
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryAddress: {
    type: deliveryAddressSchema,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  specialInstructions: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  estimatedDelivery: {
    type: Date,
    required: true
  },
  actualDelivery: {
    type: Date
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderDate: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ username: 1, orderDate: -1 });

// Virtual fields
orderSchema.virtual('formattedOrderDate').get(function() {
  return this.orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

orderSchema.virtual('formattedEstimatedDelivery').get(function() {
  return this.estimatedDelivery.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Methods
orderSchema.methods.getTotalItemsCount = function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

orderSchema.methods.getStatusDisplay = function() {
  const statusMap = {
    'pending': 'Order Pending',
    'confirmed': 'Order Confirmed',
    'processing': 'Being Processed',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  return statusMap[this.status] || this.status;
};

// Static methods
orderSchema.statics.findByUsername = function(username) {
  return this.find({ username }).sort({ orderDate: -1 });
};

orderSchema.statics.findRecentOrders = function(limit = 10) {
  return this.find().sort({ orderDate: -1 }).limit(limit);
};

// Pre-save middleware
orderSchema.pre('save', function(next) {
  // Calculate total for each item
  this.items.forEach(item => {
    item.total = item.quantity * item.price;
  });
  
  // Verify total amount matches sum of items
  const calculatedTotal = this.items.reduce((sum, item) => sum + item.total, 0);
  if (Math.abs(this.totalAmount - calculatedTotal) > 0.01) {
    this.totalAmount = calculatedTotal;
  }
  
  // Set orderId to orderNumber if not already set (for backward compatibility)
  if (!this.orderId && this.orderNumber) {
    this.orderId = this.orderNumber;
  }
  
  next();
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;