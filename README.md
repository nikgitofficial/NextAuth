# 🔐 AuthSystem — Full-Stack Auth with Next.js 15

A production-ready authentication system with a modern 2026 design aesthetic.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | NextAuth v5 (beta) |
| Email | Resend |
| Styling | Tailwind CSS v3 |
| Validation | Zod + React Hook Form |
| Password Hashing | bcryptjs |

## Features

- ✅ **Register** — with name, email, password + confirm, password strength indicator
- ✅ **Login** — credentials-based with JWT session
- ✅ **Forgot Password** — sends 6-digit OTP via Resend
- ✅ **OTP Verification** — auto-submit, paste support, 60s resend cooldown, 5 max attempts
- ✅ **Reset Password** — validates OTP again server-side before saving
- ✅ **Protected Routes** — via Next.js middleware
- ✅ **Dashboard** — session-aware server component
- ✅ **Welcome Email** — sent on registration via Resend
- ✅ **Rate Limiting** — max 3 OTP requests per hour per email
- ✅ **TTL Index** — MongoDB auto-deletes expired OTPs
- ✅ **Email Enumeration Protection** — always returns same message for forgot password

## Getting Started

### 1. Clone & install

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

MONGODB_URI=mongodb+srv://...

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

NEXT_PUBLIC_APP_NAME=AuthSystem
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/               # Auth pages (redirect if logged in)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── verify-otp/
│   │   └── reset-password/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/ # NextAuth handler
│   │   │   └── register/      # POST — create account
│   │   ├── forgot-password/   # POST — send OTP
│   │   ├── verify-otp/        # POST — check OTP
│   │   └── reset-password/    # POST — update password
│   └── dashboard/             # Protected page
├── components/
│   ├── ui/
│   │   ├── AuthCard.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── OTPInput.tsx
│   │   └── PasswordStrength.tsx
│   ├── SessionProvider.tsx
│   └── SignOutButton.tsx
├── lib/
│   ├── auth.ts                # NextAuth config
│   ├── db.ts                  # MongoDB connection
│   ├── email.ts               # Resend email helpers
│   ├── utils.ts               # OTP generation, cn(), etc.
│   └── validations.ts         # Zod schemas
├── models/
│   ├── User.ts
│   └── OTP.ts
├── types/
│   └── next-auth.d.ts
└── middleware.ts              # Route protection
```

## Security Considerations

- Passwords hashed with bcrypt (cost factor 12)
- OTPs hashed with bcrypt (cost factor 10)
- Rate limiting on OTP generation (3/hour)
- Max 5 OTP verification attempts before invalidation
- OTPs expire after 15 minutes (MongoDB TTL)
- Email enumeration protection on forgot-password
- JWT sessions (httpOnly, 30-day max age)
- Zod validation on all API endpoints
- Same-password rejection on reset

## Deployment

Works on Vercel, Railway, Render, or any Node.js host.

Make sure to:
1. Add all environment variables in your host's dashboard
2. Ensure MongoDB Atlas IP allowlist includes `0.0.0.0/0` or your server IP
3. Verify your Resend sending domain
