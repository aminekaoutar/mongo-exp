const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const Chambre = require("../models/Chambre");
const Utilisateur = require("../models/Utilisateur");

// CREATE : Ajouter une réservation
router.post("/", async (req, res, next) => {
  try {
    const { utilisateur_id, utilisateur_nom, chambre_id, date_arrivee, date_depart, nombre_personnes } = req.body;

    // Check if required fields are provided
    if (!chambre_id || !date_arrivee || !date_depart || !nombre_personnes) {
      return res.status(400).json({ message: "Champs requis manquants: chambre_id, date_arrivee, date_depart, nombre_personnes" });
    }

    // Check if room exists and is available
    const chambre = await Chambre.findById(chambre_id);
    if (!chambre) return res.status(404).json({ message: "Chambre introuvable" });
    if (!chambre.disponible) return res.status(400).json({ message: "Chambre non disponible" });

    // Handle utilisateur - either use utilisateur_id if provided or create temporary reference
    let utilisateurId = utilisateur_id;
    let utilisateurRef = null;
    
    if (utilisateur_id) {
      // If utilisateur_id is provided, verify it exists
      const utilisateur = await Utilisateur.findById(utilisateur_id);
      if (!utilisateur) return res.status(404).json({ message: "Utilisateur introuvable" });
      utilisateurRef = utilisateur._id;
    } else if (utilisateur_nom) {
      // If utilisateur_nom is provided, we'll store it as a reference
      // In a real application, you would create a user record
      utilisateurRef = null; // Will be null for temporary reservations
    } else {
      return res.status(400).json({ message: "Utilisateur requis: fournissez utilisateur_id ou utilisateur_nom" });
    }

    // Create the reservation
    const reservation = await Reservation.create({
      utilisateur_id: utilisateurRef, // Could be null for temporary reservations
      utilisateur_nom: utilisateur_nom, // Store the name for identification
      chambre_id,
      date_arrivee: new Date(date_arrivee),
      date_depart: new Date(date_depart),
      nombre_personnes,
      statut: "confirmée",
      date_reservation: new Date(),
      prix_total: chambre.prixParNuit * (nombre_personnes > 0 ? nombre_personnes : 1), // calculation based on persons
    });

    // Mark the room as unavailable
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

    // Make the room available again
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