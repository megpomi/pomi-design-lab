import { SCREENS } from "../data/directions";
import { SPECIMENS } from "../directions";

const H = ({ n, children }) => (
  <h3 className="flex items-baseline gap-3 text-[11px] uppercase tracking-[0.24em] text-[#78716C] mb-5">
    <span className="ff-corm italic text-[18px] normal-case tracking-normal text-[#7D2638]">{n}</span>{children}
  </h3>
);
const Block = ({ children, testId }) => <section className="py-10 border-t border-[#E7E2DA]" data-testid={testId}>{children}</section>;

const Palette = ({ d }) => (
  <Block testId="rationale-palette">
    <H n="ii">Colour palette</H>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {d.palette.map((p) => (
        <div key={p.hex} className="rounded-xl border border-[#E7E2DA] bg-white overflow-hidden">
          <div className="h-16" style={{ background: p.hex }} />
          <div className="px-3 py-2"><p className="text-[12.5px] font-medium">{p.name}</p><p className="text-[11px] text-[#78716C] font-mono" data-testid={`swatch-${p.hex.slice(1).toLowerCase()}`}>{p.hex}</p></div>
        </div>
      ))}
    </div>
    <p className="mt-5 text-[14px] leading-relaxed text-[#57534E]">{d.paletteNote}</p>
  </Block>
);

const Type = ({ d }) => (
  <Block testId="rationale-typography">
    <H n="iii">Typography</H>
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-[#E7E2DA] bg-white p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#78716C]">Display</p>
        <p className={`${d.fonts.displayClass} text-[44px] leading-none mt-3`}>Aa 28</p>
        <p className="text-[12.5px] mt-3 text-[#57534E]">{d.fonts.display}</p>
      </div>
      <div className="rounded-xl border border-[#E7E2DA] bg-white p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#78716C]">Text & labels</p>
        <p className={`${d.fonts.textClass} text-[15px] leading-relaxed mt-3`}>Next period, estimated for 26 June. Based on your last six cycles.</p>
        <p className="text-[12.5px] mt-3 text-[#57534E]">{d.fonts.text}</p>
      </div>
    </div>
    <p className="mt-5 text-[14px] leading-relaxed text-[#57534E]">{d.typeNote}</p>
  </Block>
);

const Components = ({ d }) => {
  const Spec = SPECIMENS[d.id];
  return (
    <Block testId="rationale-components">
      <H n="iv">Buttons, cards & inputs</H>
      <div className="grid sm:grid-cols-2 gap-6 items-start">
        <div className="rounded-xl border border-[#E7E2DA] overflow-hidden"><Spec /></div>
        <dl className="space-y-4">
          {d.components.map(([k, v]) => (
            <div key={k}><dt className="text-[13px] font-semibold">{k}</dt><dd className="text-[13.5px] leading-relaxed text-[#57534E] mt-1">{v}</dd></div>
          ))}
        </dl>
      </div>
    </Block>
  );
};

const Screens = ({ d, screen, setScreen }) => (
  <Block testId="rationale-screens">
    <H n="v">Screen by screen</H>
    <div className="divide-y divide-[#E7E2DA]">
      {SCREENS.map((s, i) => (
        <button key={s.id} onClick={() => setScreen(s.id)} data-testid={`rationale-screen-${s.id}`} className={`w-full text-left py-4 grid grid-cols-[28px_110px_1fr] gap-3 group transition-colors ${screen === s.id ? "" : "opacity-75 hover:opacity-100"}`}>
          <span className="ff-corm italic text-[16px] text-[#7D2638]">{i + 1}</span>
          <span className={`text-[13px] font-semibold ${screen === s.id ? "text-[#7D2638]" : ""}`}>{s.label}</span>
          <span className="text-[13.5px] leading-relaxed text-[#57534E]">{d.screens[s.id]}</span>
        </button>
      ))}
    </div>
  </Block>
);

const List = ({ n, title, items, testId }) => (
  <Block testId={testId}>
    <H n={n}>{title}</H>
    <ul className="space-y-3">
      {items.map((t) => <li key={t} className="flex gap-4 text-[15px] leading-relaxed"><span className="mt-[11px] w-5 h-px bg-[#7D2638] shrink-0" />{t}</li>)}
    </ul>
  </Block>
);

export const Rationale = ({ d, screen, setScreen }) => (
  <div data-testid={`rationale-panel-${d.id}`}>
    <div className="pb-10">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#78716C]">Direction {d.num} · {d.tagline}</p>
      <h1 className="mt-4 ff-corm text-5xl sm:text-6xl leading-[0.95] tracking-tight" data-testid="rationale-name">{d.name}</h1>
      <p className="mt-3 ff-corm italic text-2xl text-[#7D2638]">{d.line}</p>
    </div>
    <Block testId="rationale-mood"><H n="i">Visual mood</H><p className="text-base md:text-lg leading-relaxed text-[#44403C]">{d.mood}</p></Block>
    <Palette d={d} />
    <Type d={d} />
    <Components d={d} />
    <Screens d={d} screen={screen} setScreen={setScreen} />
    <List n="vi" title="Why it feels premium & trustworthy" items={d.premium} testId="rationale-premium" />
    <List n="vii" title="Not a childish or generic tracker" items={d.different} testId="rationale-different" />
  </div>
);
