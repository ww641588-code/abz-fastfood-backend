require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Error:", error));

const orderSchema = new mongoose.Schema({
  items: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  customer: {
    type: Object,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", orderSchema);

app.get("/", (req, res) => {
  res.send("ABZ FASTFOOD Backend is Running");
});

app.post("/orders", async (req, res) => {
  try {
    console.log("Order Received:", req.body);

    const order = new Order({
      items: req.body.items,
      total: req.body.total,
      customer: req.body.customer
    });

    const savedOrder = await order.save();

    console.log("Order Saved:", savedOrder);

    res.status(201).json({
      success: true,
      message: "Order saved successfully",
      order: savedOrder
    });
  } catch (error) {
    console.error("Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });

    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
