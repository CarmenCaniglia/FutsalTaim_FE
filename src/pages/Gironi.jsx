import { useEffect, useState } from 'react';
import API from '../api';

function Gironi() {
  const [teams, setTeams] = useState([]);
  const [gender, setGender] = useState('maschile'); // stato per il filtro

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await API.get('/teams');
        setTeams(res.data);
      } catch (err) {
        console.error('Errore nel recupero squadre:', err);
      }
    };

    fetchTeams();
  }, []);

  const groupByGroup = () => {
    const filtered = teams.filter(t => t.gender === gender);
    const grouped = {};

    filtered.forEach(team => {
      if (!grouped[team.group]) grouped[team.group] = [];
      grouped[team.group].push(team);
    });

    return grouped;
  };

  const groupedTeams = groupByGroup();

  return (
    <div className="container">
      <h2 className="mb-4 text-center">Squadre {gender === 'maschile' ? 'Maschili' : 'Femminili'}</h2>

      
<div className="mb-4 d-flex align-items-center gap-2">
<label className="form-label mb-0">Categoria:</label>
  <select
    className="minimal-select"
    value={gender}
    onChange={(e) => setGender(e.target.value)}>
    <option value="maschile">Maschile</option>
    <option value="femminile">Femminile</option>
  </select>
</div>

      {Object.entries(groupedTeams).map(([group, teams]) => (
        <div key={group} className="mb-3">
          <h4>Girone {group}</h4>
          <ul className="list-group striped-list">
            {teams.map(team => (
              <li className="list-group-item" key={team._id}>
                {team.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Gironi;
