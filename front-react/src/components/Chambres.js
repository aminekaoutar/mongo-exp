import React, { useState } from "react";

function Chambres({ chambres, setChambres }) {
  const [clientNom, setClientNom] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const reserver = async (id) => {
    if (!clientNom) {
      alert("Entrez votre nom avant de réserver !");
      return;
    }
    try {
      await fetch(`/api/chambres/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disponible: false }),
      });

      alert("Réservation confirmée 🎉");

      // Mettre à jour l'état local pour refléter la réservation
      setChambres(prev => prev.map(ch => ch._id === id ? { ...ch, disponible: false } : ch));
      setSelectedId("");
      setClientNom("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chambres-container">
      <input
        type="text"
        placeholder="Votre nom"
        value={clientNom}
        onChange={e => setClientNom(e.target.value)}
      />
      {chambres.map(ch => (
        <div key={ch._id} className="card">
          <h3>Chambre {ch.numero}</h3>
          <p>Type: {ch.type}</p>
          <p>Capacité: {ch.capacite} personnes</p>
          <p className="price">{ch.prixParNuit} € / nuit</p>
          <button onClick={() => reserver(ch._id)}>Réserver</button>
        </div>
      ))}
    </div>
  );
}

export default Chambres;