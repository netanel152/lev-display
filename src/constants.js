
export const STORAGE_KEYS = {
  DISPLAY_ITEMS: "displayItems",
  IS_ADMIN: "isAdmin",
  APP_SETTINGS: "appSettings",
};

export const DEFAULT_SLIDE_DURATION = 5000; // 5 seconds
export const FADE_DURATION = 800; // 800ms

export const THEME_COLORS = {
  MEMORIAL: "text-lev-burgundy",
  BIRTHDAY: "text-pink-600",
  HEALING: "text-green-600",
};

export const MOCK_DATA = [
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

export const EMPTY_SLIDE_DATA = {
  id: 'empty',
  type: 'memorial',
  footerText: 'ברוכים הבאים ללב חב"ד',
  title: 'הכתובת שלך במרכז הרפואי',
  mainName: 'לב חב"ד',
  subText: 'כאן בשבילכם תמיד',
};
