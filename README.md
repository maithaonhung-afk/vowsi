# VOWSI MVP
VOWSI — Find Your Person, Anywhere.

Starter global dating web app: real signup/login, 18+ gate, profiles, worldwide discovery, mutual likes/matches, chat, block/report backend, PostgreSQL.

## Start
1. Install Node.js 20+ and PostgreSQL (or use a hosted PostgreSQL database).
2. Copy `.env.example` to `.env`.
3. Fill `DATABASE_URL`, a long random `JWT_SECRET`, and your `ADMIN_EMAIL`.
4. Run `npm install` then `npm start`.
5. Open http://localhost:3000

## Before a public launch
This is an MVP starter, not yet a production dating service. Add verified email + password reset, real photo upload/storage and moderation, Privacy Policy/Terms/Community Guidelines, account deletion/export, stronger abuse/spam defenses, admin MFA, audit logs, backups/monitoring, and country-specific privacy/legal review. Do not seed fake profiles, fake matches, fake messages, or fake testimonials.


## V2.6 notes
- Added 12-language core interface selector (English, Vietnamese, Spanish, French, German, Portuguese, Italian, Arabic, Chinese, Japanese, Korean, Hindi).
- City autocomplete now loads broad country city lists through the CountriesNow public API, cached server-side for 24 hours, with local fallback and free-text entry if the service is unavailable.
- Unmatched pairs are suppressed in both directions from Discover.
- Matches cards were redesigned for readability; text no longer overlays photos.
- Empty Messages state now hides the composer after a match/conversation disappears.
- Report submissions are persisted in the existing reports database table.

## V2.6.1 Global UX
- 25 interface languages with browser-language detection and saved preference.
- Expanded Vietnamese, Thai and Filipino onboarding/navigation translations.
- Country-aware city autocomplete: curated city fallback plus query-based OpenStreetMap/Nominatim search; administrative-region labels are filtered from city suggestions.
- Greece fallback expanded with major cities including Thessaloniki, Patras, Piraeus, Heraklion, Larissa and more.
