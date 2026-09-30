

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.port || 3000;

app.use(cors());
app.use(express.json());

const orderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  customer: Object,
  date: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", orderSchema);

app.get("/", (req, res) => {
  res.send("Food website backend is running 🔥");
});

app.post("/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);

    res.json({
      success: true,
      message: "Order saved successfully",
      order: order
    });
 } catch (error) {
    console.log("ORDER ERROR ❌", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
}
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch orders"
    });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed ❌");
    console.log(error.message);
  });
