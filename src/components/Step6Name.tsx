// src/components/Step6Name.tsx
'use client';

import React, { useState } from 'react';
import { Header } from './shared/Header';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupActions } from '@/store/slices/signupSlice';
import { useToast } from './shared/ToastProvider';

const NAME_MIN = 2;
const NAME_MAX = 40;
// Letters (incl. accented), spaces, hyphens, and apostrophes — covers most real names
const NAME_CHARSET = /^[\p{L}][\p{L}'\- ]*$/u;

export const Step6Name: React.FC = () => {
  const dispatch = useAppDispatch();
  const name = useAppSelector((state) => state.signup.name);
  const [error, setError] = useState('');
  const toast = useToast();

  const validate = (): string | null => {
    const cleaned = name.trim();

    if (!cleaned) {
      return 'Name is required.';
    }
    if (cleaned !== name) {
      return 'Name cannot start or end with a space.';
    }
    if (cleaned.length < NAME_MIN) {
      return `Name must be at least ${NAME_MIN} characters long.`;
    }
    if (cleaned.length > NAME_MAX) {
      return `Name cannot exceed ${NAME_MAX} characters.`;
    }
    if (/\s{2,}/.test(cleaned)) {
      return 'Name cannot contain multiple consecutive spaces.';
    }
    if (!NAME_CHARSET.test(cleaned)) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }
    setError('');
    dispatch(signupActions.setName(name.trim()));
    dispatch(signupActions.setStep(7)); // Move to Step 7
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-black md:bg-[#08080a] flex items-center justify-center select-none overflow-hidden">
      {/* Desktop Background Ambient Glows */}
      <div className="hidden md:block absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container Card */}
      <div
        className="
          relative z-10 bg-black text-white
          flex flex-col justify-between
          w-full h-full max-w-107.5
          /* Mobile Spacing matching screenshot */
          px-7 pt-12 pb-14
          /* Desktop Card Frame */
          md:h-211 md:max-h-[92vh]
          md:rounded-[2.75rem] md:border md:border-white/10
          md:shadow-[0_0_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.1)]
          md:px-9 md:pt-12 md:pb-14
        "
      >
        {/* 1. Top Section: Header & Form Content */}
        <div className="w-full shrink-0">
          <Header showSubtitle={true} />

          {/* Title */}
          <div className="mt-12 sm:mt-14">
            <h1 className="text-[22px] sm:text-2xl font-black tracking-tight leading-tight text-white">
              &ldquo;Name, please, for the party check!&rdquo;
            </h1>
          </div>

          {/* Name Input Field */}
          <div className="mt-6">
            <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2.5">
              NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                dispatch(signupActions.setName(e.target.value));
                if (error) setError('');
              }}
              onBlur={() => {
                const validationError = validate();
                if (validationError) setError(validationError);
              }}
              onKeyDown={handleKeyDown}
              maxLength={NAME_MAX}
              autoFocus
              aria-invalid={!!error}
              aria-describedby={error ? 'name-error' : undefined}
              className={`
                w-full h-13 !bg-black text-white px-4 rounded-xl text-sm font-medium
                border transition-all duration-200 outline-none
                ${error ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-500'}
              `}
            />

            {/* Helper Text / Error State */}
            {error ? (
              <p id="name-error" className="text-xs text-red-400 mt-2.5 pl-0.5 font-medium">
                {error}
              </p>
            ) : (
              <p className="text-[13px] text-zinc-400 mt-3 leading-relaxed pl-0.5 font-normal">
                This is the name shown as on members and requests. Cannot be changed later.
              </p>
            )}
          </div>
        </div>

        {/* 2. Bottom Section: Stacked NEXT & BACK Buttons */}
        <div className="w-full shrink-0 flex flex-col space-y-3 pt-4">
          {/* NEXT Button */}
          <button
            onClick={handleNext}
            disabled={!name.trim()}
            className="
              w-full h-13 bg-white text-black font-extrabold rounded-xl
              text-sm tracking-wider uppercase flex items-center justify-center
              hover:bg-zinc-100 active:scale-[0.985] transition-all cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            NEXT
          </button>

          {/* BACK Button */}
          <button
            onClick={() => dispatch(signupActions.setStep(5))}
            className="
              w-full h-13 bg-transparent text-white font-extrabold rounded-xl
              border border-white text-sm tracking-wider uppercase
              flex items-center justify-center hover:bg-white/10 active:scale-[0.985]
              transition-all cursor-pointer
            "
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step6Name;