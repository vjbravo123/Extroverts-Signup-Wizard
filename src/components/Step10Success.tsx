// src/components/Step10Success.tsx
'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './shared/Header';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupActions } from '@/store/slices/signupSlice';

export const Step10Success: React.FC = () => {
  const dispatch = useAppDispatch();
  const { name, username, email, pronouns } = useAppSelector((state) => state.signup);

  useEffect(() => {
    // Subtle, high-contrast confetti burst matching brand palette only
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#ffffff', '#a855f7', '#27272a'],
      ticks: 200,
      gravity: 1.2,
      scalar: 0.9,
    });
  }, []);

  const formattedPronouns =
    pronouns && pronouns.length > 0 ? pronouns.join(' / ') : '—';

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-black md:bg-[#050507] flex items-center justify-center select-none overflow-hidden">
      {/* Desktop Subtle Radial Shade (Strictly monochrome + deep purple tint) */}
      <div className="hidden md:block absolute w-[600px] h-[600px] bg-purple-950/20 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Container Card */}
      <div
        className="
          relative z-10 bg-black text-white
          flex flex-col justify-between
          w-full h-full max-w-[430px]
          px-7 pt-12 pb-14
          md:h-[844px] md:max-h-[92vh]
          md:rounded-[2.75rem] md:border md:border-zinc-800/80
          md:shadow-[0_20px_70px_rgba(0,0,0,0.8)]
          md:px-9 md:pt-12 md:pb-14
        "
      >
        {/* 1. Header & Hero Typography */}
        <div className="w-full shrink-0">
          <Header showSubtitle={true} />

          <div className="mt-10 sm:mt-12">
            <h1 className="text-[26px] sm:text-[28px] font-black uppercase tracking-tight leading-none text-white">
              YOU’RE ON THE <br />
              <span className="text-[#a855f7]">GUEST LIST.</span>
            </h1>
            <p className="text-[13px] text-zinc-400 mt-2 font-normal leading-relaxed">
              Your profile is verified and active. Welcome to Earley.
            </p>
          </div>
        </div>

        {/* 2. Editorial Admission Pass */}
        <div className="w-full my-auto py-4">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
            {/* Minimalist Pass Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-300">
                  EARLLY ADMISSION
                </span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500 tracking-wider">
                CONFIRMED
              </span>
            </div>

            {/* Identity Rows */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                  NAME
                </span>
                <span className="text-sm font-bold text-white tracking-tight text-right truncate max-w-[200px]">
                  {name || 'Guest'}
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                  HANDLE
                </span>
                <span className="text-sm font-bold text-[#a855f7] tracking-tight text-right truncate max-w-[200px]">
                  @{username || 'member'}
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                  EMAIL
                </span>
                <span className="text-xs font-medium text-zinc-300 tracking-tight text-right truncate max-w-[220px]">
                  {email || '—'}
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                  PRONOUNS
                </span>
                <span className="text-xs font-medium text-zinc-300 tracking-tight text-right">
                  {formattedPronouns}
                </span>
              </div>
            </div>

            {/* Subtle Divider Notches & Monospaced Stub Footer */}
            <div className="border-t border-dashed border-zinc-800/90 pt-3.5 mt-4 flex items-center justify-between font-mono text-[10px] text-zinc-600 tracking-widest">
              <span>ENTRY REF &bull; 001</span>
              <span>EARLLY &bull; NYC</span>
            </div>
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="w-full shrink-0 flex flex-col space-y-3 pt-4">
          <button
            onClick={() => {
              // Action to enter main feed/app
              console.log('User joined Earley');
            }}
            className="
              w-full h-[52px] bg-white text-black font-extrabold rounded-xl
              text-sm tracking-wider uppercase flex items-center justify-center
              hover:bg-zinc-100 active:scale-[0.985] transition-all cursor-pointer
            "
          >
            ENTER THE APP
          </button>

          <button
            onClick={() => dispatch(signupActions.resetWizard())}
            className="
              w-full h-[52px] bg-transparent text-white font-extrabold rounded-xl
              border border-white text-sm tracking-wider uppercase
              flex items-center justify-center hover:bg-white/10 active:scale-[0.985]
              transition-all cursor-pointer
            "
          >
            START OVER
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step10Success;