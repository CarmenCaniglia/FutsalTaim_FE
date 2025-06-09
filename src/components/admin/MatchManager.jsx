import { useEffect, useState } from 'react';
import API from '../../api';

function MatchManager() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    gender: '',
    group: '',
    stage: 'girone',
    teamA: '',
    teamB: '',
    goalsTeamA: 0,
    goalsTeamB: 0,
    goalScorers: [],
  });
  const [editingMatchId, setEditingMatchId] = useState(null);

  useEffect(() => {
    fetchMatches();
    fetchTeams();
    fetchPlayers();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await API.get('/matches');
      setMatches(res.data);
    } catch (err) {
      console.error("Errore nel fetch delle partite:", err.response?.data || err.message);
      alert("Errore nel caricamento delle partite. Controlla la console.");
    }
  };

  const fetchTeams = async () => {
    const res = await API.get('/teams');
    setTeams(res.data);
  };

  const fetchPlayers = async () => {
    const res = await API.get('/players');
    setPlayers(res.data);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddScorer = () => {
    setFormData(prev => ({
      ...prev,
      goalScorers: [...prev.goalScorers, { player: '', goals: 1 }],
    }));
  };

  const handleScorerChange = (index, field, value) => {
    const updatedScorers = [...formData.goalScorers];
    updatedScorers[index][field] = field === 'goals' ? Number(value) : value;
    setFormData(prev => ({ ...prev, goalScorers: updatedScorers }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const isKnockout = ['semifinale', 'finale'].includes(formData.stage);
  const endpoint = editingMatchId
    ? `/matches/${editingMatchId}` // Supponiamo che si modifichino tutti da qui
    : isKnockout
      ? '/matches/knockout'
      : '/matches';

  // Pulisci i dati da inviare
  const payload = {
    ...formData,
    group: formData.stage === 'girone' ? formData.group : undefined,
    goalScorers: formData.goalScorers?.length > 0 ? formData.goalScorers : undefined,
  };

  // Rimuovi i campi inutili per i knockout (se presenti)
  if (isKnockout && !editingMatchId) {
    delete payload.group;
    delete payload.goalsTeamA;
    delete payload.goalsTeamB;
  }

  console.log('Submitting match data:', payload); // 🔍 Debug

  try {
    if (editingMatchId) {
      await API.put(endpoint, payload);
    } else {
      await API.post(endpoint, payload);
    }

    // Reset del form
    setFormData({
      date: '',
      gender: '',
      group: '',
      stage: 'girone',
      teamA: '',
      teamB: '',
      goalsTeamA: 0,
      goalsTeamB: 0,
      goalScorers: [],
    });

    setEditingMatchId(null);
    fetchMatches();
  } catch (err) {
    console.error(`Errore POST ${endpoint}:`, err.response?.data || err.message);
    alert('Errore nel salvataggio della partita');
  }
};



  const handleDelete = async (id) => {
    
    if (window.confirm('Vuoi eliminare questa partita?')) {
      await API.delete(`/matches/${id}`);
      fetchMatches();
    }
  };

  const handleEdit = (match) => {
    setFormData({
  date: match.date ? new Date(match.date).toISOString().slice(0, 16) : '',
  gender: match.gender || '',
  group: match.group || '',
  stage: match.stage || 'girone',
  teamA: match.teamA?._id || '',
  teamB: match.teamB?._id || '',
  goalsTeamA: match.goalsTeamA ?? 0,
  goalsTeamB: match.goalsTeamB ?? 0,
  goalScorers: Array.isArray(match.goalScorers)
    ? match.goalScorers.map(gs => ({
        player: gs.player?._id || gs.player || '',
        goals: gs.goals ?? 1
      }))
    : [],
});
    setEditingMatchId(match._id);
  };

  const filteredMatches = matches.filter(m =>
    m.teamA?.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.teamB?.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.stage?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h4>Gestione Partite</h4>

      <form onSubmit={handleSubmit} className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2 mt-3 mb-4">
        <div className="col">
          <input
            type="datetime-local"
            name="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col">
          <select name="gender" className="form-select" value={formData.gender} onChange={handleChange} required>
            <option value="">Genere</option>
            <option value="maschile">Maschile</option>
            <option value="femminile">Femminile</option>
          </select>
        </div>

        <div className="col">
          <select name="stage" className="form-select" value={formData.stage} onChange={handleChange} required>
            <option value="girone">Girone</option>
            <option value="semifinale">Semifinale</option>
            <option value="finale">Finale</option>
          </select>
        </div>

        <div className="col">
          <input
            type="text"
            name="group"
            className="form-control"
            placeholder="Girone"
            value={formData.group}
            onChange={handleChange}
            disabled={formData.stage !== 'girone'}
            required={formData.stage === 'girone'}
          />
        </div>

        <div className="col">
  <div className="input-group">
    <select name="teamA" className="form-select" value={formData.teamA} onChange={handleChange} required>
      <option value="">Squadra A</option>
      {teams.map(team => (
        <option key={team._id} value={team._id}>{team.name}</option>
      ))}
    </select>
    <input
      type="number"
      name="goalsTeamA"
      className="form-control"
      placeholder="Gol A"
      value={formData.goalsTeamA}
      onChange={handleChange}
    />
  </div>
</div>

<div className="col">
  <div className="input-group">
    <select name="teamB" className="form-select" value={formData.teamB} onChange={handleChange} required>
      <option value="">Squadra B</option>
      {teams.map(team => (
        <option key={team._id} value={team._id}>{team.name}</option>
      ))}
    </select>
    <input
      type="number"
      name="goalsTeamB"
      className="form-control"
      placeholder="Gol B"
      value={formData.goalsTeamB}
      onChange={handleChange}
    />
  </div>
</div>

         <div className="col-12 d-flex justify-content-end align-items-center gap-2 mt-2">
    <button type="button" className="btn btn-outline-secondary" onClick={handleAddScorer}>
      <i className="bi bi-person-fill-add"></i>
    </button>
    <button type="submit" className="btn btn-primary">
      {editingMatchId ? <i className="bi bi-floppy"></i> : <i className="bi bi-plus-circle"></i>}
    </button>
  </div>
      </form>

      {formData.goalScorers.map((scorer, index) => (
  <div className="row align-items-center g-2 mb-1" key={index}>
    <div className="col-9 col-sm-10">
      <select
        className="form-select"
        value={scorer.player}
        onChange={(e) => handleScorerChange(index, 'player', e.target.value)}
      >
        <option value="">Seleziona giocatore</option>
        {players.map(player => (
          <option key={player._id} value={player._id}>
            {player.name} ({player.team?.name})
          </option>
        ))}
      </select>
    </div>
    <div className="col-3 col-sm-2">
      <input
        type="number"
        min="1"
        className="form-control"
        placeholder="Goal"
        value={scorer.goals}
        onChange={(e) => handleScorerChange(index, 'goals', e.target.value)}
      />
    </div>
  </div>
))}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filtra per squadra o fase..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h5>Partite Inserite</h5>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <table className="table table-bordered mt-3 rounded-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Squadre</th>
            <th>Risultato</th>
            <th>Tipo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {filteredMatches.map(match => (
            <tr key={match._id}>
              <td>{new Date(match.date).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
              <td>{match.teamA?.name} vs {match.teamB?.name}</td>
              <td>{match.goalsTeamA} - {match.goalsTeamB}</td>
              <td><span className="badge bg-info text-dark">{match.stage ? match.stage : 'girone'}</span></td>
              <td className="table-actions">
  <div className="d-flex gap-3">
    <i
      className="bi bi-pencil-square text-success"
      style={{ cursor: 'pointer' }}
      onClick={() => handleEdit(match)}
      title="Modifica"
    ></i>
    <i
      className="bi bi-trash text-danger"
      style={{ cursor: 'pointer' }}
      onClick={() => handleDelete(match._id)}
      title="Elimina"
    ></i>
  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default MatchManager;
