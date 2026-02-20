const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    adresse: {
      rue: String,
      ville: String,
      codePostal: String,
      pays: String,
    },
    telephone: String,
    email: String,
    nombreEtoiles: {
      type: Number,
      min: 1,
      max: 5,
    },
    description: String,
    services: { type: [String], default: [] },
  },
  { timestamps: true }
);

// On force la collection "hotels"
module.exports = mongoose.model("Hotel", hotelSchema, "hotels");
