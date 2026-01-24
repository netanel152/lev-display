import { useState, useEffect, useRef } from "react";
import { Heart, Flame, Gift, Activity, Lock, Maximize, Minimize } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTodayHebrewDate } from "../utils/hebrewDate";
// וודא שהקובץ הזה קיים בתיקיית assets שלך
import oneTouchLogo from "../assets/onetouch-logo.svg";

// נתוני דמה לבדיקה
const MOCK_DATA = [
  {
    id: 1,
    type: "memorial",
    title: "מוקדשת לזיכרון ולעילוי נשמת",
    mainName: "אברהם זערור",
    subText: 'בן אפרים ז"ל',
    notes: 'ת.נ.צ.ב.ה',
    donorName: null,
    donorLogo: null,
  },
  {
    id: 2,
    type: "birthday",
    title: "חוגגים יום הולדת שמח ל...",
    mainName: "חיים מושקא",
    subText: "שתחי׳ - בת 5",
    footerText: 'באהבה ממשפחת לב חב"ד',
    donorName: null,
    donorLogo: null,
  },
  {
    id: 3,
    type: "healing",
    title: "נא להתפלל לרפואת",
    mainName: "ישראל בן שרה",
    subText: "לרפואה שלמה וקרובה",
    footerText: 'פעילות קפיטריית החסד לב חב"ד',
    donorName: null,
    donorLogo: null,
  },
];

const DisplayPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("displayItems");
    return saved ? JSON.parse(saved) : MOCK_DATA;
  });
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [hebrewDate, setHebrewDate] = useState(getTodayHebrewDate());
  const wakeLock = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Wake Lock API implementation
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock.current = await navigator.wakeLock.request('screen');
          console.log('Wake Lock is active!');
          
          wakeLock.current.addEventListener('release', () => {
            console.log('Wake Lock released');
          });
        }
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
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
        console.error(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // סינון פריטים שמתאימים להיום בלבד
  const todayItems = items.filter(item => {
    const todayGregorian = new Date().toISOString().split('T')[0];
    const todayHebrew = getTodayHebrewDate();

    // אם לא הוגדר תאריך בכלל - נציג אותו תמיד (כדי לא לאבד מידע שהמשתמש הזין ללא תאריך)
    // או אם התאריך הלועזי מתאים להיום
    // או אם התאריך העברי מתאים להיום
    return !item.date && !item.hebrewDate ||
      item.date === todayGregorian ||
      item.hebrewDate === todayHebrew;
  });

  // האזנה לשינויים ב-localStorage (אם נפתח בטאב אחר) + רענון כל 5 שניות
  useEffect(() => {
    const interval = setInterval(() => {
      if (todayItems.length === 0) return;

      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % todayItems.length);

        const saved = localStorage.getItem("displayItems");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (JSON.stringify(parsed) !== JSON.stringify(items)) {
            setItems(parsed);
          }
        }

        setFade(true);
      }, 800);

    }, 5000);

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
    : {
      id: 'empty',
      type: 'memorial',
      footerText: 'ברוכים הבאים ללב חב"ד',
      title: 'הכתובת שלך במרכז הרפואי',
      mainName: 'לב חב"ד',
      subText: 'כאן בשבילכם תמיד',
    };

  const getTheme = (type) => {
    switch (type) {
      case "birthday":
        return {
          icon: <Gift size={70} />,
          color: "text-pink-600",
        };
      case "healing":
        return {
          icon: <Activity size={70} />,
          color: "text-green-600",
        };
      default: // memorial
        return {
          icon: <Flame size={70} />,
          color: "text-lev-burgundy",
        };
    }
  };

  const theme = getTheme(data.type);

  return (
    <div className="h-screen w-full bg-lev-yellow relative flex items-center justify-center p-4 md:p-8 overflow-hidden">

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
      <div className="absolute top-6 right-6 z-20 bg-white/95 backdrop-blur px-6 py-3 rounded-full shadow-md text-lev-burgundy font-bold text-2xl md:text-3xl border-2 border-lev-yellow">
        {hebrewDate}
      </div>
      {/* אלמנט כחול תחתון */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-lev-blue z-0">
        <div className="absolute left-1/2 -translate-x-1/2 -top-4 md:-top-6 w-0 h-0 border-l-[20px] md:border-l-[30px] border-l-transparent border-r-[20px] md:border-r-[30px] border-r-transparent border-b-[20px] md:border-b-[30px] border-b-lev-blue"></div>
      </div>

      {/* הכרטיס הלבן המרכזי - ללא מסגרת ירוקה */}
      <div
        key={data.id}
        className="relative z-10 bg-white w-full max-w-6xl aspect-[4/3] md:aspect-video rounded-[3rem] shadow-2xl flex flex-col items-center text-center p-6 md:p-10"
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
        <div className="flex-1 flex flex-col justify-center items-center w-full space-y-6 animate-fade-in my-4">
          <h2 className="text-3xl md:text-5xl font-bold text-lev-burgundy/90">
            {data.footerText}
            <div className={`text-2xl md:text-4xl mt-3 font-normal ${theme.color}`}>
              {data.title}
            </div>
          </h2>

          <div className="space-y-3 py-4">
            <h1 className="text-8xl md:text-[8rem] lg:text-[10rem] font-black text-lev-burgundy drop-shadow-md leading-tight">
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