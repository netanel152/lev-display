import { HDate, HebrewCalendar, Location, flags } from '@hebcal/core';

// פונקציה שמקבלת תאריך לועזי ומחזירה מחרוזת עברית (למשל: כ"ה בתשרי תשפ"ד)
export const getHebrewDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const hDate = new HDate(date);
  // הפונקציה render('he') מחזירה את הטקסט בעברית
  return hDate.render('he'); 
};

// פונקציה שמחזירה את התאריך העברי של היום (עבור הכותרת במסך)
export const getTodayHebrewDate = () => {
  const today = new HDate();
  return today.render('he');
};

// פונקציה שמחזירה את שם החג אם היום הוא חג (עבור שקופית חג)
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

    // התעלמות מצומות קטנים וספירת העומר
    if (desc.includes('Omer') || (f & flags.MINOR_FAST)) continue;

    // חגים מרכזיים: חג, ראש חודש, חול המועד
    if ((f & flags.CHAG) || (f & flags.ROSH_CHODESH) || (f & flags.CHOL_HAMOED)) {
      return ev.render('he');
    }

    // בדיקה ספציפית לחנוכה ופורים (שלפעמים מסווגים אחרת)
    if (desc.includes('Chanukah') || desc.includes('Purim')) {
      return ev.render('he');
    }
  }

  return null;
};