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
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-2 md:p-4 animate-fade-in" dir="rtl">
      
      {/* simulated Header Area */}
      <div className="w-full max-w-7xl absolute top-4 md:top-8 px-6 md:px-12 flex justify-between items-center z-50 pointer-events-none">
        {/* Left Side: בס"ד */}
        <div className="text-lev-burgundy font-bold text-lg md:text-2xl opacity-80">בס"ד</div>
        
        {/* Right Side: Hebrew Date Badge */}
        <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-white/30 shadow-sm">
          <span className="text-sm md:text-xl font-bold text-lev-burgundy opacity-90">{displayHebrewDate}</span>
        </div>
      </div>

      {/* Simulated Display Environment */}
      <div className="w-full h-full bg-lev-yellow relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_#FDCF41_0%,_#fbbd08_100%)] overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 z-[110] bg-white/20 hover:bg-white/40 text-lev-burgundy p-3 rounded-full transition-all pointer-events-auto shadow-lg backdrop-blur-md border border-white/30"
          title="סגור תצוגה מקדימה"
        >
          <X size={28} />
        </button>

        {/* The Slide Card */}
        <div className="w-full h-full max-w-[1600px] flex items-center justify-center p-4 md:p-12 lg:p-20 scale-[0.85] md:scale-100 transition-transform">
             <SlideCard data={data} fade={true} />
        </div>
      </div>

      {/* Simulated Footer (Simplified) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 h-16 md:h-24 z-40 flex items-center px-8">
        <div className="text-lev-burgundy font-black text-xl md:text-3xl opacity-20 italic">לב חב"ד - תצוגה מקדימה</div>
      </div>
    </div>
  );
};

export default PreviewModal;