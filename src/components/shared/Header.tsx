// src/components/Header.tsx
import React from 'react';
import { Logo } from './Logo';

interface HeaderProps {
  showSubtitle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showSubtitle = true }) => {
  return (
    <header className="w-full shrink-0 flex items-center justify-between pt-1 pb-2">
      {/* Brand Logo */}
      <div className="flex items-center shrink-0">
        <Logo size={36} />
      </div>

      {showSubtitle && (
        <span className="text-xs tracking-wider text-zinc-400 font-bold uppercase select-none">
          GETTING READY
        </span>
      )}
    </header>
  );
};

export default Header;