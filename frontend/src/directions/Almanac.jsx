import { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { StatusBar, Fade } from "../components/PhoneFrame";
import {
  PHASES, FLOW, MOODS, SYMPTOMS, ENERGY, fmt, fmtShort, fmtLong, iso, fromIso, todayIso, pastDays, monthGrid,
  dayKind, insights, entrySummary, useLogDraft, useOnboarding,
} from "../lib/pomi";

const C = { paper: "#FBF7F0", paper2: "#F3ECE0", ink: "#2C1810", muted: "#6E5B53", pom: "#7D2638", wash: "#F4E6E8", terra: "#B8604F", terraWash: "#F1E1D6", rule: "#E3D8C3" };
const T = "alm";

const Eyebrow = ({ children, className = "" }) => (
  <p className={`text-[10px] uppercase tracking-[0.24em] ${className}`} style={{ color: C.muted }}>{children}</p>
);
const Rule = ({ className = "" }) => <div className={`mx-6 h-px ${className}`} style={{ background: C.rule }} />;

export const AlmBtn = ({ children, variant = "primary", className = "", ...p }) => (
  <button
    {...p}
    className={`w-full h-12 rounded-[3px] ff-play text-[16px] tracking-wide transition-[transform,background-color] duration-200 active:scale-[0.98] ${
      variant === "primary" ? "bg-[#7D2638] hover:bg-[#661E2D] text-[#FBF7F0]" : "border border-[#2C1810]/25 text-[#2C1810] hover:bg-[#F3ECE0]"
    } ${className}`}
  >
    {children}
  </button>
);

export const AlmChip = ({ on, children, ...p }) => (
  <button
    {...p}
    className={`px-3 py-1.5 rounded-[3px] border text-[13px] transition-colors duration-200 ${on ? "bg-[#7D2638] border-[#7D2638] text-[#FBF7F0]" : "border-[#2C1810]/20 text-[#2C1810] hover:border-[#7D2638]/50"}`}
  >
    {children}
  </button>
);

const Switch = ({ on, onClick, testId }) => (
  <button data-testid={testId} onClick={onClick} className="w-10 h-[22px] rounded-full border relative transition-colors duration-200 shrink-0" style={{ borderColor: on ? C.pom : "#2C181040", background: on ? C.pom : "transparent" }}>
    <span className="absolute top-[3px] w-[14px] h-[14px] rounded-full transition-[left] duration-200" style={{ left: on ? 21 : 3, background: on ? C.paper : C.muted }} />
  </button>
);

export const Pomegranate = ({ size = 140, color = C.pom }) => (
  <svg width={size} height={size * 1.08} viewBox="0 0 120 130" fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
    <path d="M60 26c-27 0-46 21-46 49s19 49 46 49 46-21 46-49-19-49-46-49z" />
    <path d="M49 28l-4-13 8 6 7-11 7 11 8-6-4 13" />
    <path d="M63 16c8-9 21-11 31-7-7 9-20 12-31 7z" />
    <path d="M63 16c10-4 20-6 31-7" />
    <path d="M26 86c6 18 19 29 34 31" opacity=".55" />
    <path d="M32 96c6 11 14 17 24 19" opacity=".45" />
    <path d="M94 62c-3-10-9-18-17-24" opacity=".55" />
    {[[56, 70], [66, 76], [58, 84], [70, 88], [50, 80], [62, 94], [74, 70]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="2.6" ry="3.6" transform={`rotate(${i * 25} ${x} ${y})`} opacity=".7" />
    ))}
  </svg>
);

const Masthead = ({ kicker }) => (
  <header className="px-6 pt-2 pb-5">
    <div className="flex items-baseline justify-between">
      <span className="ff-play italic text-[24px]" style={{ color: C.pom }}>Pomi</span>
      <Eyebrow>{kicker}</Eyebrow>
    </div>
    <div className="mt-3 h-[4px] border-y" style={{ borderColor: C.ink }} />
  </header>
);

const TABS = [["home", "Today"], ["cycle", "Month"], ["log", "Entry"], ["insights", "Review"], ["settings", "Record"]];
const Tabs = ({ screen, go }) => (
  <nav className="shrink-0 border-t px-4 pt-3 pb-7 flex justify-between" style={{ borderColor: C.rule, background: C.paper }}>
    {TABS.map(([id, label]) => (
      <button key={id} data-testid={`${T}-tab-${id}`} onClick={() => go(id)} className="flex-1 flex flex-col items-center gap-1.5">
        <span className="w-1 h-1 rounded-full transition-opacity" style={{ background: C.pom, opacity: screen === id ? 1 : 0 }} />
        <span className={`text-[11px] uppercase tracking-[0.18em] transition-colors ${screen === id ? "font-semibold" : ""}`} style={{ color: screen === id ? C.pom : C.muted }}>{label}</span>
      </button>
    ))}
  </nav>
);

const Welcome = ({ pomi, go }) => {
  const o = useOnboarding(pomi, () => go("home"));
  const steps = ["I", "II", "III"];
  return (
    <div className="px-7 pt-4 pb-8 min-h-[700px] flex flex-col" data-testid={`${T}-welcome-step-${o.step}`}>
      <div className="flex justify-between items-baseline">
        <span className="ff-play italic text-[22px]" style={{ color: C.pom }}>Pomi</span>
        <Eyebrow>No. {steps[o.step]} of III</Eyebrow>
      </div>
      {o.step === 0 && (
        <div className="flex-1 flex flex-col">
          <div className="mt-10 mb-8 -ml-2"><Pomegranate size={128} /></div>
          <h1 className="ff-play text-[36px] leading-[1.08] tracking-tight">A quiet record<br /><span className="italic">of your cycle.</span></h1>
          <p className="mt-5 text-[15px] leading-relaxed" style={{ color: C.muted }}>Pomi helps you notice your own rhythm: gently, privately, and in your own words.</p>
          <ul className="mt-7 space-y-2.5 text-[14px]">
            {["Kept on this device, not on our servers", "Never sold, never shown to advertisers", "Every prediction marked as an estimate"].map((t) => (
              <li key={t} className="flex gap-3 items-baseline"><span className="w-4 h-px shrink-0" style={{ background: C.pom }} />{t}</li>
            ))}
          </ul>
          <div className="mt-auto pt-8 space-y-3">
            <AlmBtn data-testid={`${T}-welcome-begin`} onClick={() => o.setStep(1)}>Begin</AlmBtn>
            <button data-testid={`${T}-welcome-skip`} onClick={() => go("home")} className="w-full text-[13px] underline underline-offset-4" style={{ color: C.muted }}>I already keep a Pomi record</button>
          </div>
        </div>
      )}
      {o.step === 1 && (
        <div className="flex-1 flex flex-col">
          <h1 className="mt-10 ff-play text-[30px] leading-tight">When did your last period <span className="italic">begin?</span></h1>
          <p className="mt-3 text-[14px]" style={{ color: C.muted }}>An approximate day is fine. You can correct it whenever you like.</p>
          <p className="mt-6 ff-play italic text-[20px]" style={{ color: C.pom }} data-testid={`${T}-onboard-selected-date`}>{fmtLong(fromIso(o.last))}</p>
          <div className="mt-4 grid grid-cols-7 gap-y-2 text-center">
            {pastDays(28).map((d) => {
              const on = iso(d) === o.last;
              return (
                <button key={iso(d)} data-testid={`${T}-onboard-day-${iso(d)}`} onClick={() => o.setLast(iso(d))} className="flex flex-col items-center">
                  <span className="text-[9px] uppercase tracking-widest" style={{ color: C.muted }}>{fmt(d, { weekday: "narrow" })}</span>
                  <span className="mt-1 w-9 h-9 grid place-items-center rounded-full ff-play text-[15px] transition-colors" style={{ background: on ? C.pom : "transparent", color: on ? C.paper : C.ink }}>{d.getDate()}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-auto pt-8 grid grid-cols-2 gap-3">
            <AlmBtn variant="ghost" onClick={() => o.setStep(0)} data-testid={`${T}-onboard-back`}>Back</AlmBtn>
            <AlmBtn onClick={() => o.setStep(2)} data-testid={`${T}-onboard-next`}>Continue</AlmBtn>
          </div>
        </div>
      )}
      {o.step === 2 && (
        <div className="flex-1 flex flex-col">
          <h1 className="mt-10 ff-play text-[30px] leading-tight">How long is your cycle, <span className="italic">usually?</span></h1>
          <div className="mt-10 flex items-center justify-between">
            <button data-testid={`${T}-onboard-minus`} onClick={() => o.bump(-1)} className="w-12 h-12 rounded-full border grid place-items-center active:scale-95 transition-transform" style={{ borderColor: "#2C181040" }}><Minus size={16} /></button>
            <div className="text-center">
              <span className="ff-play text-[88px] leading-none" data-testid={`${T}-onboard-length`}>{o.len}</span>
              <p className="ff-play italic text-[18px]" style={{ color: C.muted }}>days</p>
            </div>
            <button data-testid={`${T}-onboard-plus`} onClick={() => o.bump(1)} className="w-12 h-12 rounded-full border grid place-items-center active:scale-95 transition-transform" style={{ borderColor: "#2C181040" }}><Plus size={16} /></button>
          </div>
          <p className="mt-10 text-[14px] leading-relaxed border-l-2 pl-4" style={{ color: C.muted, borderColor: C.pom }}>Counted from the first day of one period to the first day of the next. Unsure? 28 is a gentle place to start; Pomi adjusts as you keep your record.</p>
          <div className="mt-auto pt-8 grid grid-cols-2 gap-3">
            <AlmBtn variant="ghost" onClick={() => o.setStep(1)}>Back</AlmBtn>
            <AlmBtn onClick={o.finish} data-testid={`${T}-onboard-finish`}>Open my record</AlmBtn>
          </div>
        </div>
      )}
    </div>
  );
};

const Home = ({ pomi, go }) => {
  const { info } = pomi;
  const entry = pomi.log[todayIso()];
  const parts = entrySummary(entry);
  return (
    <div className="pb-8" data-testid={`${T}-home`}>
      <Masthead kicker={fmt(new Date(), { weekday: "long", day: "numeric", month: "long" })} />
      <section className="px-6">
        <Eyebrow>Today, in your cycle</Eyebrow>
        <h1 className="ff-play text-[68px] leading-[0.95] mt-3 tracking-tight" data-testid={`${T}-home-cycle-day`}>Day {info.day}</h1>
        <p className="ff-play italic text-[18px] mt-2" style={{ color: C.muted }}>of {info.cycleLength}, in the {PHASES[info.phase].label.toLowerCase()} phase</p>
      </section>
      <Rule className="my-6" />
      <section className="px-6">
        <Eyebrow className="mb-3">The day's note</Eyebrow>
        <p className="alm-dropcap text-[15px] leading-[1.65]">{PHASES[info.phase].note}</p>
      </section>
      <Rule className="my-6" />
      <section className="px-6 grid grid-cols-2 gap-6">
        <div>
          <Eyebrow>Next period</Eyebrow>
          <p className="ff-play text-[26px] mt-2" data-testid={`${T}-home-next-period`}>{fmt(info.nextPeriod, { day: "numeric", month: "long" })}</p>
          <p className="text-[12px] mt-1 italic" style={{ color: C.muted }}>Estimated · in {info.daysUntilNext} days</p>
        </div>
        <div className="border-l pl-5" style={{ borderColor: C.rule }}>
          <Eyebrow>Fertile window</Eyebrow>
          <p className="ff-play text-[26px] mt-2">{info.fertileStart.getDate()}–{fmtShort(info.fertileEnd)}</p>
          <p className="text-[12px] mt-1 italic" style={{ color: C.muted }}>Estimated · not contraception</p>
        </div>
      </section>
      <Rule className="my-6" />
      <section className="px-6" data-testid={`${T}-home-today-entry`}>
        <Eyebrow className="mb-3">Today's entry</Eyebrow>
        {parts.length || entry?.note ? (
          <>
            <p className="ff-play text-[19px] leading-snug">{parts.join(" · ") || "A note"}</p>
            {entry.note && <p className="mt-2 italic text-[14px]" style={{ color: C.muted }}>"{entry.note}"</p>}
            <button onClick={() => go("log")} className="mt-3 text-[13px] underline underline-offset-4" style={{ color: C.pom }} data-testid={`${T}-home-edit-entry`}>Revise today's entry</button>
          </>
        ) : (
          <>
            <p className="italic text-[15px] mb-4" style={{ color: C.muted }}>Nothing written yet today.</p>
            <AlmBtn variant="ghost" onClick={() => go("log")} data-testid={`${T}-home-write-entry`}>Write today's entry</AlmBtn>
          </>
        )}
      </section>
    </div>
  );
};

const kindStyle = (k) => ({
  period: { background: C.pom, color: C.paper },
  predicted: { border: `1px dashed ${C.pom}`, color: C.pom },
  fertile: { background: C.terraWash, color: C.ink },
  ovulation: { border: `1px solid ${C.terra}`, background: C.terraWash, color: C.terra },
}[k] || {});

const Cycle = ({ pomi, go }) => {
  const now = new Date();
  const [ym, setYm] = useState([now.getFullYear(), now.getMonth()]);
  const [sel, setSel] = useState(todayIso());
  const shift = (n) => setYm(([y, m]) => [new Date(y, m + n, 1).getFullYear(), new Date(y, m + n, 1).getMonth()]);
  const selEntry = pomi.log[sel];
  const monthEntries = Object.keys(pomi.log).filter((k) => k.startsWith(`${ym[0]}-${String(ym[1] + 1).padStart(2, "0")}`)).sort();
  return (
    <div className="pb-8" data-testid={`${T}-cycle`}>
      <Masthead kicker="The month" />
      <div className="px-6 flex items-end justify-between">
        <h1 className="ff-play text-[40px] leading-none">{fmt(new Date(ym[0], ym[1], 1), { month: "long" })} <span className="italic text-[22px]" style={{ color: C.muted }}>{ym[0]}</span></h1>
        <div className="flex gap-1">
          <button data-testid={`${T}-cycle-prev`} onClick={() => shift(-1)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-[#F3ECE0]"><ChevronLeft size={18} /></button>
          <button data-testid={`${T}-cycle-next`} onClick={() => shift(1)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-[#F3ECE0]"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="px-5 mt-6 grid grid-cols-7 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="text-[10px] tracking-widest pb-3" style={{ color: C.muted }}>{d}</span>)}
        {monthGrid(ym[0], ym[1]).map((d, i) => {
          if (!d) return <span key={i} />;
          const k = dayKind(pomi.profile, d);
          const id = iso(d);
          return (
            <button key={id} data-testid={`${T}-cal-day-${id}`} onClick={() => setSel(id)} className="relative h-11 grid place-items-center">
              <span className={`w-9 h-9 grid place-items-center rounded-full ff-play text-[15px] ${sel === id ? "ring-1 ring-offset-2 ring-[#2C1810] ring-offset-[#FBF7F0]" : ""}`} style={kindStyle(k)}>{d.getDate()}</span>
              {pomi.log[id] && <span className="absolute bottom-0 w-1 h-1 rounded-full" style={{ background: C.ink }} data-testid={`${T}-cal-logged-${id}`} />}
            </button>
          );
        })}
      </div>
      <div className="px-6 mt-5 grid grid-cols-2 gap-y-2 text-[12px]" style={{ color: C.muted }}>
        {[["period", "Period, recorded"], ["predicted", "Period, estimated"], ["fertile", "Fertile, estimated"], ["ovulation", "Ovulation, estimated"]].map(([k, l]) => (
          <span key={k} className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full" style={kindStyle(k)} />{l}</span>
        ))}
      </div>
      <Rule className="my-6" />
      <section className="px-6" data-testid={`${T}-cycle-selected`}>
        <Eyebrow>{fmtLong(fromIso(sel))}</Eyebrow>
        {selEntry ? (
          <p className="ff-play text-[18px] mt-2 leading-snug">{entrySummary(selEntry).join(" · ") || "A note only"}</p>
        ) : (
          <p className="italic text-[15px] mt-2" style={{ color: C.muted }}>No entry for this day.</p>
        )}
        {fromIso(sel) <= new Date() && (
          <button onClick={() => go("log", sel)} data-testid={`${T}-cycle-write`} className="mt-3 text-[13px] underline underline-offset-4" style={{ color: C.pom }}>{selEntry ? "Revise this entry" : "Write an entry for this day"}</button>
        )}
      </section>
      <Rule className="my-6" />
      <section className="px-6">
        <Eyebrow className="mb-3">Notes in the margin · {monthEntries.length}</Eyebrow>
        {monthEntries.slice(-4).reverse().map((k) => (
          <div key={k} className="py-2.5 border-b flex gap-4 text-[13px]" style={{ borderColor: C.rule }}>
            <span className="ff-play italic w-14 shrink-0" style={{ color: C.pom }}>{fmtShort(fromIso(k))}</span>
            <span>{entrySummary(pomi.log[k]).join(", ") || pomi.log[k].note || "—"}</span>
          </div>
        ))}
      </section>
    </div>
  );
};

const Section = ({ n, title, children }) => (
  <section className="px-6 py-5 border-b" style={{ borderColor: C.rule }}>
    <p className="ff-play text-[18px] mb-3"><span className="italic mr-2" style={{ color: C.pom }}>{n}.</span>{title}</p>
    {children}
  </section>
);

const Log = ({ pomi, go, logDate }) => {
  const L = useLogDraft(pomi, logDate);
  return (
    <div className="pb-8" data-testid={`${T}-log`}>
      <Masthead kicker="Entry" />
      <div className="px-6">
        <h1 className="ff-play text-[28px] leading-tight">{fmtLong(fromIso(L.date))}</h1>
        <div className="mt-4 flex justify-between">
          {pastDays(7).map((d) => (
            <button key={iso(d)} data-testid={`${T}-log-date-${iso(d)}`} onClick={() => L.pick(iso(d))} className="flex flex-col items-center gap-1 w-10">
              <span className="text-[9px] uppercase tracking-widest" style={{ color: C.muted }}>{fmt(d, { weekday: "short" })}</span>
              <span className="ff-play text-[17px] pb-1 border-b-2 w-7 text-center transition-colors" style={{ borderColor: L.date === iso(d) ? C.pom : "transparent", color: L.date === iso(d) ? C.pom : C.ink }}>{d.getDate()}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 border-t" style={{ borderColor: C.rule }} />
      <Section n="i" title="Flow">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {FLOW.map((f) => (
            <button key={f.id} data-testid={`${T}-log-flow-${f.id}`} onClick={() => L.set("flow", f.id)} className={`ff-play text-[17px] underline-offset-[6px] decoration-1 transition-colors ${L.draft.flow === f.id ? "italic underline" : ""}`} style={{ color: L.draft.flow === f.id ? C.pom : C.ink }}>{f.label}</button>
          ))}
        </div>
      </Section>
      <Section n="ii" title="Mood">
        <div className="flex flex-wrap gap-2">{MOODS.map((m) => <AlmChip key={m.id} data-testid={`${T}-log-mood-${m.id}`} on={L.draft.moods.includes(m.id)} onClick={() => L.toggle("moods", m.id)}>{m.label}</AlmChip>)}</div>
      </Section>
      <Section n="iii" title="Body">
        <div className="flex flex-wrap gap-2">{SYMPTOMS.map((s) => <AlmChip key={s.id} data-testid={`${T}-log-symptom-${s.id}`} on={L.draft.symptoms.includes(s.id)} onClick={() => L.toggle("symptoms", s.id)}>{s.label}</AlmChip>)}</div>
      </Section>
      <Section n="iv" title="Energy">
        <div className="flex gap-6">
          {ENERGY.map((e) => (
            <button key={e.id} data-testid={`${T}-log-energy-${e.id}`} onClick={() => L.set("energy", L.draft.energy === e.id ? null : e.id)} className={`ff-play text-[17px] underline-offset-[6px] ${L.draft.energy === e.id ? "italic underline" : ""}`} style={{ color: L.draft.energy === e.id ? C.pom : C.ink }}>{e.label}</button>
          ))}
        </div>
      </Section>
      <Section n="v" title="In your own words">
        <textarea data-testid={`${T}-log-note`} value={L.draft.note} onChange={(e) => L.set("note", e.target.value)} rows={3} placeholder="How did today feel?" className="ruled-lines w-full bg-transparent resize-none outline-none text-[15px] ff-play italic placeholder:text-[#6E5B53]/60" />
      </Section>
      <div className="px-6 pt-6">
        <AlmBtn onClick={L.save} data-testid={`${T}-log-save`}>{L.saved ? "Kept" : L.existed ? "Revise this entry" : "Keep this entry"}</AlmBtn>
        {L.saved && (
          <p className="mt-3 text-[13px] text-center italic" style={{ color: C.muted }} data-testid={`${T}-log-saved`}>
            Kept on this device. <button className="underline not-italic" style={{ color: C.pom }} onClick={() => go("cycle")}>See it in the month</button>
          </p>
        )}
      </div>
    </div>
  );
};

const Insights = ({ pomi }) => {
  const s = insights(pomi);
  const w = 300, h = 110;
  const xs = (i) => 14 + (i * (w - 28)) / (s.h.length - 1);
  const ys = (v) => h - 18 - ((v - 24) / 10) * (h - 36);
  const maxN = s.top[0]?.n || 1;
  return (
    <div className="pb-8" data-testid={`${T}-insights`}>
      <Masthead kicker={`Review · ${fmt(new Date(), { month: "long" })}`} />
      <div className="px-6">
        <h1 className="ff-play text-[30px] leading-[1.15]">Your recent cycles have been <span className="italic" style={{ color: C.pom }}>fairly steady.</span></h1>
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: C.muted }}>Across your last six cycles the average length was <b style={{ color: C.ink }} data-testid={`${T}-insights-avg`}>{s.avg.toFixed(1)} days</b>, varying by about {s.spread} {s.spread === 1 ? "day" : "days"} either way.</p>
      </div>
      <div className="px-6 mt-6">
        <Eyebrow className="mb-2">Cycle length, in days</Eyebrow>
        <svg width="100%" viewBox={`0 0 ${w} ${h}`}>
          <line x1="0" x2={w} y1={ys(s.avg)} y2={ys(s.avg)} stroke={C.rule} strokeDasharray="3 4" />
          <polyline fill="none" stroke={C.pom} strokeWidth="1.2" points={s.h.map((c, i) => `${xs(i)},${ys(c.length)}`).join(" ")} />
          {s.h.map((c, i) => (
            <g key={i}>
              <circle cx={xs(i)} cy={ys(c.length)} r="3.5" fill={C.paper} stroke={C.pom} />
              <text x={xs(i)} y={ys(c.length) - 9} textAnchor="middle" fontSize="11" fontFamily="Playfair Display" fill={C.ink}>{c.length}</text>
              <text x={xs(i)} y={h - 2} textAnchor="middle" fontSize="9" fontFamily="Source Sans 3" fill={C.muted}>{fmt(c.start, { month: "short" })}</text>
            </g>
          ))}
        </svg>
      </div>
      <Rule className="my-6" />
      <section className="px-6">
        <Eyebrow className="mb-3">Most noted</Eyebrow>
        {s.top.map((t, i) => (
          <div key={t.id} className="flex items-center gap-4 py-2">
            <span className="ff-play italic w-4" style={{ color: C.pom }}>{i + 1}</span>
            <span className="w-28 text-[14px]">{t.label}</span>
            <span className="flex-1 h-px relative" style={{ background: C.rule }}><span className="absolute left-0 -top-px h-[3px]" style={{ width: `${(t.n / maxN) * 100}%`, background: C.terra }} /></span>
            <span className="ff-play text-[14px] w-6 text-right">{t.n}</span>
          </div>
        ))}
      </section>
      <Rule className="my-6" />
      <section className="px-6">
        <Eyebrow className="mb-3">In plain words</Eyebrow>
        <ol className="space-y-3">
          {s.takeaways.map((t, i) => <li key={i} className="flex gap-3 text-[15px] leading-relaxed"><span className="ff-play italic" style={{ color: C.pom }}>{["i", "ii", "iii"][i]}.</span>{t}</li>)}
        </ol>
      </section>
      <div className="mx-6 mt-7 p-4 text-[13px] leading-relaxed" style={{ background: C.paper2, color: C.muted }}>
        <span className="ff-play italic" style={{ color: C.ink }}>A note on estimates. </span>Pomi's predictions are averages of what you have recorded. They are not medical advice and should not be relied on as contraception.
      </div>
    </div>
  );
};

const Settings = ({ pomi }) => {
  const [confirm, setConfirm] = useState(false);
  const [exported, setExported] = useState(false);
  const rows = [["reminders", "Gentle reminders", "A quiet note two days before your estimated period."], ["discreet", "Discreet notifications", "Notifications never mention periods or symptoms."], ["lock", "Passcode lock", "Ask for your passcode each time Pomi opens."]];
  return (
    <div className="pb-8" data-testid={`${T}-settings`}>
      <Masthead kicker="Your record" />
      <div className="px-6">
        <h1 className="ff-play text-[30px] leading-tight">Your record, <span className="italic">on your terms.</span></h1>
        <p className="mt-3 text-[14px] leading-relaxed" style={{ color: C.muted }}>{Object.keys(pomi.log).length} entries, kept only on this device. Pomi has no advertising partners and no access to what you write.</p>
      </div>
      <div className="mt-6 border-t" style={{ borderColor: C.rule }} />
      {rows.map(([k, t, d]) => (
        <div key={k} className="px-6 py-4 border-b flex gap-4 items-center" style={{ borderColor: C.rule }}>
          <div className="flex-1"><p className="ff-play text-[16px]">{t}</p><p className="text-[12.5px] mt-0.5" style={{ color: C.muted }}>{d}</p></div>
          <Switch on={pomi.prefs[k]} onClick={() => pomi.setPref(k, !pomi.prefs[k])} testId={`${T}-setting-${k}`} />
        </div>
      ))}
      <div className="px-6 py-5 border-b" style={{ borderColor: C.rule }}>
        <p className="ff-play text-[16px]">A copy of your record</p>
        <p className="text-[12.5px] mt-0.5 mb-3" style={{ color: C.muted }}>As a readable PDF for your doctor, or a CSV for yourself.</p>
        <AlmBtn variant="ghost" onClick={() => setExported(true)} data-testid={`${T}-settings-export`}>Prepare a copy</AlmBtn>
        {exported && <p className="mt-2 text-[12px] italic" style={{ color: C.muted }} data-testid={`${T}-settings-export-note`}>Concept only: the real app would create the file here.</p>}
      </div>
      <div className="px-6 py-5 border-b" style={{ borderColor: C.rule }}>
        <p className="ff-play text-[16px]">Delete everything</p>
        {!confirm ? (
          <button onClick={() => setConfirm(true)} data-testid={`${T}-settings-delete`} className="mt-2 text-[13px] underline underline-offset-4" style={{ color: C.pom }}>Remove every entry from this device</button>
        ) : (
          <div className="mt-2">
            <p className="text-[13px] mb-3" style={{ color: C.muted }}>This removes all {Object.keys(pomi.log).length} entries. It cannot be undone.</p>
            <div className="grid grid-cols-2 gap-3">
              <AlmBtn variant="ghost" onClick={() => setConfirm(false)}>Keep them</AlmBtn>
              <AlmBtn data-testid={`${T}-settings-delete-confirm`} onClick={() => { pomi.clearLog(); setConfirm(false); }}>Delete</AlmBtn>
            </div>
          </div>
        )}
      </div>
      <div className="px-6 pt-5">
        <button onClick={pomi.reset} data-testid={`${T}-settings-reset`} className="text-[13px] underline underline-offset-4" style={{ color: C.muted }}>Restore sample data</button>
      </div>
    </div>
  );
};

const SCREENS = { welcome: Welcome, home: Home, cycle: Cycle, log: Log, insights: Insights, settings: Settings };

export const AlmanacApp = ({ pomi, screen, setScreen }) => {
  const [logDate, setLogDate] = useState(null);
  const go = (s, d) => { setLogDate(d || null); setScreen(s); };
  const S = SCREENS[screen];
  return (
    <div className="h-full flex flex-col ff-source" style={{ background: C.paper, color: C.ink }}>
      <StatusBar color={C.ink} />
      <div key={screen + (logDate || "")} className="flex-1 overflow-y-auto no-scrollbar paper-grain">
        <Fade><S pomi={pomi} go={go} logDate={logDate} /></Fade>
      </div>
      {screen !== "welcome" && <Tabs screen={screen} go={go} />}
    </div>
  );
};

export const AlmanacSpecimen = () => (
  <div className="p-5 space-y-4 ff-source" style={{ background: C.paper, color: C.ink }}>
    <AlmBtn>Keep this entry</AlmBtn>
    <div className="flex gap-2"><AlmChip on>Cramps</AlmChip><AlmChip>Bloating</AlmChip></div>
    <div className="ruled-lines ff-play italic text-[15px] px-1" style={{ color: C.muted }}>How did today feel?</div>
  </div>
);
