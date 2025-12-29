import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { TenantConfig } from "../types";
import { tenantConfigService } from "../services/api";

interface TenantContextType {
  config: TenantConfig | null;
  loading: boolean;
  error: string | null;
  subdomain: string | null;
  setConfig: (config: TenantConfig) => void;
  fetchConfigBySubdomain: (subdomain: string) => Promise<TenantConfig>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

/**
 * Extracts subdomain from current hostname
 * Examples:
 *   - "acme.localhost" returns "acme"
 *   - "acme.example.com" returns "acme"
 *   - "localhost" returns null (root/default domain)
 */
const extractSubdomainFromHost = (): string | null => {
  const hostname = window.location.hostname;

  // Handle localhost with subdomain (e.g., "acme.localhost")
  if (hostname.includes("localhost")) {
    console.log(hostname);
    const parts = hostname.split(".");
    if (parts.length > 1 && parts[0] !== "localhost") {
      return parts[0];
    }
    return null;
  }

  // Handle other domains (e.g., "acme.example.com")
  const parts = hostname.split(".");
  if (parts.length > 2) {
    return parts[0];
  }

  return null;
};

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);

  const fetchConfigBySubdomain = async (
    subDomain: string
  ): Promise<TenantConfig> => {
    try {
      setLoading(true);
      setError(null);
      const tenantConfig = await tenantConfigService.getConfigBySubDomain(
        subDomain
      );
      setConfig(tenantConfig);
      // Store in sessionStorage for use across page reloads during same session
      sessionStorage.setItem("tenantConfig", JSON.stringify(tenantConfig));
      return tenantConfig;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch tenant config";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize tenant config on mount
  useEffect(() => {
    const initializeTenant = async () => {
      try {
        const detectedSubdomain = extractSubdomainFromHost();
        setSubdomain(detectedSubdomain);

        // If subdomain exists, fetch its config
        if (detectedSubdomain) {
          await fetchConfigBySubdomain(detectedSubdomain);
        } else {
          // Default domain - no specific config needed yet
          setLoading(false);
        }
      } catch (err: unknown) {
        // 404 is expected when subdomain doesn't exist - don't log as error
        if (err && typeof err === 'object' && 'response' in err && 
            err.response && typeof err.response === 'object' && 'status' in err.response && 
            err.response.status === 404) {
          setError("Subdomain not found");
        } else {
          console.error("Failed to initialize tenant config:", err);
          setError("Invalid subdomain - configuration not found");
        }
        setLoading(false);
      }
    };

    initializeTenant();
  }, []);

  return (
    <TenantContext.Provider
      value={{
        config,
        loading,
        error,
        subdomain,
        setConfig,
        fetchConfigBySubdomain,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};
