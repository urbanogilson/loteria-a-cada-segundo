/**
 * Mega-Sena Lottery Logic
 * Brazilian lottery with 6 numbers from 1-60
 */

/**
 * Generate a UUID v4
 * @returns UUID string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a random Mega-Sena draw of 6 unique numbers between 1-60
 * @returns Sorted array of 6 unique numbers
 */
export function generateDraw(): number[] {
  const numbers = new Set<number>();

  // Keep adding random numbers until we have 6 unique ones
  while (numbers.size < 6) {
    const num = Math.floor(Math.random() * 60) + 1; // 1-60 inclusive
    numbers.add(num);
  }

  // Return as sorted array for consistency
  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Calculates how many numbers match between user's selection and drawn numbers
 * @param userNumbers - Array of 6 numbers selected by user
 * @param drawnNumbers - Array of 6 numbers from the draw
 * @returns Number of matching numbers (0-6)
 */
export function calculateMatches(userNumbers: number[], drawnNumbers: number[]): number {
  return userNumbers.filter(num => drawnNumbers.includes(num)).length;
}

/**
 * Validates user's selected numbers
 * @param numbers - Array of numbers to validate
 * @returns Object with isValid boolean and optional error message
 */
export function validateNumbers(numbers: unknown): { isValid: boolean; error?: string } {
  // Check if it's an array
  if (!Array.isArray(numbers)) {
    return { isValid: false, error: 'Numbers must be an array' };
  }

  // Check length
  if (numbers.length !== 6) {
    return { isValid: false, error: 'Must select exactly 6 numbers' };
  }

  // Check all are numbers
  if (!numbers.every(n => typeof n === 'number')) {
    return { isValid: false, error: 'All values must be numbers' };
  }

  // Check range (1-60)
  if (!numbers.every(n => n >= 1 && n <= 60 && Number.isInteger(n))) {
    return { isValid: false, error: 'Numbers must be integers between 1 and 60' };
  }

  // Check uniqueness
  const uniqueNumbers = new Set(numbers);
  if (uniqueNumbers.size !== 6) {
    return { isValid: false, error: 'Numbers must be unique' };
  }

  return { isValid: true };
}

/**
 * Calculates the theoretical odds of winning based on number of matches
 * @param matches - Number of matching numbers (3-6)
 * @returns String representation of odds (e.g., "1 in 2,332")
 */
export function calculateOdds(matches: number): string {
  // Mega-Sena odds (approximate)
  const odds: Record<number, number> = {
    3: 60,          // Quadra (3 números) - aproximado
    4: 2332,        // Quadra (4 números)
    5: 154518,      // Quina (5 números)
    6: 50063860     // Sena (6 números)
  };

  const oddValue = odds[matches];
  if (!oddValue) {
    return 'Unknown';
  }

  return `1 in ${oddValue.toLocaleString('en-US')}`;
}

/**
 * Type guard to check if a value is a valid number array
 */
export function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every(n => typeof n === 'number');
}
