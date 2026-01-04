/**
 * HistoryTable Component
 * Displays user's win history (4+ matches) from localStorage
 */

import { useState, useEffect } from 'react';
import Ball from './Ball';
import { getWinHistory, type WinRecord } from '../lib/localStorage';

export default function HistoryTable() {
  const [wins, setWins] = useState<WinRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const winsPerPage = 10;

  useEffect(() => {
    // Load initial history
    const winHistory = getWinHistory();
    setWins(winHistory);

    // Listen for new wins
    const handleNewWin = () => {
      const updatedHistory = getWinHistory();
      setWins(updatedHistory);
    };

    window.addEventListener('lottery-win', handleNewWin);

    // Also poll for updates every 2 seconds as fallback
    const pollInterval = setInterval(() => {
      const updatedHistory = getWinHistory();
      setWins(updatedHistory);
    }, 2000);

    return () => {
      window.removeEventListener('lottery-win', handleNewWin);
      clearInterval(pollInterval);
    };
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR');
  };

  const getMatchLabel = (matches: number) => {
    switch (matches) {
      case 4:
        return { label: 'Quadra', color: 'text-orange-600' };
      case 5:
        return { label: 'Quina', color: 'text-purple-600' };
      case 6:
        return { label: 'SENA!', color: 'text-green-600' };
      default:
        return { label: `${matches} acertos`, color: 'text-gray-600' };
    }
  };

  if (wins.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-base md:text-lg text-gray-600">Você ainda não teve vitórias com 4+ acertos.</p>
        <p className="text-sm md:text-base text-gray-500 mt-2">Continue jogando para aparecer no histórico!</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(wins.length / winsPerPage);
  const startIndex = (currentPage - 1) * winsPerPage;
  const endIndex = startIndex + winsPerPage;
  const currentWins = wins.slice(startIndex, endIndex);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Wins list */}
      <div className="space-y-3 md:space-y-4">
        {currentWins.map((win) => {
          const matchInfo = getMatchLabel(win.matches);

          return (
            <div
              key={win.id}
              className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="space-y-3 md:space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-lg md:text-xl font-bold ${matchInfo.color}`}>
                      {matchInfo.label}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">{formatDate(win.timestamp)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${matchInfo.color} bg-opacity-10`}>
                    <p className={`text-sm md:text-base font-bold ${matchInfo.color}`}>
                      {win.matches} acertos
                    </p>
                  </div>
                </div>

                {/* Numbers */}
                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                  {/* User's numbers */}
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-2 font-semibold">Seus Números</p>
                    <div className="flex gap-1.5 md:gap-2 flex-wrap">
                      {win.userNumbers.map((num) => (
                        <Ball
                          key={num}
                          number={num}
                          size="sm"
                          isMatched={win.numbers.includes(num)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Drawn numbers */}
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-2 font-semibold">Números Sorteados</p>
                    <div className="flex gap-1.5 md:gap-2 flex-wrap">
                      {win.numbers.map((num) => (
                        <Ball
                          key={num}
                          number={num}
                          size="sm"
                          isMatched={win.userNumbers.includes(num)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 md:px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg text-sm md:text-base font-semibold transition-colors"
          >
            Anterior
          </button>

          <span className="px-3 md:px-4 py-2 text-gray-700 text-sm md:text-base">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 md:px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg text-sm md:text-base font-semibold transition-colors"
          >
            Próxima
          </button>
        </div>
      )}

      {/* Total count */}
      <div className="text-center text-xs md:text-sm text-gray-600">
        Total de {wins.length} vitória{wins.length !== 1 ? 's' : ''} com 4+ acertos
      </div>
    </div>
  );
}
