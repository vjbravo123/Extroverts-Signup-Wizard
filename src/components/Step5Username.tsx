// src/components/Step5Username.tsx
'use client';

import React, { useState } from 'react';
import { Header } from './shared/Header';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupActions } from '@/store/slices/signupSlice';
import { useToast } from './shared/ToastProvider';

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
// letters, numbers, dots, underscores — same character set as before
const USERNAME_CHARSET = /^[a-zA-Z0-9._]+$/;

export const Step5Username: React.FC = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.signup.username);
  const [error, setError] = useState('');
  const toast = useToast();

  const validate = (): string | null => {
    const cleaned = username.trim();

    if (!cleaned) {
      return 'Username is required.';
    }
    if (cleaned !== username) {
      return 'Username cannot start or end with a space.';
    }
    if (cleaned.length < USERNAME_MIN || cleaned.length > USERNAME_MAX) {
      return `Username must be ${USERNAME_MIN}-${USERNAME_MAX} characters long.`;
    }
    if (!USERNAME_CHARSET.test(cleaned)) {
      return 'Only letters, numbers, dots, and underscores are allowed.';
    }
    if (/^[._]|[._]$/.test(cleaned)) {
      return 'Username cannot start or end with a dot or underscore.';
    }
    if (/[._]{2,}/.test(cleaned)) {
      return 'Username cannot contain consecutive dots or underscores.';
    }
    if (/^\d+$/.test(cleaned)) {
      return 'Username cannot be numbers only.';
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
    dispatch(signupActions.setUsername(username.trim().toLowerCase()));
    dispatch(signupActions.setStep(6)); // Move to Step 6
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
              Create a username that fits your vibe!
            </h1>
          </div>

          {/* Username Input Field */}
          <div className="mt-6">
            <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2.5">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              maxLength={USERNAME_MAX}
              onChange={(e) => {
                dispatch(signupActions.setUsername(e.target.value));
                if (error) setError('');
              }}
              onBlur={() => {
                const validationError = validate();
                if (validationError) setError(validationError);
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              aria-invalid={!!error}
              aria-describedby={error ? 'username-error' : undefined}
              className={`
                w-full h-13 !bg-black text-white px-4 rounded-xl text-sm font-medium
                border transition-all duration-200 outline-none
                ${error ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-500'}
              `}
            />

            {/* Helper Text / Error State */}
            {error ? (
              <p id="username-error" className="text-xs text-red-400 mt-2.5 pl-0.5 font-medium">
                {error}
              </p>
            ) : (
              <p className="text-[13px] text-zinc-400 mt-3 leading-relaxed pl-0.5 font-normal">
                All your Superlatives and Invites will come your way with this name, so make it unforgettable!
              </p>
            )}
          </div>
        </div>

        {/* 2. Bottom Section: Stacked NEXT & BACK Buttons */}
        <div className="w-full shrink-0 flex flex-col space-y-3 pt-4">
          {/* NEXT Button */}
          <button
            onClick={handleNext}
            disabled={!username.trim()}
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
            onClick={() => dispatch(signupActions.setStep(4))}
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

export default Step5Username;