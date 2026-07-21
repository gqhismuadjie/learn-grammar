import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, BookOpen, PenLine, Check, X, RotateCcw, Trophy, Clock,
  Loader2, Lightbulb, ArrowRight, AlertTriangle, Sparkles, History, Play, Layers,
  BarChart3, Flame, Target, Download, Upload
} from "lucide-react";
import { UNITS } from "./content/units.js";
import { QUIZ2 } from "./content/quiz2.js";
import { TAG_ID, LEARN_ID, EX_ID } from "./content/id.js";

// The Writing Lab calls the Anthropic API with platform-injected auth, which a
// static GitHub Pages site cannot provide (and a public site cannot safely hold
// an API key). It is disabled on this build; flip to true behind a backend proxy.
const AI_ENABLED = false;
const EXTRA_ROUND = 10; // questions per fixed Extra-practice deck

// ---------- Design tokens (royal blue + red accent) ----------
const C = {
  blue: "#2338E7",
  blueDark: "#1826B8",
  blueWash: "#EBEDFF",
  red: "#E82D3E",
  redWash: "#FDECEE",
  ink: "#131530",
  sub: "#5B5F7E",
  paper: "#F3F4FA",
  card: "#FFFFFF",
  line: "#E2E4F0",
  green: "#0E9F5B",
  greenWash: "#E7F6EE",
  amber: "#E8930C",
  amberWash: "#FCF3E3",
};

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
`;

const display = { fontFamily: "'Baloo 2', system-ui, sans-serif" };
const body = { fontFamily: "'Inter', system-ui, sans-serif" };

// ---------- Writing Lab ----------
const WRITING_PROMPTS = [
  { id: "transport", title: "Public transport", text: "Some people believe that the government should invest in public transport to reduce traffic congestion. To what extent do you agree or disagree?" },
  { id: "online", title: "Online learning", text: "Some people think that online learning will eventually replace traditional classrooms. Do the advantages of this development outweigh the disadvantages?" },
  { id: "environment", title: "Environment", text: "Some people believe that individual actions make little difference to the environment, and that only governments and large companies can bring real change. To what extent do you agree or disagree?" },
  { id: "work", title: "Working hours", text: "In many countries, people are spending more and more hours at work. Why is this happening? What effects does this trend have on individuals and society?" },
];

const CRIT = [
  ["taskResponse", "Task Response"],
  ["coherence", "Coherence & Cohesion"],
  ["lexical", "Lexical Resource"],
  ["grammar", "Grammatical Range & Accuracy"],
];

// ---------- Persistence (localStorage; progress stays on this device) ----------
const K_PROG = "igr-progress";
const K_WRIT = "igr-writing";
const K_MIST = "igr-mistakes"; // questions answered wrong, for the Review deck
const K_STATS = "igr-stats";   // aggregate accuracy + daily streak
const store = {
  async get(key) {
    try {
      if (typeof window === "undefined" || !window.localStorage) return null;
      const v = window.localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) { return null; }
  },
  async set(key, val) {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      window.localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { /* storage unavailable — keep in memory only */ }
  },
};

// ---------- Helpers ----------
function countWords(t) { return t.trim() ? t.trim().split(/\s+/).filter(Boolean).length : 0; }
function fmtTime(s) { const m = Math.floor(s / 60); const ss = s % 60; return `${m}:${ss < 10 ? "0" : ""}${ss}`; }
function bandStr(b) { return typeof b === "number" ? b.toFixed(1) : "–"; }

// Fisher–Yates: return a shuffled copy so answer options move each attempt.
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// Shuffle a question's options and re-point the correct index to its new slot.
function shuffleQuestion(q) {
  const order = shuffled(q.opts.map((_, i) => i));
  return { ...q, opts: order.map(i => q.opts[i]), a: order.indexOf(q.a) };
}
const normQ = s => String(s).toLowerCase().replace(/\s+/g, " ").trim();
const mistKey = (unit, q) => unit + "::" + normQ(q);
function dayStr(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function todayStr() { return dayStr(new Date()); }
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); }

// Build a self-contained mistake/answer record from a quiz item.
// Core drills key their ID explanation positionally (EX_ID); context/extra
// decks carry their own exId, so the review deck can replay any of them.
function buildRec(unitId, isCtx, item, index) {
  const exId = isCtx ? (item.exId || item.ex) : (EX_ID[unitId + "-" + index] || item.ex);
  return { key: mistKey(unitId, item.q), unit: unitId, q: item.q, opts: item.opts, a: item.a, ex: item.ex, exId };
}
function recFromItem(item) {
  return { key: item.key || mistKey(item.unit, item.q), unit: item.unit, q: item.q, opts: item.opts, a: item.a, ex: item.ex, exId: item.exId };
}

function buildScoringPrompt(promptText, essay, words, lang) {
  return `You are a certified IELTS Writing examiner. Assess the IELTS Writing Task 2 essay below using the official public band descriptors for Task Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. Score each criterion in 0.5 steps between 4.0 and 9.0. Be realistically calibrated: a typical B2 learner scores 5.5-6.5; reserve 7.5+ for genuinely strong writing. If the essay is under 250 words, penalize Task Response. If the text is off-topic or not an essay, still return the JSON with low bands and say why in the comments. ${lang === "id" ? 'Write every "comment", every "strengths" and "improvements" item, and every "rule" in Bahasa Indonesia; keep "original" and "fixed" in English because they quote the essay.' : "Write all comments in English."}

ESSAY QUESTION:
${promptText}

CANDIDATE ESSAY (${words} words):
${essay}

Respond with ONLY a valid JSON object. No markdown, no backticks, no text before or after. Use exactly this schema:
{"taskResponse":{"band":6.0,"comment":"max 25 words"},"coherence":{"band":6.0,"comment":"max 25 words"},"lexical":{"band":6.0,"comment":"max 25 words"},"grammar":{"band":6.0,"comment":"max 25 words"},"overall":6.0,"strengths":["up to 3 items, each under 15 words"],"improvements":["up to 3 items, each under 15 words"],"errors":[{"original":"short exact phrase from the essay","fixed":"corrected phrase","rule":"short rule name","unit":10}]}

For "errors", list up to 4 of the most important language mistakes. "unit" maps each error to the most relevant unit of the learner's grammar course: 1 Articles, 2 Nouns/Quantifiers, 3 Prepositions, 4 Comparing, 5 Subject-Verb Agreement, 6 Past Tenses, 7 Present Tenses, 8 Future Tenses, 9 Passive Voice, 10 Conditionals, 11 Modals, 12 Relative Clauses, 13 Complex Sentences. Use null if no unit fits. "overall" is the average of the four bands rounded to the nearest 0.5.`;
}

async function scoreEssay(promptText, essay, lang) {
  const words = countWords(essay);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: buildScoringPrompt(promptText, essay, words, lang) }],
    }),
  });
  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
  const clean = text.replace(/```json|```/g, "").trim();
  const s = clean.indexOf("{"); const e = clean.lastIndexOf("}");
  if (s < 0 || e < 0) throw new Error("Unexpected response");
  const j = JSON.parse(clean.slice(s, e + 1));
  if (typeof j.overall !== "number") {
    const bs = CRIT.map(([k]) => j[k] && j[k].band).filter(n => typeof n === "number");
    j.overall = bs.length ? Math.round((bs.reduce((a, b) => a + b, 0) / bs.length) * 2) / 2 : null;
  }
  return j;
}

// ---------- Bahasa Indonesia layer ----------
const K_LANG = "igr-lang";

// ---------- UI strings (EN / ID) ----------
const T = {
  en: {
    heroTitle: "Master the rules, reach Band 7",
    heroSub: (n) => `Interactive grammar practice — ${UNITS.length} units and ${n} practice questions.`,
    statsLine: (p, m) => `${p}/${UNITS.length} units practiced · ${m} mastered (80%+)`,
    lastEssay: (b) => ` · last essay ${b}`,
    writingTitle: "Writing Lab",
    writingSub: "Write a Task 2 essay under exam timing, then get an AI band estimate with feedback linked to these units.",
    unitsHeader: "Grammar units",
    unitsHint: "Learn, then practice",
    newLabel: "New",
    footer: `A personal IELTS grammar study app — ${UNITS.length} units of rules and targeted drills. Progress is saved on this device.`,
    allUnits: "All units",
    learnTab: "Learn",
    practiceTab: "Practice",
    practiceBtn: "Practice this unit",
    deckCore: "Core drill",
    deckCoreSub: "Targeted questions on each unit's key rules, with a worked explanation for every answer.",
    deckCtx: "Context practice",
    deckCtxSub: "Fuller, real-world contexts using everyday (Oxford 3000-level) vocabulary.",
    deckExtra: (n) => `Extra practice ${n}`,
    deckExtraSub: "A fixed set of Oxford 3000-level questions to work through.",
    qWord: "questions",
    best: "Best",
    qOf: (i, n) => `Question ${i} of ${n}`,
    correct: "correct",
    correctAnswer: "Correct answer:",
    next: "Next question",
    seeResults: "See results",
    tryAgain: "Try again",
    backToDecks: "Back to practice",
    msg90: "Outstanding — Band 7 territory!",
    msg70: "Solid work. Review the ones you missed.",
    msg50: "Good start — reread the Learn tab and try again.",
    msg0: "Revisit the Learn tab first, then retry.",
    home: "Home",
    wlKicker: "WRITING TASK 2 · 40 MIN · 250+ WORDS",
    wlSub: "Pick a question, write under exam conditions, then get an AI band estimate.",
    examNote: "Questions are in English, exactly as in the real exam.",
    customOpen: "+ Use your own Task 2 question",
    customPh: "Paste or type a Task 2 question…",
    customTitle: "Custom question",
    customBtn: "Write on this question",
    recent: "Recent essays",
    words: "words",
    aim: " · aim for 250+",
    tStart: " · start",
    tPaused: " · paused",
    timeUp: "Time is up — in the real exam you would stop here, but you can keep writing.",
    scoreErr: "The assessment didn’t come back in a readable format. Your essay is still here — try again in a moment.",
    submitLow: "Write at least 40 words",
    submit: "Get my band estimate",
    under250: "Under 250 words — real examiners penalize short essays, and this estimate will too.",
    gradingTitle: "Examining your essay…",
    gradingSub: "Checking task response, coherence, vocabulary and grammar. This takes a few seconds.",
    questionsBack: "Questions",
    estBand: "ESTIMATED OVERALL BAND",
    workingWell: "Working well",
    focusNext: "Focus next",
    fixFirst: "Fix these first",
    review: (id, t) => `Review Unit ${id} · ${t}`,
    disclaimer: "This band is an AI estimate based on the public IELTS descriptors. It is not an official result, and a certified examiner’s scores may differ.",
    another: "Write another essay",
    backHome: "Back home",
    task2: "TASK 2",
    wlBack: "Writing Lab",
    wtHomeCard: "Writing training",
    wtHomeCardSub: "Task 1 & Task 2 practice with band-9 model answers.",
    wtKicker: "IELTS WRITING · TASK 1 & 2",
    wtTitle: "Writing training",
    wtSub: "Practise a task, then reveal a band-9 model answer to compare.",
    wtTask2: "TASK 2 — ESSAYS",
    wtTask1: "TASK 1 — CHARTS, PROCESSES & MAPS",
    wtType: (task, type) => `Task ${task} · ${String(type).replace(/-/g, " ")}`,
    wtWritePh: "Write your answer here (optional), then reveal the model answer to compare.",
    wtShowModel: "Show model answers (Band 6–9)",
    wtHideModel: "Hide model answers",
    wtModelHeading: "Model answer",
    wtFeatures: "Why this scores Band 9",
    wtBand: "Band",
    wtBandModel: (b) => `Band ${b} model answer`,
    wtBandWhy: (b) => `Why this is Band ${b}`,
    wtDisclaimer: "A model answer written to a Band-9 standard — a learning target, not an official examiner score.",
    wtBack: "Writing training",
    wtEmpty: "No modules yet.",
    streakLine: (n) => ` · ${n}-day streak`,
    reviewCta: (n) => `Review ${n} mistake${n === 1 ? "" : "s"}`,
    reviewCtaSub: "Retry what you missed — answer it right to clear it.",
    dashCard: "Progress dashboard",
    dashCardSub: "Accuracy, streak, weakest units, and backup.",
    dashKicker: "YOUR PROGRESS",
    dashTitle: "Progress dashboard",
    dashSub: "How you're tracking across every unit.",
    dashAccuracy: "Accuracy",
    dashAnswered: "Answered",
    dashStreak: "Day streak",
    dashBest: (n) => `best ${n}`,
    dashReviewBtn: (n) => `Review ${n} mistake${n === 1 ? "" : "s"}`,
    dashReviewEmpty: "No mistakes to review — nice.",
    dashWeakest: "Weakest units",
    dashWeakestSub: "Lowest accuracy so far — a good place to revise.",
    dashMastery: "Unit mastery",
    dashNoStats: "Answer some practice questions to build your stats.",
    dashAcc: (c, a) => `${c}/${a} correct`,
    dashBackup: "Backup & restore",
    dashBackupSub: "Save your progress to a file, or load it on another device. Everything stays on your device.",
    dashExport: "Export progress",
    dashImport: "Import progress",
    dashImportOk: "Progress restored.",
    dashImportErr: "That file couldn't be read. Use a backup exported from this app.",
    reviewTitle: "Review mistakes",
    reviewEmpty: "Nothing to review",
    reviewEmptySub: "You have no missed questions right now. Practice a unit and any you miss will show up here.",
    reviewBackHome: "Home",
  },
  id: {
    heroTitle: "Kuasai aturannya, raih Band 7",
    heroSub: (n) => `Latihan tata bahasa interaktif — ${UNITS.length} unit dan ${n} soal latihan.`,
    statsLine: (p, m) => `${p}/${UNITS.length} unit dipelajari · ${m} dikuasai (80%+)`,
    lastEssay: (b) => ` · esai terakhir ${b}`,
    writingTitle: "Writing Lab",
    writingSub: "Tulis esai Task 2 dengan waktu ujian, lalu dapatkan estimasi band AI dengan umpan balik yang terhubung ke unit-unit ini.",
    unitsHeader: "Unit tata bahasa",
    unitsHint: "Pelajari, lalu latihan",
    newLabel: "Baru",
    footer: `Aplikasi belajar tata bahasa IELTS untuk pribadi — ${UNITS.length} unit aturan dan latihan soal terarah. Progres tersimpan di perangkat ini.`,
    allUnits: "Semua unit",
    learnTab: "Materi",
    practiceTab: "Latihan",
    practiceBtn: "Latihan unit ini",
    deckCore: "Latihan inti",
    deckCoreSub: "Soal terarah untuk aturan tiap unit, dengan penjelasan di setiap jawaban.",
    deckCtx: "Latihan konteks",
    deckCtxSub: "Konteks sehari-hari yang lebih panjang dengan kosakata umum (level Oxford 3000).",
    deckExtra: (n) => `Latihan tambahan ${n}`,
    deckExtraSub: "Satu set tetap soal level Oxford 3000 untuk dikerjakan.",
    qWord: "soal",
    best: "Terbaik",
    qOf: (i, n) => `Soal ${i} dari ${n}`,
    correct: "benar",
    correctAnswer: "Jawaban benar:",
    next: "Soal berikutnya",
    seeResults: "Lihat hasil",
    tryAgain: "Coba lagi",
    backToDecks: "Kembali ke latihan",
    msg90: "Luar biasa — sudah level Band 7!",
    msg70: "Bagus. Tinjau lagi soal yang salah.",
    msg50: "Awal yang baik — baca ulang tab Materi lalu coba lagi.",
    msg0: "Pelajari dulu tab Materi, lalu ulangi.",
    home: "Beranda",
    wlKicker: "WRITING TASK 2 · 40 MENIT · 250+ KATA",
    wlSub: "Pilih soal, tulis dalam kondisi ujian, lalu dapatkan estimasi band dari AI.",
    examNote: "Soal ditampilkan dalam bahasa Inggris, sama seperti ujian aslinya.",
    customOpen: "+ Pakai soal Task 2 Anda sendiri",
    customPh: "Tempel atau ketik soal Task 2…",
    customTitle: "Soal sendiri",
    customBtn: "Tulis dari soal ini",
    recent: "Esai terakhir",
    words: "kata",
    aim: " · targetkan 250+",
    tStart: " · mulai",
    tPaused: " · jeda",
    timeUp: "Waktu habis — di ujian asli Anda berhenti di sini, tetapi di sini boleh lanjut menulis.",
    scoreErr: "Hasil penilaian tidak terbaca. Esai Anda masih tersimpan — coba lagi sebentar lagi.",
    submitLow: "Tulis minimal 40 kata",
    submit: "Dapatkan estimasi band",
    under250: "Di bawah 250 kata — penguji sungguhan memberi penalti untuk esai pendek, begitu juga estimasi ini.",
    gradingTitle: "Sedang memeriksa esai Anda…",
    gradingSub: "Mengecek task response, koherensi, kosakata, dan tata bahasa. Butuh beberapa detik.",
    questionsBack: "Daftar soal",
    estBand: "ESTIMASI BAND KESELURUHAN",
    workingWell: "Sudah baik",
    focusNext: "Fokus berikutnya",
    fixFirst: "Perbaiki ini dulu",
    review: (id, t) => `Pelajari Unit ${id} · ${t}`,
    disclaimer: "Band ini estimasi AI berdasarkan deskriptor publik IELTS — bukan hasil resmi, dan skor penguji bersertifikat bisa berbeda.",
    another: "Tulis esai lain",
    backHome: "Kembali ke beranda",
    task2: "TASK 2",
    wlBack: "Writing Lab",
    wtHomeCard: "Latihan writing",
    wtHomeCardSub: "Latihan Task 1 & Task 2 dengan jawaban model band 9.",
    wtKicker: "IELTS WRITING · TASK 1 & 2",
    wtTitle: "Latihan writing",
    wtSub: "Kerjakan satu soal, lalu buka jawaban model band 9 sebagai pembanding.",
    wtTask2: "TASK 2 — ESAI",
    wtTask1: "TASK 1 — GRAFIK, PROSES & PETA",
    wtType: (task, type) => `Task ${task} · ${String(type).replace(/-/g, " ")}`,
    wtWritePh: "Tulis jawaban Anda di sini (opsional), lalu buka jawaban model untuk membandingkan.",
    wtShowModel: "Tampilkan jawaban model (Band 6–9)",
    wtHideModel: "Sembunyikan jawaban model",
    wtModelHeading: "Jawaban model",
    wtFeatures: "Mengapa ini setara Band 9",
    wtBand: "Band",
    wtBandModel: (b) => `Jawaban model Band ${b}`,
    wtBandWhy: (b) => `Mengapa ini Band ${b}`,
    wtDisclaimer: "Jawaban model yang ditulis pada standar Band 9 — target belajar, bukan skor resmi penguji.",
    wtBack: "Latihan writing",
    wtEmpty: "Belum ada modul.",
    streakLine: (n) => ` · runtutan ${n} hari`,
    reviewCta: (n) => `Tinjau ${n} kesalahan`,
    reviewCtaSub: "Ulangi soal yang salah — jawab benar untuk menghapusnya.",
    dashCard: "Dasbor progres",
    dashCardSub: "Akurasi, runtutan, unit terlemah, dan cadangan.",
    dashKicker: "PROGRES ANDA",
    dashTitle: "Dasbor progres",
    dashSub: "Perkembangan Anda di seluruh unit.",
    dashAccuracy: "Akurasi",
    dashAnswered: "Dijawab",
    dashStreak: "Runtutan hari",
    dashBest: (n) => `terbaik ${n}`,
    dashReviewBtn: (n) => `Tinjau ${n} kesalahan`,
    dashReviewEmpty: "Tidak ada kesalahan untuk ditinjau — bagus.",
    dashWeakest: "Unit terlemah",
    dashWeakestSub: "Akurasi terendah sejauh ini — bagus untuk diulang.",
    dashMastery: "Penguasaan unit",
    dashNoStats: "Jawab beberapa soal latihan untuk membangun statistik Anda.",
    dashAcc: (c, a) => `${c}/${a} benar`,
    dashBackup: "Cadangkan & pulihkan",
    dashBackupSub: "Simpan progres ke file, atau muat di perangkat lain. Semua tetap di perangkat Anda.",
    dashExport: "Ekspor progres",
    dashImport: "Impor progres",
    dashImportOk: "Progres dipulihkan.",
    dashImportErr: "File tidak terbaca. Gunakan cadangan yang diekspor dari aplikasi ini.",
    reviewTitle: "Tinjau kesalahan",
    reviewEmpty: "Tidak ada yang ditinjau",
    reviewEmptySub: "Belum ada soal yang salah. Latih sebuah unit dan soal yang terlewat akan muncul di sini.",
    reviewBackHome: "Beranda",
  },
};

// ---------- UI atoms ----------
function Shell({ children }) {
  return (
    <div className="min-h-screen" style={{ background: C.paper, color: C.ink, ...body }}>
      <style>{FONT_CSS}</style>
      <div className="max-w-3xl mx-auto px-4 pb-16 pt-6">{children}</div>
    </div>
  );
}

function Btn({ children, onClick, disabled, tone = "blue", full }) {
  const bg = tone === "red" ? C.red : tone === "green" ? C.green : tone === "ghost" ? "transparent" : C.blue;
  const fg = tone === "ghost" ? C.blue : "#FFFFFF";
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold transition ${full ? "w-full" : ""}`}
      style={{ ...display, fontSize: 15, background: disabled ? C.line : bg, color: disabled ? C.sub : fg,
        border: tone === "ghost" ? `2px solid ${C.blue}` : "none", cursor: disabled ? "not-allowed" : "pointer" }}>
      {children}
    </button>
  );
}

function BackBar({ onBack, label }) {
  return (
    <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold mb-4" style={{ color: C.sub, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
      <ChevronLeft size={18} /> {label}
    </button>
  );
}

function MiniBar({ pct, color, track }) {
  return (
    <div className="w-full rounded-full" style={{ height: 8, background: track || C.line }}>
      <div className="rounded-full" style={{ height: 8, width: `${Math.min(100, Math.max(0, pct))}%`, background: color || C.blue, transition: "width .5s ease" }} />
    </div>
  );
}

function LangToggle({ lang, setLang }) {
  return (
    <div className="inline-flex rounded-full p-1" style={{ background: C.card, border: `1px solid ${C.line}` }}>
      {["en", "id"].map(l => (
        <button key={l} onClick={() => setLang(l)} className="rounded-full px-3 py-1 text-xs font-bold uppercase transition"
          style={{ ...display, background: lang === l ? C.blue : "transparent", color: lang === l ? "#fff" : C.sub, border: "none", cursor: "pointer" }}>
          {l === "en" ? "EN" : "ID"}
        </button>
      ))}
    </div>
  );
}

// ---------- Home ----------
function unitPct(progress, id) {
  const list = [progress[id], progress["x" + id]].filter(Boolean).map(p => Math.round((p.best / p.total) * 100));
  return list.length ? Math.max(...list) : null;
}

function HomeScreen({ progress, history, mistakes, stats, quiz3, openUnit, openWriting, openTraining, openDashboard, openReview, lang }) {
  const tr = T[lang];
  const practiced = UNITS.filter(u => progress[u.id] || progress["x" + u.id]).length;
  const mastered = UNITS.filter(u => { const p = unitPct(progress, u.id); return p !== null && p >= 80; }).length;
  const totalQ = UNITS.reduce((n, u) => n + u.quiz.length + ((QUIZ2[u.id] || []).length) + (((quiz3 && quiz3[u.id]) || []).length), 0);
  const last = history[0];
  const mistN = Array.isArray(mistakes) ? mistakes.length : 0;
  const streak = (stats && stats.streak) || 0;
  return (
    <div>
      <div className="rounded-3xl overflow-hidden mb-5 flex" style={{ background: C.blue }}>
        <div style={{ width: 14, background: C.red, flexShrink: 0 }} />
        <div className="p-6 sm:p-8 text-white flex-1">
          <div className="text-xs font-bold mb-1" style={{ color: "#BFC7FF", letterSpacing: "0.16em" }}>IELTS GRAMMAR STUDIO</div>
          <h1 style={{ ...display, fontSize: 34, fontWeight: 800, lineHeight: 1.05 }}>{tr.heroTitle}</h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "#DDE1FF" }}>{tr.heroSub(totalQ)}</p>
          <div className="mt-4">
            <MiniBar pct={(practiced / UNITS.length) * 100} color="#FFFFFF" track="rgba(255,255,255,0.25)" />
            <div className="mt-2 text-xs font-semibold" style={{ color: "#DDE1FF" }}>
              {tr.statsLine(practiced, mastered)}{streak > 0 ? tr.streakLine(streak) : ""}{last && typeof last.overall === "number" ? tr.lastEssay(bandStr(last.overall)) : ""}
            </div>
          </div>
        </div>
      </div>

      {mistN > 0 && (
        <button onClick={openReview} className="w-full text-left rounded-2xl mb-3 flex items-center gap-3 p-4" style={{ background: C.redWash, border: `1px solid ${C.red}`, cursor: "pointer" }}>
          <div className="rounded-2xl flex items-center justify-center" style={{ width: 42, height: 42, background: "#fff", color: C.red, flexShrink: 0 }}>
            <RotateCcw size={20} />
          </div>
          <div className="flex-1">
            <div style={{ ...display, fontWeight: 700, fontSize: 16, color: C.red }}>{tr.reviewCta(mistN)}</div>
            <div className="text-xs leading-relaxed" style={{ color: "#A32530" }}>{tr.reviewCtaSub}</div>
          </div>
          <ArrowRight size={18} style={{ color: C.red, flexShrink: 0 }} />
        </button>
      )}

      <button onClick={openDashboard} className="w-full text-left rounded-3xl mb-5 flex overflow-hidden" style={{ background: C.card, border: `1px solid ${C.line}`, cursor: "pointer", padding: 0 }}>
        <div style={{ width: 8, background: C.blue, flexShrink: 0 }} />
        <div className="p-5 flex-1 flex items-center gap-4">
          <div className="rounded-2xl flex items-center justify-center" style={{ width: 48, height: 48, background: C.blueWash, color: C.blue, flexShrink: 0 }}>
            <BarChart3 size={22} />
          </div>
          <div className="flex-1">
            <div style={{ ...display, fontWeight: 700, fontSize: 18 }}>{tr.dashCard}</div>
            <div className="text-sm leading-relaxed" style={{ color: C.sub }}>{tr.dashCardSub}</div>
          </div>
          <ArrowRight size={20} style={{ color: C.blue, flexShrink: 0 }} />
        </div>
      </button>

      {AI_ENABLED && (
      <button onClick={openWriting} className="w-full text-left rounded-3xl mb-5 flex overflow-hidden" style={{ background: C.card, border: `1px solid ${C.line}`, cursor: "pointer", padding: 0 }}>
        <div style={{ width: 8, background: C.red, flexShrink: 0 }} />
        <div className="p-5 flex-1 flex items-center gap-4">
          <div className="rounded-2xl flex items-center justify-center" style={{ width: 48, height: 48, background: C.redWash, color: C.red, flexShrink: 0 }}>
            <PenLine size={22} />
          </div>
          <div className="flex-1">
            <div style={{ ...display, fontWeight: 700, fontSize: 18 }}>{tr.writingTitle}</div>
            <div className="text-sm leading-relaxed" style={{ color: C.sub }}>{tr.writingSub}</div>
          </div>
          <ArrowRight size={20} style={{ color: C.red, flexShrink: 0 }} />
        </div>
      </button>
      )}

      <button onClick={openTraining} className="w-full text-left rounded-3xl mb-5 flex overflow-hidden" style={{ background: C.card, border: `1px solid ${C.line}`, cursor: "pointer", padding: 0 }}>
        <div style={{ width: 8, background: C.green, flexShrink: 0 }} />
        <div className="p-5 flex-1 flex items-center gap-4">
          <div className="rounded-2xl flex items-center justify-center" style={{ width: 48, height: 48, background: C.greenWash, color: C.green, flexShrink: 0 }}>
            <PenLine size={22} />
          </div>
          <div className="flex-1">
            <div style={{ ...display, fontWeight: 700, fontSize: 18 }}>{tr.wtHomeCard}</div>
            <div className="text-sm leading-relaxed" style={{ color: C.sub }}>{tr.wtHomeCardSub}</div>
          </div>
          <ArrowRight size={20} style={{ color: C.green, flexShrink: 0 }} />
        </div>
      </button>

      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2" style={{ ...display, fontSize: 22, fontWeight: 800 }}>
          <BookOpen size={20} style={{ color: C.blue }} /> {tr.unitsHeader}
        </h2>
        <span className="text-xs font-semibold" style={{ color: C.sub }}>{tr.unitsHint}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {UNITS.map(u => {
          const pct = unitPct(progress, u.id);
          const good = pct !== null && pct >= 80;
          return (
            <button key={u.id} onClick={() => openUnit(u.id)} className="text-left rounded-2xl p-4 transition" style={{ background: C.card, border: `1px solid ${C.line}`, cursor: "pointer" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="rounded-md px-2 py-0.5 text-xs font-bold text-white" style={{ ...display, background: C.red }}>Unit {u.id}</span>
                {pct === null
                  ? <span className="text-xs font-semibold" style={{ color: C.sub }}>{tr.newLabel}</span>
                  : <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: good ? C.greenWash : C.amberWash, color: good ? C.green : C.amber }}>{pct}%</span>}
              </div>
              <div style={{ ...display, fontWeight: 700, fontSize: 16, lineHeight: 1.15 }}>{u.title}</div>
              <div className="text-xs mt-1 leading-relaxed" style={{ color: C.sub }}>{lang === "id" ? (TAG_ID[u.id] || u.tag) : u.tag}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center text-xs leading-relaxed" style={{ color: C.sub }}>{tr.footer}</div>
    </div>
  );
}

// ---------- Unit: Learn + Practice ----------
function LearnTab({ unit, onPractice, lang }) {
  const tr = T[lang];
  const sums = LEARN_ID[unit.id] || [];
  return (
    <div className="flex flex-col gap-3">
      {unit.learn.map((s, i) => (
        <div key={i} className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          <div style={{ ...display, fontWeight: 700, fontSize: 16, color: C.blue }}>{s.h}</div>
          {lang === "id" && sums[i] && (
            <div className="text-sm mt-1 mb-1 leading-relaxed" style={{ color: C.blueDark, fontStyle: "italic" }}>{sums[i]}</div>
          )}
          <ul className="flex flex-col gap-2 mt-2" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {s.b.map((line, j) => (
              <li key={j} className="flex gap-2 text-sm leading-relaxed">
                <span className="rounded-full" style={{ width: 6, height: 6, background: C.red, flexShrink: 0, marginTop: 7 }} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Btn onClick={onPractice} full>{tr.practiceBtn} <ArrowRight size={16} /></Btn>
    </div>
  );
}

function Quiz({ list, unitId, isCtx, lang, onScore, onItem, onRestart, onExit }) {
  const tr = T[lang];
  // Snapshot + shuffle options once per mount; re-mount (new key) reshuffles.
  const [items] = useState(() => list.map(shuffleQuestion));
  const [i, setI] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const total = items.length;
  const q = items[i];

  const pick = (idx) => {
    if (sel !== null) return;
    setSel(idx);
    const ok = idx === q.a;
    if (ok) setScore(s => s + 1);
    if (onItem) onItem(i, ok);
  };
  const next = () => {
    if (i + 1 < total) { setI(i + 1); setSel(null); }
    else { setDone(true); onScore(score, total); }
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    const msg = pct >= 90 ? tr.msg90 : pct >= 70 ? tr.msg70 : pct >= 50 ? tr.msg50 : tr.msg0;
    return (
      <div className="rounded-2xl p-6 text-center" style={{ background: C.card, border: `1px solid ${C.line}` }}>
        <div className="mx-auto mb-3 rounded-full flex items-center justify-center" style={{ width: 64, height: 64, background: pct >= 70 ? C.greenWash : C.amberWash, color: pct >= 70 ? C.green : C.amber }}>
          <Trophy size={28} />
        </div>
        <div style={{ ...display, fontWeight: 800, fontSize: 30 }}>{score} / {total}</div>
        <p className="text-sm mt-1 mb-5" style={{ color: C.sub }}>{msg}</p>
        <div className="flex flex-col gap-2">
          <Btn onClick={onRestart} full><RotateCcw size={16} /> {tr.tryAgain}</Btn>
          <Btn tone="ghost" onClick={onExit} full>{tr.backToDecks}</Btn>
        </div>
      </div>
    );
  }

  const exText = lang === "id"
    ? (isCtx ? (q.exId || q.ex) : (EX_ID[unitId + "-" + i] || q.ex))
    : q.ex;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs font-semibold" style={{ color: C.sub }}>
        <span>{tr.qOf(i + 1, total)}</span>
        <span>{score} {tr.correct}</span>
      </div>
      <MiniBar pct={(i / total) * 100} />
      <div className="rounded-2xl p-5 mt-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
        <div className="text-base font-medium leading-relaxed mb-4">{q.q}</div>
        <div className="flex flex-col gap-2">
          {q.opts.map((o, idx) => {
            const isC = sel !== null && idx === q.a;
            const isW = sel !== null && idx === sel && sel !== q.a;
            return (
              <button key={idx} onClick={() => pick(idx)}
                className="w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition flex items-center justify-between gap-2"
                style={{ background: isC ? C.greenWash : isW ? C.redWash : C.card,
                  border: `2px solid ${isC ? C.green : isW ? C.red : C.line}`,
                  color: isC ? C.green : isW ? C.red : C.ink,
                  cursor: sel === null ? "pointer" : "default" }}>
                <span>{o}</span>
                {isC && <Check size={18} style={{ flexShrink: 0 }} />}
                {isW && <X size={18} style={{ flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
        {sel !== null && (
          <div className="rounded-xl p-3 mt-4 flex gap-2 text-sm leading-relaxed" style={{ background: C.blueWash, color: C.blueDark }}>
            <Lightbulb size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{sel === q.a ? "" : `${tr.correctAnswer} ${q.opts[q.a]}. `}{exText}</span>
          </div>
        )}
        {sel !== null && (
          <div className="mt-4">
            <Btn onClick={next} full>{i + 1 < total ? tr.next : tr.seeResults} <ArrowRight size={16} /></Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function PracticeTab({ unit, progress, onScore, onRecord, quiz3, lang }) {
  const tr = T[lang];
  const [deck, setDeck] = useState(null);
  const [session, setSession] = useState(1);
  const ctxList = QUIZ2[unit.id] || [];
  const extraPool = (quiz3 && quiz3[unit.id]) || [];
  const extraDecks = [];
  for (let k = 0; k * EXTRA_ROUND < extraPool.length; k++) {
    extraDecks.push({
      key: `e${unit.id}_${k}`,
      list: extraPool.slice(k * EXTRA_ROUND, k * EXTRA_ROUND + EXTRA_ROUND),
      isCtx: true, title: tr.deckExtra(k + 1), sub: tr.deckExtraSub,
      icon: <Layers size={22} />, wash: C.greenWash, color: C.green,
    });
  }

  if (!deck) {
    const decks = [
      { key: unit.id, list: unit.quiz, isCtx: false, title: tr.deckCore, sub: tr.deckCoreSub, icon: <Play size={22} />, wash: C.blueWash, color: C.blue },
      { key: "x" + unit.id, list: ctxList, isCtx: true, title: tr.deckCtx, sub: tr.deckCtxSub, icon: <Sparkles size={22} />, wash: C.redWash, color: C.red },
      ...extraDecks,
    ].filter(d => d.list.length > 0);
    return (
      <div className="flex flex-col gap-3">
        {decks.map(d => {
          const p = progress[d.key];
          return (
            <button key={d.key} onClick={() => { setDeck(d); setSession(s => s + 1); }} className="text-left rounded-2xl p-4 flex items-center gap-4" style={{ background: C.card, border: `1px solid ${C.line}`, cursor: "pointer" }}>
              <div className="rounded-2xl flex items-center justify-center" style={{ width: 48, height: 48, background: d.wash, color: d.color, flexShrink: 0 }}>{d.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span style={{ ...display, fontWeight: 700, fontSize: 16 }}>{d.title}</span>
                  <span className="text-xs font-bold" style={{ color: d.color }}>{d.list.length} {tr.qWord}</span>
                </div>
                <div className="text-xs mt-0.5 leading-relaxed" style={{ color: C.sub }}>{d.sub}</div>
                {p && <div className="text-xs mt-1 font-bold" style={{ color: C.green }}>{tr.best}: {p.best}/{p.total}</div>}
              </div>
              <ArrowRight size={18} style={{ color: d.color, flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <Quiz key={deck.key + "-" + session} list={deck.list} unitId={unit.id} isCtx={deck.isCtx} lang={lang}
      onScore={(s, t) => onScore(deck.key, s, t)}
      onItem={(idx, ok) => onRecord && onRecord(buildRec(unit.id, deck.isCtx, deck.list[idx], idx), ok)}
      onRestart={() => setSession(s => s + 1)}
      onExit={() => setDeck(null)} />
  );
}

function UnitScreen({ unit, progress, onScore, onRecord, quiz3, onBack, lang }) {
  const tr = T[lang];
  const [tab, setTab] = useState("learn");
  return (
    <div>
      <BackBar onBack={onBack} label={tr.allUnits} />
      <div className="rounded-3xl overflow-hidden mb-4 flex" style={{ background: C.blue }}>
        <div style={{ width: 10, background: C.red, flexShrink: 0 }} />
        <div className="p-5 text-white flex-1">
          <div className="text-xs font-bold" style={{ color: "#BFC7FF", letterSpacing: "0.14em" }}>UNIT {unit.id}</div>
          <div style={{ ...display, fontSize: 26, fontWeight: 800 }}>{unit.title}</div>
          <div className="text-sm" style={{ color: "#DDE1FF" }}>{lang === "id" ? (TAG_ID[unit.id] || unit.tag) : unit.tag}</div>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab("learn")} className="flex-1 rounded-full py-2.5 text-sm font-bold transition"
          style={{ ...display, background: tab === "learn" ? C.blue : C.card, color: tab === "learn" ? "#fff" : C.sub, border: `1px solid ${tab === "learn" ? C.blue : C.line}`, cursor: "pointer" }}>{tr.learnTab}</button>
        <button onClick={() => setTab("practice")} className="flex-1 rounded-full py-2.5 text-sm font-bold transition"
          style={{ ...display, background: tab === "practice" ? C.blue : C.card, color: tab === "practice" ? "#fff" : C.sub, border: `1px solid ${tab === "practice" ? C.blue : C.line}`, cursor: "pointer" }}>{tr.practiceTab}</button>
      </div>
      {tab === "learn"
        ? <LearnTab unit={unit} onPractice={() => setTab("practice")} lang={lang} />
        : <PracticeTab unit={unit} progress={progress} onScore={onScore} onRecord={onRecord} quiz3={quiz3} lang={lang} />}
    </div>
  );
}

// ---------- Writing Lab ----------
function WritingLab({ onBack, onSave, history, goUnit, lang }) {
  const tr = T[lang];
  const [phase, setPhase] = useState("pick");
  const [promptSel, setPromptSel] = useState(null);
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [essay, setEssay] = useState("");
  const [secs, setSecs] = useState(40 * 60);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSecs(s => { if (s <= 1) { setRunning(false); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [running]);

  const wc = countWords(essay);
  const start = (p) => { setPromptSel(p); setPhase("write"); setEssay(""); setSecs(40 * 60); setRunning(false); setErr(null); };

  const submit = async () => {
    setPhase("grading"); setErr(null); setRunning(false);
    try {
      const r = await scoreEssay(promptSel.text, essay, lang);
      setResult(r);
      setPhase("result");
      onSave({ date: Date.now(), title: promptSel.title, words: wc, overall: r.overall });
    } catch (e) {
      setErr(tr.scoreErr);
      setPhase("write");
    }
  };

  if (phase === "pick") {
    return (
      <div>
        <BackBar onBack={onBack} label={tr.home} />
        <div className="rounded-3xl overflow-hidden mb-4 flex" style={{ background: C.red }}>
          <div style={{ width: 10, background: C.blue, flexShrink: 0 }} />
          <div className="p-5 text-white flex-1">
            <div className="text-xs font-bold" style={{ color: "#FFD3D8", letterSpacing: "0.14em" }}>{tr.wlKicker}</div>
            <div style={{ ...display, fontSize: 26, fontWeight: 800 }}>{tr.writingTitle}</div>
            <div className="text-sm leading-relaxed" style={{ color: "#FFE3E6" }}>{tr.wlSub}</div>
            {lang === "id" && <div className="text-xs mt-1" style={{ color: "#FFD3D8" }}>{tr.examNote}</div>}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {WRITING_PROMPTS.map(p => (
            <button key={p.id} onClick={() => start(p)} className="text-left rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.line}`, cursor: "pointer" }}>
              <div className="flex items-center justify-between">
                <span style={{ ...display, fontWeight: 700, fontSize: 16 }}>{p.title}</span>
                <ArrowRight size={16} style={{ color: C.red, flexShrink: 0 }} />
              </div>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: C.sub }}>{p.text}</p>
            </button>
          ))}
          <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px dashed ${C.sub}` }}>
            {!showCustom ? (
              <button onClick={() => setShowCustom(true)} className="w-full text-left text-sm font-bold" style={{ color: C.blue, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                {tr.customOpen}
              </button>
            ) : (
              <div>
                <textarea value={custom} onChange={e => setCustom(e.target.value)} rows={3} placeholder={tr.customPh}
                  className="w-full rounded-xl p-3 text-sm outline-none resize-none" style={{ border: `1px solid ${C.line}`, background: C.paper, ...body }} />
                <div className="mt-2"><Btn disabled={!custom.trim()} onClick={() => start({ title: tr.customTitle, text: custom.trim() })} full>{tr.customBtn}</Btn></div>
              </div>
            )}
          </div>
          {history.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
              <div className="flex items-center gap-2 mb-2 text-sm font-bold" style={{ ...display }}>
                <History size={16} style={{ color: C.blue }} /> {tr.recent}
              </div>
              {history.slice(0, 3).map((h, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 text-sm" style={{ borderTop: i ? `1px solid ${C.line}` : "none", color: C.sub }}>
                  <span>{h.title} · {h.words} {tr.words}</span>
                  <span className="font-bold" style={{ color: C.blue }}>{bandStr(h.overall)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "write") {
    return (
      <div>
        <BackBar onBack={() => setPhase("pick")} label={tr.questionsBack} />
        <div className="rounded-2xl p-4 mb-3" style={{ background: C.blueWash, border: `1px solid ${C.line}` }}>
          <div className="text-xs font-bold mb-1" style={{ color: C.blue, letterSpacing: "0.1em" }}>{tr.task2} · {promptSel.title.toUpperCase()}</div>
          <p className="text-sm leading-relaxed">{promptSel.text}</p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold" style={{ color: wc >= 250 ? C.green : wc > 0 ? C.amber : C.sub }}>
            {wc} {tr.words}{wc >= 250 ? " ✓" : tr.aim}
          </span>
          <button onClick={() => setRunning(r => !r)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold"
            style={{ background: secs <= 300 ? C.redWash : C.card, color: secs <= 300 ? C.red : C.ink, border: `1px solid ${C.line}`, cursor: "pointer" }}>
            <Clock size={15} /> {fmtTime(secs)}{running ? "" : secs === 40 * 60 ? tr.tStart : tr.tPaused}
          </button>
        </div>
        <textarea value={essay} onChange={e => setEssay(e.target.value)} rows={14}
          placeholder={lang === "id" ? "Tulis esai Anda di sini (dalam bahasa Inggris). Buka dengan posisi Anda, kembangkan dua paragraf isi dengan contoh, lalu tutup dengan simpulan yang jelas." : "Write your essay here. Introduce your position, develop two body paragraphs with examples, and finish with a clear conclusion."}
          className="w-full rounded-2xl p-4 text-base leading-relaxed outline-none resize-none"
          style={{ border: `1px solid ${C.line}`, background: C.card, ...body }} />
        {secs === 0 && <div className="mt-2 text-sm font-semibold" style={{ color: C.red }}>{tr.timeUp}</div>}
        {err && (
          <div className="mt-2 rounded-xl p-3 text-sm flex gap-2 leading-relaxed" style={{ background: C.redWash, color: C.red }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> <span>{err}</span>
          </div>
        )}
        <div className="mt-3">
          <Btn tone="red" disabled={wc < 40} onClick={submit} full>
            <Sparkles size={16} /> {wc < 40 ? tr.submitLow : tr.submit}
          </Btn>
        </div>
        {wc >= 40 && wc < 250 && (
          <p className="mt-2 text-xs text-center leading-relaxed" style={{ color: C.sub }}>{tr.under250}</p>
        )}
      </div>
    );
  }

  if (phase === "grading") {
    return (
      <div className="rounded-2xl p-10 text-center" style={{ background: C.card, border: `1px solid ${C.line}` }}>
        <Loader2 size={36} className="animate-spin mx-auto mb-4" style={{ color: C.red }} />
        <div style={{ ...display, fontWeight: 800, fontSize: 20 }}>{tr.gradingTitle}</div>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: C.sub }}>{tr.gradingSub}</p>
      </div>
    );
  }

  const r = result || {};
  return (
    <div>
      <BackBar onBack={() => setPhase("pick")} label={tr.wlBack} />
      <div className="rounded-3xl overflow-hidden mb-4 flex" style={{ background: C.red }}>
        <div style={{ width: 10, background: C.blue, flexShrink: 0 }} />
        <div className="p-5 text-white flex-1 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold" style={{ color: "#FFD3D8", letterSpacing: "0.14em" }}>{tr.estBand}</div>
            <div style={{ ...display, fontSize: 46, fontWeight: 800, lineHeight: 1.05 }}>{bandStr(r.overall)}</div>
            <div className="text-xs mt-1" style={{ color: "#FFE3E6" }}>{promptSel ? promptSel.title : ""} · {wc} {tr.words}</div>
          </div>
          <Trophy size={40} style={{ color: "#FFD3D8", flexShrink: 0 }} />
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
        {CRIT.map(([k, label], i) => {
          const cr = r[k] || {};
          return (
            <div key={k} className="py-2" style={{ borderTop: i ? `1px solid ${C.line}` : "none" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold">{label}</span>
                <span className="text-sm font-bold" style={{ color: C.blue }}>{bandStr(cr.band)}</span>
              </div>
              <MiniBar pct={typeof cr.band === "number" ? (cr.band / 9) * 100 : 0} />
              {cr.comment && <p className="text-xs mt-1.5 leading-relaxed" style={{ color: C.sub }}>{cr.comment}</p>}
            </div>
          );
        })}
      </div>

      {((r.strengths && r.strengths.length > 0) || (r.improvements && r.improvements.length > 0)) && (
        <div className="rounded-2xl p-4 mb-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          {r.strengths && r.strengths.length > 0 && (
            <div className="mb-3">
              <div className="text-sm font-bold mb-1.5" style={{ ...display, color: C.green }}>{tr.workingWell}</div>
              {r.strengths.map((s2, i) => (
                <div key={i} className="flex gap-2 text-sm py-0.5 leading-relaxed">
                  <Check size={16} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} /><span>{s2}</span>
                </div>
              ))}
            </div>
          )}
          {r.improvements && r.improvements.length > 0 && (
            <div>
              <div className="text-sm font-bold mb-1.5" style={{ ...display, color: C.amber }}>{tr.focusNext}</div>
              {r.improvements.map((s2, i) => (
                <div key={i} className="flex gap-2 text-sm py-0.5 leading-relaxed">
                  <ArrowRight size={16} style={{ color: C.amber, flexShrink: 0, marginTop: 2 }} /><span>{s2}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {Array.isArray(r.errors) && r.errors.length > 0 && (
        <div className="rounded-2xl p-4 mb-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          <div className="text-sm font-bold mb-2" style={{ ...display }}>{tr.fixFirst}</div>
          <div className="flex flex-col gap-3">
            {r.errors.map((e2, i) => {
              const u = e2 && e2.unit ? UNITS.find(x => x.id === e2.unit) : null;
              return (
                <div key={i} className="rounded-xl p-3" style={{ background: C.paper }}>
                  <div className="text-sm" style={{ color: C.red, textDecoration: "line-through" }}>{e2.original}</div>
                  <div className="text-sm font-semibold" style={{ color: C.green }}>→ {e2.fixed}</div>
                  {e2.rule && <div className="text-xs mt-1" style={{ color: C.sub }}>{e2.rule}</div>}
                  {u && (
                    <button onClick={() => goUnit(u.id)} className="mt-2 rounded-full px-3 py-1 text-xs font-bold"
                      style={{ background: C.blueWash, color: C.blue, border: "none", cursor: "pointer" }}>
                      {tr.review(u.id, u.title)}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl p-3 mb-4 flex gap-2 text-xs leading-relaxed" style={{ background: C.amberWash, color: "#8A5A08" }}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>{tr.disclaimer}</span>
      </div>

      <div className="flex flex-col gap-2">
        <Btn tone="red" onClick={() => setPhase("pick")} full><PenLine size={16} /> {tr.another}</Btn>
        <Btn tone="ghost" onClick={onBack} full>{tr.backHome}</Btn>
      </div>
    </div>
  );
}

// ---------- Writing training ----------
// Colorblind-safe (Okabe-Ito) categorical palette; identity is reinforced with
// legends and direct value labels so it never relies on colour alone.
const CHART_C = ["#0072B2", "#E69F00", "#009E73", "#D55E00", "#CC79A7"];

function ChartLegend({ items }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 text-xs" style={{ color: C.sub }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: it.color, flexShrink: 0 }} /> {it.name}
        </span>
      ))}
    </div>
  );
}

function BarChart({ visual }) {
  const xLabels = visual.xLabels || [], series = visual.series || [];
  const max = Math.max(1, ...series.flatMap(s => s.values || []));
  const W = 340, H = 190, padL = 26, padB = 34, padT = 12, padR = 10;
  const plotW = W - padL - padR, plotH = H - padT - padB, ticks = 4;
  const groups = xLabels.length || 1, sn = series.length || 1;
  const gGap = 12, groupW = (plotW - gGap * groups) / groups, barW = Math.max(4, groupW / sn - 2);
  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 280, maxWidth: 560 }} role="img" aria-label="bar chart">
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const v = (max / ticks) * i, y = padT + plotH - (v / max) * plotH;
          return (<g key={i}><line x1={padL} y1={y} x2={W - padR} y2={y} stroke={C.line} strokeWidth="1" /><text x={padL - 3} y={y + 3} textAnchor="end" fontSize="7.5" fill={C.sub}>{Math.round(v)}</text></g>);
        })}
        {xLabels.map((lab, gi) => {
          const gx = padL + gGap / 2 + gi * (groupW + gGap);
          return (
            <g key={gi}>
              {series.map((s, si) => {
                const v = (s.values || [])[gi] || 0, h = (v / max) * plotH, x = gx + si * (barW + 2), y = padT + plotH - h;
                return (<g key={si}><rect x={x} y={y} width={barW} height={h} rx="2" fill={CHART_C[si % CHART_C.length]} /><text x={x + barW / 2} y={y - 2} textAnchor="middle" fontSize="7" fill={C.ink}>{v}</text></g>);
              })}
              <text x={gx + groupW / 2} y={H - padB + 13} textAnchor="middle" fontSize="8" fill={C.sub}>{lab}</text>
            </g>
          );
        })}
      </svg>
      {series.length > 1 && <ChartLegend items={series.map((s, i) => ({ name: s.name, color: CHART_C[i % CHART_C.length] }))} />}
      {visual.unit && <div className="text-xs text-center mt-1" style={{ color: C.sub }}>({visual.unit})</div>}
    </div>
  );
}

function LineChart({ visual }) {
  const xLabels = visual.xLabels || [], series = visual.series || [];
  const max = Math.max(1, ...series.flatMap(s => s.values || []));
  const W = 360, H = 200, padL = 28, padB = 30, padT = 12, padR = 58;
  const plotW = W - padL - padR, plotH = H - padT - padB, ticks = 4;
  const xAt = i => padL + (xLabels.length <= 1 ? plotW / 2 : (plotW * i) / (xLabels.length - 1));
  const yAt = v => padT + plotH - (v / max) * plotH;
  const dash = ["", "5 3", "2 3", "8 3 2 3", "1 4"];
  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 300, maxWidth: 600 }} role="img" aria-label="line graph">
        {Array.from({ length: ticks + 1 }).map((_, i) => { const v = (max / ticks) * i, y = yAt(v); return (<g key={i}><line x1={padL} y1={y} x2={W - padR} y2={y} stroke={C.line} /><text x={padL - 3} y={y + 3} textAnchor="end" fontSize="7.5" fill={C.sub}>{Math.round(v)}</text></g>); })}
        {xLabels.map((lab, i) => <text key={i} x={xAt(i)} y={H - padB + 13} textAnchor="middle" fontSize="8" fill={C.sub}>{lab}</text>)}
        {series.map((s, si) => {
          const col = CHART_C[si % CHART_C.length], vals = s.values || [];
          const pts = vals.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
          return (<g key={si}><polyline points={pts} fill="none" stroke={col} strokeWidth="2" strokeDasharray={dash[si % dash.length]} />{vals.map((v, i) => <circle key={i} cx={xAt(i)} cy={yAt(v)} r="2.6" fill={col} />)}<text x={xAt(vals.length - 1) + 4} y={yAt(vals[vals.length - 1]) + 3} fontSize="8" fill={col} fontWeight="700">{s.name}</text></g>);
        })}
      </svg>
      {visual.unit && <div className="text-xs text-center mt-1" style={{ color: C.sub }}>({visual.unit})</div>}
    </div>
  );
}

function PieSVG({ parts, title, size = 150 }) {
  const list = parts || [];
  const total = list.reduce((n, p) => n + (p.value || 0), 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  let a0 = -Math.PI / 2;
  const arcs = list.map((p, i) => {
    const a1 = a0 + ((p.value || 0) / total) * Math.PI * 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const large = (a1 - a0) > Math.PI ? 1 : 0, mid = (a0 + a1) / 2;
    const lx = cx + r * 0.62 * Math.cos(mid), ly = cy + r * 0.62 * Math.sin(mid);
    a0 = a1;
    return { d: `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} Z`, color: CHART_C[i % CHART_C.length], pct: Math.round(((p.value || 0) / total) * 100), lx, ly };
  });
  return (
    <div className="flex flex-col items-center">
      {title && <div className="text-xs font-bold mb-1" style={{ color: C.sub }}>{title}</div>}
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="pie chart">
        {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} stroke="#fff" strokeWidth="1.5" />)}
        {arcs.map((a, i) => a.pct >= 6 ? <text key={"t" + i} x={a.lx} y={a.ly + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">{a.pct}%</text> : null)}
      </svg>
    </div>
  );
}

const MAP_FILL = { build: "#9DB4D6", green: "#AFDCBE", park: "#7FCF9B", water: "#A9D3EC", road: "#CFCFD6", lot: "#F0D49A" };
function MapPanel({ panel }) {
  const W = 158, H = 148, SEA = 16;
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs font-bold mb-1" style={{ color: C.sub }}>{panel.title}</div>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ border: `1px solid ${C.line}`, borderRadius: 8, background: "#EEF2EA" }} role="img" aria-label={`map: ${panel.title}`}>
        <rect x="0" y="0" width={W} height={SEA} fill="#A9D3EC" />
        <text x="4" y="11" fontSize="7" fill="#33667f">Sea</text>
        {(panel.features || []).map((f, i) => {
          const x = (f.x / 100) * W, y = SEA + (f.y / 100) * (H - SEA), w = (f.w / 100) * W, h = (f.h / 100) * (H - SEA);
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} rx="2" fill={MAP_FILL[f.kind] || "#DDE1EA"} stroke="#ffffff" strokeWidth="1" />
              <text x={x + w / 2} y={y + h / 2 + 2} textAnchor="middle" fontSize="6" fill={C.ink}>{f.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Chart({ visual }) {
  if (!visual) return null;
  const k = visual.kind;
  if (k === "table") {
    return (
      <div style={{ overflowX: "auto" }}>
        <table className="text-sm" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead><tr>{(visual.headers || []).map((h, i) => <th key={i} className="px-2 py-1 text-left" style={{ borderBottom: `2px solid ${C.line}`, color: C.blue, fontWeight: 700 }}>{h}</th>)}</tr></thead>
          <tbody>{(visual.rows || []).map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci} className="px-2 py-1" style={{ borderBottom: `1px solid ${C.line}`, color: ci === 0 ? C.ink : C.sub }}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
  }
  if (k === "bar") return <BarChart visual={visual} />;
  if (k === "line") return <LineChart visual={visual} />;
  if (k === "pie") return (<div><div className="flex justify-center"><PieSVG parts={visual.parts} /></div><ChartLegend items={(visual.parts || []).map((p, i) => ({ name: `${p.label} — ${p.value}%`, color: CHART_C[i % CHART_C.length] }))} /></div>);
  if (k === "pies") return (<div><div className="flex flex-wrap gap-6 justify-center">{(visual.charts || []).map((c, ci) => <PieSVG key={ci} parts={c.parts} title={c.title} />)}</div><ChartLegend items={(((visual.charts || [])[0] || {}).parts || []).map((p, i) => ({ name: p.label, color: CHART_C[i % CHART_C.length] }))} /></div>);
  if (k === "process") return (
    <div className="flex flex-col">
      {(visual.steps || []).map((s, i) => (
        <div key={i}>
          <div className="rounded-xl px-3 py-2 flex gap-2 items-start" style={{ background: C.greenWash, border: `1px solid ${C.green}` }}>
            <span className="rounded-full text-white flex items-center justify-center" style={{ ...display, width: 20, height: 20, fontSize: 11, fontWeight: 700, background: C.green, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <span className="text-sm leading-snug">{s}</span>
          </div>
          {i < (visual.steps.length - 1) && <div style={{ textAlign: "center", color: C.green, fontSize: 16, lineHeight: 1.1 }}>↓</div>}
        </div>
      ))}
    </div>
  );
  if (k === "map") {
    if (visual.panels) return <div className="flex flex-wrap gap-4 justify-center">{visual.panels.map((p, i) => <MapPanel key={i} panel={p} />)}</div>;
    return <p className="text-sm leading-relaxed">{visual.desc}</p>;
  }
  return null;
}

function WritingTraining({ onBack, lang }) {
  const tr = T[lang];
  const [modules, setModules] = useState(null); // loaded on demand (code-split)
  const [mod, setMod] = useState(null);
  const [essay, setEssay] = useState("");
  const [show, setShow] = useState(false);
  const [band, setBand] = useState(9);
  const [secs, setSecs] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    let on = true;
    import("./content/writing.js").then(m => { if (on) setModules(m.WRITING_MODULES); }).catch(() => { if (on) setModules([]); });
    return () => { on = false; };
  }, []);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSecs(s => { if (s <= 1) { setRunning(false); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [running]);

  const open = (m) => { setMod(m); setEssay(""); setShow(false); setBand(9); setSecs(m.task === 1 ? 20 * 60 : 40 * 60); setRunning(false); };
  const close = () => { setMod(null); setEssay(""); setShow(false); setBand(9); setRunning(false); };

  if (!mod) {
    const all = modules || [];
    const t2 = all.filter(m => m.task === 2);
    const t1 = all.filter(m => m.task === 1);
    const Group = ({ title, list, color }) => (
      <div className="mb-5">
        <div className="text-xs font-bold mb-2" style={{ ...display, color, letterSpacing: "0.08em" }}>{title}</div>
        <div className="flex flex-col gap-2">
          {list.map(m => (
            <button key={m.id} onClick={() => open(m)} className="text-left rounded-2xl p-4 flex items-center gap-3" style={{ background: C.card, border: `1px solid ${C.line}`, cursor: "pointer" }}>
              <div className="flex-1">
                <div style={{ ...display, fontWeight: 700, fontSize: 15 }}>{m.title}</div>
                <div className="text-xs mt-0.5" style={{ color: C.sub }}>{tr.wtType(m.task, m.type)}</div>
              </div>
              <ArrowRight size={18} style={{ color, flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>
    );
    return (
      <div>
        <BackBar onBack={onBack} label={tr.home} />
        <div className="rounded-3xl overflow-hidden mb-4 flex" style={{ background: C.green }}>
          <div style={{ width: 10, background: C.blue, flexShrink: 0 }} />
          <div className="p-5 text-white flex-1">
            <div className="text-xs font-bold" style={{ color: "#CFEAD9", letterSpacing: "0.14em" }}>{tr.wtKicker}</div>
            <div style={{ ...display, fontSize: 24, fontWeight: 800 }}>{tr.wtTitle}</div>
            <div className="text-sm leading-relaxed" style={{ color: "#E6F5EC" }}>{tr.wtSub}</div>
          </div>
        </div>
        {t2.length > 0 && <Group title={tr.wtTask2} list={t2} color={C.blue} />}
        {t1.length > 0 && <Group title={tr.wtTask1} list={t1} color={C.red} />}
        {modules === null && <div className="flex justify-center mt-8" style={{ color: C.sub }}><Loader2 size={22} className="animate-spin" /></div>}
        {modules !== null && all.length === 0 && <div className="text-sm text-center mt-6" style={{ color: C.sub }}>{tr.wtEmpty}</div>}
      </div>
    );
  }

  const wc = countWords(essay);
  const bands = [6, 7, 8, 9];
  const ans = (mod.answers && mod.answers[band]) || { model: mod.model, words: mod.words, features: mod.features, featureId: mod.featureId };
  const paras = String(ans.model || "").split(/\n\n+/);
  const startSecs = mod.task === 1 ? 20 * 60 : 40 * 60;
  return (
    <div>
      <BackBar onBack={close} label={tr.wtBack} />
      <div className="rounded-2xl p-4 mb-3" style={{ background: C.blueWash, border: `1px solid ${C.line}` }}>
        <div className="text-xs font-bold mb-1" style={{ color: C.blue, letterSpacing: "0.1em" }}>{tr.wtType(mod.task, mod.type).toUpperCase()}</div>
        <p className="text-sm leading-relaxed">{mod.prompt}</p>
      </div>
      {mod.visual && (
        <div className="rounded-2xl p-4 mb-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          <Chart visual={mod.visual} />
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold" style={{ color: wc > 0 ? C.green : C.sub }}>{wc} {tr.words}</span>
        <button onClick={() => setRunning(r => !r)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold"
          style={{ background: secs > 0 && secs <= 60 ? C.redWash : C.card, color: secs > 0 && secs <= 60 ? C.red : C.ink, border: `1px solid ${C.line}`, cursor: "pointer" }}>
          <Clock size={15} /> {fmtTime(secs)}{running ? "" : secs === startSecs ? tr.tStart : tr.tPaused}
        </button>
      </div>
      <textarea value={essay} onChange={e => setEssay(e.target.value)} rows={10} placeholder={tr.wtWritePh}
        className="w-full rounded-2xl p-4 text-base leading-relaxed outline-none resize-none" style={{ border: `1px solid ${C.line}`, background: C.card, ...body }} />
      {!show ? (
        <div className="mt-3"><Btn tone="green" onClick={() => setShow(true)} full><Sparkles size={16} /> {tr.wtShowModel}</Btn></div>
      ) : (
        <div className="mt-3">
          <div className="flex gap-2 mb-3">
            {bands.map(bd => (
              <button key={bd} onClick={() => setBand(bd)} className="flex-1 rounded-full py-2 text-sm font-bold transition"
                style={{ ...display, background: band === bd ? C.green : C.card, color: band === bd ? "#fff" : C.sub, border: `1px solid ${band === bd ? C.green : C.line}`, cursor: "pointer" }}>
                {tr.wtBand} {bd}
              </button>
            ))}
          </div>
          <div className="rounded-2xl p-4 mb-3" style={{ background: C.greenWash, border: `1px solid ${C.green}` }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold" style={{ ...display, color: C.green }}>{tr.wtBandModel(band)}</div>
              <span className="text-xs font-bold" style={{ color: C.sub }}>{ans.words} {tr.words}</span>
            </div>
            {paras.map((p, i) => <p key={i} className="text-sm leading-relaxed mb-2" style={{ color: C.ink }}>{p}</p>)}
          </div>
          {ans.features && ans.features.length > 0 && (
            <div className="rounded-2xl p-4 mb-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
              <div className="text-sm font-bold mb-1.5" style={{ ...display }}>{tr.wtBandWhy(band)}</div>
              {ans.features.map((f, i) => <div key={i} className="flex gap-2 text-sm py-0.5 leading-relaxed"><Check size={16} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} /><span>{f}</span></div>)}
              {lang === "id" && ans.featureId && <div className="text-sm mt-2 leading-relaxed" style={{ color: C.blueDark, fontStyle: "italic" }}>{ans.featureId}</div>}
            </div>
          )}
          <div className="rounded-xl p-3 mb-3 flex gap-2 text-xs leading-relaxed" style={{ background: C.amberWash, color: "#8A5A08" }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} /><span>{tr.wtDisclaimer}</span>
          </div>
          <Btn tone="ghost" onClick={() => setShow(false)} full>{tr.wtHideModel}</Btn>
        </div>
      )}
    </div>
  );
}

// ---------- Progress dashboard ----------
function StatTile({ icon, label, value, sub, color, wash }) {
  return (
    <div className="rounded-2xl p-3 flex-1" style={{ background: C.card, border: `1px solid ${C.line}` }}>
      <div className="rounded-xl flex items-center justify-center mb-2" style={{ width: 34, height: 34, background: wash, color }}>{icon}</div>
      <div style={{ ...display, fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{value}</div>
      <div className="text-xs font-semibold mt-1" style={{ color: C.sub }}>{label}{sub ? ` · ${sub}` : ""}</div>
    </div>
  );
}

function Dashboard({ progress, mistakes, stats, openUnit, openReview, onExport, onImport, onBack, lang }) {
  const tr = T[lang];
  const [msg, setMsg] = useState(null);
  const fileRef = useRef(null);
  const st = stats || {};
  const answered = st.answered || 0;
  const correct = st.correct || 0;
  const acc = answered ? Math.round((correct / answered) * 100) : null;
  const streak = st.streak || 0;
  const best = st.best || 0;
  const byUnit = st.byUnit || {};
  const mistN = Array.isArray(mistakes) ? mistakes.length : 0;

  const unitRows = UNITS.map(u => {
    const b = byUnit[u.id];
    const a = b ? b.answered : 0;
    const c = b ? b.correct : 0;
    return { u, a, c, pct: a ? Math.round((c / a) * 100) : null };
  });
  const weakest = unitRows.filter(r => r.a >= 4).sort((x, y) => x.pct - y.pct).slice(0, 4);
  const practicedRows = unitRows.filter(r => r.a > 0);

  const doImport = (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    onImport(f, (ok) => setMsg(ok ? { ok: true, t: tr.dashImportOk } : { ok: false, t: tr.dashImportErr }));
  };

  return (
    <div>
      <BackBar onBack={onBack} label={tr.home} />
      <div className="rounded-3xl overflow-hidden mb-4 flex" style={{ background: C.blue }}>
        <div style={{ width: 10, background: C.red, flexShrink: 0 }} />
        <div className="p-5 text-white flex-1">
          <div className="text-xs font-bold" style={{ color: "#BFC7FF", letterSpacing: "0.14em" }}>{tr.dashKicker}</div>
          <div style={{ ...display, fontSize: 24, fontWeight: 800 }}>{tr.dashTitle}</div>
          <div className="text-sm leading-relaxed" style={{ color: "#DDE1FF" }}>{tr.dashSub}</div>
        </div>
      </div>

      {answered === 0 ? (
        <div className="rounded-2xl p-6 text-center text-sm" style={{ background: C.card, border: `1px solid ${C.line}`, color: C.sub }}>{tr.dashNoStats}</div>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            <StatTile icon={<Target size={18} />} label={tr.dashAccuracy} value={`${acc}%`} color={C.blue} wash={C.blueWash} />
            <StatTile icon={<BarChart3 size={18} />} label={tr.dashAnswered} value={answered} color={C.green} wash={C.greenWash} />
            <StatTile icon={<Flame size={18} />} label={tr.dashStreak} value={streak} sub={best > 0 ? tr.dashBest(best) : ""} color={C.amber} wash={C.amberWash} />
          </div>

          {weakest.length > 0 && (
            <div className="rounded-2xl p-4 mb-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
              <div style={{ ...display, fontWeight: 700, fontSize: 16 }}>{tr.dashWeakest}</div>
              <div className="text-xs mb-3 leading-relaxed" style={{ color: C.sub }}>{tr.dashWeakestSub}</div>
              <div className="flex flex-col gap-3">
                {weakest.map(r => (
                  <button key={r.u.id} onClick={() => openUnit(r.u.id)} className="text-left" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">{r.u.id}. {r.u.title}</span>
                      <span className="text-xs font-bold" style={{ color: r.pct >= 80 ? C.green : r.pct >= 60 ? C.amber : C.red }}>{r.pct}%</span>
                    </div>
                    <MiniBar pct={r.pct} color={r.pct >= 80 ? C.green : r.pct >= 60 ? C.amber : C.red} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="rounded-2xl p-4 mb-4 flex items-center gap-3" style={{ background: mistN > 0 ? C.redWash : C.card, border: `1px solid ${mistN > 0 ? C.red : C.line}` }}>
        <div className="rounded-2xl flex items-center justify-center" style={{ width: 42, height: 42, background: "#fff", color: mistN > 0 ? C.red : C.sub, flexShrink: 0 }}>
          <RotateCcw size={20} />
        </div>
        {mistN > 0 ? (
          <>
            <div className="flex-1 text-sm font-semibold" style={{ color: C.red }}>{tr.reviewCtaSub}</div>
            <Btn tone="red" onClick={openReview}>{tr.dashReviewBtn(mistN)}</Btn>
          </>
        ) : (
          <div className="flex-1 text-sm font-semibold" style={{ color: C.sub }}>{tr.dashReviewEmpty}</div>
        )}
      </div>

      {practicedRows.length > 0 && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          <div style={{ ...display, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{tr.dashMastery}</div>
          <div className="flex flex-col gap-2.5">
            {practicedRows.map(r => (
              <div key={r.u.id} className="flex items-center gap-3">
                <span className="text-xs font-semibold" style={{ width: 22, color: C.sub, flexShrink: 0 }}>{r.u.id}</span>
                <div className="flex-1"><MiniBar pct={r.pct} color={r.pct >= 80 ? C.green : r.pct >= 60 ? C.amber : C.red} /></div>
                <span className="text-xs font-bold" style={{ width: 74, textAlign: "right", color: C.sub, flexShrink: 0 }}>{tr.dashAcc(r.c, r.a)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
        <div style={{ ...display, fontWeight: 700, fontSize: 16 }}>{tr.dashBackup}</div>
        <div className="text-xs mb-3 leading-relaxed" style={{ color: C.sub }}>{tr.dashBackupSub}</div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Btn tone="ghost" onClick={onExport} full><Download size={16} /> {tr.dashExport}</Btn>
          <Btn tone="ghost" onClick={() => fileRef.current && fileRef.current.click()} full><Upload size={16} /> {tr.dashImport}</Btn>
        </div>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={doImport} style={{ display: "none" }} />
        {msg && (
          <div className="rounded-xl p-3 mt-3 text-sm font-semibold" style={{ background: msg.ok ? C.greenWash : C.redWash, color: msg.ok ? C.green : C.red }}>{msg.t}</div>
        )}
      </div>
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [screen, setScreen] = useState("home");
  const [activeUnit, setActiveUnit] = useState(null);
  const [progress, setProgress] = useState({});
  const [history, setHistory] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [stats, setStats] = useState(null);
  const [lang, setLang] = useState("en");
  const [quiz3, setQuiz3] = useState(null); // extra-practice pool, loaded on demand
  const [reviewList, setReviewList] = useState([]);
  const [reviewSession, setReviewSession] = useState(0);
  const tr = T[lang];

  useEffect(() => {
    (async () => {
      const p = await store.get(K_PROG);
      const w = await store.get(K_WRIT);
      const m = await store.get(K_MIST);
      const s = await store.get(K_STATS);
      const l = await store.get(K_LANG);
      if (p) setProgress(p);
      if (Array.isArray(w)) setHistory(w);
      if (Array.isArray(m)) setMistakes(m);
      if (s && typeof s === "object") setStats(s);
      if (l === "id" || l === "en") setLang(l);
    })();
    // Code-split: the large extra-practice pool loads after first paint.
    import("./content/quiz3.js").then(mod => setQuiz3(mod.QUIZ3)).catch(() => {});
  }, []);

  const changeLang = (l) => { setLang(l); store.set(K_LANG, l); };
  const openUnit = (id) => { setActiveUnit(id); setScreen("unit"); };
  const openReview = () => { setReviewList(Array.isArray(mistakes) ? mistakes : []); setReviewSession(s => s + 1); setScreen("review"); };

  const saveScore = (key, score, total) => {
    setProgress(prev => {
      const old = prev[key];
      const next = { ...prev, [key]: { best: Math.max(old ? old.best : 0, score), total, attempts: (old ? old.attempts : 0) + 1 } };
      store.set(K_PROG, next);
      return next;
    });
  };

  // Called for every answered question: update accuracy/streak stats and the
  // review deck (get it right → cleared; get it wrong → queued for review).
  const recordItem = (rec, correct) => {
    setStats(prev => {
      const s = prev && typeof prev === "object" ? { ...prev } : {};
      s.answered = (s.answered || 0) + 1;
      s.correct = (s.correct || 0) + (correct ? 1 : 0);
      const bu = { ...(s.byUnit || {}) };
      const u = bu[rec.unit] || { answered: 0, correct: 0 };
      bu[rec.unit] = { answered: u.answered + 1, correct: u.correct + (correct ? 1 : 0) };
      s.byUnit = bu;
      const today = todayStr();
      if (s.lastDay !== today) {
        s.streak = s.lastDay === yesterdayStr() ? (s.streak || 0) + 1 : 1;
        s.best = Math.max(s.best || 0, s.streak);
        s.lastDay = today;
      }
      store.set(K_STATS, s);
      return s;
    });
    setMistakes(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      const without = arr.filter(m => m.key !== rec.key);
      const next = correct
        ? without
        : [{ key: rec.key, unit: rec.unit, q: rec.q, opts: rec.opts, a: rec.a, ex: rec.ex, exId: rec.exId }, ...without].slice(0, 200);
      store.set(K_MIST, next);
      return next;
    });
  };

  const addWriting = (entry) => {
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 20);
      store.set(K_WRIT, next);
      return next;
    });
  };

  const exportData = () => {
    try {
      const data = { app: "ielts-grammar-studio", version: 1, exportedAt: new Date().toISOString(), progress, history, mistakes, stats, lang };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `ielts-grammar-backup-${todayStr()}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (e) { /* download unavailable in this browser */ }
  };

  const importData = (file, done) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        if (!d || typeof d !== "object") throw new Error("not an object");
        let touched = false;
        if (d.progress && typeof d.progress === "object") { setProgress(d.progress); store.set(K_PROG, d.progress); touched = true; }
        if (Array.isArray(d.history)) { setHistory(d.history); store.set(K_WRIT, d.history); touched = true; }
        if (Array.isArray(d.mistakes)) { setMistakes(d.mistakes); store.set(K_MIST, d.mistakes); touched = true; }
        if (d.stats && typeof d.stats === "object") { setStats(d.stats); store.set(K_STATS, d.stats); touched = true; }
        if (d.lang === "en" || d.lang === "id") { changeLang(d.lang); touched = true; }
        if (!touched) throw new Error("no recognizable data");
        done && done(true);
      } catch (e) { done && done(false); }
    };
    reader.onerror = () => done && done(false);
    reader.readAsText(file);
  };

  const unit = UNITS.find(u => u.id === activeUnit);

  return (
    <Shell>
      <div className="flex justify-end mb-3">
        <LangToggle lang={lang} setLang={changeLang} />
      </div>
      {screen === "home" && (
        <HomeScreen progress={progress} history={history} mistakes={mistakes} stats={stats} quiz3={quiz3}
          openUnit={openUnit} openWriting={() => setScreen("writing")} openTraining={() => setScreen("writingTraining")}
          openDashboard={() => setScreen("dashboard")} openReview={openReview} lang={lang} />
      )}
      {screen === "unit" && unit && (
        <UnitScreen key={unit.id} unit={unit} progress={progress} onScore={saveScore} onRecord={recordItem} quiz3={quiz3} onBack={() => setScreen("home")} lang={lang} />
      )}
      {screen === "dashboard" && (
        <Dashboard progress={progress} mistakes={mistakes} stats={stats}
          openUnit={openUnit} openReview={openReview} onExport={exportData} onImport={importData}
          onBack={() => setScreen("home")} lang={lang} />
      )}
      {screen === "review" && (
        reviewList.length === 0 ? (
          <div>
            <BackBar onBack={() => setScreen("home")} label={tr.home} />
            <div className="rounded-2xl p-8 text-center" style={{ background: C.card, border: `1px solid ${C.line}` }}>
              <div className="mx-auto mb-3 rounded-full flex items-center justify-center" style={{ width: 56, height: 56, background: C.greenWash, color: C.green }}><Check size={26} /></div>
              <div style={{ ...display, fontWeight: 800, fontSize: 20 }}>{tr.reviewEmpty}</div>
              <p className="text-sm mt-1" style={{ color: C.sub }}>{tr.reviewEmptySub}</p>
            </div>
          </div>
        ) : (
          <div>
            <BackBar onBack={() => setScreen("home")} label={tr.home} />
            <div className="rounded-2xl p-4 mb-3 flex items-center gap-3" style={{ background: C.redWash, border: `1px solid ${C.red}` }}>
              <RotateCcw size={20} style={{ color: C.red, flexShrink: 0 }} />
              <div style={{ ...display, fontWeight: 700, fontSize: 16, color: C.red }}>{tr.reviewTitle}</div>
            </div>
            <Quiz key={"rev" + reviewSession} list={reviewList} unitId="review" isCtx lang={lang}
              onScore={() => {}}
              onItem={(idx, ok) => recordItem(recFromItem(reviewList[idx]), ok)}
              onRestart={() => setReviewSession(s => s + 1)}
              onExit={() => setScreen("home")} />
          </div>
        )
      )}
      {screen === "writing" && (
        <WritingLab onBack={() => setScreen("home")} onSave={addWriting} history={history} goUnit={openUnit} lang={lang} />
      )}
      {screen === "writingTraining" && (
        <WritingTraining onBack={() => setScreen("home")} lang={lang} />
      )}
    </Shell>
  );
}
