const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.post("/order", async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
});

module.exports = router;
