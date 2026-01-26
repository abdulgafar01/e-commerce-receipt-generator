const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    receiptId :  {
      type: String,
      unique: true,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    receiptPdfUrl: {
      type: String,
    },
    totalAmount: Number,
    paymentMethod: String,
    issuedAt: {
      type: Date,
      default: Date.now,
    },
},
     { timestamps: true }
)

module.exports = mongoose.model("Receipt", receiptSchema);