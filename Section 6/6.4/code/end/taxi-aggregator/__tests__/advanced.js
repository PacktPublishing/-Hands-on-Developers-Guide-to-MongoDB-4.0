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

  test("geoNear", async () => {
    const SFCoordinates = [-122.4223791, 37.7679638];
    const NYCoordinates = [-73.9758597, 40.7830649];
    const ClientNearbyNYCoordinates = [-73.9795183, 40.784056];

    let taxi = new Taxi();
    taxi.brand = "Toyota";
    taxi.model = "Yaris";
    taxi.year = 2015;
    taxi.owner = { name: "Driver 1", experience: 15 };
    taxi.geometry = { coordinates: SFCoordinates };
    taxi = await taxi.save();

    let taxi2 = new Taxi();
    taxi2.brand = "Benz";
    taxi2.model = "Class E";
    taxi2.year = 2017;
    taxi2.owner = { name: "Driver 2", experience: 7 };
    taxi2.geometry = { coordinates: NYCoordinates };
    taxi2 = await taxi2.save();

    const taxisNearbyOneKm = await Taxi.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: ClientNearbyNYCoordinates },
          spherical: true,
          maxDistance: 1 * 1000,
          distanceField: "dist.calculated"
        }
      }
    ]);

    expect(taxisNearbyOneKm[0].owner.name).toBe("Driver 2");

    const taxisNearbyQuarterKm = await Taxi.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: ClientNearbyNYCoordinates },
          spherical: true,
          maxDistance: 0.25 * 1000,
          distanceField: "dist.calculated"
        }
      }
    ]);
    expect(taxisNearbyQuarterKm.length).toBe(0);

    const taxisNearbyThousandsKm = await Taxi.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: ClientNearbyNYCoordinates },
          spherical: true,
          maxDistance: 5000 * 1000,
          distanceField: "dist.calculated"
        }
      }
    ]);

    expect(taxisNearbyThousandsKm.length).toBe(2);
  });
});
