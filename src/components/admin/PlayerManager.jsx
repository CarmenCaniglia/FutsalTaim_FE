import { useEffect, useState } from 'react';
import API from '../../api';

function PlayerManager() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({ name: '', team: '', gender: '', number: '' });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPlayers = async () => {
    const res = await API.get('/players');
    setPlayers(res.data);
  };

  const fetchTeams = async () => {
    const res = await API.get('/teams');
    setTeams(res.data);
  };

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/players/${editId}`, formData);
      } else {
        await API.post('/players', formData);
      }
      setFormData({ name: '', team: '' });
      setEditId(null);
      fetchPlayers();
    } catch (err) {
      alert('Errore nel salvataggio giocatore');
    }
  };

  const handleEdit = (player) => {
    setFormData({ name: player.name, team: player.team._id });
    setEditId(player._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Eliminare il giocatore?')) {
      await API.delete(`/players/${id}`);
      fetchPlayers();
    }
  };

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h4>Gestione Giocatori</h4>

      <form onSubmit={handleSubmit} className="row g-3 mt-3 mb-4 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            name="name"
            placeholder="Nome giocatore"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-auto">
          <select name="team" className="form-select" value={formData.team} onChange={handleChange} required>
            <option value="">-- Seleziona squadra --</option>
            {teams.map(team => (
              <option key={team._id} value={team._id}>{team.name} ({team.gender} - {team.group})</option>
            ))}
          </select>
        </div>

        <div className="col-auto">
          <button type="submit" className="btn btn-success ">
            {editId ? <i className="bi bi-floppy"></i> : <i className="bi bi-person-fill-add"></i>}
          </button>
        </div>
      </form>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Cerca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    
    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
      <table className="table table-bordered rounded-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Squadra</th>
            <th>Goal</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map(player => (
            <tr key={player._id}>
              <td>{player.name}</td>
              <td>{player.team?.name}</td>
              <td>{player.goals}</td>
              <td>
                <div className="d-flex gap-3">
                    <i
                      className="bi bi-pencil-square text-success"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEdit(player)}
                      title="Modifica"
                    ></i>
                    <i
                      className="bi bi-trash text-danger"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDelete(player._id)}
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

export default PlayerManager;
