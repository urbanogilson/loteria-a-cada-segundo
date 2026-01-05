/**
 * PlaySection Component
 * Main game interface - handles number selection and live draws
 */

import { useState, useEffect } from 'react';
import NumberSelector from './NumberSelector';
import DrawDisplay from './DrawDisplay';
import LastDrawDisplay from './LastDrawDisplay';
import Ball from './Ball';

export default function PlaySection() {
  const [userNumbers, setUserNumbers] = useState<number[] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [matchingNumbers, setMatchingNumbers] = useState<number[]>([]);

  useEffect(() => {
    // Load saved numbers from localStorage on mount
    try {
      const saved = localStorage.getItem('megasena_user_numbers');
      if (saved) {
        const numbers = JSON.parse(saved);
        setUserNumbers(numbers);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error loading saved numbers:', error);
    }
  }, []);

  // Listen for draw updates to highlight matching numbers
  useEffect(() => {
    if (!isPlaying || !userNumbers) return;

    const handleStorageChange = () => {
      // This will be triggered by the DrawDisplay component
      const currentMatches = localStorage.getItem('current_matches');
      if (currentMatches) {
        const matches = JSON.parse(currentMatches);
        setMatchingNumbers(matches);
        // Clear after animation
        setTimeout(() => setMatchingNumbers([]), 500);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('lottery-match', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('lottery-match', handleStorageChange as EventListener);
    };
  }, [isPlaying, userNumbers]);

  const handleNumbersSelected = (numbers: number[]) => {
    try {
      // Save to localStorage
      localStorage.setItem('megasena_user_numbers', JSON.stringify(numbers));

      // Update state
      setUserNumbers(numbers);
      setIsPlaying(true);

      // Scroll to top smoothly after a brief delay
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Erro ao iniciar o jogo. Tente novamente.');
    }
  };

  const handleReset = () => {
    try {
      localStorage.removeItem('megasena_user_numbers');
      setUserNumbers(null);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {!isPlaying ? (
        // Number Selection Screen with Last Draw Preview
        <>
          <LastDrawDisplay />
          <div className="bg-white p-4 md:p-8 rounded-2xl shadow-2xl">
            <NumberSelector
              onNumbersSelected={handleNumbersSelected}
              disabled={false}
            />
          </div>
        </>
      ) : (
        // Live Draw Screen
        <div className="space-y-6 md:space-y-8">


          {/* Live draws */}
          <DrawDisplay userNumbers={userNumbers!} />

                    {/* Current numbers being played */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 rounded-2xl shadow-xl border-2 border-green-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 text-center">
              Seus Números
            </h3>

            <div className="flex gap-1.5 sm:gap-2 md:gap-3 mb-4 justify-center items-center">
              {userNumbers!.map((num, index) => (
                <div
                  key={`${num}`}
                  className="flex-shrink-0"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Ball
                    number={num}
                    isMatched={matchingNumbers.includes(num)}
                    size="md"
                  />
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl text-sm md:text-base font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                ↻ Escolher Outros Números
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
