const express = require("express");
const itemsRouter = require("./routes/items");

const app = express();
app.use(express.json());

app.use(itemsRouter);

module.exports = app;
