import { Signal, Wifi, BatteryFull } from "lucide-react";
import { motion } from "framer-motion";

export const StatusBar = ({ color }) => (
  <div className="h-[50px] shrink-0 flex items-center justify-between pl-8 pr-7 pt-1 text-[14px] font-semibold ff-jak" style={{ color }}>
    <span>9:41</span>
    <span className="flex items-center gap-1.5"><Signal size={14} /><Wifi size={14} /><BatteryFull size={20} /></span>
  </div>
);

export const Fade = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>
);

export const PhoneFrame = ({ children, fluid = false, testId }) => (
  <div className={`phone ${fluid ? "phone-fluid" : ""}`} data-testid={testId}>
    <div className="phone-island" />
    <div className="phone-screen">{children}</div>
  </div>
);

export const ScaledPhone = ({ scale, children, testId }) => (
  <div style={{ width: 390 * scale, height: 812 * scale }} className="relative shrink-0" data-testid={testId}>
    <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: 390, height: 812 }} className="absolute left-0 top-0">
      <PhoneFrame>{children}</PhoneFrame>
    </div>
  </div>
);
