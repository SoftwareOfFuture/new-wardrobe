/**
 * Admin panel URL prefix — single source of truth.
 *
 * To change the admin path:
 *  1. Rename  src/app/<current>  →  src/app/<new>
 *  2. Set     NEXT_PUBLIC_ADMIN_PATH=<new>  in .env  (and Vercel env vars)
 *  3. Done — no other file needs touching.
 */
export const ADMIN_PATH =
  process.env.NEXT_PUBLIC_ADMIN_PATH ?? "nfjmmn9wxzdf";
