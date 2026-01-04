/**
 * NumberSelector Component
 * Allows users to select 6 numbers from 1-60
 */

import { useState } from 'react';

interface NumberSelectorProps {
  onNumbersSelected: (numbers: number[]) => void;
  disabled?: boolean;
}

export default function NumberSelector({ onNumbersSelected, disabled = false }: NumberSelectorProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const toggleNumber = (num: number) => {
    if (disabled) return;

    let newSelection: number[];
    if (selectedNumbers.includes(num)) {
      // Deselect
      newSelection = selectedNumbers.filter(n => n !== num);
    } else {
      // Select if less than 6
      if (selectedNumbers.length < 6) {
        newSelection = [...selectedNumbers, num].sort((a, b) => a - b);
      } else {
        return; // Already have 6 numbers
      }
    }

    setSelectedNumbers(newSelection);

    // Call callback if we have 6 numbers
    if (newSelection.length === 6) {
      onNumbersSelected(newSelection);
    }
  };

  const randomSelection = () => {
    if (disabled) return;

    const numbers = new Set<number>();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 60) + 1);
    }

    const randomNumbers = Array.from(numbers).sort((a, b) => a - b);
    setSelectedNumbers(randomNumbers);
    onNumbersSelected(randomNumbers);
  };

  const clearSelection = () => {
    if (disabled) return;
    setSelectedNumbers([]);
  };

  // Generate array of numbers 1-60
  const allNumbers = Array.from({ length: 60 }, (_, i) => i + 1);

  return (
    <div className="w-full">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Escolha seus 6 números
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          {selectedNumbers.length === 0 && 'Selecione 6 números de 1 a 60'}
          {selectedNumbers.length > 0 && selectedNumbers.length < 6 && `Faltam ${6 - selectedNumbers.length} número${6 - selectedNumbers.length !== 1 ? 's' : ''}`}
          {selectedNumbers.length === 6 && '✓ Pronto para jogar!'}
        </p>
      </div>

      {/* Selected numbers display - Fixed width for mobile */}
      <div className="mb-4 md:mb-6 p-4 md:p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300">
        <div className="flex gap-1.5 sm:gap-2 justify-center items-center min-h-[3rem] md:min-h-[3.5rem]">
          {selectedNumbers.length === 0 ? (
            <p className="text-gray-500 text-xs md:text-sm">Nenhum número selecionado</p>
          ) : (
            selectedNumbers.map(num => (
              <div
                key={num}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 text-white flex items-center justify-center font-bold text-sm sm:text-base md:text-lg shadow-lg animate-[slideIn_0.2s_ease-out] flex-shrink-0"
              >
                {num}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 md:gap-3 mb-4 md:mb-6">
        <button
          onClick={randomSelection}
          disabled={disabled}
          className="flex-1 px-4 md:px-5 py-3 md:py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl text-sm md:text-base font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:cursor-not-allowed"
        >
          🎲 Surpresinha
        </button>
        <button
          onClick={clearSelection}
          disabled={disabled || selectedNumbers.length === 0}
          className="px-4 md:px-5 py-3 md:py-3.5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl text-sm md:text-base font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:cursor-not-allowed"
        >
          ↻ Limpar
        </button>
      </div>

      {/* Number grid - Mobile optimized with better touch targets */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 md:gap-2.5">
        {allNumbers.map(num => {
          const isSelected = selectedNumbers.includes(num);
          return (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              disabled={disabled}
              aria-label={`Número ${num}`}
              aria-pressed={isSelected}
              className={`
                aspect-square rounded-lg font-bold text-xs sm:text-sm md:text-base transition-all
                min-h-[40px] sm:min-h-[44px]
                ${isSelected
                  ? 'bg-gradient-to-br from-green-500 to-green-700 text-white scale-105 shadow-lg ring-2 ring-green-400 ring-offset-2'
                  : 'bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 text-gray-800 border-2 border-gray-300 hover:border-green-400 shadow-md hover:shadow-lg'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95 hover:scale-105'}
                touch-manipulation select-none
              `}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
