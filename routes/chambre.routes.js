const express = require("express");
const router = express.Router();
const Chambre = require("../models/Chambre");

// CREATE
router.post("/", async (req, res, next) => {
  try {
    const { numero, type, capacite, prixParNuit, equipements, disponible } = req.body || {};

    if (!numero || !type || capacite == null || prixParNuit == null) {
      return res.status(400).json({
        message: "Champs requis: numero, type, capacite, prixParNuit",
      });
    }

    const nouvelleChambre = await Chambre.create({
      numero,
      type,
      capacite,
      prixParNuit,
      equipements: Array.isArray(equipements) ? equipements : [],
      disponible: disponible ?? true,
    });

    return res.status(201).json(nouvelleChambre);
  } catch (err) {
    return next(err);
  }
});

// READ ALL
router.get("/", async (req, res, next) => {
  try {
    const chambres = await Chambre.find().sort({ createdAt: -1 });
    return res.json(chambres);
  } catch (err) {
    return next(err);
  }
});

// READ ONE
router.get("/:id", async (req, res, next) => {
  try {
    const chambre = await Chambre.findById(req.params.id);
    if (!chambre) return res.status(404).json({ message: "Chambre introuvable" });
    return res.json(chambre);
  } catch (err) {
    return next(err);
  }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Body vide: rien à modifier" });
    }

    const chambre = await Chambre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!chambre) return res.status(404).json({ message: "Chambre introuvable" });
    return res.json(chambre);
  } catch (err) {
    return next(err);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const chambre = await Chambre.findByIdAndDelete(req.params.id);
    if (!chambre) return res.status(404).json({ message: "Chambre introuvable" });

    return res.json({ message: "Supprimée ✅", deleted: chambre });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
