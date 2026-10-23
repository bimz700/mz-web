# BIMZ — Digital Portfolio

Portfolio & CMS personal dengan React, TypeScript, Supabase, dan Tailwind CSS.

## Stack

- **Frontend**: React 18 + TypeScript + Vite 5
- **Styling**: Tailwind CSS 3 + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm run dev
```

## Supabase Setup

### 1. Create Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Copy the project URL and anon key from Settings → API

### 2. Run Migrations

Execute the SQL migrations in the Supabase SQL Editor in order:

1. `supabase/migrations/0001_core_schema.sql` — Creates all tables
2. `supabase/migrations/0002_rls_policies.sql` — Sets up Row Level Security
3. `supabase/migrations/0003_seed_content.sql` — Adds placeholder content

### 3. Create Admin User

1. Go to Authentication → Users in Supabase dashboard
2. Create a new user with email/password
3. Run this SQL to grant admin role:

```sql
INSERT INTO public.profiles (id, role, display_name)
VALUES (
  'USER_ID_FROM_AUTH',  -- Replace with actual user ID
  'admin',
  'Admin'
);
```

### 4. Configure Storage (Optional)

1. Go to Storage in Supabase dashboard
2. Create a bucket named `media`
3. Set it to public if you want images publicly accessible

### 5. Email Notifications (Optional)

1. Deploy the edge function:
   ```bash
   supabase functions deploy send-contact-email
   ```
2. Set secrets for Resend:
   ```bash
   supabase secrets set RESEND_API_KEY=your_key
   supabase secrets set CONTACT_NOTIFY_EMAIL=your_email
   supabase secrets set CONTACT_FROM_EMAIL=noreply@yourdomain.com
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin dashboard components
│   ├── common/         # Shared components (SEO, states, etc.)
│   └── layout/         # Layout components (Navigation, Footer)
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and data layer
│   ├── data/           # Repository functions
│   ├── auth.ts         # Auth helpers
│   ├── motion.ts       # Animation config
│   ├── supabase.ts     # Supabase client
│   └── types.ts        # TypeScript types
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   └── ...
└── main.tsx            # App entry point

supabase/
├── migrations/         # Database migrations
└── functions/          # Edge functions
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## Demo Mode

Without Supabase credentials, the site runs in **demo mode**:

- Shows placeholder data from `src/lib/demo-data.ts`
- All write operations are disabled with clear error messages
- A banner indicates demo mode is active

This is intentional — the app never fakes successful writes or authentication.

## Security Notes

- **Row Level Security** is enabled on all tables
- Public users can only read published content
- Only admins can create, update, or delete content
- Contact submissions are private (admin-only)
- Media uploads require admin authentication
- The `log_audit` function is server-side only — clients cannot call it

## Known Limitations

1. **No password reset flow** — depends on Supabase built-in, not custom UI
2. **No real email sending** without configuring the edge function
3. **No image optimization** — images stored as-is in Supabase Storage
4. **No sitemap generation** — would need a build-time script
5. **Draft preview** — admins see drafts in the list, but no separate preview URL

## License

MIT — feel free to use this as a starting point for your own portfolio.
