const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
  name: { type: String, required: true },
  experience: { type: Number, required: true }
});

const TaxiSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  owner: OwnerSchema
});

module.exports = mongoose.model("taxi", TaxiSchema);
