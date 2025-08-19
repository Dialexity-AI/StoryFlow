# StoryFlow - Setup Instructions

## Prerequisites
- Node.js 18+
- npm or pnpm
- (Optional) PostgreSQL 14+
- (Optional) Stripe account

## Install
```
npm install
```

## Env
Create `.env` from `.env.example` and fill:
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`
- `DATABASE_URL` (optional; if absent, API falls back to in-memory storage)

## Prisma (optional DB)
```
npx prisma generate
npx prisma db push
```

## Dev
```
npm run dev
```

## Premium (Stripe)
- With env set, `/api/checkout` creates a Checkout Session, redirects to Stripe
- Success URL: `/billing/success`, Cancel URL: `/billing/cancel`
- Billing portal available via button on `/billing`

## Notes
- Without `DATABASE_URL`, stories/ratings live in memory and reset on reload
- Auth is stubbed; Google OAuth/JWT planned next
