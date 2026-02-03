const transporter = require("../config/email");
const fs = require("fs");

const sendReceiptEmail = async ({ to, subject, text, pdfPath }) => {
  const mailOptions = {
    from: `"ecommerce Store" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    attachments: [
      {
        filename: "receipt.pdf",
        content: fs.createReadStream(pdfPath),
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendReceiptEmail };
