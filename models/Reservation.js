const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  utilisateur_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'utilisateurs',
    required: true
  },
  chambre_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chambres',
    required: true
  },
  date_arrivee: {
    type: Date,
    required: true
  },
  date_depart: {
    type: Date,
    required: true
  },
  nombre_personnes: {
    type: Number,
    required: true
  },
  statut: {
    type: String,
    default: "en attente"
  },
  prix_total: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('reservations', reservationSchema);
