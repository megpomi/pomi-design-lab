import { Link, NavLink } from "react-router-dom";
import { DIRECTIONS } from "../data/directions";

const linkCls = ({ isActive }) =>
  `px-3 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors duration-200 ${isActive ? "bg-[#1C1917] text-[#FAF8F5]" : "text-[#57534E] hover:text-[#1C1917] hover:bg-[#EFEAE2]"}`;

export const ShowcaseHeader = () => (
  <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#FAF8F5]/80 border-b border-[#E7E2DA]">
    <div className="max-w-[1400px] mx-auto px-5 sm:px-10 h-16 flex items-center justify-between gap-4">
      <Link to="/" className="flex items-baseline gap-2 shrink-0" data-testid="nav-home-link">
        <span className="ff-corm italic text-[26px] text-[#7D2638] leading-none">Pomi</span>
        <span className="hidden sm:inline text-[11px] uppercase tracking-[0.22em] text-[#78716C]">Visual directions</span>
      </Link>
      <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar min-w-0">
        {DIRECTIONS.map((d) => (
          <NavLink key={d.id} to={`/direction/${d.id}`} className={linkCls} data-testid={`nav-direction-${d.id}`}>
            <span className="hidden md:inline text-[#A8A29E] mr-1">{d.num}</span><span className="sm:hidden">{d.num}</span><span className="hidden sm:inline">{d.name}</span>
          </NavLink>
        ))}
        <NavLink to="/compare" className={linkCls} data-testid="nav-compare">Compare</NavLink>
      </nav>
    </div>
  </header>
);
