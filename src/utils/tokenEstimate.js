/**
 * Count words in a string.
 * Trims whitespace and splits on any whitespace sequence.
 */
export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Validate that the combined CV + JD word count is within the 3000-word limit.
 * Returns { valid, totalWords, error }.
 */
export function validateCombinedLength(cvText, jdText) {
  const totalWords = countWords(cvText) + countWords(jdText);
  const valid = totalWords <= 3000;
  return {
    valid,
    totalWords,
    error: valid
      ? null
      : 'Combined Resume and JD too long. Please trim one or both. Recommended max: 2000-2500 words',
  };
}
