'use client';

import React from 'react';
import { Header } from './shared/Header';
import { useAppDispatch } from '@/store/hooks';
import { signupActions } from '@/store/slices/signupSlice';

export const Step1Terms: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleAccept = () => {
    dispatch(signupActions.setTermsAccepted(true));
    dispatch(signupActions.setStep(2));
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
          w-full h-full max-w-[430px]
          /* Mobile Spacing: Generous horizontal and vertical gutters */
          px-7 pt-12 pb-14
          /* Desktop Elevation */
          md:h-[844px] md:max-h-[92vh]
          md:rounded-[2.75rem] md:border md:border-white/10
          md:shadow-[0_0_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.1)]
          md:px-9 md:pt-12 md:pb-14
        "
      >
        {/* 1. Top Section: Logo / Header */}
        <div className="w-full shrink-0">
          <Header showSubtitle={false} />
        </div>

        {/* 2. Middle Section: Vertically & Horizontally Balanced Text */}
        <div className="w-full my-auto py-8">
          <p className="text-[17px] sm:text-[18px] md:text-[18.5px] leading-[1.32] font-black uppercase tracking-tight text-white break-words">
            BY USING THIS APP, YOU’RE AGREEING TO KEEP THINGS FUN, SAFE, AND
            RESPECTFUL… AND ALSO AGREEING TO OUR TERMS AND CONDITIONS. POLITENESS
            IS A MUST— TREAT OTHERS HOW YOU’D WANT TO BE TREATED. EVERYONE HERE
            IS LOOKING FOR REASONS TO{' '}
            <span className="text-[#a855f7]">PARTY</span>, SO BRING YOUR BEST
            VIBE AND EXPECT THE SAME FROM OTHERS. LET&apos;S PARTY RESPONSIBLY
            AND MAKE EVERY EXPERIENCE A GREAT ONE!
          </p>
        </div>

        {/* 3. Bottom Section: Elevated above screen edge */}
        <div className="w-full shrink-0 flex flex-col space-y-3.5 pt-2">
          <p className="text-[13px] text-zinc-400 font-normal tracking-tight pl-0.5">
            To proceed, accept Terms and Conditions
          </p>

          <button
            onClick={handleAccept}
            className="
              w-full h-[52px] bg-white text-black font-extrabold rounded-xl
              text-sm tracking-wider uppercase flex items-center justify-center
              hover:bg-zinc-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]
              active:scale-[0.985] transition-all duration-150 cursor-pointer
            "
          >
            ACCEPT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1Terms;