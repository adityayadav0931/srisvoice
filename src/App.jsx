import { useState, useEffect, useRef } from "react";

// ── Fonts ──────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap";
document.head.appendChild(fontLink);

// ── Styles ─────────────────────────────────────────────────────────────────
const injectStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Sora', sans-serif; background: #050510; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #787BCB55; border-radius: 4px; }

    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes pulse-ring {
      0%{transform:scale(1);opacity:0.8}
      100%{transform:scale(1.8);opacity:0}
    }
    @keyframes pulse-ring2 {
      0%{transform:scale(1);opacity:0.5}
      100%{transform:scale(2.3);opacity:0}
    }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
    @keyframes slideUp {
      from{transform:translateY(30px);opacity:0}
      to{transform:translateY(0);opacity:1}
    }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes scoreCount {
      from{transform:scale(0.5);opacity:0}
      to{transform:scale(1);opacity:1}
    }
    @keyframes shimmer {
      0%{background-position:-200% 0}
      100%{background-position:200% 0}
    }
    @keyframes waveform {
      0%,100%{height:4px} 50%{height:20px}
    }
    @keyframes confetti-fall {
      0%{transform:translateY(-20px) rotate(0deg);opacity:1}
      100%{transform:translateY(300px) rotate(720deg);opacity:0}
    }
    @keyframes gradient-shift {
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }
    .slide-up { animation: slideUp 0.4s ease forwards; }
    .fade-in { animation: fadeIn 0.4s ease forwards; }
    .float-anim { animation: float 3s ease-in-out infinite; }
    .spin-anim { animation: spin 1.2s linear infinite; }

    .screen { animation: slideUp 0.35s cubic-bezier(.22,.68,0,1.2) forwards; }

    .btn-primary {
      background: linear-gradient(135deg, #787BCB, #5A5DB8);
      border: none; border-radius: 50px; color: white;
      font-family: 'Sora', sans-serif; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
      box-shadow: 0 8px 24px #787BCB55;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px #787BCB77; }
    .btn-primary:active { transform: translateY(0); }

    .btn-ghost {
      background: transparent; border: 1.5px solid #2A2A4A;
      border-radius: 50px; color: #B0B3C6;
      font-family: 'Sora', sans-serif; font-weight: 500;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-ghost:hover { border-color: #787BCB; color: #787BCB; }

    .glass-card {
      background: rgba(26,26,46,0.8);
      border: 1px solid rgba(255,255,255,0.06);
      backdrop-filter: blur(20px);
      border-radius: 20px;
    }
    .input-field {
      background: #1A1A2E; border: 1.5px solid #2A2A4A;
      border-radius: 14px; color: white; padding: 14px 16px 14px 44px;
      font-family: 'Sora', sans-serif; font-size: 14px; width: 100%;
      outline: none; transition: border-color 0.2s;
    }
    .input-field:focus { border-color: #787BCB; }
    .input-field::placeholder { color: #555575; }

    .tab-btn {
      flex: 1; padding: 10px; border: none; background: transparent;
      font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500;
      cursor: pointer; border-radius: 10px; transition: all 0.2s; color: #555575;
    }
    .tab-btn.active { background: #787BCB22; color: #787BCB; }

    .xp-bar-fill {
      height: 100%; background: linear-gradient(90deg, #FFD700, #FF8C00);
      border-radius: 4px; transition: width 1s cubic-bezier(.22,.68,0,1.2);
    }
    .score-ring {
      transition: stroke-dashoffset 1.2s cubic-bezier(.22,.68,0,1.2);
    }
    .waveform-bar {
      width: 3px; background: #787BCB; border-radius: 3px;
      display: inline-block; margin: 0 1.5px;
      animation: waveform 0.8s ease-in-out infinite;
    }
    .nav-item {
      display: flex; flex-direction: column; align-items: center;
      gap: 3px; cursor: pointer; flex: 1; padding: 6px 0;
      border: none; background: transparent; color: #555575;
      font-family: 'Sora', sans-serif; font-size: 10px;
      transition: color 0.2s;
    }
    .nav-item.active { color: #787BCB; }
    .nav-item svg { transition: transform 0.2s; }
    .nav-item.active svg { transform: scale(1.1); }

    .mistake-card {
      background: #1A1A2E; border: 1px solid rgba(255,80,80,0.2);
      border-radius: 14px; padding: 14px; margin-bottom: 10px;
    }
    .correct-tag {
      background: rgba(76,175,80,0.15); color: #4CAF50;
      border-radius: 8px; padding: 2px 8px; font-size: 11px; font-weight: 600;
    }
    .wrong-tag {
      background: rgba(229,57,53,0.15); color: #E53935;
      border-radius: 8px; padding: 2px 8px; font-size: 11px; font-weight: 600;
      text-decoration: line-through;
    }
    .confetti-piece {
      position: absolute; width: 8px; height: 8px; border-radius: 2px;
      animation: confetti-fall 2s ease-in forwards;
    }
    .pulse-dot {
      width: 8px; height: 8px; background: #4CAF50; border-radius: 50%;
      animation: blink 1.2s ease-in-out infinite;
    }
    .gradient-text {
      background: linear-gradient(135deg, #787BCB, #9B9EE0);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .level-badge {
      background: linear-gradient(135deg, #FFD700, #FF8C00);
      border-radius: 20px; padding: 3px 10px;
      font-size: 11px; font-weight: 700; color: white;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .skill-chip {
      background: #1A1A2E; border: 1.5px solid #2A2A4A;
      border-radius: 24px; padding: 8px 16px;
      font-size: 13px; cursor: pointer; transition: all 0.2s;
      color: #B0B3C6; font-family: 'Sora', sans-serif;
    }
    .skill-chip.selected {
      background: linear-gradient(135deg, #787BCB22, #5A5DB822);
      border-color: #787BCB; color: white;
    }
    .stat-pill {
      background: #1A1A2E; border: 1px solid #2A2A4A;
      border-radius: 12px; padding: 12px 10px; text-align: center; flex: 1;
    }
    .mesh-bg {
      background: radial-gradient(ellipse at 20% 20%, #787BCB18 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 80%, #5A5DB815 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 50%, #9B9EE008 0%, transparent 70%);
    }
  `;
  document.head.appendChild(style);
};
injectStyles();

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    mic: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    micOff: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    phoneOff: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="18" width="12" height="4"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    fire: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    bolt: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    volume: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    brain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    back: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    grid: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  };
  return icons[name] || null;
};

// ── Screens ────────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  useEffect(() => { setTimeout(onDone, 2200); }, []);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #0F0F1A 0%, #1A1A3E 100%)" }}>
      <div className="float-anim" style={{ marginBottom: 28 }}>
        <div style={{ width: 96, height: 96, borderRadius: 28, background: "linear-gradient(135deg, #787BCB, #5A5DB8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px #787BCB66" }}>
          <Icon name="mic" size={46} color="white" />
        </div>
      </div>
      <div style={{ fontSize: 40, fontWeight: 800, color: "white", letterSpacing: -1 }}>SrisVoice</div>
      <div style={{ color: "#787BCB", fontSize: 14, marginTop: 6, fontWeight: 500 }}>Speak English Confidently</div>
      <div style={{ marginTop: 48, display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: "#787BCB", animation: `blink 1s ease-in-out ${i * 0.3}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, onRegister, onPhone }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div className="screen mesh-bg" style={{ height: "100%", overflowY: "auto", padding: "0 24px 32px" }}>
      <div style={{ paddingTop: 56 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#787BCB,#5A5DB8)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
          <Icon name="mic" size={26} color="white" />
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "white", marginBottom: 6 }}>Welcome back 👋</div>
        <div style={{ color: "#666688", fontSize: 14, marginBottom: 36 }}>Continue your English journey</div>

        <div style={{ position: "relative", marginBottom: 14 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#555575" }}>✉️</span>
          <input className="input-field" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        </div>
        <div style={{ position: "relative", marginBottom: 28 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#555575" }}>🔒</span>
          <input className="input-field" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} type="password" />
        </div>

        <button className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: 15 }} onClick={onLogin}>Login</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#1E1E38" }} />
          <span style={{ color: "#444466", fontSize: 13 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#1E1E38" }} />
        </div>

        <button className="btn-ghost" style={{ width: "100%", padding: "15px", fontSize: 14 }} onClick={onPhone}>
          📱 Continue with Phone Number
        </button>

        <div style={{ textAlign: "center", marginTop: 28, color: "#555575", fontSize: 14 }}>
          Don't have an account?{" "}
          <span style={{ color: "#787BCB", fontWeight: 600, cursor: "pointer" }} onClick={onRegister}>Sign Up</span>
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ onDone, onBack }) {
  const [skill, setSkill] = useState("beginner");
  return (
    <div className="screen mesh-bg" style={{ height: "100%", overflowY: "auto", padding: "0 24px 32px" }}>
      <div style={{ paddingTop: 48 }}>
        <button style={{ background: "none", border: "none", color: "#B0B3C6", cursor: "pointer", marginBottom: 20 }} onClick={onBack}><Icon name="back" size={22} color="#B0B3C6" /></button>
        <div style={{ fontSize: 26, fontWeight: 800, color: "white", marginBottom: 6 }}>Join SrisVoice 🚀</div>
        <div style={{ color: "#666688", fontSize: 14, marginBottom: 32 }}>Start your English journey today</div>

        {["Full Name", "Email", "Password"].map((label, i) => (
          <div key={i} style={{ position: "relative", marginBottom: 14 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#555575" }}>{["👤","✉️","🔒"][i]}</span>
            <input className="input-field" placeholder={label} type={i === 2 ? "password" : "text"} />
          </div>
        ))}

        <div style={{ marginBottom: 24 }}>
          <div style={{ color: "#B0B3C6", fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Your English Level</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["beginner", "intermediate", "advanced"].map(s => (
              <button key={s} className={`skill-chip ${skill === s ? "selected" : ""}`} onClick={() => setSkill(s)} style={{ flex: 1 }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: 15 }} onClick={onDone}>Create Account</button>
      </div>
    </div>
  );
}

function Dashboard({ onStartPractice, onLeaderboard, onProfile, onPremium, onRoadmap, onAiTeacher, onVoiceRooms, onAnalytics, streak = 7, xp = 1240 }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setTimeout(() => setAnimate(true), 200); }, []);
  const xpProgress = ((xp - 500) / (1500 - 500)) * 100;

  return (
    <div className="screen mesh-bg" style={{ height: "100%", overflowY: "auto", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "52px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "#666688", fontSize: 13 }}>Good Evening 👋</div>
          <div style={{ color: "white", fontSize: 22, fontWeight: 700, marginTop: 2 }}>Rahul Sharma</div>
        </div>
        <div onClick={onProfile} style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#787BCB,#5A5DB8)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 700, fontSize: 18, color: "white" }}>R</div>
      </div>

      {/* XP Card */}
      <div style={{ margin: "20px 20px 0" }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 17 }}>Explorer</div>
              <div style={{ color: "#FFD700", fontSize: 12, marginTop: 2 }}>⚡ {xp} XP</div>
            </div>
            <div className="level-badge">🚀 {Math.round(xpProgress)}%</div>
          </div>
          <div style={{ height: 8, background: "#2A2A4A", borderRadius: 4, overflow: "hidden" }}>
            <div className="xp-bar-fill" style={{ width: `${animate ? xpProgress : 0}%` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ color: "#555575", fontSize: 11 }}>12 sessions</span>
            <span style={{ color: "#555575", fontSize: 11 }}>Next: Communicator</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: 10, margin: "14px 20px 0" }}>
        {[
          { icon: "🔥", label: "Day Streak", val: streak },
          { icon: "⏱️", label: "Total Mins", val: 187 },
          { icon: "⭐", label: "Avg Score", val: 74 },
        ].map((s, i) => (
          <div key={i} className="stat-pill">
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 18 }}>{s.val}</div>
            <div style={{ color: "#555575", fontSize: 10, marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Premium Upgrade Banner */}
      <div style={{ margin: "14px 20px 0" }}>
        <div onClick={onPremium} style={{ background: "linear-gradient(135deg,#1A1200,#2A1E00)", border: "1px solid #FFD70055", borderRadius: 18, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <span style={{ fontSize: 26 }}>👑</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#FFD700", fontWeight: 700, fontSize: 13 }}>Upgrade to Gold — ₹399/mo</div>
            <div style={{ color: "#887730", fontSize: 11, marginTop: 2 }}>Interview mode, AI roleplay & more →</div>
          </div>
          <div style={{ background: "linear-gradient(135deg,#FFD700,#FF8C00)", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "black" }}>Upgrade</div>
        </div>
      </div>

      {/* Start Practice CTA */}
      <div style={{ margin: "12px 20px 0" }}>
        <button onClick={onStartPractice} style={{ width: "100%", height: 110, background: "linear-gradient(135deg, #787BCB, #5A5DB8)", border: "none", borderRadius: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", boxShadow: "0 10px 30px #787BCB55" }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "white", fontSize: 22, fontWeight: 800 }}>Start Practice</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>Connect with a partner now</div>
          </div>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: "white", fontSize: 28 }}>▶</div>
          </div>
        </button>
      </div>

      {/* Practice Options */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ color: "white", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Practice Options</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { icon: "🤖", label: "AI Teacher", sub: "Practice with AI", color: "#7E57C2", action: onAiTeacher },
            { icon: "👥", label: "Peer Call", sub: "Talk with real users", color: "#26A69A", action: onStartPractice },
            { icon: "🎯", label: "Topic Talk", sub: "60-Day Roadmap", color: "#EF6C00", action: onRoadmap },
            { icon: "🎙️", label: "Voice Rooms", sub: "Discord-style rooms", color: "#00BCD4", action: onVoiceRooms },
            { icon: "📊", label: "Analytics", sub: "Track your progress", color: "#66BB6A", action: onAnalytics },
            { icon: "👑", label: "Go Premium", sub: "Unlock all features", color: "#FFD700", action: onPremium },
          ].map((opt, i) => (
            <div key={i} className="glass-card" onClick={opt.action} style={{ padding: 16, cursor: "pointer", transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${opt.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>{opt.icon}</div>
              <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{opt.label}</div>
              <div style={{ color: "#555575", fontSize: 12, marginTop: 2 }}>{opt.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MatchingScreen({ onMatched, onBack }) {
  const [phase, setPhase] = useState("setup"); // setup | searching | matched
  const [skill, setSkill] = useState("beginner");
  const [topics, setTopics] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const allTopics = ["Daily Life","Work & Career","Travel","Technology","Food","Sports","Movies","News","Education","Health","Interview Prep"];

  useEffect(() => {
    if (phase !== "searching") return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    const match = setTimeout(() => { clearInterval(t); setPhase("matched"); setTimeout(onMatched, 1000); }, 4500);
    return () => { clearInterval(t); clearTimeout(match); };
  }, [phase]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  if (phase === "setup") return (
    <div className="screen mesh-bg" style={{ height: "100%", overflowY: "auto", padding: "0 24px 32px" }}>
      <div style={{ paddingTop: 48 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 20 }} onClick={onBack}><Icon name="back" size={22} color="#B0B3C6" /></button>
        <div style={{ color: "white", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Find a Partner</div>
        <div style={{ color: "#666688", fontSize: 14, marginBottom: 30 }}>Set preferences for the best match</div>

        <div style={{ color: "#B0B3C6", fontWeight: 600, marginBottom: 12 }}>Your Level</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {["beginner","intermediate","advanced"].map(s => (
            <button key={s} className={`skill-chip ${skill === s ? "selected" : ""}`} onClick={() => setSkill(s)} style={{ flex: 1 }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ color: "#B0B3C6", fontWeight: 600, marginBottom: 12 }}>Topics (optional)</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
          {allTopics.map(t => (
            <button key={t} className={`skill-chip ${topics.includes(t) ? "selected" : ""}`} onClick={() => setTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : prev.length < 3 ? [...prev, t] : prev)} style={{ fontSize: 12, padding: "7px 12px" }}>{t}</button>
          ))}
        </div>

        <button className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: 15 }} onClick={() => setPhase("searching")}>
          🔍 Find a Partner
        </button>
      </div>
    </div>
  );

  return (
    <div className="screen mesh-bg" style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {phase === "matched" ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <div style={{ color: "white", fontSize: 26, fontWeight: 800 }}>Match Found!</div>
          <div style={{ color: "#787BCB", marginTop: 8 }}>Connecting you...</div>
        </div>
      ) : (
        <>
          <div style={{ position: "relative", width: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
            <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: "2px solid #787BCB", animation: "pulse-ring 2s ease-out infinite" }} />
            <div style={{ position: "absolute", width: "140%", height: "140%", borderRadius: "50%", border: "1px solid #787BCB55", animation: "pulse-ring2 2s ease-out 0.5s infinite" }} />
            <div style={{ width: 110, height: 110, borderRadius: "50%", background: "linear-gradient(135deg,#787BCB,#5A5DB8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px #787BCB66", zIndex: 1 }}>
              <Icon name="search" size={46} color="white" />
            </div>
          </div>

          <div style={{ color: "white", fontSize: 22, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>Finding your partner...</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 40, fontWeight: 700, color: "#787BCB", marginBottom: 10 }}>{fmt(seconds)}</div>
          <div style={{ color: "#555575", fontSize: 13, marginBottom: 48 }}>🟢 23 people online right now</div>

          <button className="btn-ghost" onClick={() => { setPhase("setup"); setSeconds(0); }} style={{ padding: "13px 32px", fontSize: 14, borderColor: "#E53935", color: "#E53935" }}>Cancel Search</button>
        </>
      )}
    </div>
  );
}

function CallScreen({ onEnd }) {
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [phase, setPhase] = useState("connecting");

  useEffect(() => {
    const conn = setTimeout(() => setPhase("connected"), 1500);
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => { clearTimeout(conn); clearInterval(t); };
  }, []);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  return (
    <div className="screen" style={{ height: "100%", background: "linear-gradient(160deg, #0F0F1A 0%, #1A1A3E 100%)", display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div style={{ padding: "52px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: phase === "connected" ? "rgba(76,175,80,0.15)" : "rgba(255,152,0,0.15)", borderRadius: 20, padding: "4px 12px", border: `1px solid ${phase === "connected" ? "#4CAF5055" : "#FF980055"}` }}>
          <div className="pulse-dot" style={{ background: phase === "connected" ? "#4CAF50" : "#FF9800" }} />
          <span style={{ color: phase === "connected" ? "#4CAF50" : "#FF9800", fontSize: 12, fontWeight: 600 }}>{phase === "connected" ? "Live" : "Connecting..."}</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: "white" }}>{fmt(seconds)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "red", animation: "blink 1s infinite" }} />
          <span style={{ color: "red", fontSize: 11 }}>REC</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* Partner avatar */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg,#26A69A,#00695C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, color: "white", boxShadow: "0 0 40px #26A69A55", animation: phase === "connected" ? "float 2.5s ease-in-out infinite" : "none" }}>P</div>
        </div>
        <div style={{ color: "white", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Priya Verma</div>
        <div style={{ color: "#4CAF50", fontSize: 14, marginBottom: 28 }}>
          {phase === "connected" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.15}s`, height: 4 }} />
              ))}
              <span style={{ marginLeft: 4 }}>Speaking</span>
            </div>
          ) : "Connecting..."}
        </div>

        {/* Waveform visualization */}
        {phase === "connected" && (
          <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 16, height: 40 }}>
            {Array(18).fill(0).map((_, i) => (
              <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.07}s`, opacity: 0.6 + Math.random() * 0.4 }} />
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ padding: "0 32px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
          {/* Mute */}
          <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setMuted(!muted)}>
            <div style={{ width: 58, height: 58, borderRadius: "50%", background: muted ? "rgba(229,57,53,0.2)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, border: `1px solid ${muted ? "rgba(229,57,53,0.4)" : "rgba(255,255,255,0.1)"}` }}>
              <Icon name={muted ? "micOff" : "mic"} size={24} color={muted ? "#E53935" : "white"} />
            </div>
            <div style={{ color: "#666688", fontSize: 11 }}>{muted ? "Unmute" : "Mute"}</div>
          </div>

          {/* End Call */}
          <div style={{ textAlign: "center", cursor: "pointer" }} onClick={onEnd}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#E53935,#B71C1C)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(229,57,53,0.5)" }}>
              <Icon name="phoneOff" size={30} color="white" />
            </div>
            <div style={{ color: "#666688", fontSize: 11, marginTop: 6 }}>End Call</div>
          </div>

          {/* Speaker */}
          <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setSpeaker(!speaker)}>
            <div style={{ width: 58, height: 58, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, border: "1px solid rgba(255,255,255,0.1)" }}>
              <Icon name="volume" size={24} color={speaker ? "white" : "#555575"} />
            </div>
            <div style={{ color: "#666688", fontSize: 11 }}>{speaker ? "Speaker" : "Earpiece"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackScreen({ onPracticeAgain, onDashboard }) {
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    setTimeout(() => setShowConfetti(true), 600);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const scores = { overall: 78, fluency: 82, grammar: 74, vocabulary: 79 };
  const mistakes = [
    { wrong: "I goed to market", correct: "I went to the market", type: "tense", note: "Irregular past tense: go → went" },
    { wrong: "He is more taller", correct: "He is taller", type: "comparison", note: "Don't use 'more' with comparative adjectives" },
  ];
  const suggestions = ["Use more transitional phrases like 'furthermore', 'in addition'", "Try to speak at a slightly slower pace for clearer pronunciation", "Great job using complex sentence structures!"];

  const confettiPieces = showConfetti ? Array(20).fill(0).map((_, i) => ({
    x: Math.random() * 100, color: ["#787BCB","#FFD700","#4CAF50","#E53935","#FF9800"][i % 5],
    delay: Math.random() * 0.8,
  })) : [];

  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (mounted ? scores.overall / 100 : 0) * circumference;
  const scoreColor = s => s >= 80 ? "#4CAF50" : s >= 60 ? "#FF9800" : "#E53935";

  return (
    <div className="screen" style={{ height: "100%", overflowY: "auto", background: "#0A0A14", position: "relative" }}>
      {/* Confetti */}
      {confettiPieces.map((p, i) => (
        <div key={i} className="confetti-piece" style={{ left: `${p.x}%`, top: 0, background: p.color, animationDelay: `${p.delay}s` }} />
      ))}

      <div style={{ padding: "52px 20px 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ color: "white", fontSize: 20, fontWeight: 800 }}>AI Feedback ✨</div>
          <button onClick={onDashboard} style={{ background: "none", border: "1px solid #2A2A4A", borderRadius: 20, color: "#787BCB", padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "'Sora', sans-serif" }}>Done</button>
        </div>

        {/* Overall Score */}
        <div className="glass-card" style={{ padding: 24, textAlign: "center", marginBottom: 16, border: `1px solid ${scoreColor(scores.overall)}33` }}>
          <div style={{ color: scoreColor(scores.overall), fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Great Job! 🎉</div>
          <svg width="140" height="140" style={{ display: "block", margin: "0 auto" }}>
            <circle cx="70" cy="70" r="50" fill="none" stroke="#1A1A2E" strokeWidth="10" />
            <circle cx="70" cy="70" r="50" fill="none" stroke={scoreColor(scores.overall)} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              transform="rotate(-90 70 70)"
              className="score-ring"
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,.68,0,1.2)" }} />
            <text x="70" y="65" textAnchor="middle" fill="white" fontSize="28" fontWeight="800" fontFamily="Sora">{scores.overall}</text>
            <text x="70" y="84" textAnchor="middle" fill="#666688" fontSize="12" fontFamily="Sora">/100</text>
          </svg>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14 }}>
            <span style={{ color: "#555575", fontSize: 12 }}>⏱ 3m 42s</span>
            <span style={{ color: "#555575", fontSize: 12 }}>📝 147 words</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="glass-card" style={{ padding: 18, marginBottom: 16 }}>
          {[["Fluency 🎙️", scores.fluency], ["Grammar ✍️", scores.grammar], ["Vocabulary 📚", scores.vocabulary]].map(([label, score], i) => (
            <div key={i} style={{ marginBottom: i < 2 ? 14 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#B0B3C6", fontSize: 13 }}>{label}</span>
                <span style={{ color: scoreColor(score), fontWeight: 700, fontSize: 13 }}>{score}</span>
              </div>
              <div style={{ height: 6, background: "#2A2A4A", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: mounted ? `${score}%` : "0%", background: `linear-gradient(90deg, ${scoreColor(score)}, ${scoreColor(score)}aa)`, borderRadius: 3, transition: `width 1s ${0.3 + i * 0.15}s cubic-bezier(.22,.68,0,1.2)` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Grammar Mistakes */}
        <div style={{ color: "white", fontWeight: 700, fontSize: 15, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          🔴 Grammar Corrections
        </div>
        {mistakes.map((m, i) => (
          <div key={i} className="mistake-card">
            <div style={{ display: "inline-block", background: "rgba(229,57,53,0.15)", color: "#E53935", borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 600, marginBottom: 10 }}>{m.type}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <div style={{ color: "#777", fontSize: 10, marginBottom: 2 }}>Wrong</div>
                <span className="wrong-tag">{m.wrong}</span>
              </div>
              <div style={{ color: "#444", fontSize: 18 }}>→</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#777", fontSize: 10, marginBottom: 2 }}>Correct</div>
                <span className="correct-tag">{m.correct}</span>
              </div>
            </div>
            <div style={{ color: "#666688", fontSize: 12 }}>💡 {m.note}</div>
          </div>
        ))}

        {/* Suggestions */}
        <div style={{ color: "white", fontWeight: 700, fontSize: 15, marginBottom: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
          💡 Tips to Improve
        </div>
        {suggestions.map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: "12px 14px", marginBottom: 8, display: "flex", gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#FFD700", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
            <span style={{ color: "#B0B3C6", fontSize: 13, lineHeight: 1.5 }}>{s}</span>
          </div>
        ))}

        {/* Strong Points */}
        <div style={{ color: "white", fontWeight: 700, fontSize: 15, marginBottom: 12, marginTop: 8 }}>
          ✅ Strong Points
        </div>
        <div className="glass-card" style={{ padding: 16, marginBottom: 20, border: "1px solid rgba(76,175,80,0.2)" }}>
          {["Excellent use of complex sentences throughout", "Great natural flow and confidence", "Good variety in vocabulary choices"].map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < 2 ? 10 : 0 }}>
              <Icon name="check" size={16} color="#4CAF50" />
              <span style={{ color: "#B0B3C6", fontSize: 13 }}>{p}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <button className="btn-primary" style={{ width: "100%", padding: "15px", fontSize: 15, marginBottom: 12 }} onClick={onPracticeAgain}>🎙️ Practice Again</button>
        <button className="btn-ghost" style={{ width: "100%", padding: "15px", fontSize: 14 }} onClick={onDashboard}>Back to Dashboard</button>
      </div>
    </div>
  );
}

function ProfileScreen({ onBack }) {
  const scores = [74, 78, 72, 82, 79, 85, 80];
  const max = 100;
  const barW = 28;

  return (
    <div className="screen mesh-bg" style={{ height: "100%", overflowY: "auto", paddingBottom: 80 }}>
      <div style={{ padding: "52px 20px 0" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 20 }} onClick={onBack}><Icon name="back" size={22} color="#B0B3C6" /></button>

        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 86, height: 86, borderRadius: "50%", background: "linear-gradient(135deg,#787BCB,#5A5DB8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800, color: "white", margin: "0 auto 12px", boxShadow: "0 0 30px #787BCB44" }}>R</div>
          <div style={{ color: "white", fontSize: 20, fontWeight: 700 }}>Rahul Sharma</div>
          <div style={{ marginTop: 8 }}><span className="level-badge">⚡ Explorer</span></div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[["🎧", "Sessions", 12], ["⏱️", "Minutes", 187], ["🔥", "Streak", "7 Days"], ["⭐", "Avg Score", "74/100"]].map(([icon, label, val], i) => (
            <div key={i} className="glass-card" style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ color: "white", fontSize: 18, fontWeight: 700 }}>{val}</div>
              <div style={{ color: "#555575", fontSize: 11, marginTop: 1 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="glass-card" style={{ padding: 18, marginBottom: 20 }}>
          <div style={{ color: "white", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Recent Fluency Scores</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
            {scores.map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 4 }}>
                <div style={{ fontSize: 9, color: "#787BCB", fontWeight: 600 }}>{s}</div>
                <div style={{ width: "100%", height: `${(s / max) * 65}px`, background: i === scores.length - 1 ? "linear-gradient(180deg,#787BCB,#5A5DB8)" : "#2A2A4A", borderRadius: "4px 4px 0 0", transition: "height 0.8s ease" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
              <span key={d} style={{ color: "#444466", fontSize: 9, flex: 1, textAlign: "center" }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div style={{ color: "white", fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Badges</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {["🥇 First Session","🔥 7-Day Streak","⭐ Top Scorer","🎯 100 XP"].map((b, i) => (
            <div key={i} style={{ background: "linear-gradient(135deg,#FFD70022,#FF8C0022)", border: "1px solid #FFD70044", borderRadius: 20, padding: "6px 12px", fontSize: 12, color: "#FFD700", fontWeight: 600 }}>{b}</div>
          ))}
        </div>

        {/* Settings */}
        {["✏️ Edit Profile", "🔔 Notifications", "❓ Help & Support"].map((item, i) => (
          <div key={i} className="glass-card" style={{ padding: "14px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <span style={{ color: "#B0B3C6", fontSize: 14 }}>{item}</span>
            <span style={{ color: "#444466", fontSize: 14 }}>›</span>
          </div>
        ))}
        <div className="glass-card" style={{ padding: "14px 16px", marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", border: "1px solid rgba(229,57,53,0.2)" }}>
          <span style={{ color: "#E53935", fontSize: 14 }}>🚪 Logout</span>
          <span style={{ color: "#E5393566", fontSize: 14 }}>›</span>
        </div>
      </div>
    </div>
  );
}

function LeaderboardScreen({ onBack }) {
  const [tab, setTab] = useState("xp");
  const leaders = [
    { name: "Aisha Patel", xp: 4820, streak: 34, level: "Fluent Speaker", initials: "A" },
    { name: "Rahul Sharma", xp: 1240, streak: 7, level: "Explorer", initials: "R", isMe: true },
    { name: "Priya Verma", xp: 3100, streak: 21, level: "Communicator", initials: "P" },
    { name: "Dev Kumar", xp: 2670, streak: 15, level: "Communicator", initials: "D" },
    { name: "Sneha Roy", xp: 890, streak: 5, level: "Explorer", initials: "S" },
    { name: "Arjun Singh", xp: 6200, streak: 45, level: "Expert", initials: "Ar" },
    { name: "Meera Iyer", xp: 1890, streak: 12, level: "Communicator", initials: "M" },
  ].sort((a, b) => tab === "xp" ? b.xp - a.xp : b.streak - a.streak)
   .map((u, i) => ({ ...u, rank: i + 1 }));

  const rankEmoji = r => r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : `#${r}`;
  const colors = ["#26A69A","#787BCB","#EF6C00","#E53935","#7E57C2","#00ACC1","#43A047"];

  return (
    <div className="screen mesh-bg" style={{ height: "100%", overflowY: "auto", paddingBottom: 80 }}>
      <div style={{ padding: "52px 20px 0" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 16 }} onClick={onBack}><Icon name="back" size={22} color="#B0B3C6" /></button>
        <div style={{ color: "white", fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Leaderboard 🏆</div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#0F0F1A", borderRadius: 12, padding: 4, marginBottom: 20 }}>
          <button className={`tab-btn ${tab === "xp" ? "active" : ""}`} onClick={() => setTab("xp")}>⚡ XP Points</button>
          <button className={`tab-btn ${tab === "streak" ? "active" : ""}`} onClick={() => setTab("streak")}>🔥 Streaks</button>
        </div>

        {leaders.map((u, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ padding: "14px 16px", borderRadius: 16, background: u.isMe ? "linear-gradient(135deg,#787BCB,#5A5DB8)" : "#1A1A2E", border: `1px solid ${u.isMe ? "transparent" : "#2A2A4A"}`, display: "flex", alignItems: "center", gap: 12 }}
              className={u.rank <= 3 ? "fade-in" : ""}>
              <div style={{ width: 36, textAlign: "center", fontSize: u.rank <= 3 ? 22 : 14, color: u.isMe ? "rgba(255,255,255,0.7)" : "#555575", fontWeight: 600 }}>{rankEmoji(u.rank)}</div>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: u.isMe ? "rgba(255,255,255,0.2)" : `${colors[i % colors.length]}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: u.isMe ? "white" : colors[i % colors.length], flexShrink: 0 }}>{u.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: u.isMe ? "white" : "#E0E0EE", fontWeight: 600, fontSize: 14 }}>{u.name}{u.isMe ? " (You)" : ""}</div>
                <div style={{ color: u.isMe ? "rgba(255,255,255,0.6)" : "#555575", fontSize: 11, marginTop: 1 }}>{u.level}</div>
              </div>
              <div style={{ background: u.isMe ? "rgba(255,255,255,0.2)" : "rgba(120,123,203,0.15)", borderRadius: 20, padding: "5px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 12 }}>{tab === "xp" ? "⚡" : "🔥"}</span>
                <span style={{ color: u.isMe ? "white" : "#787BCB", fontWeight: 700, fontSize: 13 }}>{tab === "xp" ? u.xp.toLocaleString() : u.streak}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════
// ██████████  AI TEACHER SYSTEM — WORLD-CLASS UPGRADE  ████████████████████
// ══════════════════════════════════════════════════════════════════════════

const AI_MODES = [
  { id:"casual",     icon:"☕", label:"Casual Chat",        sub:"Natural daily English",       color:"#4FC3F7", bg:"#001520", difficulty:"All Levels",    xpPer:"40" },
  { id:"interview",  icon:"💼", label:"Interview Coach",    sub:"Ace your next job interview", color:"#A5D6A7", bg:"#001508", difficulty:"Intermediate+",  xpPer:"60" },
  { id:"ielts",      icon:"📋", label:"IELTS Speaking",     sub:"Band 7+ speaking practice",   color:"#CE93D8", bg:"#0D0015", difficulty:"Intermediate+",  xpPer:"70" },
  { id:"debate",     icon:"⚖️",  label:"Debate Mode",       sub:"Argue & defend your views",   color:"#FFCC80", bg:"#150D00", difficulty:"Advanced",       xpPer:"80" },
  { id:"public",     icon:"🎤", label:"Public Speaking",    sub:"Stage confidence & delivery", color:"#EF9A9A", bg:"#150000", difficulty:"All Levels",    xpPer:"55" },
  { id:"grammar",    icon:"✍️",  label:"Grammar Clinic",    sub:"Fix mistakes in real-time",   color:"#80DEEA", bg:"#001015", difficulty:"All Levels",    xpPer:"45" },
  { id:"confidence", icon:"💪", label:"Confidence Builder", sub:"Speak without fear",          color:"#F48FB1", bg:"#150010", difficulty:"Beginner",       xpPer:"35" },
  { id:"daily",      icon:"🌅", label:"Daily Conversation", sub:"Real-world role-play",        color:"#C5E1A5", bg:"#050F00", difficulty:"Beginner",       xpPer:"40" },
];

const VOICE_ROOMS = [
  { id:1, name:"Daily English",    emoji:"🌅", members:23, topic:"Morning routines & habits",         level:"All levels", live:true,  isHot:true,  speakers:["A","R","P","M","D"] },
  { id:2, name:"IELTS Practice",   emoji:"📋", members:12, topic:"Part 2: Describe a memorable place", level:"B2+",       live:true,  isHot:false, speakers:["K","V","S"] },
  { id:3, name:"Debate Club",      emoji:"⚖️",  members:8,  topic:"AI will replace jobs — debate it",  level:"Advanced",  live:true,  isHot:true,  speakers:["N","T","R","A"] },
  { id:4, name:"Interview Prep",   emoji:"💼", members:6,  topic:"Tell me about yourself — practice", level:"B1+",       live:true,  isHot:false, speakers:["S","J"] },
  { id:5, name:"Beginner Space",   emoji:"🌱", members:18, topic:"Introduce yourself today",          level:"Beginner",  live:true,  isHot:false, speakers:["L","P","M","T","A","R"] },
  { id:6, name:"Story Circle",     emoji:"📖", members:9,  topic:"Narrate your best memory",          level:"All levels",live:false, isHot:false, speakers:["B","C"] },
];

const AI_STARTER = {
  casual:     "Hey! 😊 I'm **Maya**, your AI English tutor. What's on your mind today? We can chat about absolutely anything — just speak naturally and I'll help you improve!",
  interview:  "Welcome to your mock interview! 💼 I'm your interviewer today. Let's start with the classic opener — **tell me about yourself**. Take your time, there's no rush!",
  ielts:      "Good morning! I'm your IELTS examiner. 📋 We'll do a full **Part 1, 2 & 3 simulation**. First question: Do you currently work or are you a student? Please answer in 2-3 sentences.",
  debate:     "Excellent! ⚖️ Today's motion: *'Social media does more harm than good.'* I'll argue **FOR**. You argue **AGAINST**. First — tell me your opening position!",
  public:     "Great choice! 🎤 Public speaking confidence comes from practice. Give me a **60-second speech** on any topic you know well. Ready? I'm your audience. Begin!",
  grammar:    "Perfect! ✍️ Speak freely — tell me about your weekend plans. I'll **gently highlight** any grammar points and show you the improved version. No judgment, just growth! 🌱",
  confidence: "Hey, you're safe here! 💪 No grades, no judgment — just practice. Start by telling me **one thing you're excited about** right now. Even one sentence is a win!",
  daily:      "Let's role-play! 🌅 Scenario: You've just arrived at a new office on your **first day of work**. I'm your colleague. Ready? I'll start — 'Hi! You must be the new hire!'",
};

const AI_FOLLOW_UPS = [
  "That's interesting! Can you tell me **more about that**? I'd love to hear your thoughts.",
  "Great point! 🎯 Now, can you express the same idea using a **more formal phrase**?",
  "Excellent! Your fluency is improving. What do you think is the **biggest challenge** you face in English?",
  "Very good! Let's go deeper — give me an **example from your own life** to support what you just said.",
  "I love that answer! 💪 Now try to say it again, but use the word **'consequently'** somewhere in your response.",
  "That's a bold statement! Can you **defend your view** with two strong reasons?",
  "Wow, you're really thinking in English! 🔥 How about you **summarise your main point** in one powerful sentence?",
  "Perfect sentence structure! Now let's challenge you — say the **opposite** of what you just said and defend it!",
];

const GRAMMAR_CORRECTIONS = [
  { wrong:"I am agree",        right:"I agree",                 note:"'Agree' is a verb. Never use 'be + agree'.",          type:"verb form" },
  { wrong:"He don't know",     right:"He doesn't know",         note:"Third-person singular needs 'doesn't', not 'don't'.",  type:"subject-verb" },
  { wrong:"I want to told",    right:"I want to tell",          note:"After 'to', always use the base form of the verb.",    type:"infinitive" },
  { wrong:"More better",       right:"Much better",             note:"Never double comparatives. Use 'much' + adj.",         type:"comparison" },
  { wrong:"I goed there",      right:"I went there",            note:"'Go' is irregular: go → went (past tense).",           type:"irregular verb" },
  { wrong:"She is very beauty","right":"She is very beautiful", note:"Use the adjective 'beautiful', not the noun 'beauty'.",type:"word form" },
  { wrong:"I have 25 years",   right:"I am 25 years old",       note:"For age in English, use 'to be', not 'have'.",         type:"structure" },
];

const VOCAB_HIGHLIGHTS = [
  { word:"consequently",  meaning:"as a result",    example:"I practiced daily; consequently, my fluency improved." },
  { word:"elaborate",     meaning:"explain in detail", example:"Could you elaborate on that point?" },
  { word:"perspective",   meaning:"point of view",  example:"From my perspective, learning English opens doors." },
  { word:"articulate",    meaning:"express clearly", example:"She was able to articulate her ideas perfectly." },
  { word:"endeavour",     meaning:"make an effort",  example:"I will endeavour to speak more confidently." },
];

const BADGES_DATA = [
  { id:"first_session", icon:"🎯", label:"First Session",  desc:"Completed your 1st AI session",   xp:50  },
  { id:"streak_3",      icon:"🔥", label:"3-Day Streak",   desc:"Practiced 3 days in a row",        xp:75  },
  { id:"streak_7",      icon:"⚡", label:"Week Warrior",   desc:"7 consecutive days of practice",   xp:150 },
  { id:"fluency_80",    icon:"🌟", label:"Fluency Star",   desc:"Scored 80+ in a session",          xp:100 },
  { id:"words_100",     icon:"📚", label:"Word Collector", desc:"Used 100+ unique words",           xp:80  },
  { id:"interview_ace", icon:"💼", label:"Interview Ace",  desc:"Completed Interview mode",         xp:120 },
];

// ──────────────────────────────────────────────────────────────────────────
// AI TEACHER HUB SCREEN
// ──────────────────────────────────────────────────────────────────────────
function AiTeacherHub({ onBack, onStartMode, onVoiceRooms, onAnalytics }) {
  const [tab, setTab] = useState("modes");
  const [hovered, setHovered] = useState(null);
  const [pulse, setPulse] = useState(true);
  const streak = 7; const todayXP = 120; const fluency = 74;

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="screen" style={{ height:"100%", overflowY:"auto", paddingBottom:24, background:"linear-gradient(170deg,#06060F 0%,#0D0820 50%,#060F0D 100%)" }}>

      {/* ── HEADER ── */}
      <div style={{ padding:"50px 20px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
          <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <Icon name="back" size={22} color="#B0B3C6"/>
          </button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:19, fontWeight:800, color:"white" }}>AI Teacher 🤖</div>
            <div style={{ fontSize:11, color:"#7E57C2", marginTop:1 }}>Your personal speaking coach · GPT-4o</div>
          </div>
          <div onClick={onAnalytics} style={{ cursor:"pointer", background:"#1A1A2E", border:"1px solid #787BCB44", borderRadius:14, padding:"7px 12px", display:"flex", gap:6, alignItems:"center" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#787BCBaa"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="#787BCB44"}>
            <span style={{ fontSize:14 }}>📊</span>
            <span style={{ color:"#787BCB", fontSize:11, fontWeight:700 }}>Stats</span>
          </div>
        </div>

        {/* ── MAYA AVATAR HERO ── */}
        <div style={{ textAlign:"center", marginBottom:20, position:"relative" }}>
          {/* Background glow */}
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,#7E57C233 0%,transparent 70%)", pointerEvents:"none" }}/>

          <div style={{ position:"relative", display:"inline-block" }}>
            {/* Pulse rings */}
            <div style={{ position:"absolute", inset:-20, borderRadius:"50%", border:"1.5px solid #7E57C2", opacity: pulse?0.6:0.1, transition:"opacity 2s ease", animation:"pulse-ring 3s ease-out infinite" }}/>
            <div style={{ position:"absolute", inset:-8, borderRadius:"50%", border:"1px solid #7E57C244", animation:"pulse-ring 3s ease-out 1s infinite" }}/>

            {/* Avatar */}
            <div style={{ width:92, height:92, borderRadius:"50%", background:"linear-gradient(135deg,#7E57C2,#4A148C,#311B92)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, margin:"0 auto", boxShadow:"0 0 40px #7E57C255,0 0 80px #7E57C222", animation:"float 3s ease-in-out infinite", position:"relative", zIndex:1 }}>🤖
              {/* Live dot */}
              <div style={{ position:"absolute", bottom:4, right:4, width:18, height:18, borderRadius:"50%", background:"#4CAF50", border:"2.5px solid #06060F", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"white", animation:"blink 1s infinite" }}/>
              </div>
            </div>
          </div>

          <div style={{ color:"white", fontSize:18, fontWeight:800, marginTop:14 }}>Maya ✨</div>
          <div style={{ color:"#B0B3C6", fontSize:12, marginTop:3 }}>AI English Tutor · Always Online · Never Judges</div>

          {/* Idle waveform */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:2, marginTop:10, height:22 }}>
            {Array(18).fill(0).map((_,i) => (
              <div key={i} className="waveform-bar" style={{ animationDelay:`${i*0.09}s`, height:3, background:"#7E57C2", opacity:0.5, width:2 }}/>
            ))}
          </div>
        </div>

        {/* ── QUICK STATS ── */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[
            { icon:"⚡", val:`${todayXP}`, label:"Today XP", color:"#FFD700" },
            { icon:"🔥", val:`${streak}d`, label:"Streak",   color:"#FF9800" },
            { icon:"🎯", val:`${fluency}%`,label:"Fluency",  color:"#787BCB" },
            { icon:"🏆", val:"B2",         label:"Level",    color:"#4CAF50" },
          ].map((s,i) => (
            <div key={i} style={{ flex:1, background:"#1A1A2E", border:"1px solid #2A2A4A", borderRadius:14, padding:"10px 5px", textAlign:"center" }}>
              <div style={{ fontSize:15 }}>{s.icon}</div>
              <div style={{ color:s.color, fontWeight:800, fontSize:14, marginTop:3 }}>{s.val}</div>
              <div style={{ color:"#444466", fontSize:9, marginTop:1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── INSTANT START CTA ── */}
        <div onClick={() => onStartMode(AI_MODES[0])}
          style={{ background:"linear-gradient(135deg,#1A0D28,#2D1060)", border:"1.5px solid #7E57C266", borderRadius:20, padding:"16px 18px", marginBottom:16, cursor:"pointer", display:"flex", alignItems:"center", gap:14, position:"relative", overflow:"hidden", boxShadow:"0 8px 24px #7E57C222" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor="#7E57C2bb"; e.currentTarget.style.boxShadow="0 12px 32px #7E57C233"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="#7E57C266"; e.currentTarget.style.boxShadow="0 8px 24px #7E57C222"; }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"#7E57C211", filter:"blur(20px)", pointerEvents:"none" }}/>
          <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#7E57C2,#4A148C)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, boxShadow:"0 4px 14px #7E57C244" }}>🎙️</div>
          <div style={{ flex:1 }}>
            <div style={{ color:"white", fontWeight:800, fontSize:16 }}>Start Speaking Now</div>
            <div style={{ color:"#B0B3C6", fontSize:12, marginTop:2 }}>Tap to begin AI conversation instantly</div>
          </div>
          <div style={{ background:"linear-gradient(135deg,#7E57C2,#512DA8)", borderRadius:30, padding:"9px 18px", color:"white", fontWeight:700, fontSize:13, boxShadow:"0 4px 14px #7E57C244" }}>▶ Go</div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex", background:"#0F0F1A", borderRadius:14, padding:4, marginBottom:16 }}>
          {[["modes","🎭 AI Modes"],["rooms","🎙️ Voice Rooms"],["recent","📈 History"]].map(([t,l]) => (
            <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)} style={{ fontSize:11 }}>{l}</button>
          ))}
        </div>

        {/* ── AI MODES GRID ── */}
        {tab === "modes" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {AI_MODES.map((mode,i) => (
              <div key={mode.id} onClick={() => onStartMode(mode)}
                onMouseEnter={() => setHovered(mode.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ background: hovered===mode.id ? `${mode.color}18` : "#111122", border:`1.5px solid ${hovered===mode.id ? mode.color+"77" : "#1E1E38"}`, borderRadius:18, padding:"14px 12px", cursor:"pointer", transition:"all 0.2s", transform: hovered===mode.id?"translateY(-2px)":"none", boxShadow: hovered===mode.id?`0 8px 20px ${mode.color}18`:"none", position:"relative", overflow:"hidden", animation:`fadeIn 0.3s ${i*0.05}s both` }}>
                <div style={{ position:"absolute", top:-8, right:-8, width:40, height:40, borderRadius:"50%", background:mode.color, opacity:0.06, filter:"blur(8px)" }}/>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <div style={{ width:36, height:36, borderRadius:11, background:`${mode.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{mode.icon}</div>
                  <div style={{ background:`${mode.color}18`, border:`1px solid ${mode.color}33`, borderRadius:20, padding:"2px 7px", fontSize:9, color:mode.color, fontWeight:700 }}>+{mode.xpPer}XP</div>
                </div>
                <div style={{ color:"white", fontWeight:700, fontSize:13 }}>{mode.label}</div>
                <div style={{ color:"#555575", fontSize:10, marginTop:3, lineHeight:1.4 }}>{mode.sub}</div>
                <div style={{ color:mode.color, fontSize:9, fontWeight:600, marginTop:5 }}>{mode.difficulty}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── VOICE ROOMS ── */}
        {tab === "rooms" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ color:"#666688", fontSize:11, fontWeight:700, letterSpacing:1 }}>LIVE ROOMS</div>
              <div style={{ background:"#E5393518", border:"1px solid #E5393540", borderRadius:20, padding:"2px 10px", color:"#E53935", fontSize:10, fontWeight:700 }}>🔴 {VOICE_ROOMS.filter(r=>r.live).length} Live</div>
            </div>
            {VOICE_ROOMS.map(room => (
              <div key={room.id} onClick={() => onVoiceRooms(room)}
                style={{ background:"#111122", border:"1px solid #1E1E38", borderRadius:16, padding:14, marginBottom:8, cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#787BCB44"; e.currentTarget.style.transform="translateX(3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#1E1E38"; e.currentTarget.style.transform="none"; }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:42, height:42, borderRadius:13, background:"#0F0F1A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, position:"relative" }}>
                    {room.emoji}
                    {room.live && <div style={{ position:"absolute", top:-2, right:-2, width:10, height:10, borderRadius:"50%", background:"#E53935", border:"2px solid #111122", animation:"blink 1s infinite" }}/>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <div style={{ color:"white", fontWeight:700, fontSize:13 }}>{room.name}</div>
                      {room.isHot && <div style={{ background:"#FF6D0018", border:"1px solid #FF6D0040", borderRadius:8, padding:"1px 5px", color:"#FF6D00", fontSize:9, fontWeight:700 }}>🔥</div>}
                    </div>
                    <div style={{ color:"#444466", fontSize:11, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{room.topic}</div>
                    <div style={{ display:"flex", gap:6, marginTop:5, alignItems:"center" }}>
                      <span style={{ color:"#4CAF50", fontSize:10 }}>👥 {room.members}</span>
                      <span style={{ background:"#787BCB18", borderRadius:8, padding:"1px 6px", color:"#787BCB", fontSize:9 }}>{room.level}</span>
                    </div>
                  </div>
                  <div style={{ color:"#2A2A4A", fontSize:18 }}>›</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── RECENT HISTORY ── */}
        {tab === "recent" && (
          <div>
            {[
              { mode:"Interview Coach", score:78, date:"Today",      duration:"12 min", icon:"💼", color:"#A5D6A7", xp:75 },
              { mode:"Casual Chat",     score:85, date:"Yesterday",  duration:"8 min",  icon:"☕", color:"#4FC3F7", xp:55 },
              { mode:"Grammar Clinic",  score:72, date:"2 days ago", duration:"15 min", icon:"✍️", color:"#80DEEA", xp:60 },
              { mode:"IELTS Speaking",  score:69, date:"3 days ago", duration:"20 min", icon:"📋", color:"#CE93D8", xp:90 },
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, background:"#111122", border:"1px solid #1E1E38", borderRadius:14, padding:"12px 14px", marginBottom:8, animation:`fadeIn 0.3s ${i*0.08}s both` }}>
                <div style={{ width:40, height:40, borderRadius:12, background:`${s.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{s.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ color:"white", fontWeight:600, fontSize:13 }}>{s.mode}</div>
                  <div style={{ color:"#444466", fontSize:11, marginTop:2 }}>{s.date} · {s.duration}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ color: s.score>=80?"#4CAF50":s.score>=65?"#FF9800":"#E53935", fontWeight:800, fontSize:16 }}>{s.score}</div>
                  <div style={{ color:"#FFD700", fontSize:10, marginTop:1 }}>+{s.xp} XP</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// AI CONVERSATION SCREEN — WORLD-CLASS REAL-TIME TUTOR
// ──────────────────────────────────────────────────────────────────────────
function AiConversationScreen({ mode, onBack, onEnd }) {
  const safeMode = mode || AI_MODES[0];
  const [messages, setMessages] = useState([
    { role:"ai", text: AI_STARTER[safeMode.id] || AI_STARTER.casual, time:"now", id:0 }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping]     = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recSecs, setRecSecs]       = useState(0);
  const [sessSecs, setSessSecs]     = useState(0);
  const [liveScore, setLiveScore]   = useState(68);
  const [correction, setCorrection] = useState(null);
  const [vocabTip, setVocabTip]     = useState(null);
  const [sessionXP, setSessionXP]   = useState(0);
  const [msgCount, setMsgCount]     = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking]   = useState(false);
  const [typedText, setTypedText]   = useState("");
  const [lastAiMsg, setLastAiMsg]   = useState(AI_STARTER[safeMode.id] || "");
  const [xpToast, setXpToast]       = useState(null);
  const listRef   = useRef(null);
  const recRef    = useRef(null);
  const sessRef   = useRef(null);
  const msgIdRef  = useRef(1);

  // Session timer
  useEffect(() => {
    sessRef.current = setInterval(() => setSessSecs(s => s+1), 1000);
    return () => clearInterval(sessRef.current);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typedText, isTyping]);

  // AI typing effect
  useEffect(() => {
    if (!isAiSpeaking || !lastAiMsg) return;
    setTypedText("");
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTypedText(lastAiMsg.slice(0, i));
      if (i >= lastAiMsg.length) { clearInterval(t); setIsAiSpeaking(false); }
    }, 22);
    return () => clearInterval(t);
  }, [isAiSpeaking, lastAiMsg]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const showXpToast = (xp) => {
    setXpToast(xp);
    setTimeout(() => setXpToast(null), 2000);
  };

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const id = msgIdRef.current++;
    setMessages(prev => [...prev, { role:"user", text:msg, time:fmt(sessSecs), id }]);
    setMsgCount(c => c+1);
    setIsTyping(true);

    // Pick grammar correction randomly
    const corr = GRAMMAR_CORRECTIONS[Math.floor(Math.random() * GRAMMAR_CORRECTIONS.length)];
    const shouldCorrect = Math.random() > 0.6;
    if (shouldCorrect) {
      setTimeout(() => setCorrection(corr), 600);
      setTimeout(() => setCorrection(null), 5000);
    }

    // Pick vocab highlight
    const vocab = VOCAB_HIGHLIGHTS[Math.floor(Math.random() * VOCAB_HIGHLIGHTS.length)];
    if (Math.random() > 0.7) {
      setTimeout(() => setVocabTip(vocab), 2000);
      setTimeout(() => setVocabTip(null), 6000);
    }

    // XP gain
    const xp = 5 + Math.floor(msg.split(" ").length * 0.8);
    setSessionXP(prev => prev + xp);
    showXpToast(xp);
    setLiveScore(prev => Math.min(99, prev + Math.floor(Math.random() * 4)));

    // AI response
    const delay = 1000 + Math.random() * 800;
    setTimeout(() => {
      const aiText = AI_FOLLOW_UPS[msgCount % AI_FOLLOW_UPS.length];
      const aiId = msgIdRef.current++;
      setMessages(prev => [...prev, { role:"ai", text:aiText, time:fmt(sessSecs+2), id:aiId }]);
      setIsTyping(false);
      setLastAiMsg(aiText);
      setIsAiSpeaking(true);
    }, delay);
  };

  const toggleRecord = () => {
    if (isRecording) {
      clearInterval(recRef.current);
      const secs = recSecs;
      setIsRecording(false);
      setRecSecs(0);
      const voiceId = msgIdRef.current++;
      setMessages(prev => [...prev, { role:"user", text:`🎙️ Voice message`, time:fmt(sessSecs), id:voiceId, isVoice:true, duration:fmt(secs) }]);
      setMsgCount(c => c+1);
      const xp = 8 + secs;
      setSessionXP(prev => prev + xp);
      showXpToast(xp);
      setIsTyping(true);
      setTimeout(() => {
        const aiText = "Excellent voice practice! 🎙️ Your pronunciation sounds natural and your pace is great. I noticed good sentence rhythm — that's a key sign of growing fluency. Keep speaking!";
        const aiId = msgIdRef.current++;
        setMessages(prev => [...prev, { role:"ai", text:aiText, time:fmt(sessSecs+3), id:aiId }]);
        setIsTyping(false);
        setLastAiMsg(aiText);
        setIsAiSpeaking(true);
        setLiveScore(prev => Math.min(99, prev + 3));
      }, 1600);
    } else {
      setIsRecording(true);
      setRecSecs(0);
      recRef.current = setInterval(() => setRecSecs(s => s+1), 1000);
    }
  };

  const scoreColor = s => s >= 80 ? "#4CAF50" : s >= 65 ? "#FF9800" : "#E53935";

  // Bold markdown renderer
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i} style={{ color:"white" }}>{part.slice(2,-2)}</strong>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <div className="screen" style={{ height:"100%", display:"flex", flexDirection:"column", background:`linear-gradient(170deg,#06060F 0%,${safeMode.bg} 100%)`, position:"relative" }}>

      {/* ── XP TOAST ── */}
      {xpToast && (
        <div style={{ position:"absolute", top:56, right:16, zIndex:99, background:"linear-gradient(135deg,#FFD700,#FF8C00)", borderRadius:20, padding:"6px 14px", display:"flex", gap:5, alignItems:"center", animation:"slideUp 0.3s ease", boxShadow:"0 4px 14px #FFD70044" }}>
          <span style={{ fontSize:13 }}>⚡</span>
          <span style={{ color:"black", fontWeight:800, fontSize:12 }}>+{xpToast} XP</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{ padding:"48px 16px 0", flexShrink:0, borderBottom:"1px solid #1A1A2E" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <Icon name="back" size={20} color="#B0B3C6"/>
          </button>
          <div style={{ width:34, height:34, borderRadius:11, background:`${safeMode.color}22`, border:`1px solid ${safeMode.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{safeMode.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ color:"white", fontWeight:700, fontSize:14 }}>{safeMode.label}</div>
            <div style={{ color:safeMode.color, fontSize:10 }}>Maya AI · GPT-4o powered</div>
          </div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", color:"#555575", fontSize:12 }}>{fmt(sessSecs)}</div>
          <div style={{ background:"#FFD70018", border:"1px solid #FFD70044", borderRadius:20, padding:"3px 8px", color:"#FFD700", fontSize:11, fontWeight:700 }}>⚡{sessionXP}</div>
          <button onClick={onEnd} style={{ background:"#E5393518", border:"1px solid #E5393540", borderRadius:20, padding:"5px 12px", color:"#E53935", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>End</button>
        </div>

        {/* Live Score Bar */}
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#111120", borderRadius:12, padding:"7px 12px", marginBottom:10 }}>
          {[["🎯 Fluency", liveScore, safeMode.color],["✍️ Grammar", Math.min(99, liveScore+6), "#66BB6A"],["💪 Confidence", Math.max(50, liveScore-8), "#AB47BC"]].map(([l,v,c],i) => (
            <div key={i} style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ color:"#555575", fontSize:9 }}>{l}</span>
                <span style={{ color:c, fontSize:9, fontWeight:700 }}>{v}</span>
              </div>
              <div style={{ height:3, background:"#2A2A4A", borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${v}%`, background:c, borderRadius:2, transition:"width 0.8s ease" }}/>
              </div>
            </div>
          ))}
        </div>

        {/* Grammar Correction Banner */}
        {correction && (
          <div style={{ background:"linear-gradient(135deg,#1A0D00,#2A1500)", border:"1px solid #FF980044", borderRadius:12, padding:"8px 12px", marginBottom:8, animation:"slideUp 0.3s ease", display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:14, flexShrink:0 }}>💡</span>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ background:"#E5393522", borderRadius:6, padding:"2px 7px", color:"#E53935", fontSize:11, textDecoration:"line-through" }}>{correction.wrong}</span>
                <span style={{ color:"#555575" }}>→</span>
                <span style={{ background:"#4CAF5022", borderRadius:6, padding:"2px 7px", color:"#4CAF50", fontSize:11, fontWeight:700 }}>{correction.right}</span>
              </div>
              <div style={{ color:"#777788", fontSize:10, marginTop:3 }}>{correction.note}</div>
            </div>
            <button onClick={() => setCorrection(null)} style={{ background:"none", border:"none", color:"#333355", cursor:"pointer", fontSize:16 }}>×</button>
          </div>
        )}

        {/* Vocabulary Tip */}
        {vocabTip && (
          <div style={{ background:"linear-gradient(135deg,#0D1520,#151D28)", border:"1px solid #4FC3F744", borderRadius:12, padding:"8px 12px", marginBottom:8, animation:"slideUp 0.3s ease" }}>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <span style={{ fontSize:13 }}>📚</span>
              <span style={{ color:"#4FC3F7", fontWeight:700, fontSize:12 }}>New Word: <span style={{ color:"white" }}>{vocabTip.word}</span></span>
              <span style={{ color:"#555575", fontSize:11 }}>— {vocabTip.meaning}</span>
              <button onClick={() => setVocabTip(null)} style={{ background:"none", border:"none", color:"#333355", cursor:"pointer", fontSize:14, marginLeft:"auto" }}>×</button>
            </div>
            <div style={{ color:"#666688", fontSize:10, marginTop:4, fontStyle:"italic" }}>e.g. "{vocabTip.example}"</div>
          </div>
        )}
      </div>

      {/* ── MESSAGES ── */}
      <div ref={listRef} style={{ flex:1, overflowY:"auto", padding:"12px 16px 4px" }}>

        {/* Maya avatar visible when AI last spoke */}
        {isAiSpeaking && (
          <div style={{ textAlign:"center", marginBottom:12 }}>
            <div style={{ position:"relative", display:"inline-block" }}>
              <div style={{ position:"absolute", inset:-6, borderRadius:"50%", border:`1.5px solid ${safeMode.color}88`, animation:"pulse-ring 1.5s ease-out infinite" }}/>
              <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,#7E57C2,#4A148C)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:`0 0 16px ${safeMode.color}44` }}>🤖</div>
            </div>
            <div style={{ display:"flex", justifyContent:"center", gap:2, marginTop:6 }}>
              {Array(12).fill(0).map((_,i) => <div key={i} className="waveform-bar" style={{ animationDelay:`${i*0.08}s`, background:safeMode.color, width:2 }}/>)}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} style={{ display:"flex", flexDirection:msg.role==="ai"?"row":"row-reverse", gap:8, marginBottom:14, animation:"fadeIn 0.3s ease" }}>
            {msg.role==="ai" && (
              <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#7E57C2,#311B92)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginTop:2 }}>🤖</div>
            )}
            <div style={{ maxWidth:"76%" }}>
              <div style={{
                background: msg.role==="ai" ? "linear-gradient(135deg,#1A1A2E,#12103A)" : `linear-gradient(135deg,${safeMode.color}25,${safeMode.color}12)`,
                border:`1px solid ${msg.role==="ai"?"#2A2A4A":safeMode.color+"44"}`,
                borderRadius: msg.role==="ai"?"4px 18px 18px 18px":"18px 4px 18px 18px",
                padding:"11px 14px",
                boxShadow: msg.role==="ai"?`0 2px 12px #1A1A2E`:`0 2px 12px ${safeMode.color}11`
              }}>
                {msg.isVoice ? (
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ color:safeMode.color, fontSize:16 }}>🎙️</span>
                    <div style={{ display:"flex", gap:1.5, alignItems:"center" }}>
                      {Array(10).fill(0).map((_,j) => <div key={j} style={{ width:2, height:`${6+Math.random()*12}px`, background:safeMode.color, borderRadius:1, opacity:0.8 }}/>)}
                    </div>
                    <span style={{ color:"#555575", fontSize:11 }}>{msg.duration}</span>
                  </div>
                ) : (
                  <div style={{ color:msg.role==="ai"?"#D0D0E8":"white", fontSize:13, lineHeight:1.65 }}>
                    {renderText(msg.text)}
                  </div>
                )}
              </div>
              <div style={{ color:"#2A2A4A", fontSize:9, marginTop:3, textAlign:msg.role==="ai"?"left":"right" }}>{msg.time}</div>
            </div>
          </div>
        ))}

        {/* Typing animation */}
        {isTyping && (
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#7E57C2,#311B92)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🤖</div>
            <div style={{ background:"#1A1A2E", border:"1px solid #2A2A4A", borderRadius:"4px 18px 18px 18px", padding:"12px 16px", display:"flex", gap:5, alignItems:"center" }}>
              {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:safeMode.color, animation:`blink 1s ${i*0.25}s ease-in-out infinite` }}/>)}
            </div>
          </div>
        )}
      </div>

      {/* ── INPUT AREA ── */}
      <div style={{ padding:"8px 16px 22px", flexShrink:0, background:"linear-gradient(0deg,#06060F 85%,transparent)" }}>

        {/* Quick starters (first message only) */}
        {msgCount === 0 && (
          <div style={{ display:"flex", gap:6, marginBottom:10, overflowX:"auto", paddingBottom:2 }}>
            {["Tell me about yourself","I want to improve my English","Let's do an interview","Help me with grammar"].map((s,i) => (
              <button key={i} onClick={() => sendMessage(s)} style={{ background:"#1A1A2E", border:`1px solid ${safeMode.color}33`, borderRadius:20, padding:"6px 12px", fontSize:11, color:"#B0B3C6", cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'Sora',sans-serif", flexShrink:0 }}>{s}</button>
            ))}
          </div>
        )}

        {/* Recording UI */}
        {isRecording && (
          <div style={{ background:"linear-gradient(135deg,#1A0D28,#0D0820)", border:`1px solid ${safeMode.color}44`, borderRadius:16, padding:"10px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#E53935", animation:"blink 0.5s infinite" }}/>
            <span style={{ color:"#E53935", fontSize:12, fontWeight:700 }}>REC {fmt(recSecs)}</span>
            <div style={{ flex:1, display:"flex", gap:1.5, alignItems:"center" }}>
              {Array(18).fill(0).map((_,i) => <div key={i} className="waveform-bar" style={{ animationDelay:`${i*0.07}s`, background:safeMode.color, height:3, width:2 }}/>)}
            </div>
            <span style={{ color:"#555575", fontSize:10 }}>Speak naturally...</span>
          </div>
        )}

        <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          {/* Mic button */}
          <div style={{ position:"relative", flexShrink:0 }}>
            {isRecording && <>
              <div style={{ position:"absolute", inset:-8, borderRadius:"50%", border:`2px solid ${safeMode.color}`, animation:"pulse-ring 1.2s ease-out infinite" }}/>
              <div style={{ position:"absolute", inset:-4, borderRadius:"50%", border:`1px solid ${safeMode.color}55`, animation:"pulse-ring 1.2s ease-out 0.4s infinite" }}/>
            </>}
            <button onClick={toggleRecord} style={{ width:46, height:46, borderRadius:14, background:isRecording?`${safeMode.color}22`:"#1A1A2E", border:`1.5px solid ${isRecording?safeMode.color:"#2A2A4A"}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:20, position:"relative", zIndex:1, transition:"all 0.2s", boxShadow:isRecording?`0 0 14px ${safeMode.color}44`:"none" }}>
              {isRecording ? "⏹" : "🎙️"}
            </button>
          </div>

          {/* Text input */}
          <div style={{ flex:1, position:"relative" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type your response..."
              style={{ width:"100%", background:"#1A1A2E", border:`1.5px solid #2A2A4A`, borderRadius:22, padding:"12px 46px 12px 16px", color:"white", fontSize:13, outline:"none", fontFamily:"'Sora',sans-serif", transition:"border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = safeMode.color}
              onBlur={e => e.target.style.borderColor = "#2A2A4A"}
            />
            <button onClick={() => sendMessage()} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:`linear-gradient(135deg,${safeMode.color},${safeMode.color}88)`, border:"none", borderRadius:"50%", width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:13 }}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// AI SESSION END — POST-SESSION ANALYTICS
// ──────────────────────────────────────────────────────────────────────────
function AiSessionEndScreen({ mode, onRestart, onBack }) {
  const safeMode = mode || AI_MODES[0];
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState("scores");
  useEffect(() => setTimeout(() => setMounted(true), 100), []);

  const scores = { fluency:76, grammar:82, vocabulary:71, pronunciation:68, confidence:79, overall:75 };
  const circ = 2 * Math.PI * 50;
  const sc = s => s>=80?"#4CAF50":s>=65?"#FF9800":"#E53935";
  const xpEarned = 85;

  const mistakes = [
    { wrong:"I am agree with you",  right:"I agree with you",        type:"Verb Form",   tip:"Never use 'be + agree'. Just say 'I agree'." },
    { wrong:"He don't understand",  right:"He doesn't understand",   type:"Agreement",   tip:"Third-person singular: 'doesn't' not 'don't'" },
    { wrong:"More better solution", right:"A much better solution",  type:"Comparison",  tip:"Never double comparatives. Use 'much better'." },
  ];

  const suggestions = [
    { original:"I think English is good for career",  improved:"English is undoubtedly a gateway to global career opportunities." },
    { original:"I was very happy about that",         improved:"I was absolutely thrilled by that outcome." },
    { original:"He said me to come",                  improved:"He asked me to come." },
  ];

  const tips = [
    "Practice speaking for at least 15 minutes daily — even to yourself.",
    "Shadow native speakers: repeat what they say immediately after hearing it.",
    "Record yourself weekly and compare — the improvement will motivate you.",
  ];

  return (
    <div className="screen" style={{ height:"100%", overflowY:"auto", background:"linear-gradient(170deg,#06060F,#0D0820)", paddingBottom:32 }}>
      <div style={{ padding:"50px 20px 0" }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:52, marginBottom:8, animation:"scoreCount 0.5s ease" }}>🎉</div>
          <div style={{ color:"white", fontSize:22, fontWeight:800 }}>Session Complete!</div>
          <div style={{ color:safeMode.color, fontSize:13, marginTop:5 }}>{safeMode.icon} {safeMode.label} · {fmt2(sessDur())} · {msgCount2()} responses</div>
        </div>

        {/* ── XP EARNED ── */}
        <div style={{ background:"linear-gradient(135deg,#1A1200,#2A1E00)", border:"1px solid #FFD70044", borderRadius:18, padding:"14px 20px", marginBottom:16, textAlign:"center" }}>
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:32 }}>⚡</span>
            <div>
              <div style={{ color:"#FFD700", fontSize:30, fontWeight:900 }}>+{xpEarned} XP</div>
              <div style={{ color:"#887730", fontSize:12 }}>Earned this session!</div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:10, marginTop:10 }}>
            {[["🎯","First Session"],["🔥","3-Day Streak"]].map(([e,l],i) => (
              <div key={i} style={{ background:"#FFD70018", border:"1px solid #FFD70033", borderRadius:20, padding:"4px 12px", fontSize:11, color:"#FFD700", fontWeight:600 }}>{e} {l}</div>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex", background:"#0F0F1A", borderRadius:12, padding:4, marginBottom:14 }}>
          {[["scores","📊 Scores"],["mistakes","🔴 Mistakes"],["improve","✨ Better Sentences"],["tips","💡 Daily Tips"]].map(([t,l]) => (
            <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)} style={{ fontSize:9, padding:"8px 4px" }}>{l}</button>
          ))}
        </div>

        {/* ── SCORES ── */}
        {tab === "scores" && (
          <div>
            {/* Overall ring */}
            <div style={{ textAlign:"center", marginBottom:16 }}>
              <svg width="130" height="130" style={{ display:"block", margin:"0 auto" }}>
                <circle cx="65" cy="65" r="50" fill="none" stroke="#1A1A2E" strokeWidth="10"/>
                <circle cx="65" cy="65" r="50" fill="none" stroke={safeMode.color} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={mounted?circ*(1-scores.overall/100):circ}
                  transform="rotate(-90 65 65)" className="score-ring"/>
                <text x="65" y="60" textAnchor="middle" fill="white" fontSize="26" fontWeight="800" fontFamily="Sora">{scores.overall}</text>
                <text x="65" y="76" textAnchor="middle" fill="#555575" fontSize="11" fontFamily="Sora">/100 Overall</text>
              </svg>
            </div>
            {/* Individual scores */}
            <div style={{ background:"#111122", border:"1px solid #1E1E38", borderRadius:18, padding:18, marginBottom:12 }}>
              {[["🎙️ Fluency",scores.fluency],["✍️ Grammar",scores.grammar],["📚 Vocabulary",scores.vocabulary],["🔊 Pronunciation",scores.pronunciation],["💪 Confidence",scores.confidence]].map(([l,v],i) => (
                <div key={i} style={{ marginBottom:i<4?12:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ color:"#B0B3C6", fontSize:12 }}>{l}</span>
                    <span style={{ color:sc(v), fontWeight:700 }}>{v}/100</span>
                  </div>
                  <div style={{ height:6, background:"#1E1E38", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:mounted?`${v}%`:"0%", background:`linear-gradient(90deg,${sc(v)},${sc(v)}88)`, borderRadius:3, transition:`width 1s ${0.3+i*0.12}s ease` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MISTAKES ── */}
        {tab === "mistakes" && (
          <div>
            <div style={{ color:"#B0B3C6", fontSize:13, marginBottom:12 }}>Maya found <strong style={{ color:"white" }}>{mistakes.length} grammar points</strong> to improve:</div>
            {mistakes.map((m,i) => (
              <div key={i} style={{ background:"#111122", border:"1px solid #E5393530", borderRadius:16, padding:"14px", marginBottom:10, animation:`fadeIn 0.3s ${i*0.1}s both` }}>
                <div style={{ display:"flex", gap:6, marginBottom:8, alignItems:"center" }}>
                  <div style={{ background:"#E5393520", border:"1px solid #E5393540", borderRadius:8, padding:"2px 8px", color:"#E53935", fontSize:10, fontWeight:700 }}>{m.type}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                  <span style={{ background:"#E5393518", color:"#E53935", borderRadius:8, padding:"3px 10px", fontSize:12, textDecoration:"line-through" }}>{m.wrong}</span>
                  <span style={{ color:"#444" }}>→</span>
                  <span style={{ background:"#4CAF5018", color:"#4CAF50", borderRadius:8, padding:"3px 10px", fontSize:12, fontWeight:700 }}>{m.right}</span>
                </div>
                <div style={{ color:"#666688", fontSize:11 }}>💡 {m.tip}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── BETTER SENTENCES ── */}
        {tab === "improve" && (
          <div>
            <div style={{ color:"#B0B3C6", fontSize:13, marginBottom:12 }}>Maya rewrote your sentences to sound more natural:</div>
            {suggestions.map((s,i) => (
              <div key={i} style={{ background:"#111122", border:"1px solid #787BCB30", borderRadius:16, padding:14, marginBottom:10, animation:`fadeIn 0.3s ${i*0.1}s both` }}>
                <div style={{ color:"#555575", fontSize:11, fontWeight:600, marginBottom:6 }}>YOU SAID:</div>
                <div style={{ color:"#777788", fontSize:13, marginBottom:10, fontStyle:"italic" }}>"{s.original}"</div>
                <div style={{ color:"#787BCB", fontSize:11, fontWeight:600, marginBottom:6 }}>✨ BETTER:</div>
                <div style={{ color:"white", fontSize:13, fontWeight:600 }}>"{s.improved}"</div>
              </div>
            ))}
          </div>
        )}

        {/* ── DAILY TIPS ── */}
        {tab === "tips" && (
          <div>
            <div style={{ color:"#B0B3C6", fontSize:13, marginBottom:12 }}>Maya's personalised tips for <strong style={{ color:"white" }}>your next 24 hours</strong>:</div>
            {tips.map((tip,i) => (
              <div key={i} style={{ display:"flex", gap:12, background:"linear-gradient(135deg,#0D1520,#12182A)", border:"1px solid #4FC3F730", borderRadius:16, padding:"14px", marginBottom:10, animation:`fadeIn 0.3s ${i*0.1}s both` }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"#4FC3F718", border:"1px solid #4FC3F740", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>💡</div>
                <div style={{ color:"#D0D0E8", fontSize:13, lineHeight:1.65 }}>{tip}</div>
              </div>
            ))}
            {/* Weekly goal tracker */}
            <div style={{ background:"linear-gradient(135deg,#1A0D28,#120820)", border:"1px solid #7E57C244", borderRadius:18, padding:16, marginTop:6 }}>
              <div style={{ color:"#CE93D8", fontWeight:700, fontSize:13, marginBottom:10 }}>🎯 Weekly Speaking Goal</div>
              <div style={{ display:"flex", gap:6 }}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i) => (
                  <div key={i} style={{ flex:1, textAlign:"center" }}>
                    <div style={{ width:"100%", height:32, borderRadius:8, background:i<4?"linear-gradient(180deg,#7E57C2,#4A148C)":"#1A1A2E", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:4 }}>
                      {i<4 && <span style={{ fontSize:14 }}>✓</span>}
                    </div>
                    <div style={{ color:"#444466", fontSize:8 }}>{d}</div>
                  </div>
                ))}
              </div>
              <div style={{ color:"#555575", fontSize:11, marginTop:10 }}>4/7 days complete · Keep going! 🔥</div>
            </div>
          </div>
        )}

        {/* ── ACTIONS ── */}
        <div style={{ marginTop:20 }}>
          <button className="btn-primary" style={{ width:"100%", padding:"15px", fontSize:15, marginBottom:10, background:`linear-gradient(135deg,${safeMode.color}99,${safeMode.color}55)`, boxShadow:`0 8px 20px ${safeMode.color}33` }} onClick={onRestart}>
            {safeMode.icon} Practice Again
          </button>
          <button className="btn-ghost" style={{ width:"100%", padding:"15px", fontSize:13 }} onClick={onBack}>
            ← Back to AI Teacher
          </button>
        </div>
      </div>
    </div>
  );
}
// Helper functions used in AiSessionEndScreen
function fmt2(s) { return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; }
function sessDur() { return 742; } // Demo: 12m 22s
function msgCount2() { return 8; }

// ──────────────────────────────────────────────────────────────────────────
// VOICE ROOMS SCREEN — DISCORD-STYLE LIVE ROOMS
// ──────────────────────────────────────────────────────────────────────────
function VoiceRoomsScreen({ onBack }) {
  const [activeRoom, setActiveRoom] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [roomSecs, setRoomSecs] = useState(0);
  const timerRef = useRef(null);
  const avatarColors = ["#787BCB","#26A69A","#EF5350","#FF9800","#AB47BC","#42A5F5","#66BB6A","#FFD700"];
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const joinRoom = (room) => {
    setActiveRoom(room);
    setRoomSecs(0);
    timerRef.current = setInterval(() => setRoomSecs(s=>s+1), 1000);
  };
  const leaveRoom = () => {
    setActiveRoom(null);
    clearInterval(timerRef.current);
    setIsSpeaking(false);
    setIsHandRaised(false);
  };
  useEffect(() => () => clearInterval(timerRef.current), []);

  // Active room view
  if (activeRoom) {
    return (
      <div className="screen" style={{ height:"100%", background:"linear-gradient(170deg,#06060F,#001A20)", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"50px 20px 14px", borderBottom:"1px solid #1A2A2E", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={leaveRoom} style={{ background:"none", border:"none", cursor:"pointer" }}><Icon name="back" size={20} color="#B0B3C6"/></button>
            <div style={{ width:38, height:38, borderRadius:12, background:"#00BCD418", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{activeRoom.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ color:"white", fontWeight:700, fontSize:14 }}>{activeRoom.name}</div>
              <div style={{ color:"#00BCD4", fontSize:10 }}>🔴 Live · {fmt(roomSecs)} · {activeRoom.speakers.length+1} speakers</div>
            </div>
            <div style={{ color:"#555575", fontSize:10 }}>👂{activeRoom.members}</div>
          </div>
          <div style={{ background:"#112228", borderRadius:10, padding:"8px 12px", marginTop:10, fontSize:12, color:"#B0B3C6" }}>
            💬 <strong style={{ color:"white" }}>Topic:</strong> {activeRoom.topic}
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"18px 20px 0" }}>
          <div style={{ color:"#555575", fontSize:10, fontWeight:700, marginBottom:12, letterSpacing:1 }}>SPEAKERS ({activeRoom.speakers.length+1})</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
            {[...activeRoom.speakers, "You"].map((s,i) => {
              const isYou = s === "You";
              const isTalking = (isSpeaking && isYou) || (!isYou && i%2===0);
              return (
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ position:"relative", display:"inline-block" }}>
                    {isTalking && <div style={{ position:"absolute", inset:-4, borderRadius:"50%", border:"2px solid #4CAF50", animation:"pulse-ring 1.5s ease-out infinite" }}/>}
                    <div style={{ width:54, height:54, borderRadius:"50%", background:isYou?"linear-gradient(135deg,#787BCB,#5A5DB8)":`${avatarColors[i%8]}33`, border:`2px solid ${isYou?"#787BCB":avatarColors[i%8]+"55"}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18, color:isYou?"white":avatarColors[i%8], margin:"0 auto" }}>{isYou?"R":s}</div>
                  </div>
                  <div style={{ color:isYou?"#787BCB":"white", fontSize:10, marginTop:6, fontWeight:isYou?700:400 }}>{isYou?"You":"User "+s}</div>
                  {isTalking && <div style={{ fontSize:8, color:"#4CAF50" }}>speaking</div>}
                  {isYou && isHandRaised && <div style={{ fontSize:12 }}>✋</div>}
                </div>
              );
            })}
          </div>
          <div style={{ color:"#555575", fontSize:10, fontWeight:700, marginBottom:8, letterSpacing:1 }}>AUDIENCE ({activeRoom.members})</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {Array(Math.min(activeRoom.members,8)).fill(0).map((_,i) => (
              <div key={i} style={{ width:32, height:32, borderRadius:"50%", background:`${avatarColors[i%8]}22`, border:`1px solid ${avatarColors[i%8]}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:avatarColors[i%8], fontWeight:700 }}>{String.fromCharCode(65+i)}</div>
            ))}
          </div>
        </div>
        <div style={{ padding:"14px 24px 30px", background:"rgba(6,6,15,0.97)", borderTop:"1px solid #1A2A2E", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-evenly", alignItems:"center" }}>
            {[
              { icon: isSpeaking?"🎙️":"🔇", label: isSpeaking?"Speaking":"Muted", color: isSpeaking?"#4CAF50":"#555575", action:()=>setIsSpeaking(!isSpeaking) },
              { icon:"✋", label: isHandRaised?"Raised":"Raise Hand", color: isHandRaised?"#FFD700":"#555575", action:()=>setIsHandRaised(!isHandRaised) },
              { icon:"📴", label:"Leave", color:"#E53935", isLeave:true, action:leaveRoom },
            ].map((btn,i) => (
              <div key={i} style={{ textAlign:"center", cursor:"pointer" }} onClick={btn.action}>
                <div style={{ width:btn.isLeave?62:52, height:btn.isLeave?62:52, borderRadius:"50%", background:`${btn.color}18`, border:`1.5px solid ${btn.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:btn.isLeave?24:20, marginBottom:5, boxShadow:btn.isLeave?`0 6px 20px ${btn.color}44`:"none" }}>{btn.icon}</div>
                <div style={{ color:btn.color, fontSize:10 }}>{btn.label}</div>
              </div>
            ))}
          </div>
          {isSpeaking && (
            <div style={{ display:"flex", justifyContent:"center", gap:2, marginTop:12 }}>
              {Array(20).fill(0).map((_,i) => <div key={i} className="waveform-bar" style={{ background:"#4CAF50", animationDelay:`${i*0.08}s`, width:2 }}/>)}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Room list
  return (
    <div className="screen" style={{ height:"100%", overflowY:"auto", background:"linear-gradient(170deg,#06060F,#001A20)", paddingBottom:32 }}>
      <div style={{ padding:"50px 20px 0" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", marginBottom:16 }}><Icon name="back" size={22} color="#B0B3C6"/></button>
        <div style={{ color:"white", fontSize:20, fontWeight:800, marginBottom:4 }}>Voice Rooms 🎙️</div>
        <div style={{ color:"#555575", fontSize:13, marginBottom:16 }}>Join live English group practice</div>
        <div style={{ background:"linear-gradient(135deg,#0D1F18,#1A3A28)", border:"1px solid #4CAF5030", borderRadius:14, padding:"10px 14px", marginBottom:16, display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#4CAF50", animation:"blink 1s infinite" }}/>
          <div style={{ color:"#4CAF50", fontWeight:700, fontSize:12 }}>{VOICE_ROOMS.filter(r=>r.live).length} rooms live · {VOICE_ROOMS.reduce((a,r)=>a+r.members,0)} people practising</div>
        </div>
        {VOICE_ROOMS.map((room,i) => (
          <div key={room.id} onClick={() => joinRoom(room)}
            style={{ background:"#111122", border:"1px solid #1E1E38", borderRadius:18, padding:"14px 16px", marginBottom:10, cursor:"pointer", transition:"all 0.2s", animation:`fadeIn 0.3s ${i*0.06}s both` }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.borderColor="#787BCB44"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor="#1E1E38"; }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:"#0F0F1A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, position:"relative" }}>
                {room.emoji}
                {room.live && <div style={{ position:"absolute", top:-2, right:-2, width:10, height:10, borderRadius:"50%", background:"#E53935", border:"2px solid #111122", animation:"blink 1s infinite" }}/>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ color:"white", fontWeight:700, fontSize:13 }}>{room.name}</div>
                    {room.isHot && <div style={{ background:"#FF6D0018", border:"1px solid #FF6D0040", borderRadius:8, padding:"1px 5px", color:"#FF6D00", fontSize:9, fontWeight:700 }}>🔥 HOT</div>}
                  </div>
                  {room.live ? <div style={{ color:"#E53935", fontSize:10, fontWeight:700 }}>🔴 LIVE</div> : <div style={{ color:"#555575", fontSize:10 }}>SOON</div>}
                </div>
                <div style={{ color:"#444466", fontSize:11, marginTop:3 }}>{room.topic}</div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:7 }}>
                  <div style={{ display:"flex" }}>
                    {room.speakers.slice(0,4).map((s,j) => (
                      <div key={j} style={{ width:22, height:22, borderRadius:"50%", background:`${avatarColors[j%8]}33`, border:"1.5px solid #111122", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:avatarColors[j%8], fontWeight:700, marginLeft:j>0?-5:0 }}>{s}</div>
                    ))}
                  </div>
                  <div style={{ color:"#4CAF50", fontSize:10 }}>+{room.members} others</div>
                  <div style={{ background:"#787BCB18", borderRadius:8, padding:"1px 7px", color:"#787BCB", fontSize:9 }}>{room.level}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div style={{ background:"#111122", border:"2px dashed #1E1E38", borderRadius:18, padding:18, textAlign:"center", cursor:"pointer" }}>
          <div style={{ fontSize:28, marginBottom:8 }}>➕</div>
          <div style={{ color:"white", fontWeight:700 }}>Create Your Room</div>
          <div style={{ color:"#555575", fontSize:12, marginTop:4 }}>Host a live English session</div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ANALYTICS DASHBOARD
// ──────────────────────────────────────────────────────────────────────────
function AnalyticsDashboard({ onBack }) {
  const [tab, setTab] = useState("week");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Reset mounted so animations replay on each visit
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t); // cleanup prevents crash on fast navigation
  }, []);

  const weekData  = [42,58,35,71,65,80,74];
  const monthData = [55,60,48,70,65,75,72,80,78,85,74,82,79,88,74,82,79,88,72,85,80,92,88,85,79,88,90,86,84,87];
  const data   = tab === "week" ? weekData : monthData;
  const labels = tab === "week" ? ["M","T","W","T","F","S","S"] : Array.from({length:30},(_,i)=>`${i+1}`);
  const maxVal = Math.max(...(data.length ? data : [1])); // guard against empty array
  const sc = s => s>=80?"#4CAF50":s>=65?"#FF9800":"#E53935";

  return (
    <div className="screen mesh-bg" style={{ height:"100%", overflowY:"auto", paddingBottom:32 }}>
      <div style={{ padding:"50px 20px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer" }}><Icon name="back" size={22} color="#B0B3C6"/></button>
          <div>
            <div style={{ color:"white", fontSize:18, fontWeight:800 }}>My Progress 📊</div>
            <div style={{ color:"#555575", fontSize:11, marginTop:1 }}>AI-powered speaking analytics</div>
          </div>
        </div>

        {/* Overall Score Ring */}
        <div className="glass-card" style={{ padding:20, marginBottom:16, textAlign:"center" }}>
          <div style={{ color:"#787BCB", fontSize:11, fontWeight:700, marginBottom:12, letterSpacing:1 }}>OVERALL SPEAKING SCORE</div>
          <svg width="130" height="130" style={{ display:"block", margin:"0 auto" }}>
            <circle cx="65" cy="65" r="52" fill="none" stroke="#1A1A2E" strokeWidth="10"/>
            <circle cx="65" cy="65" r="52" fill="none" stroke="#787BCB" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${2*Math.PI*52}`} strokeDashoffset={mounted?2*Math.PI*52*(1-0.75):2*Math.PI*52}
              transform="rotate(-90 65 65)" className="score-ring"/>
            <text x="65" y="60" textAnchor="middle" fill="white" fontSize="30" fontWeight="800" fontFamily="Sora">75</text>
            <text x="65" y="76" textAnchor="middle" fill="#555575" fontSize="11" fontFamily="Sora">/100</text>
          </svg>
          <div style={{ color:"#FFD700", fontWeight:700, marginTop:8 }}>🚀 B2 Level · Improving!</div>
          <div style={{ display:"flex", justifyContent:"center", gap:14, marginTop:10, flexWrap:"wrap" }}>
            {[["📈","23 sessions"],["⏱️","14h 20m"],["🔥","7 day streak"],["⚡","2,840 XP"]].map(([i,t],idx)=>(
              <div key={idx} style={{ color:"#555575", fontSize:11 }}>{i} {t}</div>
            ))}
          </div>
        </div>

        {/* Fluency Chart */}
        <div className="glass-card" style={{ padding:"16px 14px", marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ color:"white", fontWeight:700, fontSize:13 }}>Fluency Trend</div>
            <div style={{ display:"flex", background:"#0F0F1A", borderRadius:10, padding:3 }}>
              {[["week","7D"],["month","30D"]].map(([t,l]) => (
                <button key={t} onClick={() => setTab(t)} style={{ background:tab===t?"#787BCB22":"transparent", border:`1px solid ${tab===t?"#787BCB44":"transparent"}`, borderRadius:8, padding:"3px 10px", fontSize:10, color:tab===t?"#787BCB":"#555575", cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:tab==="week"?8:3, height:70 }}>
            {data.map((v,i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                <div style={{ width:"100%", height:mounted?`${(v/maxVal)*58}px`:"0px", background: i===data.length-1?"linear-gradient(180deg,#787BCB,#5A5DB8)":"#2A2A4A", borderRadius:"3px 3px 0 0", transition:`height 0.7s ${i*0.03}s ease` }}/>
                {tab === "week" && <div style={{ color:"#444466", fontSize:8, marginTop:3 }}>{labels[i]}</div>}
              </div>
            ))}
          </div>
          <div style={{ color:"#4CAF50", fontSize:11, marginTop:8 }}>↑ +12 pts this {tab} · Avg: 66</div>
        </div>

        {/* Skill Breakdown */}
        <div className="glass-card" style={{ padding:16, marginBottom:14 }}>
          <div style={{ color:"white", fontWeight:700, fontSize:13, marginBottom:14 }}>Skill Breakdown</div>
          {[["🎙️ Fluency",78],["✍️ Grammar",72],["📚 Vocabulary",80],["🔊 Pronunciation",69],["💪 Confidence",75],["⚡ Speed",82]].map(([l,v],i) => (
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ color:"#B0B3C6", fontSize:12 }}>{l}</span>
                <span style={{ color:sc(v), fontWeight:700, fontSize:12 }}>{v}</span>
              </div>
              <div style={{ height:5, background:"#2A2A4A", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:mounted?`${v}%`:"0%", background:`linear-gradient(90deg,${sc(v)},${sc(v)}88)`, borderRadius:3, transition:`width 1s ${0.2+i*0.1}s ease` }}/>
              </div>
            </div>
          ))}
        </div>

        {/* Common Mistakes */}
        <div className="glass-card" style={{ padding:16, marginBottom:14 }}>
          <div style={{ color:"white", fontWeight:700, fontSize:13, marginBottom:12 }}>🔴 Common Mistakes</div>
          {[["Tense Errors",35],["Article Usage",24],["Prepositions",21],["Subject-Verb",12],["Word Order",8]].map(([l,p],i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <div style={{ color:"#B0B3C6", fontSize:12, width:110 }}>{l}</div>
              <div style={{ flex:1, height:4, background:"#2A2A4A", borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", width:mounted?`${p}%`:"0%", background:"#E53935", borderRadius:2, transition:`width 1s ${0.2+i*0.1}s ease` }}/>
              </div>
              <div style={{ color:"#E53935", fontWeight:700, fontSize:12, width:25 }}>{p}%</div>
            </div>
          ))}
        </div>

        {/* Maya's Recommendations */}
        <div style={{ background:"linear-gradient(135deg,#1A0D28,#120820)", border:"1px solid #787BCB44", borderRadius:18, padding:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <span style={{ fontSize:18 }}>🤖</span>
            <span style={{ color:"#CE93D8", fontWeight:700, fontSize:14 }}>Maya's Recommendations</span>
          </div>
          {[
            ["🎯","Focus on tense usage today — practice 'I went' vs 'I have gone'","High"],
            ["📚","Learn 5 advanced words: consequently, elaborate, perspective…","Medium"],
            ["🔊","30 min pronunciation: 'th', 'v/w', '-tion' sounds","High"],
          ].map(([icon,tip,priority],i)=>(
            <div key={i} style={{ display:"flex", gap:10, marginBottom:i<2?12:0 }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ color:"#D1C4E9", fontSize:12, lineHeight:1.5 }}>{tip}</div>
                <div style={{ color:priority==="High"?"#E53935":"#FF9800", fontSize:9, fontWeight:700, marginTop:2 }}>{priority} Priority</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ROADMAP_DATA = [
  // ── BEGINNER (Days 1–15) ────────────────────────────────────────────────
  { day:1, phase:"beginner", title:"Introduce Yourself", emoji:"👋", topic:"Self Introduction", explanation:"The most important skill — telling the world who you are with confidence.", task:"Record a 1-minute intro: name, where you're from, what you do, your hobbies.", vocab:["Greetings","Occupation","Hometown","Hobbies","Personality"], challenge:"Speak without reading notes!", aiPrompt:"Hi! Tell me about yourself in 60 seconds.", pronunciation:"Focus on 'th' sounds: this, that, the, them.", quote:"Every expert was once a beginner." },
  { day:2, phase:"beginner", title:"Numbers & Daily Routine", emoji:"⏰", topic:"Daily Life", explanation:"Numbers and routines are the backbone of daily English conversations.", task:"Describe your morning routine using time expressions.", vocab:["Wake up","Brush","Commute","Schedule","Routine"], challenge:"Use 5 time expressions (first, then, after that, finally, meanwhile).", aiPrompt:"Walk me through your typical morning.", pronunciation:"Practice: 'th' in 'three', 'thirteen', 'thirty'.", quote:"Small daily improvements lead to stunning results." },
  { day:3, phase:"beginner", title:"Colors, Food & Preferences", emoji:"🍕", topic:"Food & Preferences", explanation:"Expressing likes, dislikes, and preferences is essential in every conversation.", task:"Talk about your 3 favorite foods and why you love them.", vocab:["Delicious","Prefer","Flavor","Ingredients","Cuisine"], challenge:"Use 'I love', 'I enjoy', 'I can't stand', 'I prefer'.", aiPrompt:"What's your favorite meal and why?", pronunciation:"Practice: 'v' vs 'w' — very, well, vivid, wonder.", quote:"Life is too short for bad food and boring conversations." },
  { day:4, phase:"beginner", title:"Family & Relationships", emoji:"👨‍👩‍👧", topic:"Family", explanation:"Talking about family builds emotional vocabulary and helps in personal conversations.", task:"Describe your family members and your relationship with them.", vocab:["Sibling","Extended family","Relationship","Supportive","Affectionate"], challenge:"Describe your family in exactly 10 sentences.", aiPrompt:"Tell me about your family. Who are you closest to?", pronunciation:"Focus on '-tion' endings: relation, station, nation.", quote:"Family is not an important thing — it's everything." },
  { day:5, phase:"beginner", title:"Directions & Places", emoji:"🗺️", topic:"Navigation", explanation:"Giving and asking for directions is practical everyday English.", task:"Explain how to get from your home to the nearest shop.", vocab:["Turn left","Straight ahead","Landmark","Intersection","Distance"], challenge:"Use at least 6 direction words.", aiPrompt:"How would you give directions to someone who is lost?", pronunciation:"Practice: 'str' blends — straight, street, strong.", quote:"Not all those who wander are lost — unless they skip this day!" },
  { day:6, phase:"beginner", title:"Shopping & Bargaining", emoji:"🛍️", topic:"Shopping", explanation:"Shopping vocabulary helps in markets, malls, and even online chats.", task:"Role-play a conversation: buying clothes, asking price, negotiating.", vocab:["Discount","Affordable","Receipt","Exchange","Bargain"], challenge:"Negotiate a price without saying 'cheap'.", aiPrompt:"I'm selling a phone for ₹15,000. Negotiate with me!", pronunciation:"Practice: 'sh' vs 's' — shop, stop, ship, sip.", quote:"The best things in life are free — but English practice is priceless." },
  { day:7, phase:"beginner", title:"Weather & Seasons", emoji:"🌦️", topic:"Weather", explanation:"Weather is the #1 small talk topic in English-speaking cultures.", task:"Describe today's weather and your favourite season with reasons.", vocab:["Humid","Forecast","Temperature","Thunder","Mild"], challenge:"Predict tomorrow's weather in 5 sentences.", aiPrompt:"What's the weather like where you are? Do you prefer summer or winter?", pronunciation:"Focus on 'ea' sounds: weather, feather, heat, meat.", quote:"Sunshine is delicious, rain is refreshing — every weather improves your English!" },
  { day:8, phase:"beginner", title:"Health & Body", emoji:"💪", topic:"Health", explanation:"Describing symptoms, body parts, and health habits is crucial in daily life.", task:"Describe a time you were sick and how you recovered.", vocab:["Symptoms","Recovery","Prescription","Exercise","Wellbeing"], challenge:"Use passive voice: 'I was treated by…', 'Medicine was given…'", aiPrompt:"You're feeling unwell. Describe your symptoms to a doctor.", pronunciation:"Practice: 'ea' — health, wealth, breath, death.", quote:"Take care of your body — it's the only place you have to live." },
  { day:9, phase:"beginner", title:"Transportation", emoji:"🚆", topic:"Travel & Transport", explanation:"Talking about how you get around is essential for travel and daily life.", task:"Describe your daily commute or a memorable journey.", vocab:["Commute","Traffic","Departure","Platform","Fare"], challenge:"Describe a journey using past tense throughout.", aiPrompt:"How do you get to work or school? What's your favorite way to travel?", pronunciation:"Focus on 'tion' — transportation, station, destination.", quote:"Life is a journey — speak your way through it." },
  { day:10, phase:"beginner", title:"Past Experiences", emoji:"📖", topic:"Storytelling Basics", explanation:"The simple past tense unlocks your ability to share stories and experiences.", task:"Tell a story about something funny or memorable that happened to you.", vocab:["Remembered","Suddenly","Eventually","Embarrassed","Hilarious"], challenge:"Tell the story using ONLY past tense verbs.", aiPrompt:"Tell me about a funny or embarrassing moment from your past.", pronunciation:"Practice '-ed' endings: walked, talked, started, wanted.", quote:"The stories we tell become the life we live." },
  { day:11, phase:"beginner", title:"Hobbies & Interests", emoji:"🎨", topic:"Hobbies", explanation:"Talking about hobbies makes you interesting and helps you connect with people.", task:"Talk about 2 hobbies — one you love, one you recently started.", vocab:["Passionate","Skilled","Leisure","Creative","Enthusiastic"], challenge:"Convince someone to try your favourite hobby.", aiPrompt:"What are your hobbies? Why should I try your favourite one?", pronunciation:"Practice: 'i' sounds — skill, still, fill, hill.", quote:"A hobby is not a distraction — it's a conversation starter." },
  { day:12, phase:"beginner", title:"Technology & Gadgets", emoji:"📱", topic:"Technology", explanation:"Tech vocabulary is everywhere — phones, apps, social media, AI tools.", task:"Describe your smartphone and how you use it daily.", vocab:["Application","Interface","Download","Connectivity","Notification"], challenge:"Explain a tech feature to someone who's never used a smartphone.", aiPrompt:"Explain to me what a smartphone is as if I've never seen one.", pronunciation:"Focus on 'tion': application, notification, communication.", quote:"Technology is best when it brings people together — especially in English!" },
  { day:13, phase:"beginner", title:"Jobs & Professions", emoji:"💼", topic:"Career Talk", explanation:"Career vocabulary is essential for networking, interviews, and daily small talk.", task:"Describe your current or dream job with full details.", vocab:["Profession","Responsibilities","Salary","Colleague","Promotion"], challenge:"Describe your job without saying what it's called.", aiPrompt:"Tell me about your job or your dream career.", pronunciation:"Practice: 'pro-' — profession, promotion, professional.", quote:"Choose a job you love and you'll never work a day in your life." },
  { day:14, phase:"beginner", title:"Describing People", emoji:"👤", topic:"Descriptions", explanation:"Describing people accurately improves storytelling, writing, and conversations.", task:"Describe a family member or best friend in detail — personality and appearance.", vocab:["Optimistic","Generous","Stubborn","Charismatic","Reserved"], challenge:"Describe someone using ONLY personality words (no physical appearance).", aiPrompt:"Describe your best friend to me without using their name.", pronunciation:"Focus on '-ous': generous, nervous, serious, obvious.", quote:"Every person you meet is a story waiting to be told." },
  { day:15, phase:"beginner", title:"Beginner Review & Mini Speech", emoji:"🎓", topic:"Review Day", explanation:"Review everything you've learned so far — time to show your progress!", task:"Give a 2-minute speech covering: yourself, your family, your job, your hobbies.", vocab:["Review","Progress","Achievement","Milestone","Confidence"], challenge:"Record yourself and notice how much you've improved from Day 1!", aiPrompt:"Give me a complete 2-minute introduction about your life.", pronunciation:"Practice any sounds from Days 1–14 that were hard for you.", quote:"You've completed 25% of the journey. The best is yet to come! 🌟" },

  // ── DAILY CONVERSATION (Days 16–30) ────────────────────────────────────
  { day:16, phase:"conversation", title:"Small Talk Mastery", emoji:"☕", topic:"Small Talk", explanation:"Small talk opens doors — learn to chat naturally with anyone.", task:"Start 3 small talk conversations using weather, weekend plans, or current events.", vocab:["By the way","Speaking of which","Funny you say that","Come to think of it","You know what"], challenge:"Have a 5-minute conversation using only small talk topics.", aiPrompt:"Let's do small talk! I'll start: 'Great weather today, right?'", pronunciation:"Focus on natural linking: 'how are you' → 'howaryah'", quote:"Small talk is big business." },
  { day:17, phase:"conversation", title:"Opinions & Agreeing", emoji:"🗣️", topic:"Expressing Opinions", explanation:"Expressing agreement and disagreement politely is a core social skill.", task:"Share your opinion on social media's impact on society.", vocab:["In my opinion","I'd argue that","I beg to differ","Fair point","Absolutely"], challenge:"Disagree with someone without using the word 'no'.", aiPrompt:"Do you think social media is good or bad? Defend your view!", pronunciation:"Practice: 'ion' — opinion, decision, vision.", quote:"The right opinion at the right time changes everything." },
  { day:18, phase:"conversation", title:"Asking Smart Questions", emoji:"❓", topic:"Questions", explanation:"Good questions show intelligence and keep conversations flowing.", task:"Come up with 10 interesting questions you could ask a new friend.", vocab:["Could you elaborate","What do you mean by","Out of curiosity","I was wondering","Mind if I ask"], challenge:"Ask 5 follow-up questions in a single conversation.", aiPrompt:"I'll tell you about my job. Ask me interesting follow-up questions!", pronunciation:"Practice question intonation — voice rises then falls.", quote:"He who asks a question is a fool for five minutes. He who doesn't ask, is a fool forever." },
  { day:19, phase:"conversation", title:"Phone & Online Conversations", emoji:"📞", topic:"Digital Communication", explanation:"Phone English has unique phrases and etiquette you must master.", task:"Practice: answering, holding, transferring, and ending a professional call.", vocab:["Hold the line","Could I take a message","Bear with me","I'm afraid","Let me check"], challenge:"Handle an angry customer call — stay calm and professional!", aiPrompt:"You've called customer support. I'm an angry customer. Handle me!", pronunciation:"Over-pronounce clearly — on phone, clarity matters most.", quote:"Communication is the most important skill any person can learn." },
  { day:20, phase:"conversation", title:"Storytelling Flow", emoji:"📚", topic:"Narrative Skills", explanation:"Great stories use structure, emotion, and suspense to captivate listeners.", task:"Tell a 3-minute story using: setting → conflict → climax → resolution.", vocab:["All of a sudden","Meanwhile","Out of nowhere","It turned out that","Little did I know"], challenge:"Tell your story entirely in the present tense for drama.", aiPrompt:"Tell me an exciting or scary story from your life!", pronunciation:"Practice dramatic pauses — silence is power in storytelling.", quote:"There is no greater agony than bearing an untold story inside you." },
  { day:21, phase:"conversation", title:"Emotions & Feelings", emoji:"😊", topic:"Emotional Intelligence", explanation:"Naming your emotions accurately makes you more articulate and empathetic.", task:"Describe a situation where you felt 3 different complex emotions.", vocab:["Overwhelmed","Exhilarated","Conflicted","Apprehensive","Euphoric"], challenge:"Express one emotion using a metaphor instead of the emotion word.", aiPrompt:"Tell me about a time you felt really proud of yourself.", pronunciation:"Focus on emotional tone — your voice should match your words.", quote:"Emotional intelligence begins with the language of feelings." },
  { day:22, phase:"conversation", title:"Apologising & Forgiving", emoji:"🙏", topic:"Social Etiquette", explanation:"Apologising gracefully is a sign of maturity and respect.", task:"Write and speak 3 different apologies: casual, professional, and formal.", vocab:["Sincerely apologise","Take responsibility","Make amends","No hard feelings","Moving forward"], challenge:"Apologise convincingly for something that wasn't your fault.", aiPrompt:"You forgot an important meeting. Apologise to your angry boss.", pronunciation:"Practice: 'sorry' with different tones — genuine vs dismissive.", quote:"An apology is a good way to have the last word." },
  { day:23, phase:"conversation", title:"Compliments & Encouragement", emoji:"🌟", topic:"Positive Communication", explanation:"Giving genuine compliments builds rapport and positive relationships.", task:"Give 5 specific compliments to different people in your life today.", vocab:["Genuinely impressive","You have a gift for","That was brilliant","I admire how","You should be proud"], challenge:"Give a compliment without using the words 'good' or 'nice'.", aiPrompt:"I just gave a presentation. Tell me what you liked about it!", pronunciation:"Warm, rising intonation makes compliments sound genuine.", quote:"A compliment is verbal sunshine." },
  { day:24, phase:"conversation", title:"Making Plans & Invitations", emoji:"📅", topic:"Social Planning", explanation:"Learn to invite, accept, decline, and suggest alternatives gracefully.", task:"Practice inviting a friend out, them declining, and you offering an alternative.", vocab:["How about","I was thinking maybe","I'm afraid I can't","How does that sound","Let's pencil it in"], challenge:"Make a plan using only indirect language (no direct 'yes' or 'no').", aiPrompt:"Invite me to your party and handle whatever response I give!", pronunciation:"Rising tone on invitations: 'Would you like to come?↗'", quote:"Life is short. Say yes to new experiences." },
  { day:25, phase:"conversation", title:"Giving Advice", emoji:"💡", topic:"Problem Solving Talk", explanation:"Giving advice clearly and sensitively is a powerful communication skill.", task:"Give advice to a friend who: failed an exam, had a job rejection, broke up.", vocab:["If I were you","Have you considered","It might help to","The way I see it","Don't be too hard on yourself"], challenge:"Give advice without using the word 'should'.", aiPrompt:"I'm feeling really stressed about my job. What advice do you have?", pronunciation:"Soften your advice with falling intonation and slower pace.", quote:"Advice is what we ask for when we already know the answer." },
  { day:26, phase:"conversation", title:"Debates & Disagreements", emoji:"⚖️", topic:"Argumentation", explanation:"Debating respectfully is the highest form of intellectual conversation.", task:"Debate: 'Social media does more harm than good' — take both sides.", vocab:["On the other hand","I take your point however","The evidence suggests","Let me push back","To play devil's advocate"], challenge:"Win a debate without raising your voice or using absolutes.", aiPrompt:"Debate me: 'Money is the most important thing in life.'", pronunciation:"Control your speed and pitch — slow down for impact.", quote:"The purpose of argument is not to win, but to understand." },
  { day:27, phase:"conversation", title:"Humour & Wit", emoji:"😄", topic:"Light-hearted English", explanation:"Humour is the fastest way to connect with people in any language.", task:"Tell 2 clean jokes or funny anecdotes and explain why they're funny.", vocab:["Punchline","Wordplay","Irony","Sarcasm","Deadpan"], challenge:"Make someone laugh using irony — without sarcasm.", aiPrompt:"Tell me a funny story or joke and I'll rate it!", pronunciation:"Timing is everything — pause before the punchline.", quote:"If you can make someone laugh, you can make them do anything." },
  { day:28, phase:"conversation", title:"Describing Abstract Ideas", emoji:"🧠", topic:"Critical Thinking", explanation:"Explaining complex ideas simply is a rare and powerful skill.", task:"Explain 'democracy', 'justice', and 'happiness' to a 10-year-old.", vocab:["Essentially","At its core","What this means is","To put it simply","In other words"], challenge:"Explain 'the internet' without using any tech words.", aiPrompt:"Explain artificial intelligence to me as if I'm 5 years old.", pronunciation:"Use pauses and emphasis to highlight key ideas.", quote:"If you can't explain it simply, you don't understand it well enough." },
  { day:29, phase:"conversation", title:"Negotiations & Persuasion", emoji:"🤝", topic:"Influence & Negotiation", explanation:"Persuasion is about understanding people, not pressuring them.", task:"Negotiate a salary raise with your boss — practice both sides.", vocab:["Mutual benefit","I was hoping for","What if we were to","In light of my contributions","Let's find a middle ground"], challenge:"Persuade someone to do something using only logic — no emotional appeal.", aiPrompt:"Negotiate your salary with me. I'm your manager and I think ₹5 LPA is fair.", pronunciation:"Confident, steady pace — wavering voice weakens your position.", quote:"In business, you don't get what you deserve, you get what you negotiate." },
  { day:30, phase:"conversation", title:"Conversation Level-Up Test", emoji:"🏅", topic:"Full Conversation Review", explanation:"Milestone! Test everything you've learned in 15-minute free conversation.", task:"Have a full 15-minute conversation on ANY topic — no scripts, no notes.", vocab:["Articulate","Fluent","Natural","Engaging","Compelling"], challenge:"Talk for 15 minutes without saying 'um', 'uh', or 'like'.", aiPrompt:"Let's have a full free conversation — I'll change the topic every 3 minutes!", pronunciation:"Review all difficult sounds. Focus on natural rhythm and flow.", quote:"Halfway there! Your voice is getting stronger every single day. 🔥" },

  // ── CONFIDENCE & FLUENCY (Days 31–45) ──────────────────────────────────
  { day:31, phase:"fluency", title:"Think in English", emoji:"🧩", topic:"Mental Fluency", explanation:"True fluency means thinking in English, not translating from Hindi.", task:"For 30 minutes, try to think only in English — narrate what you see and do.", vocab:["Stream of thought","Inner voice","Mental translation","Intuition","Automatic"], challenge:"Describe your room's objects in English out loud for 5 full minutes.", aiPrompt:"Describe exactly what you're doing right now in real time!", pronunciation:"Natural rhythm — don't pause between every word.", quote:"Think in English. Dream in English. Live in English." },
  { day:32, phase:"fluency", title:"Filler Words & Flow", emoji:"🌊", topic:"Natural Speech", explanation:"Native speakers use fillers naturally. Learn which ones make you sound fluent.", task:"Record yourself and count your 'um's — then retry with proper fillers.", vocab:["Well","You see","As a matter of fact","What's interesting is","Now here's the thing"], challenge:"Speak for 3 minutes with ZERO 'um' or 'uh'.", aiPrompt:"Tell me about your day — I'll buzz every time you say 'um'!", pronunciation:"Use fillers to buy thinking time, not to fill silence nervously.", quote:"Fluency is not the absence of pauses — it's the confidence to own them." },
  { day:33, phase:"fluency", title:"Pronunciation Masterclass", emoji:"🎙️", topic:"Clear Pronunciation", explanation:"Clear pronunciation is more important than a perfect accent.", task:"Practice 20 commonly mispronounced words by Indian speakers.", vocab:["Comfortable","February","Specifically","Particularly","Worcestershire"], challenge:"Record and compare your pronunciation with a native speaker.", aiPrompt:"I'll say words and you pronounce them: 'particularly, comfortable, colonel'", pronunciation:"Focus: 'v' not 'w', 'th' not 'd', 'w' not 'v'.", quote:"Don't aim for a British accent — aim for a clear, confident accent." },
  { day:34, phase:"fluency", title:"Sentence Variety", emoji:"✍️", topic:"Language Range", explanation:"Using varied sentence structures makes you sound intelligent and engaging.", task:"Take 5 simple sentences and rewrite each in 3 different complex ways.", vocab:["Furthermore","Nevertheless","Consequently","Albeit","Notwithstanding"], challenge:"Write a paragraph using 7 different sentence structures.", aiPrompt:"Give me simple ideas and I'll help you make them sound brilliant!", pronunciation:"Longer sentences need breath control — practice steady breathing.", quote:"Variety is the spice of language." },
  { day:35, phase:"fluency", title:"Speed & Clarity Balance", emoji:"⚡", topic:"Speech Rate", explanation:"Speaking too fast confuses — too slow sounds unconfident. Find your zone.", task:"Read a paragraph at 3 different speeds. Record and compare.", vocab:["Articulate","Pacing","Emphasis","Pause","Cadence"], challenge:"Explain a complex topic at slow, medium, and fast speed.", aiPrompt:"Tell me about cricket — I'll adjust to your speed!", pronunciation:"Read tongue twisters daily: 'She sells sea shells by the sea shore'", quote:"Speak slowly enough to be understood, fast enough to be believed." },
  { day:36, phase:"fluency", title:"Idioms in Action", emoji:"🎭", topic:"Idiomatic English", explanation:"Idioms make your English colourful and native-like.", task:"Use 10 English idioms correctly in a 5-minute conversation.", vocab:["Hit the nail on the head","Under the weather","Bite the bullet","Cost an arm and a leg","Burn the midnight oil"], challenge:"Tell a story using only idioms — no literal language!", aiPrompt:"Use as many idioms as you can while telling me about your week!", pronunciation:"Idioms need confident delivery — they fall flat if whispered.", quote:"Idioms are the clothes language wears to a party." },
  { day:37, phase:"fluency", title:"Voice Modulation", emoji:"🎵", topic:"Vocal Power", explanation:"How you say something matters as much as what you say.", task:"Take one paragraph and read it 5 ways: excited, bored, angry, sad, confident.", vocab:["Intonation","Emphasis","Projection","Resonance","Tone"], challenge:"Say 'I love this job' in 5 different emotional tones.", aiPrompt:"Read this sentence 5 different ways and I'll guess the emotion!", pronunciation:"Breathe from your diaphragm — this gives your voice power.", quote:"Your voice is an instrument. Learn to play it." },
  { day:38, phase:"fluency", title:"Public Speaking Basics", emoji:"🎤", topic:"Speaking to Groups", explanation:"Public speaking is just a conversation at a higher volume.", task:"Give a 3-minute prepared speech on your biggest passion.", vocab:["Opening hook","Transition","Anecdote","Call to action","Memorable closing"], challenge:"Begin your speech with a shocking fact, not 'Good morning'.", aiPrompt:"Give me your speech! I'll be your audience of 100 people.", pronunciation:"Project your voice — speak to the back row.", quote:"There are two types of speakers: those who are nervous and those who are liars." },
  { day:39, phase:"fluency", title:"Connecting Ideas Smoothly", emoji:"🔗", topic:"Cohesion & Coherence", explanation:"Great speakers connect their ideas so listeners never get lost.", task:"Practice linking 5 ideas using different connectors each time.", vocab:["In addition to this","Not only that but also","What's more","Having said that","By the same token"], challenge:"Speak for 3 minutes and use a different connector every sentence.", aiPrompt:"Tell me about your city — connect every sentence to the last!", pronunciation:"Stress connectors slightly to signal the listener: transition coming!", quote:"A mind that connects ideas is a mind worth listening to." },
  { day:40, phase:"fluency", title:"Listening & Responding", emoji:"👂", topic:"Active Listening", explanation:"Great conversationalists listen more than they speak.", task:"Listen to a 10-min podcast. Summarise it. Then react with your opinion.", vocab:["If I understand correctly","Building on what you said","That reminds me","I see your point","What I'm hearing is"], challenge:"Respond to everything with a question first, then your opinion.", aiPrompt:"I'll tell you about my weekend. Ask 5 follow-up questions.", pronunciation:"Mirror the speaker's pace when responding — it builds rapport.", quote:"Most people listen to reply. Masters listen to understand." },
  { day:41, phase:"fluency", title:"Metaphors & Imagery", emoji:"🌈", topic:"Vivid Language", explanation:"Metaphors paint pictures with words — making your English memorable.", task:"Describe your life journey using 5 original metaphors.", vocab:["Life is a canvas","Time is a thief","Stress is a storm","Success is a mountain","Friendship is an anchor"], challenge:"Describe your city using ONLY metaphors — no literal words.", aiPrompt:"Describe your life so far using only metaphors and imagery!", pronunciation:"Pause after a strong metaphor — let it land.", quote:"A metaphor is a poem in disguise." },
  { day:42, phase:"fluency", title:"Storytelling with Emotion", emoji:"💫", topic:"Emotional Storytelling", explanation:"The best stories don't just describe events — they make you feel them.", task:"Retell your happiest memory with so much detail, your listener feels it.", vocab:["I could feel","The air smelled of","Time seemed to stop","My heart raced","I'll never forget"], challenge:"Tell a story in only 5 sentences that makes someone emotional.", aiPrompt:"Tell me your happiest memory. Make me feel like I was there!", pronunciation:"Slow down at emotional moments — speed up at exciting ones.", quote:"Stories are the most powerful currency in the world." },
  { day:43, phase:"fluency", title:"Cultural English & Slang", emoji:"🌏", topic:"Modern English", explanation:"Understanding slang and cultural references makes you sound current.", task:"Learn 10 modern English phrases used by young people globally.", vocab:["That's lit","No cap","It's giving vibes","Lowkey obsessed","Hits different"], challenge:"Have a conversation using 5 modern slang terms naturally.", aiPrompt:"Chat with me like we're Gen-Z friends catching up!", pronunciation:"Slang has its own rhythm — don't over-pronounce it.", quote:"Language lives in the streets, not just in textbooks." },
  { day:44, phase:"fluency", title:"Spontaneous Speaking", emoji:"🎲", topic:"Impromptu Speech", explanation:"Being able to speak on any topic instantly is the ultimate fluency skill.", task:"Set a timer. Pick a random word. Speak for 2 minutes without stopping.", vocab:["Off the top of my head","As I think about this","This is interesting because","Come to think of it","Actually now that I mention it"], challenge:"Speak for 3 minutes about a random object in your room.", aiPrompt:"I'll give you a random word — speak about it for 2 minutes. Ready?", pronunciation:"Comfortable natural speed — don't rush when improvising.", quote:"The human brain is the only thing that starts working when you open your mouth." },
  { day:45, phase:"fluency", title:"Fluency Checkpoint", emoji:"🚀", topic:"Fluency Review", explanation:"You're 75% through! This day proves how far your English has come.", task:"Record a 5-minute unscripted video on any topic — watch it back.", vocab:["Articulate","Spontaneous","Nuanced","Expressive","Compelling"], challenge:"Compare this video with your Day 1 recording. List 5 improvements.", aiPrompt:"Let's have a 10-minute free conversation — show me everything!", pronunciation:"Notice your natural rhythm — it should feel comfortable now.", quote:"Three-quarters done. Your voice is powerful. Your English is alive. 🌟" },

  // ── ADVANCED COMMUNICATION & INTERVIEW (Days 46–60) ────────────────────
  { day:46, phase:"advanced", title:"Professional Vocabulary", emoji:"💼", topic:"Business English", explanation:"Business English opens doors to global opportunities and professional success.", task:"Practice writing and speaking a professional email, then read it aloud.", vocab:["Per our conversation","As discussed","Going forward","Action item","Deliverable"], challenge:"Rewrite a casual message as a formal professional email.", aiPrompt:"Draft a professional email to a client explaining a project delay.", pronunciation:"Professional tone — calm, clear, and authoritative.", quote:"Your professional vocabulary is your business card." },
  { day:47, phase:"advanced", title:"Formal Presentations", emoji:"📊", topic:"Business Presentations", explanation:"Delivering a structured, compelling presentation is a career superpower.", task:"Give a 5-minute presentation on your company, idea, or a topic you know.", vocab:["Allow me to walk you through","As you can see from","The key takeaway here is","I'd like to draw your attention to","To summarise"], challenge:"Present without looking at any notes. Own the room.", aiPrompt:"Give me a 3-minute sales pitch for any product you love!", pronunciation:"Project confidence: speak to the back of the room.", quote:"A great presentation is 20% content and 80% conviction." },
  { day:48, phase:"advanced", title:"Interview English — Part 1", emoji:"🤵", topic:"Job Interviews", explanation:"Interview English is specific, structured, and needs dedicated practice.", task:"Answer: 'Tell me about yourself' in under 2 minutes — structured and compelling.", vocab:["Proven track record","Cross-functional","Stakeholder","Initiative","Spearheaded"], challenge:"Answer without using the phrase 'I am responsible for'.", aiPrompt:"You have a job interview at Google. I'm the interviewer. Begin!", pronunciation:"Confident, measured speech — no rushing when nervous.", quote:"Interviews are a sales pitch where you are the product." },
  { day:49, phase:"advanced", title:"Interview English — Part 2", emoji:"🏢", topic:"Behavioral Questions", explanation:"STAR method: Situation, Task, Action, Result — the perfect interview framework.", task:"Answer using STAR: 'Tell me about a time you handled a difficult situation.'", vocab:["I was tasked with","I took the initiative to","The result was","I collaborated with","Ultimately"], challenge:"Answer 3 different STAR questions in under 5 minutes each.", aiPrompt:"Behavioural interview question: 'Describe a challenge you overcame at work.'", pronunciation:"Keep steady eye contact — your voice will follow naturally.", quote:"Every behavioural question is an invitation to tell your best story." },
  { day:50, phase:"advanced", title:"Handling Tough Questions", emoji:"🛡️", topic:"Difficult Conversations", explanation:"How you handle hard questions reveals your character and intelligence.", task:"Practice: 'What's your biggest weakness?' 'Why did you leave?' 'Why should we hire you?'", vocab:["That's a great question","I've reflected on this and","What I've learned from that is","I see this as an opportunity to","My philosophy is"], challenge:"Answer 'What's your weakness?' without it actually sounding like a weakness.", aiPrompt:"I'll ask you the 5 hardest interview questions. No softballs!", pronunciation:"Pause before answering — it shows you think before you speak.", quote:"There are no trick questions — only unprepared answers." },
  { day:51, phase:"advanced", title:"Networking English", emoji:"🌐", topic:"Professional Networking", explanation:"Networking is about building genuine connections, not collecting contacts.", task:"Practice a 30-second elevator pitch about yourself for a networking event.", vocab:["I work in the space of","I'm passionate about","I'd love to connect about","What you're working on sounds fascinating","Let's exchange details"], challenge:"Introduce yourself memorably without mentioning your job title.", aiPrompt:"We've just met at a tech conference. Network with me!", pronunciation:"Warm, open tone — networking energy is different from interview energy.", quote:"Your network is your net worth." },
  { day:52, phase:"advanced", title:"Academic English", emoji:"📖", topic:"Academic Communication", explanation:"Academic English is formal, structured, and evidence-based.", task:"Give a 3-minute talk on any topic as if presenting research at a seminar.", vocab:["The data suggests","It can be inferred that","This is consistent with","The implications of this are","To the contrary"], challenge:"Argue a position using only evidence — no opinions.", aiPrompt:"Present your argument: 'Is remote work better than office work?'", pronunciation:"Academic pace is slower and more deliberate than casual speech.", quote:"Education is not the filling of a bucket but the lighting of a fire." },
  { day:53, phase:"advanced", title:"Leadership Communication", emoji:"👑", topic:"Leadership Language", explanation:"Leaders speak with clarity, vision, and the ability to inspire others.", task:"Give a 2-minute motivational speech to your 'team' about a challenging project.", vocab:["Our collective vision","I have every confidence in","Together we will","What unites us is","The opportunity before us"], challenge:"Give a speech that makes someone feel capable of anything.", aiPrompt:"Motivate your team. They've just failed an important project.", pronunciation:"Confident, resonant voice — leadership lives in the lower register.", quote:"A leader's job is to look into the future and articulate what they see." },
  { day:54, phase:"advanced", title:"Conflict Resolution", emoji:"🕊️", topic:"Diplomatic Communication", explanation:"Resolving conflict with language requires empathy, clarity, and patience.", task:"Practice a difficult conversation: giving negative feedback, handling complaints.", vocab:["I understand where you're coming from","Help me understand","What would a good outcome look like for you","I want to be transparent","My intention was"], challenge:"Resolve a conflict without ever blaming the other person.", aiPrompt:"I'm a frustrated customer who's been wrongly charged. Handle this perfectly.", pronunciation:"Calm, even tone is essential — emotion escalates conflict.", quote:"Peace is not the absence of conflict, but the presence of communication." },
  { day:55, phase:"advanced", title:"Persuasive Speaking", emoji:"🎯", topic:"Advanced Persuasion", explanation:"Persuasion combines logic, emotion, and credibility — the rhetorical triangle.", task:"Persuade someone to adopt a healthy habit using ethos, pathos, and logos.", vocab:["Research demonstrates","Consider for a moment","Imagine the possibility","The statistics are clear","You have the power to"], challenge:"Persuade me to do something I said I'd never do.", aiPrompt:"Persuade me to wake up at 5am every day. I love sleeping in!", pronunciation:"Vary pace: slow for logic, faster for excitement, pause for effect.", quote:"The most powerful force in the universe is a human being with a purpose and the words to express it." },
  { day:56, phase:"advanced", title:"Cross-Cultural Communication", emoji:"🌍", topic:"Global English", explanation:"Global English means adapting your style for different cultures and contexts.", task:"Discuss: how communication styles differ between India, UK, USA, and Japan.", vocab:["High-context culture","Direct communication","Formal register","Code-switching","Cultural sensitivity"], challenge:"Explain an Indian festival to someone from a completely different culture.", aiPrompt:"I'm from the UK and know nothing about Indian culture. Explain Diwali to me!", pronunciation:"Clear, neutral pronunciation — avoid heavy regional accents for global audiences.", quote:"The world belongs to those who can communicate across it." },
  { day:57, phase:"advanced", title:"Media & Presentation Polish", emoji:"🎬", topic:"On-Camera English", explanation:"Speaking on camera, podcasts, and video calls is a modern essential skill.", task:"Record a 2-minute product review or tutorial video on any topic.", vocab:["As you can see","I'll walk you through","Let me demonstrate","The key point here","Don't forget to"], challenge:"Record a take in ONE shot — no re-recordings allowed!", aiPrompt:"Record a 1-minute intro for your own YouTube channel!", pronunciation:"Speak to the camera as if it's a person. Smile — it changes your voice.", quote:"On camera, your words are amplified and your confidence is visible." },
  { day:58, phase:"advanced", title:"Written to Spoken English", emoji:"📝", topic:"Converting Writing to Speech", explanation:"Most people think in writing. Fluent speakers think in speech patterns.", task:"Take a formal essay paragraph and transform it into natural spoken English.", vocab:["So basically","What this really means is","Let me break this down","The point is","Here's the thing"], challenge:"Make a legal document sound like a friendly conversation.", aiPrompt:"I'll give you a formal sentence. Convert it to natural spoken English!", pronunciation:"Written sentences often need restructuring to sound natural out loud.", quote:"Writing is speaking to the eye. Speaking is writing to the ear." },
  { day:59, phase:"advanced", title:"Master Mock Interview", emoji:"💎", topic:"Full Interview Simulation", explanation:"A complete, 20-minute mock interview for your dream job.", task:"Full interview: intro, experience, situational, salary, and closing questions.", vocab:["I'm particularly drawn to","My value proposition is","I see myself contributing by","I'm excited by the opportunity to","I have a few questions for you"], challenge:"Ask the interviewer 3 questions that make them think.", aiPrompt:"Full 20-min mock interview for a Product Manager role at a top startup.", pronunciation:"Polished, professional — every word should feel earned.", quote:"Success is when preparation meets opportunity — and you've prepared for 59 days." },
  { day:60, phase:"advanced", title:"English Mastery Graduation", emoji:"🎓", topic:"Final Showcase", explanation:"This is it — your graduation day. 60 days of growth in one final performance.", task:"Record your definitive 5-minute speech: Who you are, where you started, where you're going.", vocab:["Transformation","Journey","Mastery","Articulate","Unstoppable"], challenge:"Watch your Day 1 recording back-to-back with today's. Celebrate the difference.", aiPrompt:"Give me your graduation speech. Make it inspiring. The world is listening.", pronunciation:"Own your voice. It's yours. It's powerful. It's enough.", quote:"You did it. 60 days. You are not the same person who started this journey. 🎓🌟" },
];

const PHASE_CONFIG = {
  beginner:     { label:"Beginner English",                    color:"#4FC3F7", bg:"#0D1F2D", emoji:"🌱", days:"1–15" },
  conversation: { label:"Daily Conversation",                  color:"#A5D6A7", bg:"#0D2218", emoji:"💬", days:"16–30" },
  fluency:      { label:"Confidence & Fluency",                color:"#CE93D8", bg:"#1A0D28", emoji:"🚀", days:"31–45" },
  advanced:     { label:"Advanced & Interview Prep",           color:"#FFCC80", bg:"#261A00", emoji:"🏆", days:"46–60" },
};

const MOTIVATIONAL_QUOTES = [
  "The only way to learn a language is to use it.",
  "Every day you practice is a day you grow.",
  "Your accent is a sign of bravery, not a weakness.",
  "Fluency is not perfection — it's communication.",
  "Speak even when your voice shakes.",
];


function RoadmapScreen({ onBack }) {
  const [completedDays, setCompletedDays] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sv_roadmap_completed") || "[]"); } catch { return []; }
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [filterPhase, setFilterPhase] = useState("all");
  const [xpEarned, setXpEarned] = useState(() => completedDays.length * 50);
  const [showXpToast, setShowXpToast] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceSeconds, setPracticeSeconds] = useState(0);
  const timerRef = useRef(null);
  const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

  const saveCompleted = (days) => {
    try { localStorage.setItem("sv_roadmap_completed", JSON.stringify(days)); } catch {}
  };

  const completeDay = (dayNum) => {
    if (completedDays.includes(dayNum)) return;
    const updated = [...completedDays, dayNum];
    setCompletedDays(updated);
    setXpEarned(prev => prev + 50);
    saveCompleted(updated);
    setShowXpToast(true);
    setTimeout(() => setShowXpToast(false), 2500);
    setSelectedDay(null);
  };

  const isDayLocked = (dayNum) => dayNum > 1 && !completedDays.includes(dayNum - 1);
  const progressPct = Math.round((completedDays.length / 60) * 100);

  const startPractice = () => {
    setIsPracticing(true);
    setPracticeSeconds(0);
    timerRef.current = setInterval(() => setPracticeSeconds(s => s + 1), 1000);
  };
  const stopPractice = () => {
    setIsPracticing(false);
    clearInterval(timerRef.current);
  };
  useEffect(() => () => clearInterval(timerRef.current), []);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const phases = ["all","beginner","conversation","fluency","advanced"];
  const visibleDays = filterPhase === "all"
    ? ROADMAP_DATA
    : ROADMAP_DATA.filter(d => d.phase === filterPhase);

  // ── Day Detail Modal ───────────────────────────────────────────────────
  if (selectedDay) {
    const d = selectedDay;
    const pc = PHASE_CONFIG[d.phase];
    const done = completedDays.includes(d.day);
    const locked = isDayLocked(d.day);
    return (
      <div className="screen" style={{ height:"100%", overflowY:"auto", background:`linear-gradient(160deg, #0A0A14, ${pc.bg})`, paddingBottom: 32 }}>
        {/* Header */}
        <div style={{ padding:"52px 20px 0", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => setSelectedDay(null)} style={{ background:"none", border:"none", cursor:"pointer", flexShrink:0 }}>
            <Icon name="back" size={22} color="#B0B3C6" />
          </button>
          <div style={{ flex:1 }}>
            <div style={{ color: pc.color, fontSize:11, fontWeight:700, letterSpacing:1 }}>DAY {d.day} · {pc.label.toUpperCase()}</div>
            <div style={{ color:"white", fontSize:18, fontWeight:800, marginTop:2 }}>{d.emoji} {d.title}</div>
          </div>
          {done && <div style={{ background:"#4CAF5022", border:"1px solid #4CAF5044", borderRadius:20, padding:"4px 10px", color:"#4CAF50", fontSize:11, fontWeight:700 }}>✅ Done</div>}
        </div>

        <div style={{ padding:"20px 20px 0" }}>
          {/* Topic Badge */}
          <div style={{ display:"flex", gap:8, marginBottom:16 }}>
            <div style={{ background:`${pc.color}18`, border:`1px solid ${pc.color}44`, borderRadius:20, padding:"4px 12px", fontSize:12, color:pc.color, fontWeight:600 }}>📌 {d.topic}</div>
          </div>

          {/* Explanation */}
          <div style={{ background:"#1A1A2E", borderRadius:16, padding:16, marginBottom:14, border:"1px solid #2A2A4A" }}>
            <div style={{ color:"#787BCB", fontSize:11, fontWeight:700, marginBottom:6 }}>📖 TODAY'S LESSON</div>
            <div style={{ color:"#D0D0E8", fontSize:14, lineHeight:1.7 }}>{d.explanation}</div>
          </div>

          {/* Speaking Task */}
          <div style={{ background:`${pc.color}10`, borderRadius:16, padding:16, marginBottom:14, border:`1px solid ${pc.color}30` }}>
            <div style={{ color:pc.color, fontSize:11, fontWeight:700, marginBottom:8 }}>🎯 SPEAKING TASK</div>
            <div style={{ color:"white", fontSize:14, lineHeight:1.6 }}>{d.task}</div>
          </div>

          {/* Vocabulary */}
          <div style={{ background:"#1A1A2E", borderRadius:16, padding:16, marginBottom:14, border:"1px solid #2A2A4A" }}>
            <div style={{ color:"#CE93D8", fontSize:11, fontWeight:700, marginBottom:10 }}>📚 VOCABULARY WORDS</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {d.vocab.map((v,i) => (
                <div key={i} style={{ background:"#CE93D822", border:"1px solid #CE93D844", borderRadius:20, padding:"4px 12px", fontSize:12, color:"#CE93D8", fontWeight:600 }}>{v}</div>
              ))}
            </div>
          </div>

          {/* Daily Challenge */}
          <div style={{ background:"linear-gradient(135deg,#1A1200,#2A1A00)", borderRadius:16, padding:16, marginBottom:14, border:"1px solid #FFD70033" }}>
            <div style={{ color:"#FFD700", fontSize:11, fontWeight:700, marginBottom:8 }}>⚡ DAILY CHALLENGE</div>
            <div style={{ color:"white", fontSize:14, lineHeight:1.6 }}>{d.challenge}</div>
          </div>

          {/* Pronunciation */}
          <div style={{ background:"#1A1A2E", borderRadius:16, padding:16, marginBottom:14, border:"1px solid #2A2A4A" }}>
            <div style={{ color:"#4FC3F7", fontSize:11, fontWeight:700, marginBottom:8 }}>🔊 PRONUNCIATION TIP</div>
            <div style={{ color:"#B0B3C6", fontSize:13, lineHeight:1.6 }}>{d.pronunciation}</div>
          </div>

          {/* AI Practice CTA */}
          <div style={{ background:"linear-gradient(135deg,#1A0D28,#120826)", borderRadius:16, padding:16, marginBottom:14, border:"1px solid #787BCB44" }}>
            <div style={{ color:"#787BCB", fontSize:11, fontWeight:700, marginBottom:8 }}>🤖 AI PRACTICE PROMPT</div>
            <div style={{ color:"#D0D0E8", fontSize:13, lineHeight:1.6, marginBottom:12, fontStyle:"italic" }}>"{d.aiPrompt}"</div>
            <button className="btn-primary" style={{ width:"100%", padding:"12px", fontSize:14 }}>
              🤖 Practice with AI
            </button>
          </div>

          {/* Voice Practice Timer */}
          <div style={{ background:"#1A1A2E", borderRadius:16, padding:16, marginBottom:16, border:"1px solid #2A2A4A" }}>
            <div style={{ color:"#A5D6A7", fontSize:11, fontWeight:700, marginBottom:10 }}>🎙️ VOICE PRACTICE</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:32, fontWeight:700, color: isPracticing ? "#4CAF50" : "white" }}>
                {fmt(practiceSeconds)}
              </div>
              <button
                onClick={isPracticing ? stopPractice : startPractice}
                style={{ background: isPracticing ? "#E5393522" : "#4CAF5022", border:`1px solid ${isPracticing?"#E5393555":"#4CAF5055"}`, borderRadius:30, padding:"10px 20px", color: isPracticing ? "#E53935" : "#4CAF50", cursor:"pointer", fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:13 }}>
                {isPracticing ? "⏹ Stop" : "▶ Start Speaking"}
              </button>
            </div>
            {isPracticing && (
              <div style={{ display:"flex", gap:2, marginTop:10, alignItems:"center" }}>
                {Array(16).fill(0).map((_,i) => (
                  <div key={i} className="waveform-bar" style={{ animationDelay:`${i*0.1}s`, background:"#4CAF50" }} />
                ))}
              </div>
            )}
          </div>

          {/* Quote */}
          <div style={{ background:"linear-gradient(135deg,#0F0F2A,#0A0A1A)", borderRadius:16, padding:16, marginBottom:20, border:"1px solid #1E1E3A", textAlign:"center" }}>
            <div style={{ color:"#787BCB", fontSize:20, marginBottom:8 }}>"</div>
            <div style={{ color:"#B0B3C6", fontSize:13, fontStyle:"italic", lineHeight:1.6 }}>{d.quote}</div>
          </div>

          {/* Complete Button */}
          {!done && !locked && (
            <button className="btn-primary" style={{ width:"100%", padding:"16px", fontSize:15 }} onClick={() => completeDay(d.day)}>
              ✅ Mark Day {d.day} Complete · +50 XP
            </button>
          )}
          {done && (
            <div style={{ textAlign:"center", padding:16, background:"#4CAF5015", border:"1px solid #4CAF5044", borderRadius:30, color:"#4CAF50", fontWeight:700 }}>
              🌟 Day {d.day} Completed! · +50 XP earned
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Roadmap List View ──────────────────────────────────────────────────
  return (
    <div className="screen" style={{ height:"100%", background:"#080814" }}>
      {/* XP Toast */}
      {showXpToast && (
        <div style={{ position:"absolute", top:60, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#FFD700,#FF8C00)", borderRadius:30, padding:"10px 20px", zIndex:99, boxShadow:"0 8px 24px #FFD70066", animation:"slideUp 0.3s ease", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>⚡</span>
          <span style={{ color:"black", fontWeight:800, fontSize:14 }}>+50 XP Earned!</span>
        </div>
      )}

      {/* Fixed Header */}
      <div style={{ padding:"52px 20px 0", background:"linear-gradient(180deg,#080814 80%,transparent)", position:"sticky", top:0, zIndex:10, paddingBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer" }}>
            <Icon name="back" size={22} color="#B0B3C6" />
          </button>
          <div style={{ flex:1 }}>
            <div style={{ color:"white", fontSize:18, fontWeight:800 }}>60-Day English Roadmap 🗺️</div>
            <div style={{ color:"#555575", fontSize:11, marginTop:1 }}>Your complete speaking journey</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:"#FFD700", fontWeight:800, fontSize:15 }}>⚡ {xpEarned}</div>
            <div style={{ color:"#555575", fontSize:10 }}>XP earned</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ background:"#1A1A2E", borderRadius:12, padding:"12px 14px", marginBottom:12, border:"1px solid #2A2A4A" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ color:"white", fontWeight:700, fontSize:13 }}>Progress</span>
            <span style={{ color:"#787BCB", fontWeight:800, fontSize:13 }}>{completedDays.length}/60 days · {progressPct}%</span>
          </div>
          <div style={{ height:8, background:"#2A2A4A", borderRadius:4, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progressPct}%`, background:"linear-gradient(90deg,#787BCB,#9B9EE0)", borderRadius:4, transition:"width 0.8s ease" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
            {["🌱","💬","🚀","🏆"].map((e,i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontSize:14 }}>{e}</div>
                <div style={{ color:"#444466", fontSize:9 }}>{["Day 1","Day 16","Day 31","Day 46"][i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Filter */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4 }}>
          {phases.map(p => {
            const pc = p === "all" ? null : PHASE_CONFIG[p];
            const active = filterPhase === p;
            return (
              <button key={p} onClick={() => setFilterPhase(p)} style={{ background: active ? (pc ? pc.color+"22" : "#787BCB22") : "#1A1A2E", border:`1px solid ${active ? (pc ? pc.color+"66" : "#787BCB66") : "#2A2A4A"}`, borderRadius:20, padding:"5px 12px", fontSize:11, fontWeight:700, color: active ? (pc?.color || "#787BCB") : "#555575", cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'Sora',sans-serif" }}>
                {p === "all" ? "🗺️ All" : `${pc.emoji} ${pc.days}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Motivational Quote */}
      <div style={{ margin:"8px 20px 0", background:"linear-gradient(135deg,#1A1A2E,#0F0F1A)", borderRadius:14, padding:"10px 14px", border:"1px solid #2A2A4A", display:"flex", gap:8, alignItems:"center" }}>
        <span style={{ fontSize:16 }}>✨</span>
        <span style={{ color:"#787BCB", fontSize:12, fontStyle:"italic" }}>{randomQuote}</span>
      </div>

      {/* Day Cards */}
      <div style={{ overflowY:"auto", height:"calc(100% - 320px)", padding:"12px 20px 20px" }}>
        {/* Phase group headers */}
        {["beginner","conversation","fluency","advanced"].map(phase => {
          const phaseDays = visibleDays.filter(d => d.phase === phase);
          if (!phaseDays.length) return null;
          const pc = PHASE_CONFIG[phase];
          const phaseCompleted = phaseDays.filter(d => completedDays.includes(d.day)).length;
          return (
            <div key={phase} style={{ marginBottom:8 }}>
              {/* Phase Header */}
              <div style={{ display:"flex", alignItems:"center", gap:8, margin:"14px 0 10px", padding:"10px 14px", background:`${pc.color}10`, borderRadius:12, border:`1px solid ${pc.color}25` }}>
                <span style={{ fontSize:18 }}>{pc.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ color:pc.color, fontWeight:700, fontSize:13 }}>{pc.label}</div>
                  <div style={{ color:"#555575", fontSize:10 }}>Days {pc.days} · {phaseCompleted}/{phaseDays.length} done</div>
                </div>
                <div style={{ color:pc.color, fontWeight:800, fontSize:12 }}>{Math.round((phaseCompleted/phaseDays.length)*100)}%</div>
              </div>

              {/* Day cards */}
              {phaseDays.map((d, idx) => {
                const done = completedDays.includes(d.day);
                const locked = isDayLocked(d.day);
                const isCurrent = !done && !locked;
                return (
                  <div key={d.day}
                    onClick={() => !locked && setSelectedDay(d)}
                    style={{
                      display:"flex", alignItems:"center", gap:12,
                      background: done ? "#0D1F0D" : isCurrent ? "#1A1A2E" : "#0F0F18",
                      border:`1px solid ${done ? "#4CAF5033" : isCurrent ? pc.color+"44" : "#1A1A2E"}`,
                      borderRadius:16, padding:"12px 14px", marginBottom:8,
                      cursor: locked ? "not-allowed" : "pointer",
                      opacity: locked ? 0.45 : 1,
                      transition:"all 0.2s",
                      transform: isCurrent ? "none" : "none",
                      boxShadow: isCurrent ? `0 0 12px ${pc.color}18` : "none",
                      animation: `fadeIn 0.3s ${idx * 0.03}s both`,
                    }}
                    onMouseEnter={e => { if (!locked) e.currentTarget.style.transform = "translateX(4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
                  >
                    {/* Day number circle */}
                    <div style={{ width:42, height:42, borderRadius:14, background: done ? "#4CAF5022" : isCurrent ? `${pc.color}20` : "#1A1A2E", border:`2px solid ${done ? "#4CAF50" : isCurrent ? pc.color : "#2A2A4A"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize: done ? 18 : 13, fontWeight:700, color: done ? "#4CAF50" : isCurrent ? pc.color : "#333355" }}>
                      {done ? "✓" : locked ? "🔒" : d.day}
                    </div>

                    {/* Content */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color: locked ? "#333355" : "white", fontWeight:600, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{d.emoji} {d.title}</div>
                      <div style={{ color:"#444466", fontSize:11, marginTop:2 }}>{d.topic}</div>
                    </div>

                    {/* Status */}
                    <div style={{ flexShrink:0 }}>
                      {done ? (
                        <div style={{ color:"#4CAF50", fontSize:11, fontWeight:700 }}>+50 XP</div>
                      ) : isCurrent ? (
                        <div style={{ color:pc.color, fontSize:18 }}>›</div>
                      ) : (
                        <div style={{ color:"#333355", fontSize:14 }}>🔒</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ── Premium Plans Screen ───────────────────────────────────────────────────
function PremiumScreen({ onBack }) {
  const [selected, setSelected] = useState("gold");
  const [purchasedPlan, setPurchasedPlan] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const plans = [
    {
      id: "silver",
      medal: "🥉",
      name: "Silver",
      price: "₹199",
      period: "/month",
      originalPrice: null,
      tag: null,
      color: "#9E9E9E",
      glow: "#9E9E9E44",
      border: "#9E9E9E44",
      bg: "linear-gradient(135deg,#2A2A2A,#1A1A1A)",
      features: [
        { icon: "📞", text: "Unlimited calls" },
        { icon: "🚫", text: "No ads" },
        { icon: "🤖", text: "Better AI feedback" },
        { icon: "🔥", text: "Daily streak rewards" },
      ],
    },
    {
      id: "gold",
      medal: "🥈",
      name: "Gold",
      price: "₹399",
      period: "/month",
      originalPrice: "₹1299",
      tag: "👉 Most Popular",
      color: "#FFD700",
      glow: "#FFD70055",
      border: "#FFD70066",
      bg: "linear-gradient(135deg,#2A2200,#1A1500)",
      features: [
        { icon: "⚧", text: "Gender selection" },
        { icon: "🌍", text: "Country selection" },
        { icon: "📊", text: "Advanced fluency analysis" },
        { icon: "💼", text: "Interview mode" },
        { icon: "⚡", text: "Priority matching" },
        { icon: "🎭", text: "AI roleplay" },
      ],
    },
    {
      id: "platinum",
      medal: "🥇",
      name: "Platinum VIP",
      price: "₹2999",
      period: "/month",
      originalPrice: null,
      tag: "👑 Premium",
      color: "#E5E4E2",
      glow: "#E5E4E255",
      border: "#E5E4E266",
      bg: "linear-gradient(135deg,#1A1A2E,#0F0F1A)",
      features: [
        { icon: "✅", text: "All Gold features" },
        { icon: "🚀", text: "Instant matching" },
        { icon: "✔️", text: "Verified badge" },
        { icon: "👥", text: "Exclusive users only" },
        { icon: "🎙️", text: "HD voice quality" },
        { icon: "🧑‍🏫", text: "AI personal coach" },
        { icon: "🔓", text: "Early access features" },
      ],
    },
    {
      id: "lifetime",
      medal: "💎",
      name: "Lifetime",
      price: "₹6999",
      period: " one-time",
      originalPrice: null,
      tag: "♾️ Forever",
      color: "#00E5FF",
      glow: "#00E5FF44",
      border: "#00E5FF55",
      bg: "linear-gradient(135deg,#001A1F,#00101A)",
      features: [
        { icon: "🔓", text: "Everything unlocked forever" },
        { icon: "👑", text: "VIP badge" },
        { icon: "🤖", text: "Future AI features free" },
        { icon: "💎", text: "Lifetime priority support" },
      ],
    },
  ];

  const handleBuy = () => {
    setPurchasedPlan(selected);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const currentPlan = plans.find(p => p.id === selected);

  return (
    <div className="screen" style={{ height: "100%", overflowY: "auto", background: "linear-gradient(160deg,#050510,#0A0A20)", paddingBottom: 32 }}>
      {/* Success Toast */}
      {showSuccess && (
        <div style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#4CAF50,#2E7D32)", borderRadius: 30, padding: "10px 24px", zIndex: 999, boxShadow: "0 8px 30px #4CAF5066", animation: "slideUp 0.3s ease", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🎉</span>
          <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{currentPlan?.name} Plan Activated!</span>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "52px 20px 0", display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }} onClick={onBack}>
          <Icon name="back" size={22} color="#B0B3C6" />
        </button>
        <div>
          <div style={{ color: "white", fontSize: 20, fontWeight: 800 }}>Premium Plans 👑</div>
          <div style={{ color: "#555575", fontSize: 12, marginTop: 1 }}>Upgrade your learning experience</div>
        </div>
      </div>

      {/* Promo Banner */}
      <div style={{ margin: "16px 20px", background: "linear-gradient(135deg,#787BCB22,#5A5DB822)", border: "1px solid #787BCB44", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>🎁</span>
        <div>
          <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>Limited Time Offer</div>
          <div style={{ color: "#787BCB", fontSize: 11 }}>Gold plan at 70% OFF — ₹399 instead of ₹1299</div>
        </div>
        <div style={{ marginLeft: "auto", background: "#E53935", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "white" }}>70% OFF</div>
      </div>

      {/* Plan Cards */}
      <div style={{ padding: "0 20px" }}>
        {plans.map((plan) => {
          const isSelected = selected === plan.id;
          const isPurchased = purchasedPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{
                marginBottom: 14,
                borderRadius: 22,
                background: isSelected ? plan.bg : "#0F0F1A",
                border: `2px solid ${isSelected ? plan.color : "#1E1E38"}`,
                padding: "18px 18px",
                cursor: "pointer",
                transition: "all 0.25s",
                boxShadow: isSelected ? `0 8px 32px ${plan.glow}` : "none",
                transform: isSelected ? "scale(1.01)" : "scale(1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glow blob for selected */}
              {isSelected && (
                <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: plan.color, opacity: 0.08, filter: "blur(30px)", pointerEvents: "none" }} />
              )}

              {/* Tags */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 28 }}>{plan.medal}</span>
                  <div>
                    <div style={{ color: "white", fontWeight: 800, fontSize: 16 }}>{plan.name}</div>
                    {plan.tag && (
                      <div style={{ background: `${plan.color}22`, border: `1px solid ${plan.color}55`, borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700, color: plan.color, display: "inline-block", marginTop: 3 }}>{plan.tag}</div>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3, justifyContent: "flex-end" }}>
                    <span style={{ color: plan.color, fontSize: 24, fontWeight: 800 }}>{plan.price}</span>
                    <span style={{ color: "#555575", fontSize: 12 }}>{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <div style={{ color: "#444466", fontSize: 11, textDecoration: "line-through" }}>{plan.originalPrice}/month</div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 4px" }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{f.icon}</span>
                    <span style={{ color: isSelected ? "#D0D0E8" : "#555575", fontSize: 11, fontWeight: 500 }}>{f.text}</span>
                  </div>
                ))}
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <div style={{ position: "absolute", top: 14, right: 14, width: 22, height: 22, borderRadius: "50%", background: plan.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="check" size={12} color="black" />
                </div>
              )}

              {isPurchased && (
                <div style={{ marginTop: 10, background: "#4CAF5022", border: "1px solid #4CAF5044", borderRadius: 8, padding: "4px 10px", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <Icon name="check" size={12} color="#4CAF50" />
                  <span style={{ color: "#4CAF50", fontSize: 11, fontWeight: 600 }}>Active Plan</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ padding: "4px 20px 0" }}>
        <button
          className="btn-primary"
          style={{ width: "100%", padding: "16px", fontSize: 15, background: `linear-gradient(135deg, ${currentPlan?.color === "#FFD700" ? "#B8860B,#FFD700" : currentPlan?.color === "#9E9E9E" ? "#757575,#BDBDBD" : currentPlan?.color === "#00E5FF" ? "#006064,#00E5FF" : "#787BCB,#5A5DB8"})` }}
          onClick={handleBuy}
        >
          {currentPlan?.medal} Get {currentPlan?.name} — {currentPlan?.price}{currentPlan?.period}
        </button>
        <div style={{ textAlign: "center", color: "#333355", fontSize: 11, marginTop: 10 }}>
          🔒 Secure payment · Cancel anytime · Instant activation
        </div>
      </div>
    </div>
  );
}

// ── Navigation Bar ─────────────────────────────────────────────────────────
function NavBar({ active, onHome, onProfile, onLeaderboard, onPremium }) {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(10,10,20,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid #1A1A2E", display: "flex", padding: "4px 0 12px" }}>
      <button className={`nav-item ${active === "home" ? "active" : ""}`} onClick={onHome}>
        <Icon name="home" size={22} />
        <span>Home</span>
      </button>
      <button className={`nav-item ${active === "leaderboard" ? "active" : ""}`} onClick={onLeaderboard}>
        <Icon name="trophy" size={22} />
        <span>Ranks</span>
      </button>
      <button className={`nav-item ${active === "premium" ? "active" : ""}`} onClick={onPremium} style={{ color: active === "premium" ? "#FFD700" : "#555575" }}>
        <span style={{ fontSize: 20 }}>👑</span>
        <span style={{ fontSize: 10 }}>Premium</span>
      </button>
      <button className={`nav-item ${active === "profile" ? "active" : ""}`} onClick={onProfile}>
        <Icon name="user" size={22} />
        <span>Profile</span>
      </button>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]       = useState("splash");
  const [navActive, setNavActive] = useState("home");
  const [aiMode, setAiMode]       = useState(AI_MODES[0]);
  const [aiSessionEnd, setAiSessionEnd] = useState(false);
  // ── Track where voice_rooms / ai_analytics were opened FROM ──────────────
  const [prevScreen, setPrevScreen] = useState("dashboard");

  const go = (s, from) => {
    // Record origin before navigating to overlay screens
    if (s === "voice_rooms" || s === "ai_analytics") {
      setPrevScreen(from || screen);
    }
    setScreen(s);
    if (s === "dashboard") { setNavActive("home"); setAiSessionEnd(false); }
    if (s === "leaderboard") setNavActive("leaderboard");
    if (s === "profile")     setNavActive("profile");
    if (s === "premium")     setNavActive("premium");
  };

  const showNav = ["dashboard","leaderboard","profile","premium"].includes(screen);

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", background:"#050510", fontFamily:"'Sora', sans-serif" }}>
      <div style={{ width:390, height:760, borderRadius:40, overflow:"hidden", position:"relative", boxShadow:"0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px #2A2A4A", background:"#0A0A14" }}>

        {screen === "splash"      && <SplashScreen   onDone={() => go("login")} />}
        {screen === "login"       && <LoginScreen     onLogin={() => go("dashboard")} onRegister={() => go("register")} onPhone={() => go("register")} />}
        {screen === "register"    && <RegisterScreen  onDone={() => go("dashboard")} onBack={() => go("login")} />}

        {screen === "dashboard"   && <Dashboard
          onStartPractice={() => go("matching")}
          onLeaderboard={()   => go("leaderboard")}
          onProfile={()       => go("profile")}
          onPremium={()       => go("premium")}
          onRoadmap={()       => go("roadmap")}
          onAiTeacher={()     => go("ai_home")}
          onVoiceRooms={()    => go("voice_rooms", "dashboard")}
          onAnalytics={()     => go("ai_analytics", "dashboard")}
        />}

        {screen === "matching"    && <MatchingScreen  onMatched={() => go("call")} onBack={() => go("dashboard")} />}
        {screen === "call"        && <CallScreen      onEnd={() => go("feedback")} />}
        {screen === "feedback"    && <FeedbackScreen  onPracticeAgain={() => go("matching")} onDashboard={() => go("dashboard")} />}
        {screen === "profile"     && <ProfileScreen   onBack={() => go("dashboard")} />}
        {screen === "leaderboard" && <LeaderboardScreen onBack={() => go("dashboard")} />}
        {screen === "premium"     && <PremiumScreen   onBack={() => go("dashboard")} />}
        {screen === "roadmap"     && <RoadmapScreen   onBack={() => go("dashboard")} />}

        {/* ── AI Teacher System ── */}
        {screen === "ai_home" && <AiTeacherHub
          onBack={() => go("dashboard")}
          onStartMode={(mode) => { setAiMode(mode); setAiSessionEnd(false); go("ai_chat"); }}
          onVoiceRooms={() => go("voice_rooms", "ai_home")}
          onAnalytics={() => go("ai_analytics", "ai_home")}
        />}

        {screen === "ai_chat" && !aiSessionEnd && <AiConversationScreen
          mode={aiMode}
          onBack={() => go("ai_home")}
          onEnd={() => { setAiSessionEnd(true); go("ai_session_end"); }}
        />}

        {screen === "ai_session_end" && <AiSessionEndScreen
          mode={aiMode}
          onRestart={() => { setAiSessionEnd(false); go("ai_chat"); }}
          onBack={() => go("ai_home")}
        />}

        {/* ── prevScreen-aware back navigation ── */}
        {screen === "voice_rooms"  && <VoiceRoomsScreen   key={screen} onBack={() => go(prevScreen)} />}
        {screen === "ai_analytics" && <AnalyticsDashboard key={screen} onBack={() => go(prevScreen)} />}

        {showNav && <NavBar
          active={navActive}
          onHome={() => go("dashboard")}
          onProfile={() => go("profile")}
          onLeaderboard={() => go("leaderboard")}
          onPremium={() => go("premium")}
        />}
      </div>
    </div>
  );
}
