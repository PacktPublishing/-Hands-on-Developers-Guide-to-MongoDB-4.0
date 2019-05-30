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
});
