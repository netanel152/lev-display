import { useState, useEffect, useRef } from "react";
import { Heart, Flame, Gift, Activity, Lock, Maximize, Minimize, Star, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTodayHebrewDate, getCurrentHoliday } from "../utils/hebrewDate";
import { subscribeToItems } from "../services/dataService";
import { EMPTY_SLIDE_DATA, DEFAULT_SLIDE_DURATION, FADE_DURATION, THEME_COLORS } from "../constants";

const getFontSize = (text) => {
  if (!text) return "text-8xl md:text-[10rem]";
  const len = text.length;
  if (len < 10) return "text-8xl md:text-[10rem]";
  if (len <= 20) return "text-6xl md:text-8xl";
  return "text-4xl md:text-6xl";
};

const DisplayPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [hebrewDate, setHebrewDate] = useState(getTodayHebrewDate());
  const wakeLock = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Subscribe to data changes
  useEffect(() => {
    const unsubscribe = subscribeToItems((newItems) => {
      console.log(`[DisplayPage] Received ${newItems.length} items from service.`);
      setItems(newItems);
    });
    return () => unsubscribe();
  }, []);

  // Wake Lock API implementation
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock.current = await navigator.wakeLock.request('screen');
          console.log('[DisplayPage] Wake Lock is active!');

          wakeLock.current.addEventListener('release', () => {
            console.log('[DisplayPage] Wake Lock released');
          });
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
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      console.log(`[DisplayPage] Fullscreen changed: ${isFs}`);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        console.log("[DisplayPage] Entered fullscreen");
      }).catch((e) => {
        console.error(`[DisplayPage] Error entering fullscreen: ${e.message} (${e.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          console.log("[DisplayPage] Exited fullscreen");
        });
      }
    }
  };

  // בדיקת חג נוכחי
  const currentHoliday = getCurrentHoliday();

  // סינון פריטים שמתאימים להיום בלבד
  const todayItems = (() => {
    const filtered = items.filter(item => {
      // שימוש בתאריך מקומי ולא UTC כדי למנוע בעיות בחילופי יום
      const todayGregorian = new Date().toLocaleDateString('en-CA');
      const todayHebrew = getTodayHebrewDate();

      return !item.date && !item.hebrewDate ||
        item.date === todayGregorian ||
        item.hebrewDate === todayHebrew;
    });

    if (currentHoliday) {
      const holidaySlide = {
        id: 'holiday',
        type: 'holiday',
        mainName: currentHoliday,
        subText: 'חג שמח!',
        footerText: 'לב חב"ד מאחלים'
      };
      return [holidaySlide, ...filtered];
    }

    return filtered;
  })();

  // וודא שהאינדקס תקין אם כמות הפריטים השתנתה
  useEffect(() => {
    if (todayItems.length > 0 && index >= todayItems.length) {
      setIndex(0);
    }
  }, [todayItems.length, index]);

  // Slide rotation and data refresh logic
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        if (todayItems.length > 0) {
          setIndex((prev) => {
            const nextIndex = (prev + 1) % todayItems.length;
            console.log(`[DisplayPage] Rotating slide to index ${nextIndex}`);
            return nextIndex;
          });
        }

        setFade(true);
      }, FADE_DURATION);

    }, DEFAULT_SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [items, todayItems.length]);

  useEffect(() => {
    const dateInterval = setInterval(() => {
      const newDate = getTodayHebrewDate();
      if (newDate !== hebrewDate) {
        setHebrewDate(newDate);
      }
    }, 60000);

    return () => clearInterval(dateInterval);
  }, [hebrewDate]);

  // אם אין פריטים להיום, נציג שקופית ברירת מחדל של "לב חב"ד"
  const data = todayItems.length > 0
    ? todayItems[index % todayItems.length]
    : EMPTY_SLIDE_DATA;

  const getTheme = (type, mainName) => {
    switch (type) {
      case "birthday":
        return {
          icon: <Gift size={70} />,
          color: THEME_COLORS.BIRTHDAY,
        };
      case "healing":
        return {
          icon: <Activity size={70} />,
          color: THEME_COLORS.HEALING,
        };
      case "holiday":
        // בדיקה אם זה פורים
        if (mainName && mainName.includes("פורים")) {
          return {
            icon: <PartyPopper size={70} />,
            color: "text-purple-600",
          };
        }
        return {
          icon: <Star size={70} />,
          color: "text-orange-500",
        };
      default: // memorial
        return {
          icon: <Flame size={70} />,
          color: THEME_COLORS.MEMORIAL,
        };
    }
  };

  const theme = getTheme(data.type, data.mainName);

  return (
    <div className="h-screen w-full bg-lev-yellow relative flex items-center justify-center p-4 md:p-8 overflow-hidden bg-[radial-gradient(circle_at_center,_var(--color-lev-yellow)_0%,_#fbbd08_100%)]">

      {/* כפתור כניסה למנהלים */}
      <div className="absolute top-6 left-6 z-50 flex gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-white/50 hover:bg-white/80 rounded-full transition-all duration-300 opacity-30 hover:opacity-100 focus:opacity-100"
          title={isFullscreen ? "יציאה ממסך מלא" : "מסך מלא"}
        >
          {isFullscreen ? (
            <Minimize size={20} className="text-lev-burgundy" />
          ) : (
            <Maximize size={20} className="text-lev-burgundy" />
          )}
        </button>
        <button
          onClick={() => navigate("/login")}
          className="p-2 bg-white/50 hover:bg-white/80 rounded-full transition-all duration-300 opacity-30 hover:opacity-100 focus:opacity-100"
          title="כניסה למנהלים"
        >
          <Lock size={20} className="text-lev-burgundy" />
        </button>
      </div>

      {/* תאריך עברי בפינה (מתעדכן אוטומטית) */}
      <div className="absolute top-6 right-6 z-20 bg-white/95 backdrop-blur px-6 py-3 rounded-full shadow-lg shadow-black/5 text-lev-burgundy font-bold text-2xl md:text-3xl border-2 border-lev-yellow">
        {hebrewDate}
      </div>
      {/* אלמנט כחול תחתון */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-lev-blue z-0">
        <div className="absolute left-1/2 -translate-x-1/2 -top-4 md:-top-6 w-0 h-0 border-l-[20px] md:border-l-[30px] border-l-transparent border-r-[20px] md:border-r-[30px] border-r-transparent border-b-[20px] md:border-b-[30px] border-b-lev-blue"></div>
      </div>

      {/* הכרטיס הלבן המרכזי - עם אנימציה משופרת ופס התקדמות */}
      <div
        key={data.id}
        className={`relative z-10 bg-white w-full max-w-6xl aspect-[4/3] md:aspect-video rounded-[3rem] shadow-2xl shadow-lev-burgundy/10 flex flex-col items-center text-center p-6 md:p-10 transition-all duration-700 ease-in-out transform ${fade ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
      >
        {/* לוגו לב חב"ד */}
        <div className="flex flex-col items-center mt-2 md:mt-4">
          <div className="flex items-center gap-3 text-lev-burgundy">
            <Heart fill="#7A1429" size={65} className="md:w-[80px] md:h-[80px]" />
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter">
              לב חב"ד
            </h1>
          </div>
          <p className="text-lev-burgundy text-2xl md:text-3xl font-bold mt-1">
            הכתובת שלך במרכז הרפואי
          </p>
        </div>

        {/* תוכן ההקדשה */}
        <div className="flex-1 flex flex-col justify-center items-center w-full space-y-6 my-4">
          <h2 className="text-3xl md:text-5xl font-bold text-lev-burgundy/90">
            {data.footerText}
            <div className={`text-2xl md:text-4xl mt-3 font-normal ${theme.color}`}>
              {data.title}
            </div>
          </h2>

          <div className="space-y-3 py-4">
            <h1 className={`${getFontSize(data.mainName)} font-black text-lev-burgundy drop-shadow-md leading-tight transition-all duration-300`}>
              {data.mainName}
            </h1>
            <h3 className="text-5xl md:text-7xl font-bold text-lev-burgundy opacity-90">
              {data.subText}
            </h3>
            {data.notes && (
              <h4 className="text-3xl md:text-4xl font-bold text-lev-burgundy/80 mt-4">
                {data.notes}
              </h4>
            )}
          </div>
        </div>

        {/* שורת תחתית: תורם ואייקון */}
        <div className="w-full flex justify-between items-end px-6 mb-4 md:mb-6">

          {/* אזור תורם - תמונה או טקסט */}
          <div className="flex flex-col items-start justify-end h-24 md:h-32">
            {data.donorLogo ? (
              <div className="animate-fade-in">
                <span className="text-lg md:text-xl font-medium text-gray-500 block mb-1 mr-1">נתרם ע"י:</span>
                <img src={data.donorLogo} alt={data.donorName} className="h-16 md:h-24 w-auto object-contain" />
              </div>
            ) : data.donorName ? (
              <div className="bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 shadow-sm">
                <span className="text-sm text-gray-400 block mb-1">נתרם ע"י:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {data.donorName}
                </span>
              </div>
            ) : null}
          </div>

          {/* אייקון אווירה */}
          <div className={`${theme.color} opacity-90 rotate-12 mb-4 filter drop-shadow-sm transform scale-110 origin-bottom-left`}>
            {theme.icon}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DisplayPage;