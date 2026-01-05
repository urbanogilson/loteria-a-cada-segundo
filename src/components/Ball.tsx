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
    sm: 'w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm',
    md: 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-sm sm:text-base md:text-lg',
    lg: 'w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-sm sm:text-base md:text-lg lg:text-2xl'
  };

  const baseClasses = `
    rounded-full
    flex items-center justify-center
    font-bold
    transition-all duration-300
    shadow-lg
    ${sizeClasses[size]}
  `;

  const colorClasses = isMatched
    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white animate-pulse ring-2 ring-yellow-300'
    : 'bg-gradient-to-br from-green-500 to-emerald-700 text-white';

  return (
    <div className={`${baseClasses} ${colorClasses} ${className}`}>
      {number}
    </div>
  );
}
