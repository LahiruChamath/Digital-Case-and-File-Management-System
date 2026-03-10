import React from 'react';

const colorMap = {
  A: 'from-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]', 
  B: 'from-emerald-500 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]', 
  C: 'from-violet-600 to-purple-700 shadow-[0_0_15px_rgba(139,92,246,0.3)]',
  D: 'from-amber-500 to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.3)]', 
  E: 'from-rose-500 to-red-600 shadow-[0_0_15px_rgba(244,63,94,0.3)]', 
  F: 'from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
  G: 'from-indigo-500 to-violet-600 shadow-[0_0_15px_rgba(99,102,241,0.3)]', 
  H: 'from-pink-500 to-rose-600 shadow-[0_0_15px_rgba(236,72,153,0.3)]', 
  I: 'from-teal-500 to-emerald-600 shadow-[0_0_15px_rgba(20,184,166,0.3)]',
  J: 'from-blue-500 to-cyan-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]', 
  K: 'from-green-500 to-emerald-600 shadow-[0_0_15px_rgba(34,197,94,0.3)]', 
  L: 'from-purple-500 to-fuchsia-600 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
  M: 'from-orange-500 to-red-600 shadow-[0_0_15px_rgba(249,115,22,0.3)]', 
  N: 'from-red-500 to-rose-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]', 
  O: 'from-sky-500 to-blue-600 shadow-[0_0_15px_rgba(14,165,233,0.3)]',
  P: 'from-lime-500 to-green-600 shadow-[0_0_15px_rgba(132,204,22,0.3)]', 
  Q: 'from-fuchsia-500 to-pink-600 shadow-[0_0_15px_rgba(217,70,239,0.3)]', 
  R: 'from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(52,211,153,0.3)]',
  S: 'from-violet-500 to-indigo-600 shadow-[0_0_15px_rgba(139,92,246,0.3)]', 
  T: 'from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(251,191,36,0.3)]', 
  U: 'from-rose-400 to-red-500 shadow-[0_0_15px_rgba(251,113,133,0.3)]',
  V: 'from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]', 
  W: 'from-indigo-400 to-violet-500 shadow-[0_0_15px_rgba(129,140,248,0.3)]', 
  X: 'from-pink-400 to-rose-500 shadow-[0_0_15px_rgba(244,114,182,0.3)]',
  Y: 'from-teal-400 to-emerald-500 shadow-[0_0_15px_rgba(45,212,191,0.3)]', 
  Z: 'from-blue-700 to-indigo-800 shadow-[0_0_15px_rgba(29,78,216,0.3)]',
};

const Avatar = ({ initials, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const bgGradient = colorMap[initials?.[0]?.toUpperCase()] || 'from-slate-700 to-slate-600 shadow-[0_0_10px_rgba(0,0,0,0.5)]';

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-tr ${bgGradient} rounded-xl flex items-center justify-center text-white font-black tracking-wider border border-white/10`}>
      {initials}
    </div>
  );
};

export default Avatar;