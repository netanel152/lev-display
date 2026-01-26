import { useState, useEffect, useRef } from "react";
import { Minimize, Maximize, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTodayHebrewDate, getCurrentHoliday } from "../utils/hebrewDate";
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
  const [slideDuration, setSlideDuration] = useState(DEFAULT_SLIDE_DURATION);

  // Subscribe to data changes
  useEffect(() => {
    const unsubscribeItems = subscribeToItems((newItems) => {
      console.log(`[DisplayPage] Received ${newItems.length} items from service.`);
      setItems(newItems);
    });

    const unsubscribeSettings = subscribeToSettings((settings) => {
      if (settings && settings.slideDuration) {
        setSlideDuration(settings.slideDuration);
      }
    });

    return () => {
      unsubscribeItems();
      unsubscribeSettings();
    };
  }, []);

  // Wake Lock API implementation
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock.current = await navigator.wakeLock.request('screen');
          console.log('[DisplayPage] Wake Lock is active!');
          wakeLock.current.addEventListener('release', () => console.log('[DisplayPage] Wake Lock released'));
        }
      } catch (err) {
        console.error(`[DisplayPage] Wake Lock error: ${err.name}, ${err.message}`);
      }
    };

    const handleVisibilityChange = async () => {
      if (wakeLock.current !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock.current) {
        wakeLock.current.release();
        wakeLock.current = null;
      }
    };
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`[DisplayPage] Error entering fullscreen: ${e.message}`);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const currentHoliday = getCurrentHoliday();

  // Filter items for today
  const todayItems = items.filter(item => {
    const todayGregorian = new Date().toLocaleDateString('en-CA');
    const todayHebrew = getTodayHebrewDate();

    return !item.date && !item.hebrewDate ||
      item.date === todayGregorian ||
      item.hebrewDate === todayHebrew;
  });

  if (currentHoliday) {
    todayItems.unshift({
      id: 'holiday',
      type: 'holiday',
      mainName: currentHoliday,
      subText: 'חג שמח!',
      footerText: 'לב חב"ד מאחלים'
    });
  }

  // Ensure index is always valid by using modulo
  const safeIndex = todayItems.length > 0 ? index % todayItems.length : 0;

  // Slide rotation logic
  useEffect(() => {
    if (todayItems.length <= 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!fade) setFade(true); // Ensure visible if only 1 item
      return;
    }

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => prev + 1); // Just increment, we handle modulo in render
        setFade(true);
      }, FADE_DURATION);
    }, slideDuration);

    return () => clearInterval(interval);
  }, [todayItems.length, slideDuration, fade]);

  // Hebrew Date updater
  useEffect(() => {
    const dateInterval = setInterval(() => {
      const newDate = getTodayHebrewDate();
      if (newDate !== hebrewDate) setHebrewDate(newDate);
    }, 60000);
    return () => clearInterval(dateInterval);
  }, [hebrewDate]);

  const data = todayItems.length > 0
    ? todayItems[safeIndex]
    : EMPTY_SLIDE_DATA;

  return (
    <div className="min-h-screen w-full bg-lev-yellow relative flex flex-col items-center p-3 md:p-8 overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--color-lev-yellow)_0%,_#fbbd08_100%)]">

      {/* Admin Controls */}
      <div className="absolute top-3 left-3 md:top-6 md:left-6 z-50 flex gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-white/50 hover:bg-white/80 rounded-full transition-all duration-300 opacity-30 hover:opacity-100 focus:opacity-100"
          title={isFullscreen ? "יציאה ממסך מלא" : "מסך מלא"}
        >
          {isFullscreen ? <Minimize size={16} className="text-lev-burgundy md:w-5 md:h-5" /> : <Maximize size={16} className="text-lev-burgundy md:w-5 md:h-5" />}
        </button>
        <button
          onClick={() => navigate("/login")}
          className="p-2 bg-white/50 hover:bg-white/80 rounded-full transition-all duration-300 opacity-30 hover:opacity-100 focus:opacity-100"
          title="כניסה למנהלים"
        >
          <Lock size={16} className="text-lev-burgundy md:w-5 md:h-5" />
        </button>
      </div>

      {/* Hebrew Date Badge */}
      <div className="absolute top-3 right-3 md:top-6 md:right-6 z-20 bg-white/95 backdrop-blur px-3 py-1.5 md:px-6 md:py-3 rounded-full shadow-lg shadow-black/5 text-lev-burgundy font-bold text-sm md:text-3xl border md:border-2 border-lev-yellow">
        {hebrewDate}
      </div>

      {/* Decorative Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-16 md:h-24 bg-lev-blue z-0 pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 -top-4 md:-top-6 w-0 h-0 border-l-[20px] md:border-l-[30px] border-l-transparent border-r-[20px] md:border-r-[30px] border-r-transparent border-b-[20px] md:border-b-[30px] border-b-lev-blue"></div>
      </div>

      {/* Main Card */}
      <div className="w-full flex justify-center my-auto z-10 pb-20 md:pb-28">
        <SlideCard data={data} fade={fade} />
      </div>
    </div>
  );
};
export default DisplayPage;
