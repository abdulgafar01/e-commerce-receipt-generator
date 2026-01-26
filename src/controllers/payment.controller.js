const Order = require("../models/Order");
const { triggerReceiptGeneration } = require("../services/receipt.service");

exports.handlePaymentSuccess = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.isPaid) {
    return res.status(400).json({ message: "Order already paid" });
  }

  order.isPaid = true;
  order.paidAt = new Date();
  await order.save();

  //  Trigger receipt workflow (event-like)
  triggerReceiptGeneration(order._id);

  res.status(200).json({
    message: "Payment successful, receipt generation triggered",
  });
};
