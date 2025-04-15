
import React from 'react';

interface CircleProgressProps {
  progress: number;
}

export const CircleProgress = ({ progress }: CircleProgressProps) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative h-12 w-12 flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 50 50" className="rotate-[-90deg]">
        <circle
          className="stroke-edu-gray"
          strokeWidth="6"
          fill="transparent"
          r={radius}
          cx="25"
          cy="25"
        />
        <circle
          className="stroke-edu-purple transition-all duration-700 ease-in-out"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
          r={radius}
          cx="25"
          cy="25"
        />
      </svg>
      <span className="absolute text-sm font-medium">{progress}%</span>
    </div>
  );
};
