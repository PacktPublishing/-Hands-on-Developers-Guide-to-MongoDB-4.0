const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: { type: String, required: true },
  taxies: [{ type: Schema.Types.ObjectId, ref: "taxi" }]
});

module.exports = mongoose.model("company", CompanySchema);
