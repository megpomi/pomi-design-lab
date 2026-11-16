import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DIRECTIONS, SCREENS } from "../data/directions";
import { APPS } from "../directions";
import { ScaledPhone } from "../components/PhoneFrame";
import { usePomi } from "../lib/pomi";

const useScale = () => {
  const calc = () => (window.innerWidth >= 1400 ? 0.92 : window.innerWidth >= 1100 ? 0.78 : 0.72);
  const [s, setS] = useState(calc);
  useEffect(() => { const f = () => setS(calc()); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  return s;
};

const Column = ({ d, screen, setScreen, scale }) => {
  const pomi = usePomi(d.id);
  const App = APPS[d.id];
  return (
    <div className="snap-center shrink-0 flex flex-col items-center" data-testid={`compare-column-${d.id}`}>
      <Link to={`/direction/${d.id}`} className="mb-5 text-center group">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[#78716C]">{d.num} · {d.tagline}</span>
        <span className="block ff-corm text-3xl mt-1 group-hover:text-[#7D2638] transition-colors">{d.name}</span>
      </Link>
      <ScaledPhone scale={scale} testId={`compare-phone-${d.id}`}><App pomi={pomi} screen={screen} setScreen={setScreen} /></ScaledPhone>
    </div>
  );
};

export default function Compare() {
  const [screen, setScreen] = useState("home");
  const scale = useScale();
  return (
    <main className="max-w-[1500px] mx-auto px-5 sm:px-10 py-10 sm:py-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#78716C]">Side by side</p>
          <h1 className="mt-4 ff-corm text-5xl sm:text-6xl leading-[0.95] tracking-tight">One moment, <span className="italic text-[#7D2638]">three voices.</span></h1>
          <p className="mt-4 max-w-lg text-[15px] text-[#57534E]">Pick a screen to see how each direction handles it. Tapping inside any phone moves all three together.</p>
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar p-1 rounded-full bg-[#EFEAE2] self-start lg:self-auto" data-testid="compare-screen-selector">
          {SCREENS.map((s) => (
            <button key={s.id} onClick={() => setScreen(s.id)} data-testid={`compare-screen-${s.id}`} className={`h-9 px-4 rounded-full text-[13px] whitespace-nowrap transition-colors duration-200 ${screen === s.id ? "bg-[#1C1917] text-[#FAF8F5]" : "text-[#57534E] hover:text-[#1C1917]"}`}>{s.label}</button>
          ))}
        </div>
      </div>
      <div className="mt-12 flex gap-8 xl:gap-12 justify-start xl:justify-center overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 -mx-5 px-5">
        {DIRECTIONS.map((d) => <Column key={d.id} d={d} screen={screen} setScreen={setScreen} scale={scale} />)}
      </div>
    </main>
  );
}
