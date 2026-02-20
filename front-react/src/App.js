import React, { useState, useEffect } from "react";
import Chambres from "./components/Chambres";
import Search from "./components/Search";
import "./App.css";

function App() {
  const [chambres, setChambres] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // Charger les chambres depuis le backend
  useEffect(() => {
    fetch("/api/chambres")
      .then(res => res.json())
      .then(data => {
        setChambres(data);
        setFiltered(data.filter(ch => ch.disponible));
      })
      .catch(err => console.error("Erreur fetch:", err));
  }, []);

  return (
    <div className="App">
      <header>
        <h1>🏨 Hotel Ipssi</h1>
        <p>Trouvez et réservez votre chambre idéale</p>
      </header>

      <Search chambres={chambres} setFiltered={setFiltered} />

      <Chambres chambres={filtered} setChambres={setChambres} />
    </div>
  );
}

export default App;