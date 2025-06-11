import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

// IMPORTA I LOGHI
import kjgem from "../assets/loghi/k-jgem.png";
import mattador from "../assets/loghi/le_mattador.png";
import birrao from "../assets/loghi/atletico_birrao.png";
import spazzala from "../assets/loghi/fc_spazzala.png";
import atletiche from "../assets/loghi/atletiche_con_inganno.png";
import colombia from "../assets/loghi/colombia.png";
import spina from "../assets/loghi/football_spina.png";
import stressate from "../assets/loghi/le_stressate.png";
import maiella from "../assets/loghi/maiella.png";

// MAPPATURA NOME -> LOGO
const logoMap = {
  kjgem: kjgem,
  lemattador: mattador,
  atleticobirrao: birrao,
  fcspazzala: spazzala,
  testlogo: spazzala,
  colombia20: colombia,
  footballspina: spina,
  lestressate: stressate,
  maiella: maiella,
  atleticheconinganno: atletiche,
  gliantipatici: spazzala,
  maschiletest: mattador,
};

function TeamDetail() {
  const { id } = useParams(); // ID della squadra passato dal routing
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);

        const teamUrl = `/teams/${id}`;
        const teamRes = await API.get(teamUrl);

        setTeam(teamRes.data);
        setPlayers(teamRes.data.players); // I giocatori sono già inclusi nella squadra
      } catch (err) {
        console.error("❌ Errore nel caricamento squadra:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

  if (!team) return <p>Squadra non trovata</p>;

  const normalizeName = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "")
      .trim();

  // Normalizza nome per cercarlo in logoMap

  const normalizedName = normalizeName(team.name);

  const logoSrc = logoMap[normalizedName];

  return (
    <div className="container">
      <h2 className="mb-3">{team.name}</h2>

      {logoSrc ? (
        <img
          src={logoSrc}
          alt={`${team.name} logo`}
          className="mb-4"
          style={{ maxWidth: "200px" }}
        />
      ) : (
        <p>
          <i>Nessun logo disponibile</i>
        </p>
      )}

      <h4>Giocatori:</h4>
      {players.length === 0 ? (
        <p>Nessun giocatore registrato</p>
      ) : (
        <ul className="list-group">
          {players.map((player) => (
            <li className="list-group-item" key={player._id}>
              {player.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TeamDetail;
