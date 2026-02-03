const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateReceiptPdf = async (receiptData) => {
  const doc = new PDFDocument({ margin: 50 });

  const fileName = `receipt-${receiptData.receiptMeta.receiptId}.pdf`;
  const filePath = path.join(__dirname, "../../../tmp", fileName);
  const regularFont = path.join(
    __dirname,
    "../../../assets/fonts/DejaVuSans.ttf"
  );

  const boldFont = path.join(
    __dirname,
    "../../../assets/fonts/DejaVuSans-Bold.ttf"
  );

  doc.registerFont("Regular", regularFont);
  doc.registerFont("Bold", boldFont);
  doc.font("Regular");

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  doc.pipe(fs.createWriteStream(filePath));

  const bannerPath = path.join(
    __dirname,
    "../../../assets/images/receipt-banner.png"
  );

  const logoPath = path.join(
    __dirname,
    "../../../assets/images/logo.png"
  );

  // ===== BANNER =====
  doc.image(bannerPath, 0, 0, {
    width: doc.page.width
  });

  // Logo
  doc.image(logoPath, 50, 30, {
    width: 60
  });

  // Banner text
  doc
    .fillColor("#000000")
    .font("Bold")
    .fontSize(22)
    .text(receiptData.business.name, 130, 35);

  doc
    .fillColor("#1d1d1d")
    .font("Regular")
    .fontSize(11)
    .text("Official Receipt", 130, 65);

  // address
  doc
    .fillColor("#1d1d1d")
    .fontSize(10)
    .text("123 Commerce St, Lagos, Nigeria", 130, 80)
    .text("Email: " + receiptData.business.email, 130, 95)
    .moveDown();

  // Move body below banner
  doc.fillColor("#000000");
  doc.y = 180;

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



  /* ================= ITEMS TABLE ================= */
  const tableTop = doc.y;
  const col = {
    item: 50,
    qty: 280,
    price: 340,
    total: 430,
  };

  // Header background
  doc
    .rect(50, tableTop, 500, 25)
    .fill("#d4d4d4");

  doc
    .fillColor("#000000")
    .fontSize(11)
    .text("Item", col.item, tableTop + 7)
    .text("Qty", col.qty, tableTop + 7)
    .text("Price", col.price, tableTop + 7)
    .text("Total", col.total, tableTop + 7);

  let y = tableTop + 30;

  receiptData.items.forEach((item) => {
    doc
      .fontSize(10)
      .text(item.productName, col.item, y)
      .text(item.quantity, col.qty, y)
      .text(`₦${item.unitPrice}`, col.price, y)
      .text(`₦${item.total}`, col.total, y);

    // Row divider
    doc
      .moveTo(50, y + 15)
      .lineTo(550, y + 15)
      .strokeColor("#e5e7eb")
      .stroke();

    y += 25;
  });

  doc.moveDown(3);

  /* ================= TOTALS BOX ================= */
  const totalsTop = y + 10;

  doc
    .rect(330, totalsTop, 220, 110)
    .stroke("#d1d5db");

  doc.fontSize(11).text("Subtotal:", 350, totalsTop + 15);
  doc.text(`₦${receiptData.pricing.subtotal}`, 520, totalsTop + 15, {
    align: "right",
  });

  doc.text("Tax:", 350, totalsTop + 40);
  doc.text(`₦${receiptData.pricing.tax}`, 520, totalsTop + 40, {
    align: "right",
  });

  doc.text("Discount:", 350, totalsTop + 65);
  doc.text(`₦${receiptData.pricing.discount}`, 520, totalsTop + 65, {
    align: "right",
  });

  doc
    .moveTo(350, totalsTop + 85)
    .lineTo(540, totalsTop + 85)
    .stroke();

  doc
    .fontSize(13)
    .text("TOTAL:", 350, totalsTop + 90)
    .text(`₦${receiptData.pricing.totalAmount}`, 520, totalsTop + 90, {
      align: "right",
    });

  // Alternative using box coordinates
  const pageWidth = doc.page.width;
  const margin = doc.page.margins.left;
  const usableWidth = pageWidth - margin * 2;

  const totalsBoxWidth = 330;
  const totalsBoxX = margin + usableWidth - totalsBoxWidth;


  doc.rect(totalsBoxX, totalsTop, totalsBoxWidth, 110).stroke("#d1d5db");

  doc.fontSize(11)
    .text("Subtotal:", totalsBoxX + 15, totalsTop + 15)
    .text(`₦${receiptData.pricing.subtotal}`, totalsBoxX + totalsBoxWidth - 15, totalsTop + 15, {
      align: "right"
    });

  doc.text("Tax:", totalsBoxX + 15, totalsTop + 40);
  doc.text(`₦${receiptData.pricing.tax}`, totalsBoxX + totalsBoxWidth - 15, totalsTop + 40, {
    align: "right"
  });

  doc.text("Discount:", totalsBoxX + 15, totalsTop + 65);
  doc.text(`₦${receiptData.pricing.discount}`, totalsBoxX + totalsBoxWidth - 15, totalsTop + 65, {
    align: "right"
  });

  doc
    .moveTo(totalsBoxX + 15, totalsTop + 85)
    .lineTo(totalsBoxX + totalsBoxWidth - 15, totalsTop + 85)
    .stroke();

  doc.font("Bold")
    .fontSize(13)
    .text("TOTAL:", totalsBoxX + 15, totalsTop + 90)
    .text(`₦${receiptData.pricing.totalAmount}`, totalsBoxX + totalsBoxWidth - 15, totalsTop + 90, {
      align: "right"
    });


  doc.text(`Subtotal: ₦${receiptData.pricing.subtotal}`, { align: "right" });
  doc.text(`Tax: ₦${receiptData.pricing.tax}`, { align: "right" });
  doc.text(`Discount: ₦${receiptData.pricing.discount}`, { align: "right" });
  doc.fontSize(14).text(`Total: ₦${receiptData.pricing.totalAmount}`, { bold: true, align: "right" });

  // Footer
  doc.moveDown(4);
  doc.fontSize(10).text("Thank you for your purchase!", { align: "center", width: 500 });

  doc
    .fontSize(10)
    .text(
      " Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
  doc.end();

  return filePath;
};

module.exports = { generateReceiptPdf };
