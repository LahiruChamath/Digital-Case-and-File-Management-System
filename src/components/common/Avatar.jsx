import React from 'react';

const colorMap = {
  A: 'bg-blue-500', B: 'bg-emerald-500', C: 'bg-violet-500',
  D: 'bg-amber-500', E: 'bg-rose-500', F: 'bg-cyan-500',
  G: 'bg-indigo-500', H: 'bg-pink-500', I: 'bg-teal-500',
  J: 'bg-blue-600', K: 'bg-green-500', L: 'bg-purple-500',
  M: 'bg-orange-500', N: 'bg-red-500', O: 'bg-sky-500',
  P: 'bg-lime-500', Q: 'bg-fuchsia-500', R: 'bg-emerald-400',
  S: 'bg-violet-400', T: 'bg-amber-400', U: 'bg-rose-400',
  V: 'bg-cyan-400', W: 'bg-indigo-400', X: 'bg-pink-400',
  Y: 'bg-teal-400', Z: 'bg-blue-700',
};

const Avatar = ({ initials, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const bgColor = colorMap[initials?.[0]?.toUpperCase()] || 'bg-gray-400';

  return (
    <div className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-bold tracking-wide shadow-sm`}>
      {initials}
    </div>
  );
};

export default Avatar;