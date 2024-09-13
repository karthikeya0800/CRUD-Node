const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const itemRoutes = require("./Routes/ItemRoutes");

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

// Use routes
app.use("/api", itemRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});