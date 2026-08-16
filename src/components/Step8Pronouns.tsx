// src/components/Step8Pronouns.tsx
'use client';

import React, { useState } from 'react';
import { Header } from './shared/Header';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupActions } from '@/store/slices/signupSlice';
import { Check, X } from 'lucide-react';

const PRONOUNS_LIST = [
  'he', 'him', 'his',
  'she', 'her', 'hers',
  'they', 'them', 'theirs',
  'ze', 'zir', 'zirs',
  've', 'ver', 'vis',
];

export const Step8Pronouns: React.FC = () => {
  const dispatch = useAppDispatch();
  const pronouns = useAppSelector((state) => state.signup.pronouns) || [];
  // Starts closed as requested
  const [showModal, setShowModal] = useState(false);

  const handleToggle = (item: string) => {
    if (pronouns.includes(item)) {
      dispatch(signupActions.togglePronoun(item));
    } else {
      if (pronouns.length < 3) {
        dispatch(signupActions.togglePronoun(item));
      }
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
        {/* 1. Top Section: Header & Form Content */}
        <div className="w-full shrink-0">
          <Header showSubtitle={true} />

          {/* Title */}
          <div className="mt-12 sm:mt-14">
            <h1 className="text-[22px] sm:text-2xl font-black tracking-tight leading-tight text-white">
              Which pronouns feel right for you?
            </h1>
          </div>

          {/* Pronouns Selector Box */}
          <div className="mt-6">
            <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2.5">
              PRONOUNS
            </label>

            <div
              onClick={() => setShowModal(true)}
              className="
                w-full h-[52px] !bg-black text-white px-4 rounded-xl text-sm font-medium
                border border-zinc-800 hover:border-zinc-500 transition-all duration-200
                flex items-center justify-between cursor-pointer
              "
            >
              <span className={pronouns.length > 0 ? 'text-white font-medium' : 'text-zinc-500'}>
                {pronouns.length > 0 ? pronouns.join(' / ') : ''}
              </span>
            </div>

            {/* Helper Text */}
            <p className="text-[13px] text-zinc-400 mt-3 leading-relaxed pl-0.5 font-normal">
              Select up to 3 pronouns that you identify with.
            </p>
          </div>
        </div>

        {/* 2. Bottom Section: Stacked NEXT & BACK Buttons */}
        <div className="w-full shrink-0 flex flex-col space-y-3 pt-4">
          <button
            onClick={() => {
              if (pronouns.length === 0) {
                setShowModal(true);
              } else {
                dispatch(signupActions.setStep(9)); // Move to Step 9
              }
            }}
            disabled={pronouns.length === 0}
            className="
              w-full h-[52px] bg-white text-black font-extrabold rounded-xl
              text-sm tracking-wider uppercase flex items-center justify-center
              hover:bg-zinc-100 active:scale-[0.985] transition-all cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            NEXT
          </button>

          <button
            onClick={() => dispatch(signupActions.setStep(7))}
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

      {/* 3. Bottom Sheet Modal (Opens ONLY on tap) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0 md:p-4">
          <div
            className="
              w-full max-w-[430px] bg-[#121214] border-t md:border border-white/10
              rounded-t-[2rem] md:rounded-[2rem] px-6 pt-4 pb-8 shadow-2xl
              flex flex-col max-h-[80vh] animate-in slide-in-from-bottom duration-200
            "
          >
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto mb-4" />

            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-white">
                  SELECT PRONOUNS
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 font-normal">
                  Select upto 3
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-white p-1 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Pronouns List */}
            <div className="overflow-y-auto no-scrollbar space-y-1.5 flex-1 pr-1">
              {PRONOUNS_LIST.map((item) => {
                const isSelected = pronouns.includes(item);
                return (
                  <div
                    key={item}
                    onClick={() => handleToggle(item)}
                    className="
                      flex items-center gap-3.5 py-2.5 px-1 rounded-xl
                      hover:bg-white/[0.04] cursor-pointer transition select-none
                    "
                  >
                    {/* Rounded Selection Circle */}
                    <div
                      className={`
                        w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-150 shrink-0
                        ${
                          isSelected
                            ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                            : 'border-zinc-700 bg-transparent'
                        }
                      `}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    {/* Pronoun Text */}
                    <span className="text-sm font-medium lowercase text-zinc-200">
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Done Action */}
            <div className="pt-4 mt-2">
              <button
                onClick={() => setShowModal(false)}
                className="
                  w-full h-[48px] bg-white text-black font-extrabold rounded-xl
                  text-sm tracking-wider uppercase flex items-center justify-center
                  hover:bg-zinc-100 active:scale-[0.985] transition-all cursor-pointer
                "
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step8Pronouns;