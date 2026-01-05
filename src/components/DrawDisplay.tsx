/**
 * DrawDisplay Component
 * Displays live lottery draws with client-side generation
 */

import { useState, useEffect, useRef } from 'react';
import Ball from './Ball';
import Confetti from './Confetti';
import { generateDraw, calculateMatches, generateUUID } from '../lib/megasena';
import { saveWin, updateStats } from '../lib/localStorage';

interface DrawData {
  drawId: number;
  numbers: number[];
  timestamp: number;
  yourMatches: number;
}

interface DrawDisplayProps {
  userNumbers: number[];
}

export default function DrawDisplay({ userNumbers }: DrawDisplayProps) {
  const [currentDraw, setCurrentDraw] = useState<DrawData | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flashWin, setFlashWin] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const drawCounterRef = useRef(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate unique key for current number selection
  const getStorageKey = () => {
    const numbersKey = userNumbers.sort((a, b) => a - b).join('-');
    return `draw_count_${numbersKey}`;
  };

  // Load draw count from localStorage on mount or when numbers change
  useEffect(() => {
    const storageKey = getStorageKey();
    const savedCount = localStorage.getItem(storageKey);

    if (savedCount) {
      drawCounterRef.current = parseInt(savedCount, 10);
    } else {
      drawCounterRef.current = 1;
    }
  }, [userNumbers]);

  useEffect(() => {
    const runDraw = () => {
      if (isPaused) return;

      // Start flip animation
      setIsFlipping(true);

      // Generate new numbers after a brief delay (flip animation)
      setTimeout(() => {
        const drawnNumbers = generateDraw();
        const matches = calculateMatches(userNumbers, drawnNumbers);
        const timestamp = Date.now();

        // Update stats for every draw
        updateStats(matches, userNumbers);

        // Save to localStorage if 4+ matches
        if (matches >= 4) {
          const winData = {
            id: generateUUID(),
            numbers: drawnNumbers,
            userNumbers: userNumbers,
            matches,
            timestamp
          };
          saveWin(winData);

          // Trigger history update event
          window.dispatchEvent(new CustomEvent('lottery-win', { detail: winData }));
        }

        const currentDrawId = drawCounterRef.current++;

        // Save draw count to localStorage
        const storageKey = getStorageKey();
        localStorage.setItem(storageKey, drawCounterRef.current.toString());

        // Update current draw display
        setCurrentDraw({
          drawId: currentDrawId,
          numbers: drawnNumbers,
          timestamp: Math.floor(timestamp / 1000),
          yourMatches: matches
        });

        // End flip animation
        setIsFlipping(false);

        // Emit matching numbers for the PlaySection to highlight
        const matchedNumbers = userNumbers.filter(num => drawnNumbers.includes(num));
        if (matchedNumbers.length > 0) {
          localStorage.setItem('current_matches', JSON.stringify(matchedNumbers));
          window.dispatchEvent(new CustomEvent('lottery-match', { detail: matchedNumbers }));
        }

        // Visual feedback for wins
        if (matches >= 3) {
          setFlashWin(true);
          setTimeout(() => setFlashWin(false), 500);

          // Show confetti for 5+ matches
          if (matches >= 5) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        }

        // Pause on wins
        if (matches >= 4) {
          setIsPaused(true);
          const pauseDuration = matches === 6 ? 30000 : matches === 5 ? 2000 : 1000;

          setTimeout(() => {
            setIsPaused(false);
          }, pauseDuration);
        }
      }, 300); // Flip animation duration
    };

    // Initial draw
    runDraw();

    // Set up interval
    intervalRef.current = setInterval(runDraw, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userNumbers, isPaused]);

  if (!currentDraw) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-sm md:text-base text-gray-600">Aguardando próximo sorteio...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-5 md:space-y-6 transition-all duration-300 ${flashWin ? 'scale-[1.02]' : ''}`}>
      {showConfetti && <Confetti />}

      {/* Drawn numbers - Main focus */}
      <div className={`bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 p-5 md:p-8 rounded-2xl shadow-2xl border-2 ${currentDraw.yourMatches >= 3 ? 'border-yellow-400 animate-pulse' : 'border-green-300'}`}>
        <div className="text-center mb-4 md:mb-6">
          <p className="text-xs md:text-sm text-green-600 font-semibold mb-1">
            {new Date(currentDraw.timestamp * 1000).toLocaleTimeString('pt-BR')}
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Sorteio #{currentDraw.drawId.toLocaleString('pt-BR')}
          </h2>
          {isPaused && (
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
              <span className="text-yellow-700 font-bold text-sm md:text-base">
                {currentDraw.yourMatches === 6 ? '🏆 SENA!' :
                 currentDraw.yourMatches === 5 ? '⭐ QUINA!' :
                 '🎊 QUADRA!'}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-1.5 sm:gap-2 md:gap-3 justify-center items-center">
          {currentDraw.numbers.map((num, index) => (
            <div
              key={`${currentDraw.drawId}-${num}`}
              className={`flex-shrink-0 ${isFlipping ? 'animate-[flipIn_0.3s_ease-out]' : ''}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Ball
                number={num}
                isMatched={userNumbers.includes(num)}
                size="lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
