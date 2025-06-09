import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesCustom({ isMobile }) {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine); // qui ora funzionerà
  }, []);

  const particlesOptions = {
    particles: {
      number: {
        value: isMobile ? 14 : 6,
        density: {
          enable: true,
          value_area: 700
        }
      },
      color: {
        value: ["#063970", "#2da3dc"]
      },
      shape: {
        type: "polygon",
        polygon: {
          nb_sides: 6
        }
      },
      opacity: {
        value: 0.5,
        random: true,
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.2,
          sync: false
        }
      },
      size: {
        value: 160,
        anim: {
          enable: true,
          speed: 10,
          size_min: 40,
          sync: false
        }
      },
      move: {
        enable: true,
        speed: 2,
        out_mode: "out"
      },
      line_linked: {
        enable: false
      }
    },
    interactivity: {
  events: {
    onhover: {
      enable: true,
      mode: "repulse"
    },
    onclick: {
      enable: true,
      mode: "repulse" // Nessuna nuova particella creata
    },
    resize: true
  },
  modes: {
    repulse: {
      distance: 150,
      duration: 0.4
    }
  }
},
    
    retina_detect: true,
    background: {
      color: "transparent"
    }
  };

  return <Particles id="tsparticles" init={particlesInit} options={particlesOptions} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none' // evita che interferisca col click
    }} />;
}
