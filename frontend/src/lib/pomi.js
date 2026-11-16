import { useEffect, useMemo, useState } from "react";

const DAY = 86400000;
export const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
export const addDays = (d, n) => { const x = startOfDay(d); x.setDate(x.getDate() + n); return x; };
export const iso = (d) => { const x = startOfDay(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; };
export const fromIso = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
export const diffDays = (a, b) => Math.round((startOfDay(a) - startOfDay(b)) / DAY);
export const todayIso = () => iso(new Date());
export const fmt = (d, o) => d.toLocaleDateString("en-GB", o);
export const fmtShort = (d) => fmt(d, { day: "numeric", month: "short" });
export const fmtLong = (d) => fmt(d, { weekday: "long", day: "numeric", month: "long" });
export const pastDays = (n) => Array.from({ length: n }, (_, i) => addDays(new Date(), i - n + 1));

const opts = (arr) => arr.map((label) => ({ id: label.toLowerCase().replace(/\s+/g, "-"), label }));
export const FLOW = opts(["None", "Spotting", "Light", "Medium", "Heavy"]);
export const MOODS = opts(["Calm", "Content", "Sensitive", "Irritable", "Low", "Anxious"]);
export const SYMPTOMS = opts(["Cramps", "Headache", "Bloating", "Tender breasts", "Back pain", "Acne", "Fatigue", "Cravings"]);
export const ENERGY = opts(["Low", "Steady", "High"]);
export const LABELS = Object.fromEntries([...FLOW, ...MOODS, ...SYMPTOMS, ...ENERGY].map((o) => [o.id, o.label]));
export const EMPTY_ENTRY = { flow: "none", moods: [], symptoms: [], energy: null, note: "" };

export const PHASES = {
  menstrual: { label: "Menstrual", note: "Your period is likely underway. Rest is not a reward you have to earn: warmth, water and an earlier night tend to help more than pushing through." },
  follicular: { label: "Follicular", note: "Energy often lifts in the days after a period. If yours does, it can be a good stretch for focused work. If it doesn't, that is ordinary too." },
  ovulatory: { label: "Ovulatory", note: "You may be near ovulation. Some people notice more energy or a mild one-sided ache; many notice nothing at all. Both are normal." },
  luteal: { label: "Luteal", note: "In the second half of the cycle, sleep and mood can feel more sensitive. Noting how you feel now helps Pomi show you clearer patterns later." },
};

export function cycleInfo(profile, date = new Date()) {
  const start = fromIso(profile.lastPeriod);
  const L = profile.cycleLength;
  const P = profile.periodLength;
  const d = diffDays(date, start);
  const idx = Math.floor(d / L);
  const day = d - idx * L + 1;
  const ovulationDay = L - 14;
  const phase = day <= P ? "menstrual" : day < ovulationDay - 1 ? "follicular" : day <= ovulationDay + 1 ? "ovulatory" : "luteal";
  const cycleStart = addDays(start, idx * L);
  const nextPeriod = addDays(cycleStart, L);
  return {
    day, phase, cycleLength: L, periodLength: P, ovulationDay, cycleStart, nextPeriod,
    daysUntilNext: diffDays(nextPeriod, date),
    fertileStart: addDays(cycleStart, ovulationDay - 6),
    fertileEnd: addDays(cycleStart, ovulationDay),
    ovulationDate: addDays(cycleStart, ovulationDay - 1),
  };
}

export function dayKind(profile, date) {
  const info = cycleInfo(profile, date);
  const future = diffDays(date, new Date()) > 0;
  if (info.day <= profile.periodLength) return future ? "predicted" : "period";
  if (info.day === info.ovulationDay) return "ovulation";
  if (info.day >= info.ovulationDay - 5 && info.day <= info.ovulationDay + 1) return "fertile";
  return null;
}

export function monthGrid(y, m) {
  const pad = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const cells = Array(pad).fill(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

const LENGTHS = [29, 27, 30, 28, 27, 28];
const PERIODS = [5, 4, 5, 5, 6, 5];
export function history(profile) {
  let start = fromIso(profile.lastPeriod);
  const out = [];
  for (let i = LENGTHS.length - 1; i >= 0; i--) {
    start = addDays(start, -LENGTHS[i]);
    out.unshift({ start, length: LENGTHS[i], period: PERIODS[i] });
  }
  return out;
}

export function insights(pomi) {
  const h = history(pomi.profile);
  const lengths = h.map((c) => c.length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const min = Math.min(...lengths);
  const max = Math.max(...lengths);
  const sd = Math.sqrt(lengths.reduce((a, b) => a + (b - avg) ** 2, 0) / lengths.length);
  const counts = {};
  Object.values(pomi.log).forEach((e) => [...(e.symptoms || []), ...(e.moods || [])].forEach((k) => { counts[k] = (counts[k] || 0) + 1; }));
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, n]) => ({ id, label: LABELS[id], n }));
  const days = Object.keys(pomi.log).length;
  const spread = Math.max(1, Math.round(sd));
  const takeaways = [
    `Your last six cycles ranged from ${min} to ${max} days. Differences of a few days between cycles are common.`,
    top[0] ? `${top[0].label} is what you noted most often, on ${top[0].n} ${top[0].n === 1 ? "day" : "days"}.` : "Log a few more days and the patterns you notice most will appear here.",
    `Your next period is estimated for ${fmtShort(pomi.info.nextPeriod)}, give or take about ${spread} ${spread === 1 ? "day" : "days"}.`,
  ];
  return { h, avg, min, max, sd, spread, top, days, takeaways };
}

export const entrySummary = (e) => {
  if (!e) return [];
  const parts = [];
  if (e.flow && e.flow !== "none") parts.push(`${LABELS[e.flow]} flow`);
  (e.moods || []).forEach((m) => parts.push(LABELS[m]));
  (e.symptoms || []).forEach((s) => parts.push(LABELS[s]));
  if (e.energy) parts.push(`${LABELS[e.energy]} energy`);
  return parts;
};

export function sampleState() {
  const t = new Date();
  const log = {};
  const put = (n, e) => { log[iso(addDays(t, n))] = { ...EMPTY_ENTRY, ...e }; };
  put(-45, { symptoms: ["bloating", "cravings", "tender-breasts"], moods: ["anxious"], energy: "low" });
  put(-40, { flow: "heavy", symptoms: ["cramps", "headache"], moods: ["irritable"], energy: "low" });
  put(-39, { flow: "medium", symptoms: ["cramps"], energy: "low" });
  put(-12, { flow: "heavy", symptoms: ["cramps", "fatigue"], moods: ["low"], energy: "low", note: "Slow morning. The heat pad helped." });
  put(-11, { flow: "medium", symptoms: ["cramps", "back-pain"], moods: ["sensitive"], energy: "low" });
  put(-10, { flow: "medium", symptoms: ["fatigue"], moods: ["calm"], energy: "steady" });
  put(-9, { flow: "light", symptoms: ["headache"], moods: ["content"], energy: "steady" });
  put(-8, { flow: "spotting", moods: ["calm"], energy: "high" });
  put(-5, { moods: ["content"], energy: "high", note: "Long walk after work. Slept well." });
  put(-2, { symptoms: ["bloating"], moods: ["calm"], energy: "steady" });
  return {
    profile: { lastPeriod: iso(addDays(t, -12)), cycleLength: 28, periodLength: 5 },
    prefs: { reminders: true, discreet: true, lock: false },
    log,
  };
}

export function usePomi(dir) {
  const key = `pomi-concept:${dir}`;
  const [state, setState] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(key));
      if (s && s.profile && s.log) return s;
    } catch (e) { /* fall back to sample */ }
    return sampleState();
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  const info = useMemo(() => cycleInfo(state.profile), [state.profile]);
  return {
    ...state,
    info,
    saveEntry: (d, e) => setState((s) => ({ ...s, log: { ...s.log, [d]: e } })),
    setProfile: (p) => setState((s) => ({ ...s, profile: { ...s.profile, ...p } })),
    setPref: (k, v) => setState((s) => ({ ...s, prefs: { ...s.prefs, [k]: v } })),
    clearLog: () => setState((s) => ({ ...s, log: {} })),
    reset: () => setState(sampleState()),
  };
}

export function useLogDraft(pomi, initialDate) {
  const [date, setDate] = useState(initialDate || todayIso());
  const [draft, setDraft] = useState(() => ({ ...EMPTY_ENTRY, ...(pomi.log[initialDate || todayIso()] || {}) }));
  const [saved, setSaved] = useState(false);
  const pick = (d) => { setDate(d); setDraft({ ...EMPTY_ENTRY, ...(pomi.log[d] || {}) }); setSaved(false); };
  const set = (k, v) => { setDraft((x) => ({ ...x, [k]: v })); setSaved(false); };
  const toggle = (k, v) => { setDraft((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((i) => i !== v) : [...x[k], v] })); setSaved(false); };
  const save = () => { pomi.saveEntry(date, draft); setSaved(true); };
  return { date, pick, draft, set, toggle, save, saved, existed: !!pomi.log[date] };
}

export function useOnboarding(pomi, onDone) {
  const [step, setStep] = useState(0);
  const [last, setLast] = useState(pomi.profile.lastPeriod);
  const [len, setLen] = useState(pomi.profile.cycleLength);
  const finish = () => { pomi.setProfile({ lastPeriod: last, cycleLength: len }); onDone(); };
  const bump = (n) => setLen((l) => Math.min(40, Math.max(21, l + n)));
  return { step, setStep, last, setLast, len, setLen, bump, finish };
}
