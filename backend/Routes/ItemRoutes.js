const express = require("express");
const itemController = require("../Controllers/ItemController");

const router = express.Router();

router.get("/get-items", itemController.getItems);
router.post("/create-item", itemController.createItem);
router.put("/update-item/:id", itemController.updateItem);
router.delete("/delete-item/:id", itemController.deleteItem);

module.exports = router;
