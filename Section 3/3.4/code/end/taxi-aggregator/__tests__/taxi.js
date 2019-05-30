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

describe("taxi tests", () => {
  test("reading subdocuments", async () => {
    let taxi = new Taxi();
    taxi.brand = "Toyota";
    taxi.model = "Yaris";
    taxi.year = 2015;
    taxi.owner = { name: "Driver 1", experience: 15 };
    taxi = await taxi.save();

    const readTaxi = await Taxi.findOne();
    expect(readTaxi.owner.name).toBe("Driver 1");
  });
});
