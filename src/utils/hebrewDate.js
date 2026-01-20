import { HDate, HebrewCalendar, Location } from '@hebcal/core';

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