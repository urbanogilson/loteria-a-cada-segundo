/**
 * Ball Component
 * Displays a single lottery ball with a number
 */

interface BallProps {
  number: number;
  isMatched?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Ball({ number, isMatched = false, size = 'md', className = '' }: BallProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 min-w-[2rem] min-h-[2rem] md:w-10 md:h-10 md:min-w-[2.5rem] md:min-h-[2.5rem] text-xs md:text-sm',
    md: 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] sm:w-12 sm:h-12 sm:min-w-[3rem] sm:min-h-[3rem] md:w-14 md:h-14 md:min-w-[3.5rem] md:min-h-[3.5rem] text-sm sm:text-base md:text-lg',
    lg: 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] sm:w-12 sm:h-12 sm:min-w-[3rem] sm:min-h-[3rem] md:w-16 md:h-16 md:min-w-[4rem] md:min-h-[4rem] lg:w-20 lg:h-20 lg:min-w-[5rem] lg:min-h-[5rem] text-sm sm:text-base md:text-lg lg:text-2xl'
  };

  const baseClasses = `
    rounded-full
    flex items-center justify-center
    flex-shrink-0
    aspect-square
    font-bold
    transition-all duration-300
    shadow-lg
    ${sizeClasses[size]}
  `;

  const colorClasses = isMatched
    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white animate-pulse ring-2 ring-inset ring-yellow-300'
    : 'bg-gradient-to-br from-green-500 to-emerald-700 text-white';

  return (
    <div className={`${baseClasses} ${colorClasses} ${className}`}>
      {number}
    </div>
  );
}
