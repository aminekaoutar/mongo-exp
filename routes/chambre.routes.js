const express = require("express");
const router = express.Router();
const Chambre = require("../models/Chambre");

// CREATE - Add a new room
router.post("/", async (req, res) => {
  try {
    const { numero, type, capacite, prixParNuit, equipements, disponible } = req.body;

    // Validate required fields
    if (!numero || !type || capacite == null || prixParNuit == null) {
      return res.status(400).json({
        message: "Les champs requis sont: numero, type, capacite, prixParNuit"
      });
    }

    // Create new room
    const nouvelleChambre = new Chambre({
      numero,
      type,
      capacite,
      prixParNuit,
      equipements: Array.isArray(equipements) ? equipements : (typeof equipements === 'string' ? equipements.split(',') : []),
      disponible: disponible !== undefined ? disponible : true
    });

    const savedRoom = await nouvelleChambre.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Le numéro de chambre existe déjà" });
    }
    res.status(400).json({ message: error.message });
  }
});

// READ ALL - Get all rooms
router.get("/", async (req, res) => {
  try {
    const chambres = await Chambre.find().sort({ createdAt: -1 });
    res.json(chambres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ ONE - Get a specific room
router.get("/:id", async (req, res) => {
  try {
    const chambre = await Chambre.findById(req.params.id);
    if (!chambre) {
      return res.status(404).json({ message: "Chambre introuvable" });
    }
    res.json(chambre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE - Update a room
router.put("/:id", async (req, res) => {
  try {
    const { numero, type, capacite, prixParNuit, equipements, disponible } = req.body;

    const updatedRoom = await Chambre.findByIdAndUpdate(
      req.params.id,
      { 
        numero, 
        type, 
        capacite, 
        prixParNuit, 
        equipements: Array.isArray(equipements) ? equipements : (typeof equipements === 'string' ? equipements.split(',') : []),
        disponible 
      },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Chambre introuvable" });
    }

    res.json(updatedRoom);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Le numéro de chambre existe déjà" });
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Remove a room
router.delete("/:id", async (req, res) => {
  try {
    const deletedRoom = await Chambre.findByIdAndDelete(req.params.id);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Chambre introuvable" });
    }

    res.json({ 
      message: "Chambre supprimée avec succès", 
      deletedRoom 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;