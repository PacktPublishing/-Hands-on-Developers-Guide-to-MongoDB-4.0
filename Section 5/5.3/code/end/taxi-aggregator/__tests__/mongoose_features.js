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

  test("custom validation simple", async () => {
    try {
      let taxi = new Taxi();
      taxi.model = "Yaris";
      taxi.year = 2017;
      taxi.owner = { name: "Driver 1", experience: 15 };
      taxi = await taxi.save();
    } catch (err) {
      expect(err.message).toBe(
        "taxi validation failed: brand: Brand is required 123"
      );
    }
  });

  test("custom validation advanced", async () => {
    try {
      let taxi = new Taxi();
      taxi.brand = "Toyota";
      taxi.model = "Yaris";
      taxi.year = 111;
      taxi.owner = { name: "Driver 1", experience: 15 };
      taxi = await taxi.save();
    } catch (err) {
      expect(err.message).toBe(
        "taxi validation failed: year: 111 is not a valid year!"
      );
    }
  });

  test("post save middleware", async () => {
    try {
      let company = new Company();
      company.name = "throw error name";
      await company.save();
    } catch (err) {
      expect(err.message).toBe("New Test Error");
    }
  });
});
