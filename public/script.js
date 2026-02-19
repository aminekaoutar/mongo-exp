const API_URL = "/api/chambres";

// Ajouter une chambre
async function ajouterChambre() {
  const numero = document.getElementById("numero").value;
  const type = document.getElementById("type").value;
  const capacite = Number(document.getElementById("capacite").value);
  const prixParNuit = Number(document.getElementById("prixParNuit").value);
  const equipements = document.getElementById("equipements").value
                        .split(",").map(e => e.trim());

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero, type, capacite, prixParNuit, equipements })
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Erreur: " + err.message);
      return;
    }

    alert("Chambre ajoutée ✅");
    chargerChambres();
  } catch (err) {
    alert("Erreur fetch: " + err.message);
  }
}

// Afficher toutes les chambres
async function chargerChambres() {
  const container = document.getElementById("listeChambres");
  container.innerHTML = "";

  try {
    const res = await fetch(API_URL);
    const chambres = await res.json();

    chambres.forEach(ch => {
      const div = document.createElement("div");
      div.className = "chambre";
      div.innerHTML = `
        <strong>${ch.numero}</strong> - ${ch.type} - ${ch.capacite} pers - ${ch.prixParNuit}€
        <span class="delete-btn" onclick="supprimerChambre('${ch._id}')">[Supprimer]</span>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "Erreur chargement chambres";
  }
}

// Supprimer une chambre
async function supprimerChambre(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    chargerChambres();
  } catch (err) {
    console.error(err);
  }
}

// Charger les chambres au démarrage
window.onload = chargerChambres;
