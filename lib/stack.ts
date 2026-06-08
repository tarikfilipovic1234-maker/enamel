import "server-only";
import { StackServerApp } from "@stackframe/stack";

// Neon Auth (powered by Stack Auth). Credentials come from the Neon console
// and are read from env: NEXT_PUBLIC_STACK_PROJECT_ID,
// NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY, STACK_SECRET_SERVER_KEY.
export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    afterSignIn: "/admin",
    afterSignUp: "/admin",
    afterSignOut: "/",
  },
});
