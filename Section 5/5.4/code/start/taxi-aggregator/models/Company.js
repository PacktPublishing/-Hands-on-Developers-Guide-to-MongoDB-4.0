const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: { type: String, required: true },
  taxies: [{ type: Schema.Types.ObjectId, ref: "taxi" }]
});

//post save middleware
CompanySchema.post("save", doc => {
  //throw error if name equals 'throw error name'
  if (doc.name === "throw error name") throw new Error("New Test Error");
});

module.exports = mongoose.model("company", CompanySchema);
