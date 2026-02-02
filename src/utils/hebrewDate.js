import { HDate, HebrewCalendar, flags } from '@hebcal/core';

export const HEBREW_MONTHS = [
  "תשרי", "חשוון", "כסלו", "טבת", "שבט", "אדר", "אדר א'", "אדר ב'", 
  "ניסן", "אייר", "סיוון", "תמוז", "אב", "אלול"
];

const MONTH_NAME_TO_HEBREW = {
    "Tishrei": "תשרי", "Cheshvan": "חשוון", "Kislev": "כסלו", "Tevet": "טבת", "Sh'vat": "שבט",
    "Adar": "אדר", "Adar I": "אדר א'", "Adar II": "אדר ב'",
    "Nisan": "ניסן", "Iyyar": "אייר", "Sivan": "סיוון", "Tamuz": "תמוז", "Av": "אב", "Elul": "אלול"
};

export const HEBREW_DAYS = [
  "א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ז'", "ח'", "ט'", "י'", 
  "י\"א", "י\"ב", "י\"ג", "י\"ד", "ט\"ו", "ט\"ז", "י\"ז", "י\"ח", "י\"ט", "כ'", 
  "כ\"א", "כ\"ב", "כ\"ג", "כ\"ד", "כ\"ה", "כ\"ו", "כ\"ז", "כ\"ח", "כ\"ט", "ל'"
];

// Custom Gematria function for years (handling 5000-5999)
// Converts 5785 -> "תשפ"ה"
const toHebrewYear = (year) => {
  const hebrewChars = {
    1: "א", 2: "ב", 3: "ג", 4: "ד", 5: "ה", 6: "ו", 7: "ז", 8: "ח", 9: "ט",
    10: "י", 20: "כ", 30: "ל", 40: "מ", 50: "נ", 60: "ס", 70: "ע", 80: "פ", 90: "צ",
    100: "ק", 200: "ר", 300: "ש", 400: "ת"
  };
  
  let y = year % 1000; // Ignore thousands (5000)
  let str = "";
  
  // Hundreds
  while (y >= 400) { str += hebrewChars[400]; y -= 400; }
  while (y >= 100) { 
      let hundreds = Math.floor(y/100)*100;
      str += hebrewChars[hundreds]; 
      y -= hundreds; 
  }
  
  // Tens
  if (y >= 10) { 
      let tens = Math.floor(y/10)*10;
      str += hebrewChars[tens]; 
      y -= tens; 
  }
  
  // Units
  if (y > 0) { str += hebrewChars[y]; }
  
  // Add geresh/gershayim
  if (str.length > 1) {
    str = str.slice(0, -1) + '"' + str.slice(-1);
  } else if (str.length === 1) {
    str += "'";
  }
  
  return str;
};

// Generate years from 5680 (1920) to 5800 (2040)
const START_YEAR = 5680;
const END_YEAR = 5800;
export const HEBREW_YEARS = [];
const YEAR_MAP = {};

for (let y = START_YEAR; y <= END_YEAR; y++) {
  const hebrewYear = toHebrewYear(y);
  HEBREW_YEARS.push(hebrewYear);
  YEAR_MAP[hebrewYear] = y;
}
HEBREW_YEARS.reverse();


// Helper to map Hebrew month string to Hebcal month name (transliterated)
const MONTH_MAP = {
  "תשרי": "Tishrei", "חשוון": "Cheshvan", "כסלו": "Kislev", "טבת": "Tevet", "שבט": "Sh'vat",
  "אדר": "Adar", "אדר א'": "Adar I", "אדר ב'": "Adar II",
  "ניסן": "Nisan", "אייר": "Iyyar", "סיוון": "Sivan", "תמוז": "Tamuz", "אב": "Av", "אלול": "Elul"
};

// Helper to map Hebrew day string to number
const DAY_MAP = {
  "א'": 1, "ב'": 2, "ג'": 3, "ד'": 4, "ה'": 5, "ו'": 6, "ז'": 7, "ח'": 8, "ט'": 9, "י'": 10,
  "י\"א": 11, "י\"ב": 12, "י\"ג": 13, "י\"ד": 14, "ט\"ו": 15, "ט\"ז": 16, "י\"ז": 17, "י\"ח": 18, "י\"ט": 19, "כ'": 20,
  "כ\"א": 21, "כ\"ב": 22, "כ\"ג": 23, "כ\"ד": 24, "כ\"ה": 25, "כ\"ו": 26, "כ\"ז": 27, "כ\"ח": 28, "כ\"ט": 29, "ל'": 30
};

// Function to format HDate to Hebrew string manually to ensure Hebrew letters for year
const formatHDateToHebrew = (hDate) => {
    const day = HEBREW_DAYS[hDate.getDate() - 1];
    const month = MONTH_NAME_TO_HEBREW[hDate.getMonthName()] || hDate.getMonthName();
    const year = toHebrewYear(hDate.getFullYear());
    return `${day} ב${month} ${year}`;
};

// Function to get Gregorian date from Hebrew components
export const getGregorianFromHebrew = (dayStr, monthStr, yearStr) => {
    try {
        const day = DAY_MAP[dayStr];
        const month = MONTH_MAP[monthStr];
        const year = YEAR_MAP[yearStr];
        
        if (day && month && year) {
            const hDate = new HDate(day, month, year);
            return hDate.greg(); // Returns JS Date object
        }
    } catch (e) {
        console.error("Error converting Hebrew date to Gregorian:", e);
    }
    return new Date(); // Fallback to today
};

// פונקציה שמקבלת תאריך לועזי ומחזירה מחרוזת עברית
export const getHebrewDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const hDate = new HDate(date);
  return formatHDateToHebrew(hDate);
};

// פונקציה שמחזירה את התאריך העברי של היום
export const getTodayHebrewDate = () => {
  const today = new HDate();
  return formatHDateToHebrew(today);
};

// פונקציה שמחזירה את שם החג אם היום הוא חג
export const getCurrentHoliday = () => {
  const now = new Date();
  const events = HebrewCalendar.calendar({
    start: now,
    end: now,
    il: true,
  });

  for (const ev of events) {
    const f = ev.getFlags();
    const desc = ev.getDesc();

    if (desc.includes('Omer') || (f & flags.MINOR_FAST)) continue;

    if ((f & flags.CHAG) || (f & flags.ROSH_CHODESH) || (f & flags.CHOL_HAMOED)) {
      return ev.render('he');
    }

    if (desc.includes('Chanukah') || desc.includes('Purim')) {
      return ev.render('he');
    }
  }

  return null;
};
