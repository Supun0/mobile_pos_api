const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc Get all orders
// @route GET /api/v1/orders
// @access Private

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name address")
      .populate("productDetails.product", "description unitPrice");
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc Get a single order
// @route GET /api/v1/orders/:id
// @access Private

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name address")
      .populate("productDetails.product", "description unitPrice");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc Create a new order
// @route POST /api/v1/orders
// @access Private

const createOrder = async (req, res) => {
  try {
    const { customer, productDetails } = req.body;

    let totalAmount = 0;

    for (let item of productDetails) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`,
        });
      }

      if (product.qtyOnHand < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.description}`,
        });
      }

      item.price = product.unitPrice;
      totalAmount += product.unitPrice * item.quantity;

      // Update product quantity
      product.qtyOnHand -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      customer,
      productDetails,
      totalAmount,
      date: req.body.date || Date.now(),
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name address")
      .populate("productDetails.product", "description unitPrice");

    res.status(201).json({
      success: true,
      data: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc Update an  order
// @route PUT /api/v1/orders/:id
// @access Private

const updateOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    
    //If updating productDetails, need to recalculate totalAmount and update stock
    if (req.body.productDetails) {
      // First, restore stock from existing order
      for (let item of order.productDetails) {
        const product = await Product.findById(item.product);
        if (product) {
          product.qtyOnHand += item.quantity;
          await product.save();
        }
      }

      let totalAmount = 0;
      for (let item of req.body.productDetails) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product with ID ${item.product} not found`,
          });
        }

        if (product.qtyOnHand < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product ${product.description}`,
          });
        }
        
        item.price = product.unitPrice;
        totalAmount += product.unitPrice * item.quantity;

        // Update product quantity
        product.qtyOnHand -= item.quantity;
        await product.save();
      }

        req.body.totalAmount = totalAmount;
    }

         order = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
          .populate("customer", "name address")
          .populate("productDetails.product", "description unitPrice");

        res.status(200).json({
          success: true,
          data: order,
        });
    

    const { customer, productDetails } = req.body;

    let totalAmount = 0;

    for (let item of productDetails) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`,
        });
      }

      if (product.qtyOnHand < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.description}`,
        });
      }

      item.price = product.unitPrice;
      totalAmount += product.unitPrice * item.quantity;

      // Update product quantity
      product.qtyOnHand -= item.quantity;
      await product.save();
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// @desc Delete an  order
// @route DELETE /api/v1/orders/:id
// @access Private

const deleteOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    
    //Restore product quantities

    for (let item of order.productDetails) {
        const product = await Product.findById(item.product);

        if (product) {
          product.qtyOnHand += item.quantity;
          await product.save();
        }
      }

      await Order.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        data: {},
        message: "Order deleted successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


