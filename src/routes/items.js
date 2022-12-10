const e = require("express");
const express = require("express");
const fs = require("fs");

const router = new express.Router();

let inventory = {
  12356: { itemID: "12356", itemName: "Fancy Dress", quantity: 10 },
  23456: { itemID: "23456", itemName: "Fancy item", quantity: 10 },
};

let shows = {
  1: [
    { itemID: "12845", itemName: "Fancy Dress", quantity_sold: 10 },
    { itemID: "12356", itemName: "Fancy item", quantity_sold: 10 },
  ],
};

//add or update item in stock right now

router.post("/inventory", (req, res) => {
  const items = req.body;
  items.forEach((item) => {
    inventory[item.itemID] = { ...item };
  });
  console.log(inventory);
  return res.status(200).json({ sucess: true, message: "inventory" });
});

//show id
router.post("/show/:show_ID/buy_item/:item_ID", (req, res) => {
  const showID = req.params.show_ID;
  const items_ID = req.params.item_ID;

  if (!inventory[items_ID]) {
    return res.status(404).json({ message: "item does not exist" });
  }

  const { quantity, ...item } = inventory[items_ID];
  if (!quantity || quantity < 1) {
    return res.status(404).json({ message: "Item not found" });
  }

  // deduct an item
  --inventory[req.params.item_ID].quantity;

  //update the shows with item sold
  if (shows[showID]) {
    console.log(shows[showID]);
    let itemIndex = shows[showID].findIndex((item) => {
      return item.itemID === items_ID;
    });
    if (itemIndex > -1) {
      ++shows[showID][itemIndex].quantity_sold;
    } else {
      shows[showID].push({ ...item, quantity_sold: 1 });
    }
  } else {
    shows[showID] = [{ ...item, quantity_sold: 1 }];
  }
  console.log(shows);
  return res.status(200).json({
    sucess: true,
    message: "Successfully sold the item",
  });
});

router.get("/show/:show_ID/sold_items/:item_ID", (req, res) => {
  const showID = req.params.show_ID;
  const items_ID = req.params.item_ID;

  if (!shows[showID]) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }
  if (shows[showID]) {
    const getItem = shows[showID].findIndex(({ itemID }) => {
      return itemID === items_ID;
    });
    if (getItem > -1) {
      return res.status(200).json({
        sold: shows[showID][getItem],
      });
    } else {
    }

    console.log(getItem);
  }
});

router.get("/show/:show_ID/sold_items/", (req, res) => {
  const showID = req.params.show_ID;

  if (!shows[showID]) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  res.status(200).json({
    success: true,
    sold: shows[showID],
  });
});

module.exports = router;
