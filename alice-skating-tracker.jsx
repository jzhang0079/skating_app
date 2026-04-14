import { useState } from "react";

const JUMPS = [
  { name: "Waltz Jump", abbr: "WJ", level: 1, emoji: "🌟" },
  { name: "Salchow", abbr: "S", level: 1, emoji: "⭐" },
  { name: "Toe Loop", abbr: "T", level: 1, emoji: "💫" },
  { name: "Loop", abbr: "Lo", level: 2, emoji: "✨" },
  { name: "Flip", abbr: "F", level: 2, emoji: "🔥" },
  { name: "Lutz", abbr: "Lz", level: 2, emoji: "💎" },
  { name: "Axel", abbr: "A", level: 3, emoji: "👑" },
  { name: "Double Sal", abbr: "2S", level: 4, emoji: "🌙", isDouble: true },
  { name: "Double Toe", abbr: "2T", level: 4, emoji: "⚡", isDouble: true },
  { name: "Double Loop", abbr: "2Lo", level: 4, emoji: "🦋", isDouble: true },
  { name: "Double Flip", abbr: "2F", level: 4, emoji: "🌊", isDouble: true },
  { name: "Double Lutz", abbr: "2Lz", level: 4, emoji: "🏆", isDouble: true },
];

const SPINS = ["Upright Spin", "Sit Spin", "Camel Spin", "Combination Spin", "Flying Spin"];
const SKILLS = ["Step Sequence", "Spiral", "Edges", "Footwork", "Choreography", "Stroking"];
const STICKERS = ["⭐", "🌟", "💫", "✨", "❄️", "🦋", "🏆", "👑", "🎀", "💎", "🔥", "🌙", "⚡", "🌊", "🎉"];

// Gems earned per landed jump
const GEM_VALUE = { WJ: 1, S: 1, T: 1, Lo: 2, F: 2, Lz: 2, A: 5, "2S": 3, "2T": 3, "2Lo": 3, "2F": 4, "2Lz": 4 };

// Gems earned per spin/skill selected
const SPIN_GEM = 2;
const SKILL_GEM = 1;

// Off-ice training exercises with gem rewards
const OFF_ICE = [
  { name: "Harness Jumps", emoji: "🎪", gems: 4, desc: "Assisted jump practice" },
  { name: "Ballet Class", emoji: "🩰", gems: 3, desc: "Artistry & extension" },
  { name: "Strength Training", emoji: "🏋️", gems: 3, desc: "Power & stability" },
  { name: "Jump Rope", emoji: "🪢", gems: 2, desc: "Cardio & timing" },
  { name: "Core Workout", emoji: "💪", gems: 2, desc: "Spin & jump control" },
  { name: "Off-Ice Spins", emoji: "🌀", gems: 2, desc: "Spin technique" },
  { name: "Edge Walk", emoji: "🛤️", gems: 2, desc: "Edge & balance" },
  { name: "Dance Practice", emoji: "💃", gems: 2, desc: "Footwork & rhythm" },
  { name: "Cardio", emoji: "🏃", gems: 2, desc: "Endurance" },
  { name: "Stretching", emoji: "🧘", gems: 1, desc: "Flexibility & recovery" },
];

const THEMES = [
  {
    id: "default", name: "Arctic Ice", emoji: "❄️", price: 0,
    bg: "linear-gradient(160deg, #0a0a1a 0%, #0d1b3e 40%, #071730 100%)",
    accent: "#7bc8ff", navBg: "rgba(7,23,48,0.95)", border: "rgba(100,180,255,0.2)",
    desc: "The classic icy blue",
  },
  {
    id: "aurora", name: "Aurora Borealis", emoji: "🌌", price: 50,
    bg: "linear-gradient(160deg, #030d0a 0%, #0a2e1a 40%, #04150d 100%)",
    accent: "#67e8a0", navBg: "rgba(3,15,10,0.95)", border: "rgba(103,232,160,0.25)",
    desc: "Northern lights glow",
  },
  {
    id: "gold", name: "Midnight Gold", emoji: "✨", price: 80,
    bg: "linear-gradient(160deg, #0f0d00 0%, #1f1800 40%, #0a0e00 100%)",
    accent: "#ffd700", navBg: "rgba(15,13,0,0.95)", border: "rgba(255,215,0,0.25)",
    desc: "Luxury gold on midnight",
  },
  {
    id: "blossom", name: "Cherry Blossom", emoji: "🌸", price: 60,
    bg: "linear-gradient(160deg, #1a0510 0%, #3d0d25 40%, #150510 100%)",
    accent: "#ff9ed2", navBg: "rgba(26,5,16,0.95)", border: "rgba(255,158,210,0.25)",
    desc: "Soft pink petals drift",
  },
  {
    id: "galaxy", name: "Galaxy Shimmer", emoji: "🔮", price: 100,
    bg: "linear-gradient(160deg, #0c0a1e 0%, #1a0a40 40%, #0a0630 100%)",
    accent: "#c084fc", navBg: "rgba(12,10,30,0.95)", border: "rgba(192,132,252,0.25)",
    desc: "Deep cosmic wonder",
  },
];

const FLOATIES = [
  {
    id: "default", name: "Snowflakes", emoji: "❄️", price: 0,
    particles: ["❄", "❄", "❄", "❄", "❄", "⭐", "✦"],
    desc: "Classic ice crystals",
  },
  {
    id: "petals", name: "Rose Petals", emoji: "🌹", price: 40,
    particles: ["🌸", "🌸", "🌹", "🌺", "💮", "🌸", "🌹"],
    desc: "Floating rose petals",
  },
  {
    id: "stars", name: "Golden Stars", emoji: "⭐", price: 70,
    particles: ["⭐", "🌟", "✨", "💫", "⭐", "🌟", "✦"],
    desc: "Shimmering golden stars",
  },
  {
    id: "rainbow", name: "Rainbow Sparkles", emoji: "🌈", price: 90,
    particles: ["✨", "💜", "💙", "💚", "💛", "🧡", "❤️"],
    desc: "Magical rainbow sparkles",
  },
];

const initialSessions = [
  {
    id: 1,
    date: "2025-04-05",
    duration: 60,
    iceType: "Public",
    mood: "😊",
    jumps: { "2T": { attempts: 8, landed: 5 }, "2S": { attempts: 6, landed: 3 }, "T": { attempts: 10, landed: 10 } },
    spins: ["Sit Spin", "Camel Spin"],
    skills: ["Edges", "Stroking"],
    notes: "Landed my first clean 2T today! Coach was really happy.",
    sticker: "⭐",
  },
  {
    id: 2,
    date: "2025-04-08",
    duration: 90,
    iceType: "Freestyle",
    mood: "🤩",
    jumps: { "2T": { attempts: 10, landed: 7 }, "2S": { attempts: 8, landed: 5 }, "2Lo": { attempts: 4, landed: 1 } },
    spins: ["Sit Spin", "Combination Spin"],
    skills: ["Step Sequence", "Footwork"],
    notes: "Tried my first 2Lo! Got one! Working on the prep edge.",
    sticker: "🌙",
  },
];

export default function SkatingTracker() {
  const [sessions, setSessions] = useState(initialSessions);
  const [view, setView] = useState("home");
  const [selectedSession, setSelectedSession] = useState(null);
  const [newSession, setNewSession] = useState(null);
  const [jumpLog, setJumpLog] = useState({});
  const [selectedSpins, setSelectedSpins] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedOffIce, setSelectedOffIce] = useState([]);
  const [celebrateJump, setCelebrateJump] = useState(null);
  const [chosenSticker, setChosenSticker] = useState(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [ownedItems, setOwnedItems] = useState(["default"]);
  const [activeThemeId, setActiveThemeId] = useState("default");
  const [activeFloatieId, setActiveFloatieId] = useState("default");
  const [gemsNotif, setGemsNotif] = useState(null);

  // Gem accounting
  const earnedGems = sessions.reduce((total, s) => {
    const jumpGems = Object.entries(s.jumps || {}).reduce((a, [abbr, v]) => a + v.landed * (GEM_VALUE[abbr] || 1), 0);
    const spinGems = (s.spins || []).length * SPIN_GEM;
    const skillGems = (s.skills || []).length * SKILL_GEM;
    const offIceGems = (s.offIce || []).reduce((a, name) => {
      const ex = OFF_ICE.find(o => o.name === name);
      return a + (ex?.gems || 1);
    }, 0);
    return total + jumpGems + spinGems + skillGems + offIceGems;
  }, 0);
  const spentGems = [...THEMES, ...FLOATIES]
    .filter(i => ownedItems.includes(i.id) && i.id !== "default")
    .reduce((a, i) => a + i.price, 0);
  const gems = earnedGems - spentGems;

  const theme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];
  const floatie = FLOATIES.find(f => f.id === activeFloatieId) || FLOATIES[0];
  const ac = theme.accent;
  const bd = theme.border;

  const totalLanded = (j) => j ? Object.values(j).reduce((a, b) => a + (b.landed || 0), 0) : 0;

  const allLanded = sessions.flatMap(s => Object.entries(s.jumps || {}).map(([k, v]) => ({ abbr: k, landed: v.landed })));
  const jumpProgress = {};
  JUMPS.forEach(j => {
    jumpProgress[j.abbr] = allLanded.filter(l => l.abbr === j.abbr).reduce((a, b) => a + b.landed, 0);
  });

  const startNewSession = () => {
    const today = new Date().toISOString().split("T")[0];
    setNewSession({ date: today, duration: 60, iceType: "Freestyle", mood: "😊", notes: "" });
    setJumpLog({});
    setSelectedSpins([]);
    setSelectedSkills([]);
    setSelectedOffIce([]);
    setChosenSticker(null);
    setView("log");
  };

  const logAttempt = (abbr, result) => {
    setJumpLog(prev => {
      const cur = prev[abbr] || { attempts: 0, landed: 0 };
      const updated = { attempts: cur.attempts + 1, landed: result === "land" ? cur.landed + 1 : cur.landed };
      if (result === "land") {
        setCelebrateJump(abbr);
        setTimeout(() => setCelebrateJump(null), 1500);
      }
      return { ...prev, [abbr]: updated };
    });
  };

  const saveSession = () => {
    if (!chosenSticker) { setShowStickerPicker(true); return; }
    const sessionGems =
      Object.entries(jumpLog).reduce((a, [abbr, v]) => a + v.landed * (GEM_VALUE[abbr] || 1), 0) +
      selectedSpins.length * SPIN_GEM +
      selectedSkills.length * SKILL_GEM +
      selectedOffIce.reduce((a, name) => { const ex = OFF_ICE.find(o => o.name === name); return a + (ex?.gems || 1); }, 0);
    setSessions(prev => [{ ...newSession, id: Date.now(), jumps: jumpLog, spins: selectedSpins, skills: selectedSkills, offIce: selectedOffIce, sticker: chosenSticker }, ...prev]);
    if (sessionGems > 0) setGemsNotif(sessionGems);
    setSaveSuccess(true);
    setTimeout(() => { setSaveSuccess(false); setGemsNotif(null); setView("home"); }, 2400);
  };

  const pct = (landed, attempts) => attempts > 0 ? Math.round((landed / attempts) * 100) : 0;

  const streak = () => {
    const sorted = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    let s = 0, prev = null;
    for (const sess of sorted) {
      const d = new Date(sess.date);
      if (!prev) { s = 1; prev = d; continue; }
      const diff = (prev - d) / (1000 * 60 * 60 * 24);
      if (diff <= 3) { s++; prev = d; } else break;
    }
    return s;
  };

  const totalIceHours = Math.round(sessions.reduce((a, s) => a + (s.duration || 0), 0) / 60 * 10) / 10;
  const totalDoubles = sessions.reduce((a, s) =>
    a + Object.entries(s.jumps || {}).filter(([k]) => k.startsWith("2")).reduce((b, [, v]) => b + v.landed, 0), 0);

  const sessionLogGems =
    Object.entries(jumpLog).reduce((a, [abbr, v]) => a + v.landed * (GEM_VALUE[abbr] || 1), 0) +
    selectedSpins.length * SPIN_GEM +
    selectedSkills.length * SKILL_GEM +
    selectedOffIce.reduce((a, name) => { const ex = OFF_ICE.find(o => o.name === name); return a + (ex?.gems || 1); }, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      fontFamily: "'Nunito', 'Quicksand', sans-serif",
      color: "#e8f4ff",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&family=Pacifico&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${ac}; border-radius: 2px; }
        .ice-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(100,180,255,0.05) 100%);
          border: 1px solid ${bd};
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        .skate-btn {
          border: none; cursor: pointer; font-family: 'Nunito', sans-serif;
          font-weight: 800; border-radius: 50px; transition: all 0.2s;
        }
        .skate-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .skate-btn:active { transform: translateY(0px); }
        .land-btn { background: linear-gradient(135deg, #2ecc71, #1abc9c); color: white; padding: 10px 18px; font-size: 15px; }
        .fall-btn { background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)); color: rgba(255,255,255,0.6); padding: 10px 18px; font-size: 15px; border: 1px solid rgba(255,255,255,0.1); }
        .nav-btn {
          flex: 1; padding: 10px 4px; font-size: 11px; font-weight: 700;
          background: transparent; color: rgba(255,255,255,0.5);
          border-top: 2px solid transparent; letter-spacing: 0.5px;
          text-transform: uppercase; transition: all 0.2s;
        }
        .nav-btn.active { color: ${ac}; border-top-color: ${ac}; }
        .snowflake { position: fixed; pointer-events: none; opacity: 0.15; animation: fall linear infinite; }
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0.15; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .celebrate { animation: pop 0.3s ease-out; }
        @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.4); } 100% { transform: scale(1); } }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .slide-in { animation: slideIn 0.35s ease-out; }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .spin-in { animation: spinIn 0.5s ease-out; }
        @keyframes spinIn { from { transform: rotate(-180deg) scale(0); opacity: 0; } to { transform: rotate(0) scale(1); opacity: 1; } }
        .gem-pop { animation: gemPop 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes gemPop {
          0% { transform: translateX(-50%) scale(0) translateY(20px); opacity: 0; }
          70% { transform: translateX(-50%) scale(1.15) translateY(-4px); opacity: 1; }
          100% { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
        }
        .shop-item { border-radius: 18px; padding: 14px; cursor: pointer; transition: all 0.2s; }
        .shop-item:hover { transform: translateY(-3px); filter: brightness(1.08); }
        .shop-item:active { transform: translateY(0); }
      `}</style>

      {/* Floating particles */}
      {floatie.particles.map((s, i) => (
        <span key={i} className="snowflake" style={{
          left: `${10 + i * 13}%`, fontSize: `${10 + (i % 3) * 6}px`,
          animationDuration: `${8 + i * 2}s`, animationDelay: `${i * 1.5}s`,
        }}>{s}</span>
      ))}

      {/* Header */}
      <div style={{ padding: "16px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "Pacifico", fontSize: 22, color: ac, lineHeight: 1 }}>Alice's</div>
          <div style={{ fontFamily: "Pacifico", fontSize: 14, color: "rgba(200,230,255,0.7)" }}>Skating Journal ⛸️</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setView("shop")}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#ffd700" }}>💎 {gems}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5 }}>Gems</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22 }}>🔥 {streak()}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Streak</div>
          </div>
        </div>
      </div>

      {/* Gems earned notification */}
      {gemsNotif && (
        <div className="gem-pop" style={{
          position: "fixed", top: 80, left: "50%",
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
          color: "#1a0f00", padding: "10px 22px", borderRadius: 50,
          fontWeight: 900, fontSize: 16, zIndex: 100,
          boxShadow: "0 4px 24px rgba(245,158,11,0.55)",
          whiteSpace: "nowrap",
        }}>
          +{gemsNotif} 💎 Gems Earned!
        </div>
      )}

      {/* Main Content */}
      <div style={{ padding: "0 16px", paddingBottom: 90, maxHeight: "calc(100vh - 130px)", overflowY: "auto" }}>

        {/* ===== HOME ===== */}
        {view === "home" && (
          <div className="slide-in">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Sessions", value: sessions.length, icon: "🗓️" },
                { label: "Ice Hours", value: totalIceHours, icon: "⏱️" },
                { label: "Doubles", value: totalDoubles, icon: "💎" },
              ].map(s => (
                <div key={s.label} className="ice-card" style={{ padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: ac }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <button className="skate-btn" onClick={startNewSession} style={{
              width: "100%", padding: "18px", marginBottom: 16,
              background: "linear-gradient(135deg, #1a6fc4, #4a9edd, #7bc8ff)",
              color: "white", fontSize: 18, letterSpacing: 1,
              boxShadow: "0 8px 32px rgba(74,158,221,0.4)",
            }}>
              ⛸️ &nbsp; Log Today's Session
            </button>

            <div className="ice-card" style={{ padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, color: ac, letterSpacing: 0.5, textTransform: "uppercase" }}>🏆 Jump Progress</div>
              {JUMPS.filter(j => j.isDouble || j.level >= 2).map(jump => {
                const count = jumpProgress[jump.abbr] || 0;
                const barW = Math.min(100, (count / 50) * 100);
                return (
                  <div key={jump.abbr} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{jump.emoji} {jump.name}</span>
                      <span style={{ fontSize: 12, color: ac, fontWeight: 800 }}>{count} landed</span>
                    </div>
                    <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 4, width: `${barW}%`, background: jump.isDouble ? "linear-gradient(90deg, #7bc8ff, #e879f9)" : "linear-gradient(90deg, #4a9edd, #7bc8ff)", transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10, color: ac, letterSpacing: 0.5, textTransform: "uppercase" }}>📖 Recent Sessions</div>
            {sessions.slice(0, 3).map(s => (
              <div key={s.id} className="ice-card" onClick={() => { setSelectedSession(s); setView("session"); }}
                style={{ padding: "14px 16px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 30 }}>{s.sticker || "⭐"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{new Date(s.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{s.duration}min · {Object.keys(s.jumps || {}).length} jumps · {s.mood}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#2ecc71" }}>{totalLanded(s.jumps)}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>landed</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== LOG SESSION ===== */}
        {view === "log" && newSession && (
          <div className="slide-in">
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 16, color: ac }}>📝 Log Session</div>

            <div className="ice-card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Date</label>
                  <input type="date" value={newSession.date} onChange={e => setNewSession(p => ({ ...p, date: e.target.value }))}
                    style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "white", padding: "8px 10px", fontSize: 13, fontFamily: "Nunito" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Minutes on Ice</label>
                  <input type="number" value={newSession.duration} min={15} max={180} onChange={e => setNewSession(p => ({ ...p, duration: +e.target.value }))}
                    style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "white", padding: "8px 10px", fontSize: 13, fontFamily: "Nunito" }} />
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>How was your skate? {newSession.mood}</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["😊", "🤩", "😤", "😴", "😰"].map(m => (
                    <button key={m} onClick={() => setNewSession(p => ({ ...p, mood: m }))}
                      style={{ fontSize: 22, background: newSession.mood === m ? "rgba(123,200,255,0.2)" : "transparent", border: newSession.mood === m ? `2px solid ${ac}` : "2px solid transparent", borderRadius: 10, padding: 4, cursor: "pointer", transition: "all 0.2s" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live gem counter */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 12, background: "rgba(255,215,0,0.07)", borderRadius: 14, border: "1px solid rgba(255,215,0,0.2)" }}>
              <span style={{ fontSize: 20 }}>💎</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#ffd700" }}>+{sessionLogGems} gems earned so far</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Jumps, spins, skills & off-ice all earn gems · spend in the Shop</div>
              </div>
            </div>

            <div className="ice-card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12, color: ac, textTransform: "uppercase", letterSpacing: 0.5 }}>⛸️ Jumps Practiced</div>
              {JUMPS.map(jump => {
                const entry = jumpLog[jump.abbr] || { attempts: 0, landed: 0 };
                const isCelebrating = celebrateJump === jump.abbr;
                return (
                  <div key={jump.abbr} style={{ marginBottom: 10, padding: "10px 12px", background: jump.isDouble ? "rgba(232,121,249,0.08)" : "rgba(255,255,255,0.04)", borderRadius: 14, border: jump.isDouble ? "1px solid rgba(232,121,249,0.2)" : "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 800 }}>{jump.emoji} {jump.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, color: "#ffd700", fontWeight: 700 }}>💎×{GEM_VALUE[jump.abbr] || 1}</span>
                        <span className={isCelebrating ? "celebrate" : ""} style={{ fontSize: 13, color: entry.landed > 0 ? "#2ecc71" : "rgba(255,255,255,0.4)", fontWeight: 800 }}>{entry.landed}/{entry.attempts}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="skate-btn land-btn" onClick={() => logAttempt(jump.abbr, "land")}>✅ Land</button>
                      <button className="skate-btn fall-btn" onClick={() => logAttempt(jump.abbr, "fall")}>❌ Fall</button>
                      {entry.attempts > 0 && (
                        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 40, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct(entry.landed, entry.attempts)}%`, background: "#2ecc71", borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 11, color: "#2ecc71" }}>{pct(entry.landed, entry.attempts)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="ice-card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: ac, textTransform: "uppercase", letterSpacing: 0.5 }}>🌀 Spins Practiced</div>
                <span style={{ fontSize: 11, color: "#ffd700", fontWeight: 700 }}>💎×{SPIN_GEM} each</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SPINS.map(sp => (
                  <button key={sp} onClick={() => setSelectedSpins(prev => prev.includes(sp) ? prev.filter(s => s !== sp) : [...prev, sp])}
                    className="skate-btn" style={{ padding: "8px 14px", fontSize: 12, background: selectedSpins.includes(sp) ? "linear-gradient(135deg, #1a6fc4, #4a9edd)" : "rgba(255,255,255,0.07)", color: selectedSpins.includes(sp) ? "white" : "rgba(255,255,255,0.6)", border: `1px solid ${selectedSpins.includes(sp) ? "transparent" : "rgba(255,255,255,0.1)"}` }}>{sp}</button>
                ))}
              </div>
            </div>

            <div className="ice-card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: ac, textTransform: "uppercase", letterSpacing: 0.5 }}>🎯 Skills Worked On</div>
                <span style={{ fontSize: 11, color: "#ffd700", fontWeight: 700 }}>💎×{SKILL_GEM} each</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SKILLS.map(sk => (
                  <button key={sk} onClick={() => setSelectedSkills(prev => prev.includes(sk) ? prev.filter(s => s !== sk) : [...prev, sk])}
                    className="skate-btn" style={{ padding: "8px 14px", fontSize: 12, background: selectedSkills.includes(sk) ? "linear-gradient(135deg, #1a6fc4, #4a9edd)" : "rgba(255,255,255,0.07)", color: selectedSkills.includes(sk) ? "white" : "rgba(255,255,255,0.6)", border: `1px solid ${selectedSkills.includes(sk) ? "transparent" : "rgba(255,255,255,0.1)"}` }}>{sk}</button>
                ))}
              </div>
            </div>

            {/* Off-ice training */}
            <div className="ice-card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#e879f9", textTransform: "uppercase", letterSpacing: 0.5 }}>🏋️ Off-Ice Training</div>
                <span style={{ fontSize: 11, color: "#ffd700", fontWeight: 700 }}>{selectedOffIce.length > 0 ? `+${selectedOffIce.reduce((a, n) => { const ex = OFF_ICE.find(o => o.name === n); return a + (ex?.gems || 1); }, 0)} 💎` : "tap to earn gems"}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {OFF_ICE.map(ex => {
                  const active = selectedOffIce.includes(ex.name);
                  return (
                    <button key={ex.name} onClick={() => setSelectedOffIce(prev => prev.includes(ex.name) ? prev.filter(n => n !== ex.name) : [...prev, ex.name])}
                      className="skate-btn" style={{
                        padding: "8px 14px", fontSize: 12,
                        background: active ? "linear-gradient(135deg, #a855f7, #e879f9)" : "rgba(255,255,255,0.07)",
                        color: active ? "white" : "rgba(255,255,255,0.6)",
                        border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.1)"}`,
                        display: "flex", alignItems: "center", gap: 5,
                      }}>
                      {ex.emoji} {ex.name}
                      <span style={{ fontSize: 10, opacity: 0.8, color: active ? "rgba(255,255,255,0.8)" : "#ffd700" }}>💎{ex.gems}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="ice-card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8, color: ac, textTransform: "uppercase", letterSpacing: 0.5 }}>📓 Notes & Feelings</div>
              <textarea value={newSession.notes} onChange={e => setNewSession(p => ({ ...p, notes: e.target.value }))}
                placeholder="How did it go? What improved? What was hard?"
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "white", padding: "10px 12px", fontSize: 13, fontFamily: "Nunito", minHeight: 80, resize: "none", outline: "none" }} />
            </div>

            {showStickerPicker && (
              <div className="ice-card" style={{ padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, color: "#e879f9", textTransform: "uppercase", letterSpacing: 0.5 }}>🎀 Pick Your Session Sticker!</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {STICKERS.map(st => (
                    <button key={st} onClick={() => { setChosenSticker(st); setShowStickerPicker(false); }}
                      style={{ fontSize: 26, background: chosenSticker === st ? "rgba(232,121,249,0.2)" : "rgba(255,255,255,0.05)", border: `2px solid ${chosenSticker === st ? "#e879f9" : "transparent"}`, borderRadius: 10, padding: 4, cursor: "pointer" }}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className="skate-btn" onClick={saveSession} style={{
              width: "100%", padding: "16px",
              background: saveSuccess ? "linear-gradient(135deg, #2ecc71, #1abc9c)" : "linear-gradient(135deg, #e879f9, #a855f7)",
              color: "white", fontSize: 16, boxShadow: "0 8px 24px rgba(168,85,247,0.4)",
            }}>
              {saveSuccess ? "🎉 Saved! Great skate, Alice!" : chosenSticker ? `${chosenSticker} Save Session!` : "🎀 Choose a Sticker & Save!"}
            </button>
          </div>
        )}

        {/* ===== SESSION DETAIL ===== */}
        {view === "session" && selectedSession && (
          <div className="slide-in">
            <button onClick={() => setView("history")} style={{ background: "transparent", border: "none", color: ac, fontSize: 14, cursor: "pointer", marginBottom: 12, fontFamily: "Nunito", fontWeight: 700 }}>← Back</button>
            <div className="ice-card" style={{ padding: 20, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div className="spin-in" style={{ fontSize: 48 }}>{selectedSession.sticker}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>{new Date(selectedSession.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{selectedSession.duration} minutes · {selectedSession.mood}</div>
                  <div style={{ fontSize: 12, color: "#ffd700", marginTop: 4, fontWeight: 700 }}>
                    💎 {
                      Object.entries(selectedSession.jumps || {}).reduce((a, [abbr, v]) => a + v.landed * (GEM_VALUE[abbr] || 1), 0) +
                      (selectedSession.spins || []).length * SPIN_GEM +
                      (selectedSession.skills || []).length * SKILL_GEM +
                      (selectedSession.offIce || []).reduce((a, n) => { const ex = OFF_ICE.find(o => o.name === n); return a + (ex?.gems || 1); }, 0)
                    } gems from this session
                  </div>
                </div>
              </div>
              {selectedSession.notes && (
                <div style={{ background: `${ac}18`, borderRadius: 12, padding: "10px 14px", fontSize: 14, color: "rgba(255,255,255,0.8)", fontStyle: "italic", borderLeft: `3px solid ${ac}` }}>
                  "{selectedSession.notes}"
                </div>
              )}
            </div>
            <div className="ice-card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12, color: ac, textTransform: "uppercase", letterSpacing: 0.5 }}>⛸️ Jump Stats</div>
              {Object.entries(selectedSession.jumps || {}).map(([abbr, data]) => {
                const jump = JUMPS.find(j => j.abbr === abbr);
                return (
                  <div key={abbr} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 18 }}>{jump?.emoji || "⭐"}</span>
                    <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{jump?.name || abbr}</span>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 900, color: "#2ecc71", fontSize: 16 }}>{data.landed}/{data.attempts}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{pct(data.landed, data.attempts)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedSession.spins?.length > 0 && (
              <div className="ice-card" style={{ padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, color: ac, textTransform: "uppercase", letterSpacing: 0.5 }}>🌀 Spins</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selectedSession.spins.map(sp => (
                    <span key={sp} style={{ background: `${ac}22`, border: `1px solid ${ac}44`, borderRadius: 20, padding: "5px 12px", fontSize: 13 }}>{sp}</span>
                  ))}
                </div>
              </div>
            )}
            {selectedSession.offIce?.length > 0 && (
              <div className="ice-card" style={{ padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, color: "#e879f9", textTransform: "uppercase", letterSpacing: 0.5 }}>🏋️ Off-Ice Training</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selectedSession.offIce.map(name => {
                    const ex = OFF_ICE.find(o => o.name === name);
                    return (
                      <span key={name} style={{ background: "rgba(232,121,249,0.12)", border: "1px solid rgba(232,121,249,0.3)", borderRadius: 20, padding: "5px 12px", fontSize: 13 }}>
                        {ex?.emoji} {name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== PROGRESS ===== */}
        {view === "progress" && (
          <div className="slide-in">
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 16, color: ac }}>📈 Your Progress</div>
            <div className="ice-card" style={{ padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14, color: "#e879f9", textTransform: "uppercase", letterSpacing: 0.5 }}>💎 Double Jump Journey</div>
              {JUMPS.filter(j => j.isDouble).map(jump => {
                const count = jumpProgress[jump.abbr] || 0;
                const milestones = [1, 5, 10, 25, 50];
                const next = milestones.find(m => m > count) || 100;
                const prev = milestones.filter(m => m <= count).pop() || 0;
                const barPct = prev === next ? 100 : Math.round(((count - prev) / (next - prev)) * 100);
                return (
                  <div key={jump.abbr} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 15 }}>{jump.emoji} {jump.name}</span>
                      <span style={{ color: count > 0 ? "#e879f9" : "rgba(255,255,255,0.3)", fontWeight: 900 }}>{count} landed</span>
                    </div>
                    <div style={{ height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 5, overflow: "hidden", marginBottom: 4 }}>
                      <div style={{ height: "100%", borderRadius: 5, width: `${barPct}%`, background: count > 0 ? "linear-gradient(90deg, #e879f9, #7bc8ff)" : "rgba(255,255,255,0.05)", transition: "width 0.6s ease" }} />
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                      {count === 0 ? "🎯 Not started yet — you've got this!" : `Next milestone: ${next} landings (${next - count} to go!)`}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="ice-card" style={{ padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14, color: ac, textTransform: "uppercase", letterSpacing: 0.5 }}>📊 Session Stats</div>
              {[
                { label: "Total Sessions", val: sessions.length, icon: "🗓️" },
                { label: "Total Ice Hours", val: `${totalIceHours}h`, icon: "⏱️" },
                { label: "Total Doubles Landed", val: totalDoubles, icon: "💎" },
                { label: "Current Streak", val: `${streak()} sessions`, icon: "🔥" },
                { label: "Avg Session Length", val: `${Math.round(sessions.reduce((a, s) => a + s.duration, 0) / sessions.length)}min`, icon: "📏" },
                { label: "Total Gems Earned", val: earnedGems, icon: "💎" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 14 }}>{s.icon} {s.label}</span>
                  <span style={{ fontWeight: 900, color: ac, fontSize: 16 }}>{s.val}</span>
                </div>
              ))}
            </div>
            <div className="ice-card" style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14, color: ac, textTransform: "uppercase", letterSpacing: 0.5 }}>🌟 Session Sticker Collection</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {sessions.map(s => (<span key={s.id} title={s.date} style={{ fontSize: 28 }}>{s.sticker || "⭐"}</span>))}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 10 }}>Every sticker = one session you showed up! 💪</div>
            </div>
          </div>
        )}

        {/* ===== HISTORY ===== */}
        {view === "history" && (
          <div className="slide-in">
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 16, color: ac }}>📖 All Sessions</div>
            {sessions.map(s => (
              <div key={s.id} className="ice-card" onClick={() => { setSelectedSession(s); setView("session"); }}
                style={{ padding: "14px 16px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 32 }}>{s.sticker}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{new Date(s.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
                    {s.duration}min · {s.mood} · {Object.entries(s.jumps || {}).filter(([k]) => k.startsWith("2")).reduce((a, [, v]) => a + v.landed, 0)} doubles
                  </div>
                </div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>›</div>
              </div>
            ))}
          </div>
        )}

        {/* ===== SHOP ===== */}
        {view === "shop" && (
          <div className="slide-in">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: ac }}>🛍️ Gem Shop</div>
              <div style={{ background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 50, padding: "6px 16px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>💎</span>
                <span style={{ fontWeight: 900, color: "#ffd700", fontSize: 16 }}>{gems}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>available</span>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 18, lineHeight: 1.5 }}>
              Earn gems by landing jumps. Lv1=💎×1 · Lv2=💎×2 · Axel=💎×5 · Doubles=💎×3–4
            </div>

            {/* Themes */}
            <div style={{ fontSize: 12, fontWeight: 900, color: ac, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>🎨 App Themes</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
              {THEMES.map(item => {
                const owned = ownedItems.includes(item.id);
                const active = activeThemeId === item.id;
                const canAfford = gems >= item.price;
                return (
                  <div key={item.id} className="shop-item" onClick={() => {
                    if (active) return;
                    if (owned) { setActiveThemeId(item.id); return; }
                    if (!owned && canAfford) { setOwnedItems(prev => [...prev, item.id]); setActiveThemeId(item.id); }
                  }} style={{
                    background: item.bg,
                    border: `2px solid ${active ? "#ffd700" : owned ? item.accent + "88" : "rgba(255,255,255,0.08)"}`,
                    opacity: !owned && !canAfford ? 0.45 : 1,
                    position: "relative", cursor: !owned && !canAfford ? "not-allowed" : "pointer",
                  }}>
                    {active && <div style={{ position: "absolute", top: 7, right: 7, background: "#ffd700", color: "#1a0f00", fontSize: 8, fontWeight: 900, borderRadius: 20, padding: "2px 7px", textTransform: "uppercase" }}>Active</div>}
                    <div style={{ fontSize: 30, marginBottom: 4 }}>{item.emoji}</div>
                    <div style={{ fontWeight: 900, fontSize: 13, color: item.accent, marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>{item.desc}</div>
                    {owned
                      ? <span style={{ fontSize: 11, color: active ? "#ffd700" : "#2ecc71", fontWeight: 800 }}>{active ? "✓ Equipped" : "Tap to equip"}</span>
                      : <span style={{ fontSize: 12, color: canAfford ? "#ffd700" : "rgba(255,255,255,0.25)", fontWeight: 800 }}>💎 {item.price}</span>
                    }
                  </div>
                );
              })}
            </div>

            {/* Floaties */}
            <div style={{ fontSize: 12, fontWeight: 900, color: ac, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>✨ Floating Particles</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
              {FLOATIES.map(item => {
                const owned = ownedItems.includes(item.id);
                const active = activeFloatieId === item.id;
                const canAfford = gems >= item.price;
                return (
                  <div key={item.id} className="shop-item ice-card" onClick={() => {
                    if (active) return;
                    if (owned) { setActiveFloatieId(item.id); return; }
                    if (!owned && canAfford) { setOwnedItems(prev => [...prev, item.id]); setActiveFloatieId(item.id); }
                  }} style={{
                    border: `2px solid ${active ? "#ffd700" : owned ? ac + "88" : "rgba(255,255,255,0.08)"}`,
                    opacity: !owned && !canAfford ? 0.45 : 1,
                    position: "relative", cursor: !owned && !canAfford ? "not-allowed" : "pointer",
                  }}>
                    {active && <div style={{ position: "absolute", top: 7, right: 7, background: "#ffd700", color: "#1a0f00", fontSize: 8, fontWeight: 900, borderRadius: 20, padding: "2px 7px", textTransform: "uppercase" }}>Active</div>}
                    <div style={{ fontSize: 20, letterSpacing: 2, marginBottom: 4 }}>{item.particles.slice(0, 4).join("")}</div>
                    <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>{item.desc}</div>
                    {owned
                      ? <span style={{ fontSize: 11, color: active ? "#ffd700" : "#2ecc71", fontWeight: 800 }}>{active ? "✓ Equipped" : "Tap to equip"}</span>
                      : <span style={{ fontSize: 12, color: canAfford ? "#ffd700" : "rgba(255,255,255,0.25)", fontWeight: 800 }}>💎 {item.price === 0 ? "Free" : item.price}</span>
                    }
                  </div>
                );
              })}
            </div>

            {/* Gem guide */}
            <div className="ice-card" style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, color: "#ffd700", textTransform: "uppercase", letterSpacing: 0.5 }}>💎 Gem Earning Guide</div>
              {[
                { label: "Level 1 Jumps (WJ, S, T)", val: "💎 ×1 per land" },
                { label: "Level 2 Jumps (Lo, F, Lz)", val: "💎 ×2 per land" },
                { label: "Axel", val: "💎 ×5 per land" },
                { label: "Doubles (2S, 2T, 2Lo)", val: "💎 ×3 per land" },
                { label: "Double Flip & Double Lutz", val: "💎 ×4 per land" },
                { label: "Each Spin practiced", val: `💎 ×${SPIN_GEM}` },
                { label: "Each Skill worked on", val: `💎 ×${SKILL_GEM}` },
                { label: "Off-Ice Training (varies)", val: "💎 ×1 – ×4" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>{r.label}</span>
                  <span style={{ color: "#ffd700", fontWeight: 800 }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: theme.navBg, backdropFilter: "blur(20px)",
        borderTop: `1px solid ${bd}`,
        display: "flex", padding: "8px 0 4px",
        fontFamily: "Nunito",
      }}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "progress", icon: "📈", label: "Progress" },
          { id: "history", icon: "📖", label: "History" },
          { id: "shop", icon: "🛍️", label: "Shop" },
        ].map(n => (
          <button key={n.id} className={`nav-btn ${view === n.id || (view === "session" && n.id === "history") ? "active" : ""}`}
            onClick={() => setView(n.id)}>
            <div style={{ fontSize: 20, marginBottom: 2 }}>{n.icon}</div>
            {n.label}
          </button>
        ))}
      </div>
    </div>
  );
}
