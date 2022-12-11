const request = require("supertest");
const app = require("../src/app");

test("it should update or add item to inventory", async () => {
  const response = await request(app)
    .post("/inventory")
    .send([
      {
        itemID: 12845,
        itemName: "Fancy",
        Quantity: 10,
      },
      {
        itemID: 67891,
        itemName: "Fancy skirt",
        Quantity: 8,
      },
      {
        itemID: 97891,
        itemName: "Fancy sokoto",
        Quantity: 8,
      },
    ])
    .expect(201);
});

test("it should not update or add item if items not provided", async () => {
  await request(app).post("/inventory").send().expect(404);
});

test("to buy a single item on the show", async () => {
  await request(app).post("/show/1/buy_item/12356").send().expect(200);
});

test("should fail if item id does not exist", async () => {
  await request(app).post("/show/1/buy_item/99999").send().expect(404);
});

test("should fail if the quantity is 0", async () => {
  await request(app).post("/show/1/buy_item/12222").send().expect(404);
});

test("should return a sold item in a show usind item_id", async () => {
  await request(app).get("/show/1/sold_items/12356").send().expect(200);
});
test("should fail if no show id does not exist", async () => {
  await request(app).get("/show/9/sold_items/12356").send().expect(404);
});
test("should output all the items in a show", async () => {
  await request(app).get("/show/1/sold_items/").send().expect(200);
});
