import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import MatchManager from '../components/admin/MatchManager';
import PlayerManager from '../components/admin/PlayerManager';
import TeamManager from '../components/admin/TeamManager';

function Admin() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('teams');

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token]);

  const renderView = () => {
    switch (view) {
      case 'teams':
        return <TeamManager />;
      case 'players':
        return <PlayerManager />;
      case 'matches':
        return <MatchManager />;
      default:
        return <TeamManager />;
    }
  };

  return (
    <div>
      <h1 className='text-center'>Pannello Admin</h1>

      <div className="btn-group my-3" role="group">
        <button className={`btn btn-outline-primary ${view === 'teams' && 'active'}`} onClick={() => setView('teams')}>Squadre</button>
        <button className={`btn btn-outline-primary ${view === 'players' && 'active'}`} onClick={() => setView('players')}>Giocatori</button>
        <button className={`btn btn-outline-primary ${view === 'matches' && 'active'}`} onClick={() => setView('matches')}>Partite</button>
      </div>

      {renderView()}
    </div>
  );
}

export default Admin;

