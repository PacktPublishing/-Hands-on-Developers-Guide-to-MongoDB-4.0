const mongoose = require("mongoose");
const Company = require("../models/Company");

let company;

beforeAll(() => {
  mongoose.Promise = global.Promise;
  mongoose.connect("mongodb://localhost/taxi-aggregator", {
    useNewUrlParser: true,
    useCreateIndex: true
  });
});

beforeEach(async () => {
  company = new Company();
  company.name = "First Company";
  company = await company.save();
});

afterEach(async () => {
  await Company.deleteMany({});
});

afterAll(done => {
  mongoose.disconnect(done);
});

describe("company tests", () => {
  //insert tests
  test("create company", async () => {
    const count = await Company.countDocuments();
    expect(count).toBe(1);
  });

  test("read company", async () => {
    const readCompany = await Company.findById(company.id);
    expect(readCompany.name).toBe(company.name);
  });

  test("update company", async () => {
    //update existing company
    await Company.updateOne({ _id: company.id }, { name: "Name modified" });

    //read company
    const readCompany = await Company.findById(company.id);

    expect(readCompany.name).toBe("Name modified");
  });
});
