const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productName: String,
    quantity: Number,
    unitPrice: Number,
});

const orderSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        customerEmail: {
            type: String,
            required: true,
        },
        items: [orderItemSchema],
        paymentMethod: {
            type: String,
            enum: ["card", "bank_transfer", "wallet"],
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: Date,
    },

    { timestamps: true }

);

module.exports = mongoose.model("Order", orderSchema);