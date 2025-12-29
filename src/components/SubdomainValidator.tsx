import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTenant } from "../contexts/TenantContext";

interface SubdomainValidatorProps {
  children: React.ReactNode;
}

/**
 * SubdomainValidator Component
 *
 * Handles subdomain validation and redirects:
 * 1. No subdomain → redirect to /index
 * 2. Subdomain exists + valid config → render app (navigate to /login in App.tsx)
 * 3. Subdomain exists + config error (404) → redirect to http://localhost:3000
 */
export default function SubdomainValidator({
  children,
}: SubdomainValidatorProps) {
  const navigate = useNavigate();
  const { subdomain, loading, error, config } = useTenant();

  useEffect(() => {
    // If there's no subdomain, redirect to index page
    if (!subdomain && !loading) {
      navigate("/index", { replace: true });
      return;
    }

    // If there's a subdomain and an error occurred while fetching config (404)
    // redirect to root domain
    if (subdomain && error && !loading) {
      console.warn(
        `Subdomain "${subdomain}" not found (404), redirecting to root domain`
      );
      window.location.href = "http://localhost:3000";
    }

    // If there's a subdomain and config was successfully received
    // the app will render and Routes will handle navigation to /login
  }, [subdomain, error, loading, config, navigate]);

  // Show loading screen while fetching tenant config for subdomain
  if (subdomain && loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#f5f5f5",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>Loading configuration...</h2>
          <p>Please wait while we load your tenant configuration.</p>
        </div>
      </div>
    );
  }

  // If error occurred with subdomain, the effect above will redirect to root
  if (subdomain && error) {
    return null;
  }

  // If no subdomain, allow rendering (index page needs to show)
  // The effect will navigate to /index if not already there
  if (!subdomain && !loading) {
    return <>{children}</>;
  }

  // Subdomain exists and config is valid - render the app
  // Routes in App.tsx will handle navigation to /login
  return <>{children}</>;
}
