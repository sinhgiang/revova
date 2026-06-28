// Single source of truth for who the founder/admin is. Used by the /admin gate,
// the founder alert emails, and the sidebar link. To change the admin, update
// this default (or set the ADMIN_EMAIL env var).
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'tubxeebyajtube@gmail.com').toLowerCase()
