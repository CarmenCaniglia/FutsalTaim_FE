import { useEffect, useState } from "react";
import API from "../api";
import dayjs from "dayjs";
import "dayjs/locale/it";
import utc from "dayjs/plugin/utc";

dayjs.locale("it");
dayjs.extend(utc);

function Partite() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [gender, setGender] = useState("maschile"); // filtro
  const [filter, setFilter] = useState("tutte");
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
  }, [gender]);

  useEffect(() => {
    let filtered = [...matches];
    if (filter === "giocate") {
      filtered = filtered.filter(
        (m) => m.goalsTeamA != null && m.goalsTeamB != null
      );
    } else if (filter === "daGiocare") {
      filtered = filtered.filter(
        (m) => m.goalsTeamA == null && m.goalsTeamB == null
      );
    }
    setFilteredMatches(filtered);
  }, [matches, filter]);

  return (
    <div className="container px-0">
      <h2 className="mb-4 text-center">Elenco Partite</h2>

      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap">
        {/* Categoria (a sinistra) */}
        <div className="d-flex align-items-center gap-2">
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

        {/* Filtra (a destra) */}
        <div className="d-flex align-items-center gap-2">
          <label className="form-label mb-0">Filtra:</label>
          <select
            className="minimal-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="tutte">Tutte</option>
            <option value="giocate">Giocate</option>
            <option value="daGiocare">Da giocare</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              Attendi il caricamento delle partite...
            </span>
          </div>
        </div>
      ) : filteredMatches.length === 0 ? (
        <p>Nessuna partita disponibile.</p>
      ) : (
        <ul className="list-group striped-list">
          {[...filteredMatches]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((match) => (
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
                    {dayjs.utc(match.date).format("DD/MM/YY - HH:mm")}
                    {match.stage === "girone" && match.group
                      ? ` - Girone ${match.group}`
                      : match.stage !== "girone"
                      ? ` - ${
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
