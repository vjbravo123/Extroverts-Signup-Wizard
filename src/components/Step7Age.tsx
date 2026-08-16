// src/components/Step7Age.tsx
'use client';

import React, { useRef, useState } from 'react';
import { Header } from './shared/Header';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupActions } from '@/store/slices/signupSlice';
import { AlertTriangle, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from './shared/ToastProvider';

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1920;
const MIN_AGE = 18;
const MAX_AGE = 120;

type DobField = 'day' | 'month' | 'year';
type Dob = { day: string; month: string; year: string };

/** Last valid day for a given 1-indexed month/year, leap years included. */
const daysInMonth = (month: number, year: number): number =>
  new Date(year, month, 0).getDate();

/** If day now exceeds what the (possibly just-changed) month/year allows, pull it back in range. */
const clampDayIfNeeded = (next: Dob): Dob => {
  const m = parseInt(next.month, 10);
  const y = parseInt(next.year, 10);
  const d = parseInt(next.day, 10);
  if (!isNaN(m) && !isNaN(y) && !isNaN(d)) {
    const max = daysInMonth(m, y);
    if (d > max) {
      return { ...next, day: max.toString().padStart(2, '0') };
    }
  }
  return next;
};

const calculateAge = (d: number, m: number, y: number): number => {
  const birthDate = new Date(y, m - 1, d);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const Step7Age: React.FC = () => {
  const dispatch = useAppDispatch();
  const dob = useAppSelector((state) => state.signup.dob);
  const [showDobModal, setShowDobModal] = useState(false);
  const toast = useToast();

  // No pre-filled "valid adult" date — blank until the user actually picks one,
  // or re-opens the modal on an already-confirmed dob to edit it.
  const [tempDob, setTempDob] = useState<Dob>({
    day: dob.day || '',
    month: dob.month || '',
    year: dob.year || '',
  });

  const [ageError, setAgeError] = useState<string | null>(null);

  const dayInputRef = useRef<HTMLInputElement>(null);
  const monthInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

  const openDobModal = () => {
    setTempDob({
      day: dob.day || '',
      month: dob.month || '',
      year: dob.year || '',
    });
    setAgeError(null);
    setShowDobModal(true);
  };

  // Adjust numeric value with sliding / stepping (chevrons + wheel)
  const adjustValue = (field: DobField, delta: number) => {
    setAgeError(null);
    setTempDob((prev) => {
      let current: number;
      let min = 1;
      let max = 31;

      if (field === 'day') {
        current = parseInt(prev.day, 10) || 0;
        const mVal = parseInt(prev.month, 10);
        const yVal = parseInt(prev.year, 10);
        max = !isNaN(mVal) && !isNaN(yVal) ? daysInMonth(mVal, yVal) : 31;
      } else if (field === 'month') {
        current = parseInt(prev.month, 10) || 0;
        max = 12;
      } else {
        // Anchor an empty year near a plausible adult birth year instead of 1 —
        // just a friendlier starting point for the scroll/click, not a submitted value.
        current = parseInt(prev.year, 10) || CURRENT_YEAR - MIN_AGE;
        min = MIN_YEAR;
        max = CURRENT_YEAR;
      }

      let next = current + delta;
      if (next < min) next = max;
      if (next > max) next = min;

      const formatted = field === 'year' ? next.toString() : next.toString().padStart(2, '0');

      let updated: Dob = { ...prev, [field]: formatted };
      if (field !== 'day') {
        updated = clampDayIfNeeded(updated);
      }
      return updated;
    });
  };

  // Handle typing with auto-advance and live clamping (no more "Feb 31")
  const handleInputChange = (field: DobField, val: string) => {
    setAgeError(null);
    const digitsOnly = val.replace(/\D/g, '');

    setTempDob((prev) => {
      let updated: Dob = { ...prev };

      if (field === 'day') {
        let d = digitsOnly.slice(0, 2);
        if (d.length === 2) {
          const mVal = parseInt(updated.month, 10);
          const yVal = parseInt(updated.year, 10);
          const maxDay = !isNaN(mVal) && !isNaN(yVal) ? daysInMonth(mVal, yVal) : 31;
          const clamped = Math.min(Math.max(parseInt(d, 10), 1), maxDay);
          d = clamped.toString().padStart(2, '0');
        }
        updated.day = d;
      } else if (field === 'month') {
        let m = digitsOnly.slice(0, 2);
        if (m.length === 2) {
          const clamped = Math.min(Math.max(parseInt(m, 10), 1), 12);
          m = clamped.toString().padStart(2, '0');
        }
        updated.month = m;
        updated = clampDayIfNeeded(updated);
      } else {
        updated.year = digitsOnly.slice(0, 4);
        if (updated.year.length === 4) {
          updated = clampDayIfNeeded(updated);
        }
      }

      return updated;
    });

    if (field === 'day' && digitsOnly.slice(0, 2).length === 2) monthInputRef.current?.focus();
    if (field === 'month' && digitsOnly.slice(0, 2).length === 2) yearInputRef.current?.focus();
  };

  const handleFieldKeyDown = (field: DobField, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !tempDob[field]) {
      if (field === 'month') dayInputRef.current?.focus();
      if (field === 'year') monthInputRef.current?.focus();
    }
    if (e.key === 'Enter') {
      handleDobConfirm();
    }
  };

  // Wheel slide scroll support
  const handleWheel = (field: DobField, e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      adjustValue(field, 1);
    } else {
      adjustValue(field, -1);
    }
  };

  const validateDob = (): string | null => {
    if (!tempDob.day || !tempDob.month || !tempDob.year) {
      return 'Please select your full date of birth.';
    }

    const d = parseInt(tempDob.day, 10);
    const m = parseInt(tempDob.month, 10);
    const y = parseInt(tempDob.year, 10);

    if (isNaN(d) || isNaN(m) || isNaN(y)) {
      return 'Please enter a valid date of birth.';
    }
    if (y < MIN_YEAR || y > CURRENT_YEAR) {
      return `Year must be between ${MIN_YEAR} and ${CURRENT_YEAR}.`;
    }
    if (m < 1 || m > 12) {
      return 'Please enter a valid month.';
    }
    const maxDay = daysInMonth(m, y);
    if (d < 1 || d > maxDay) {
      return `${tempDob.month}/${tempDob.year} only has ${maxDay} days.`;
    }

    const birthDate = new Date(y, m - 1, d);
    if (birthDate.getTime() > Date.now()) {
      return 'Date of birth cannot be in the future.';
    }

    const age = calculateAge(d, m, y);
    if (age < MIN_AGE) {
      return `You must be at least ${MIN_AGE} years old to sign up.`;
    }
    if (age > MAX_AGE) {
      return 'Please enter a valid date of birth.';
    }

    return null;
  };

  // Validation & Confirmation
  const handleDobConfirm = () => {
    const validationError = validateDob();
    if (validationError) {
      setAgeError(validationError);
      toast.error(validationError);
      dispatch(signupActions.setIsAgeValid(false));
      return;
    }

    dispatch(signupActions.setDob(tempDob));
    dispatch(signupActions.setIsAgeValid(true));
    setAgeError(null);
    setShowDobModal(false);
    toast.success('Date of birth confirmed.');
  };

  const hasSelectedDob = Boolean(dob.day && dob.month && dob.year);
  const displayAgeText = hasSelectedDob
    ? `${calculateAge(parseInt(dob.day, 10), parseInt(dob.month, 10), parseInt(dob.year, 10))} Years (${dob.day}/${dob.month}/${dob.year})`
    : '';

  // Live preview inside the modal, before the user commits with PROCEED
  const tempAgePreview = (() => {
    if (!tempDob.day || !tempDob.month || !tempDob.year) return null;
    const d = parseInt(tempDob.day, 10);
    const m = parseInt(tempDob.month, 10);
    const y = parseInt(tempDob.year, 10);
    if (isNaN(d) || isNaN(m) || isNaN(y) || y < MIN_YEAR || y > CURRENT_YEAR) return null;
    const age = calculateAge(d, m, y);
    if (age < 0 || age > MAX_AGE) return null;
    return age;
  })();

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
          px-7 pt-12 pb-14
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
              How many years have you been partying?
            </h1>
          </div>

          {/* Age Selector Box */}
          <div className="mt-6">
            <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2.5">
              AGE
            </label>

            <div
              onClick={openDobModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openDobModal();
              }}
              className="
                w-full h-13 !bg-black text-white px-4 rounded-xl text-sm font-medium
                border border-zinc-800 hover:border-zinc-500 transition-all duration-200
                flex items-center justify-between cursor-pointer
              "
            >
              <span className={displayAgeText ? 'text-white font-medium' : 'text-zinc-500'}>
                {displayAgeText || 'Select your date of birth'}
              </span>
            </div>

            {/* Helper Text */}
            <p className="text-[13px] text-zinc-400 mt-3 leading-relaxed pl-0.5 font-normal">
              We need your age to verify you&apos;re eligible and help others know who they&apos;re connecting with. You must be {MIN_AGE}+ to join.
            </p>
          </div>
        </div>

        {/* 2. Bottom Section: NEXT & BACK */}
        <div className="w-full shrink-0 flex flex-col space-y-3 pt-4">
          <button
            onClick={() => {
              if (!hasSelectedDob) {
                openDobModal();
              } else {
                dispatch(signupActions.setStep(8)); // Move to Step 8
              }
            }}
            disabled={!hasSelectedDob}
            className="
              w-full h-13 bg-white text-black font-extrabold rounded-xl
              text-sm tracking-wider uppercase flex items-center justify-center
              hover:bg-zinc-100 active:scale-[0.985] transition-all cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            NEXT
          </button>

          <button
            onClick={() => dispatch(signupActions.setStep(6))}
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

      {/* 3. DATE OF BIRTH Bottom Sheet Modal */}
      {showDobModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0 md:p-4">
          <div
            className="
              w-full max-w-107.5 bg-[#121214] border-t md:border border-white/10
              rounded-t-[2rem] md:rounded-[2rem] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-200
            "
          >
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto mb-5" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="text-base font-black uppercase tracking-wider text-white">
                DATE OF BIRTH
              </h3>
              <button
                onClick={() => setShowDobModal(false)}
                aria-label="Close"
                className="text-zinc-400 hover:text-white p-1 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Interactive Selector Cards (Day, Month, Year) */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {/* Day Box */}
              <div
                onWheel={(e) => handleWheel('day', e)}
                className="group relative bg-zinc-950/80 border border-zinc-800 focus-within:border-white rounded-xl flex flex-col items-center py-2 transition"
              >
                <button
                  type="button"
                  onClick={() => adjustValue('day', 1)}
                  aria-label="Increase day"
                  className="w-full text-zinc-600 hover:text-white flex justify-center py-1 cursor-pointer transition"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                <input
                  ref={dayInputRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="DD"
                  value={tempDob.day}
                  onChange={(e) => handleInputChange('day', e.target.value)}
                  onKeyDown={(e) => handleFieldKeyDown('day', e)}
                  aria-label="Day"
                  className="w-full bg-transparent text-center text-lg font-bold text-white outline-none py-1 placeholder:text-zinc-600"
                />

                <button
                  type="button"
                  onClick={() => adjustValue('day', -1)}
                  aria-label="Decrease day"
                  className="w-full text-zinc-600 hover:text-white flex justify-center py-1 cursor-pointer transition"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Month Box */}
              <div
                onWheel={(e) => handleWheel('month', e)}
                className="group relative bg-zinc-950/80 border border-zinc-800 focus-within:border-white rounded-xl flex flex-col items-center py-2 transition"
              >
                <button
                  type="button"
                  onClick={() => adjustValue('month', 1)}
                  aria-label="Increase month"
                  className="w-full text-zinc-600 hover:text-white flex justify-center py-1 cursor-pointer transition"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                <input
                  ref={monthInputRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="MM"
                  value={tempDob.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                  onKeyDown={(e) => handleFieldKeyDown('month', e)}
                  aria-label="Month"
                  className="w-full bg-transparent text-center text-lg font-bold text-white outline-none py-1 placeholder:text-zinc-600"
                />

                <button
                  type="button"
                  onClick={() => adjustValue('month', -1)}
                  aria-label="Decrease month"
                  className="w-full text-zinc-600 hover:text-white flex justify-center py-1 cursor-pointer transition"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Year Box */}
              <div
                onWheel={(e) => handleWheel('year', e)}
                className="group relative bg-zinc-950/80 border border-zinc-800 focus-within:border-white rounded-xl flex flex-col items-center py-2 transition"
              >
                <button
                  type="button"
                  onClick={() => adjustValue('year', 1)}
                  aria-label="Increase year"
                  className="w-full text-zinc-600 hover:text-white flex justify-center py-1 cursor-pointer transition"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                <input
                  ref={yearInputRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="YYYY"
                  value={tempDob.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  onKeyDown={(e) => handleFieldKeyDown('year', e)}
                  aria-label="Year"
                  className="w-full bg-transparent text-center text-lg font-bold text-white outline-none py-1 placeholder:text-zinc-600"
                />

                <button
                  type="button"
                  onClick={() => adjustValue('year', -1)}
                  aria-label="Decrease year"
                  className="w-full text-zinc-600 hover:text-white flex justify-center py-1 cursor-pointer transition"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live Age Preview (before confirming) */}
            {tempAgePreview !== null && !ageError && (
              <p className="text-center text-xs text-zinc-500 mb-4">
                That makes you{' '}
                <span className={tempAgePreview < MIN_AGE ? 'text-red-400 font-bold' : 'text-zinc-300 font-bold'}>
                  {tempAgePreview}
                </span>{' '}
                years old
              </p>
            )}

            {/* Error Message */}
            {ageError && (
              <div className="mb-4 flex items-center gap-2 text-xs text-red-400 bg-red-950/40 p-3 rounded-xl border border-red-900/50">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{ageError}</span>
              </div>
            )}

            {/* Modal PROCEED Button */}
            <button
              onClick={handleDobConfirm}
              disabled={!tempDob.day || !tempDob.month || !tempDob.year}
              className="
                w-full h-12.5 bg-white text-black font-extrabold rounded-xl
                text-sm tracking-wider uppercase flex items-center justify-center
                hover:bg-zinc-100 active:scale-[0.985] transition-all cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              PROCEED
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step7Age;