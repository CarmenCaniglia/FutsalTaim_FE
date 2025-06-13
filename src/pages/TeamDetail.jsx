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
import gliantipatici from "../assets/loghi/gli_antipatici.png";

// MAPPATURA NOME -> LOGO
const logoMap = {
  kjgem: kjgem,
  lemattador: mattador,
  atleticobirrao: birrao,
  fcspazzala: spazzala,
  colombia20: colombia,
  footballspina: spina,
  lestressate: stressate,
  maiella: maiella,
  atletiche: atletiche,
  gliantipatici: gliantipatici,
};

function TeamDetail() {
  const { id } = useParams(); // ID della squadra passato dal routing
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamAndPlayers = async () => {
      try {
        setLoading(true);

        // Recupera la squadra
        const teamRes = await API.get(`/teams/${id}`);
        setTeam(teamRes.data);

        // Recupera tutti i giocatori
        const allPlayersRes = await API.get("/players");

        // Filtra quelli associati a questa squadra
        const filteredPlayers = allPlayersRes.data.filter(
          (p) => p.team?._id === id
        );

        setPlayers(filteredPlayers);
      } catch (err) {
        console.error("Errore nel caricamento squadra o giocatori:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamAndPlayers();
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
    <div className="container text-center">
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={`${team.name} logo`}
          className="mb-5  kenburns-top-alternate-reverse"
          style={{ maxWidth: "250px" }}
        />
      ) : (
        <p>
          <i>Nessun logo disponibile</i>
        </p>
      )}

      {players.length === 0 ? (
        <p>Nessun giocatore registrato</p>
      ) : (
        <ul className="player-list">
          {players.map((player) => (
            <li className="player-list-item" key={player._id}>
              {player.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TeamDetail;
