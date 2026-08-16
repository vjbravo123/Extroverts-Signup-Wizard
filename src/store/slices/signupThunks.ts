import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';

// 1. Send OTP Thunk
export const sendOtpThunk = createAsyncThunk<
  { message: string },
  void,
  { state: RootState; rejectValue: string }
>('signup/sendOtp', async (_, { getState, rejectWithValue }) => {
  try {
    const { email } = getState().signup;
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.error || 'Failed to send OTP');
    }

    return { message: data.message };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Network error occurred');
  }
});

// 2. Verify OTP Thunk
export const verifyOtpThunk = createAsyncThunk<
  boolean,
  void,
  { state: RootState; rejectValue: string }
>('signup/verifyOtp', async (_, { getState, rejectWithValue }) => {
  try {
    const { email, otp } = getState().signup;
    const fullOtp = otp.join('');

    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: fullOtp }),
    });

    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.error || 'Verification failed. Please try again.');
    }

    return true;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Verification failed. Please try again.');
  }
});

// 3. Location Thunk
export const requestLocationThunk = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>('signup/requestLocation', async () => {
  return new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => resolve('Nearby / Local Area'),
        () => resolve('Global / Nearby')
      );
    } else {
      resolve('Global / Nearby');
    }
  });
});