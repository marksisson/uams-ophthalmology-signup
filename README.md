# UAMS Ophthalmology Interest Group Signup

A professional Next.js landing page with:

- Name and email signup
- Persistent Supabase/Postgres storage via the server-side REST API
- Duplicate-email handling
- Server-side validation, honeypot spam field, and basic rate limiting
- Password-protected `/admin` page
- CSV export
- Responsive mobile design

## 1. Create the database

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `supabase/schema.sql`.
4. In **Project Settings → API**, copy the project URL and the server-side service-role/secret key.

Never expose the service-role key in browser code or commit it to Git.

## 2. Configure locally

```bash
cp .env.example .env.local
```

Fill in:

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=...
```

Use an admin password of at least 12 characters.

## 3. Run

```bash
npm install
npm run dev
```

Open:

- Landing page: `http://localhost:3000`
- Signup administration: `http://localhost:3000/admin`

## 4. Deploy

The easiest deployment is Vercel:

1. Push this folder to a Git repository.
2. Import the repository into Vercel.
3. Add the three environment variables under Project Settings → Environment Variables.
4. Deploy.

## Security notes

- All database access happens in server Route Handlers.
- The Supabase service-role key is never sent to visitors.
- Row Level Security is enabled with no public table policy.
- The included admin password is suitable for a small student-group list, but institutional use should replace it with real authentication such as UAMS Microsoft/Entra SSO.
- Do not collect sensitive health or educational records through this form.

## Branding note

The project uses an original abstract eye mark rather than the official UAMS logo. Obtain approval before adding official UAMS marks or implying institutional endorsement.
