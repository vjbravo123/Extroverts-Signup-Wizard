'use client';

import { useAppSelector } from '@/store/hooks';
import { Step1Terms } from '@/components/Step1Terms';
import { Step2Location } from '@/components/Step2Location';
import { Step3Email } from '@/components/Step3Email';
import { Step4Otp } from '@/components/Step4Otp';
import { Step5Username } from '@/components/Step5Username';
import { Step6Name } from '@/components/Step6Name';
import { Step7Age } from '@/components/Step7Age';
import { Step8Pronouns } from '@/components/Step8Pronouns';
import { Step9InviteCode } from '@/components/Step9InviteCode';
import { Step10Success } from '@/components/Step10Success';

export default function SignupWizard() {
  const currentStep = useAppSelector((state) => state.signup.currentStep);

  return (
    <main>
      {currentStep === 1 && <Step1Terms />}
      {currentStep === 2 && <Step2Location />}
      {currentStep === 3 && <Step3Email />}
      {currentStep === 4 && <Step4Otp />}
      {currentStep === 5 && <Step5Username />}
      {currentStep === 6 && <Step6Name />}
      {currentStep === 7 && <Step7Age />}
      {currentStep === 8 && <Step8Pronouns />}
      {currentStep === 9 && <Step9InviteCode />}
      {currentStep === 10 && <Step10Success />}
    </main>
  );
}