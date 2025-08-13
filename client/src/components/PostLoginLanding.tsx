import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";

export function PostLoginLanding() {
  // Always show the main landing page for all authenticated users
  // This provides a unified experience across all applications and user types
  return <Landing />;
}