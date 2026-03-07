import { useEffect, useState, useRef } from 'react';
import { X, Tablet, Monitor, Info } from 'lucide-react';
import SlideCard from './SlideCard';
import { getTodayHebrewDate } from '../utils/hebrewDate';
import logo from "../assets/original-logo.jpg";

const PreviewModal = ({ isOpen, onClose, data }) => {
  const [scale, setScale] = useState(1);
  
  // Simulated tablet dimensions (Landscape Kiosk Standard)
  const SIM_WIDTH = 1280;
  const SIM_HEIGHT = 800;

  useEffect(() => {
    if (!isOpen) return;

    const calculateScale = () => {
      const padding = 60; // Margin around the simulator
      const topBarHeight = 80;
      const availableWidth = window.innerWidth - padding;
      const availableHeight = window.innerHeight - topBarHeight - padding;

      const scaleW = availableWidth / SIM_WIDTH;
      const scaleH = availableHeight / SIM_HEIGHT;
      
      // We scale down if the window is smaller than 1280x800
      const newScale = Math.min(scaleW, scaleH, 1);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('resize', calculateScale);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const displayHebrewDate = data.hebrewDate || getTodayHebrewDate();

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center overflow-hidden animate-in fade-in duration-300 font-admin" dir="rtl">
      
      {/* 1. TOP CONTROL BAR */}
      <header className="w-full flex-none flex justify-between items-center px-8 py-4 bg-white/5 border-b border-white/10 z-[110]">
        <div className="flex items-center gap-5 text-white">
          <div className="bg-lev-burgundy p-2.5 rounded-xl shadow-lg shadow-lev-burgundy/20">
            <Monitor size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-black text-xl leading-none tracking-tight">סימולטור תצוגה דיגיטלית</h3>
            <div className="flex items-center gap-2 text-gray-400 mt-1.5">
              <Info size={14} className="text-lev-yellow/70" />
              <p className="text-xs font-medium uppercase tracking-wider">Simulation: 1280x800 Landscape Kiosk Mode</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 active:scale-95 text-white px-6 py-2.5 rounded-2xl transition-all flex items-center gap-3 font-black text-sm border border-white/10 group shadow-lg"
        >
          <span>יציאה מהתצוגה</span>
          <X size={20} className="group-hover:rotate-90 transition-transform" />
        </button>
      </header>

      {/* 2. SIMULATOR STAGE (The "Room") */}
      <div className="flex-1 w-full flex items-center justify-center p-6 relative bg-[radial-gradient(circle_at_center,_rgba(40,40,40,1)_0%,_rgba(10,10,10,1)_100%)]">
        
        {/* THE SIMULATED TABLET BODY */}
        <div 
          className="relative shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)] rounded-[32px] overflow-hidden border-[16px] border-[#1a1a1a] bg-black transition-transform duration-500 ease-out flex-none"
          style={{ 
            width: `${SIM_WIDTH}px`, 
            height: `${SIM_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          {/* INTERNAL CONTENT (The actual Kiosk View) */}
          <div className="w-full h-full bg-lev-yellow relative flex flex-col bg-[radial-gradient(circle_at_center,_#FDCF41_0%,_#fbbd08_100%)] select-none overflow-hidden">
            
            {/* Header Mirror (Top Status Bar) */}
            <header className="flex-none w-full flex justify-between items-center px-[40px] py-[24px] z-50">
              <div className="flex items-center gap-[20px] flex-1">
                <div className="text-lev-burgundy font-black text-[26px] tracking-widest opacity-90 drop-shadow-sm">בס"ד</div>
              </div>

              <div className="flex-none bg-white/60 backdrop-blur-md p-[10px] rounded-[16px] shadow-xl border border-white/50">
                <img
                  src={logo}
                  alt="לב חב'ד"
                  className="h-[65px] w-auto object-contain rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end flex-1">
                <div className="bg-white/30 backdrop-blur-md px-[28px] py-[10px] rounded-full border border-white/40 shadow-inner">
                  <span className="text-[22px] font-black text-lev-burgundy tracking-tight">{displayHebrewDate}</span>
                </div>
              </div>
            </header>

            {/* MAIN DISPLAY AREA (Where the SlideCard lives) */}
            <main className="flex-1 min-h-0 relative z-0 flex items-center justify-center p-[20px] overflow-hidden">
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <SlideCard data={data} fade={true} />
              </div>
            </main>

            {/* Footer Mirror (Bottom Branding Bar) */}
            <footer className="flex-none h-[110px] w-full bg-white/98 backdrop-blur-xl border-t-2 border-lev-burgundy/10 z-50 px-[50px] flex items-center justify-between relative shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              {/* Left Side: Mock QR / Info area */}
              <div className="flex items-center gap-6 opacity-40">
                <div className="w-[60px] h-[60px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-[14px] w-[140px] bg-gray-300 rounded-full" />
                  <div className="h-[10px] w-[100px] bg-gray-200 rounded-full" />
                </div>
              </div>
              
              {/* Center Message */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <h2 className="text-lev-burgundy font-black text-[22px] opacity-20 italic tracking-wide">
                  לב חב"ד - תמיד כאן בשבילכם
                </h2>
              </div>

              {/* Right Side: Mock Connection Status */}
              <div className="flex items-center gap-3 bg-gray-50/50 px-5 py-2.5 rounded-2xl border border-gray-100 opacity-30">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[14px] font-bold text-gray-500 tracking-wider">SYSTEM ONLINE</span>
              </div>
            </footer>
          </div>
        </div>

        {/* SCALE INDICATOR PILL */}
        {scale < 1 && (
          <div className="absolute bottom-8 right-10 bg-lev-burgundy/90 backdrop-blur-xl text-white text-[11px] font-black px-4 py-2 rounded-full border border-white/20 shadow-2xl tracking-[0.1em]">
            ZOOM: {(scale * 100).toFixed(0)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;
