const express = require("express");
const router = express.Router();

// --- "Base de données" temporaire en mémoire ---
let chambres = [];
let idCounter = 1;

/**
 * POST /api/chambres
 * Créer une chambre (produit)
 */
router.post("/", (req, res) => {
  const { numero, type, capacite, prixParNuit, equipements, disponible } = req.body || {};

  // Validation minimale
  if (!numero || !type || capacite == null || prixParNuit == null) {
    return res.status(400).json({
      message: "Champs requis: numero, type, capacite, prixParNuit",
    });
  }

  const nouvelleChambre = {
    _id: String(idCounter++),
    numero,
    type,
    capacite,
    prixParNuit,
    equipements: Array.isArray(equipements) ? equipements : [],
    disponible: disponible ?? true,
    createdAt: new Date(),
  };

  chambres.push(nouvelleChambre);
  return res.status(201).json(nouvelleChambre);
});

/**
 * GET /api/chambres
 * Récupérer toutes les chambres
 */
router.get("/", (req, res) => {
  return res.json(chambres);
});

/**
 * GET /api/chambres/:id
 * Récupérer une chambre par ID
 */
router.get("/:id", (req, res) => {
  const chambre = chambres.find((c) => c._id === req.params.id);
  if (!chambre) return res.status(404).json({ message: "Chambre introuvable" });
  return res.json(chambre);
});

/**
 * PUT /api/chambres/:id
 * Modifier une chambre
 */
router.put("/:id", (req, res) => {
  const index = chambres.findIndex((c) => c._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Chambre introuvable" });


   // Protection: si le body est vide, on refuse la requête
   if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Body vide: rien à modifier" });
  }

  // On fusionne l'ancien objet avec les champs envoyés
  chambres[index] = { ...chambres[index], ...req.body, updatedAt: new Date() };
  return res.json(chambres[index]);
});

/**
 * DELETE /api/chambres/:id
 * Supprimer une chambre
 */
router.delete("/:id", (req, res) => {
  const index = chambres.findIndex((c) => c._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Chambre introuvable" });

  const deleted = chambres.splice(index, 1)[0];
  return res.json({ message: "Supprimée ✅", deleted });
});

module.exports = router;
