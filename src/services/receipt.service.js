const Receipt = require("../models/Receipt");
const Order = require("../models/Order");
const crypto = require("crypto");

exports.triggerReceiptGeneration = async (orderId) => {
  const existingReceipt = await Receipt.findOne({ orderId });

  if (existingReceipt) {
    console.log("Receipt already exists for this order");
    return;
  }

  const order = await Order.findById(orderId);

  if (!order) return;

  const receiptId = `RCT-${crypto.randomBytes(4).toString("hex")}`;

  await Receipt.create({
    receiptId,
    orderId,
    paymentMethod: order.paymentMethod,
  });

  console.log("Receipt record created (PDF pending)");
};
