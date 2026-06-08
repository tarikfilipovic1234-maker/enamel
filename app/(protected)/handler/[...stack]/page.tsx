import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

// Neon Auth (Stack) renders all auth flows (sign-in, sign-up, account, etc.)
// under /handler/*.
export default function Handler(props: unknown) {
  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}
