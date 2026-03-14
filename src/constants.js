import { getTodayHebrewDate } from "./utils/hebrewDate";

export const STORAGE_KEYS = {
  DISPLAY_ITEMS: "displayItems",
  IS_ADMIN: "isAdmin",
  APP_SETTINGS: "appSettings",
};

export const DEFAULT_SLIDE_DURATION = 5; // 5 seconds
export const FADE_DURATION = 800; // 800ms

export const THEME_COLORS = {
  MEMORIAL: "text-amber-800",
  BIRTHDAY: "text-pink-600",
  HEALING: "text-green-600",
  SUCCESS: "text-blue-600",
};

export const FIXED_TITLES = {
  memorial: "לזכרון ועילוי נשמת",
  birthday: "בברכת מזל טוב ליום ההולדת",
  healing: "לרפואת",
  success: "להצלחה וברכה",
  holiday: "חג שמח!"
};

const currentHebrewDate = getTodayHebrewDate();

export const MOCK_DATA = [
  {
    id: 1,
    type: "memorial",
    title: FIXED_TITLES.memorial,
    mainName: "אברהם יצחק זערור ז\"ל",
    subText: "בן אפרים ושרה",
    hebrewDate: currentHebrewDate,
    donorName: "משפחת זערור",
  },
  {
    id: 2,
    type: "birthday",
    title: FIXED_TITLES.birthday,
    mainName: "חיה מושקא",
    subText: "עד מאה ועשרים כעשרים!",
    hebrewDate: currentHebrewDate,
    footerText: 'באהבה ממשפחת לב חב"ד',
  },
  {
    id: 3,
    type: "healing",
    title: FIXED_TITLES.healing,
    mainName: "ישראל מאיר בן רבקה רחל",
    subText: "בתוך שאר חולי ישראל",
    hebrewDate: currentHebrewDate,
    footerText: 'קפיטריית החסד לב חב"ד',
    donorName: "מתנת אנונימי",
  },
  {
    id: 4,
    type: "success",
    title: FIXED_TITLES.success,
    mainName: "משפחת לוי",
    subText: "בכל מעשי ידיהם",
    hebrewDate: currentHebrewDate,
    footerText: 'מברכים בחום, החברים',
  },
  {
    id: 5,
    type: "memorial",
    title: FIXED_TITLES.memorial,
    mainName: "הרב לוי יצחק שניאורסון",
    subText: "אביו של הרבי מליובאוויטש",
    hebrewDate: currentHebrewDate,
  },
  {
    id: 6,
    type: "holiday",
    title: "חג אורים שמח",
    mainName: "חנוכה",
    subText: "מאחלים חג שמח לכל בית ישראל",
    hebrewDate: getTodayHebrewDate(),
    holidayOverride: "Chanukah"
  },
  {
    id: 7,
    type: "holiday",
    title: "משנכנס אדר מרבין בשמחה",
    mainName: "פורים",
    subText: "חג פורים שמח לכל עם ישראל",
    hebrewDate: getTodayHebrewDate(),
    holidayOverride: "Purim"
  },
  {
    id: 8,
    type: "holiday",
    title: "פסח כשר ושמח",
    mainName: "חג הפסח",
    subText: "בציפייה לגאולה השלימה בקרוב",
    hebrewDate: getTodayHebrewDate(),
    holidayOverride: "Pesach"
  },
  {
    id: 9,
    type: "holiday",
    title: "זמן מתן תורתנו",
    mainName: "שבועות",
    subText: "חג שבועות שמח",
    hebrewDate: getTodayHebrewDate(),
    holidayOverride: "Shavuot"
  },
  {
    id: 10,
    type: "holiday",
    title: "שנה טובה ומתוקה",
    mainName: "ראש השנה",
    subText: "כתיבה וחתימה טובה לשנה טובה ומתוקה",
    hebrewDate: getTodayHebrewDate(),
    holidayOverride: "Rosh Hashana"
  },
  {
    id: 11,
    type: "holiday",
    title: "חג שמח",
    mainName: "חג הסוכות",
    subText: "זמן שמחתנו",
    hebrewDate: getTodayHebrewDate(),
    holidayOverride: "Sukkot"
  }
];

export const EMPTY_SLIDE_DATA = {
  id: 'empty',
  type: 'success',
  title: 'ברוכים הבאים',
  mainName: 'לב חב"ד',
  subText: 'הכתובת שלכם במרכז הרפואי',
  footerText: 'תמיד כאן בשבילכם',
};

export const DEFAULT_SETTINGS = {
  slideDuration: DEFAULT_SLIDE_DURATION,
  donationUrl: "https://www.levchabad.org/donate",
  contactPhone: "050-7690577",
  contactEmail: "office@LevChabad.org.il",
  defaultSlideTitle: EMPTY_SLIDE_DATA.title,
  defaultSlideMainName: EMPTY_SLIDE_DATA.mainName,
  defaultSlideSubText: EMPTY_SLIDE_DATA.subText,
  defaultSlideFooterText: EMPTY_SLIDE_DATA.footerText,
  sponsorsText: "לב חב\"ד - תמיד כאן בשבילכם",
};
