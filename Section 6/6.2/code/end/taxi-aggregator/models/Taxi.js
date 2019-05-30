const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
  name: { type: String, required: true },
  experience: { type: Number, required: true }
});

const TaxiSchema = new Schema({
  brand: { type: String, required: [true, "Brand is required 123"] },
  model: { type: String, required: true },
  year: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid year!`
    }
  },
  owner: OwnerSchema
});

module.exports = mongoose.model("taxi", TaxiSchema);
