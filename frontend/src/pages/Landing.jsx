import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DIRECTIONS } from "../data/directions";
import { APPS } from "../directions";
import { ScaledPhone } from "../components/PhoneFrame";
import { usePomi } from "../lib/pomi";

const rise = (i) => ({ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] } });

const Preview = ({ id }) => {
  const pomi = usePomi(id);
  const [screen, setScreen] = useState("home");
  const App = APPS[id];
  return (
    <div className="pointer-events-none select-none">
      <ScaledPhone scale={0.62}><App pomi={pomi} screen={screen} setScreen={setScreen} /></ScaledPhone>
    </div>
  );
};

const DirectionRow = ({ d, i }) => (
  <motion.article {...rise(0)} className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center py-16 sm:py-24 border-t border-[#E7E2DA] ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`} data-testid={`direction-card-${d.id}`}>
    <div className="lg:col-span-7">
      <div className="flex items-baseline gap-4">
        <span className="ff-corm text-[56px] leading-none text-[#D6CFC7]">{d.num}</span>
        <span className="text-[11px] uppercase tracking-[0.24em] text-[#78716C]">{d.tagline}</span>
      </div>
      <h2 className="mt-4 ff-corm text-5xl sm:text-6xl leading-[0.95] tracking-tight">{d.name}</h2>
      <p className="mt-3 ff-corm italic text-2xl text-[#7D2638]">{d.line}</p>
      <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#57534E]">{d.mood}</p>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <div className="flex -space-x-1.5">
          {d.palette.map((p) => <span key={p.hex} title={`${p.name} ${p.hex}`} className="w-8 h-8 rounded-full ring-2 ring-[#FAF8F5]" style={{ background: p.hex }} />)}
        </div>
        <div className="text-[13px] text-[#57534E]">
          <span className={`${d.fonts.displayClass} text-[18px] text-[#1C1917]`}>{d.fonts.display}</span>
          <span className="mx-2 text-[#D6CFC7]">/</span>
          <span className={d.fonts.textClass}>{d.fonts.text}</span>
        </div>
      </div>
      <Link to={`/direction/${d.id}`} data-testid={`open-direction-${d.id}`} className="group mt-10 inline-flex items-center gap-3 h-12 pl-6 pr-4 rounded-full bg-[#1C1917] text-[#FAF8F5] text-[14px] hover:bg-[#7D2638] transition-colors duration-300">
        Explore {d.name}
        <span className="w-7 h-7 rounded-full bg-[#FAF8F5]/10 grid place-items-center transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight size={15} /></span>
      </Link>
    </div>
    <Link to={`/direction/${d.id}`} className="lg:col-span-5 flex justify-center lg:justify-end transition-transform duration-500 hover:-translate-y-2" data-testid={`preview-direction-${d.id}`}>
      <Preview id={d.id} />
    </Link>
  </motion.article>
);

export default function Landing() {
  return (
    <main className="gallery-noise">
      <section className="max-w-[1400px] mx-auto px-5 sm:px-10 pt-20 sm:pt-28 pb-16 sm:pb-24">
        <motion.p {...rise(0)} className="text-[11px] uppercase tracking-[0.28em] text-[#78716C]">Concept exploration · Vol. 01 · {new Date().getFullYear()}</motion.p>
        <motion.h1 {...rise(1)} className="mt-6 ff-corm text-5xl sm:text-6xl lg:text-[96px] leading-[0.92] tracking-tight max-w-5xl">
          Three ways to hold a cycle <span className="italic text-[#7D2638]">with care.</span>
        </motion.h1>
        <div className="mt-10 grid md:grid-cols-12 gap-8">
          <motion.p {...rise(2)} className="md:col-span-5 md:col-start-1 text-base md:text-lg leading-relaxed text-[#57534E]">
            Pomi is a period tracker for adults who want clarity without condescension. These three directions share one brief (calm, honest, warm, private) and answer it in different voices: editorial, precise and tactile.
          </motion.p>
          <motion.div {...rise(3)} className="md:col-span-5 md:col-start-8 text-[13px] text-[#57534E] space-y-3">
            {["Each direction is fully tappable: six screens inside a live phone mockup.", "Logging works and is saved on this device, separately for each direction.", "Rationale sits beside every phone: palette, type, components and why it earns trust."].map((t, i) => (
              <p key={i} className="flex gap-3 border-t border-[#E7E2DA] pt-3"><span className="ff-corm italic text-[#7D2638] text-[16px]">0{i + 1}</span>{t}</p>
            ))}
          </motion.div>
        </div>
      </section>
      <section className="max-w-[1400px] mx-auto px-5 sm:px-10">
        {DIRECTIONS.map((d, i) => <DirectionRow key={d.id} d={d} i={i} />)}
      </section>
      <section className="max-w-[1400px] mx-auto px-5 sm:px-10 py-20 sm:py-28 border-t border-[#E7E2DA] grid md:grid-cols-12 gap-8 items-end">
        <h2 className="md:col-span-7 ff-corm text-4xl sm:text-5xl leading-tight">See the same moment, <span className="italic">three ways.</span></h2>
        <div className="md:col-span-5 md:text-right">
          <Link to="/compare" data-testid="landing-compare-link" className="inline-flex items-center gap-3 h-12 px-6 rounded-full border border-[#1C1917]/20 text-[14px] hover:bg-[#1C1917] hover:text-[#FAF8F5] transition-colors duration-300">
            Open side-by-side compare <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
      <footer className="max-w-[1400px] mx-auto px-5 sm:px-10 py-10 border-t border-[#E7E2DA] text-[12px] text-[#78716C] flex flex-col sm:flex-row justify-between gap-2">
        <span>Pomi concept showcase. Sample data only; predictions are illustrative estimates, not medical advice.</span>
        <span>Concept names are placeholders.</span>
      </footer>
    </main>
  );
}
