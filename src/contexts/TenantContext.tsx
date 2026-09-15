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

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_TENANT_CONFIG: TenantConfig = {
  brand: {
    name: "Default Brand",
    primaryColor: "#007c83",
    secondaryColor: "#102a43",
    fontFamily: "Aptos, Segoe UI, sans-serif",
  },
  uiTheme: {
    mode: "light",
    accentColor: "#007c83",
    layoutStyle: "comfortable",
    cornerStyle: "sharp",
  },
};

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

const isSafeColor = (value: string | undefined) =>
  Boolean(
    value &&
    (/^#[\da-f]{3,8}$/i.test(value) ||
      /^(rgb|rgba|hsl|hsla)\([\d\s%,.]+\)$/i.test(value)),
  );

const isSafeFontFamily = (value: string | undefined) =>
  Boolean(value && /^[\w\s,'"-]+$/.test(value));

const applyTenantConfig = (tenantConfig: TenantConfig) => {
  const root = document.documentElement;
  const brand = tenantConfig.brand;
  const uiTheme = tenantConfig.uiTheme;

  root.style.removeProperty("--theme-brand-primary");
  root.style.removeProperty("--theme-brand-secondary");
  root.style.removeProperty("--theme-ink");
  root.style.removeProperty("--theme-ink-strong");
  root.style.removeProperty("--theme-accent");
  root.style.removeProperty("--theme-accent-dark");
  root.style.removeProperty("--theme-font-family");

  const primaryColor = isSafeColor(brand?.primaryColor)
    ? brand?.primaryColor
    : undefined;
  const secondaryColor = isSafeColor(brand?.secondaryColor)
    ? brand?.secondaryColor
    : undefined;
  const accentColor =
    primaryColor ||
    (isSafeColor(uiTheme?.accentColor) ? uiTheme?.accentColor : undefined);

  if (primaryColor)
    root.style.setProperty("--theme-brand-primary", primaryColor);
  if (secondaryColor) {
    root.style.setProperty("--theme-brand-secondary", secondaryColor);
    root.style.setProperty("--theme-ink", secondaryColor);
    root.style.setProperty("--theme-ink-strong", secondaryColor);
  }
  if (accentColor) {
    root.style.setProperty("--theme-accent", accentColor);
    root.style.setProperty("--theme-accent-dark", accentColor);
  }
  if (isSafeFontFamily(brand?.fontFamily)) {
    root.style.setProperty("--theme-font-family", brand?.fontFamily || "");
  }

  root.dataset.themeMode = (uiTheme?.mode || "light").toLowerCase();
  root.dataset.layoutStyle = uiTheme?.layoutStyle || "comfortable";
  root.dataset.cornerStyle = uiTheme?.cornerStyle || "sharp";

  if (brand?.name) {
    document.title = brand.name;
  }

  if (brand?.faviconUrl) {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) favicon.href = brand.faviconUrl;
  }
};

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const [config, setConfigState] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);

  const setConfig = (nextConfig: TenantConfig) => {
    setConfigState(nextConfig);
    if (subdomain) {
      applyTenantConfig(nextConfig);
    }
    sessionStorage.setItem("tenantConfig", JSON.stringify(nextConfig));
  };

  useEffect(() => {
    if (subdomain && config) {
      applyTenantConfig(config);
    }
  }, [config, subdomain]);

  const fetchConfigBySubdomain = async (
    subDomain: string,
  ): Promise<TenantConfig> => {
    try {
      setLoading(true);
      setError(null);
      const tenantConfig =
        await tenantConfigService.getConfigBySubDomain(subDomain);
      setConfig(tenantConfig);
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
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "status" in err.response &&
          err.response.status === 404
        ) {
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
