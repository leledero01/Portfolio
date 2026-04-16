import { useState, useEffect, useMemo, useRef } from "react";
import { 
  FiMail, FiPhone, FiLinkedin, FiHome, FiExternalLink, 
  FiChevronDown, FiCalendar, FiMapPin, FiBookOpen, FiGlobe,
  FiCode, FiBook, FiCpu, FiUser, FiLayers 
} from "react-icons/fi";
import Io from "./assets/Io.jpg";
import './App.css';
import { useNavigate, useLocation } from "react-router-dom";

export default function App() {
  return (
    <div>
      {/* Stili globali per l'hover effect */}
      <style>{`
        .hover-scale {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease !important;
          will-change: transform;
        }
        .hover-scale:hover {
          transform: scale(1.05) !important;
          z-index: 10;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
        }
      `}</style>

      <Background />
      <Navbar />
      <Hero />
      <Profile />
      <Education />
      <Projects />
      <Skills />
      <Contact />
      <HomeButton />
    </div>
  );
}

/* ---------- REVEAL WRAPPER ---------- */
function RevealContainer({ children, delay = 300, style = {} }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (domRef.current) observer.unobserve(domRef.current);
        }
      },
      { threshold: 0.1 } // Scatta quando il 10% dell'elemento è visibile
    );

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        filter: isVisible ? "blur(0px)" : "blur(10px)",
        transition: `opacity 0.3s cubic-bezier(0.22, 1.61, 0.36, 1) ${delay}ms, transform 0.3s cubic-bezier(0.22, 1.61, 0.36, 1) ${delay}ms, filter 0.3s cubic-bezier(0.22, 1.61, 0.36, 1) ${delay}ms`,
        ...style
      }}
    >
      {children}
    </div>
  );
}

/* ---------- BACKGROUND ---------- */
function Background() {
  return <div className="bg" />;
}

/* ---------- NAVBAR ---------- */
function Navbar() {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const projectVisibleRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isItalian = location.pathname === "/it";


  // --- Restore navbar scroll blur ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initialize on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["hero", "profile", "education", "projects", "skills", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        // HERO -> controls logo animation (EDR -> full name)
        const heroEntry = entries.find(e => e.target.id === "hero");
        if (heroEntry) {
          setExpanded(!heroEntry.isIntersecting);
        }

        entries.forEach((entry) => {
          const id = entry.target.id;

          // Track project cards visibility globally (IMPORTANT FIX)
          if (entry.target.classList?.contains("project-card")) {
            if (entry.isIntersecting) {
              projectVisibleRef.current = true;
            } else {
              projectVisibleRef.current = false;
            }
          }
        });

        // PRIORITY 1: if ANY project card visible => projects active
        if (projectVisibleRef.current) {
          setActiveSection("projects");
          return;
        }

        // PRIORITY 2: normal section detection (center-based)
        let bestSection = null;
        let bestRatio = 0;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.id;

          if (sections.includes(id)) {
            if (entry.intersectionRatio > bestRatio) {
              bestRatio = entry.intersectionRatio;
              bestSection = id;
            }
          }
        });

        if (bestSection) {
          setActiveSection(bestSection);
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0
      }
    );

    // observe sections
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // observe project cards
    document.querySelectorAll(".project-card").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .logo-container {
          font-size: 26px;
          font-weight: 900;
          color: white;
          letter-spacing: 2px;
          position: relative;
          display: flex;
          align-items: center;
          height: 30px; 
          cursor: pointer;
        }

        .logo-edr {
          position: absolute;
          left: 0;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          transform: translateY(0px);
        }

        .logo-full {
          position: absolute;
          left: 0;
          display: flex;
          gap: 10px;
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          pointer-events: none;
        }

        .logo-full span {
          opacity: 0;
          transform: translateY(-10px);
          display: inline-block;
        }

        .logo-container.expanded .logo-edr {
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
        }

        .logo-container.expanded .logo-full {
          opacity: 1;
          transform: translateY(0px);
        }

        .logo-container.expanded .logo-full span:nth-child(1) {
          animation: fadeWord 0.6s forwards 0.05s;
        }
        .logo-container.expanded .logo-full span:nth-child(2) {
          animation: fadeWord 0.6s forwards 0.15s;
        }
        .logo-container.expanded .logo-full span:nth-child(3) {
          animation: fadeWord 0.6s forwards 0.25s;
        }

        @keyframes fadeWord {
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        
        .nav-links {
          display: flex;
          gap: 35px;
          align-items: center;
        }

        .nav-links a {
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-links a.active {
          color: #F5C542;
          text-shadow: 0 0 10px rgba(245, 197, 66, 0.8),
                       0 0 20px rgba(245, 197, 66, 0.5);
          animation: glowPulse 1.8s ease-in-out infinite;
        }

        .nav-links a.active::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #F5C542, #D4AF37);
          border-radius: 2px;
        }
        @keyframes glowPulse {
          0%, 100% {
            text-shadow: 0 0 8px rgba(245, 197, 66, 0.6),
                         0 0 16px rgba(245, 197, 66, 0.4);
          }
          50% {
            text-shadow: 0 0 14px rgba(245, 197, 66, 0.9),
                         0 0 28px rgba(245, 197, 66, 0.6);
          }
        }
      `}</style>
      
      <div className={`navbar ${scrolled ? "scrolled" : ""}`} style={{ zIndex: 9999 }}>
        <div className={`nav-left`} style={{ display: "flex", alignItems: "center" }}>
          <div
            className={`logo-container ${expanded ? "expanded" : ""}`}
            style={{
              width: expanded ? "315px" : "65px", 
              marginRight: "35px", 
              transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="logo-edr">EDR</span>
            <span className="logo-full">
              <span>Emanuele</span>
              <span>De</span>
              <span>Rocchi</span>
            </span>
          </div>

          <div className="nav-links">
            <a href="#profile" className={activeSection === "profile" ? "active" : ""}>Profilo</a>
            <a href="#education" className={activeSection === "education" ? "active" : ""}>Istruzione</a>
            <a href="#projects" className={activeSection === "projects" ? "active" : ""}>Progetti</a>
            <a href="#skills" className={activeSection === "skills" ? "active" : ""}>Competenze</a>
            <a href="#contact" className={activeSection === "contact" ? "active" : ""}>Contatti</a>
            <a 
              href="/CV_DeRocchiEmanuele.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="icon" 
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              Curriculum <FiExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="nav-right" style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <a href="tel:+393470985118" className="icon"><FiPhone size={20} /></a>
          <a href="mailto:leledero01@gmail.com" className="icon"><FiMail size={20} /></a>
          <a href="https://www.linkedin.com/in/emanuele-de-rocchi-571826220" target="_blank" rel="noreferrer" className="icon"><FiLinkedin size={20} /></a>
          <button 
            className="flag" 
            aria-label="Language switch"
            type="button"
            onClick={() => {
              const currentPath = location.pathname;
              const targetPath = currentPath.startsWith("/it") ? "/" : "/it";

              const targetLang = targetPath === "/it" ? "it" : "en";
              localStorage.setItem("lang", targetLang);

              navigate(targetPath, { replace: true });
            }}
          >
            <img 
              src={isItalian ? "https://flagcdn.com/it.svg" : "https://flagcdn.com/gb.svg"} 
              alt="Language" 
              style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid white", objectFit: "cover" }} 
            />
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowArrow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="hero" className="hero" style={{ position: "relative" }}>
      <h1 style={{ fontSize: "90px", lineHeight: "1.1" }}>Ciao, sono Emanuele</h1>
      <p style={{ marginTop: "15px", fontSize: "25px", opacity: 0.8 }}>
        Ingegnere Gestionale <span>|</span> Appassionato di Data Analytics
      </p>

      <div className="hero-buttons">
        <a href="#about" className="btn" style={{ backgroundColor: "white", color: "black", padding: "14px 26px", fontSize: "18px", fontWeight: "500", border: "none" }}>Di più su di me</a>
        <a
          href="/CV_DeRocchiEmanuele.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn primary"
          style={{ backgroundColor: "transparent", color: "white", padding: "14px 26px", fontSize: "18px", fontWeight: "500", border: "1px solid white" }}
        >
          Curriculum <FiExternalLink size={15} style={{ marginLeft: "6px" }} />
        </a>
      </div>

      {showArrow && (
        <>
          <style>{`
            @keyframes bounceArrow {
              0%, 100% { transform: translate(-50%, 0); opacity: 0.6; }
              50% { transform: translate(-50%, 10px); opacity: 1; }
            }
          `}</style>
          <div style={{ position: "absolute", bottom: "150px", left: "50%", transform: "translateX(-50%)", animation: "bounceArrow 1.6s infinite" }}>
            <FiChevronDown size={42} color="white" />
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- HOME BUTTON ---------- */
function HomeButton() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      className="home-btn"
      onClick={scrollTop}
      aria-label="Home"
      style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", position: "fixed", bottom: "50px", right: "110px", left: "auto", zIndex: 1001, transform: "none" }}
    >
      <FiHome size={20} color="white" />
    </button>
  );
}

/* ---------- COMPONENTE BUBBLE ---------- */
function Bubble({ text, size, top, left, fontSize, isMini }) {
  return (
    <div
      className={`bubble-wrapper ${isMini ? "mini" : ""}`}
      style={{ width: size, height: size, top, left }}
    >
      {!isMini && (
        <>
          <div className="bubble-text bg-text" style={{ fontSize }}>{text}</div>
          <div className="bubble-glass"></div>
          <div className="bubble-text fg-text" style={{ fontSize }}>{text}</div>
        </>
      )}
      {isMini && <div className="bubble-glass"></div>}
    </div>
  );
}

/* ---------- PROFILE ---------- */
function Profile() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div id="profile" style={{ minHeight: "100vh", padding: "120px 80px", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "0px" }}>
        <h2 style={{ fontSize: "60px", margin: "0" }}>Profilo</h2>
        <p style={{ fontSize: "25px", opacity: 0.8, marginTop: "6px", fontWeight: "400" }}>Interessi e Obiettivi</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", paddingLeft: "300px", paddingRight: "120px" }}>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", transform: "translateX(150px)" }}>
          <div style={{ position: "relative", width: "260px", height: "260px", marginBottom: "20px" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", height: "300px", borderRadius: "50%", backgroundColor: "rgba(170, 254, 227, 0.6)", filter: "blur(10px)", backdropFilter: "blur(10px)", opacity: 0.6, zIndex: 0 }} />
            <img src={Io} alt="Profile" style={{ width: "260px", height: "260px", borderRadius: "50%", objectFit: "cover", position: "relative", zIndex: 1 }} />
          </div>
          <div style={{ display: "flex", marginTop: "30px", alignItems: "center", gap: "10px", marginBottom: "10px", opacity: 0.8 }}>
            <FiCalendar size={18} /><span> 14 Dicembre 2001</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", opacity: 0.8 }}>
            <FiMapPin size={18} /><span>Galbiate, LC, Italia</span>
          </div>
          <div style={{ position: "relative", marginTop: "30px", width: "380px" }}>
            <style>{`@keyframes glowBox { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.9; } }`}</style>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "120%", backgroundColor: "rgba(170, 254, 227, 0.6)", filter: "blur(20px)", backdropFilter: "blur(10px)", borderRadius: "20px", zIndex: 0, animation: "glowBox 2.5s ease-in-out infinite" }} />
            <div style={{ position: "relative", padding: "20px", borderRadius: "20px", zIndex: 1, color: "white", fontSize: "16px", lineHeight: "1.4" }}>
              <span>“<strong>Ambizioso</strong> e sempre desideroso di <strong>imparare</strong>, con il chiaro obiettivo di costruirsi un <strong>percorso professionale</strong> solido e in continua <strong>crescita</strong>”</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div className="bubbles-container" style={{ marginRight: "300px", "--scroll-y": scrollY }}>
            <Bubble size="170px" top="25%" left="5%" fontSize="20px" text={<>Machine<br />Learning</>} />
            <Bubble size="100px" top="10%" left="0%" fontSize="14px" text="Data" />
            <Bubble size="130px" top="0%" left="45%" fontSize="16px" text="Insights" />
            <Bubble size="100px" top="35%" left="38%" fontSize="14px" text="Creatività" />
            <Bubble size="140px" top="35%" left="65%" fontSize="17px" text="Innovazione" />
            <Bubble size="160px" top="70%" left="35%" fontSize="18px" text={<>Valutazione <br />Rischi /<br />Opportunità</>} />
            <Bubble size="110px" top="75%" left="5%" fontSize="15px" text={<>Business<br />Strategy</>} />

            <Bubble isMini size="30px" top="20%" left="30%" />
            <Bubble isMini size="15px" top="28%" left="35%" />
            <Bubble isMini size="20px" top="60%" left="30%" />
            <Bubble isMini size="25px" top="62%" left="60%" />
            <Bubble isMini size="15px" top="85%" left="80%" />
            <Bubble isMini size="12px" top="90%" left="78%" />
            <Bubble isMini size="20px" top="45%" left="95%" />
            <Bubble isMini size="18px" top="5%" left="70%" />
            <Bubble isMini size="12px" top="15%" left="85%" />
            <Bubble isMini size="14px" top="55%" left="50%" />
            <Bubble isMini size="16px" top="80%" left="25%" />
            <Bubble isMini size="10px" top="92%" left="60%" />
            <Bubble isMini size="18px" top="30%" left="75%" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- EDUCATION ---------- */
function Education() {
  return (
    <div id="education" style={{ minHeight: "100vh", padding: "120px 80px", color: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h2 style={{ fontSize: "60px", margin: "0" }}>Istruzione</h2>
        <p style={{ fontSize: "25px", opacity: 0.8, marginTop: "6px", fontWeight: "400" }}>Percorso Accademico e Risultati</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "850px" }}>
        
        {/* Card 1: MSc */}
        <RevealContainer delay={300} style={{ marginBottom: "25px" }}>
          <div className="hover-scale" style={{ background: "linear-gradient(135deg, rgba(39,46,56,0.5), rgba(116,142,184,0.5))", backdropFilter: "blur(10px)", borderRadius: "24px", padding: "35px", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontSize: "26px", margin: "0 0 15px 0" }}>MSc Management Engineering - Analytics for Business</h3>
            <div style={{ display: "flex", gap: "30px", opacity: 0.9, fontSize: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FiCalendar /> Set 2023 - Mar 2026</span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FiMapPin /> Politecnico di Milano</span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FiBookOpen /> 110 cum Laude</span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FiGlobe /> Ing</span>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.2)", margin: "0 0 20px 0" }} />
            <p style={{ fontSize: "15px", marginBottom: "12px", opacity: 0.9 }}>Corsi Rilevanti:</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["Applied Statistics", "Machine Learning", "Advance Performance Measurement", "Digital Technologies", "Marketing Analytics"].map(course => (
                <span key={course} style={{ backgroundColor: "#343D49", border: "1px solid #272E38", padding: "5px 10px", borderRadius: "20px", fontSize: "15px", fontWeight: "700", color: "#97ACC9" }}>
                  {course}
                </span>
              ))}
            </div>
          </div>
        </RevealContainer>

        {/* Card 2: BSc */}
        <RevealContainer delay={300}>
          <div className="hover-scale" style={{ background: "linear-gradient(135deg, rgba(39,46,56,0.5), rgba(116,142,184,0.5))", backdropFilter: "blur(10px)", borderRadius: "24px", padding: "35px", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontSize: "26px", margin: "0 0 15px 0" }}>BSc Ingegneria Gestionale</h3>
            <div style={{ display: "flex", gap: "30px", opacity: 0.9, fontSize: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FiCalendar /> Set 2020 - Lug 2023</span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FiMapPin /> Politecnico di Milano</span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FiBookOpen /> 105</span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FiGlobe /> Ita</span>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.2)", margin: "0 0 20px 0" }} />
            <p style={{ fontSize: "15px", marginBottom: "12px", opacity: 0.9 }}>Corsi Rilevanti:</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["Business Data Analytics", "Tecnologie Digitali"].map(course => (
                <span key={course} style={{ backgroundColor: "#343D49", border: "1px solid #272E38", padding: "5px 10px", borderRadius: "20px", fontSize: "15px", fontWeight: "700", color: "#97ACC9" }}>
                  {course}
                </span>
              ))}
            </div>
          </div>
        </RevealContainer>

        {/* Connector Line */}
        <RevealContainer delay={300}>
          <div style={{ width: "1px", height: "25px", backgroundColor: "rgba(255, 255, 255, 0.4)", margin: "0 auto" }}></div>
        </RevealContainer>

        {/* Card 3: Award */}
        <RevealContainer delay={300}>
          <div className="hover-scale" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, rgba(39,46,56,0.5), rgba(116,142,184,0.5))", backdropFilter: "blur(10px)", borderRadius: "30px", padding: "18px 35px", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", flexWrap: "wrap", gap: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "600" }}>Premio Migliori Matricole A.A. 2020/2021</span>
            <div style={{ display: "flex", gap: "25px", opacity: 0.9, fontSize: "15px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FiCalendar /> Mar 2022</span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><FiMapPin /> Politecnico di Milano</span>
            </div>
          </div>
        </RevealContainer>

      </div>
    </div>
  );
}

/* ---------- PROJECTS ---------- */
export function Projects() {
  const projectsData = [
    {
      id: 1,
      title: "Tesi",
      date: "Mar 2025 - Mar 2026",
      subtitle: `"A Comparative Study of Uncertainty-driven Vision Transformers for In-situ Image Segmentation in Additive Manufacturing"`,
      tags: ["Python", "Transformers", "Analisi di Immagini", "Quantificazione dell'Incertezza", "Statistical Process Control"],
      bullets: [
        <>Esplorare una promettente <strong>soluzione AI</strong> nel campo della Computer Vision (Vision Transformers) per la segmentazione delle immagini in-situ</>,
        <>Implementare metodi di <strong>Quantificazione dell’Incertezza</strong>, Deterministico e Bayesiano, per fornire  raprresentazioni visive della variabilità predittiva dei modelli e migliorare l’interpretabilità</>,
        <><strong>Simulare difetti</strong> e perturbazioni per testare la reattività dell’incertezza a scenari fuori controllo</>,
        <>Disegnare un framework di Statistical Process Control (SPC) basato su una variabile di risposta derivata dall’incertezza per <strong>automaticamente identificare e localizzare i difetti</strong></>
      ]
    },
    {
      id: 2,
      title: "Impatto dei Benessere Psicologico sulle Performance degli Studenti",
      date: "Ott 2024 - Gen 2025",
      tags: ["R", "EDA", "Linear (Mixed) Models", "Variance Function", "Geostatistics"],
      bullets: [
        <>Investigare se il <strong>punteggio OECD® PISA</strong> può essere spiegato da fattori umani e sociali, come il supporto della famiglia, la percezione del rischio di sicurezza, la curiosità...</>,
        <><strong>Esplorare vari modelli lineari</strong> per analizzare le relazioni tra variabili, da modelli Omoschedastici a quelli più complessi, includendo Variance Functions e Mixed Effects</>,
        <>Sfruttare la geostatistic per valutare <strong>l’autocorrelazione spaziale</strong> tra Paesi limitrofi, e confrontare fattori umani e sociali tra Paesi del Nord e Sud Europa</>
      ]
    },
    {
      id: 3,
      title: "Attività Celebrali per la Recall & Attenzione nelle Pubblicità",
      date: "Ott 2024 - Gen 2025",
      tags: ["Python", "EDA", "Test Statistici", "Visualizzazione dei Dati"],
      bullets: [
        <>Analizzare i dati relativi alle <strong>attività celebrali</strong> raccolti da individui esposti a pubblicità per <strong>scopi di marketing</strong></>,
        <>Valutare come vari fattori, come la piattaforma, il dispositivo, la qualità del contenuto precedente, e la posizione nella sequenza pubblicitaria, <strong>impatti l’attenzione e recall degli individui</strong></>,
        <>Investigare <strong>l’impatto</strong> di vari <strong>elementi all’interno degli spot</strong>, come logo, stimoli multisensoriali... e fornire raccomandazioni manageriali con lo scopo di <strong>massimizzare la recall totale</strong></>
      ]
    },
    {
      id: 4,
      title: "Valutazione & Analisi delle Performance di Campari Group",
      date: "Ott 2024 - Dic 2024",
      tags: ["Python", "Power BI"],
      bullets: [
        <>Analizzare dati di marketing e vendite relativi a Campari Group e competitors per fornire <strong>insights manageriali</strong> verso uno specifico decision-maker all’interno del loro organigramma aziendale</>,
        <>Estrarre informazioni di <strong>rischio e/o opportunità</strong> per condurre valutazioni in profondità delle area di analisi identificate</>,
        <>Definire <strong>KPI appropriati</strong> e presentare i risultati tramite <strong>report</strong> e una comprensibile e intuitiva <strong>dashboard</strong> usando Power BI</>
      ]
    }
  ];

  return (
    <div id="projects" style={{ minHeight: "100vh", padding: "120px 80px", color: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h2 style={{ fontSize: "60px", margin: "0" }}>Progetti</h2>
        <p style={{ fontSize: "25px", opacity: 0.8, marginTop: "6px", fontWeight: "400" }}>Accademici e Personali</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "900px", gap: "25px" }}>
        {projectsData.map((project) => (
          <RevealContainer key={project.id} delay={300}>
            <div className="hover-scale project-card" style={{ 
              background: "linear-gradient(135deg, rgba(75,107,96,0.5), rgba(217,255,189,0.5))",
              backdropFilter: "blur(10px)", 
              borderRadius: "24px", 
              padding: "35px", 
              border: "1px solid rgba(255,255,255,0.15)", 
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              position: "relative"
            }}>
              
              <div style={{ position: "absolute", top: "30px", left: "20px", opacity: 0.9 }}>
                <span style={{ 
                  backgroundColor: "#224237", 
                  borderRadius: "12px", 
                  padding: "12px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center"
                }}>
                  <FiBookOpen size={26} />
                </span>
              </div>

              <div style={{ marginLeft: "50px" }}>
                <h3 style={{ fontSize: "24px", margin: "0 0 5px 0", fontWeight: "600" }}>{project.title}</h3>
                <p style={{ fontSize: "14px", opacity: 0.7, margin: "0 0 15px 0" }}>{project.date}</p>
                
                {project.subtitle && (
                  <div style={{ display: "flex", gap: "10px", marginBottom: "15px", alignItems: "flex-start" }}>
                    <FiBook size={16} style={{ marginTop: "3px", opacity: 0.8, flexShrink: 0 }} />
                    <p style={{ fontSize: "15px", opacity: 0.9, margin: 0 }}>{project.subtitle}</p>
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
                  {project.tags.map(tag => (
                    <span key={tag} style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "#D0E3D8"
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.2)", margin: "0 0 20px 0" }} />

                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "15px", opacity: 0.9, lineHeight: "1.6" }}>
                  {project.bullets.map((bullet, index) => (
                    <li key={index} style={{ marginBottom: "10px" }}>{bullet}</li>
                  ))}
                </ul>
              </div>

            </div>
          </RevealContainer>
        ))}
      </div>
    </div>
  );
}

/* ---------- SKILLS ---------- */

export function Skills() {
  const skillsCategories = [
    {
      id: 1,
      title: "SO e Software",
      icon: <FiCode size={24} />,
      themeColor: "rgba(46, 125, 50, 0.15)",
      borderColor: "rgba(76, 175, 80, 0.6)",
      tagBg: "rgba(76, 175, 80, 0.2)",
      tagBorder: "rgba(76, 175, 80, 0.5)",
      tagText: "#a5d6a7",
      tags: ["MacOS", "Windows", "VS Code", "Excel", "Word", "PowerPoint", "Power BI", "Python", "R", "SQL"]
    },
    {
      id: 2,
      title: "Librerie",
      icon: <FiLayers size={24} />,
      themeColor: "rgba(230, 115, 0, 0.15)",
      borderColor: "rgba(255, 152, 0, 0.6)",
      tagBg: "rgba(255, 152, 0, 0.2)",
      tagBorder: "rgba(255, 152, 0, 0.5)",
      tagText: "#ffcc80",
      tags: ["numpy", "pandas", "scikit-learn", "matplotlib", "seaborn"]
    },
    {
      id: 3,
      title: "Modelli di ML",
      icon: <FiCpu size={24} />,
      themeColor: "rgba(21, 101, 192, 0.15)",
      borderColor: "rgba(33, 150, 243, 0.6)",
      tagBg: "rgba(33, 150, 243, 0.2)",
      tagBorder: "rgba(33, 150, 243, 0.5)",
      tagText: "#90caf9",
      tags: ["Linear Regression", "KNN", "Decision Tree", "PCA", "Random Forest", "Neural Network", "ARIMA", "Association Rules", "..."]
    },
    {
      id: 4,
      title: "Soft Skills",
      icon: <FiUser size={24} />,
      themeColor: "rgba(106, 27, 154, 0.15)",
      borderColor: "rgba(156, 39, 176, 0.6)",
      tagBg: "rgba(156, 39, 176, 0.2)",
      tagBorder: "rgba(156, 39, 176, 0.5)",
      tagText: "#ce93d8",
      tags: ["Teamwork", "Problem Solving", "Organizzazione", "Critical & Analytical Thinking", "Collaboration", "Agilità di Apprendimento", "Flessibilità"]
    }
  ];

  return (
    <div id="skills" style={{ minHeight: "100vh", padding: "120px 80px", color: "white", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h2 style={{ fontSize: "60px", margin: "0" }}>Competenze</h2>
        <p style={{ fontSize: "25px", opacity: 0.8, marginTop: "6px", fontWeight: "400" }}>Tecniche e Trasversali</p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", 
        gap: "30px", 
        width: "100%", 
        maxWidth: "950px" 
      }}>
        {skillsCategories.map((category) => (
          <RevealContainer key={category.id} delay={300} style={{ height: "100%" }}>
            <div className="hover-scale" style={{ 
              backgroundColor: category.themeColor,
              backdropFilter: "blur(10px)", 
              borderRadius: "24px", 
              padding: "30px", 
              border: `1px solid ${category.borderColor}`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              height: "100%",
              boxSizing: "border-box"
            }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  backgroundColor: category.borderColor,
                  borderRadius: "12px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {category.icon}
                </span>
                <h3 style={{ fontSize: "24px", margin: 0, fontWeight: "600" }}>{category.title}</h3>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {category.tags.map((tag, index) => (
                  <span key={index} style={{ 
                    backgroundColor: category.tagBg, 
                    border: `1px solid ${category.tagBorder}`, 
                    padding: "6px 14px", 
                    borderRadius: "20px", 
                    fontSize: "15px", 
                    fontWeight: "600", 
                    color: category.tagText 
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

            </div>
          </RevealContainer>
        ))}
      </div>
    </div>
  );
}

/* ---------- CONTACT ---------- */
export function Contact() {
  const contactMethods = [
    {
      id: 1,
      label: "Email",
      value: "leledero01@gmail.com",
      icon: <FiMail size={22} />,
      link: "mailto:leledero01@gmail.com",
      external: false
    },
    {
      id: 2,
      label: "Telefono",
      value: "+39 3470985118",
      icon: <FiPhone size={22} />,
      link: "tel:+393470985118",
      external: false
    },
    {
      id: 3,
      label: "LinkedIn",
      value: "emanuelederocchi",
      icon: <FiLinkedin size={22} />,
      link: "https://www.linkedin.com/in/emanuele-de-rocchi-571826220",
      external: true
    }
  ];

  return (
    <div id="contact" style={{ 
      minHeight: "100vh", 
      padding: "0px 80px", 
      color: "white", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    }}>
      
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h2 style={{ fontSize: "60px", margin: "0" }}>Contatti</h2>
        <p style={{ fontSize: "25px", opacity: 0.8, marginTop: "6px", fontWeight: "400" }}>
          Non esitare a metterti in contatto
        </p>
      </div>

      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "20px", 
        justifyContent: "center",
        width: "100%",
        maxWidth: "1000px"
      }}>
        {contactMethods.map((contact) => (
          <RevealContainer key={contact.id} delay={300}>
            <a 
              className="hover-scale"
              href={contact.link}
              target={contact.external ? "_blank" : "_self"}
              rel={contact.external ? "noopener noreferrer" : ""}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                backgroundColor: "rgba(68, 105, 132, 0.4)",
                border: "1px solid #4B96C4", 
                borderRadius: "16px", 
                padding: "12px 25px 12px 12px", 
                gap: "15px",
                textDecoration: "none",
                color: "white",
                minWidth: "280px",
                backdropFilter: "blur(10px)",
                position: "relative"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(68, 105, 132, 0.6)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(68, 105, 132, 0.4)"}
            >
              <div style={{ 
                backgroundColor: "#4B96C4", 
                padding: "12px", 
                borderRadius: "12px", 
                border: "1px solid #4B96C4",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                {contact.icon}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "12px", opacity: 0.7, fontWeight: "600", marginBottom: "2px" }}>
                  {contact.label}
                </span>
                <span style={{ fontSize: "16px", fontWeight: "600" }}>
                  {contact.value}
                </span>
              </div>

              {contact.external && (
                <div style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", opacity: 0.6 }}>
                  <FiExternalLink size={16} />
                </div>
              )}
            </a>
          </RevealContainer>
        ))}
      </div>

      <div style={{ 
        position: "absolute", 
        bottom: "40px", 
        textAlign: "center", 
        width: "100%",
        opacity: 0.6,
        fontSize: "14px",
        fontStyle: "italic"
      }}>
        <p>“Without data, you're just another person with an opinion.” - W. Edwards Deming</p>
      </div>

    </div>
  );
}