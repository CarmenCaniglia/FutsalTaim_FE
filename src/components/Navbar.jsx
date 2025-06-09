import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import logo from '../assets/logosenzascritta.png'

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

 return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: '#01446b' }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" onClick={closeMenu}><img 
    src={logo}
    alt="Futsal Taim Logo" 
    style={{ height: '30px', borderRadius: '50%' }} // Regola l'altezza come preferisci
    className="me-2" // Aggiunge un piccolo margine a destra
  /> Futsal Taim</Link>
        
        {/* Bottone hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/gironi" onClick={closeMenu}>Squadre</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/partite" onClick={closeMenu}>Partite</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/classifiche" onClick={closeMenu}>Classifiche</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/marcatori" onClick={closeMenu}>Marcatori</Link>
            </li>
          </ul>
          
          <ul className="navbar-nav ms-auto">
            {token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin" onClick={closeMenu} aria-label="Admin"><i className="bi bi-person-circle"></i></Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-1" onClick={handleLogout} aria-label="Logout"><i className="bi bi-box-arrow-right"></i></button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={closeMenu} aria-label="Login"><i className="bi bi-person-fill-lock"></i></Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
