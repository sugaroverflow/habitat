# Supabase setup

The initial migration is production-shaped but intentionally locked down. Row
level security is enabled and no anonymous policies are created yet. The app
therefore uses the validated local seed until explicit read policies
are reviewed and applied.

1. Create a Supabase project.
2. Run the migration in `migrations/`.
3. Copy `.env.example` to `.env.local` and add the project values.
4. Add only sanitized assets to a private `habitat-assets` bucket.
5. Create narrowly scoped read policies after checking every public query.

Never add an address-like field, raw conversation content, raw upload path, or
original asset filename. Redaction records record only the category and fact of
redaction, never the removed value.
