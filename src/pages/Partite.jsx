import { useEffect, useState } from "react";
import API from "../api";
import dayjs from "dayjs";
import "dayjs/locale/it";

dayjs.locale("it");

function Partite() {
  const [matches, setMatches] = useState([]);
  const [gender, setGender] = useState("maschile"); // filtro
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/matches?gender=${gender}`);
        setMatches(res.data);
      } catch (err) {
        console.error("Errore nel recupero partite:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [gender]); // aggiorna su cambio filtro

  return (
    <div className="container px-0">
      <h2 className="mb-4 text-center">Elenco Partite</h2>

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
              Attendi il caricamento delle partite...
            </span>
          </div>
        </div>
      ) : matches.length === 0 ? (
        <p>Nessuna partita disponibile.</p>
      ) : (
        <ul className="list-group striped-list">
          {matches.map((match) => (
            <li className="list-group-item" key={match._id}>
              <div>
                <strong>{match.teamA?.name}</strong> vs{" "}
                <strong>{match.teamB?.name}</strong>
              </div>

              <div
                className="d-flex justify-content-between align-items-center"
                style={{ fontSize: "0.9em" }}
              >
                <div className="text-muted">
                  {dayjs(match.date).format("DD/MM/YY - HH:mm ")}

                  {match.stage === "girone" && match.group
                    ? `- Girone ${match.group}`
                    : match.stage !== "girone"
                    ? `- ${
                        match.stage.charAt(0).toUpperCase() +
                        match.stage.slice(1)
                      }`
                    : ""}
                </div>
                <div>
                  {match.goalsTeamA != null && match.goalsTeamB != null ? (
                    <span className="fw-bold">
                      {match.goalsTeamA} - {match.goalsTeamB}
                    </span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Partite;
