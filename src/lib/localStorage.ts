/**
 * localStorage Manager for Mega-Sena Lottery
 * Handles browser storage for wins and personal statistics
 */

export interface WinRecord {
  id: string;              // UUID
  numbers: number[];       // Drawn numbers
  userNumbers: number[];   // User's numbers
  matches: number;         // 4, 5, or 6
  timestamp: number;       // Unix timestamp (milliseconds)
}

export interface PersonalStats {
  totalDraws: number;      // Total plays since start
  totalWins: number;       // Wins with 4+ matches
  wins4: number;           // Quadra wins
  wins5: number;           // Quina wins
  wins6: number;           // Sena wins
  biggestWin: number;      // Highest match count
  userNumbers: number[];   // Current selected numbers
}

// Storage keys
const STORAGE_KEYS = {
  WINS: 'megasena_wins',
  STATS: 'megasena_stats',
  USER_NUMBERS: 'megasena_user_numbers'
} as const;

// Maximum number of wins to store (to avoid localStorage limits)
const MAX_WINS = 100;

/**
 * Initialize stats if they don't exist
 */
function initializeStats(): PersonalStats {
  return {
    totalDraws: 0,
    totalWins: 0,
    wins4: 0,
    wins5: 0,
    wins6: 0,
    biggestWin: 0,
    userNumbers: []
  };
}

/**
 * Save a win record to localStorage
 */
export function saveWin(record: WinRecord): void {
  try {
    const wins = getWinHistory();
    wins.unshift(record); // Add to beginning

    // Prune old records if exceeding limit
    if (wins.length > MAX_WINS) {
      wins.splice(MAX_WINS);
    }

    localStorage.setItem(STORAGE_KEYS.WINS, JSON.stringify(wins));
  } catch (error) {
    console.error('Error saving win to localStorage:', error);
  }
}

/**
 * Get win history from localStorage
 */
export function getWinHistory(): WinRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WINS);
    if (!data) return [];
    return JSON.parse(data) as WinRecord[];
  } catch (error) {
    console.error('Error reading win history from localStorage:', error);
    return [];
  }
}

/**
 * Get personal statistics from localStorage
 */
export function getStats(): PersonalStats {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!data) return initializeStats();
    return JSON.parse(data) as PersonalStats;
  } catch (error) {
    console.error('Error reading stats from localStorage:', error);
    return initializeStats();
  }
}

/**
 * Update statistics after a draw
 */
export function updateStats(matches: number, userNumbers: number[]): void {
  try {
    const stats = getStats();

    // Always increment total draws
    stats.totalDraws++;

    // Update win statistics if 4+ matches
    if (matches >= 4) {
      stats.totalWins++;

      if (matches === 4) stats.wins4++;
      else if (matches === 5) stats.wins5++;
      else if (matches === 6) stats.wins6++;

      // Update biggest win
      if (matches > stats.biggestWin) {
        stats.biggestWin = matches;
      }
    }

    // Update current user numbers
    stats.userNumbers = userNumbers;

    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating stats in localStorage:', error);
  }
}

/**
 * Clear all win history
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.WINS);
  } catch (error) {
    console.error('Error clearing history from localStorage:', error);
  }
}

/**
 * Clear all statistics (keeps user numbers)
 */
export function clearStats(): void {
  try {
    const stats = getStats();
    const resetStats = initializeStats();
    resetStats.userNumbers = stats.userNumbers; // Preserve user numbers
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(resetStats));
  } catch (error) {
    console.error('Error clearing stats from localStorage:', error);
  }
}

/**
 * Clear everything
 */
export function clearAll(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.WINS);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.USER_NUMBERS);
  } catch (error) {
    console.error('Error clearing all data from localStorage:', error);
  }
}

/**
 * Save user's selected numbers
 */
export function saveUserNumbers(numbers: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_NUMBERS, JSON.stringify(numbers));
  } catch (error) {
    console.error('Error saving user numbers to localStorage:', error);
  }
}

/**
 * Get user's previously selected numbers
 */
export function getUserNumbers(): number[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_NUMBERS);
    if (!data) return null;
    return JSON.parse(data) as number[];
  } catch (error) {
    console.error('Error reading user numbers from localStorage:', error);
    return null;
  }
}
