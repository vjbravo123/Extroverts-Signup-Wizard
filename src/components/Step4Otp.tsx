// src/components/Step4Otp.tsx
'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Header } from './shared/Header';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupActions } from '@/store/slices/signupSlice';
import { sendOtpThunk, verifyOtpThunk } from '@/store/slices/signupThunks';
import { Loader2, Info } from 'lucide-react';
import { useToast } from './shared/ToastProvider';

const OTP_LENGTH = 6;

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === 'string' && err.trim()) return err;
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === 'string' && msg.trim()) return msg;
  }
  return fallback;
};

export const Step4Otp: React.FC = () => {
  const dispatch = useAppDispatch();
  const { otp, email, otpStatus, resendCountdown } = useAppSelector((state) => state.signup);
  const isVerifying = otpStatus === 'verifying';
  const isSending = otpStatus === 'sending';
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const toast = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setInterval(() => dispatch(signupActions.decrementCountdown()), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown, dispatch]);

  const clearOtp = useCallback(() => {
    for (let i = 0; i < OTP_LENGTH; i++) {
      dispatch(signupActions.setOtpDigit({ index: i, value: '' }));
    }
    inputsRef.current[0]?.focus();
  }, [dispatch]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const singleDigit = val.slice(-1);
    dispatch(signupActions.setOtpDigit({ index, value: singleDigit }));

    if (singleDigit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Lets a user paste the full 6-digit code into any box instead of typing digit-by-digit
  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    e.preventDefault();

    const chars = pasted.slice(0, OTP_LENGTH - index).split('');
    chars.forEach((char, offset) => {
      dispatch(signupActions.setOtpDigit({ index: index + offset, value: char }));
    });

    const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleVerify = useCallback(async () => {
    const code = otp.join('');

    if (code.length < OTP_LENGTH) {
      toast.error('Please enter the complete 6-digit code.');
      inputsRef.current[otp.findIndex((d) => !d)]?.focus();
      return;
    }
    if (isVerifying) return;

    try {
      await dispatch(verifyOtpThunk()).unwrap();
      toast.success('Email verified successfully.');
    } catch (err) {
      const message = getErrorMessage(err, 'Verification failed. Please try again.');
      toast.error(message);
      clearOtp();
    }
  }, [dispatch, otp, isVerifying, toast, clearOtp]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const handleResend = useCallback(async () => {
    if (resendCountdown > 0 || isSending) return;

    try {
      await dispatch(sendOtpThunk()).unwrap();
      clearOtp();
      toast.success(`A new OTP has been sent to ${email || 'your email'}.`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not resend OTP. Please try again.'));
    }
  }, [dispatch, resendCountdown, isSending, email, toast, clearOtp]);

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-black md:bg-[#08080a] flex items-center justify-center px-6 py-8 select-none overflow-hidden">
      {/* Desktop Background Ambient Glows */}
      <div className="hidden md:block absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Card Container */}
      <div
        className="
          relative z-10 bg-black text-white
          w-full h-full max-w-100
          flex flex-col justify-start
          pt-4 sm:pt-6
          /* Desktop Card Frame */
          md:h-205 md:max-h-[92vh] md:p-8
          md:rounded-[2.75rem] md:border md:border-white/10
          md:shadow-[0_0_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.1)]
        "
      >
        {/* Logo Header */}
        <div className="w-full shrink-0">
          <Header showSubtitle={false} />
        </div>

        {/* Form Container */}
        <div className="w-full mt-10 sm:mt-12 flex flex-col">
          {/* Label */}
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-white mb-6">
            ENTER OTP
          </h2>

          {/* 6-Digit OTP Inputs with Dots & Underlines */}
          <div className="grid grid-cols-6 gap-3 w-full">
            {otp.map((digit, idx) => (
              <div key={idx} className="relative flex flex-col items-center">
                <input
                  ref={(el) => {
                    inputsRef.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={(e) => handlePaste(idx, e)}
                  autoFocus={idx === 0}
                  disabled={isVerifying}
                  aria-label={`OTP digit ${idx + 1}`}
                  className="
                    w-full bg-transparent text-center text-xl font-bold text-white
                    h-10 outline-none pb-2 border-b border-zinc-600 focus:border-white
                    transition-colors caret-white disabled:opacity-50
                  "
                />
                {/* Dot indicator when slot is empty */}
                {!digit && (
                  <span className="absolute top-2.5 pointer-events-none text-zinc-500 font-bold text-lg leading-none">
                    &bull;
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Resend OTP Link */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleResend}
              disabled={resendCountdown > 0 || isSending}
              className="text-xs text-zinc-400 hover:text-white font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSending
                ? 'Sending...'
                : resendCountdown > 0
                ? `Resend OTP in ${resendCountdown}s`
                : 'Resend OTP'}
            </button>
          </div>

          {/* Stacked Action Buttons */}
          <div className="mt-8 space-y-3">
            {/* VERIFY Button */}
            <button
              onClick={handleVerify}
              disabled={isVerifying || otp.join('').length < OTP_LENGTH}
              className="
                w-full h-12.5 bg-white text-black font-extrabold rounded-xl
                text-sm tracking-wider uppercase flex items-center justify-center gap-2
                hover:bg-zinc-100 active:scale-[0.985] transition-all cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isVerifying ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : (
                'VERIFY'
              )}
            </button>

            {/* GO BACK Button */}
            <button
              onClick={() => dispatch(signupActions.setStep(3))}
              disabled={isVerifying}
              className="
                w-full h-12.5 bg-transparent text-white font-extrabold rounded-xl
                border border-white text-sm tracking-wider uppercase
                flex items-center justify-center hover:bg-white/10 active:scale-[0.985]
                transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              GO BACK
            </button>
          </div>

          {/* Sent To Caption */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-zinc-500 text-[12px]">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              A 6-digit OTP has been sent to{' '}
              <span className="text-zinc-400">{email || 'your email'}</span>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Otp;