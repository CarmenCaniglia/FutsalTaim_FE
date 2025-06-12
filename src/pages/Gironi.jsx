import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

function Gironi() {
  const [teams, setTeams] = useState([]);
  const [gender, setGender] = useState("maschile"); // stato per il filtro
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await API.get("/teams");
        setTeams(res.data);
      } catch (err) {
        console.error("Errore nel recupero squadre:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const groupByGroup = () => {
    const filtered = teams.filter((t) => t.gender === gender);
    const grouped = {};

    filtered.forEach((team) => {
      if (!grouped[team.group]) grouped[team.group] = [];
      grouped[team.group].push(team);
    });

    return grouped;
  };

  const groupedTeams = groupByGroup();

  return (
    <div className="container">
      <h2 className="mb-4 text-center">
        Squadre {gender === "maschile" ? "Maschili" : "Femminili"}
      </h2>

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
              Attendi il caricamento delle squadre...
            </span>
          </div>
        </div>
      ) : (
        Object.entries(groupedTeams).map(([group, teams]) => (
          <div key={group} className="mb-3">
            <h3>Girone {group}</h3>
            <ul className="list-group striped-list">
              {teams.map((team) => {
                return (
                  <li className="list-group-item striped-list" key={team._id}>
                    <Link to={`/teams/${team._id}`}>{team.name}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default Gironi;
