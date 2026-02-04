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

  // Subscribe to data changes
  useEffect(() => {
    console.log("[DisplayPage] Mounting and subscribing to data...");
    const unsubscribeItems = subscribeToItems((newItems) => {
      console.log(`[DisplayPage] Received ${newItems.length} items from service.`);
      setItems(newItems);
    });

    const unsubscribeSettings = subscribeToSettings((newSettings) => {
      if (newSettings) {
        console.log("[DisplayPage] Received new settings:", newSettings);
        setSettings(prev => ({ ...prev, ...newSettings }));
      }
    });

    return () => {
      console.log("[DisplayPage] Unmounting and cleaning up subscriptions.");
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
        console.error(`Error entering fullscreen: ${e.message}`);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const currentHoliday = getCurrentHoliday();

  // Filter items for today
  const todayItems = items.filter(item => {
    const now = new Date();
    const todayGregorian = now.toLocaleDateString('en-CA');
    const todayHebrew = getTodayHebrewDate();

    if (item.expirationTimestamp) {
      const expiry = item.expirationTimestamp.seconds 
        ? new Date(item.expirationTimestamp.seconds * 1000) 
        : new Date(item.expirationTimestamp);
      if (now > expiry) return false;
    }

    return (!item.date && !item.hebrewDate) ||
      item.date === todayGregorian ||
      isSameHebrewDayAndMonth(item.hebrewDate, todayHebrew);
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

  const safeIndex = todayItems.length > 0 ? index % todayItems.length : 0;

  // Slide rotation logic
  useEffect(() => {
    if (todayItems.length <= 1) {
      if (!fade) setFade(true);
      return;
    }

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setFade(true);
      }, FADE_DURATION);
    }, settings.slideDuration);

    return () => clearInterval(interval);
  }, [todayItems.length, settings.slideDuration, fade]);

  // Hebrew Date updater
  useEffect(() => {
    const dateInterval = setInterval(() => {
      const newDate = getTodayHebrewDate();
      if (newDate !== hebrewDate) {
          setHebrewDate(newDate);
      }
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

      {/* Persistent Kiosk Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between px-4 md:px-12 py-4">

        {/* Left Side: Contact Info */}
        <div className="flex flex-col items-start gap-2 text-left min-w-[200px]">
          {settings.contactPhone && (
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 md:w-8 md:h-8 text-lev-burgundy" />
              <span className="text-2xl md:text-4xl font-bold tracking-wider text-gray-800 font-mono">{settings.contactPhone}</span>
            </div>
          )}
          {settings.contactEmail && (
            <div className="flex items-center gap-4 text-gray-600">
              <Mail className="w-5 h-5 md:w-7 md:h-7" />
              <span className="text-lg md:text-2xl font-semibold">{settings.contactEmail}</span>
            </div>
          )}
        </div>

        {/* Center: QR Code */}
        {settings.donationUrl && (
          <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl border border-gray-100 mx-4 shadow-sm">
            <span className="text-sm md:text-xl font-bold text-gray-800 mb-3">רוצים לתרום? סרקו אותי 🙂</span>
              <QRCode
                value={settings.donationUrl}
                size={128}
                className="w-24 h-24 md:w-32 md:h-32"
              />
          </div>
        )}

      </div>

      {/* Main Card */}
      <div className="w-full flex justify-center my-auto z-10 pb-48 transition-all duration-300">
        <SlideCard data={data} fade={fade} />
      </div>
    </div>
  );
};
export default DisplayPage;
