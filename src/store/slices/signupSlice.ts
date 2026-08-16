import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SignupState, DateOfBirth } from '../types';
import { sendOtpThunk, verifyOtpThunk, requestLocationThunk } from './signupThunks';

const initialState: SignupState = {
  currentStep: 1, 
  termsAccepted: false,
  location: '',
  locationStatus: 'idle',
  email: '',
  newsletter: false,
  otp: ['', '', '', '', '', ''],
  otpStatus: 'idle',
  resendCountdown: 0,
  username: '',
  name: '',
  dob: { day: '01', month: '01', year: '2000' },
  isAgeValid: true,
  pronouns: [],
  inviteCode: '',
  errorMessage: null,
  showErrorToast: false,
};

export const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      if (state.currentStep > 1) state.currentStep -= 1;
    },
    setTermsAccepted: (state, action: PayloadAction<boolean>) => {
      state.termsAccepted = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setNewsletter: (state, action: PayloadAction<boolean>) => {
      state.newsletter = action.payload;
    },
    setOtpDigit: (state, action: PayloadAction<{ index: number; value: string }>) => {
      state.otp[action.payload.index] = action.payload.value;
    },
    decrementCountdown: (state) => {
      if (state.resendCountdown > 0) state.resendCountdown -= 1;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload.toLowerCase().replace(/\s+/g, '');
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setDob: (state, action: PayloadAction<DateOfBirth>) => {
      state.dob = action.payload;
    },
    setIsAgeValid: (state, action: PayloadAction<boolean>) => {
      state.isAgeValid = action.payload;
    },
    togglePronoun: (state, action: PayloadAction<string>) => {
      const pronoun = action.payload;
      if (state.pronouns.includes(pronoun)) {
        state.pronouns = state.pronouns.filter((p) => p !== pronoun);
      } else if (state.pronouns.length < 3) {
        state.pronouns.push(pronoun);
      }
    },
    setInviteCode: (state, action: PayloadAction<string>) => {
      state.inviteCode = action.payload.toUpperCase();
    },
    clearErrorToast: (state) => {
      state.showErrorToast = false;
      state.errorMessage = null;
    },
    resetWizard: () => initialState,
  },
  extraReducers: (builder) => {
    // Send OTP -> Move to Step 4 (OTP)
    builder.addCase(sendOtpThunk.pending, (state) => {
      state.otpStatus = 'sending';
      state.showErrorToast = false;
    });
    builder.addCase(sendOtpThunk.fulfilled, (state) => {
      state.otpStatus = 'sent';
      state.resendCountdown = 30;
      state.currentStep = 4; // Step 4: OTP
    });
    builder.addCase(sendOtpThunk.rejected, (state, action) => {
      state.otpStatus = 'failed';
      state.showErrorToast = true;
      state.errorMessage = action.payload || 'Failed to send OTP';
    });

    // Verify OTP -> Move to Step 5 (Username)
    builder.addCase(verifyOtpThunk.pending, (state) => {
      state.otpStatus = 'verifying';
      state.showErrorToast = false;
    });
    builder.addCase(verifyOtpThunk.fulfilled, (state) => {
      state.otpStatus = 'verified';
      state.currentStep = 5; // Step 5: Username
    });
    builder.addCase(verifyOtpThunk.rejected, (state, action) => {
      state.otpStatus = 'failed';
      state.showErrorToast = true;
      state.errorMessage = action.payload || 'Verification failed. Please try again.';
    });

    // Request Location -> Move to Step 3 (Email)
    builder.addCase(requestLocationThunk.pending, (state) => {
      state.locationStatus = 'loading';
    });
    builder.addCase(requestLocationThunk.fulfilled, (state, action) => {
      state.locationStatus = 'success';
      state.location = action.payload;
      state.currentStep = 3; // Step 3: Email
    });
  },
});

export const signupActions = signupSlice.actions;
export default signupSlice.reducer;