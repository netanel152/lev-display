import { useEffect } from 'react';
import { X } from 'lucide-react';
import SlideCard from './SlideCard';
import { getTodayHebrewDate } from '../utils/hebrewDate';

const PreviewModal = ({ isOpen, onClose, data }) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Use the item's hebrew date if it exists (for memorial preview), otherwise show today
  const displayHebrewDate = data.hebrewDate || getTodayHebrewDate();

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in font-sans" dir="rtl">
      
      {/* simulated Header Area (Matches DisplayPage) */}
      <div className="w-full absolute top-0 left-0 flex justify-between items-center px-4 md:px-12 py-3 md:py-6 z-50 pointer-events-none">
        {/* Left Side: בס"ד */}
        <div className="text-lev-burgundy font-black text-lg md:text-2xl opacity-80">בס"ד</div>
        
        {/* Right Side: Hebrew Date Badge */}
        <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-white/30 shadow-sm">
          <span className="text-sm md:text-xl font-black text-lev-burgundy opacity-90">{displayHebrewDate}</span>
        </div>
      </div>

      {/* Simulated Display Environment */}
      <div className="w-full h-full bg-lev-yellow relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#FDCF41_0%,_#fbbd08_100%)] overflow-hidden">
        
        {/* Close Button - Moved to a safer spot */}
        <button 
          onClick={onClose}
          className="absolute top-20 left-4 md:top-24 md:left-8 z-[110] bg-lev-burgundy text-white p-3 rounded-full transition-all pointer-events-auto shadow-2xl hover:scale-110 active:scale-95"
          title="סגור תצוגה מקדימה"
        >
          <X size={28} />
        </button>

        {/* The Slide Card - Centered in a viewport simulation */}
        <div className="flex-1 w-full max-w-7xl flex items-center justify-center p-4 md:p-12 lg:p-20 overflow-hidden">
             <SlideCard data={data} fade={true} />
        </div>

        {/* Simulated Footer (Matches DisplayPage) */}
        <div className="w-full bg-white/95 backdrop-blur-md border-t border-gray-200 h-16 md:h-32 z-40 flex items-center justify-between px-8 md:px-16 shrink-0 pointer-events-none">
          <div className="text-lev-burgundy font-black text-xl md:text-4xl opacity-10 italic">לב חב"ד - תצוגה מקדימה</div>
          <div className="bg-gray-100 w-12 h-12 md:w-24 md:h-24 rounded-xl opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
