import { describe, it, expect, vi } from 'vitest';
import { safeJSONParse } from '../storage';

describe('storage utils', () => {
  describe('safeJSONParse', () => {
    it('returns parsed object for valid JSON', () => {
      const json = '{"foo":"bar"}';
      expect(safeJSONParse(json, {})).toEqual({ foo: 'bar' });
    });

    it('returns fallback for invalid JSON', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const fallback = { fallback: true };
      
      expect(safeJSONParse('invalid json', fallback)).toEqual(fallback);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('returns fallback for null value', () => {
      const fallback = { fallback: true };
      expect(safeJSONParse(null, fallback)).toEqual(fallback);
    });

    it('returns fallback for empty string', () => {
        const fallback = { fallback: true };
        expect(safeJSONParse('', fallback)).toEqual(fallback);
    });
  });
});
