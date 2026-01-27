const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateReceiptPdf = async (receiptData) => {
  const doc = new PDFDocument({ margin: 50 });

  const fileName = `receipt-${receiptData.receiptMeta.receiptId}.pdf`;
  const filePath = path.join(__dirname, "../../../tmp", fileName);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  doc.pipe(fs.createWriteStream(filePath));

  //  Header
  doc
    .fontSize(20)
    .text(receiptData.business.name, { align: "center" })
    .moveDown();

  doc
    .fontSize(12)
    .text(`Receipt ID: ${receiptData.receiptMeta.receiptId}`)
    .text(`Date: ${receiptData.receiptMeta.issuedAt.toDateString()}`)
    .moveDown();

  //  Customer
  doc
    .text(`Customer: ${receiptData.customer.name}`)
    .text(`Email: ${receiptData.customer.email}`)
    .moveDown();

  // Items
  doc.text("Items:", { underline: true }).moveDown(0.5);

  receiptData.items.forEach((item) => {
    doc.text(
      `${item.productName} - ${item.quantity} x ₦${item.unitPrice} = ₦${item.total}`
    );
  });

  doc.moveDown();

  // Pricing
  const pricing = receiptData.pricing;

  doc.text(`Subtotal: ₦${pricing.subtotal}`);
  doc.text(`Tax: ₦${pricing.tax}`);
  doc.text(`Discount: ₦${pricing.discount}`);
  doc.fontSize(14).text(`Total: ₦${pricing.totalAmount}`, { bold: true });

  // Footer
  doc.moveDown(2);
  doc.fontSize(10).text("Thank you for your purchase!", { align: "center" });

  doc.end();

  return filePath;
};

module.exports = { generateReceiptPdf };
