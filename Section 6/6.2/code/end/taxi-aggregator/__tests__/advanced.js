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

describe("advanced mongodb features", () => {
  test("skip and limit", async () => {
    for (let i = 0; i < 55; i++) {
      let company = new Company();
      company.name = `Company ${i + 1}`;
      await company.save();
    }

    const pagination = 10;
    let page = 1;

    const firstGroup = await Company.find()
      .skip((page - 1) * pagination)
      .limit(pagination);

    expect(firstGroup.length).toBe(10);

    page = 6;
    const secondGroup = await Company.find()
      .skip((page - 1) * pagination)
      .limit(pagination);

    expect(secondGroup.length).toBe(5);
    expect(secondGroup[0].name).toBe("Company 51");
  });
});
