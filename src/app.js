const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const testRoutes = require("./routes/test.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// test routes
app.use("/api/test", testRoutes);
app.use("/api/payments", paymentRoutes);
// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "E-Commerce Receipt Generator API is running",
  });
});

module.exports = app;
