import { useEffect, useState } from "react";
import API from "../api";
import GironeTable from "../components/GironeTable";

function Classifiche() {
  const [standings, setStandings] = useState([]);
  const [gender, setGender] = useState("maschile"); // Stato per il filtro
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/standings?gender=${gender}`);
        setStandings(res.data);
      } catch (err) {
        console.error("Errore nel recupero classifiche:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [gender]); // Ricarica ogni volta che cambia il filtro

  return (
    <div className="container">
      <h2 className="mb-4 text-center">Classifiche Gironi</h2>

      <div className="mb-4 d-flex align-items-center gap-2">
        <label className="form-label mb-0">Categoria:</label>
        <select
          className="minimal-select"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="maschile">Maschile</option>
          <option value="femminile">Femminile</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              Attendi il caricamento delle classifiche...
            </span>
          </div>
        </div>
      ) : standings.length === 0 ? (
        <p>Nessuna classifica disponibile.</p>
      ) : (
        standings.map((group) => (
          <GironeTable
            key={`${group.gender}-${group.group}`}
            group={group.group}
            gender={group.gender}
            standings={group.standings}
          />
        ))
      )}
    </div>
  );
}

export default Classifiche;
