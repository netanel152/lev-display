import { useState, useEffect, useRef } from "react";
import { Minimize, Maximize, Lock, Phone, Mail, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { getTodayHebrewDate, getCurrentHoliday, isSameHebrewDayAndMonth } from "../utils/hebrewDate";
import { subscribeToItems, subscribeToSettings } from "../services/dataService";
import { EMPTY_SLIDE_DATA, DEFAULT_SLIDE_DURATION, FADE_DURATION } from "../constants";
import SlideCard from "../components/SlideCard";

const DisplayPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(null);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [hebrewDate, setHebrewDate] = useState(getTodayHebrewDate());
  const wakeLock = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
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
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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

  const todayItems = (items || []).filter(item => {
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

  if (items === null) {
    return (
      <div className="h-[100dvh] w-full bg-lev-yellow flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#FDCF41_0%,_#fbbd08_100%)] select-none overflow-hidden">
        <div className="flex flex-col items-center gap-[4vh]">
          <div className="w-[10vh] h-[10vh] border-[1vh] border-lev-burgundy/20 border-t-lev-burgundy rounded-full animate-spin" />
          <div className="flex flex-col items-center gap-[1vh]">
            <h2 className="text-lev-burgundy font-black text-[5vmin] animate-pulse tracking-tight">טוען מערכת...</h2>
            <p className="text-lev-burgundy/60 font-bold text-[3vmin] italic">לב חב"ד - תמיד כאן בשבילכם</p>
          </div>
        </div>
      </div>
    );
  }

  const data = todayItems.length > 0
    ? todayItems[safeIndex]
    : {
      ...EMPTY_SLIDE_DATA,
      title: settings.defaultSlideTitle || EMPTY_SLIDE_DATA.title,
      mainName: settings.defaultSlideMainName || EMPTY_SLIDE_DATA.mainName,
      subText: settings.defaultSlideSubText || EMPTY_SLIDE_DATA.subText,
      footerText: settings.defaultSlideFooterText || EMPTY_SLIDE_DATA.footerText,
    };

  return (
    <div className="h-[100dvh] w-full bg-lev-yellow relative flex flex-col overflow-hidden bg-[radial-gradient(circle_at_center,_#FDCF41_0%,_#fbbd08_100%)] select-none">

      {/* 1. Header: Fixed-none, VH-based padding */}
      <header className="flex-none w-full flex justify-between items-center px-[4vw] py-[2vh] z-50">
        <div className="flex items-center gap-[2vw]">
          <div className="text-lev-burgundy font-black text-[3vmin] opacity-80 whitespace-nowrap">בס"ד</div>
          <div className="flex gap-[1vw]">
            <button
              onClick={toggleFullscreen}
              className="p-[1vh] bg-white/30 hover:bg-white/60 rounded-full transition-all opacity-40 hover:opacity-100"
            >
              {isFullscreen ? <Minimize className="text-lev-burgundy w-[3vh] h-[3vh]" /> : <Maximize className="text-lev-burgundy w-[3vh] h-[3vh]" />}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="p-[1vh] bg-white/30 hover:bg-white/60 rounded-full transition-all opacity-40 hover:opacity-100"
            >
              <Lock className="text-lev-burgundy w-[3vh] h-[3vh]" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-[1.5vw]">
          {!isOnline && (
            <div className="bg-white/90 backdrop-blur-xl border border-red-100 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 animate-in zoom-in duration-300">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </div>
              <WifiOff size={14} className="text-red-500" />
              <span className="text-[1.6vmin] font-black text-red-600 tracking-tight" dir="rtl">מצב ללא רשת</span>
            </div>
          )}

          <div className="bg-white/20 backdrop-blur-sm px-[3vw] py-[1vh] rounded-full border border-white/30 shadow-sm">
            <span className="text-[2.5vmin] font-black text-lev-burgundy opacity-90 truncate block">{hebrewDate}</span>
          </div>
        </div>
      </header>

      {/* 2. Main Stage: flex-1, min-h-0 */}
      <main className="flex-1 min-h-0 relative z-0 flex items-center justify-center p-[2vh]">
        <div className="w-full h-full max-w-[95vw] flex items-center justify-center">
          <SlideCard data={data} fade={fade} />
        </div>
      </main>

      {/* 3. Footer: Fixed-none, 15vh height */}
      <footer className="flex-none h-[15vh] w-full bg-white/95 backdrop-blur-md border-t-2 border-lev-burgundy/10 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-50 px-[4vw] py-[2vh] flex items-center justify-between gap-[2vw] relative">

        <div className="flex flex-col justify-center gap-[0.5vh] flex-1 z-10 h-full">
          {settings.contactPhone && (
            <div className="flex items-center gap-[1.5vw]">
              <Phone className="w-[3.5vmin] h-[3.5vmin] text-lev-burgundy shrink-0" />
              <span className="text-[3.5vmin] font-black text-gray-800 font-mono tracking-tighter whitespace-nowrap leading-none">{settings.contactPhone}</span>
            </div>
          )}
          {settings.contactEmail && (
            <div className="flex items-center gap-[1.5vw]">
              <Mail className="w-[2.5vmin] h-[2.5vmin] text-lev-burgundy shrink-0" />
              <span className="text-[2.5vmin] font-bold truncate leading-none text-gray-700">{settings.contactEmail}</span>
            </div>
          )}
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-0">
          <h2 className="text-lev-burgundy font-black text-[2.5vmin] opacity-20 italic whitespace-nowrap">לב חב"ד - תמיד כאן בשבילכם</h2>
        </div>

        {settings.donationUrl && (
          <div className="flex items-center gap-[1.5vw] bg-lev-yellow/5 p-[1vh] rounded-[2vh] border border-lev-burgundy/5 shadow-inner z-10 h-[90%]">
            <span className="hidden sm:block text-right text-[1.8vmin] font-black text-lev-burgundy leading-tight">
              רוצים לתרום?<br />סרקו אותי ❤️
            </span>
            <div className="bg-white p-[0.5vh] rounded-[1.5vh] shadow-md border border-gray-100 h-full aspect-square flex items-center justify-center">
              <QRCode value={settings.donationUrl} size={256} className="w-full h-full" />
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};

export default DisplayPage;
