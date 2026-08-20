# LMS schema (shared Supabase)

Recorded courses live in `lms_*` tables. They are **not** live `programs` / `participants`.

## Apply

1. Run [`migrations/20260818100000_create_lms_schema.sql`](migrations/20260818100000_create_lms_schema.sql) in the Supabase SQL editor, **or** copy it into `digica-finance-dashboard/supabase/migrations/` (that repo owns this project’s migrations) and migrate.
2. Run [`migrations/20260818101000_seed_lms_courses.sql`](migrations/20260818101000_seed_lms_courses.sql).
3. Run admin RLS migration from `digica-finance-dashboard/supabase/migrations/20260820100000_admin_rls_and_profiles.sql` (locks finance tables to `app_metadata.role = admin`; creates `profiles` for LMS students).

## Grant access (no self-serve checkout yet)

```sql
insert into public.lms_entitlements (user_id, course_id, status)
values (
  '<auth.users id>',
  '11111111-1111-4111-8111-111111111001', -- data-analyst-python
  'active'
)
on conflict (user_id, course_id) do update set status = 'active';
```

## Admin access (manual, one-time per team member)

In Supabase Dashboard → Authentication → Users → select the account → **App Metadata**:

```json
{ "role": "admin" }
```

Only promote Digica team accounts. LMS student signups must **not** receive this metadata.

## Production auth email (required)

The built-in Supabase sender (`mail.app.supabase.io`) is **not for production**. It allows about **2 emails per hour** for the whole project. Signup confirmation and password reset both count. Without custom SMTP, real users will hit `email rate limit exceeded`.

Do this in the **same Supabase project** the LMS uses (often owned by `digica-finance-dashboard`):

1. Create an account at a transactional provider (Resend, SendGrid, Postmark, AWS SES, or similar). Verify a Digica sending domain and SPF/DKIM/DMARC.
2. In the dashboard: **Authentication → Emails → SMTP Settings**. Enable custom SMTP and set host, port, user, password, sender name, and From address (for example `no-reply@digica-academy.web.id`).
3. **Authentication → Rate Limits**: raise the email send limit after SMTP is on (Supabase starts around 30/hour as a safety cap; set this to match expected signup + reset volume).
4. **Authentication → URL Configuration**: allow `https://digica-academy.web.id/auth/callback` (and local origin for testing).
5. Send a test signup and a test password reset to a non-team inbox and confirm the mail is from your domain.

Do not send marketing from the same From address or domain as Auth mail.

## Public program registration (LMS)

Canonical URL: `/r/{public_slug-or-code}`

- Legacy alias: `/programs/{identifier}` → redirects to `/r/...`
- API: `GET` / `POST` `/api/registration/{identifier}`

## Public program check-in (LMS)

Canonical URL: `/c/{public_slug-or-code}`

- Legacy alias: `/check-in/{identifier}` → redirects to `/c/...`
- API: `GET` / `POST` `/api/check-in/{identifier}`

Writes existing `attendance` and (workshops) `participants.secure_seat_interest`.
Point admin `NEXT_PUBLIC_PUBLIC_APP_URL` at the LMS origin
(`https://digica-academy.web.id`, or `http://localhost:8000` locally)
so copied registration/check-in links open here.

## Deferred

- Admin UI for courses / modules / lessons
- Payments / self-serve enrollment
- Lesson progress in the database (still localStorage)
- Hosting video files (store `video_url` only; do not use Supabase Storage)
- Turning `COURSES_ENABLED` on for the public landing
