const mongoose = require("mongoose");
const Company = require("../models/Company");
const Taxi = require("../models/Taxi");

beforeAll(() => {
  mongoose.Promise = global.Promise;
  mongoose.connect("mongodb://localhost/taxi-aggregator", {
    useNewUrlParser: true,
    useCreateIndex: true
  });
});

beforeEach(async () => {});

afterEach(async () => {
  //cleanup
  await Company.deleteMany({});
  await Taxi.deleteMany({});
});

afterAll(done => {
  mongoose.disconnect(done);
});

describe("mongo operators tests", () => {
  //comparison
  test("$gt and $lt", async () => {
    // create 5 taxies
    for (let i = 1; i <= 5; i++) {
      let taxi = new Taxi();
      taxi.brand = "Toyota";
      taxi.model = "Yaris";
      taxi.year = 2015;
      taxi.owner = { name: `Driver ${i}`, experience: 5 * i };
      await taxi.save();
    }

    const count = await Taxi.countDocuments();
    expect(count).toBe(5);

    const readTaxies = await Taxi.find({
      "owner.experience": { $gt: 6, $lt: 21 }
    });

    expect(readTaxies.length).toBe(3);
  });

  //comparison
  test("$in", async () => {
    // create 5 taxies
    for (let i = 1; i <= 5; i++) {
      let taxi = new Taxi();
      taxi.brand = "Toyota";
      taxi.model = "Yaris";
      taxi.year = 2015;
      taxi.owner = { name: `Driver ${i}`, experience: 5 * i };
      await taxi.save();
    }

    const taxies = await Taxi.find({
      "owner.experience": { $in: [5, 15, 25, 30] }
    });

    expect(taxies.length).toBe(3);
  });

  //logical
  test("$and and $or", async () => {
    let taxi = new Taxi();
    taxi.brand = "Toyota";
    taxi.model = "Yaris";
    taxi.year = 2015;
    taxi.owner = { name: "Driver 1", experience: 5 };
    await taxi.save();

    const readTaxiAnd = await Taxi.find({
      $and: [{ brand: "Toyota" }, { "owner.experience": 6 }]
    });

    expect(readTaxiAnd.length).toBe(0);

    const readTaxiOr = await Taxi.find({
      $or: [{ brand: "Toyota" }, { "owner.experience": 6 }]
    });

    expect(readTaxiOr.length).toBe(1);
  });
});
