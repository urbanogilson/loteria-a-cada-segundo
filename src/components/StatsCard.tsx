/**
 * StatsCard Component
 * Displays personal lottery statistics and probabilities
 */

import { useState, useEffect } from 'react';
import { getStats, type PersonalStats } from '../lib/localStorage';

export default function StatsCard() {
  const [stats, setStats] = useState<PersonalStats | null>(null);

  useEffect(() => {
    // Load stats from localStorage
    const personalStats = getStats();
    setStats(personalStats);

    // Update stats every second while user is playing
    const interval = setInterval(() => {
      const updatedStats = getStats();
      setStats(updatedStats);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-gray-600 text-sm md:text-base">Carregando estatísticas...</p>
      </div>
    );
  }

  const getWinLabel = (matches: number) => {
    switch (matches) {
      case 4: return 'Quadra';
      case 5: return 'Quina';
      case 6: return 'Sena';
      default: return 'Nenhum';
    }
  };

  // Static odds (from megasena.ts)
  const odds = {
    3: '1 em 60',
    4: '1 em 2.332',
    5: '1 em 154.518',
    6: '1 em 50.063.860'
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Personal Statistics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl text-white">
          <h3 className="text-sm md:text-base font-semibold mb-1 md:mb-2">Sorteios Jogados</h3>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold">{stats.totalDraws.toLocaleString('pt-BR')}</p>
          <p className="text-xs md:text-sm mt-1 md:mt-2 opacity-90">Desde que você começou</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl text-white">
          <h3 className="text-sm md:text-base font-semibold mb-1 md:mb-2">Total de Vitórias</h3>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold">{stats.totalWins.toLocaleString('pt-BR')}</p>
          <p className="text-xs md:text-sm mt-1 md:mt-2 opacity-90">4+ acertos</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl text-white">
          <h3 className="text-sm md:text-base font-semibold mb-1 md:mb-2">Maior Prêmio</h3>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold">{getWinLabel(stats.biggestWin)}</p>
          <p className="text-xs md:text-sm mt-1 md:mt-2 opacity-90">
            {stats.biggestWin === 6 ? '🏆 SENA!' : stats.biggestWin === 0 ? 'Nenhum ainda' : `${stats.biggestWin} acertos`}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl text-white">
          <h3 className="text-sm md:text-base font-semibold mb-1 md:mb-2">Taxa de Vitória</h3>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {stats.totalDraws > 0 ? ((stats.totalWins / stats.totalDraws) * 100).toFixed(2) : '0'}%
          </p>
          <p className="text-xs md:text-sm mt-1 md:mt-2 opacity-90">4+ acertos</p>
        </div>
      </div>

      {/* Win Breakdown */}
      {stats.totalWins > 0 && (
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-xl">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Suas Vitórias</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
              <p className="text-orange-600 font-semibold text-sm md:text-base">Quadras</p>
              <p className="text-2xl md:text-3xl font-bold text-orange-700">{stats.wins4}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
              <p className="text-purple-600 font-semibold text-sm md:text-base">Quinas</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-700">{stats.wins5}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <p className="text-green-600 font-semibold text-sm md:text-base">Senas</p>
              <p className="text-2xl md:text-3xl font-bold text-green-700">{stats.wins6}</p>
            </div>
          </div>
        </div>
      )}

      {/* Probability Explanation */}
      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-xl">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Entenda as Probabilidades</h2>

        <div className="space-y-4 md:space-y-6">
          <div className="prose max-w-none">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              A Mega-Sena exige que você selecione 6 números de 1 a 60. Com este simulador,
              você pode ver em tempo real como é difícil ganhar! Um novo sorteio acontece
              a cada segundo.
            </p>
          </div>

          {/* Odds Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-gray-700 text-sm md:text-base">Acertos</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 font-semibold text-gray-700 text-sm md:text-base">Nome</th>
                  <th className="text-right py-2 md:py-3 px-2 md:px-4 font-semibold text-gray-700 text-sm md:text-base">Probabilidade</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-yellow-50">
                  <td className="py-3 md:py-4 px-2 md:px-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-sm md:text-base">3</div>
                  </td>
                  <td className="py-3 md:py-4 px-2 md:px-4 font-semibold text-gray-700 text-sm md:text-base">Terno</td>
                  <td className="py-3 md:py-4 px-2 md:px-4 text-right text-gray-600 text-sm md:text-base">{odds[3]}</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-orange-50">
                  <td className="py-3 md:py-4 px-2 md:px-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm md:text-base">4</div>
                  </td>
                  <td className="py-3 md:py-4 px-2 md:px-4 font-semibold text-gray-700 text-sm md:text-base">Quadra</td>
                  <td className="py-3 md:py-4 px-2 md:px-4 text-right text-gray-600 text-sm md:text-base">{odds[4]}</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-purple-50">
                  <td className="py-3 md:py-4 px-2 md:px-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm md:text-base">5</div>
                  </td>
                  <td className="py-3 md:py-4 px-2 md:px-4 font-semibold text-gray-700 text-sm md:text-base">Quina</td>
                  <td className="py-3 md:py-4 px-2 md:px-4 text-right text-gray-600 text-sm md:text-base">{odds[5]}</td>
                </tr>
                <tr className="hover:bg-green-50">
                  <td className="py-3 md:py-4 px-2 md:px-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm md:text-base">6</div>
                  </td>
                  <td className="py-3 md:py-4 px-2 md:px-4 font-semibold text-gray-700 text-sm md:text-base">Sena</td>
                  <td className="py-3 md:py-4 px-2 md:px-4 text-right font-bold text-green-600 text-sm md:text-base">{odds[6]}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Fun Facts */}
          <div className="bg-blue-50 p-4 md:p-6 rounded-lg md:rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">💡 Curiosidades</h3>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-700">
              <li>• Para ganhar a Sena, você tem 1 chance em 50.063.860</li>
              <li>• Isso é aproximadamente a mesma probabilidade de jogar uma moeda 25 vezes e dar cara todas as vezes!</li>
              <li>• Mesmo com um sorteio por segundo, seria necessário quase 2 anos contínuos para ver todas as combinações possíveis</li>
              <li>• Este simulador demonstra visualmente porque a loteria é mais diversão do que investimento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
