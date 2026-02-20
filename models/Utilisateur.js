const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String },
    mot_de_passe: { type: String, required: true },
    date_creation: { type: Date, default: Date.now },
    derniere_connexion: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Utilisateur", utilisateurSchema, "utilisateurs");
