import { useState, useEffect } from "react";
import { Heart, Flame, Gift, Activity } from "lucide-react";
import { getTodayHebrewDate } from "../utils/hebrewDate";

// נתוני דמה לבדיקה ראשונית (מדמה את מסד הנתונים)
const MOCK_DATA = [
  {
    id: 1,
    type: "memorial", // סוג: זיכרון
    title: "מוקדשת לזיכרון ולעילוי נשמת",
    mainName: "אברהם זערור",
    subText: 'בן אפרים ז"ל',
    notes: 'ת.נ.צ.ב.ה',
    footerText: 'פעילות קפיטריית החסד לב חב"ד',
    donorName: "One Touch",
  },
  {
    id: 2,
    type: "birthday", // סוג: יום הולדת
    title: "חוגגים יום הולדת שמח ל...",
    mainName: "חיים מושקא",
    subText: "שתחי׳ - בת 5",
    footerText: 'באהבה ממשפחת לב חב"ד',
    donorName: null,
  },
  {
    id: 3,
    type: "healing", // סוג: רפואה
    title: "נא להתפלל לרפואת",
    mainName: "ישראל בן שרה",
    subText: "לרפואה שלמה וקרובה",
    footerText: 'פעילות קפיטריית החסד לב חב"ד',
    donorName: null,
  },
];

const DisplayPage = () => {
  const [index, setIndex] = useState(0);

  // טיימר להחלפת שקופיות כל 5 שניות
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MOCK_DATA.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const data = MOCK_DATA[index];

  // עיצוב דינמי לפי סוג האירוע
  const getTheme = (type) => {
    switch (type) {
      case "birthday":
        return {
          icon: <Gift size={60} />,
          color: "text-pink-600",
          border: "border-pink-300",
        };
      case "healing":
        return {
          icon: <Activity size={60} />,
          color: "text-green-600",
          border: "border-green-300",
        };
      default: // memorial
        return {
          icon: <Flame size={60} />,
          color: "text-lev-burgundy",
          border: "border-orange-200",
        };
    }
  };

  const theme = getTheme(data.type);

  return (
    <div className="h-screen w-full bg-lev-yellow relative flex items-center justify-center p-4 md:p-8">
      <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm text-lev-burgundy font-bold text-lg">
        {getTodayHebrewDate()}
      </div>
      {/* אלמנט כחול תחתון */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-lev-blue z-0">
        <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-b-lev-blue"></div>
      </div>

      {/* הכרטיס הלבן המרכזי */}
      <div
        key={data.id}
        className={`relative z-10 bg-white w-full max-w-5xl aspect-[4/3] md:aspect-video rounded-[3rem] shadow-2xl flex flex-col items-center text-center p-6 border-8 border-double ${theme.border}`}
      >
        {/* לוגו לב חב"ד */}
        <div className="flex flex-col items-center mt-2">
          <div className="flex items-center gap-2 text-lev-burgundy">
            <Heart fill="#7A1429" size={42} />
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
              לב חב"ד
            </h1>
          </div>
          <p className="text-lev-burgundy text-lg md:text-xl font-bold mt-1">
            הכתובת שלך במרכז הרפואי
          </p>
        </div>

        {/* תוכן ההקדשה */}
        <div className="flex-1 flex flex-col justify-center items-center w-full space-y-4 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-lev-burgundy/90">
            {data.footerText}
            <div
              className={`text-2xl md:text-3xl mt-2 font-normal ${theme.color}`}
            >
              {data.title}
            </div>
          </h2>

          <div className="space-y-2 py-2">
            <h1 className="text-7xl md:text-9xl font-black text-lev-burgundy drop-shadow-md leading-tight">
              {data.mainName}
            </h1>
            <h3 className="text-4xl md:text-6xl font-bold text-lev-burgundy opacity-90">
              {data.subText}
            </h3>
            {data.notes && (
              <h4 className="text-2xl md:text-3xl font-bold text-lev-burgundy/80 mt-2">
                {data.notes}
              </h4>
            )}
          </div>
        </div>

        {/* שורת תחתית: תורם ואייקון */}
        <div className="w-full flex justify-between items-end px-4 mb-2">
          <div className="flex flex-col items-start">
            {data.donorName && (
              <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                <span className="text-xs text-gray-400 block">נתרם ע"י:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {data.donorName}
                </span>
              </div>
            )}
          </div>
          <div className={`${theme.color} opacity-80 rotate-12 mb-2`}>
            {theme.icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayPage;
