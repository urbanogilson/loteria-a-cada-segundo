/**
 * LastDrawDisplay Component
 * Shows the most recent lottery draw (live preview)
 */

import { useState, useEffect } from 'react';
import Ball from './Ball';

interface DrawPreview {
  drawId: number;
  numbers: number[];
  timestamp: number;
}

export default function LastDrawDisplay() {
  const [lastDraw, setLastDraw] = useState<DrawPreview | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    // Connect to SSE without session (just to see draws)
    const connectToPreview = () => {
      // We'll use a special preview mode - just generate draws client-side for demo
      const generatePreviewDraw = () => {
        const numbers = new Set<number>();
        while (numbers.size < 6) {
          numbers.add(Math.floor(Math.random() * 60) + 1);
        }

        setLastDraw({
          drawId: Math.floor(Date.now() / 1000),
          numbers: Array.from(numbers).sort((a, b) => a - b),
          timestamp: Math.floor(Date.now() / 1000)
        });
        setIsLive(true);
      };

      // Generate initial draw
      generatePreviewDraw();

      // Update every second
      const interval = setInterval(generatePreviewDraw, 1000);

      return () => clearInterval(interval);
    };

    const cleanup = connectToPreview();

    return () => {
      if (cleanup) cleanup();
      if (eventSource) eventSource.close();
    };
  }, []);

  if (!lastDraw) {
    return (
      <div className="text-center py-8">
        <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-gray-600 text-sm">Aguardando sorteio...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 p-5 md:p-7 rounded-2xl shadow-xl border-2 border-green-300">
      <div className="flex items-center justify-center gap-2 mb-4 md:mb-5">
        <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse shadow-lg shadow-green-400' : 'bg-gray-400'}`}></div>
        <h3 className="text-base md:text-lg font-bold text-gray-800">
          Sorteio em Andamento
        </h3>
      </div>

      <div className="flex gap-2 md:gap-3 justify-center flex-wrap mb-4">
        {lastDraw.numbers.map(num => (
          <Ball key={num} number={num} size="md" />
        ))}
      </div>

      <p className="text-center text-xs md:text-sm text-gray-600 mb-3">
        {new Date(lastDraw.timestamp * 1000).toLocaleTimeString('pt-BR')}
      </p>

      <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-green-300">
        <p className="text-center text-sm md:text-base text-green-700 font-semibold">
          👇 Escolha seus números para jogar
        </p>
      </div>
    </div>
  );
}
