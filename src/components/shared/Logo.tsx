// src/components/Logo.tsx
import React from 'react';

export const Logo: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: '100%' }}
      >
        {/* Exact Serif 'E' */}
        <path
          d="M 18 16 
             L 74 16 
             L 74 34 
             L 62.5 34 
             C 61.5 26.5 58 24.5 48 24.5 
             L 41 24.5 
             L 41 46.5 
             L 51 46.5 
             C 57.5 46.5 59 44.5 59.5 39 
             L 65 39 
             L 65 59 
             L 59.5 59 
             C 59 53.5 57.5 51.5 51 51.5 
             L 41 51.5 
             L 41 75.5 
             L 49 75.5 
             C 59.5 75.5 63.5 73 66.5 64 
             L 72.5 64 
             L 70 84 
             L 18 84 
             L 18 75.5 
             C 24.5 75.5 26.5 74.5 26.5 67 
             L 26.5 33 
             C 26.5 25.5 24.5 24.5 18 24.5 
             Z"
          fill="#FFFFFF"
        />
        {/* Upper-Right Dot */}
        <circle cx="86" cy="24" r="9.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

export default Logo;