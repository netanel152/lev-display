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

// Generate years: current year +/- 10 years
const currentYearNum = new HDate().getFullYear();
export const CURRENT_HEBREW_YEAR = toHebrewYear(currentYearNum);
const START_YEAR = currentYearNum - 10; 
const END_YEAR = currentYearNum + 20;   
export const HEBREW_YEARS = [];
const YEAR_MAP = {};

for (let y = START_YEAR; y <= END_YEAR; y++) {
  const hebrewYear = toHebrewYear(y);
  HEBREW_YEARS.push(hebrewYear);
  YEAR_MAP[hebrewYear] = y;
}
HEBREW_YEARS.reverse(); // Newest years first


// Helper to map Hebrew month string to Hebcal month index
// Nisan is 1 in Hebcal
const MONTH_MAP = {
  "ניסן": 1, "אייר": 2, "סיוון": 3, "תמוז": 4, "אב": 5, "אלול": 6,
  "תשרי": 7, "חשוון": 8, "כסלו": 9, "טבת": 10, "שבט": 11,
  "אדר": 12, "אדר א'": 12, "אדר ב'": 13
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
        const monthIndex = MONTH_MAP[monthStr];
        const year = YEAR_MAP[yearStr];
        
        if (day && monthIndex && year) {
            const hDate = new HDate(day, monthIndex, year);
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

// פונקציה שמחזירה את כל החגים וראשי חודשים של השנה הקרובה (החל מהיום)
export const getYearHolidays = () => {
  const now = new Date();
  const oneYearLater = new Date();
  oneYearLater.setFullYear(now.getFullYear() + 1);
  
  const events = HebrewCalendar.calendar({
    start: now,
    end: oneYearLater,
    il: true,
    shabbatMevarkhim: false,
  });

  const holidayList = [];
  const processedHolidays = new Set();
  
  for (const ev of events) {
    const f = ev.getFlags();
    const desc = ev.getDesc();
    const hDate = ev.getDate();

    // Skip minor things
    if (desc.includes('Omer') || (f & flags.MINOR_FAST) || desc.includes('Parashat')) continue;

    const isChag = (f & flags.CHAG) || desc.includes('Chanukah') || desc.includes('Purim');
    const isRoshChodesh = (f & flags.ROSH_CHODESH);
    const isCholHaMoed = (f & flags.CHOL_HAMOED);

    if (isChag || isRoshChodesh || isCholHaMoed) {
      // Consolidate major holidays (except Rosh Chodesh which we want for every specific day)
      const baseDesc = desc.replace(/ [IV]+$/, '').replace(/: \d Day$/, '').replace(/ Day \d$/, '').trim();
      
      if (!isRoshChodesh && processedHolidays.has(baseDesc + hDate.getFullYear())) continue;
      if (!isRoshChodesh) processedHolidays.add(baseDesc + hDate.getFullYear());

      // Determine duration
      let durationDays = 1;
      let holidayOverride = "";
      
      if (desc.includes('Chanukah')) {
        durationDays = 8;
        holidayOverride = "Chanukah";
      } else if (desc.includes('Purim')) {
        durationDays = 1;
        holidayOverride = "Purim";
      } else if (desc.includes('Pesach')) {
        durationDays = 7;
        holidayOverride = "Pesach";
      } else if (desc.includes('Shavuot')) {
        durationDays = 1;
        holidayOverride = "Shavuot";
      } else if (desc.includes('Rosh Hashana')) {
        durationDays = 2;
        holidayOverride = "Rosh Hashana";
      } else if (desc.includes('Sukkot')) {
        durationDays = 8; 
        holidayOverride = "Sukkot";
      }

      const hebrewDateStr = formatHDateToHebrew(hDate);
      const gregDateStr = hDate.greg().toLocaleDateString('en-CA');

      holidayList.push({
        id: isRoshChodesh ? `builtin-rc-${desc}-${gregDateStr}` : `builtin-${baseDesc}-${hDate.getFullYear()}`, 
        type: 'holiday',
        title: isRoshChodesh ? "ראש חודש טוב" : "חג שמח!",
        mainName: ev.render('he').replace(/ יום [א-ט]$/, '').replace(/ 'יום [א-ט]$/, '').trim(),
        subText: isRoshChodesh ? "שנשמע ונתבשר בשורות טובות" : "מאחלים לכל בית ישראל",
        hebrewDate: hebrewDateStr,
        gregorianDateString: gregDateStr,
        date: gregDateStr,
        holidayOverride: holidayOverride,
        isBuiltIn: true,
        durationDays: durationDays
      });
    }
  }

  return holidayList;
};

/**
 * Compares two Hebrew date strings and returns true if they have the same day and month.
 * Format expected: "י\"ז באדר תשפ\"ו" or "י\"ז באדר א' תשפ\"ו"
 */
export const isSameHebrewDayAndMonth = (dateStr1, dateStr2) => {
  if (!dateStr1 || !dateStr2) return false;
  
  const getParts = (str) => {
    // Normalize string: remove multiple spaces and trim
    const normalized = str.trim().replace(/\s+/g, ' ');
    const parts = normalized.split(' ');
    
    // We expect at least [Day, Month..., Year]
    if (parts.length < 3) return null;
    
    const day = parts[0];
    const year = parts[parts.length - 1];
    
    // The month is everything in between. 
    // Usually starts with 'ב', e.g., "באדר" or "באדר א'"
    const monthParts = parts.slice(1, -1);
    let month = monthParts.join(' ');
    
    if (month.startsWith('ב')) {
      month = month.substring(1);
    }
    
    return { day, month };
  };

  const p1 = getParts(dateStr1);
  const p2 = getParts(dateStr2);

  if (!p1 || !p2) return false;

  // Exact comparison of day and month parts
  return p1.day === p2.day && p1.month === p2.month;
};
