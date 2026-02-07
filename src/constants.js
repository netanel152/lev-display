export const STORAGE_KEYS = {
  DISPLAY_ITEMS: "displayItems",
  IS_ADMIN: "isAdmin",
  APP_SETTINGS: "appSettings",
};

export const DEFAULT_SLIDE_DURATION = 5000; // 5 seconds
export const FADE_DURATION = 800; // 800ms

export const THEME_COLORS = {
  MEMORIAL: "text-amber-800",
  BIRTHDAY: "text-pink-600",
  HEALING: "text-green-600",
  SUCCESS: "text-blue-600", // Added for consistency
};

export const MOCK_DATA = [
  {
    id: 1,
    type: "memorial",
    title: "לעילוי נשמת ולעילוי נשמת",
    mainName: "אברהם יצחק זערור",
    subText: 'בן אפרים ושרה ז"ל',
    hebrewDate: "ט' באדר תשפ\"ו",
    notes: "נפטר בשיבה טובה",
    donorName: "משפחת זערור היקרה",
    donorLogo: null,
  },
  {
    id: 2,
    type: "birthday",
    title: "יום הולדת שמח ומאושר ל...",
    mainName: "חיה מושקא",
    subText: "עד מאה ועשרים כעשרים!",
    footerText: 'באהבה ממשפחת לב חב"ד',
    donorName: null,
    donorLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  },
  {
    id: 3,
    type: "healing",
    title: "נא להתפלל לרפואתו השלמה של",
    mainName: "ישראל מאיר בן רבקה רחל",
    subText: "בתוך שאר חולי ישראל",
    footerText: 'קפיטריית החסד לב חב"ד',
    donorName: "מתנת אנונימי",
    donorLogo: null,
  },
  {
    id: 4,
    type: "success",
    title: "להצלחה מרובה בכל מעשי ידיו",
    mainName: "משה",
    subText: "בגשמיות וברוחניות",
    footerText: 'מברכים בחום, החברים',
    donorName: "קבוצת חברים",
    donorLogo: null,
  },
  {
    id: 5,
    type: "memorial",
    title: "מוקדש לזכרו הטהור של",
    mainName: "הרב לוי יצחק שניאורסון",
    subText: "אביו של הרבי מליובאוויטש",
    hebrewDate: "כ' באב",
    footerText: "",
    donorName: null,
    donorLogo: null,
  }
];

export const EMPTY_SLIDE_DATA = {
  id: 'empty',
  type: 'memorial',
  footerText: 'ברוכים הבאים ללב חב"ד',
  title: 'הכתובת שלך במרכז הרפואי',
  mainName: 'לב חב"ד',
  subText: 'כאן בשבילכם תמיד',
};