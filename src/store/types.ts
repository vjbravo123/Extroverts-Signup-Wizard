export interface DateOfBirth {
  day: string;
  month: string;
  year: string;
}

export interface SignupState {
  currentStep: number;
  inviteCode: string;
  termsAccepted: boolean;
  location: string;
  locationStatus: 'idle' | 'loading' | 'success' | 'error';
  email: string;
  newsletter: boolean;
  otp: string[];
  otpStatus: 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'failed';
  resendCountdown: number;
  name: string;
  username: string;
  dob: DateOfBirth;
  isAgeValid: boolean;
  pronouns: string[];
  errorMessage: string | null;
  showErrorToast: boolean;
}