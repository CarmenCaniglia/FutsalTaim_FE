import { useEffect, useState } from "react";
import API from "../api";

function Marcatori() {
  const [players, setPlayers] = useState([]);
  const [gender, setGender] = useState("maschile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopScorers = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/players/topscorers?gender=${gender}`);
        setPlayers(res.data);
      } catch (err) {
        console.error("Errore nel recupero marcatori:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopScorers();
  }, [gender]);

  return (
    <div className="container">
      <h2 className="mb-4 text-center">Classifica Marcatori</h2>

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
              Attendi il caricamento dei marcatori...
            </span>
          </div>
        </div>
      ) : players.length === 0 ? (
        <p>Nessun marcatore disponibile.</p>
      ) : (
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <table className="table table-bordered table-striped rounded-table mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Giocatore</th>
                <th>Squadra</th>
                <th>Gol</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player._id}>
                  <td>{index + 1}</td>
                  <td
                    style={{
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={player.name}
                  >
                    {player.name}
                  </td>
                  <td
                    style={{
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={player.team?.name || "N/A"}
                  >
                    {player.team?.name || "N/A"}
                  </td>
                  <td>{player.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Marcatori;
