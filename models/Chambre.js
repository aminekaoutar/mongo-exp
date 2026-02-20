const mongoose = require("mongoose");

const chambreSchema = new mongoose.Schema(
  {
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true }, // Lien vers Hotel
    numero: { type: String, required: true },
    type: { type: String, required: true },
    capacite: { type: Number, required: true },
    prixParNuit: { type: Number, required: true },
    equipements: { type: [String], default: [] },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// On force la collection "chambres"
module.exports = mongoose.model("Chambre", chambreSchema, "chambres");
