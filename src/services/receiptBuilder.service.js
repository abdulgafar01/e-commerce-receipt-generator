const buildReceiptData = (order) => {
  const items = order.items.map((item) => {
    const total = item.quantity * item.unitPrice;
    return {
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  const taxRate = 0.075; // 7.5%
  const tax = subtotal * taxRate;

  const discount = 0; // placeholder

  const totalAmount = subtotal + tax - discount;

  return {
    receiptMeta: {
      receiptId: null, // added later
      issuedAt: new Date(),
    },
    customer: {
      name: order.customerName,
      email: order.customerEmail,
    },
    order: {
      orderId: order._id,
      paymentMethod: order.paymentMethod,
      date: order.paidAt,
    },
    items,
    pricing: {
      subtotal,
      tax,
      discount,
      totalAmount,
      currency: "NGN",
    },
    business: {
      name: "Ecomerce Store",
      email: "support@busari.com",
    },
  };
};

module.exports = { buildReceiptData };
