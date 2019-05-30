const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model("company", CompanySchema);
