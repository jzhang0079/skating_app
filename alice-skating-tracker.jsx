import { useState } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const PRESET_EXERCISES = {
  warmup: [
    { id: "w1", name: "Jogging / jump rope", duration: "10 min", note: "Get heart rate up" },
    { id: "w2", name: "Floor rotations", duration: "10 min", note: "10x floor 2A, landing positions" },
    { id: "w3", name: "Dynamic stretches", duration: "10 min", note: "Spin flexibility prep" },
  ],
  skating: [
    { id: "s1", name: "Power laps (Fernandez style)", duration: "2 min", note: "" },
    { id: "s2", name: "Power circles (Hanyu style)", duration: "2 min", note: "" },
    { id: "s3", name: "Program footwork", duration: "1 min", note: "" },
    { id: "s4", name: "Spiral sequences", duration: "1 min", note: "" },
    { id: "s5", name: "Field moves", duration: "1 min", note: "" },
  ],
  rotational: [
    { id: "r1", name: "Back spins", duration: "1 min", note: "" },
    { id: "r2", name: "Back spin-double loop", duration: "1 min", note: "" },
    { id: "r3", name: "Traveling back spins", duration: "1 min", note: "" },
    { id: "r4", name: "Walleys (both directions)", duration: "1 min", note: "" },
  ],
  ladder: [
    { id: "l1", name: "Waltz jump", duration: "", note: "Clean entry, strong landing" },
    { id: "l2", name: "1Lo — single loop", duration: "", note: "" },
    { id: "l3", name: "1A — Axel", duration: "", note: "" },
    { id: "l4", name: "Double of choice", duration: "", note: "Pick today's focus jump" },
  ],
  jumps: [
    { id: "j1", name: "2T — Double Toe Loop", duration: "6–10 attempts", note: "Free leg position focus", isDouble: true },
    { id: "j2", name: "2S — Double Salchow", duration: "6–10 attempts", note: "Back inside edge prep", isDouble: true },
    { id: "j3", name: "2Lo — Double Loop", duration: "6–10 attempts", note: "Back outside edge", isDouble: true },
    { id: "j4", name: "2F — Double Flip", duration: "6–10 attempts", note: "Toe pick placement", isDouble: true },
    { id: "j5", name: "Hop-hop-stick drill", duration: "5 min", note: "Build muscle memory" },
    { id: "j6", name: "Combination practice", duration: "5 min", note: "2T+2T, 2S+2T" },
  ],
  program: [
    { id: "p1", name: "Full program run-through", duration: "1 run", note: "No stops, push through" },
    { id: "p2", name: "3 fast power laps", duration: "3 laps", note: "Build endurance after program" },
    { id: "p3", name: "Problem section only", duration: "2–3 min", note: "Isolate and fix" },
  ],
  spins: [
    { id: "sp1", name: "FCSp — flying camel", duration: "3 min", note: "Level 4 criteria" },
    { id: "sp2", name: "FSSp — flying sit spin", duration: "2 min", note: "Level 4 criteria" },
    { id: "sp3", name: "CCoSp — change combo spin", duration: "2 min", note: "Level 4 criteria" },
    { id: "sp4", name: "New spin focus", duration: "2 min", note: "" },
  ],
  cooldown: [
    { id: "c1", name: "Light jog / shake out", duration: "5 min", note: "Gentle muscle recovery" },
    { id: "c2", name: "Static stretching", duration: "15 min", note: "While muscles are warm" },
    { id: "c3", name: "Ice bag if needed", duration: "5 min", note: "Knees or ankles" },
  ],
};

const BLOCKS = [
  { id: "warmup",    label: "Off-ice warm-up",           time: "15–30 min", color: "#5DCAA5", bg: "#E1F5EE", abbr: "WU",  offIce: true },
  { id: "skating",   label: "Skating skills / stroking",  time: "5–7 min",   color: "#378ADD", bg: "#E6F1FB", abbr: "SKT" },
  { id: "rotational",label: "Rotational exercises",       time: "3–5 min",   color: "#7F77DD", bg: "#EEEDFE", abbr: "ROT" },
  { id: "ladder",    label: "Jumping ladder",             time: "3–5 min",   color: "#1D9E75", bg: "#E1F5EE", abbr: "LAD" },
  { id: "jumps",     label: "New jumps & combos",         time: "10–15 min", color: "#BA7517", bg: "#FAEEDA", abbr: "JMP" },
  { id: "program",   label: "Program simulation",         time: "2–5 min",   color: "#D85A30", bg: "#FAECE7", abbr: "PRG" },
  { id: "spins",     label: "Spins",                      time: "7 min",     color: "#D4537E", bg: "#FBEAF0", abbr: "SPN" },
  { id: "cooldown",  label: "Off-ice cool-down",          time: "10–20 min", color: "#888780", bg: "#F1EFE8", abbr: "CD",  offIce: true },
];

// Doubles + Axel for the practice jump counter
const JUMPS_TRACK = [
  { abbr: "2T",  name: "Double Toe",  emoji: "⚡" },
  { abbr: "2S",  name: "Double Sal",  emoji: "🌙" },
  { abbr: "2Lo", name: "Double Loop", emoji: "🦋" },
  { abbr: "2F",  name: "Double Flip", emoji: "🌊" },
  { abbr: "2Lz", name: "Double Lutz", emoji: "💎" },
  { abbr: "A",   name: "Axel",        emoji: "👑" },
];

// Full jump list (for gem accounting + progress bars)
const JUMPS = [
  { name: "Waltz Jump",  abbr: "WJ",  level: 1, emoji: "🌟" },
  { name: "Salchow",     abbr: "S",   level: 1, emoji: "⭐" },
  { name: "Toe Loop",    abbr: "T",   level: 1, emoji: "💫" },
  { name: "Loop",        abbr: "Lo",  level: 2, emoji: "✨" },
  { name: "Flip",        abbr: "F",   level: 2, emoji: "🔥" },
  { name: "Lutz",        abbr: "Lz",  level: 2, emoji: "💎" },
  { name: "Axel",        abbr: "A",   level: 3, emoji: "👑" },
  { name: "Double Sal",  abbr: "2S",  level: 4, emoji: "🌙", isDouble: true },
  { name: "Double Toe",  abbr: "2T",  level: 4, emoji: "⚡", isDouble: true },
  { name: "Double Loop", abbr: "2Lo", level: 4, emoji: "🦋", isDouble: true },
  { name: "Double Flip", abbr: "2F",  level: 4, emoji: "🌊", isDouble: true },
  { name: "Double Lutz", abbr: "2Lz", level: 4, emoji: "🏆", isDouble: true },
];

const SPINS  = ["Upright Spin", "Sit Spin", "Camel Spin", "Combination Spin", "Flying Spin"];
const SKILLS = ["Step Sequence", "Spiral", "Edges", "Footwork", "Choreography", "Stroking"];
const STICKERS = ["⭐","🌟","💫","✨","❄️","🦋","🏆","👑","🎀","💎","🔥","🌙","⚡","🌊","🎉"];

const RPE_LABELS = {
  6:"Rest",7:"Very light",8:"Light",9:"Very light effort",10:"Light effort",
  11:"Fairly light",12:"Moderate",13:"Somewhat hard",14:"Hard",15:"Hard effort",
  16:"Very hard",17:"Very hard effort",18:"Extremely hard",19:"Near max",20:"Maximum",
};

const GEM_VALUE = { WJ:1, S:1, T:1, Lo:2, F:2, Lz:2, A:5, "2S":3, "2T":3, "2Lo":3, "2F":4, "2Lz":4 };
const SPIN_GEM  = 2;
const SKILL_GEM = 1;
const BLOCK_GEM = 2;

const OFF_ICE = [
  { name: "Harness Jumps",    emoji: "🎪", gems: 4, desc: "Assisted jump practice" },
  { name: "Ballet Class",     emoji: "🩰", gems: 3, desc: "Artistry & extension" },
  { name: "Strength Training",emoji: "🏋️", gems: 3, desc: "Power & stability" },
  { name: "Jump Rope",        emoji: "🪢", gems: 2, desc: "Cardio & timing" },
  { name: "Core Workout",     emoji: "💪", gems: 2, desc: "Spin & jump control" },
  { name: "Off-Ice Spins",    emoji: "🌀", gems: 2, desc: "Spin technique" },
  { name: "Edge Walk",        emoji: "🛤️", gems: 2, desc: "Edge & balance" },
  { name: "Dance Practice",   emoji: "💃", gems: 2, desc: "Footwork & rhythm" },
  { name: "Cardio",           emoji: "🏃", gems: 2, desc: "Endurance" },
  { name: "Stretching",       emoji: "🧘", gems: 1, desc: "Flexibility & recovery" },
];

const THEMES = [
  { id: "default", name: "Arctic Ice",       emoji: "❄️", price: 0,
    bg: "linear-gradient(160deg,#0a0a1a 0%,#0d1b3e 40%,#071730 100%)",
    accent: "#7bc8ff", navBg: "rgba(7,23,48,0.97)",  border: "rgba(100,180,255,0.2)",  desc: "The classic icy blue" },
  { id: "aurora",  name: "Aurora Borealis",  emoji: "🌌", price: 50,
    bg: "linear-gradient(160deg,#030d0a 0%,#0a2e1a 40%,#04150d 100%)",
    accent: "#67e8a0", navBg: "rgba(3,15,10,0.97)",  border: "rgba(103,232,160,0.25)", desc: "Northern lights glow" },
  { id: "gold",    name: "Midnight Gold",    emoji: "✨", price: 80,
    bg: "linear-gradient(160deg,#0f0d00 0%,#1f1800 40%,#0a0e00 100%)",
    accent: "#ffd700", navBg: "rgba(15,13,0,0.97)",  border: "rgba(255,215,0,0.25)",   desc: "Luxury gold on midnight" },
  { id: "blossom", name: "Cherry Blossom",   emoji: "🌸", price: 60,
    bg: "linear-gradient(160deg,#1a0510 0%,#3d0d25 40%,#150510 100%)",
    accent: "#ff9ed2", navBg: "rgba(26,5,16,0.97)",  border: "rgba(255,158,210,0.25)", desc: "Soft pink petals drift" },
  { id: "galaxy",  name: "Galaxy Shimmer",   emoji: "🔮", price: 100,
    bg: "linear-gradient(160deg,#0c0a1e 0%,#1a0a40 40%,#0a0630 100%)",
    accent: "#c084fc", navBg: "rgba(12,10,30,0.97)", border: "rgba(192,132,252,0.25)", desc: "Deep cosmic wonder" },
];

const FLOATIES = [
  { id: "default", name: "Snowflakes",       emoji: "❄️", price: 0,
    particles: ["❄","❄","❄","❄","❄","⭐","✦"],          desc: "Classic ice crystals" },
  { id: "petals",  name: "Rose Petals",      emoji: "🌹", price: 40,
    particles: ["🌸","🌸","🌹","🌺","💮","🌸","🌹"],     desc: "Floating rose petals" },
  { id: "stars",   name: "Golden Stars",     emoji: "⭐", price: 70,
    particles: ["⭐","🌟","✨","💫","⭐","🌟","✦"],       desc: "Shimmering golden stars" },
  { id: "rainbow", name: "Rainbow Sparkles", emoji: "🌈", price: 90,
    particles: ["✨","💜","💙","💚","💛","🧡","❤️"],     desc: "Magical rainbow sparkles" },
];

const SMART_FIELDS = [
  { key: "S", label: "Specific",    hint: "What exactly will you work on?" },
  { key: "M", label: "Measurable",  hint: "How will you measure success?" },
  { key: "A", label: "Action",      hint: "What specific action will you take?" },
  { key: "R", label: "Realistic",   hint: "Is this achievable today?" },
  { key: "T", label: "Time-framed", hint: "By when in the session?" },
];

const initialSessions = [
  {
    id: "s1", date: "2025-04-08", sticker: "🌟", mood: "🤩", duration: 90,
    smart: { S: "Land 7/10 double toe loops", M: "Count every attempt", A: "Focus on free leg", R: "Currently at 6/10", T: "End of session" },
    blocks: ["warmup","skating","ladder","jumps","spins","cooldown"],
    exercises: { jumps: ["j1","j2","j5"] },
    jumpLog: { "2T": { landed: 7, attempts: 10 }, "2S": { landed: 5, attempts: 8 } },
    spins: ["Sit Spin", "Combination Spin"],
    skills: ["Step Sequence", "Footwork"],
    offIce: ["Stretching"],
    rpe: 14,
    wentWell: "Landed my best 2T run yet! 7 in a row at the end.",
    improve: "2S needs better back edge prep before takeoff.",
    nextGoal: "Work on 2S entry edge tomorrow.",
    sleep: 9.5, water: 2.5,
  },
  {
    id: "s2", date: "2025-04-05", sticker: "⭐", mood: "😊", duration: 60,
    smart: { S: "Clean 2T consistency", M: "5+ out of 8 attempts", A: "Check free leg", R: "Hit 5 last session", T: "By end of jumps block" },
    blocks: ["warmup","ladder","jumps","cooldown"],
    exercises: {},
    jumpLog: { "2T": { landed: 5, attempts: 8 }, "2S": { landed: 3, attempts: 6 } },
    spins: ["Sit Spin", "Camel Spin"],
    skills: ["Edges", "Stroking"],
    offIce: [],
    rpe: 13,
    wentWell: "Landed my first clean 2T! Coach was really happy.",
    improve: "Need to work on prep edge for 2S.",
    nextGoal: "Try 2Lo this week.",
    sleep: 9, water: 2,
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const uid    = () => Math.random().toString(36).slice(2, 8);
const pct    = (l, a) => a > 0 ? Math.round((l / a) * 100) : 0;
const today  = () => new Date().toISOString().split("T")[0];
const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function SkatingTracker() {

  // ── VIEW / SESSION LIST ──────────────────────────────────────────────────
  const [view, setView] = useState("home"); // home|setup|practice|debrief|history|session|shop
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedSession, setSelectedSession] = useState(null);

  // ── SHOP / THEME ─────────────────────────────────────────────────────────
  const [ownedItems,     setOwnedItems]     = useState(["default"]);
  const [activeThemeId,  setActiveThemeId]  = useState("default");
  const [activeFloatieId,setActiveFloatieId]= useState("default");
  const [gemsNotif,      setGemsNotif]      = useState(null);

  // ── SETUP ────────────────────────────────────────────────────────────────
  const [setupStep,        setSetupStep]        = useState(1);
  const [smart,            setSmart]            = useState({ S:"", M:"", A:"", R:"", T:"" });
  const [selectedBlocks,   setSelectedBlocks]   = useState([]);
  const [blockExercises,   setBlockExercises]   = useState({});
  const [customInputs,     setCustomInputs]     = useState({});
  const [sessionMeta,      setSessionMeta]      = useState({ date: today(), duration: 60, mood: "😊" });
  const [activeBlockExpand,setActiveBlockExpand]= useState(null);

  // ── PRACTICE ─────────────────────────────────────────────────────────────
  const [checkedItems,   setCheckedItems]   = useState({});
  const [jumpLog,        setJumpLog]        = useState({});
  const [celebrateJump,  setCelebrateJump]  = useState(null);
  const [practiceView,   setPracticeView]   = useState("blocks"); // blocks|jumps|skills
  const [selectedSpins,  setSelectedSpins]  = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedOffIce, setSelectedOffIce] = useState([]);

  // ── DEBRIEF ──────────────────────────────────────────────────────────────
  const [rpe,             setRpe]             = useState(13);
  const [wentWell,        setWentWell]        = useState("");
  const [improve,         setImprove]         = useState("");
  const [nextGoal,        setNextGoal]        = useState("");
  const [sleep,           setSleepVal]        = useState(9.25);
  const [water,           setWater]           = useState(2.5);
  const [chosenSticker,   setChosenSticker]   = useState(null);
  const [showStickerPick, setShowStickerPick] = useState(false);
  const [saved,           setSaved]           = useState(false);

  // ── DERIVED ──────────────────────────────────────────────────────────────
  const theme   = THEMES.find(t => t.id === activeThemeId)   || THEMES[0];
  const floatie = FLOATIES.find(f => f.id === activeFloatieId) || FLOATIES[0];
  const ac = theme.accent;
  const bd = theme.border;

  const earnedGems = sessions.reduce((tot, s) => {
    const jg = Object.entries(s.jumpLog || {}).reduce((a, [ab, v]) => a + v.landed * (GEM_VALUE[ab] || 1), 0);
    const sg = (s.spins  || []).length * SPIN_GEM;
    const kg = (s.skills || []).length * SKILL_GEM;
    const og = (s.offIce || []).reduce((a, n) => { const ex = OFF_ICE.find(o => o.name === n); return a + (ex?.gems || 1); }, 0);
    const bg = (s.completedBlocks || []).length * BLOCK_GEM;
    return tot + jg + sg + kg + og + bg;
  }, 0);
  const spentGems = [...THEMES, ...FLOATIES]
    .filter(i => ownedItems.includes(i.id) && i.id !== "default")
    .reduce((a, i) => a + i.price, 0);
  const gems = earnedGems - spentGems;

  // A block is complete when every item in it is checked (or the block-level
  // checkbox for blocks with no exercises selected).
  const isBlockComplete = (b) => {
    const presetIds  = blockExercises[b.id] || [];
    const customList = blockExercises[`custom_${b.id}`] || [];
    const presets    = (PRESET_EXERCISES[b.id] || []).filter(e => presetIds.includes(e.id));
    const allItems   = [...presets, ...customList];
    if (allItems.length === 0) return !!checkedItems[`${b.id}_block`];
    return allItems.every(ex => !!checkedItems[`${b.id}_${ex.id}`]);
  };
  const completedBlockCount = BLOCKS.filter(b => selectedBlocks.includes(b.id) && isBlockComplete(b)).length;

  // Live gem count during current session
  const sessionGems =
    Object.entries(jumpLog).reduce((a, [ab, v]) => a + v.landed * (GEM_VALUE[ab] || 1), 0) +
    selectedSpins.length * SPIN_GEM +
    selectedSkills.length * SKILL_GEM +
    selectedOffIce.reduce((a, n) => { const ex = OFF_ICE.find(o => o.name === n); return a + (ex?.gems || 1); }, 0) +
    completedBlockCount * BLOCK_GEM;

  const allTimeLanded = sessions.flatMap(s => Object.entries(s.jumpLog || {}).map(([k, v]) => ({ abbr: k, landed: v.landed })));
  const jumpProgress = {};
  JUMPS.forEach(j => { jumpProgress[j.abbr] = allTimeLanded.filter(l => l.abbr === j.abbr).reduce((a, b) => a + b.landed, 0); });

  const totalIceHours = Math.round(sessions.reduce((a, s) => a + (s.duration || 0), 0) / 60 * 10) / 10;
  const totalDoubles  = sessions.reduce((a, s) =>
    a + Object.entries(s.jumpLog || {}).filter(([k]) => k.startsWith("2")).reduce((b, [, v]) => b + v.landed, 0), 0);

  // ── ACTIONS ──────────────────────────────────────────────────────────────
  const resetSetup = () => {
    setSmart({ S:"", M:"", A:"", R:"", T:"" });
    setSelectedBlocks([]); setBlockExercises({}); setCustomInputs({});
    setSessionMeta({ date: today(), duration: 60, mood: "😊" });
    setSetupStep(1); setActiveBlockExpand(null);
  };
  const resetPractice = () => {
    setCheckedItems({}); setJumpLog({}); setPracticeView("blocks");
    setSelectedSpins([]); setSelectedSkills([]); setSelectedOffIce([]);
    setCelebrateJump(null);
  };
  const resetDebrief = () => {
    setRpe(13); setWentWell(""); setImprove(""); setNextGoal("");
    setSleepVal(9.25); setWater(2.5); setChosenSticker(null);
    setSaved(false); setShowStickerPick(false);
  };
  const startSession = () => { resetSetup(); resetPractice(); resetDebrief(); setView("setup"); };

  const toggleBlock = (id) =>
    setSelectedBlocks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);

  const toggleExercise = (blockId, exId) =>
    setBlockExercises(prev => {
      const cur = prev[blockId] || [];
      return { ...prev, [blockId]: cur.includes(exId) ? cur.filter(e => e !== exId) : [...cur, exId] };
    });

  const addCustom = (blockId) => {
    const text = (customInputs[blockId] || "").trim();
    if (!text) return;
    const newId = `c_${uid()}`;
    setBlockExercises(prev => ({
      ...prev,
      [blockId]: [...(prev[blockId] || []), newId],
      [`custom_${blockId}`]: [...(prev[`custom_${blockId}`] || []), { id: newId, name: text }],
    }));
    setCustomInputs(prev => ({ ...prev, [blockId]: "" }));
  };

  const logJump = (abbr, result) => {
    setJumpLog(prev => {
      const cur = prev[abbr] || { landed: 0, attempts: 0 };
      if (result === "land") { setCelebrateJump(abbr); setTimeout(() => setCelebrateJump(null), 900); }
      return { ...prev, [abbr]: { landed: result === "land" ? cur.landed + 1 : cur.landed, attempts: cur.attempts + 1 } };
    });
  };

  const saveSession = () => {
    if (!chosenSticker) { setShowStickerPick(true); return; }
    const gemCount = sessionGems;
    const session = {
      id: uid(), date: sessionMeta.date, sticker: chosenSticker, mood: sessionMeta.mood,
      duration: sessionMeta.duration, smart, blocks: selectedBlocks,
      exercises: blockExercises, jumpLog, spins: selectedSpins,
      skills: selectedSkills, offIce: selectedOffIce,
      completedBlocks: BLOCKS.filter(b => selectedBlocks.includes(b.id) && isBlockComplete(b)).map(b => b.id),
      rpe, wentWell, improve, nextGoal, sleep, water,
    };
    setSessions(prev => [session, ...prev]);
    if (gemCount > 0) setGemsNotif(gemCount);
    setSaved(true);
    setTimeout(() => { setSaved(false); setGemsNotif(null); setView("home"); }, 2400);
  };

  // ── STYLES ───────────────────────────────────────────────────────────────
  const st = {
    app: { minHeight: "100vh", background: theme.bg, fontFamily: "'Nunito','Quicksand',sans-serif", color: "#e8f4ff", paddingBottom: 80 },
    card: { background: "rgba(255,255,255,0.06)", border: `0.5px solid ${bd}`, borderRadius: 18, padding: "14px 16px", marginBottom: 12 },
    label: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: ac, fontWeight: 800, marginBottom: 10, display: "block" },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "white", padding: "9px 12px", fontSize: 13, fontFamily: "'Nunito',sans-serif", outline: "none" },
    btn: (active, color) => ({
      border: active ? "none" : "0.5px solid rgba(255,255,255,0.12)", cursor: "pointer",
      fontFamily: "'Nunito',sans-serif", fontWeight: 800, borderRadius: 50, padding: "9px 18px", fontSize: 13,
      background: active ? `linear-gradient(135deg,${color || ac},${color || ac}bb)` : "rgba(255,255,255,0.07)",
      color: active ? "white" : "rgba(255,255,255,0.55)", transition: "all 0.18s",
    }),
    primaryBtn: { width: "100%", padding: "15px", borderRadius: 14, border: "none", background: `linear-gradient(135deg,#1a6fc4,#4a9edd)`, color: "white", fontSize: 15, fontWeight: 800, fontFamily: "'Nunito',sans-serif", cursor: "pointer", boxShadow: "0 6px 24px rgba(74,158,221,0.35)", marginBottom: 10 },
    navBar: { position: "fixed", bottom: 0, left: 0, right: 0, background: theme.navBg, backdropFilter: "blur(20px)", borderTop: `0.5px solid ${bd}`, display: "flex", padding: "8px 0 6px" },
    navBtn: (active) => ({ flex: 1, background: "transparent", border: "none", color: active ? ac : "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", textTransform: "uppercase", letterSpacing: 0.6, padding: "4px 2px", borderTop: active ? `2px solid ${ac}` : "2px solid transparent" }),
    stepDot: (active, done) => ({ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: done ? "#2ecc71" : active ? ac : "rgba(255,255,255,0.1)", color: done || active ? "white" : "rgba(255,255,255,0.3)", border: active ? `2px solid ${ac}` : "none" }),
    checkCircle: (done) => ({ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: done ? "#2ecc71" : "transparent", border: `1.5px solid ${done ? "#2ecc71" : "rgba(255,255,255,0.2)"}`, fontSize: 11, cursor: "pointer", transition: "all 0.15s" }),
    exTag: (active) => ({ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 50, fontSize: 12, fontWeight: 700, cursor: "pointer", margin: "3px", transition: "all 0.15s", background: active ? `${ac}30` : "rgba(255,255,255,0.06)", color: active ? ac : "rgba(255,255,255,0.55)", border: `0.5px solid ${active ? ac + "60" : "rgba(255,255,255,0.1)"}` }),
  };

  // ── HOME ─────────────────────────────────────────────────────────────────
  const HomeView = () => (
    <div style={{ padding: "0 16px", paddingTop: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[{ l: "Ice Hours", v: totalIceHours, i: "⏱️" }, { l: "Doubles", v: totalDoubles, i: "💎" }, { l: "Sessions", v: sessions.length, i: "🗓️" }].map(x => (
          <div key={x.l} style={{ ...st.card, marginBottom: 0, textAlign: "center", padding: "12px 6px" }}>
            <div style={{ fontSize: 18 }}>{x.i}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: ac }}>{x.v}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5 }}>{x.l}</div>
          </div>
        ))}
      </div>

      <button style={st.primaryBtn} onClick={startSession}>⛸️ &nbsp; Start Today's Session</button>

      <div style={st.card}>
        <span style={st.label}>💎 Double jump progress</span>
        {JUMPS.filter(j => j.isDouble).map(j => {
          const count = jumpProgress[j.abbr] || 0;
          const w = Math.min(100, (count / 50) * 100);
          return (
            <div key={j.abbr} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{j.emoji} {j.name}</span>
                <span style={{ fontSize: 12, color: ac, fontWeight: 800 }}>{count}</span>
              </div>
              <div style={{ height: 7, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${w}%`, borderRadius: 4, background: "linear-gradient(90deg,#7bc8ff,#e879f9)", transition: "width 0.5s" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ ...st.label, marginBottom: 0 }}>📖 Recent sessions</span>
        <button onClick={() => setView("history")} style={{ background: "transparent", border: "none", color: ac, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>See all →</button>
      </div>
      {sessions.slice(0, 3).map(sess => (
        <div key={sess.id} onClick={() => { setSelectedSession(sess); setView("session"); }}
          style={{ ...st.card, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{ fontSize: 30 }}>{sess.sticker}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>{fmtDate(sess.date)}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
              {sess.duration}min · {sess.mood} · RPE {sess.rpe}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#2ecc71" }}>
              {Object.values(sess.jumpLog || {}).reduce((a, b) => a + b.landed, 0)}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>landed</div>
          </div>
        </div>
      ))}
    </div>
  );

  // ── SETUP ────────────────────────────────────────────────────────────────
  const SetupView = () => {
    const steps = ["SMART Goal", "Blocks", "Exercises"];
    return (
      <div style={{ padding: "0 16px" }}>
        <div style={{ padding: "12px 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={st.stepDot(setupStep === i + 1, setupStep > i + 1)}>
                {setupStep > i + 1 ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: setupStep === i + 1 ? ac : "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 0.5 }}>{step}</span>
              {i < 2 && <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.15)" }} />}
            </div>
          ))}
        </div>

        {/* STEP 1 — SMART */}
        {setupStep === 1 && (
          <>
            <div style={st.card}>
              <span style={st.label}>📅 Session details</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Date</div>
                  <input type="date" value={sessionMeta.date}
                    onChange={e => setSessionMeta(p => ({ ...p, date: e.target.value }))} style={st.input} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Duration (min)</div>
                  <input type="number" value={sessionMeta.duration} min={15} max={180}
                    onChange={e => setSessionMeta(p => ({ ...p, duration: +e.target.value }))} style={st.input} />
                </div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>Mood going in</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["😊","🤩","😤","😴","😰"].map(m => (
                  <button key={m} onClick={() => setSessionMeta(p => ({ ...p, mood: m }))}
                    style={{ fontSize: 22, background: sessionMeta.mood === m ? `${ac}25` : "transparent", border: sessionMeta.mood === m ? `1.5px solid ${ac}` : "1.5px solid transparent", borderRadius: 10, padding: 4, cursor: "pointer" }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div style={st.card}>
              <span style={st.label}>🎯 SMART goal for today</span>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 12, lineHeight: 1.6 }}>
                Set your goal before stepping on the ice. Be specific and honest.
              </div>
              {SMART_FIELDS.map(f => (
                <div key={f.key} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${ac}30`, color: ac, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 8 }}>{f.key}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>{f.label}</div>
                    <input value={smart[f.key]} onChange={e => setSmart(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.hint} style={st.input} />
                  </div>
                </div>
              ))}
            </div>
            <button style={st.primaryBtn} onClick={() => setSetupStep(2)}>Next: Choose Blocks →</button>
          </>
        )}

        {/* STEP 2 — BLOCKS */}
        {setupStep === 2 && (
          <>
            <div style={st.card}>
              <span style={st.label}>🏗️ Select today's training blocks</span>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 12, lineHeight: 1.6 }}>
                Build your session in order. Tap to include a block.
              </div>
              {BLOCKS.map(b => {
                const active = selectedBlocks.includes(b.id);
                return (
                  <div key={b.id} onClick={() => toggleBlock(b.id)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", marginBottom: 6, borderRadius: 12, cursor: "pointer", border: `0.5px solid ${active ? b.color + "60" : "rgba(255,255,255,0.08)"}`, background: active ? b.color + "15" : "rgba(255,255,255,0.03)", transition: "all 0.18s" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: b.bg, color: b.color, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{b.abbr}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: active ? "#e8f4ff" : "rgba(255,255,255,0.6)" }}>{b.label}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{b.time}{b.offIce ? " · Off-ice" : " · On-ice"}</div>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: active ? "#2ecc71" : "rgba(255,255,255,0.08)", border: `1.5px solid ${active ? "#2ecc71" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white" }}>
                      {active ? "✓" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setSetupStep(1)} style={{ ...st.primaryBtn, background: "rgba(255,255,255,0.08)", boxShadow: "none", flex: 1 }}>← Back</button>
              <button onClick={() => { if (selectedBlocks.length > 0) setSetupStep(3); }}
                style={{ ...st.primaryBtn, flex: 2, opacity: selectedBlocks.length === 0 ? 0.4 : 1 }}>Next: Add Exercises →</button>
            </div>
          </>
        )}

        {/* STEP 3 — EXERCISES */}
        {setupStep === 3 && (
          <>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 12, lineHeight: 1.6 }}>
              For each block, pick preset exercises or add your own. Tap a block to expand.
            </div>
            {BLOCKS.filter(b => selectedBlocks.includes(b.id)).map(b => {
              const presets    = PRESET_EXERCISES[b.id] || [];
              const selected   = blockExercises[b.id] || [];
              const isOpen     = activeBlockExpand === b.id;
              const customList = blockExercises[`custom_${b.id}`] || [];
              return (
                <div key={b.id} style={st.card}>
                  <div onClick={() => setActiveBlockExpand(isOpen ? null : b.id)}
                    style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: b.bg, color: b.color, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{b.abbr}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>{b.label}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{selected.length + customList.length} selected · {b.time}</div>
                    </div>
                    <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</div>
                  </div>
                  {isOpen && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Preset exercises</div>
                      <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 14 }}>
                        {presets.map(ex => {
                          const active = selected.includes(ex.id);
                          return (
                            <div key={ex.id} onClick={() => toggleExercise(b.id, ex.id)} style={st.exTag(active)}>
                              {active ? "✓ " : "+ "}{ex.name}
                              {ex.duration && <span style={{ fontSize: 10, opacity: 0.6 }}> · {ex.duration}</span>}
                            </div>
                          );
                        })}
                      </div>
                      {customList.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Your exercises</div>
                          {customList.map(c => (
                            <div key={c.id} style={{ fontSize: 13, color: ac, padding: "4px 0", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>✓ {c.name}</div>
                          ))}
                        </div>
                      )}
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Add custom exercise</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input value={customInputs[b.id] || ""} placeholder="e.g. Back scratch spin 3x…"
                          onChange={e => setCustomInputs(p => ({ ...p, [b.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === "Enter") addCustom(b.id); }}
                          style={{ ...st.input, flex: 1 }} />
                        <button onClick={() => addCustom(b.id)}
                          style={{ background: `${ac}30`, border: `0.5px solid ${ac}60`, color: ac, borderRadius: 10, padding: "0 14px", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, cursor: "pointer" }}>+</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setSetupStep(2)} style={{ ...st.primaryBtn, background: "rgba(255,255,255,0.08)", boxShadow: "none", flex: 1 }}>← Back</button>
              <button onClick={() => setView("practice")}
                style={{ ...st.primaryBtn, flex: 2, background: "linear-gradient(135deg,#e879f9,#a855f7)", boxShadow: "0 6px 24px rgba(168,85,247,0.35)" }}>
                🏒 Start Practice!
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  // ── PRACTICE ─────────────────────────────────────────────────────────────
  const PracticeView = () => {
    const activeBlocks = BLOCKS.filter(b => selectedBlocks.includes(b.id));
    const totalItems   = activeBlocks.reduce((a, b) => {
      const p = (blockExercises[b.id] || []).length;
      const c = (blockExercises[`custom_${b.id}`] || []).length;
      return a + Math.max(1, p + c);
    }, 0);
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const progress     = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

    return (
      <div style={{ padding: "0 16px" }}>
        <div style={{ padding: "12px 0 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: ac }}>On the Ice 🏒</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{fmtDate(sessionMeta.date)} · {sessionMeta.duration}min</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: progress === 100 ? "#2ecc71" : ac }}>{progress}%</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>complete</div>
          </div>
        </div>

        <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#4a9edd,#2ecc71)", borderRadius: 3, transition: "width 0.4s" }} />
        </div>

        {/* Live gem counter */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", marginBottom: 12, background: "rgba(255,215,0,0.07)", borderRadius: 12, border: "1px solid rgba(255,215,0,0.2)" }}>
          <span style={{ fontSize: 18 }}>💎</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#ffd700" }}>+{sessionGems} gems earned so far</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Blocks 💎×2 · jumps · spins · skills · off-ice</div>
          </div>
        </div>

        {smart.S && (
          <div style={{ ...st.card, borderLeft: `3px solid ${ac}`, borderRadius: "0 12px 12px 0", marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: ac, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Today's goal</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{smart.S}</div>
          </div>
        )}

        {/* Sub-nav */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[["blocks", "📋 Checklist"], ["jumps", "⚡ Jumps"], ["skills", "🎯 Skills"]].map(([v, label]) => (
            <button key={v} onClick={() => setPracticeView(v)} style={st.btn(practiceView === v)}>{label}</button>
          ))}
        </div>

        {/* BLOCKS TAB */}
        {practiceView === "blocks" && activeBlocks.map(b => {
          const presetIds  = blockExercises[b.id] || [];
          const customList = blockExercises[`custom_${b.id}`] || [];
          const presets    = (PRESET_EXERCISES[b.id] || []).filter(e => presetIds.includes(e.id));
          const allItems   = [...presets, ...customList];
          const done       = isBlockComplete(b);
          return (
            <div key={b.id} style={{ ...st.card, border: done ? `0.5px solid ${b.color}88` : st.card.border, background: done ? `${b.color}10` : st.card.background }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: allItems.length > 0 ? 12 : 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: b.bg, color: b.color, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{b.abbr}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{b.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{b.time}{b.offIce ? " · Off-ice" : ""}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: done ? "#ffd700" : "rgba(255,215,0,0.4)" }}>
                  {done ? "✓ 💎×2" : "💎×2"}
                </span>
              </div>
              {allItems.length === 0 ? (
                <div onClick={() => setCheckedItems(p => ({ ...p, [`${b.id}_block`]: !p[`${b.id}_block`] }))}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", cursor: "pointer" }}>
                  <div style={st.checkCircle(checkedItems[`${b.id}_block`])}>{checkedItems[`${b.id}_block`] ? "✓" : ""}</div>
                  <span style={{ fontSize: 13, color: checkedItems[`${b.id}_block`] ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.75)", textDecoration: checkedItems[`${b.id}_block`] ? "line-through" : "none" }}>Complete {b.label.toLowerCase()}</span>
                </div>
              ) : allItems.map(ex => {
                const key = `${b.id}_${ex.id}`;
                return (
                  <div key={ex.id} onClick={() => setCheckedItems(p => ({ ...p, [key]: !p[key] }))}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", borderBottom: "0.5px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
                    <div style={st.checkCircle(checkedItems[key])}>{checkedItems[key] ? "✓" : ""}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: checkedItems[key] ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.85)", textDecoration: checkedItems[key] ? "line-through" : "none" }}>{ex.name}</div>
                      {(ex.duration || ex.note) && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{[ex.duration, ex.note].filter(Boolean).join(" · ")}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* JUMPS TAB */}
        {practiceView === "jumps" && (
          <div style={st.card}>
            <span style={st.label}>⚡ Jump counter — law of averages</span>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>Tap Land or Fall for every attempt.</div>
            {JUMPS_TRACK.map(j => {
              const entry = jumpLog[j.abbr] || { landed: 0, attempts: 0 };
              const p     = pct(entry.landed, entry.attempts);
              const isCelebrating = celebrateJump === j.abbr;
              return (
                <div key={j.abbr} style={{ marginBottom: 12, padding: "12px", borderRadius: 12, background: j.abbr.startsWith("2") ? "rgba(232,121,249,0.07)" : "rgba(255,255,255,0.04)", border: `0.5px solid ${j.abbr.startsWith("2") ? "rgba(232,121,249,0.15)" : "rgba(255,255,255,0.07)"}` }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 16, marginRight: 6 }}>{j.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, flex: 1 }}>{j.name}</span>
                    <span style={{ fontSize: 10, color: "#ffd700", fontWeight: 700, marginRight: 8 }}>💎×{GEM_VALUE[j.abbr] || 1}</span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: p >= 70 ? "#2ecc71" : p >= 50 ? "#f1c40f" : "rgba(255,255,255,0.5)", transform: isCelebrating ? "scale(1.3)" : "scale(1)", transition: "transform 0.2s" }}>
                      {entry.landed}/{entry.attempts}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => logJump(j.abbr, "land")} style={{ background: "linear-gradient(135deg,#2ecc71,#1abc9c)", border: "none", borderRadius: 50, padding: "8px 18px", color: "white", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>✅ Land</button>
                    <button onClick={() => logJump(j.abbr, "fall")} style={{ background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 50, padding: "8px 18px", color: "rgba(255,255,255,0.55)", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>❌ Fall</button>
                    {entry.attempts > 0 && (
                      <div style={{ flex: 1, marginLeft: 4 }}>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${p}%`, background: p >= 70 ? "#2ecc71" : p >= 50 ? "#f1c40f" : "#e74c3c", borderRadius: 3, transition: "width 0.3s" }} />
                        </div>
                        <div style={{ fontSize: 11, color: p >= 70 ? "#2ecc71" : p >= 50 ? "#f1c40f" : "#e74c3c", marginTop: 3, textAlign: "right" }}>{p}%</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SKILLS TAB */}
        {practiceView === "skills" && (
          <>
            <div style={st.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={st.label}>🌀 Spins Practiced</span>
                <span style={{ fontSize: 11, color: "#ffd700", fontWeight: 700 }}>💎×{SPIN_GEM} each</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SPINS.map(sp => {
                  const active = selectedSpins.includes(sp);
                  return (
                    <button key={sp} onClick={() => setSelectedSpins(prev => active ? prev.filter(s => s !== sp) : [...prev, sp])}
                      style={{ ...st.btn(active), padding: "8px 14px", fontSize: 12 }}>{sp}</button>
                  );
                })}
              </div>
            </div>

            <div style={st.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={st.label}>🎯 Skills Worked On</span>
                <span style={{ fontSize: 11, color: "#ffd700", fontWeight: 700 }}>💎×{SKILL_GEM} each</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SKILLS.map(sk => {
                  const active = selectedSkills.includes(sk);
                  return (
                    <button key={sk} onClick={() => setSelectedSkills(prev => active ? prev.filter(s => s !== sk) : [...prev, sk])}
                      style={{ ...st.btn(active), padding: "8px 14px", fontSize: 12 }}>{sk}</button>
                  );
                })}
              </div>
            </div>

            <div style={st.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ ...st.label, color: "#e879f9", marginBottom: 0 }}>🏋️ Off-Ice Training</span>
                <span style={{ fontSize: 11, color: "#ffd700", fontWeight: 700 }}>
                  {selectedOffIce.length > 0 ? `+${selectedOffIce.reduce((a, n) => { const ex = OFF_ICE.find(o => o.name === n); return a + (ex?.gems || 1); }, 0)} 💎` : "tap to earn gems"}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {OFF_ICE.map(ex => {
                  const active = selectedOffIce.includes(ex.name);
                  return (
                    <button key={ex.name} onClick={() => setSelectedOffIce(prev => active ? prev.filter(n => n !== ex.name) : [...prev, ex.name])}
                      style={{ ...st.btn(active, "#a855f7"), padding: "8px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                      {ex.emoji} {ex.name}
                      <span style={{ fontSize: 10, opacity: 0.8, color: active ? "rgba(255,255,255,0.8)" : "#ffd700" }}>💎{ex.gems}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <button onClick={() => setView("debrief")}
          style={{ ...st.primaryBtn, background: "linear-gradient(135deg,#e879f9,#a855f7)", boxShadow: "0 6px 24px rgba(168,85,247,0.35)" }}>
          📝 Finish & Debrief
        </button>
      </div>
    );
  };

  // ── DEBRIEF ──────────────────────────────────────────────────────────────
  const DebriefView = () => {
    const tl = Object.values(jumpLog).reduce((a, b) => a + b.landed, 0);
    const ta = Object.values(jumpLog).reduce((a, b) => a + b.attempts, 0);
    return (
      <div style={{ padding: "0 16px" }}>
        <div style={{ padding: "12px 0 12px" }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: ac }}>Session Debrief 📝</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>Ink what you think — while it's fresh</div>
        </div>

        {/* Gem summary */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 12, background: "rgba(255,215,0,0.08)", borderRadius: 14, border: "1px solid rgba(255,215,0,0.22)" }}>
          <span style={{ fontSize: 22 }}>💎</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#ffd700" }}>+{sessionGems} gems this session</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Saved to your total when you submit</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[{ l: "Landed", v: tl, c: "#2ecc71" }, { l: "Attempts", v: ta, c: ac }, { l: "Avg", v: `${pct(tl, ta)}%`, c: pct(tl, ta) >= 70 ? "#2ecc71" : "#f1c40f" }].map(x => (
            <div key={x.l} style={{ ...st.card, marginBottom: 0, textAlign: "center", padding: "12px 6px" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: x.c }}>{x.v}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5 }}>{x.l}</div>
            </div>
          ))}
        </div>

        {/* Jump breakdown */}
        {ta > 0 && (
          <div style={st.card}>
            <span style={st.label}>⚡ Jump breakdown</span>
            {JUMPS_TRACK.filter(j => (jumpLog[j.abbr]?.attempts || 0) > 0).map(j => {
              const e = jumpLog[j.abbr];
              const p = pct(e.landed, e.attempts);
              return (
                <div key={j.abbr} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 13, flex: 1 }}>{j.emoji} {j.name}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{e.landed}/{e.attempts}</span>
                  <div style={{ width: 60, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p}%`, background: p >= 70 ? "#2ecc71" : p >= 50 ? "#f1c40f" : "#e74c3c", borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, minWidth: 32, textAlign: "right", color: p >= 70 ? "#2ecc71" : p >= 50 ? "#f1c40f" : "#e74c3c" }}>{p}%</span>
                </div>
              );
            })}
          </div>
        )}

        {/* RPE */}
        <div style={st.card}>
          <span style={st.label}>💪 Rate of perceived exertion (Borg 6–20)</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <input type="range" min={6} max={20} step={1} value={rpe}
              onChange={e => setRpe(+e.target.value)} style={{ flex: 1, accentColor: ac }} />
            <span style={{ fontSize: 22, fontWeight: 900, color: ac, minWidth: 28 }}>{rpe}</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>{RPE_LABELS[rpe]}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
            <span>6 — rest</span><span>20 — max effort</span>
          </div>
        </div>

        {/* Reflection */}
        <div style={st.card}>
          <span style={st.label}>✍️ Ink what you think</span>
          {[
            { label: "What went well today?",    val: wentWell, set: setWentWell, placeholder: "Be specific — what moments felt great?" },
            { label: "What needs improvement?",  val: improve,  set: setImprove,  placeholder: "Honest reflection — what was hard?" },
            { label: "Goal for next session",    val: nextGoal, set: setNextGoal, placeholder: "Set it now while motivated…" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>{f.label}</div>
              <textarea value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                style={{ ...st.input, minHeight: 64, resize: "none" }} />
            </div>
          ))}
        </div>

        {/* Recovery */}
        <div style={st.card}>
          <span style={st.label}>💤 Recovery log</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Sleep last night (hrs)</div>
              <input type="number" step={0.25} min={0} max={12} value={sleep}
                onChange={e => setSleepVal(+e.target.value)} style={st.input} />
              <div style={{ fontSize: 10, color: sleep >= 9.25 ? "#2ecc71" : "#f1c40f", marginTop: 4 }}>
                {sleep >= 9.25 ? "✓ Goal met (9.25h)" : `⚠ Need ${(9.25 - sleep).toFixed(2)}h more`}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Water today (litres)</div>
              <input type="number" step={0.1} min={0} max={5} value={water}
                onChange={e => setWater(+e.target.value)} style={st.input} />
              <div style={{ fontSize: 10, color: water >= 3 ? "#2ecc71" : "#f1c40f", marginTop: 4 }}>
                {water >= 3 ? "✓ Hydrated" : `⚠ Need ${(3 - water).toFixed(1)}L more`}
              </div>
            </div>
          </div>
        </div>

        {/* Sticker picker */}
        {showStickerPick && (
          <div style={st.card}>
            <span style={{ ...st.label, color: "#e879f9" }}>🎀 Pick your session sticker!</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {STICKERS.map(s => (
                <button key={s} onClick={() => { setChosenSticker(s); setShowStickerPick(false); }}
                  style={{ fontSize: 26, background: chosenSticker === s ? "rgba(232,121,249,0.2)" : "rgba(255,255,255,0.05)", border: `2px solid ${chosenSticker === s ? "#e879f9" : "transparent"}`, borderRadius: 10, padding: 4, cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={saveSession}
          style={{ ...st.primaryBtn, background: saved ? "linear-gradient(135deg,#2ecc71,#1abc9c)" : "linear-gradient(135deg,#e879f9,#a855f7)", boxShadow: "0 6px 24px rgba(168,85,247,0.35)" }}>
          {saved ? "🎉 Session saved! Amazing work Alice!" : chosenSticker ? `${chosenSticker} Save Session!` : "🎀 Pick a Sticker & Save!"}
        </button>
        <div style={{ height: 8 }} />
      </div>
    );
  };

  // ── HISTORY ──────────────────────────────────────────────────────────────
  const HistoryView = () => (
    <div style={{ padding: "0 16px" }}>
      <div style={{ padding: "12px 0 14px" }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: ac }}>📖 All Sessions</div>
      </div>
      {sessions.map(sess => (
        <div key={sess.id} onClick={() => { setSelectedSession(sess); setView("session"); }}
          style={{ ...st.card, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{ fontSize: 32 }}>{sess.sticker}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>{fmtDate(sess.date)}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
              {sess.duration}min · {sess.mood} · RPE {sess.rpe}
            </div>
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>›</div>
        </div>
      ))}
    </div>
  );

  // ── SESSION DETAIL ────────────────────────────────────────────────────────
  const SessionDetail = () => {
    const sess = selectedSession;
    if (!sess) return null;
    const tl = Object.values(sess.jumpLog || {}).reduce((a, b) => a + b.landed, 0);
    const ta = Object.values(sess.jumpLog || {}).reduce((a, b) => a + b.attempts, 0);
    const sessGems =
      Object.entries(sess.jumpLog || {}).reduce((a, [ab, v]) => a + v.landed * (GEM_VALUE[ab] || 1), 0) +
      (sess.spins || []).length * SPIN_GEM +
      (sess.skills || []).length * SKILL_GEM +
      (sess.offIce || []).reduce((a, n) => { const ex = OFF_ICE.find(o => o.name === n); return a + (ex?.gems || 1); }, 0) +
      (sess.completedBlocks || []).length * BLOCK_GEM;
    return (
      <div style={{ padding: "0 16px" }}>
        <button onClick={() => setView("history")} style={{ background: "transparent", border: "none", color: ac, fontSize: 14, cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700, padding: "12px 0" }}>← Back</button>
        <div style={{ ...st.card, display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 48 }}>{sess.sticker}</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900 }}>{fmtDate(sess.date)}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{sess.duration}min · {sess.mood} · RPE {sess.rpe}</div>
            {sessGems > 0 && <div style={{ fontSize: 12, color: "#ffd700", marginTop: 4, fontWeight: 700 }}>💎 {sessGems} gems earned</div>}
          </div>
        </div>

        {sess.smart?.S && (
          <div style={{ ...st.card, borderLeft: `3px solid ${ac}`, borderRadius: "0 12px 12px 0" }}>
            <div style={{ fontSize: 10, color: ac, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>SMART goal</div>
            {Object.entries(sess.smart).filter(([, v]) => v).map(([k, v]) => (
              <div key={k} style={{ fontSize: 13, marginBottom: 4 }}><span style={{ color: ac, fontWeight: 800 }}>{k}:</span> {v}</div>
            ))}
          </div>
        )}

        {ta > 0 && (
          <div style={st.card}>
            <span style={st.label}>⚡ Jump stats — {tl}/{ta} · {pct(tl, ta)}% avg</span>
            {JUMPS_TRACK.filter(j => sess.jumpLog?.[j.abbr]?.attempts > 0).map(j => {
              const e = sess.jumpLog[j.abbr];
              const p = pct(e.landed, e.attempts);
              return (
                <div key={j.abbr} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 13, flex: 1 }}>{j.emoji} {j.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: p >= 70 ? "#2ecc71" : p >= 50 ? "#f1c40f" : "#e74c3c" }}>{e.landed}/{e.attempts}</span>
                </div>
              );
            })}
          </div>
        )}

        {(sess.spins?.length > 0 || sess.skills?.length > 0) && (
          <div style={st.card}>
            {sess.spins?.length > 0 && (
              <>
                <span style={st.label}>🌀 Spins</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: sess.skills?.length > 0 ? 14 : 0 }}>
                  {sess.spins.map(sp => <span key={sp} style={{ background: `${ac}22`, border: `1px solid ${ac}44`, borderRadius: 20, padding: "5px 12px", fontSize: 13 }}>{sp}</span>)}
                </div>
              </>
            )}
            {sess.skills?.length > 0 && (
              <>
                <span style={st.label}>🎯 Skills</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {sess.skills.map(sk => <span key={sk} style={{ background: `${ac}22`, border: `1px solid ${ac}44`, borderRadius: 20, padding: "5px 12px", fontSize: 13 }}>{sk}</span>)}
                </div>
              </>
            )}
          </div>
        )}

        {sess.offIce?.length > 0 && (
          <div style={st.card}>
            <span style={{ ...st.label, color: "#e879f9" }}>🏋️ Off-Ice Training</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {sess.offIce.map(name => {
                const ex = OFF_ICE.find(o => o.name === name);
                return <span key={name} style={{ background: "rgba(232,121,249,0.12)", border: "1px solid rgba(232,121,249,0.3)", borderRadius: 20, padding: "5px 12px", fontSize: 13 }}>{ex?.emoji} {name}</span>;
              })}
            </div>
          </div>
        )}

        {sess.wentWell && (
          <div style={st.card}>
            <div style={{ fontSize: 10, color: "#2ecc71", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Went well</div>
            <div style={{ fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.8)" }}>{sess.wentWell}</div>
            {sess.improve && <><div style={{ fontSize: 10, color: "#f1c40f", textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 6px" }}>Improve</div><div style={{ fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.8)" }}>{sess.improve}</div></>}
            {sess.nextGoal && <><div style={{ fontSize: 10, color: ac, textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 6px" }}>Next goal</div><div style={{ fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.8)" }}>{sess.nextGoal}</div></>}
          </div>
        )}
      </div>
    );
  };

  // ── SHOP ─────────────────────────────────────────────────────────────────
  const ShopView = () => (
    <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px" }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: ac }}>🛍️ Gem Shop</div>
        <div style={{ background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 50, padding: "6px 16px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>💎</span>
          <span style={{ fontWeight: 900, color: "#ffd700", fontSize: 16 }}>{gems}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>available</span>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 18, lineHeight: 1.5 }}>
        Earn gems by landing jumps, practicing spins & skills, and off-ice training.
      </div>

      <div style={{ fontSize: 12, fontWeight: 900, color: ac, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>🎨 App Themes</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
        {THEMES.map(item => {
          const owned     = ownedItems.includes(item.id);
          const active    = activeThemeId === item.id;
          const canAfford = gems >= item.price;
          return (
            <div key={item.id} onClick={() => {
              if (active) return;
              if (owned) { setActiveThemeId(item.id); return; }
              if (canAfford) { setOwnedItems(prev => [...prev, item.id]); setActiveThemeId(item.id); }
            }} style={{
              borderRadius: 18, padding: 14, cursor: !owned && !canAfford ? "not-allowed" : "pointer",
              background: item.bg, border: `2px solid ${active ? "#ffd700" : owned ? item.accent + "88" : "rgba(255,255,255,0.08)"}`,
              opacity: !owned && !canAfford ? 0.45 : 1, position: "relative", transition: "all 0.2s",
            }}>
              {active && <div style={{ position: "absolute", top: 7, right: 7, background: "#ffd700", color: "#1a0f00", fontSize: 8, fontWeight: 900, borderRadius: 20, padding: "2px 7px", textTransform: "uppercase" }}>Active</div>}
              <div style={{ fontSize: 30, marginBottom: 4 }}>{item.emoji}</div>
              <div style={{ fontWeight: 900, fontSize: 13, color: item.accent, marginBottom: 2 }}>{item.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>{item.desc}</div>
              {owned ? <span style={{ fontSize: 11, color: active ? "#ffd700" : "#2ecc71", fontWeight: 800 }}>{active ? "✓ Equipped" : "Tap to equip"}</span>
                     : <span style={{ fontSize: 12, color: canAfford ? "#ffd700" : "rgba(255,255,255,0.25)", fontWeight: 800 }}>💎 {item.price}</span>}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 12, fontWeight: 900, color: ac, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>✨ Floating Particles</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
        {FLOATIES.map(item => {
          const owned     = ownedItems.includes(item.id);
          const active    = activeFloatieId === item.id;
          const canAfford = gems >= item.price;
          return (
            <div key={item.id} onClick={() => {
              if (active) return;
              if (owned) { setActiveFloatieId(item.id); return; }
              if (canAfford) { setOwnedItems(prev => [...prev, item.id]); setActiveFloatieId(item.id); }
            }} style={{
              ...st.card, marginBottom: 0, padding: 14,
              cursor: !owned && !canAfford ? "not-allowed" : "pointer",
              border: `2px solid ${active ? "#ffd700" : owned ? ac + "88" : "rgba(255,255,255,0.08)"}`,
              opacity: !owned && !canAfford ? 0.45 : 1, position: "relative",
            }}>
              {active && <div style={{ position: "absolute", top: 7, right: 7, background: "#ffd700", color: "#1a0f00", fontSize: 8, fontWeight: 900, borderRadius: 20, padding: "2px 7px", textTransform: "uppercase" }}>Active</div>}
              <div style={{ fontSize: 20, letterSpacing: 2, marginBottom: 4 }}>{item.particles.slice(0, 4).join("")}</div>
              <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 2 }}>{item.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>{item.desc}</div>
              {owned ? <span style={{ fontSize: 11, color: active ? "#ffd700" : "#2ecc71", fontWeight: 800 }}>{active ? "✓ Equipped" : "Tap to equip"}</span>
                     : <span style={{ fontSize: 12, color: canAfford ? "#ffd700" : "rgba(255,255,255,0.25)", fontWeight: 800 }}>💎 {item.price === 0 ? "Free" : item.price}</span>}
            </div>
          );
        })}
      </div>

      <div style={st.card}>
        <span style={{ ...st.label, color: "#ffd700" }}>💎 Gem Earning Guide</span>
        {[
          { label: "Level 1 jumps (WJ, S, T)", val: "💎 ×1 per land" },
          { label: "Level 2 jumps (Lo, F, Lz)",val: "💎 ×2 per land" },
          { label: "Axel",                      val: "💎 ×5 per land" },
          { label: "Doubles (2S, 2T, 2Lo)",     val: "💎 ×3 per land" },
          { label: "Double Flip & Lutz",         val: "💎 ×4 per land" },
          { label: "Each spin practiced",        val: `💎 ×${SPIN_GEM}` },
          { label: "Each skill worked on",       val: `💎 ×${SKILL_GEM}` },
          { label: "Each training block completed", val: `💎 ×${BLOCK_GEM}` },
          { label: "Off-ice training (varies)",  val: "💎 ×1 – ×4" },
        ].map(r => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12 }}>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{r.label}</span>
            <span style={{ color: "#ffd700", fontWeight: 800 }}>{r.val}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── RENDER ───────────────────────────────────────────────────────────────
  const navItems = [
    { id: "home",     icon: "🏠", label: "Home" },
    { id: "setup",    icon: "🎯", label: "Setup" },
    { id: "practice", icon: "🏒", label: "Practice" },
    { id: "debrief",  icon: "📝", label: "Debrief" },
    { id: "shop",     icon: "🛍️", label: "Shop" },
  ];

  return (
    <div style={st.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Pacifico&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, textarea { outline: none; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${ac}55; border-radius: 2px; }
        input[type=range] { accent-color: ${ac}; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.4); }
        .snowflake { position: fixed; pointer-events: none; opacity: 0.15; animation: fall linear infinite; }
        @keyframes fall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0.15; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .gem-pop { animation: gemPop 0.7s cubic-bezier(0.175,0.885,0.32,1.275); }
        @keyframes gemPop {
          0%   { transform: translateX(-50%) scale(0) translateY(20px); opacity: 0; }
          70%  { transform: translateX(-50%) scale(1.15) translateY(-4px); opacity: 1; }
          100% { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Floating particles */}
      {floatie.particles.map((p, i) => (
        <span key={i} className="snowflake" style={{ left: `${10 + i * 13}%`, fontSize: `${10 + (i % 3) * 6}px`, animationDuration: `${8 + i * 2}s`, animationDelay: `${i * 1.5}s` }}>{p}</span>
      ))}

      {/* Persistent header */}
      {view !== "session" && (
        <div style={{ padding: "12px 18px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `0.5px solid ${bd}` }}>
          <div>
            <div style={{ fontFamily: "Pacifico,cursive", fontSize: 20, color: ac, lineHeight: 1 }}>Alice's</div>
            <div style={{ fontFamily: "Pacifico,cursive", fontSize: 12, color: "rgba(200,230,255,0.6)" }}>Skating Journal ⛸️</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setView("shop")}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#ffd700" }}>💎 {gems}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5 }}>Gems</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20 }}>🗓️ {sessions.length}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5 }}>Sessions</div>
            </div>
          </div>
        </div>
      )}

      {/* Gem notification */}
      {gemsNotif && (
        <div className="gem-pop" style={{ position: "fixed", top: 80, left: "50%", background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#1a0f00", padding: "10px 22px", borderRadius: 50, fontWeight: 900, fontSize: 16, zIndex: 100, boxShadow: "0 4px 24px rgba(245,158,11,0.55)", whiteSpace: "nowrap" }}>
          +{gemsNotif} 💎 Gems Earned!
        </div>
      )}

      {/* Main content */}
      <div style={{ maxHeight: "calc(100vh - 114px)", overflowY: "auto" }}>
        {view === "home"     && <HomeView />}
        {view === "setup"    && <SetupView />}
        {view === "practice" && <PracticeView />}
        {view === "debrief"  && <DebriefView />}
        {view === "history"  && <HistoryView />}
        {view === "session"  && <SessionDetail />}
        {view === "shop"     && <ShopView />}
      </div>

      {/* Bottom nav */}
      {view !== "session" && (
        <div style={st.navBar}>
          {navItems.map(n => (
            <button key={n.id} style={st.navBtn(view === n.id || (view === "history" && n.id === "home"))}
              onClick={() => { if (n.id === "setup") startSession(); else setView(n.id); }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{n.icon}</div>
              {n.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
