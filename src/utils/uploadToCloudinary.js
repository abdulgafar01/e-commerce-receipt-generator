const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadPdfToCloudinary = async (filePath, receiptId) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "receipts",
      public_id: receiptId,
      resource_type: "raw", // for PDFs
    });

    // fs.unlinkSync(filePath); // cleanup local file

    return result.secure_url;
  } catch (error) {
    console.error("Cloud upload failed", error);
    throw error;
  }
};

module.exports = { uploadPdfToCloudinary };
