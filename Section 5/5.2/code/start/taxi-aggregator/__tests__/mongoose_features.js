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

describe("mongoose features", () => {
  test("default validation", async () => {
    try {
      let company = new Company();
      await company.save();
    } catch (err) {
      expect(err.message).toBe(
        "company validation failed: name: Path `name` is required."
      );
    }
  });
});
