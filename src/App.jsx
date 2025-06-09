import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Gironi from "./pages/Gironi";
import Partite from "./pages/Partite";
import Classifiche from "./pages/Classifiche";
import Marcatori from "./pages/Marcatori";
import ParticlesCustom from "./components/ParticlesCustom";
import usePWAUpdate from "./usePWAUpdate";

function App() {
  const isMobile = window.innerWidth < 768;
  const { updateAvailable, updateServiceWorker } = usePWAUpdate();

  return (
    <>
      {/* 🔔 Notifica aggiornamento */}
      {updateAvailable && (
        <div
          style={{
            background: "#ffc107",
            padding: "10px",
            textAlign: "center",
          }}
        >
          🔄 Nuova versione disponibile!
          <button
            style={{ marginLeft: "10px", padding: "5px 10px" }}
            onClick={() => updateServiceWorker(true)}
          >
            Aggiorna
          </button>
        </div>
      )}
      <div
        style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
      >
        <ParticlesCustom isMobile={isMobile} />
        <Router>
          <Navbar />
          <div
            className="container pt-4"
            style={{ position: "relative", zIndex: 1 }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gironi" element={<Gironi />} />
              <Route path="/partite" element={<Partite />} />
              <Route path="/classifiche" element={<Classifiche />} />
              <Route path="/marcatori" element={<Marcatori />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </Router>
      </div>
    </>
  );
}

export default App;
