import * as React from "react";

/**
 * Next.js (App Router) injects a React canary that ships <ViewTransition>.
 * The export name has shifted between `ViewTransition` and
 * `unstable_ViewTransition`, and the installed stable types don't declare
 * either — so resolve it defensively and degrade to a pass-through wrapper
 * when unavailable (e.g. unsupported browsers / older React).
 */
type AnyProps = Record<string, unknown> & { children?: React.ReactNode };

const ReactAny = React as unknown as Record<string, unknown>;

const Resolved =
  (ReactAny["unstable_ViewTransition"] as React.FC<AnyProps> | undefined) ??
  (ReactAny["ViewTransition"] as React.FC<AnyProps> | undefined);

export const ViewTransition: React.FC<AnyProps> =
  Resolved ?? (({ children }: AnyProps) => <>{children}</>);
