const mongoose = require("mongoose");

const chambreSchema = new mongoose.Schema(
  {
    numero: { type: String, required: true },
    type: { type: String, required: true },
    capacite: { type: Number, required: true },
    prixParNuit: { type: Number, required: true },
    equipements: { type: [String], default: [] },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chambre", chambreSchema, "chambres");
