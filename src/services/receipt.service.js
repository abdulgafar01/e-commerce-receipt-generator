const Receipt = require("../models/Receipt");
const fs = require("fs");
const Order = require("../models/Order");
const crypto = require("crypto");
const { buildReceiptData } = require("./receiptBuilder.service");
const { generateReceiptPdf } = require("../utils/pdf/generateReceiptPdf");
const { uploadPdfToCloudinary } = require("../utils/uploadToCloudinary");
const { sendReceiptEmail } = require("./email.service");

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

  // Upload to Cloudinary
  const receiptPdfUrl = await uploadPdfToCloudinary(pdfPath, receiptId);

  try {
    await sendReceiptEmail({
      to: order.customerEmail,
      subject: "Your Purchase Receipt",
      text: `Hello ${order.customerName},\n\nThank you for your purchase. Your receipt is attached.`,
      pdfPath,
    });

    fs.unlinkSync(pdfPath); // cleanup local file after email is sent
  } catch (error) {
    console.error("Email failed but receipt stored", error.message);
  }


  // save receipt to database
  await Receipt.create({
    receiptId,
    orderId,
    totalAmount: receiptData.pricing.totalAmount,
    paymentMethod: order.paymentMethod,
    receiptPdfUrl,
  });

  console.log("Receipt record created and uploaded to Cloudinary", receiptData, pdfPath);
};
