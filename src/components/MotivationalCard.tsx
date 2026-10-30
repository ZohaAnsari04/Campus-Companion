import React from 'react';

export const MotivationalCard: React.FC = () => {
  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-[#EDEBFF] via-[#EAF1FF] to-[#EDEBFF] border border-[#C7D7FE]/50 relative overflow-hidden shadow-xs">
      {/* Botanical Leaf SVG Illustration */}
      <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
        <svg
          width="70"
          height="80"
          viewBox="0 0 70 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M35 80V45M35 45C35 25 55 15 55 15C55 15 58 35 35 45ZM35 45C35 28 15 18 15 18C15 18 12 38 35 45Z"
            stroke="#5145E5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M35 30C35 15 45 5 45 5C45 5 48 18 35 30Z"
            fill="#4B55F5"
            fillOpacity="0.4"
          />
        </svg>
      </div>

      <div className="relative z-10 pr-3">
        <span className="inline-block text-[9px] font-bold text-[#5145E5] bg-white/70 px-2 py-0.5 rounded-md uppercase tracking-wider mb-2">
          Daily Inspiration
        </span>
        <blockquote className="text-xs font-bold text-[#142B61] leading-snug">
          "Discipline today creates opportunities tomorrow."
        </blockquote>
        <p className="text-[10px] text-slate-500 mt-1.5 font-medium leading-relaxed">
          Stay focused on your daily goals — progress compounds over time.
        </p>
      </div>
    </div>
  );
};

