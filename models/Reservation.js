const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    utilisateur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: false }, // Lien vers Utilisateur (optionnel)
    utilisateur_nom: { type: String, required: false }, // Nom du client pour les réservations temporaires
    chambre_id: { type: mongoose.Schema.Types.ObjectId, ref: "Chambre", required: true },
    date_arrivee: { type: Date, required: true },
    date_depart: { type: Date, required: true },
    nombre_personnes: { type: Number, required: true },
    statut: { type: String, enum: ["en_attente", "confirmée", "annulée"], default: "en_attente" },
    date_reservation: { type: Date, default: Date.now },
    prix_total: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema, "reservations");