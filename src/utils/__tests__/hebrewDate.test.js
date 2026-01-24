import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { getHebrewDate, getTodayHebrewDate, getCurrentHoliday } from '../hebrewDate';

describe('hebrewDate utils', () => {
  describe('getHebrewDate', () => {
    it('returns empty string for null/undefined input', () => {
      expect(getHebrewDate(null)).toBe('');
      expect(getHebrewDate(undefined)).toBe('');
    });

    it('converts Gregorian date to Hebrew date string', () => {
      // 2023-10-01 is roughly Sukkot, or at least Tishrei
      // Let's pick a known date. 
      // 24 January 2026 is today. 
      // 1 Tishrei 5784 was Sept 16 2023.
      
      const result = getHebrewDate('2023-09-16');
      expect(result).toContain('1 תִּשְׁרֵי, 5784');
    });
  });

  describe('getTodayHebrewDate', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns today\'s hebrew date', () => {
        // Mock the date to 2023-09-16 (1 Tishrei 5784)
        const date = new Date('2023-09-16T12:00:00');
        vi.setSystemTime(date);

        const result = getTodayHebrewDate();
        expect(result).toContain('1 תִּשְׁרֵי, 5784');
    });
  });

  describe('getCurrentHoliday', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns null on a regular day', () => {
        // A random day in Cheshvan (no holidays usually)
        // 2023-11-01 -> 17 Cheshvan 5784
        const date = new Date('2023-11-01T12:00:00');
        vi.setSystemTime(date);
        
        expect(getCurrentHoliday()).toBeNull();
    });

    it('returns holiday name on a holiday (Rosh Hashana)', () => {
        // 2023-09-16 -> Rosh Hashana
        const date = new Date('2023-09-16T12:00:00');
        vi.setSystemTime(date);

        const holiday = getCurrentHoliday();
        expect(holiday).toMatch(/רֹאשׁ הַשָּׁנָה/);
    });

    it('returns holiday name for Chanukah', () => {
        // 2023-12-08 -> Chanukah 1st Candle (starts eve before, day is 25 Kislev)
        const date = new Date('2023-12-08T12:00:00');
        vi.setSystemTime(date);

        const holiday = getCurrentHoliday();
        expect(holiday).toMatch(/חֲנוּכָּה/);
    });
    
    it('returns holiday name for Purim', () => {
        // 2024-03-24 -> Purim
        const date = new Date('2024-03-24T12:00:00');
        vi.setSystemTime(date);

        const holiday = getCurrentHoliday();
        expect(holiday).toMatch(/פּוּרִים/);
    });
  });
});
