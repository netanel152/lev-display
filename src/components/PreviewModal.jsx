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

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fade-in">
      {/* Top bar with close button */}
      <div className="w-full absolute top-0 left-0 p-4 flex justify-between items-center z-50">
        <h2 className="text-white text-xl font-bold drop-shadow-md">תצוגה מקדימה</h2>
        <button 
          onClick={onClose}
          className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all"
        >
          <X size={24} />
        </button>
      </div>

      {/* Simulated Display Environment */}
      <div className="w-full h-full max-w-[1400px] max-h-[900px] bg-lev-yellow relative rounded-xl overflow-hidden shadow-2xl flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--color-lev-yellow)_0%,_#fbbd08_100%)]">
        
        {/* Hebrew Date Badge (Simulated) */}
        <div className="absolute top-3 right-3 md:top-6 md:right-6 z-20 bg-white/95 backdrop-blur px-3 py-1.5 md:px-6 md:py-3 rounded-full shadow-lg shadow-black/5 text-lev-burgundy font-bold text-sm md:text-2xl border md:border-2 border-lev-yellow">
          {getTodayHebrewDate()}
        </div>

        {/* Decorative Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-lev-blue z-0 pointer-events-none">
          <div className="absolute left-1/2 -translate-x-1/2 -top-4 md:-top-6 w-0 h-0 border-l-[20px] md:border-l-[30px] border-l-transparent border-r-[20px] md:border-r-[30px] border-r-transparent border-b-[20px] md:border-b-[30px] border-b-lev-blue"></div>
        </div>

        {/* The Slide Card */}
        <div className="scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 w-full flex justify-center">
             <SlideCard data={data} fade={true} />
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
