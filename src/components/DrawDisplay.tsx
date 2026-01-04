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

        // Update current draw display
        setCurrentDraw({
          drawId: drawCounterRef.current++,
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

      {/* Match result - Prominent display */}
      {/* <div className="text-center">
        {currentDraw.yourMatches === 0 && (
          <div className="bg-red-100 p-4 rounded-xl border-2 border-red-300">
            <p className="text-red-700 text-lg md:text-xl font-bold">
            Nenhum acerto desta vez</p>
          </div>
        )}
        {currentDraw.yourMatches > 0 && currentDraw.yourMatches < 3 && (
          <div className="bg-blue-100 p-4 rounded-xl border-2 border-blue-300">
            <p className="text-blue-700 text-lg md:text-xl font-bold">
              {currentDraw.yourMatches} acerto{currentDraw.yourMatches > 1 ? 's' : ''}!
            </p>
          </div>
        )}
        {currentDraw.yourMatches === 3 && (
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-5 md:p-6 rounded-2xl border-4 border-yellow-400 shadow-xl animate-pulse">
            <p className="text-yellow-700 text-2xl md:text-3xl font-black">
              🎉 TERNO! 🎉
            </p>
            <p className="text-yellow-600 text-sm md:text-base mt-1">3 acertos</p>
          </div>
        )}
        {currentDraw.yourMatches === 4 && (
          <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-5 md:p-6 rounded-2xl border-4 border-orange-400 shadow-xl animate-pulse">
            <p className="text-orange-700 text-2xl md:text-3xl font-black">
              🎊 QUADRA! 🎊
            </p>
            <p className="text-orange-600 text-sm md:text-base mt-1">4 acertos</p>
          </div>
        )}
        {currentDraw.yourMatches === 5 && (
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-6 md:p-8 rounded-2xl border-4 border-purple-500 shadow-2xl animate-bounce">
            <p className="text-purple-700 text-3xl md:text-4xl font-black">
              ⭐ QUINA! ⭐
            </p>
            <p className="text-purple-600 text-base md:text-lg mt-2">5 acertos!</p>
          </div>
        )}
        {currentDraw.yourMatches === 6 && (
          <div className="bg-gradient-to-r from-green-200 via-yellow-200 to-green-200 p-6 md:p-10 rounded-2xl border-4 border-green-500 shadow-2xl animate-bounce">
            <p className="text-green-700 text-3xl md:text-5xl font-black">
              🏆 SENA! 🏆
            </p>
            <p className="text-green-600 text-xl md:text-2xl mt-2 font-bold">VOCÊ GANHOU!</p>
          </div>
        )}
      </div> */}
    </div>
  );
}
