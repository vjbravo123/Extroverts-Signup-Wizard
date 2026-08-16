// src/components/Step2Location.tsx
'use client';

import React from 'react';
import { Header } from './shared/Header';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupActions } from '@/store/slices/signupSlice';
import { requestLocationThunk } from '@/store/slices/signupThunks';
import { Loader2 } from 'lucide-react';

export const Step2Location: React.FC = () => {
  const dispatch = useAppDispatch();
  const locationStatus = useAppSelector((state) => state.signup.locationStatus);
  const isLoading = locationStatus === 'loading';

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
          w-full h-full max-w-[430px]
          /* Mobile Spacing: Exact match to Step 1 & Screenshot */
          px-7 pt-12 pb-14
          /* Desktop Elevation */
          md:h-[844px] md:max-h-[92vh]
          md:rounded-[2.75rem] md:border md:border-white/10
          md:shadow-[0_0_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.1)]
          md:px-9 md:pt-12 md:pb-14
        "
      >
        {/* 1. Top Section: Header + Title */}
        <div className="w-full shrink-0">
          <Header showSubtitle={false} />

          <div className="mt-16 sm:mt-20">
            <h2 className="text-[17px] sm:text-[18px] font-black uppercase tracking-tight leading-[1.3] text-white">
              TRYING TO FETCH YOUR{' '}
              <span className="text-[#a855f7]">LOCATION...</span>
            </h2>
          </div>
        </div>

        {/* 2. Middle Section: Subtle Radar Glow while Fetching */}
        <div className="flex-1 flex items-center justify-center">
          {isLoading && (
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-purple-600/20 animate-ping absolute" />
              <div className="w-20 h-20 rounded-full bg-purple-600/30 animate-pulse border border-purple-500/30 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* 3. Bottom Actions: Elevated from the screen edge */}
        <div className="w-full shrink-0 flex flex-col space-y-3">
          <button
            onClick={() => dispatch(requestLocationThunk())}
            disabled={isLoading}
            className="
              w-full h-[52px] bg-white text-black font-extrabold rounded-xl
              text-sm tracking-wider uppercase flex items-center justify-center gap-2
              hover:bg-zinc-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]
              active:scale-[0.985] transition-all duration-150 cursor-pointer
              disabled:opacity-75 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>FETCHING LOCATION...</span>
              </>
            ) : (
              <span>ENABLE LOCATION</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2Location;