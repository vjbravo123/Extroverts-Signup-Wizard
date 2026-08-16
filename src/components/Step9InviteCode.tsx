// src/components/Step9InviteCode.tsx
'use client';

import React from 'react';
import { Header } from './shared/Header';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupActions } from '@/store/slices/signupSlice';

export const Step9InviteCode: React.FC = () => {
  const dispatch = useAppDispatch();
  const inviteCode = useAppSelector((state) => state.signup.inviteCode);

  const handleSignUp = () => {
    dispatch(signupActions.setStep(10)); // Move to Step 10: Complete / Success
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSignUp();
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
          w-full h-full max-w-[430px]
          /* Mobile Spacing matching screenshot */
          px-7 pt-12 pb-14
          /* Desktop Card Frame */
          md:h-[844px] md:max-h-[92vh]
          md:rounded-[2.75rem] md:border md:border-white/10
          md:shadow-[0_0_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.1)]
          md:px-9 md:pt-12 md:pb-14
        "
      >
        {/* 1. Top Section: Header, Manifesto & Input */}
        <div className="w-full shrink-0">
          <Header showSubtitle={true} />

          {/* Party Manifesto List */}
          <div className="mt-10 sm:mt-12 space-y-1.5 text-[15px] sm:text-[16px] font-black uppercase tracking-tight leading-tight text-white">
            <p>
              KINDNESS = <span className="text-[#a855f7]">GOOD HAIR DAY</span>
            </p>
            <p>
              SIP IN? <span className="text-[#a855f7]">CHIP IN.</span>
            </p>
            <p>
              GHOSTING IS FOR <span className="text-[#a855f7]">HALLOWEEN.</span>
            </p>
            <p>
              OUTFITS LOUD, <span className="text-[#a855f7]">INTENTIONS CLEAR.</span>
            </p>
            <p>
              JOINING? FREE. HOSTING? <span className="text-[#a855f7]">ALSO FREE.</span>
            </p>
            <p>
              EARLLY IS <span className="text-[#a855f7]">ICONIC.</span>
            </p>
            <p>
              YES. <span className="text-[#a855f7]">SPELLING MISTAKE.</span>
            </p>
          </div>

          {/* Invite Code Input Field */}
          <div className="mt-7">
            <label className="block text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2.5">
              ENTER INVITE CODE (optional)
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => dispatch(signupActions.setInviteCode(e.target.value))}
              onKeyDown={handleKeyDown}
              placeholder=""
              className="
                w-full h-[52px] !bg-black text-white px-4 rounded-xl text-sm font-medium
                border border-zinc-800 focus:border-zinc-500 transition-all duration-200 outline-none
              "
            />
            <p className="text-[13px] text-zinc-500 mt-2.5 pl-0.5 font-normal">
              Enter invite code and get up to +30 HVTs!
            </p>
          </div>
        </div>

        {/* 2. Bottom Section: SIGN UP & BACK Buttons */}
        <div className="w-full shrink-0 flex flex-col space-y-3 pt-4">
          {/* SIGN UP Button */}
          <button
            onClick={handleSignUp}
            className="
              w-full h-[52px] bg-white text-black font-extrabold rounded-xl
              text-sm tracking-wider uppercase flex items-center justify-center
              hover:bg-zinc-100 active:scale-[0.985] transition-all cursor-pointer
            "
          >
            SIGN UP
          </button>

          {/* BACK Button */}
          <button
            onClick={() => dispatch(signupActions.setStep(8))}
            className="
              w-full h-[52px] bg-transparent text-white font-extrabold rounded-xl
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

export default Step9InviteCode;