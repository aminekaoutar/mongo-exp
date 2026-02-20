const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const Chambre = require("../models/Chambre");
const Utilisateur = require("../models/Utilisateur");

// CREATE : Ajouter une réservation
router.post("/", async (req, res, next) => {
  try {
    const { utilisateur_id, chambre_id, date_arrivee, date_depart, nombre_personnes } = req.body;

    if (!utilisateur_id || !chambre_id || !date_arrivee || !date_depart || !nombre_personnes) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    // Vérifier si l'utilisateur existe
    const utilisateur = await Utilisateur.findById(utilisateur_id);
    if (!utilisateur) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Vérifier si la chambre existe et est disponible
    const chambre = await Chambre.findById(chambre_id);
    if (!chambre) return res.status(404).json({ message: "Chambre introuvable" });
    if (!chambre.disponible) return res.status(400).json({ message: "Chambre non disponible" });

    // Créer la réservation
    const reservation = await Reservation.create({
      utilisateur_id,
      chambre_id,
      date_arrivee: new Date(date_arrivee),
      date_depart: new Date(date_depart),
      nombre_personnes,
      statut: "confirmée",
      date_reservation: new Date(),
      prix_total: chambre.prixParNuit * nombre_personnes, // simple calcul
    });

    // Optionnel : marquer la chambre comme non disponible
    chambre.disponible = false;
    await chambre.save();

    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
});

// READ ALL : toutes les réservations
router.get("/", async (req, res, next) => {
  try {
    const reservations = await Reservation.find()
      .populate("utilisateur_id", "nom prenom email")
      .populate("chambre_id", "numero type prixParNuit");
    res.json(reservations);
  } catch (err) {
    next(err);
  }
});

// READ ONE : une réservation
router.get("/:id", async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("utilisateur_id", "nom prenom email")
      .populate("chambre_id", "numero type prixParNuit");
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });
    res.json(reservation);
  } catch (err) {
    next(err);
  }
});

// UPDATE : modifier une réservation
router.put("/:id", async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });
    res.json(reservation);
  } catch (err) {
    next(err);
  }
});

// DELETE : annuler une réservation
router.delete("/:id", async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });

    // Optionnel : remettre la chambre disponible
    const chambre = await Chambre.findById(reservation.chambre_id);
    if (chambre) {
      chambre.disponible = true;
      await chambre.save();
    }

    res.json({ message: "Réservation annulée ✅", deleted: reservation });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
