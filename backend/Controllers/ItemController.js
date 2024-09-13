const Item = require("../Models/ItemModel");

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json({ message: "Item Created Successfully", record: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    if (Object.values(req.body).some((value) => value === "")) {
      return res.status(400).json({ message: "Item validation failed." });
    }
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(204).json({ message: "Item updated successfully", record: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};