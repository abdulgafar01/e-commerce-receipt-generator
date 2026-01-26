const express = require("express");
const { handlePaymentSuccess } = require("../controllers/payment.controller");

const router = express.Router();

router.post("/success", handlePaymentSuccess);

module.exports = router;
