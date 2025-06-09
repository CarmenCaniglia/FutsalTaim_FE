import { useState, useEffect } from 'react';
import API from '../../api';

function TeamManager() {
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({ name: '', gender: 'maschile', group: 'A' });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 

  const fetchTeams = async () => {
    const res = await API.get('/teams');
    setTeams(res.data);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/teams/${editId}`, formData);
      } else {
        await API.post('/teams', formData);
      }
      setFormData({ name: '', gender: 'maschile', group: 'A' });
      setEditId(null);
      fetchTeams();
    } catch (err) {
      alert('Errore nel salvataggio squadra');
    }
  };

  const handleEdit = (team) => {
    setFormData({ name: team.name, gender: team.gender, group: team.group });
    setEditId(team._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confermi eliminazione squadra?')) {
      await API.delete(`/teams/${id}`);
      fetchTeams();
    }
  };

    const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h4>Gestione Squadre</h4>

      <form onSubmit={handleSubmit} className="row g-3 mt-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            name="name"
            placeholder="Nome squadra"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

      <div className="row g-2">
        <div className="col-auto">
          <select name="gender" className="form-select w-auto" value={formData.gender} onChange={handleChange}>
            <option value="maschile">Maschile</option>
            <option value="femminile">Femminile</option>
          </select>
        </div>

        <div className="col-auto ">
          <select name="group" className="form-select w-auto" value={formData.group} onChange={handleChange}>
            <option value="A">Girone A</option>
            <option value="B">Girone B</option>
          </select>
        </div>

        <div className="col-auto">
          <button type="submit" className="btn btn-success">
            {editId ? <i className="bi bi-floppy"></i> : <i className="bi bi-plus-circle"></i>}
          </button>
        </div>
        </div>
      </form>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Cerca..."
          className="form-control"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
    <div className='w-auto' style={{ maxHeight: '360px', overflowY: 'auto' }}>
      <table className="table table-bordered rounded-table">
        <thead>
          <tr>
            <th className="table-name">Nome</th>
            <th>Categoria</th>
            <th>Girone</th>
            <th className="table-actions">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeams.map((team) => (
            <tr key={team._id}>
              <td className="table-name">{team.name}</td>
              <td>{team.gender}</td>
              <td>{team.group}</td>
              <td className="table-actions">
                <div className="d-flex gap-3">
                  <i
                    className="bi bi-pencil-square text-success"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleEdit(team)}
                    title="Modifica"
                  ></i>
                  <i
                    className="bi bi-trash text-danger"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDelete(team._id)}
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

export default TeamManager;
