import { useState, useEffect, useRef } from "react";
import { Minimize, Maximize, Lock, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { getTodayHebrewDate, getCurrentHoliday, isSameHebrewDayAndMonth } from "../utils/hebrewDate";
import { subscribeToItems, subscribeToSettings } from "../services/dataService";
import { EMPTY_SLIDE_DATA, DEFAULT_SLIDE_DURATION, FADE_DURATION } from "../constants";
import SlideCard from "../components/SlideCard";

const DisplayPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [hebrewDate, setHebrewDate] = useState(getTodayHebrewDate());
  const wakeLock = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState({
    slideDuration: DEFAULT_SLIDE_DURATION,
    donationUrl: "",
    contactPhone: "",
    contactEmail: ""
  });

  useEffect(() => {
    const unsubscribeItems = subscribeToItems(setItems);
    const unsubscribeSettings = subscribeToSettings((newSettings) => {
      if (newSettings) setSettings(prev => ({ ...prev, ...newSettings }));
    });
    return () => { unsubscribeItems(); unsubscribeSettings(); };
  }, []);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) wakeLock.current = await navigator.wakeLock.request('screen');
      } catch (err) { console.error(`Wake Lock error: ${err.name}, ${err.message}`); }
    };
    requestWakeLock();
    return () => wakeLock.current?.release();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e.message));
    } else {
      document.exitFullscreen();
    }
  };

  const currentHoliday = getCurrentHoliday();
  const todayItems = items.filter(item => {
    const now = new Date();
    const todayGregorian = now.toLocaleDateString('en-CA');
    const todayHebrew = getTodayHebrewDate();
    if (item.expirationTimestamp) {
      const expiry = item.expirationTimestamp.seconds ? new Date(item.expirationTimestamp.seconds * 1000) : new Date(item.expirationTimestamp);
      if (now > expiry) return false;
    }
    return (!item.date && !item.hebrewDate) || item.date === todayGregorian || isSameHebrewDayAndMonth(item.hebrewDate, todayHebrew);
  });

  if (currentHoliday) {
    todayItems.unshift({ id: 'holiday', type: 'holiday', mainName: currentHoliday, subText: 'חג שמח!', footerText: 'לב חב"ד מאחלים' });
  }

  const safeIndex = todayItems.length > 0 ? index % todayItems.length : 0;

  useEffect(() => {
    if (todayItems.length <= 1) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex(prev => prev + 1);
        setFade(true);
      }, FADE_DURATION);
    }, settings.slideDuration);
    return () => clearInterval(interval);
  }, [todayItems.length, settings.slideDuration]);

  const data = todayItems.length > 0 ? todayItems[safeIndex] : EMPTY_SLIDE_DATA;

  return (
    <div className="min-h-screen h-[100dvh] w-full bg-lev-yellow relative flex flex-col overflow-hidden bg-[radial-gradient(circle_at_center,_#FDCF41_0%,_#fbbd08_100%)] select-none">
      
      {/* 1. Kiosk Header */}
      <header className="w-full flex justify-between items-center px-4 md:px-12 py-3 md:py-6 z-50 shrink-0">
        
        {/* Left Side: בס"ד and Controls */}
        <div className="flex items-center gap-4">
          <div className="text-lev-burgundy font-black text-lg md:text-3xl opacity-80 whitespace-nowrap">בס"ד</div>
          <div className="flex gap-1 md:gap-2">
            <button onClick={toggleFullscreen} className="p-2 md:p-3 bg-white/30 hover:bg-white/60 rounded-full transition-all opacity-40 hover:opacity-100">
              {isFullscreen ? <Minimize size={18} className="text-lev-burgundy md:w-6 md:h-6" /> : <Maximize size={18} className="text-lev-burgundy md:w-6 md:h-6" />}
            </button>
            <button onClick={() => navigate("/login")} className="p-2 md:p-3 bg-white/30 hover:bg-white/60 rounded-full transition-all opacity-40 hover:opacity-100">
              <Lock size={18} className="text-lev-burgundy md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Right Side: Today's Hebrew Date */}
        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 md:px-6 md:py-2 rounded-full border border-white/30 shadow-sm max-w-[50%] md:max-w-none">
          <span className="text-xs md:text-xl lg:text-2xl font-black text-lev-burgundy opacity-90 truncate block">{hebrewDate}</span>
        </div>
      </header>

      {/* 2. Main Slide Area - Optimized for viewport constraints */}
      <main className="flex-1 flex items-center justify-center px-2 md:px-12 lg:px-20 overflow-hidden min-h-0">
        <div className="w-full h-full max-w-7xl flex items-center justify-center p-2 md:p-4">
          <SlideCard data={data} fade={fade} />
        </div>
      </main>

      {/* 3. Kiosk Footer - Ultra Responsive */}
      <footer className="w-full bg-white/95 backdrop-blur-md border-t-2 border-lev-burgundy/10 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-50 px-4 md:px-16 py-3 md:py-6 flex items-center justify-between shrink-0 gap-2">
        
        {/* Contact Info */}
        <div className="flex flex-col gap-0.5 md:gap-2 flex-1">
          {settings.contactPhone && (
            <div className="flex items-center gap-2 md:gap-4">
              <Phone className="w-4 h-4 md:w-8 md:h-8 lg:w-10 lg:h-10 text-lev-burgundy shrink-0" />
              <span className="text-sm md:text-3xl lg:text-5xl font-black text-gray-800 font-mono tracking-tighter whitespace-nowrap">{settings.contactPhone}</span>
            </div>
          )}
          {settings.contactEmail && (
            <div className="flex items-center gap-4 opacity-70">
              <Mail className="w-3 h-3 md:w-6 md:h-6 lg:w-8 lg:h-8 text-lev-burgundy shrink-0" />
              <span className="text-[10px] md:text-xl lg:text-2xl font-bold truncate">{settings.contactEmail}</span>
            </div>
          )}
        </div>

        {/* Center Branding - Visible only on larger screens */}
        <div className="hidden lg:block text-center px-4">
          <h2 className="text-lev-burgundy font-black text-lg xl:text-2xl opacity-30 italic whitespace-nowrap">לב חב"ד - תמיד כאן בשבילכם</h2>
        </div>

        {/* QR Code Section */}
        {settings.donationUrl && (
          <div className="flex items-center gap-2 md:gap-6 bg-lev-yellow/5 p-1 md:p-3 rounded-2xl md:rounded-3xl border border-lev-burgundy/5 shadow-inner">
            <span className="hidden sm:block text-right text-[10px] md:text-lg font-black text-lev-burgundy leading-tight">
              רוצים לתרום?<br/>סרקו אותי 🙂
            </span>
            <div className="bg-white p-1 md:p-2 rounded-lg md:rounded-2xl shadow-md border border-gray-100">
              <QRCode value={settings.donationUrl} size={128} className="w-10 h-10 md:w-24 md:h-24 lg:w-32 lg:h-32" />
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};

export default DisplayPage;