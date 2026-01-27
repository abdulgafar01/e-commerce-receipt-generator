const Receipt = require("../models/Receipt");
const Order = require("../models/Order");
const crypto = require("crypto");
const { buildReceiptData } = require("./receiptBuilder.service");
const { generateReceiptPdf } = require("../utils/pdf/generateReceiptPdf");

exports.triggerReceiptGeneration = async (orderId) => {
  const existingReceipt = await Receipt.findOne({ orderId });

  if (existingReceipt) {
    console.log("Receipt already exists for this order");
    return;
  }

  const order = await Order.findById(orderId);

  if (!order || !order.isPaid) return;

  const receiptId = `RCT-${crypto.randomBytes(4).toString("hex")}`;

   const receiptData = buildReceiptData(order);
  receiptData.receiptMeta.receiptId = receiptId;

  const pdfPath = await generateReceiptPdf(receiptData);

  await Receipt.create({
    receiptId,
    orderId,
    totalAmount: receiptData.pricing.totalAmount,
    paymentMethod: order.paymentMethod,
  });

  console.log("Receipt record created (PDF pending)", receiptData, pdfPath);
};
