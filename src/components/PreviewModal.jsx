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

        

        {/* Simulated Display Environment */}

        <div className="w-full h-full bg-lev-yellow relative flex flex-col bg-[radial-gradient(circle_at_center,_#FDCF41_0%,_#fbbd08_100%)] overflow-hidden">

          

          {/* simulated Header Area (Matches DisplayPage) */}

          <div className="w-full flex justify-between items-center px-4 md:px-12 py-3 md:py-6 z-50 pointer-events-none">

            {/* Left Side: בס"ד and Simulated Controls */}

            <div className="flex items-center gap-4">

              <div className="text-lev-burgundy font-black text-lg md:text-3xl opacity-80 whitespace-nowrap">בס"ד</div>

              <div className="flex gap-1 md:gap-2 opacity-20">

                <div className="p-2 md:p-3 bg-white/30 rounded-full h-8 w-8 md:h-12 md:w-12" />

                <div className="p-2 md:p-3 bg-white/30 rounded-full h-8 w-8 md:h-12 md:w-12" />

              </div>

            </div>

            

            {/* Right Side: Hebrew Date Badge */}

            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 md:px-6 md:py-2 rounded-full border border-white/30 shadow-sm">

              <span className="text-xs md:text-xl lg:text-2xl font-black text-lev-burgundy opacity-90">{displayHebrewDate}</span>

            </div>

          </div>

  

          {/* Close Button - Floats over the simulation */}

          <button 

            onClick={onClose}

            className="absolute top-24 left-6 md:top-32 md:left-12 z-[110] bg-lev-burgundy text-white p-4 rounded-full transition-all pointer-events-auto shadow-2xl hover:scale-110 active:scale-95 flex items-center gap-2 font-bold"

          >

            <X size={24} />

            <span className="hidden md:inline">סגור תצוגה</span>

          </button>

  

          {/* The Slide Card - Centered in a viewport simulation */}

          <main className="flex-1 w-full flex items-center justify-center px-4 md:px-12 lg:px-20 overflow-hidden">

               <div className="w-full h-full max-w-7xl flex items-center justify-center p-2 md:p-4">

                 <SlideCard data={data} fade={true} />

               </div>

          </main>

  

          {/* Simulated Footer (Matches DisplayPage) */}

          <footer className="w-full bg-white/95 backdrop-blur-md border-t-2 border-lev-burgundy/10 h-16 md:h-32 z-40 flex items-center justify-between px-8 md:px-16 shrink-0 pointer-events-none relative">

            <div className="flex flex-col gap-1">

              <div className="h-2 md:h-4 w-24 md:w-48 bg-gray-200 rounded animate-pulse" />

              <div className="h-1 md:h-3 w-16 md:w-32 bg-gray-100 rounded animate-pulse" />

            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">

              <div className="text-lev-burgundy font-black text-xs md:text-2xl opacity-10 italic whitespace-nowrap">תצוגה מקדימה - לב חב"ד</div>

            </div>

            <div className="bg-gray-100 w-10 h-10 md:w-20 md:h-20 rounded-xl opacity-20 border border-gray-200"></div>

          </footer>

        </div>

      </div>

    );
};

export default PreviewModal;
