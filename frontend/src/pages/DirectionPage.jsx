import { useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { RotateCcw, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { byId, DIRECTIONS, SCREENS } from "../data/directions";
import { APPS } from "../directions";
import { PhoneFrame } from "../components/PhoneFrame";
import { Rationale } from "../components/Rationale";
import { usePomi } from "../lib/pomi";

const ScreenJumper = ({ screen, setScreen }) => (
  <div className="flex gap-1 overflow-x-auto no-scrollbar p-1 rounded-full bg-[#EFEAE2] max-w-full" data-testid="screen-jumper">
    {SCREENS.map((s) => (
      <button key={s.id} onClick={() => setScreen(s.id)} data-testid={`screen-jump-${s.id}`} className={`h-8 px-3.5 rounded-full text-[12.5px] whitespace-nowrap transition-colors duration-200 ${screen === s.id ? "bg-white text-[#1C1917] shadow-sm" : "text-[#78716C] hover:text-[#1C1917]"}`}>
        {s.label}
      </button>
    ))}
  </div>
);

const DirectionView = ({ d }) => {
  const pomi = usePomi(d.id);
  const [screen, setScreen] = useState("welcome");
  const App = APPS[d.id];
  const next = DIRECTIONS[(DIRECTIONS.indexOf(d) + 1) % DIRECTIONS.length];
  const reset = () => { pomi.reset(); setScreen("welcome"); toast("Sample data restored for " + d.name); };
  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-10 py-6 sm:py-12 grid grid-cols-1 lg:grid-cols-[430px_minmax(0,1fr)] gap-10 lg:gap-20">
      <div className="lg:sticky lg:top-24 self-start w-full min-w-0 flex flex-col items-center gap-5">
        <ScreenJumper screen={screen} setScreen={setScreen} />
        <PhoneFrame fluid testId={`phone-${d.id}`}>
          <App pomi={pomi} screen={screen} setScreen={setScreen} />
        </PhoneFrame>
        <div className="flex items-center gap-4 text-[12.5px] text-[#78716C]">
          <span>Tap inside the phone · entries save on this device</span>
          <button onClick={reset} data-testid="reset-sample-data" className="inline-flex items-center gap-1.5 hover:text-[#7D2638] transition-colors"><RotateCcw size={13} /> Reset</button>
        </div>
      </div>
      <div className="min-w-0">
        <Rationale d={d} screen={screen} setScreen={setScreen} />
        <Link to={`/direction/${next.id}`} data-testid="next-direction-link" className="group mt-4 flex items-center justify-between py-10 border-t border-[#E7E2DA]">
          <span><span className="text-[11px] uppercase tracking-[0.24em] text-[#78716C]">Next direction</span><span className="block ff-corm text-4xl mt-2 group-hover:text-[#7D2638] transition-colors">{next.name}</span></span>
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
        </Link>
      </div>
    </main>
  );
};

export default function DirectionPage() {
  const { id } = useParams();
  const d = byId(id);
  if (!d) return <Navigate to="/" replace />;
  return <DirectionView key={d.id} d={d} />;
}
