const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Please add a customer"],
    },
    date:{
      type: Date,
      default: Date.now
    },
    totalAmount:{
      type: Number,
      required: [true, "Please add a total amount"],
      min: 0
    },
    productDetails:[{
      product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity:{
        type: Number,
        required:true,
        min: 1
      },
      price:{
        type: Number,
        required:true,
        min: 0
      }
    }]
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
