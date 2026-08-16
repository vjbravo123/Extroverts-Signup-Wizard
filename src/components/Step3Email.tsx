// src/components/Step3Email.tsx
'use client';

import React, { useState } from 'react';
import { Header } from './shared/Header';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupActions } from '@/store/slices/signupSlice';
import { sendOtpThunk } from '@/store/slices/signupThunks';
import { Loader2, Check } from 'lucide-react';
import { useToast } from './shared/ToastProvider';

export const Step3Email: React.FC = () => {
  const dispatch = useAppDispatch();
  const { email, newsletter, otpStatus } = useAppSelector((state) => state.signup);
  const [localError, setLocalError] = useState('');
  const isSending = otpStatus === 'sending';
  const toast = useToast();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = (): string | null => {
    const trimmed = email.trim();

    if (!trimmed) {
      return 'Email is required.';
    }
    if (trimmed !== email) {
      // Catches whitespace-only or padded input the user may not notice
      return 'Email cannot start or end with a space.';
    }
    if (trimmed.length > 254) {
      return 'That email address is too long.';
    }
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address.';
    }
    return null;
  };

  const handleProceed = async () => {
    setLocalError('');

    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      // .unwrap() rejects if the thunk was dispatched with a rejected action,
      // so real API/network failures land in the catch block below.
      await dispatch(sendOtpThunk()).unwrap();
      toast.success(`A 6-digit OTP has been sent to ${email.trim()}.`);
    } catch (err) {
      const message =
        typeof err === 'string'
          ? err
          : (err as { message?: string })?.message ||
            'Could not send OTP. Please try again.';
      setLocalError(message);
      toast.error(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleProceed();
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-black md:bg-[#08080a] flex items-center justify-center px-6 py-8 select-none overflow-hidden">
      {/* Desktop Background Ambient Glows */}
      <div className="hidden md:block absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container Card */}
      <div
        className="
          relative z-10 bg-black text-white
          w-full h-full max-w-100
          flex flex-col justify-start
          pt-4 sm:pt-6
          md:h-205 md:max-h-[92vh] md:p-8
          md:rounded-[2.75rem] md:border md:border-white/10
          md:shadow-[0_0_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.1)]
        "
      >
        {/* Top Header */}
        <div className="w-full shrink-0">
          <Header showSubtitle={false} />
        </div>

        {/* Form Container */}
        <div className="w-full mt-10 sm:mt-12 flex flex-col">
          <h1 className="text-[22px] sm:text-2xl font-black tracking-tight text-white mb-6">
            Enter your email
          </h1>

          {/* Email Input */}
          <div className="w-full">
            <input
              type="email"
              value={email}
              maxLength={254}
              onChange={(e) => {
                dispatch(signupActions.setEmail(e.target.value));
                if (localError) setLocalError('');
              }}
              onBlur={() => {
                const validationError = validate();
                if (validationError) setLocalError(validationError);
              }}
              onKeyDown={handleKeyDown}
              placeholder="EMAIL"
              aria-invalid={!!localError}
              aria-describedby={localError ? 'email-error' : undefined}
              className={`
                w-full h-13 !bg-black text-white px-4 rounded-xl text-sm font-medium
                border transition-all outline-none
                placeholder:text-zinc-600 placeholder:font-bold placeholder:text-xs placeholder:tracking-wider
                ${localError ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-500'}
              `}
            />
            {localError && (
              <p id="email-error" className="text-xs text-red-400 mt-2 pl-1 font-medium">
                {localError}
              </p>
            )}
          </div>

          {/* PROCEED Button */}
          <div className="mt-4">
            <button
              onClick={handleProceed}
              disabled={isSending || !email.trim()}
              className="
                w-full h-13 bg-white text-black font-extrabold rounded-xl
                text-sm tracking-wider uppercase flex items-center justify-center gap-2
                hover:bg-zinc-100 active:scale-[0.985] transition-all cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : (
                'PROCEED'
              )}
            </button>
          </div>

          {/* Newsletter Checkbox */}
          <div
            onClick={() => dispatch(signupActions.setNewsletter(!newsletter))}
            className="mt-4 flex items-center gap-3 cursor-pointer select-none py-1 group"
          >
            <div
              className={`
                w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0
                ${
                  newsletter
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-transparent border-zinc-700 group-hover:border-zinc-500'
                }
              `}
            >
              {newsletter && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="text-[13px] text-zinc-300 font-normal leading-tight">
              I’d like to subscribe to your newsletter
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Email;