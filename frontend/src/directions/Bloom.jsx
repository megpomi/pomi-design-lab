import { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Home as HomeIcon, CircleDot, BarChart2, Settings2, Droplet, Smile, Activity, Zap, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { StatusBar, Fade } from "../components/PhoneFrame";
import {
  PHASES, FLOW, MOODS, SYMPTOMS, ENERGY, fmt, fmtShort, iso, fromIso, todayIso, pastDays, monthGrid, addDays,
  dayKind, insights, entrySummary, useLogDraft, useOnboarding,
} from "../lib/pomi";

const C = { bg: "#F8F3EC", white: "#FFFFFF", ink: "#2B2523", muted: "#7A6F6A", rose: "#A65E66", petal: "#C9898C", milk: "#F5E3E1", clay: "#D4A090", claySoft: "#F2E2D8", sand: "#EADFCF", border: "#E8DED1" };
const T = "blm";

export const BlmBtn = ({ children, variant = "primary", className = "", ...p }) => (
  <button
    {...p}
    className={`w-full h-[52px] rounded-full ff-outfit text-[16px] font-medium flex items-center justify-center gap-2 transition-[transform,background-color,box-shadow] duration-200 active:scale-[0.97] ${
      variant === "primary" ? "bg-[#A65E66] hover:bg-[#924F57] text-white shadow-[0_8px_20px_-8px_rgba(166,94,102,0.55)]" : "bg-[#EADFCF]/70 hover:bg-[#EADFCF] text-[#2B2523]"
    } ${className}`}
  >
    {children}
  </button>
);

export const BlmChip = ({ on, children, ...p }) => (
  <button
    {...p}
    className={`h-10 px-4 rounded-full text-[14px] ff-dm border transition-[transform,background-color,border-color] duration-200 active:scale-95 inline-flex items-center gap-1.5 ${on ? "bg-[#F5E3E1] border-[#A65E66] text-[#7E3F47]" : "bg-white border-[#E8DED1] text-[#2B2523] hover:border-[#C9898C]"}`}
  >
    {on && <Check size={13} strokeWidth={2.5} />}{children}
  </button>
);

const Card = ({ children, className = "", style, ...p }) => (
  <div {...p} className={`rounded-[24px] bg-white border p-5 shadow-[0_10px_30px_-18px_rgba(90,60,50,0.25)] ${className}`} style={{ borderColor: C.border, ...style }}>{children}</div>
);

const Pill = ({ on, onClick, testId }) => (
  <button data-testid={testId} onClick={onClick} className="w-12 h-7 rounded-full relative transition-colors duration-200 shrink-0" style={{ background: on ? C.rose : C.sand }}>
    <span className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-[left] duration-200" style={{ left: on ? 24 : 4 }} />
  </button>
);

export const Orb = ({ size = 220 }) => (
  <svg width={size} height={size} viewBox="0 0 220 220">
    <circle cx="110" cy="118" r="92" fill={C.milk} />
    <circle cx="124" cy="126" r="66" fill={C.claySoft} />
    <circle cx="96" cy="132" r="44" fill={C.petal} opacity=".55" />
    <circle cx="132" cy="104" r="22" fill={C.rose} opacity=".75" />
    <path d="M100 30q10-14 20 0" stroke={C.rose} strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

const Wordmark = () => (
  <span className="ff-outfit text-[22px] font-semibold tracking-[-0.03em] flex items-center gap-1">pomi<span className="w-1.5 h-1.5 rounded-full mt-2" style={{ background: C.rose }} /></span>
);

const TABS = [["home", "Home", HomeIcon], ["cycle", "Cycle", CircleDot], ["log", "Log", Plus], ["insights", "Insights", BarChart2], ["settings", "You", Settings2]];
const Tabs = ({ screen, go }) => (
  <div className="shrink-0 px-4 pb-6 pt-2" style={{ background: C.bg }}>
    <nav className="h-16 rounded-full bg-white border flex items-center justify-around px-2 shadow-[0_12px_30px_-16px_rgba(90,60,50,0.35)]" style={{ borderColor: C.border }}>
      {TABS.map(([id, label, Icon]) =>
        id === "log" ? (
          <button key={id} data-testid={`${T}-tab-${id}`} onClick={() => go(id)} className="w-12 h-12 rounded-full grid place-items-center text-white active:scale-90 transition-transform" style={{ background: C.rose }} aria-label="Log"><Icon size={22} /></button>
        ) : (
          <button key={id} data-testid={`${T}-tab-${id}`} onClick={() => go(id)} className="flex flex-col items-center gap-0.5 w-14 transition-colors" style={{ color: screen === id ? C.rose : C.muted }}>
            <Icon size={19} strokeWidth={screen === id ? 2.2 : 1.7} />
            <span className={`text-[10.5px] ff-dm ${screen === id ? "font-semibold" : ""}`}>{label}</span>
          </button>
        ),
      )}
    </nav>
  </div>
);

const Welcome = ({ pomi, go }) => {
  const o = useOnboarding(pomi, () => go("home"));
  return (
    <div className="px-6 pt-2 pb-8 min-h-[740px] flex flex-col" data-testid={`${T}-welcome-step-${o.step}`}>
      <div className="flex justify-between items-center">
        <Wordmark />
        <div className="flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 rounded-full transition-[width,background-color] duration-300" style={{ width: i === o.step ? 22 : 6, background: i === o.step ? C.rose : C.sand }} />)}</div>
      </div>
      {o.step === 0 && (
        <div className="flex-1 flex flex-col">
          <div className="mt-6 flex justify-center"><Orb size={230} /></div>
          <h1 className="mt-6 ff-outfit text-[34px] leading-[1.08] font-medium tracking-[-0.025em]">Track in seconds.<br /><span style={{ color: C.rose }}>Understand over time.</span></h1>
          <p className="mt-3 ff-dm text-[15px] leading-relaxed" style={{ color: C.muted }}>A calm, private place for your cycle. Set up takes about 30 seconds.</p>
          <div className="mt-5 flex items-center gap-2 ff-dm text-[13px] px-4 py-3 rounded-2xl" style={{ background: C.claySoft }}>
            <ShieldCheck size={16} color={C.rose} /> Your data stays on your phone. No ads, ever.
          </div>
          <div className="mt-auto pt-6 space-y-2.5">
            <BlmBtn data-testid={`${T}-welcome-begin`} onClick={() => o.setStep(1)}>Get started <ArrowRight size={18} /></BlmBtn>
            <BlmBtn variant="ghost" data-testid={`${T}-welcome-skip`} onClick={() => go("home")}>I have an account</BlmBtn>
          </div>
        </div>
      )}
      {o.step === 1 && (
        <div className="flex-1 flex flex-col">
          <h1 className="mt-10 ff-outfit text-[28px] leading-tight font-medium tracking-[-0.02em]">When did your last period start?</h1>
          <p className="mt-2 ff-dm text-[14px]" style={{ color: C.muted }}>Best guess is totally fine.</p>
          <div className="mt-5 flex gap-2">
            {[["Today", 0], ["Yesterday", 1], ["A week ago", 7]].map(([l, n]) => (
              <BlmChip key={l} on={o.last === iso(addDays(new Date(), -n))} onClick={() => o.setLast(iso(addDays(new Date(), -n)))}>{l}</BlmChip>
            ))}
          </div>
          <Card className="mt-4 !p-4">
            <p className="ff-outfit text-[15px] font-medium mb-3" data-testid={`${T}-onboard-selected-date`}>{fmt(fromIso(o.last), { weekday: "long", day: "numeric", month: "long" })}</p>
            <div className="grid grid-cols-7 gap-1.5">
              {pastDays(28).map((d) => {
                const on = iso(d) === o.last;
                return (
                  <button key={iso(d)} data-testid={`${T}-onboard-day-${iso(d)}`} onClick={() => o.setLast(iso(d))} className="h-10 rounded-xl ff-dm text-[14px] transition-[transform,background-color] active:scale-90" style={{ background: on ? C.rose : C.bg, color: on ? "#fff" : C.ink }}>{d.getDate()}</button>
                );
              })}
            </div>
          </Card>
          <div className="mt-auto pt-6 grid grid-cols-[56px_1fr] gap-2.5">
            <button onClick={() => o.setStep(0)} data-testid={`${T}-onboard-back`} className="h-[52px] rounded-full grid place-items-center" style={{ background: C.sand }}><ChevronLeft size={20} /></button>
            <BlmBtn onClick={() => o.setStep(2)} data-testid={`${T}-onboard-next`}>Continue</BlmBtn>
          </div>
        </div>
      )}
      {o.step === 2 && (
        <div className="flex-1 flex flex-col">
          <h1 className="mt-10 ff-outfit text-[28px] leading-tight font-medium tracking-[-0.02em]">How long is your cycle?</h1>
          <Card className="mt-6 flex items-center justify-between">
            <button data-testid={`${T}-onboard-minus`} onClick={() => o.bump(-1)} className="w-12 h-12 rounded-full grid place-items-center active:scale-90 transition-transform" style={{ background: C.milk, color: C.rose }}><Minus size={18} /></button>
            <div className="text-center"><p className="ff-outfit text-[64px] leading-none font-medium tracking-tight" data-testid={`${T}-onboard-length`}>{o.len}</p><p className="ff-dm text-[13px]" style={{ color: C.muted }}>days</p></div>
            <button data-testid={`${T}-onboard-plus`} onClick={() => o.bump(1)} className="w-12 h-12 rounded-full grid place-items-center active:scale-90 transition-transform" style={{ background: C.milk, color: C.rose }}><Plus size={18} /></button>
          </Card>
          <div className="mt-4 flex flex-wrap gap-2">
            {[26, 28, 30, 32].map((n) => <BlmChip key={n} on={o.len === n} onClick={() => o.setLen(n)} data-testid={`${T}-onboard-quick-${n}`}>{n} days</BlmChip>)}
            <BlmChip on={false} onClick={() => o.setLen(28)}>Not sure</BlmChip>
          </div>
          <p className="mt-4 ff-dm text-[13px] leading-relaxed" style={{ color: C.muted }}>Not sure? We'll start at 28 and learn from what you log.</p>
          <div className="mt-auto pt-6 grid grid-cols-[56px_1fr] gap-2.5">
            <button onClick={() => o.setStep(1)} className="h-[52px] rounded-full grid place-items-center" style={{ background: C.sand }}><ChevronLeft size={20} /></button>
            <BlmBtn onClick={o.finish} data-testid={`${T}-onboard-finish`}>All set</BlmBtn>
          </div>
        </div>
      )}
    </div>
  );
};

const Ring = ({ pomi, size = 220, stroke = 14 }) => {
  const { info } = pomi;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = info.day / info.cycleLength;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.milk} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.rose} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dasharray .6s ease" }} />
    </svg>
  );
};

const Home = ({ pomi, go }) => {
  const { info } = pomi;
  const entry = pomi.log[todayIso()];
  const hour = new Date().getHours();
  const tiles = [["Flow", Droplet, C.milk], ["Mood", Smile, C.claySoft], ["Symptoms", Activity, C.sand], ["Energy", Zap, C.milk]];
  return (
    <div className="px-5 pb-6" data-testid={`${T}-home`}>
      <div className="flex justify-between items-center pt-1">
        <div><p className="ff-dm text-[13px]" style={{ color: C.muted }}>{fmt(new Date(), { weekday: "long", day: "numeric", month: "short" })}</p><h1 className="ff-outfit text-[24px] font-medium tracking-[-0.02em]">{hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"}</h1></div>
        <Wordmark />
      </div>
      <Card className="mt-4 flex flex-col items-center !pt-6">
        <div className="relative">
          <Ring pomi={pomi} size={196} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="ff-dm text-[12px]" style={{ color: C.muted }}>Cycle day</span>
            <span className="ff-outfit text-[56px] leading-none font-medium tracking-tight" data-testid={`${T}-home-cycle-day`}>{info.day}</span>
            <span className="mt-1.5 px-3 py-1 rounded-full ff-dm text-[12px] font-medium" style={{ background: C.milk, color: "#7E3F47" }}>{PHASES[info.phase].label}</span>
          </div>
        </div>
        <div className="mt-5 w-full grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl p-3.5" style={{ background: C.bg }} data-testid={`${T}-home-next-period`}>
            <p className="ff-dm text-[12px]" style={{ color: C.muted }}>Next period <span className="opacity-70">· est.</span></p>
            <p className="ff-outfit text-[19px] font-medium mt-0.5">in {info.daysUntilNext} days</p>
            <p className="ff-dm text-[12px]" style={{ color: C.muted }}>{fmt(info.nextPeriod, { weekday: "short", day: "numeric", month: "short" })}</p>
          </div>
          <div className="rounded-2xl p-3.5" style={{ background: C.bg }}>
            <p className="ff-dm text-[12px]" style={{ color: C.muted }}>Fertile window <span className="opacity-70">· est.</span></p>
            <p className="ff-outfit text-[19px] font-medium mt-0.5">{info.fertileStart.getDate()}–{fmtShort(info.fertileEnd)}</p>
            <p className="ff-dm text-[12px]" style={{ color: C.muted }}>Not birth control</p>
          </div>
        </div>
      </Card>
      <div className="mt-5 flex justify-between items-baseline"><h2 className="ff-outfit text-[17px] font-medium">Quick log</h2>{entry && <span className="ff-dm text-[12px] flex items-center gap-1" style={{ color: C.rose }} data-testid={`${T}-home-today-entry`}><Check size={13} /> {entrySummary(entry).length} logged today</span>}</div>
      <div className="mt-2.5 grid grid-cols-4 gap-2">
        {tiles.map(([l, Icon, bg]) => (
          <button key={l} data-testid={`${T}-home-quick-${l.toLowerCase()}`} onClick={() => go("log")} className="rounded-[20px] h-[84px] flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform" style={{ background: bg }}>
            <Icon size={20} color={C.rose} /><span className="ff-dm text-[12px] font-medium">{l}</span>
          </button>
        ))}
      </div>
      {!entry && <p className="mt-2 ff-dm text-[12px]" style={{ color: C.muted }} data-testid={`${T}-home-today-entry`}>Nothing logged today yet. One tap is enough.</p>}
      <Card className="mt-4 !p-4" style={{ background: C.claySoft, borderColor: "transparent" }}>
        <p className="ff-dm text-[12px] font-medium" style={{ color: "#8A5546" }}>For today</p>
        <p className="mt-1 ff-dm text-[14px] leading-relaxed">{PHASES[info.phase].note}</p>
      </Card>
    </div>
  );
};

const dotColor = (k) => ({ period: C.rose, predicted: C.petal, fertile: C.clay, ovulation: C.ink }[k] || C.sand);

const CycleRing = ({ pomi }) => {
  const { info, profile } = pomi;
  const n = info.cycleLength;
  const R = 118;
  return (
    <div className="relative mx-auto" style={{ width: 280, height: 280 }} data-testid={`${T}-cycle-ring`}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const k = dayKind(profile, addDays(info.cycleStart, i));
        const cur = i + 1 === info.day;
        const s = cur ? 22 : 12;
        return (
          <span key={i} className="absolute rounded-full transition-transform" style={{ width: s, height: s, left: 140 + R * Math.cos(a) - s / 2, top: 140 + R * Math.sin(a) - s / 2, background: k === "predicted" ? "transparent" : dotColor(k), border: k === "predicted" ? `2px solid ${C.petal}` : cur ? `4px solid ${C.white}` : "none", boxShadow: cur ? `0 0 0 2px ${C.ink}` : "none" }} />
        );
      })}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="ff-dm text-[12px]" style={{ color: C.muted }}>Day</span>
        <span className="ff-outfit text-[52px] font-medium leading-none">{info.day}</span>
        <span className="ff-dm text-[13px] mt-1" style={{ color: C.muted }}>of {info.cycleLength}</span>
      </div>
    </div>
  );
};

const Cycle = ({ pomi, go }) => {
  const now = new Date();
  const [ym, setYm] = useState([now.getFullYear(), now.getMonth()]);
  const [sel, setSel] = useState(todayIso());
  const shift = (n) => setYm(([y, m]) => [new Date(y, m + n, 1).getFullYear(), new Date(y, m + n, 1).getMonth()]);
  const selEntry = pomi.log[sel];
  return (
    <div className="px-5 pb-6" data-testid={`${T}-cycle`}>
      <h1 className="ff-outfit text-[26px] font-medium tracking-[-0.02em] pt-1">Your cycle</h1>
      <Card className="mt-3 !px-2">
        <CycleRing pomi={pomi} />
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 ff-dm text-[12px]" style={{ color: C.muted }}>
          {[["period", "Period"], ["predicted", "Period · est."], ["fertile", "Fertile · est."], ["ovulation", "Ovulation · est."]].map(([k, l]) => (
            <span key={k} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: k === "predicted" ? "transparent" : dotColor(k), border: k === "predicted" ? `1.5px solid ${C.petal}` : "none" }} />{l}</span>
          ))}
        </div>
      </Card>
      <Card className="mt-3 !p-4">
        <div className="flex justify-between items-center">
          <p className="ff-outfit text-[17px] font-medium">{fmt(new Date(ym[0], ym[1], 1), { month: "long", year: "numeric" })}</p>
          <div className="flex gap-1">
            <button data-testid={`${T}-cycle-prev`} onClick={() => shift(-1)} className="w-8 h-8 rounded-full grid place-items-center" style={{ background: C.bg }}><ChevronLeft size={16} /></button>
            <button data-testid={`${T}-cycle-next`} onClick={() => shift(1)} className="w-8 h-8 rounded-full grid place-items-center" style={{ background: C.bg }}><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="ff-dm text-[11px] pb-1" style={{ color: C.muted }}>{d}</span>)}
          {monthGrid(ym[0], ym[1]).map((d, i) => {
            if (!d) return <span key={i} />;
            const k = dayKind(pomi.profile, d);
            const id = iso(d);
            const bg = { period: C.rose, fertile: C.claySoft, ovulation: C.clay }[k];
            return (
              <button key={id} data-testid={`${T}-cal-day-${id}`} onClick={() => setSel(id)} className="relative h-10 grid place-items-center">
                <span className="w-9 h-9 rounded-full grid place-items-center ff-dm text-[13px] transition-transform active:scale-90" style={{ background: bg || "transparent", color: k === "period" ? "#fff" : C.ink, border: k === "predicted" ? `1.5px dashed ${C.rose}` : sel === id ? `1.5px solid ${C.ink}` : "none", outline: sel === id && k === "predicted" ? `1.5px solid ${C.ink}` : "none", outlineOffset: 1 }}>{d.getDate()}</span>
                {pomi.log[id] && <span className="absolute bottom-0 w-1 h-1 rounded-full" style={{ background: C.rose }} data-testid={`${T}-cal-logged-${id}`} />}
              </button>
            );
          })}
        </div>
      </Card>
      <Card className="mt-3 !p-4 flex items-center gap-3" data-testid={`${T}-cycle-selected`}>
        <div className="flex-1">
          <p className="ff-dm text-[12px]" style={{ color: C.muted }}>{fmt(fromIso(sel), { weekday: "long", day: "numeric", month: "short" })}</p>
          <p className="ff-dm text-[14px] mt-0.5">{selEntry ? entrySummary(selEntry).join(", ") || "Note added" : "Nothing logged"}</p>
        </div>
        {fromIso(sel) <= new Date() && <button onClick={() => go("log", sel)} data-testid={`${T}-cycle-write`} className="h-9 px-4 rounded-full ff-dm text-[13px] font-medium text-white" style={{ background: C.rose }}>{selEntry ? "Edit" : "Log"}</button>}
      </Card>
    </div>
  );
};

const FlowDrop = ({ level }) => (
  <svg width="22" height="26" viewBox="0 0 22 26">
    <defs><clipPath id={`d${level}`}><path d="M11 1C11 1 2 11 2 17a9 9 0 0018 0C20 11 11 1 11 1z" /></clipPath></defs>
    <path d="M11 1C11 1 2 11 2 17a9 9 0 0018 0C20 11 11 1 11 1z" fill="none" stroke={C.rose} strokeWidth="1.5" />
    <rect x="0" y={26 - level * 6} width="22" height="26" fill={C.rose} clipPath={`url(#d${level})`} />
  </svg>
);

const Block = ({ title, children }) => (
  <Card className="mt-3 !p-4"><p className="ff-outfit text-[16px] font-medium mb-3">{title}</p>{children}</Card>
);

const Log = ({ pomi, go, logDate }) => {
  const L = useLogDraft(pomi, logDate);
  return (
    <div className="px-5 pb-6 relative" data-testid={`${T}-log`}>
      <h1 className="ff-outfit text-[26px] font-medium tracking-[-0.02em] pt-1">Log your day</h1>
      <div className="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar">
        {pastDays(7).map((d) => {
          const on = L.date === iso(d);
          return (
            <button key={iso(d)} data-testid={`${T}-log-date-${iso(d)}`} onClick={() => L.pick(iso(d))} className="flex-1 min-w-[42px] h-[62px] rounded-2xl flex flex-col items-center justify-center transition-colors" style={{ background: on ? C.ink : C.white, color: on ? "#fff" : C.ink, border: `1px solid ${on ? C.ink : C.border}` }}>
              <span className="ff-dm text-[10.5px] opacity-70">{fmt(d, { weekday: "short" })}</span>
              <span className="ff-outfit text-[17px] font-medium">{d.getDate()}</span>
              {pomi.log[iso(d)] && <span className="w-1 h-1 rounded-full" style={{ background: on ? "#fff" : C.rose }} />}
            </button>
          );
        })}
      </div>
      <Block title="Flow">
        <div className="grid grid-cols-5 gap-1.5">
          {FLOW.map((f, i) => {
            const on = L.draft.flow === f.id;
            return (
              <button key={f.id} data-testid={`${T}-log-flow-${f.id}`} onClick={() => L.set("flow", f.id)} className="h-[76px] rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-[transform,background-color] active:scale-95" style={{ background: on ? C.milk : C.bg, borderColor: on ? C.rose : "transparent" }}>
                <FlowDrop level={[0, 0.6, 1.4, 2.6, 4][i]} /><span className="ff-dm text-[11px]">{f.label}</span>
              </button>
            );
          })}
        </div>
      </Block>
      <Block title="Mood"><div className="flex flex-wrap gap-2">{MOODS.map((m) => <BlmChip key={m.id} data-testid={`${T}-log-mood-${m.id}`} on={L.draft.moods.includes(m.id)} onClick={() => L.toggle("moods", m.id)}>{m.label}</BlmChip>)}</div></Block>
      <Block title="Symptoms"><div className="flex flex-wrap gap-2">{SYMPTOMS.map((s) => <BlmChip key={s.id} data-testid={`${T}-log-symptom-${s.id}`} on={L.draft.symptoms.includes(s.id)} onClick={() => L.toggle("symptoms", s.id)}>{s.label}</BlmChip>)}</div></Block>
      <Block title="Energy">
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-full" style={{ background: C.bg }}>
          {ENERGY.map((e) => (
            <button key={e.id} data-testid={`${T}-log-energy-${e.id}`} onClick={() => L.set("energy", L.draft.energy === e.id ? null : e.id)} className="h-10 rounded-full ff-dm text-[14px] transition-[background-color,box-shadow]" style={{ background: L.draft.energy === e.id ? C.white : "transparent", boxShadow: L.draft.energy === e.id ? "0 4px 12px -6px rgba(90,60,50,.4)" : "none", color: L.draft.energy === e.id ? C.rose : C.ink, fontWeight: L.draft.energy === e.id ? 600 : 400 }}>{e.label}</button>
          ))}
        </div>
      </Block>
      <Block title="Note">
        <textarea data-testid={`${T}-log-note`} value={L.draft.note} onChange={(e) => L.set("note", e.target.value)} rows={2} placeholder="Anything else? (optional)" className="w-full rounded-2xl p-3 ff-dm text-[14px] outline-none border border-transparent focus:border-[#C9898C] resize-none transition-colors" style={{ background: C.bg }} />
      </Block>
      <div className="sticky bottom-2 mt-4 pt-2">
        {L.saved && (
          <div className="mb-2 rounded-2xl px-4 py-2.5 flex items-center justify-between ff-dm text-[13px] text-white" style={{ background: C.ink }} data-testid={`${T}-log-saved`}>
            <span className="flex items-center gap-1.5"><Check size={14} /> Saved on this phone</span>
            <button onClick={() => go("cycle")} className="underline">View cycle</button>
          </div>
        )}
        <BlmBtn onClick={L.save} data-testid={`${T}-log-save`}>{L.saved ? "Saved" : L.existed ? "Update log" : "Save log"}</BlmBtn>
      </div>
    </div>
  );
};

const Insights = ({ pomi }) => {
  const s = insights(pomi);
  return (
    <div className="px-5 pb-6" data-testid={`${T}-insights`}>
      <h1 className="ff-outfit text-[26px] font-medium tracking-[-0.02em] pt-1">Insights</h1>
      <p className="ff-dm text-[13px]" style={{ color: C.muted }}>{fmt(new Date(), { month: "long" })} · from {s.days} logged days</p>
      <Card className="mt-4">
        <p className="ff-dm text-[13px]" style={{ color: C.muted }}>Average cycle</p>
        <div className="flex items-end justify-between">
          <p className="ff-outfit text-[44px] font-medium leading-none mt-1" data-testid={`${T}-insights-avg`}>{s.avg.toFixed(1)}<span className="text-[16px] ml-1" style={{ color: C.muted }}>days</span></p>
          <div className="flex items-end gap-1.5 h-14">
            {s.h.map((c, i) => <span key={i} className="w-3.5 rounded-full" style={{ height: `${((c.length - 22) / 10) * 100}%`, background: i === s.h.length - 1 ? C.rose : C.petal, opacity: i === s.h.length - 1 ? 1 : 0.5 }} />)}
          </div>
        </div>
        <p className="mt-3 ff-dm text-[13px] px-3 py-2 rounded-xl inline-block" style={{ background: C.bg }}>Range {s.min}–{s.max} days · fairly regular</p>
      </Card>
      <Card className="mt-3">
        <p className="ff-outfit text-[16px] font-medium mb-3">Most logged</p>
        <div className="flex flex-wrap gap-2">
          {s.top.map((t, i) => (
            <span key={t.id} className="h-9 pl-4 pr-1.5 rounded-full flex items-center gap-2 ff-dm text-[14px]" style={{ background: i === 0 ? C.milk : C.bg }}>
              {t.label}<span className="w-6 h-6 rounded-full grid place-items-center text-[11px] font-semibold bg-white" style={{ color: C.rose }}>{t.n}</span>
            </span>
          ))}
        </div>
      </Card>
      <p className="mt-5 ff-outfit text-[17px] font-medium">What we noticed</p>
      {s.takeaways.map((t, i) => (
        <Card key={i} className="mt-2.5 !p-4 flex gap-3">
          <span className="w-8 h-8 rounded-full shrink-0 grid place-items-center" style={{ background: [C.milk, C.claySoft, C.sand][i] }}>{[<CircleDot key="a" size={15} color={C.rose} />, <Activity key="b" size={15} color={C.rose} />, <Droplet key="c" size={15} color={C.rose} />][i]}</span>
          <p className="ff-dm text-[14px] leading-relaxed">{t}</p>
        </Card>
      ))}
      <p className="mt-4 ff-dm text-[12px] leading-relaxed text-center px-4" style={{ color: C.muted }}>Predictions are estimates based on your logs, not medical advice or birth control.</p>
    </div>
  );
};

const Settings = ({ pomi }) => {
  const [confirm, setConfirm] = useState(false);
  const [exported, setExported] = useState(false);
  const n = Object.keys(pomi.log).length;
  return (
    <div className="px-5 pb-6" data-testid={`${T}-settings`}>
      <h1 className="ff-outfit text-[26px] font-medium tracking-[-0.02em] pt-1">You & your data</h1>
      <Card className="mt-4 !p-4 flex gap-3 items-center" style={{ background: C.claySoft, borderColor: "transparent" }}>
        <span className="w-11 h-11 rounded-full bg-white grid place-items-center"><ShieldCheck size={20} color={C.rose} /></span>
        <div><p className="ff-outfit text-[15px] font-medium">Private by design</p><p className="ff-dm text-[12.5px]" style={{ color: "#6E5248" }}>{n} logs, stored only on this phone</p></div>
      </Card>
      <Card className="mt-3 !p-0 overflow-hidden">
        {[["reminders", "Period reminder", "2 days before, estimated"], ["discreet", "Discreet notifications", "No health words on lock screen"], ["lock", "Face ID lock", "Lock when you leave the app"]].map(([k, t, d], i) => (
          <div key={k} className={`flex items-center gap-3 px-4 py-3.5 ${i ? "border-t" : ""}`} style={{ borderColor: C.border }}>
            <div className="flex-1"><p className="ff-dm text-[14.5px] font-medium">{t}</p><p className="ff-dm text-[12px]" style={{ color: C.muted }}>{d}</p></div>
            <Pill on={pomi.prefs[k]} onClick={() => pomi.setPref(k, !pomi.prefs[k])} testId={`${T}-setting-${k}`} />
          </div>
        ))}
      </Card>
      <Card className="mt-3 !p-4">
        <p className="ff-dm text-[14.5px] font-medium">Export your data</p>
        <p className="ff-dm text-[12px] mb-3" style={{ color: C.muted }}>A PDF to share with your doctor, or a CSV for you.</p>
        <BlmBtn variant="ghost" onClick={() => setExported(true)} data-testid={`${T}-settings-export`}>Export</BlmBtn>
        {exported && <p className="mt-2 ff-dm text-[12px] text-center" style={{ color: C.muted }} data-testid={`${T}-settings-export-note`}>Concept only: nothing is exported in this preview.</p>}
      </Card>
      <Card className="mt-3 !p-4">
        <p className="ff-dm text-[14.5px] font-medium">Delete all data</p>
        {!confirm ? (
          <button onClick={() => setConfirm(true)} data-testid={`${T}-settings-delete`} className="mt-2 h-10 px-4 rounded-full ff-dm text-[13px] font-medium border" style={{ borderColor: C.petal, color: C.rose }}>Delete {n} logs</button>
        ) : (
          <div className="mt-2">
            <p className="ff-dm text-[13px] mb-3" style={{ color: C.muted }}>All {n} logs will be removed from this phone. This can't be undone.</p>
            <div className="grid grid-cols-2 gap-2">
              <BlmBtn variant="ghost" onClick={() => setConfirm(false)}>Cancel</BlmBtn>
              <BlmBtn onClick={() => { pomi.clearLog(); setConfirm(false); }} data-testid={`${T}-settings-delete-confirm`}>Delete</BlmBtn>
            </div>
          </div>
        )}
      </Card>
      <button onClick={pomi.reset} data-testid={`${T}-settings-reset`} className="mt-4 w-full ff-dm text-[13px] underline underline-offset-4" style={{ color: C.muted }}>Restore sample data</button>
    </div>
  );
};

const SCREENS = { welcome: Welcome, home: Home, cycle: Cycle, log: Log, insights: Insights, settings: Settings };

export const BloomApp = ({ pomi, screen, setScreen }) => {
  const [logDate, setLogDate] = useState(null);
  const go = (s, d) => { setLogDate(d || null); setScreen(s); };
  const S = SCREENS[screen];
  return (
    <div className="h-full flex flex-col ff-dm" style={{ background: C.bg, color: C.ink }}>
      <StatusBar color={C.ink} />
      <div key={screen + (logDate || "")} className="flex-1 overflow-y-auto no-scrollbar">
        <Fade><S pomi={pomi} go={go} logDate={logDate} /></Fade>
      </div>
      {screen !== "welcome" && <Tabs screen={screen} go={go} />}
    </div>
  );
};

export const BloomSpecimen = () => (
  <div className="p-5 space-y-3" style={{ background: C.bg, color: C.ink }}>
    <BlmBtn>Save log</BlmBtn>
    <div className="flex gap-2"><BlmChip on>Cramps</BlmChip><BlmChip>Bloating</BlmChip></div>
    <div className="rounded-2xl p-3 ff-dm text-[14px] bg-white border" style={{ borderColor: C.border, color: C.muted }}>Anything else? (optional)</div>
  </div>
);
