import "server-only";
import { redirect } from "next/navigation";
import { stackServerApp } from "./stack";

function adminAllowlist() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Gate for the admin dashboard. Redirects to sign-in when logged out, and to
 * the public site when the signed-in user isn't on the admin allowlist.
 * If ADMIN_EMAILS is unset, any authenticated user is allowed (dev convenience).
 */
export async function requireAdmin() {
  const user = await stackServerApp.getUser({ or: "redirect" });

  const allow = adminAllowlist();
  if (allow.length > 0) {
    const email = user.primaryEmail?.toLowerCase();
    if (!email || !allow.includes(email)) {
      redirect("/");
    }
  }
  return user;
}
