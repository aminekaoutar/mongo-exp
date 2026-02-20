import React, { useState } from "react";

function Search({ chambres, setFiltered }) {
  const [capacite, setCapacite] = useState("");
  const [prix, setPrix] = useState("");

  const handleSearch = () => {
    let resultats = chambres.filter(ch => ch.disponible);

    if (capacite) resultats = resultats.filter(ch => ch.capacite >= Number(capacite));
    if (prix) resultats = resultats.filter(ch => ch.prixParNuit <= Number(prix));

    setFiltered(resultats);
  };

  return (
    <div className="search-section">
      <input
        type="number"
        placeholder="Nombre de personnes"
        value={capacite}
        onChange={e => setCapacite(e.target.value)}
      />
      <input
        type="number"
        placeholder="Prix max"
        value={prix}
        onChange={e => setPrix(e.target.value)}
      />
      <button onClick={handleSearch}>Rechercher</button>
    </div>
  );
}

export default Search;