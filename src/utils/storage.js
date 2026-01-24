/**
 * Safely parses a JSON string.
 * @param {string | null} value - The JSON string to parse.
 * @param {any} fallback - The value to return if parsing fails.
 * @returns {any} - The parsed object or the fallback value.
 */
export const safeJSONParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("[Storage] Failed to parse JSON:", error);
    return fallback;
  }
};
