# Extroverts — Signup Wizard

A responsive, high-fidelity signup wizard built as a front-end assessment project. The application recreates a modern multi-step onboarding experience with progressive disclosure, client-side state management, validation, OTP email verification, responsive UI, loading states, error handling, and a completion experience.

**Developer:** Vivek Joshi

---

## ✨ Features

* 🎯 Multi-step signup wizard with progressive disclosure
* 📱 Fully responsive design for mobile, tablet, and desktop
* 🎨 Poppins typography with a polished party/social experience
* 🔐 Email OTP verification
* 📧 OTP delivery using **Resend**
* 🌐 OTP email delivery configured with the domain `vivekjoshi.online`
* 🔄 Resend OTP functionality
* ⏳ Loading states during asynchronous operations
* ✅ Step-by-step form validation
* ❌ Contextual validation and error messages
* 🔔 Global toast notifications
* ↩️ Back navigation between signup steps
* 🧠 Centralized signup state using Redux Toolkit
* 🎉 Success/completion screen
* 🎊 Confetti success animation
* 🧩 Reusable React components
* 🛡️ API routes for sending and verifying OTPs
* ⚡ Next.js App Router architecture
* 🎨 Tailwind CSS for styling
* 📦 TypeScript for type safety

---

## 🧭 Signup Flow

The application follows a progressive signup experience:

```text
Terms & Conditions
        ↓
Location
        ↓
Email
        ↓
OTP Verification
        ↓
Username
        ↓
Name
        ↓
Age
        ↓
Pronouns
        ↓
Invite Code
        ↓
Success
```

Each step collects only the information required at that stage, keeping the onboarding process simple and focused.

---

## 🛠️ Tech Stack

| Technology         | Purpose                                 |
| ------------------ | --------------------------------------- |
| Next.js 16         | React framework and application routing |
| React 19           | UI development                          |
| TypeScript         | Type safety                             |
| Tailwind CSS 4     | Styling and responsive UI               |
| Redux Toolkit      | Application state management            |
| React Redux        | Connecting Redux with React             |
| Resend             | OTP email delivery                      |
| Lucide React       | UI icons                                |
| Canvas Confetti    | Success animation                       |
| Next.js API Routes | OTP send/verification endpoints         |
| Poppins            | Application typography                  |

---

## 📁 Project Structure

```text
src
 ┣ app
 ┃ ┣ api
 ┃ ┃ ┣ send-otp
 ┃ ┃ ┃ ┗ route.ts
 ┃ ┃ ┗ verify-otp
 ┃ ┃   ┗ route.ts
 ┃ ┣ globals.css
 ┃ ┣ layout.tsx
 ┃ ┗ page.tsx
 ┣ components
 ┃ ┣ shared
 ┃ ┃ ┣ Header.tsx
 ┃ ┃ ┣ Logo.tsx
 ┃ ┃ ┗ ToastProvider.tsx
 ┃ ┣ Step10Success.tsx
 ┃ ┣ Step1Terms.tsx
 ┃ ┣ Step2Location.tsx
 ┃ ┣ Step3Email.tsx
 ┃ ┣ Step4Otp.tsx
 ┃ ┣ Step5Username.tsx
 ┃ ┣ Step6Name.tsx
 ┃ ┣ Step7Age.tsx
 ┃ ┣ Step8Pronouns.tsx
 ┃ ┗ Step9InviteCode.tsx
 ┣ lib
 ┃ ┗ otpStore.ts
 ┣ providers
 ┃ ┗ StoreProvider.tsx
 ┗ store
   ┣ slices
   ┃ ┣ signupSlice.ts
   ┃ ┗ signupThunks.ts
   ┣ hooks.ts
   ┣ index.ts
   ┗ types.ts
```

---

## 🧩 Architecture

### App Router

The application uses the Next.js App Router.

```text
src/app
```

The root page controls the signup experience while API route handlers are responsible for OTP operations.

### API Routes

#### Send OTP

```text
POST /api/send-otp
```

Responsible for generating/sending the OTP to the user's email address.

#### Verify OTP

```text
POST /api/verify-otp
```

Responsible for validating the OTP submitted by the user.

---

## 🔐 OTP Verification

OTP email delivery is implemented using **Resend**.

The application uses the configured domain:

```text
vivekjoshi.online
```

The OTP flow is:

```text
User enters email
       ↓
Send OTP request
       ↓
Next.js API route
       ↓
Resend
       ↓
OTP delivered to email
       ↓
User enters OTP
       ↓
Verify OTP request
       ↓
OTP validation
       ↓
Continue signup
```

### Environment Variables

Create a `.env.local` file in the project root.

```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_email@vivekjoshi.online
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Never commit `.env.local` or your Resend API key to Git.

For production, update the site URL:

```env
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

---

## 🗃️ State Management

Redux Toolkit is used to manage the signup wizard state.

The main Redux structure is:

```text
store/
├── index.ts
├── hooks.ts
├── types.ts
└── slices/
    ├── signupSlice.ts
    └── signupThunks.ts
```

### `signupSlice.ts`

Responsible for maintaining signup-related state such as:

* Current signup step
* User email
* OTP verification state
* Username
* Name
* Age
* Pronouns
* Location
* Invite code
* Loading states
* Validation/error states
* Signup completion state

### `signupThunks.ts`

Contains asynchronous operations used by the signup flow, including communication with the OTP API routes.

### `StoreProvider.tsx`

Provides the Redux store to the React application.

---

## 🔄 Progressive Disclosure

The signup process intentionally reveals information progressively.

Instead of presenting one large form, the user completes smaller focused steps:

```text
Step 1 → Terms
Step 2 → Location
Step 3 → Email
Step 4 → OTP
Step 5 → Username
Step 6 → Name
Step 7 → Age
Step 8 → Pronouns
Step 9 → Invite Code
Step 10 → Success
```

This improves usability by reducing cognitive load and keeping each interaction focused.

---

## ✅ Validation & UX

The signup experience includes validation and interaction states designed around the assessment requirements.

### Validation

The form handles:

* Required fields
* Email format validation
* Empty/whitespace-only values
* Input constraints
* Numeric input handling
* Age validation
* OTP validation
* Invalid OTP states
* Invalid form submissions

### Loading States

Asynchronous operations provide visual feedback so users understand that an action is being processed.

Examples include:

```text
Sending OTP...
Verifying OTP...
Completing signup...
```

Buttons are prevented from being repeatedly submitted while an operation is in progress.

### Error Handling

Errors are presented at two levels:

**Field-level errors**

```text
Invalid email address
Please enter your name
Invalid OTP
```

**Global feedback**

Toast notifications are provided through:

```text
ToastProvider.tsx
```

This gives users immediate feedback for actions that affect the overall signup flow.

---

## 📱 Responsive Design

The interface is designed to work across:

* Mobile phones
* Tablets
* Laptops
* Desktop screens

The signup experience prioritizes mobile usability while maintaining a polished desktop presentation.

Tailwind CSS is used for responsive layouts and component styling.

---

## 🎉 Success Experience

After successfully completing the signup flow, the user is taken to a dedicated success state.

The success experience includes a visual confirmation and confetti animation using:

```text
canvas-confetti
```

This provides clear feedback that the signup process has been completed successfully.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Navigate into the project

```bash
cd earlley-signup
```

### 3. Install dependencies

Using npm:

```bash
npm install
```

Or:

```bash
yarn install
```

```bash
pnpm install
```

### 4. Configure environment variables

Create:

```text
.env.local
```

Add:

```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_email@vivekjoshi.online
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Start the development server

```bash
npm run dev
```

### 6. Open the application

Visit:

```text
http://localhost:3000
```

---

## 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts the Next.js development server.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Production Server

```bash
npm run start
```

Starts the production server after building.

### Lint

```bash
npm run lint
```

Runs ESLint against the project.

---

## 🏗️ Production Build

To test the production version locally:

```bash
npm run build
npm run start
```

The application will then be available at:

```text
http://localhost:3000
```

---

## 🔒 Environment & Security

Sensitive credentials are kept outside the source code.

The following should **never** be committed:

```text
.env.local
```

Especially:

```text
RESEND_API_KEY
```

For production deployments, environment variables should be configured through the hosting provider.

---

## 🎯 Assessment Goals

This project was built with the assessment requirements in mind:

* High-fidelity signup experience
* Progressive disclosure
* Responsive UI
* Form validation
* OTP verification
* Loading and error states
* Toast feedback
* Backward navigation
* Centralized state management
* Edge-case handling
* Successful completion state
* Improved UX beyond a basic form implementation

The goal was not only to reproduce the signup flow but also to make the experience feel consistent, responsive, and production-ready.

---

## 👨‍💻 Author

**Vivek Joshi**

Full Stack Developer

Built with React, Next.js, TypeScript, Redux Toolkit, Tailwind CSS, and Resend.

---

## 📄 License

This project was created as a front-end assessment/demo project.
