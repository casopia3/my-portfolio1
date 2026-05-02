import { useState, useEffect, useRef } from "react";

const SECTIONS = ["Home", "About", "Skills", "Projects", "Tasks", "Contact"];

const initialProjects = [
  {
    id: 1,
    title: "Forex Signal Dashboard",
    description: "Real-time trading signals with AI-powered technical analysis and live chart integration.",
    tags: ["React", "Node.js", "WebSocket", "Trading"],
    color: "#F4A61D",
    year: "2024",
  },
  {
    id: 2,
    title: "IT Asset Manager",
    description: "Full-stack system to track, assign, and maintain IT equipment across departments.",
    tags: ["Python", "Django", "PostgreSQL", "REST API"],
    color: "#00D4FF",
    year: "2024",
  },
  {
    id: 3,
    title: "Portfolio Risk Analyzer",
    description: "Calculates VaR, Sharpe ratio, and drawdown metrics for multi-currency trading portfolios.",
    tags: ["Python", "Pandas", "Finance", "Analytics"],
    color: "#A855F7",
    year: "2023",
  },
];

const initialTasks = [
  { id: 1, title: "Complete Final IT Project", done: false, priority: "High" },
  { id: 2, title: "Backtest EUR/USD Strategy", done: false, priority: "High" },
  { id: 3, title: "Deploy Portfolio Website", done: true, priority: "Medium" },
];

const skillGroups = [
  {
    label: "Development",
    icon: "⚡",
    skills: ["React", "Node.js", "Python", "Django", "REST APIs", "PostgreSQL", "MongoDB", "Docker"],
  },
  {
    label: "Forex & Finance",
    icon: "📈",
    skills: ["Technical Analysis", "Risk Management", "MetaTrader 5", "Algorithmic Trading", "Price Action", "Backtesting"],
  },
  {
    label: "IT & Infrastructure",
    icon: "🛠",
    skills: ["Network Admin", "Linux", "AWS", "Cybersecurity", "IT Support", "System Design"],
  },
];

export default function Portfolio() {
  const [active, setActive] = useState("Home");
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const photoInputRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Add Project State
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", tags: "", color: "#F4A61D" });

  // Add Task State
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", priority: "Medium" });

  // Contact State
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    // Particle background
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,166,29,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const p = await window.storage.get("portfolio_projects");
        if (p) setProjects(JSON.parse(p.value));
      } catch {}
      try {
        const t = await window.storage.get("portfolio_tasks");
        if (t) setTasks(JSON.parse(t.value));
      } catch {}
      try {
        const ph = await window.storage.get("portfolio_photo");
        if (ph) setProfilePhoto(ph.value);
      } catch {}
    })();
  }, []);

  const saveProjects = async (data) => {
    setProjects(data);
    try { await window.storage.set("portfolio_projects", JSON.stringify(data)); } catch {}
  };

  const saveTasks = async (data) => {
    setTasks(data);
    try { await window.storage.set("portfolio_tasks", JSON.stringify(data)); } catch {}
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      setProfilePhoto(base64);
      try { await window.storage.set("portfolio_photo", base64); } catch {}
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = async () => {
    setProfilePhoto(null);
    try { await window.storage.delete("portfolio_photo"); } catch {}
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const addProject = () => {
    if (!newProject.title.trim()) return;
    const p = {
      id: Date.now(),
      title: newProject.title,
      description: newProject.description,
      tags: newProject.tags.split(",").map((t) => t.trim()).filter(Boolean),
      color: newProject.color,
      year: new Date().getFullYear().toString(),
    };
    saveProjects([...projects, p]);
    setNewProject({ title: "", description: "", tags: "", color: "#F4A61D" });
    setShowAddProject(false);
  };

  const deleteProject = (id) => saveProjects(projects.filter((p) => p.id !== id));

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const t = { id: Date.now(), title: newTask.title, priority: newTask.priority, done: false };
    saveTasks([...tasks, t]);
    setNewTask({ title: "", priority: "Medium" });
    setShowAddTask(false);
  };

  const toggleTask = (id) => saveTasks(tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => saveTasks(tasks.filter((t) => t.id !== id));

  const handleContact = (e) => {
    e.preventDefault();
    setSent(true);
    setContactForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const priorityColor = { High: "#EF4444", Medium: "#F4A61D", Low: "#22C55E" };

  const styles = {
    root: {
      fontFamily: "'Syne', sans-serif",
      background: "#080B14",
      color: "#E8E8E8",
      minHeight: "100vh",
      overflowX: "hidden",
    },
    canvas: {
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.6,
    },
    nav: {
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(8,11,20,0.85)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(244,166,29,0.15)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2rem", height: "64px",
    },
    logo: {
      fontFamily: "'Bebas Neue', cursive", fontSize: "1.8rem",
      background: "linear-gradient(90deg,#F4A61D,#00D4FF)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      letterSpacing: "2px", cursor: "pointer",
    },
    navLinks: {
      display: "flex", gap: "2rem", listStyle: "none", margin: 0, padding: 0,
    },
    navLink: (isActive) => ({
      cursor: "pointer", fontSize: "0.85rem", letterSpacing: "1.5px", textTransform: "uppercase",
      color: isActive ? "#F4A61D" : "#aaa",
      borderBottom: isActive ? "2px solid #F4A61D" : "2px solid transparent",
      paddingBottom: "2px", transition: "all 0.2s", fontWeight: 600,
    }),
    content: {
      paddingTop: "64px", position: "relative", zIndex: 1,
    },

    // HOME
    hero: {
      minHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "flex-start", padding: "0 10%",
      opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)",
      transition: "all 0.9s ease",
    },
    heroTag: {
      fontSize: "0.8rem", letterSpacing: "4px", textTransform: "uppercase",
      color: "#F4A61D", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem",
    },
    heroTitle: {
      fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(3.5rem, 10vw, 8rem)",
      lineHeight: 1, marginBottom: "0.5rem",
      background: "linear-gradient(135deg, #fff 40%, #F4A61D 100%)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    },
    heroSubtitle: {
      fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(1.5rem, 4vw, 3rem)",
      color: "#00D4FF", letterSpacing: "4px", marginBottom: "1.5rem",
    },
    heroBio: {
      fontSize: "1rem", color: "#9CA3AF", maxWidth: "520px", lineHeight: 1.8, marginBottom: "2.5rem",
    },
    heroBtns: { display: "flex", gap: "1rem", flexWrap: "wrap" },
    btnGold: {
      padding: "0.8rem 2rem", background: "linear-gradient(90deg,#F4A61D,#E8890D)",
      color: "#080B14", border: "none", borderRadius: "4px", fontWeight: 800,
      fontSize: "0.85rem", letterSpacing: "2px", textTransform: "uppercase",
      cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
      boxShadow: "0 0 20px rgba(244,166,29,0.3)",
    },
    btnOutline: {
      padding: "0.8rem 2rem", background: "transparent",
      color: "#00D4FF", border: "1.5px solid #00D4FF", borderRadius: "4px",
      fontWeight: 700, fontSize: "0.85rem", letterSpacing: "2px", textTransform: "uppercase",
      cursor: "pointer", transition: "all 0.2s",
    },
    statsRow: {
      display: "flex", gap: "3rem", marginTop: "3rem", flexWrap: "wrap",
    },
    statItem: { textAlign: "left" },
    statNum: {
      fontFamily: "'Bebas Neue', cursive", fontSize: "2.5rem", color: "#F4A61D", lineHeight: 1,
    },
    statLabel: { fontSize: "0.75rem", color: "#666", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" },

    // SECTIONS
    section: {
      padding: "6rem 10%",
    },
    sectionTag: {
      fontSize: "0.75rem", letterSpacing: "4px", textTransform: "uppercase",
      color: "#F4A61D", marginBottom: "1rem",
    },
    sectionTitle: {
      fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(2rem, 5vw, 4rem)",
      marginBottom: "0.5rem", color: "#fff",
    },
    divider: {
      width: "60px", height: "3px",
      background: "linear-gradient(90deg,#F4A61D,#00D4FF)",
      marginBottom: "3rem", borderRadius: "2px",
    },

    // ABOUT
    aboutGrid: {
      display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "4rem", alignItems: "center",
    },
    avatarBox: {
      position: "relative", width: "100%", aspectRatio: "1",
      maxWidth: "320px",
    },
    avatarBg: {
      position: "absolute", inset: 0, borderRadius: "20px",
      background: "linear-gradient(135deg,rgba(244,166,29,0.2),rgba(0,212,255,0.1))",
      border: "1px solid rgba(244,166,29,0.3)",
    },
    avatarInitials: {
      position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Bebas Neue', cursive", fontSize: "6rem",
      background: "linear-gradient(135deg,#F4A61D,#00D4FF)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    },
    aboutText: { fontSize: "1rem", color: "#9CA3AF", lineHeight: 1.9, marginBottom: "1rem" },
    badgeRow: { display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" },
    badge: {
      padding: "0.4rem 1rem", borderRadius: "20px",
      background: "rgba(244,166,29,0.1)", border: "1px solid rgba(244,166,29,0.3)",
      fontSize: "0.78rem", color: "#F4A61D", letterSpacing: "1px",
    },

    // SKILLS
    skillGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" },
    skillCard: {
      padding: "2rem", borderRadius: "12px",
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      transition: "border-color 0.3s, transform 0.3s",
    },
    skillCardIcon: { fontSize: "2rem", marginBottom: "0.75rem" },
    skillCardLabel: { fontFamily: "'Bebas Neue', cursive", fontSize: "1.3rem", color: "#fff", marginBottom: "1rem" },
    skillPill: {
      display: "inline-block", padding: "0.3rem 0.8rem", margin: "0.25rem",
      borderRadius: "4px", background: "rgba(0,212,255,0.08)",
      border: "1px solid rgba(0,212,255,0.2)", fontSize: "0.78rem", color: "#00D4FF",
    },

    // PROJECTS
    projectGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem" },
    projectCard: (color) => ({
      padding: "2rem", borderRadius: "12px",
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${color}33`,
      position: "relative", overflow: "hidden", transition: "transform 0.3s",
    }),
    projectAccent: (color) => ({
      position: "absolute", top: 0, left: 0, right: 0, height: "3px",
      background: `linear-gradient(90deg,${color},transparent)`,
    }),
    projectYear: { fontSize: "0.7rem", color: "#555", letterSpacing: "2px", marginBottom: "0.5rem" },
    projectTitle: { fontFamily: "'Bebas Neue', cursive", fontSize: "1.5rem", color: "#fff", marginBottom: "0.75rem" },
    projectDesc: { fontSize: "0.85rem", color: "#9CA3AF", lineHeight: 1.7, marginBottom: "1rem" },
    tagRow: { display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" },
    tag: (color) => ({
      padding: "0.25rem 0.65rem", borderRadius: "3px", fontSize: "0.7rem",
      background: `${color}18`, color: color, border: `1px solid ${color}44`,
    }),
    deleteBtn: {
      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
      color: "#EF4444", padding: "0.3rem 0.8rem", borderRadius: "4px",
      fontSize: "0.7rem", cursor: "pointer", letterSpacing: "1px",
    },

    // ADD FORMS
    modal: {
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    },
    modalBox: {
      background: "#0E1220", border: "1px solid rgba(244,166,29,0.3)",
      borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "500px",
    },
    modalTitle: {
      fontFamily: "'Bebas Neue', cursive", fontSize: "2rem", color: "#F4A61D", marginBottom: "1.5rem",
    },
    input: {
      width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px", padding: "0.75rem 1rem", color: "#E8E8E8",
      fontSize: "0.9rem", marginBottom: "1rem", outline: "none",
      fontFamily: "'Syne', sans-serif", boxSizing: "border-box",
    },
    textarea: {
      width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px", padding: "0.75rem 1rem", color: "#E8E8E8",
      fontSize: "0.9rem", marginBottom: "1rem", outline: "none",
      fontFamily: "'Syne', sans-serif", resize: "vertical", minHeight: "100px",
      boxSizing: "border-box",
    },
    select: {
      width: "100%", background: "#0E1220", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px", padding: "0.75rem 1rem", color: "#E8E8E8",
      fontSize: "0.9rem", marginBottom: "1rem", outline: "none",
      fontFamily: "'Syne', sans-serif", boxSizing: "border-box",
    },
    modalBtns: { display: "flex", gap: "1rem", justifyContent: "flex-end" },
    cancelBtn: {
      padding: "0.65rem 1.5rem", background: "transparent",
      border: "1px solid rgba(255,255,255,0.2)", color: "#999",
      borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem",
    },

    // TASKS
    taskItem: (done) => ({
      display: "flex", alignItems: "center", gap: "1rem",
      padding: "1rem 1.5rem", borderRadius: "10px",
      background: done ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)", marginBottom: "0.75rem",
      opacity: done ? 0.5 : 1, transition: "all 0.2s",
    }),
    checkbox: (done) => ({
      width: "20px", height: "20px", borderRadius: "50%",
      border: done ? "2px solid #22C55E" : "2px solid #444",
      background: done ? "#22C55E" : "transparent",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, transition: "all 0.2s",
    }),
    taskTitle: (done) => ({
      flex: 1, fontSize: "0.95rem",
      textDecoration: done ? "line-through" : "none", color: done ? "#666" : "#E8E8E8",
    }),
    priorityBadge: (p) => ({
      fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "10px",
      background: `${priorityColor[p]}18`, color: priorityColor[p],
      border: `1px solid ${priorityColor[p]}44`, letterSpacing: "1px",
    }),

    // CONTACT
    contactGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" },
    contactInfo: { paddingTop: "1rem" },
    contactInfoItem: { display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" },
    contactIcon: {
      width: "44px", height: "44px", borderRadius: "10px",
      background: "rgba(244,166,29,0.1)", border: "1px solid rgba(244,166,29,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0,
    },
    contactLabel: { fontSize: "0.75rem", color: "#666", letterSpacing: "1px", textTransform: "uppercase" },
    contactValue: { fontSize: "0.9rem", color: "#E8E8E8", marginTop: "2px" },
    successMsg: {
      padding: "1rem 1.5rem", background: "rgba(34,197,94,0.1)",
      border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px",
      color: "#22C55E", fontSize: "0.9rem", textAlign: "center", marginBottom: "1rem",
    },

    addBtn: {
      display: "flex", alignItems: "center", gap: "0.5rem",
      padding: "0.7rem 1.5rem",
      background: "rgba(244,166,29,0.1)", border: "1.5px solid rgba(244,166,29,0.4)",
      color: "#F4A61D", borderRadius: "6px", cursor: "pointer",
      fontSize: "0.85rem", letterSpacing: "1px", fontWeight: 700,
      transition: "all 0.2s", marginBottom: "2rem",
    },
    footer: {
      textAlign: "center", padding: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)",
      color: "#444", fontSize: "0.8rem", letterSpacing: "1px",
    },
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={styles.root}>
        <canvas ref={canvasRef} style={styles.canvas} />

        {/* NAV */}
        <nav style={styles.nav}>
          <div style={styles.logo} onClick={() => setActive("Home")}>PORTFOLIO</div>
          <ul style={styles.navLinks}>
            {SECTIONS.map((s) => (
              <li key={s} style={styles.navLink(active === s)} onClick={() => setActive(s)}>{s}</li>
            ))}
          </ul>
        </nav>

        <div style={styles.content}>

          {/* HOME */}
          {active === "Home" && (
            <section style={styles.hero}>
              {/* Profile Photo */}
              <div style={{ marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "2rem" }}>
                <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />

                {/* Avatar with hover overlay */}
                <div
                  onClick={() => photoInputRef.current && photoInputRef.current.click()}
                  style={{ position: "relative", width: "120px", height: "120px", borderRadius: "50%", cursor: "pointer", flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.querySelector(".overlay").style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.querySelector(".overlay").style.opacity = 0}
                >
                  {/* Rotating gradient ring */}
                  <div style={{
                    position: "absolute", inset: "-3px", borderRadius: "50%",
                    background: "conic-gradient(#F4A61D, #00D4FF, #A855F7, #F4A61D)",
                    animation: "spin 4s linear infinite",
                  }} />
                  <div style={{
                    position: "absolute", inset: "2px", borderRadius: "50%",
                    background: "#080B14",
                    overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{
                        fontFamily: "'Bebas Neue', cursive", fontSize: "3rem",
                        background: "linear-gradient(135deg,#F4A61D,#00D4FF)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      }}>YN</span>
                    )}
                  </div>
                  {/* Hover overlay */}
                  <div className="overlay" style={{
                    position: "absolute", inset: "2px", borderRadius: "50%",
                    background: "rgba(0,0,0,0.6)", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", opacity: 0,
                    transition: "opacity 0.25s", gap: "4px",
                  }}>
                    <span style={{ fontSize: "1.3rem" }}>📷</span>
                    <span style={{ fontSize: "0.6rem", color: "#fff", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700 }}>
                      {profilePhoto ? "Change" : "Upload"}
                    </span>
                  </div>
                  {/* Online dot */}
                  <div style={{
                    position: "absolute", bottom: "6px", right: "6px",
                    width: "13px", height: "13px", borderRadius: "50%",
                    background: "#22C55E", border: "2.5px solid #080B14",
                    boxShadow: "0 0 8px rgba(34,197,94,0.8)", zIndex: 2,
                  }} />
                </div>

                {/* Info + buttons */}
                <div>
                  <p style={{ fontSize: "0.7rem", color: "#666", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                    Profile Photo
                  </p>
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                    <button
                      onClick={() => photoInputRef.current && photoInputRef.current.click()}
                      style={{
                        padding: "0.45rem 1rem",
                        background: "rgba(244,166,29,0.12)",
                        border: "1px solid rgba(244,166,29,0.5)",
                        borderRadius: "6px", color: "#F4A61D",
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700, fontSize: "0.75rem",
                        letterSpacing: "1px", cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,166,29,0.22)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(244,166,29,0.12)"; }}
                    >
                      {profilePhoto ? "↺ Change" : "↑ Upload"}
                    </button>

                  </div>
                  <p style={{ fontSize: "0.65rem", color: "#444", marginTop: "0.5rem", letterSpacing: "0.5px" }}>
                    Click avatar or button · JPG, PNG, WEBP
                  </p>
                </div>
              </div>

              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

              <div style={styles.heroTag}>
                <span style={{ width: "30px", height: "1px", background: "#F4A61D", display: "inline-block" }} />
              Forex Trader · Full Stack Dev · IT Student
              </div>
              <h1 style={styles.heroTitle}>Yabibal.M</h1>
              <div style={styles.heroSubtitle}>BUILDING THE FUTURE</div>
              <p style={styles.heroBio}>
                I trade currencies, build full-stack applications, and push the boundaries of technology as an IT student. Where financial markets meet clean code — that's where I live.
              </p>
              <div style={styles.heroBtns}>
                <button style={styles.btnGold} onClick={() => setActive("Projects")}>View My Work</button>
                <button style={styles.btnOutline} onClick={() => setActive("Contact")}>Get In Touch</button>
              </div>
              <div style={styles.statsRow}>
                {[["3+", "Years Trading"], ["10+", "Projects Built"], ["5+", "IT Certifications"], ["24/7", "Markets Watched"]].map(([n, l]) => (
                  <div key={l} style={styles.statItem}>
                    <div style={styles.statNum}>{n}</div>
                    <div style={styles.statLabel}>{l}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ABOUT */}
          {active === "About" && (
            <section style={styles.section}>
              <div style={styles.sectionTag}>// Who I Am</div>
              <h2 style={styles.sectionTitle}>ABOUT ME</h2>
              <div style={styles.divider} />
              <div style={styles.aboutGrid}>
                <div style={styles.avatarBox}>
                  <div style={styles.avatarBg} />
                  <div style={styles.avatarInitials}>YN</div>
                </div>
                <div>
                  <p style={styles.aboutText}>
                    I'm a multidisciplinary professional blending the analytical world of forex trading with the creative power of full-stack development. Currently pursuing my IT degree while actively trading currency pairs and building scalable web applications.
                  </p>
                  <p style={styles.aboutText}>
                    My trading background gives me a unique edge in data analysis, risk management, and making fast, informed decisions — skills that translate directly into building robust software systems.
                  </p>
                  <p style={styles.aboutText}>
                    When I'm not at the charts or behind a terminal, I'm studying emerging tech trends, experimenting with algorithmic trading strategies, or contributing to open-source projects.
                  </p>
                  <div style={styles.badgeRow}>
                    {["🇺🇸 English", "📍 Available Remote", "📚 IT Student", "📈 Forex Trader", "💻 Full Stack Dev"].map((b) => (
                      <span key={b} style={styles.badge}>{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SKILLS */}
          {active === "Skills" && (
            <section style={styles.section}>
              <div style={styles.sectionTag}>// What I Do</div>
              <h2 style={styles.sectionTitle}>MY SKILLS</h2>
              <div style={styles.divider} />
              <div style={styles.skillGrid}>
                {skillGroups.map((g) => (
                  <div key={g.label} style={styles.skillCard}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(244,166,29,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; }}>
                    <div style={styles.skillCardIcon}>{g.icon}</div>
                    <div style={styles.skillCardLabel}>{g.label}</div>
                    <div>{g.skills.map((s) => <span key={s} style={styles.skillPill}>{s}</span>)}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {active === "Projects" && (
            <section style={styles.section}>
              <div style={styles.sectionTag}>// What I've Built</div>
              <h2 style={styles.sectionTitle}>PROJECTS</h2>
              <div style={styles.divider} />
              <button style={styles.addBtn} onClick={() => setShowAddProject(true)}>
                ＋ Add Project
              </button>
              <div style={styles.projectGrid}>
                {projects.map((p) => (
                  <div key={p.id} style={styles.projectCard(p.color)}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                    <div style={styles.projectAccent(p.color)} />
                    <div style={styles.projectYear}>{p.year}</div>
                    <div style={styles.projectTitle}>{p.title}</div>
                    <p style={styles.projectDesc}>{p.description}</p>
                    <div style={styles.tagRow}>
                      {(Array.isArray(p.tags) ? p.tags : []).map((t) => (
                        <span key={t} style={styles.tag(p.color)}>{t}</span>
                      ))}
                    </div>
                    <button style={styles.deleteBtn} onClick={() => deleteProject(p.id)}>✕ Remove</button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TASKS */}
          {active === "Tasks" && (
            <section style={styles.section}>
              <div style={styles.sectionTag}>// My Workflow</div>
              <h2 style={styles.sectionTitle}>TASK BOARD</h2>
              <div style={styles.divider} />
              <button style={styles.addBtn} onClick={() => setShowAddTask(true)}>
                ＋ Add Task
              </button>
              <div style={{ maxWidth: "680px" }}>
                {tasks.length === 0 && (
                  <div style={{ color: "#555", textAlign: "center", padding: "3rem", border: "1px dashed #333", borderRadius: "12px" }}>
                    No tasks yet. Add one above!
                  </div>
                )}
                {tasks.map((t) => (
                  <div key={t.id} style={styles.taskItem(t.done)}>
                    <div style={styles.checkbox(t.done)} onClick={() => toggleTask(t.id)}>
                      {t.done && <span style={{ color: "#fff", fontSize: "0.7rem" }}>✓</span>}
                    </div>
                    <span style={styles.taskTitle(t.done)}>{t.title}</span>
                    <span style={styles.priorityBadge(t.priority)}>{t.priority}</span>
                    <button style={{ ...styles.deleteBtn, marginLeft: "auto" }} onClick={() => deleteTask(t.id)}>✕</button>
                  </div>
                ))}
                <div style={{ marginTop: "2rem", padding: "1rem 1.5rem", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "2rem" }}>
                  <span style={{ color: "#22C55E", fontSize: "0.85rem" }}>✓ Done: {tasks.filter(t => t.done).length}</span>
                  <span style={{ color: "#F4A61D", fontSize: "0.85rem" }}>⏳ Pending: {tasks.filter(t => !t.done).length}</span>
                  <span style={{ color: "#9CA3AF", fontSize: "0.85rem" }}>Total: {tasks.length}</span>
                </div>
              </div>
            </section>
          )}

          {/* CONTACT */}
          {active === "Contact" && (
            <section style={styles.section}>
              <div style={styles.sectionTag}>// Let's Connect</div>
              <h2 style={styles.sectionTitle}>GET IN TOUCH</h2>
              <div style={styles.divider} />
              <div style={styles.contactGrid}>
                <div style={styles.contactInfo}>
                  {[
                    { icon: "📧", label: "Email", value: "yabudreamer3@gmail.com" },
                    { icon: "📱", label: "Phone", value: "+251935944002" },
                    { icon: "🌐", label: "Location", value: "Addis Abeba, Eyhiopia" },
                    { icon: "💼", label: "Telegram", value: " Casopia_9" },
                    { icon: "🐙", label: "GitHub", value: "/casopia3" },
                  ].map((c) => (
                    <div key={c.label} style={styles.contactInfoItem}>
                      <div style={styles.contactIcon}>{c.icon}</div>
                      <div>
                        <div style={styles.contactLabel}>{c.label}</div>
                        <div style={styles.contactValue}>{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  {sent && <div style={styles.successMsg}>✅ Message sent! I'll get back to you soon.</div>}
                  <form onSubmit={handleContact}>
                    <input
                      style={styles.input} placeholder="Your Name"
                      value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} required
                    />
                    <input
                      style={styles.input} placeholder="Your Email" type="email"
                      value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} required
                    />
                    <textarea
                      style={styles.textarea} placeholder="Your Message"
                      value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} required
                    />
                    <button type="submit" style={{ ...styles.btnGold, width: "100%" }}>Send Message →</button>
                  </form>
                </div>
              </div>
            </section>
          )}

          <footer style={styles.footer}>
            © {new Date().getFullYear()} Yabibal · Forex Trader · Full Stack Developer · IT Student
          </footer>
        </div>

        {/* ADD PROJECT MODAL */}
        {showAddProject && (
          <div style={styles.modal} onClick={e => { if (e.target === e.currentTarget) setShowAddProject(false); }}>
            <div style={styles.modalBox}>
              <div style={styles.modalTitle}>ADD PROJECT</div>
              <input style={styles.input} placeholder="Project Title *" value={newProject.title}
                onChange={e => setNewProject({ ...newProject, title: e.target.value })} />
              <textarea style={styles.textarea} placeholder="Description"
                value={newProject.description}
                onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
              <input style={styles.input} placeholder="Tags (comma separated)" value={newProject.tags}
                onChange={e => setNewProject({ ...newProject, tags: e.target.value })} />
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>Accent Color:</label>
                <input type="color" value={newProject.color}
                  onChange={e => setNewProject({ ...newProject, color: e.target.value })}
                  style={{ width: "40px", height: "36px", borderRadius: "6px", border: "none", background: "transparent", cursor: "pointer" }} />
              </div>
              <div style={styles.modalBtns}>
                <button style={styles.cancelBtn} onClick={() => setShowAddProject(false)}>Cancel</button>
                <button style={styles.btnGold} onClick={addProject}>Add Project</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD TASK MODAL */}
        {showAddTask && (
          <div style={styles.modal} onClick={e => { if (e.target === e.currentTarget) setShowAddTask(false); }}>
            <div style={styles.modalBox}>
              <div style={styles.modalTitle}>ADD TASK</div>
              <input style={styles.input} placeholder="Task Title *" value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
              <select style={styles.select} value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <div style={styles.modalBtns}>
                <button style={styles.cancelBtn} onClick={() => setShowAddTask(false)}>Cancel</button>
                <button style={styles.btnGold} onClick={addTask}>Add Task</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
