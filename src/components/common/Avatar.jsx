import React from 'react';

const colorMap = {
  A: 'bg-blue-600', B: 'bg-emerald-600', C: 'bg-violet-600',
  D: 'bg-amber-600', E: 'bg-rose-600', F: 'bg-cyan-600',
  G: 'bg-indigo-600', H: 'bg-pink-600', I: 'bg-teal-600',
  J: 'bg-blue-500', K: 'bg-green-600', L: 'bg-purple-600',
  M: 'bg-orange-600', N: 'bg-red-500', O: 'bg-sky-600',
  P: 'bg-lime-600', Q: 'bg-fuchsia-600', R: 'bg-emerald-500',
  S: 'bg-violet-500', T: 'bg-amber-500', U: 'bg-rose-500',
  V: 'bg-cyan-500', W: 'bg-indigo-500', X: 'bg-pink-500',
  Y: 'bg-teal-500', Z: 'bg-blue-700',
};

const Avatar = ({ initials, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const bgColor = colorMap[initials?.[0]?.toUpperCase()] || 'bg-slate-600';

  return (
    <div className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold`}>
      {initials}
    </div>
  );
};

export default Avatar;