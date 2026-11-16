import { useState } from "react";
import { ChevronLeft, ChevronRight, Lock, Home as HomeIcon, CalendarDays, PlusSquare, BarChart3, SlidersHorizontal, Check, Minus, Plus } from "lucide-react";
import { StatusBar, Fade } from "../components/PhoneFrame";
import {
  PHASES, FLOW, MOODS, SYMPTOMS, ENERGY, fmt, fmtShort, iso, fromIso, todayIso, pastDays, monthGrid, addDays,
  dayKind, insights, entrySummary, useLogDraft, useOnboarding,
} from "../lib/pomi";

const C = { bg: "#F5F4F1", white: "#FFFFFF", ink: "#17171A", graphite: "#2D2D2E", muted: "#6B6B70", berry: "#5A1A2B", tint: "#EFE3E6", rule: "#DCDBD6" };
const T = "led";

const Label = ({ children, className = "" }) => <p className={`ff-plex text-[9.5px] uppercase tracking-[0.16em] ${className}`} style={{ color: C.muted }}>{children}</p>;

export const LedBtn = ({ children, variant = "primary", className = "", ...p }) => (
  <button
    {...p}
    className={`w-full h-12 ff-plex text-[11px] uppercase tracking-[0.18em] transition-[transform,background-color] duration-150 active:scale-[0.99] ${
      variant === "primary" ? "bg-[#5A1A2B] hover:bg-[#45121F] text-[#F5F4F1]" : "bg-white border border-[#DCDBD6] text-[#17171A] hover:border-[#2D2D2E]"
    } ${className}`}
  >
    {children}
  </button>
);

export const LedCheck = ({ on, children, ...p }) => (
  <button {...p} className="flex items-center gap-2.5 h-10 px-3 border text-left text-[13px] transition-colors duration-150 bg-white" style={{ borderColor: on ? C.berry : C.rule, color: C.ink }}>
    <span className="w-3.5 h-3.5 border grid place-items-center shrink-0" style={{ borderColor: on ? C.berry : "#B5B4AF", background: on ? C.berry : "transparent" }}>{on && <Check size={10} color="#fff" strokeWidth={3} />}</span>
    {children}
  </button>
);

const Segmented = ({ items, value, onPick, testPrefix }) => (
  <div className="grid border bg-white" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)`, borderColor: C.rule }}>
    {items.map((it, i) => (
      <button key={it.id} data-testid={`${testPrefix}-${it.id}`} onClick={() => onPick(it.id)} className={`h-11 text-[12px] transition-colors duration-150 ${i ? "border-l" : ""}`} style={{ borderColor: C.rule, background: value === it.id ? C.graphite : "transparent", color: value === it.id ? C.bg : C.ink }}>
        {it.label}
      </button>
    ))}
  </div>
);

const Toggle = ({ on, onClick, testId }) => (
  <button data-testid={testId} onClick={onClick} className="ff-plex text-[10px] tracking-widest w-14 h-7 border transition-colors" style={{ borderColor: on ? C.berry : C.rule, background: on ? C.berry : C.white, color: on ? C.bg : C.muted }}>{on ? "ON" : "OFF"}</button>
);

const Header = ({ title }) => (
  <header className="px-5 pt-1 pb-4 flex items-center justify-between border-b" style={{ borderColor: C.rule }}>
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5" style={{ background: C.berry }} />
      <span className="ff-inst font-semibold text-[13px] tracking-[0.32em]">POMI</span>
      <span className="ff-plex text-[10px] ml-1" style={{ color: C.muted }}>/ {title}</span>
    </div>
    <span className="ff-plex text-[9px] tracking-[0.14em] flex items-center gap-1 px-2 py-1 border" style={{ borderColor: C.rule, color: C.graphite }} data-testid={`${T}-privacy-badge`}><Lock size={9} />ON DEVICE</span>
  </header>
);

const TABS = [["home", "Today", HomeIcon], ["cycle", "Cycle", CalendarDays], ["log", "Log", PlusSquare], ["insights", "Data", BarChart3], ["settings", "Privacy", SlidersHorizontal]];
const Tabs = ({ screen, go }) => (
  <nav className="shrink-0 grid grid-cols-5 border-t pb-7" style={{ borderColor: C.rule, background: C.white }}>
    {TABS.map(([id, label, Icon]) => (
      <button key={id} data-testid={`${T}-tab-${id}`} onClick={() => go(id)} className="pt-2.5 flex flex-col items-center gap-1 border-t-2 -mt-px transition-colors" style={{ borderColor: screen === id ? C.berry : "transparent", color: screen === id ? C.berry : C.muted }}>
        <Icon size={17} strokeWidth={1.5} />
        <span className="ff-plex text-[9px] uppercase tracking-[0.14em]">{label}</span>
      </button>
    ))}
  </nav>
);

const Welcome = ({ pomi, go }) => {
  const o = useOnboarding(pomi, () => go("home"));
  return (
    <div className="min-h-[730px] flex flex-col" data-testid={`${T}-welcome-step-${o.step}`}>
      <div className="px-5 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5" style={{ background: C.berry }} /><span className="ff-inst font-semibold text-[13px] tracking-[0.32em]">POMI</span></div>
        <span className="ff-plex text-[10px]" style={{ color: C.muted }}>0{o.step + 1} / 03</span>
      </div>
      <div className="mx-5 mt-4 grid grid-cols-3 gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-[2px] transition-colors" style={{ background: i <= o.step ? C.berry : C.rule }} />)}</div>
      {o.step === 0 && (
        <div className="flex-1 flex flex-col px-5">
          <div className="mt-8 h-36 ledger-grid-bg border relative" style={{ borderColor: C.rule }}>
            <svg viewBox="0 0 320 140" className="absolute inset-0 w-full h-full">
              <circle cx="160" cy="70" r="46" fill="none" stroke={C.graphite} strokeWidth="1" />
              <circle cx="160" cy="70" r="46" fill="none" stroke={C.berry} strokeWidth="3" strokeDasharray={`${(13 / 28) * 289} 289`} transform="rotate(-90 160 70)" />
              <rect x="154" y="18" width="12" height="7" fill={C.berry} />
              <text x="160" y="76" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="17" fill={C.ink}>D13</text>
            </svg>
          </div>
          <h1 className="mt-8 ff-inst text-[34px] leading-[1.05] tracking-[-0.02em] font-medium">Your cycle,<br />accurately kept.</h1>
          <p className="mt-3 text-[14px] leading-relaxed ff-inst" style={{ color: C.muted }}>Before anything else, here is what Pomi commits to.</p>
          <div className="mt-6 border-t" style={{ borderColor: C.rule }}>
            {[["01", "Stored on your device", "Encrypted. No account required."], ["02", "No ad networks", "Zero third-party trackers."], ["03", "Estimates labelled", "Every prediction shows its range."]].map(([n, t, d]) => (
              <div key={n} className="grid grid-cols-[34px_1fr] py-3 border-b" style={{ borderColor: C.rule }}>
                <span className="ff-plex text-[11px]" style={{ color: C.berry }}>{n}</span>
                <div><p className="ff-inst text-[14px] font-medium">{t}</p><p className="ff-inst text-[12px]" style={{ color: C.muted }}>{d}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-6 pb-8 space-y-2">
            <LedBtn data-testid={`${T}-welcome-begin`} onClick={() => o.setStep(1)}>Set up · about 2 min</LedBtn>
            <LedBtn variant="ghost" data-testid={`${T}-welcome-skip`} onClick={() => go("home")}>Restore existing record</LedBtn>
          </div>
        </div>
      )}
      {o.step === 1 && (
        <div className="flex-1 flex flex-col px-5">
          <Label className="mt-8">Input 01</Label>
          <h1 className="mt-2 ff-inst text-[26px] leading-tight font-medium tracking-[-0.01em]">First day of your last period</h1>
          <div className="mt-5 h-12 border bg-white flex items-center px-4 justify-between" style={{ borderColor: C.berry }}>
            <span className="ff-plex text-[14px]" data-testid={`${T}-onboard-selected-date`}>{fmt(fromIso(o.last), { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}</span>
            <span className="ff-plex text-[10px]" style={{ color: C.muted }}>{Math.round((new Date() - fromIso(o.last)) / 86400000)}D AGO</span>
          </div>
          <div className="mt-4 grid grid-cols-7 border-l border-t" style={{ borderColor: C.rule }}>
            {pastDays(28).map((d) => {
              const on = iso(d) === o.last;
              return (
                <button key={iso(d)} data-testid={`${T}-onboard-day-${iso(d)}`} onClick={() => o.setLast(iso(d))} className="h-11 border-r border-b flex flex-col items-center justify-center transition-colors" style={{ borderColor: C.rule, background: on ? C.berry : C.white, color: on ? C.bg : C.ink }}>
                  <span className="ff-plex text-[8px] opacity-60">{fmt(d, { weekday: "short" }).toUpperCase()}</span>
                  <span className="ff-plex text-[13px]">{String(d.getDate()).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 ff-inst text-[12px]" style={{ color: C.muted }}>Approximate is acceptable. Accuracy improves after two logged cycles.</p>
          <div className="mt-auto pt-6 pb-8 grid grid-cols-[1fr_2fr] gap-2">
            <LedBtn variant="ghost" onClick={() => o.setStep(0)} data-testid={`${T}-onboard-back`}>Back</LedBtn>
            <LedBtn onClick={() => o.setStep(2)} data-testid={`${T}-onboard-next`}>Continue</LedBtn>
          </div>
        </div>
      )}
      {o.step === 2 && (
        <div className="flex-1 flex flex-col px-5">
          <Label className="mt-8">Input 02</Label>
          <h1 className="mt-2 ff-inst text-[26px] leading-tight font-medium">Typical cycle length</h1>
          <div className="mt-8 flex items-end gap-3">
            <span className="ff-plex text-[84px] leading-none tracking-tight" data-testid={`${T}-onboard-length`}>{o.len}</span>
            <span className="ff-plex text-[13px] pb-3" style={{ color: C.muted }}>DAYS</span>
            <div className="ml-auto flex border bg-white" style={{ borderColor: C.rule }}>
              <button data-testid={`${T}-onboard-minus`} onClick={() => o.bump(-1)} className="w-11 h-11 grid place-items-center border-r" style={{ borderColor: C.rule }}><Minus size={14} /></button>
              <button data-testid={`${T}-onboard-plus`} onClick={() => o.bump(1)} className="w-11 h-11 grid place-items-center"><Plus size={14} /></button>
            </div>
          </div>
          <div className="mt-8 relative h-10">
            <div className="absolute inset-x-0 top-4 flex justify-between">
              {Array.from({ length: 20 }, (_, i) => 21 + i).map((v) => <span key={v} className="w-px" style={{ height: v % 5 === 0 ? 14 : 7, background: v === o.len ? C.berry : "#B5B4AF" }} />)}
            </div>
            <div className="absolute inset-x-0 top-0 flex justify-between ff-plex text-[9px]" style={{ color: C.muted }}><span>21</span><span>25</span><span>30</span><span>35</span><span>40</span></div>
          </div>
          <div className="mt-6 p-3 border bg-white ff-inst text-[12.5px] leading-relaxed" style={{ borderColor: C.rule, color: C.muted }}><span className="ff-plex text-[10px] mr-2" style={{ color: C.berry }}>NOTE</span>Clinical reference range is 21–35 days. If unknown, start at 28; Pomi recalculates from your logs.</div>
          <div className="mt-auto pt-6 pb-8 grid grid-cols-[1fr_2fr] gap-2">
            <LedBtn variant="ghost" onClick={() => o.setStep(1)}>Back</LedBtn>
            <LedBtn onClick={o.finish} data-testid={`${T}-onboard-finish`}>Complete setup</LedBtn>
          </div>
        </div>
      )}
    </div>
  );
};

const Cell = ({ label, value, sub, testId, accent }) => (
  <div className="p-4 bg-white" data-testid={testId}>
    <Label>{label}</Label>
    <p className="mt-2 ff-plex text-[22px] leading-none tracking-tight" style={{ color: accent ? C.berry : C.ink }}>{value}</p>
    <p className="mt-1.5 ff-inst text-[11px]" style={{ color: C.muted }}>{sub}</p>
  </div>
);

const CycleBar = ({ pomi }) => {
  const { info, profile } = pomi;
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: info.cycleLength }, (_, i) => {
        const k = dayKind(profile, addDays(info.cycleStart, i));
        const cur = i + 1 === info.day;
        const bg = { period: C.berry, predicted: C.berry, fertile: "#D7BCC3", ovulation: C.graphite }[k] || "#E4E3DF";
        return <span key={i} className={`flex-1 relative ${cur ? "h-7 -mt-1.5" : "h-4"}`} style={{ background: cur ? C.ink : bg }} />;
      })}
    </div>
  );
};

const Home = ({ pomi, go }) => {
  const { info } = pomi;
  const entry = pomi.log[todayIso()];
  const s = insights(pomi);
  return (
    <div className="pb-8" data-testid={`${T}-home`}>
      <Header title="Today" />
      <div className="px-5 pt-5 flex items-end justify-between">
        <div>
          <Label>{fmt(new Date(), { weekday: "short", day: "2-digit", month: "short" })}</Label>
          <h1 className="ff-inst text-[30px] font-medium tracking-[-0.02em] mt-1">{PHASES[info.phase].label} phase</h1>
        </div>
      </div>
      <div className="mx-5 mt-5 grid grid-cols-2 gap-px border" style={{ background: C.rule, borderColor: C.rule }}>
        <Cell label="Cycle day" value={<>{String(info.day).padStart(2, "0")}<span className="text-[13px]" style={{ color: C.muted }}> / {info.cycleLength}</span></>} sub={`Started ${fmtShort(info.cycleStart)}`} testId={`${T}-home-cycle-day`} />
        <Cell label="Next period · est." value={fmtShort(info.nextPeriod)} sub={`In ${info.daysUntilNext} days · ±${s.spread}d`} accent testId={`${T}-home-next-period`} />
        <Cell label="Fertile window · est." value={`${info.fertileStart.getDate()}–${info.fertileEnd.getDate()}`} sub={fmt(info.fertileEnd, { month: "long" })} />
        <Cell label="Avg. cycle" value={`${s.avg.toFixed(1)}d`} sub="Based on 6 cycles" />
      </div>
      <div className="mx-5 mt-6">
        <div className="flex justify-between mb-2"><Label>Cycle map</Label><Label>D{info.day}</Label></div>
        <CycleBar pomi={pomi} />
        <div className="mt-2 flex justify-between ff-plex text-[9px]" style={{ color: C.muted }}><span>D01</span><span>OV ~D{info.ovulationDay}</span><span>D{info.cycleLength}</span></div>
      </div>
      <div className="mx-5 mt-6 p-4 border bg-white" style={{ borderColor: C.rule }}>
        <Label className="mb-2">Context</Label>
        <p className="ff-inst text-[13.5px] leading-relaxed">{PHASES[info.phase].note}</p>
      </div>
      <div className="mx-5 mt-6 border-t pt-4" style={{ borderColor: C.rule }} data-testid={`${T}-home-today-entry`}>
        <div className="flex justify-between items-center mb-3"><Label>Today's log</Label><Label>{entry ? "1 entry" : "0 entries"}</Label></div>
        {entry ? (
          <div className="flex flex-wrap gap-1.5 mb-3">{entrySummary(entry).map((p) => <span key={p} className="ff-plex text-[10px] uppercase tracking-wider px-2 py-1" style={{ background: C.graphite, color: C.bg }}>{p}</span>)}</div>
        ) : null}
        <LedBtn onClick={() => go("log")} data-testid={entry ? `${T}-home-edit-entry` : `${T}-home-write-entry`}>{entry ? "Edit today's log" : "+ Log today"}</LedBtn>
      </div>
    </div>
  );
};

const kindStyle = (k) => ({
  period: { background: C.berry, color: C.bg },
  predicted: { boxShadow: `inset 0 0 0 1px ${C.berry}`, color: C.berry },
  fertile: { background: C.tint },
  ovulation: { boxShadow: `inset 0 0 0 1.5px ${C.graphite}`, background: C.tint },
}[k] || { background: C.white });

const Cycle = ({ pomi, go }) => {
  const now = new Date();
  const [ym, setYm] = useState([now.getFullYear(), now.getMonth()]);
  const [sel, setSel] = useState(todayIso());
  const shift = (n) => setYm(([y, m]) => [new Date(y, m + n, 1).getFullYear(), new Date(y, m + n, 1).getMonth()]);
  const s = insights(pomi);
  const selEntry = pomi.log[sel];
  return (
    <div className="pb-8" data-testid={`${T}-cycle`}>
      <Header title="Cycle" />
      <div className="px-5 pt-5 flex items-center justify-between">
        <h1 className="ff-inst text-[26px] font-medium tracking-[-0.01em]">{fmt(new Date(ym[0], ym[1], 1), { month: "long", year: "numeric" })}</h1>
        <div className="flex border bg-white" style={{ borderColor: C.rule }}>
          <button data-testid={`${T}-cycle-prev`} onClick={() => shift(-1)} className="w-9 h-9 grid place-items-center border-r" style={{ borderColor: C.rule }}><ChevronLeft size={15} /></button>
          <button data-testid={`${T}-cycle-next`} onClick={() => shift(1)} className="w-9 h-9 grid place-items-center"><ChevronRight size={15} /></button>
        </div>
      </div>
      <div className="mx-5 mt-4 grid grid-cols-7 gap-px border" style={{ background: C.rule, borderColor: C.rule }}>
        {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((d) => <span key={d} className="ff-plex text-[9px] text-center py-1.5" style={{ background: C.bg, color: C.muted }}>{d}</span>)}
        {monthGrid(ym[0], ym[1]).map((d, i) => {
          if (!d) return <span key={i} style={{ background: C.bg }} />;
          const k = dayKind(pomi.profile, d);
          const id = iso(d);
          const isToday = id === todayIso();
          return (
            <button key={id} data-testid={`${T}-cal-day-${id}`} onClick={() => setSel(id)} className={`relative h-11 text-left p-1.5 ${k === "predicted" ? "ledger-hatch" : ""}`} style={{ ...kindStyle(k), outline: sel === id ? `2px solid ${C.ink}` : "none", outlineOffset: -2 }}>
              <span className={`ff-plex text-[11px] ${isToday ? "underline underline-offset-2" : ""}`}>{String(d.getDate()).padStart(2, "0")}</span>
              {pomi.log[id] && <span className="absolute right-1.5 bottom-1.5 w-1.5 h-1.5" style={{ background: k === "period" ? C.bg : C.graphite }} data-testid={`${T}-cal-logged-${id}`} />}
            </button>
          );
        })}
      </div>
      <div className="mx-5 mt-3 grid grid-cols-2 gap-y-1.5 ff-plex text-[9.5px] uppercase tracking-wider" style={{ color: C.muted }}>
        {[["period", "Recorded"], ["predicted", "Estimated period"], ["fertile", "Fertile · est."], ["ovulation", "Ovulation · est."]].map(([k, l]) => (
          <span key={k} className="flex items-center gap-2"><span className={`w-3 h-3 ${k === "predicted" ? "ledger-hatch" : ""}`} style={kindStyle(k)} />{l}</span>
        ))}
      </div>
      <div className="mx-5 mt-5 p-4 border bg-white" style={{ borderColor: C.rule }} data-testid={`${T}-cycle-selected`}>
        <div className="flex justify-between"><Label>{fmt(fromIso(sel), { weekday: "short", day: "2-digit", month: "short" })}</Label><Label>{selEntry ? "Logged" : "No data"}</Label></div>
        <p className="mt-2 ff-inst text-[13.5px]">{selEntry ? entrySummary(selEntry).join(" · ") || "Note only" : "Nothing recorded for this date."}</p>
        {fromIso(sel) <= new Date() && <button onClick={() => go("log", sel)} data-testid={`${T}-cycle-write`} className="mt-2 ff-plex text-[10px] uppercase tracking-[0.16em] underline underline-offset-4" style={{ color: C.berry }}>{selEntry ? "Edit entry" : "Add entry"} →</button>}
      </div>
      <div className="mx-5 mt-6">
        <Label className="mb-2">Cycle history</Label>
        <div className="border bg-white" style={{ borderColor: C.rule }}>
          <div className="grid grid-cols-[1.2fr_1fr_1fr] px-3 py-2 border-b ff-plex text-[9px] tracking-wider" style={{ borderColor: C.rule, color: C.muted }}><span>START</span><span className="text-right">LENGTH</span><span className="text-right">PERIOD</span></div>
          {[...s.h].reverse().map((c) => (
            <div key={iso(c.start)} className="grid grid-cols-[1.2fr_1fr_1fr] px-3 py-2 border-b last:border-0 ff-plex text-[12px]" style={{ borderColor: "#ECEBE7" }}>
              <span>{fmt(c.start, { day: "2-digit", month: "short" })}</span><span className="text-right">{c.length}d</span><span className="text-right">{c.period}d</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Group = ({ label, right, children }) => (
  <section className="px-5 pt-5">
    <div className="flex justify-between mb-2"><Label>{label}</Label>{right && <Label>{right}</Label>}</div>
    {children}
  </section>
);

const Log = ({ pomi, go, logDate }) => {
  const L = useLogDraft(pomi, logDate);
  return (
    <div className="pb-8" data-testid={`${T}-log`}>
      <Header title="Log" />
      <div className="px-5 pt-5">
        <h1 className="ff-inst text-[26px] font-medium tracking-[-0.01em]">{fmt(fromIso(L.date), { weekday: "long", day: "numeric", month: "short" })}</h1>
        <div className="mt-3 grid grid-cols-7 border bg-white" style={{ borderColor: C.rule }}>
          {pastDays(7).map((d, i) => (
            <button key={iso(d)} data-testid={`${T}-log-date-${iso(d)}`} onClick={() => L.pick(iso(d))} className={`h-12 flex flex-col items-center justify-center ${i ? "border-l" : ""} transition-colors`} style={{ borderColor: C.rule, background: L.date === iso(d) ? C.ink : "transparent", color: L.date === iso(d) ? C.bg : C.ink }}>
              <span className="ff-plex text-[8px] opacity-60">{fmt(d, { weekday: "short" }).toUpperCase()}</span>
              <span className="ff-plex text-[13px]">{String(d.getDate()).padStart(2, "0")}</span>
              {pomi.log[iso(d)] && <span className="w-1 h-1 mt-0.5" style={{ background: L.date === iso(d) ? C.bg : C.berry }} />}
            </button>
          ))}
        </div>
      </div>
      <Group label="A · Flow"><Segmented items={FLOW} value={L.draft.flow} onPick={(v) => L.set("flow", v)} testPrefix={`${T}-log-flow`} /></Group>
      <Group label="B · Mood" right={`${L.draft.moods.length} selected`}>
        <div className="grid grid-cols-2 gap-1.5">{MOODS.map((m) => <LedCheck key={m.id} data-testid={`${T}-log-mood-${m.id}`} on={L.draft.moods.includes(m.id)} onClick={() => L.toggle("moods", m.id)}>{m.label}</LedCheck>)}</div>
      </Group>
      <Group label="C · Symptoms" right={`${L.draft.symptoms.length} selected`}>
        <div className="grid grid-cols-2 gap-1.5">{SYMPTOMS.map((s) => <LedCheck key={s.id} data-testid={`${T}-log-symptom-${s.id}`} on={L.draft.symptoms.includes(s.id)} onClick={() => L.toggle("symptoms", s.id)}>{s.label}</LedCheck>)}</div>
      </Group>
      <Group label="D · Energy"><Segmented items={ENERGY} value={L.draft.energy} onPick={(v) => L.set("energy", L.draft.energy === v ? null : v)} testPrefix={`${T}-log-energy`} /></Group>
      <Group label="E · Note" right={`${L.draft.note.length}/280`}>
        <textarea data-testid={`${T}-log-note`} maxLength={280} value={L.draft.note} onChange={(e) => L.set("note", e.target.value)} rows={3} placeholder="Optional. Visible only to you." className="w-full border bg-white p-3 ff-inst text-[13.5px] outline-none focus:border-[#5A1A2B] resize-none transition-colors" style={{ borderColor: C.rule }} />
      </Group>
      <div className="px-5 pt-5">
        <LedBtn onClick={L.save} data-testid={`${T}-log-save`}>{L.saved ? "Saved ✓" : L.existed ? "Update entry" : "Save entry"}</LedBtn>
        {L.saved && (
          <div className="mt-2 flex justify-between ff-plex text-[10px] uppercase tracking-wider" style={{ color: C.muted }} data-testid={`${T}-log-saved`}>
            <span>Saved {fmt(new Date(), { hour: "2-digit", minute: "2-digit" })} · on device</span>
            <button onClick={() => go("cycle")} className="underline" style={{ color: C.berry }}>View in cycle</button>
          </div>
        )}
      </div>
    </div>
  );
};

const Insights = ({ pomi }) => {
  const s = insights(pomi);
  const days = Object.keys(pomi.log).length || 1;
  return (
    <div className="pb-8" data-testid={`${T}-insights`}>
      <Header title="Data" />
      <div className="px-5 pt-5"><Label>Last 6 cycles</Label><h1 className="ff-inst text-[26px] font-medium tracking-[-0.01em] mt-1">Monthly report</h1></div>
      <div className="mx-5 mt-4 grid grid-cols-3 gap-px border" style={{ background: C.rule, borderColor: C.rule }}>
        {[["Average", `${s.avg.toFixed(1)}d`, `${T}-insights-avg`], ["Range", `${s.min}–${s.max}d`], ["Variation", `±${s.sd.toFixed(1)}d`]].map(([l, v, id]) => (
          <div key={l} className="bg-white p-3" data-testid={id}><Label>{l}</Label><p className="ff-plex text-[18px] mt-1.5">{v}</p></div>
        ))}
      </div>
      <div className="mx-5 mt-5 p-4 border bg-white" style={{ borderColor: C.rule }}>
        <Label className="mb-3">Cycle length (days)</Label>
        <div className="flex items-end gap-3 h-28 border-b relative" style={{ borderColor: C.graphite }}>
          <span className="absolute inset-x-0 border-t border-dashed" style={{ bottom: `${((s.avg - 20) / 12) * 100}%`, borderColor: C.berry }} />
          {s.h.map((c, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
              <span className="ff-plex text-[10px] mb-1">{c.length}</span>
              <span className="w-full" style={{ height: `${((c.length - 20) / 12) * 100}%`, background: i === s.h.length - 1 ? C.berry : C.graphite }} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-1.5">{s.h.map((c, i) => <span key={i} className="flex-1 text-center ff-plex text-[9px]" style={{ color: C.muted }}>{fmt(c.start, { month: "short" }).toUpperCase()}</span>)}</div>
      </div>
      <div className="mx-5 mt-5">
        <Label className="mb-2">Symptom frequency · {Object.keys(pomi.log).length} logged days</Label>
        <div className="border bg-white" style={{ borderColor: C.rule }}>
          {s.top.map((t) => (
            <div key={t.id} className="grid grid-cols-[1fr_70px_40px] items-center gap-3 px-3 py-2.5 border-b last:border-0" style={{ borderColor: "#ECEBE7" }}>
              <span className="ff-inst text-[13px]">{t.label}</span>
              <span className="h-1.5" style={{ background: "#ECEBE7" }}><span className="block h-full" style={{ width: `${(t.n / days) * 100}%`, background: C.graphite }} /></span>
              <span className="ff-plex text-[11px] text-right">{Math.round((t.n / days) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-5 mt-5">
        <Label className="mb-2">Observations</Label>
        {s.takeaways.map((t, i) => (
          <div key={i} className="py-3 border-t flex gap-3" style={{ borderColor: C.rule }}>
            <span className="ff-plex text-[10px] pt-0.5" style={{ color: C.berry }}>0{i + 1}</span>
            <p className="ff-inst text-[13.5px] leading-relaxed flex-1">{t}</p>
          </div>
        ))}
      </div>
      <div className="mx-5 mt-2 p-3 ff-inst text-[11.5px] leading-relaxed" style={{ background: C.tint, color: C.graphite }}><span className="ff-plex text-[9.5px] tracking-widest mr-2" style={{ color: C.berry }}>METHOD</span>Rolling mean of recorded cycle lengths. Not a diagnostic or contraceptive tool.</div>
    </div>
  );
};

const Settings = ({ pomi }) => {
  const [stage, setStage] = useState(0);
  const [exported, setExported] = useState(null);
  const n = Object.keys(pomi.log).length;
  return (
    <div className="pb-8" data-testid={`${T}-settings`}>
      <Header title="Privacy" />
      <div className="px-5 pt-5"><Label>Data ledger</Label><h1 className="ff-inst text-[26px] font-medium tracking-[-0.01em] mt-1">You own this data.</h1></div>
      <div className="mx-5 mt-4 border bg-white" style={{ borderColor: C.rule }}>
        {[["Entries stored", `${n}`], ["Location", "This device"], ["Encryption", "AES-256"], ["Third-party SDKs", "0"], ["Last backup", "Never · opt-in"]].map(([k, v]) => (
          <div key={k} className="flex justify-between px-3 py-2.5 border-b last:border-0" style={{ borderColor: "#ECEBE7" }}><span className="ff-inst text-[13px]" style={{ color: C.muted }}>{k}</span><span className="ff-plex text-[12px]">{v}</span></div>
        ))}
      </div>
      <Group label="Controls">
        <div className="border bg-white" style={{ borderColor: C.rule }}>
          {[["reminders", "Period reminder", "T−2 days"], ["discreet", "Discreet notifications", "No health words"], ["lock", "Biometric lock", "On app open"]].map(([k, t, d]) => (
            <div key={k} className="flex items-center justify-between px-3 py-3 border-b last:border-0" style={{ borderColor: "#ECEBE7" }}>
              <div><p className="ff-inst text-[13.5px]">{t}</p><p className="ff-plex text-[9.5px] uppercase tracking-wider" style={{ color: C.muted }}>{d}</p></div>
              <Toggle on={pomi.prefs[k]} onClick={() => pomi.setPref(k, !pomi.prefs[k])} testId={`${T}-setting-${k}`} />
            </div>
          ))}
        </div>
      </Group>
      <Group label="Export">
        <div className="grid grid-cols-2 gap-2">
          <LedBtn variant="ghost" onClick={() => setExported("CSV")} data-testid={`${T}-settings-export`}>Export CSV</LedBtn>
          <LedBtn variant="ghost" onClick={() => setExported("PDF")}>Export PDF</LedBtn>
        </div>
        {exported && <p className="mt-2 ff-plex text-[10px] uppercase tracking-wider" style={{ color: C.muted }} data-testid={`${T}-settings-export-note`}>{exported} · concept only, no file created</p>}
      </Group>
      <Group label="Erase">
        {stage === 0 && <LedBtn variant="ghost" className="!text-[#5A1A2B]" onClick={() => setStage(1)} data-testid={`${T}-settings-delete`}>Delete all {n} entries</LedBtn>}
        {stage === 1 && (
          <div className="p-3 border" style={{ borderColor: C.berry, background: C.tint }}>
            <p className="ff-inst text-[13px] mb-3">Permanently erase {n} entries from this device? This cannot be reversed.</p>
            <div className="grid grid-cols-2 gap-2">
              <LedBtn variant="ghost" onClick={() => setStage(0)}>Cancel</LedBtn>
              <LedBtn onClick={() => { pomi.clearLog(); setStage(0); }} data-testid={`${T}-settings-delete-confirm`}>Erase</LedBtn>
            </div>
          </div>
        )}
        <button onClick={pomi.reset} data-testid={`${T}-settings-reset`} className="mt-4 ff-plex text-[10px] uppercase tracking-[0.16em] underline underline-offset-4" style={{ color: C.muted }}>Restore sample data</button>
      </Group>
    </div>
  );
};

const SCREENS = { welcome: Welcome, home: Home, cycle: Cycle, log: Log, insights: Insights, settings: Settings };

export const LedgerApp = ({ pomi, screen, setScreen }) => {
  const [logDate, setLogDate] = useState(null);
  const go = (s, d) => { setLogDate(d || null); setScreen(s); };
  const S = SCREENS[screen];
  return (
    <div className="h-full flex flex-col ff-inst" style={{ background: C.bg, color: C.ink }}>
      <StatusBar color={C.ink} />
      <div key={screen + (logDate || "")} className="flex-1 overflow-y-auto no-scrollbar">
        <Fade><S pomi={pomi} go={go} logDate={logDate} /></Fade>
      </div>
      {screen !== "welcome" && <Tabs screen={screen} go={go} />}
    </div>
  );
};

export const LedgerSpecimen = () => (
  <div className="p-5 space-y-3 ff-inst" style={{ background: C.bg, color: C.ink }}>
    <LedBtn>Save entry</LedBtn>
    <div className="grid grid-cols-2 gap-1.5"><LedCheck on>Cramps</LedCheck><LedCheck>Bloating</LedCheck></div>
    <Segmented items={ENERGY} value="steady" onPick={() => {}} testPrefix="led-specimen-energy" />
  </div>
);
