const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));
app.use(cors());

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://mongo:27017/crud");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Define a simple schema and model
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Item = mongoose.model("Item", itemSchema);

// CRUD routes
app.get("/api/get-items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/create-item", async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res
      .status(201)
      .json({ message: "Item Created Successfully", record: item });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
});

app.put("/api/update-item/:id", async (req, res) => {
  try {
    if (Object.values(req.body).some((value) => value === "")) {
      return res.status(400).json({ message: "Item validation failed." });
    }
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res
      .status(204)
      .json({ message: "Item updated successfully", record: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/delete-item/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
