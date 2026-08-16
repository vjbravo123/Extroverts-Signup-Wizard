# Extroverts — Signup Wizard

A responsive, high-fidelity multi-step signup wizard built as a front-end assessment project. The application recreates a modern onboarding experience with progressive disclosure, client-side state management, form validation, OTP email verification, responsive UI, loading states, error handling, and a polished completion experience.

**Developer:** Vivek Joshi

### 🔗 Project Links

* **Live Demo:** https://extroverts-signup-wizard-assignment.vercel.app/
* **GitHub Repository:** https://github.com/vjbravo123/Extroverts-Signup-Wizard

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
* 🎨 Tailwind CSS
* 📦 TypeScript for type safety
* 🤖 SEO metadata, robots.txt, and sitemap.xml

---

## 🧭 Signup Flow

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
 ┃ ┣ page.tsx
 ┃ ┣ robots.ts
 ┃ ┗ sitemap.ts
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

The application uses the Next.js App Router:

```text
src/app
```

The root page controls the signup experience, while API route handlers manage OTP operations.

### API Routes

#### Send OTP

```text
POST /api/send-otp
```

Generates and sends an OTP to the user's email address.

#### Verify OTP

```text
POST /api/verify-otp
```

Validates the OTP submitted by the user.

---

## 🔐 OTP Verification

OTP email delivery is implemented using **Resend**.

The application uses the configured domain:

```text
vivekjoshi.online
```

### OTP Flow

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

Create a `.env.local` file in the project root:

```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_email@vivekjoshi.online
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Never commit `.env.local` or your Resend API key to Git.

For production:

```env
NEXT_PUBLIC_SITE_URL=https://extroverts-signup-wizard-assignment.vercel.app
```

---

## 🗃️ State Management

Redux Toolkit is used to manage the signup wizard state.

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

Maintains signup-related state such as:

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

This reduces cognitive load and keeps each interaction focused.

---

## ✅ Validation & UX

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

Asynchronous operations provide visual feedback:

```text
Sending OTP...
Verifying OTP...
Completing signup...
```

Buttons are prevented from repeated submission while an operation is in progress.

### Error Handling

Errors are presented through field-level validation and global toast notifications.

Examples:

```text
Invalid email address
Please enter your name
Invalid OTP
```

Global feedback is handled through:

```text
ToastProvider.tsx
```

---

## 📱 Responsive Design

The interface is designed for:

* 📱 Mobile phones
* 📲 Tablets
* 💻 Laptops
* 🖥️ Desktop screens

Tailwind CSS is used to create responsive layouts and maintain consistent styling across viewport sizes.

---

## 🔎 SEO

The project includes Next.js metadata configuration for:

* Page title
* Description
* Keywords
* Open Graph metadata
* Twitter metadata
* Favicon
* Canonical URL
* Structured data
* Robots configuration
* Sitemap

The App Router automatically generates:

```text
/robots.txt
/sitemap.xml
```

through:

```text
src/app/robots.ts
src/app/sitemap.ts
```

---

## 🎉 Success Experience

After successfully completing the signup flow, the user is taken to a dedicated success state.

The success experience includes:

* Completion confirmation
* Visual feedback
* Confetti animation

The confetti animation is implemented using:

```text
canvas-confetti
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vjbravo123/Extroverts-Signup-Wizard.git
```

### 2. Navigate into the project

```bash
cd Extroverts-Signup-Wizard
```

### 3. Install dependencies

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

## 🏗️ Production Deployment

The application is deployed using Vercel.

### Live Application

**https://extroverts-signup-wizard-assignment.vercel.app/**

### GitHub Repository

**https://github.com/vjbravo123/Extroverts-Signup-Wizard**

For a Vercel deployment, configure the following environment variables in the project settings:

```text
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_SITE_URL
```

The production `NEXT_PUBLIC_SITE_URL` should be:

```text
https://extroverts-signup-wizard-assignment.vercel.app
```

---

## 🔒 Environment & Security

Sensitive credentials are kept outside the source code.

Never commit:

```text
.env.local
```

Especially:

```text
RESEND_API_KEY
```

Environment variables should be configured through the hosting provider for production deployments.

---

## 🎯 Assessment Goals

This project was built around the assessment requirements:

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

The goal was not only to reproduce the signup flow but also to make the experience consistent, responsive, accessible, and production-ready.

---

## 👨‍💻 Author

**Vivek Joshi**

Full Stack Developer

Built with React, Next.js, TypeScript, Redux Toolkit, Tailwind CSS, and Resend.

---

## 📄 License

This project was created as a front-end assessment/demo project.
