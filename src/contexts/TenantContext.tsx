import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { TenantConfig } from "../types";
import { tenantConfigService } from "../services/api";

/* ================= TYPES ================= */

interface TenantContextType {
  config: TenantConfig | null;
  loading: boolean;
  error: string | null;
  subdomain: string | null;
  setConfig: (config: TenantConfig) => void;
  fetchConfigBySubdomain: (subdomain: string) => Promise<TenantConfig>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

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

/* ================= SUBDOMAIN DETECTION ================= */

const extractSubdomainFromHost = (): string | null => {
  const hostname = window.location.hostname;

  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    if (parts.length > 1 && parts[0] !== "localhost") {
      return parts[0];
    }
    return null;
  }

  const parts = hostname.split(".");
  if (parts.length > 2) {
    return parts[0];
  }

  return null;
};

/* ================= THEME + LOCALIZATION APPLICATION ================= */

const applyThemeAndLocalization = (config: TenantConfig) => {
  if (!config) return;

  const root = document.documentElement;

  /* ---------- Brand Colors ---------- */
  if (config.brand?.primaryColor) {
    root.style.setProperty("--primary-color", config.brand.primaryColor);
  }

  if (config.brand?.secondaryColor) {
    root.style.setProperty("--secondary-color", config.brand.secondaryColor);
  }

  if (config.uiTheme?.accentColor) {
    root.style.setProperty("--accent-color", config.uiTheme.accentColor);
  }

  /* ---------- Dynamic Google Font ---------- */
  if (config.brand?.fontFamily) {
    const fontFamily = config.brand.fontFamily;
    document.body.style.fontFamily = fontFamily;

    const fontName = fontFamily
      .split(",")[0]
      .replace(/'/g, "")
      .trim();

    const linkId = "tenant-dynamic-font";
    const existing = document.getElementById(linkId);
    if (existing) existing.remove();

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      / /g,
      "+"
    )}:wght@300;400;500;600;700&display=swap`;

    document.head.appendChild(link);
  }

  /* ---------- Dark Mode ---------- */
  if (config.uiTheme?.mode === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  /* ---------- Favicon ---------- */
  if (config.brand?.faviconUrl) {
    let favicon = document.querySelector(
      "link[rel='icon']"
    ) as HTMLLinkElement | null;

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    favicon.href = config.brand.faviconUrl;
  }

  /* ---------- Page Title ---------- */
  if (config.brand?.name) {
    document.title = config.brand.name;
  }

  /* ================= LOCALIZATION ================= */

  const localization = config.localization;

  if (localization) {
    if (localization.language) {
      document.documentElement.lang = localization.language;
    }

    if (localization.currency) {
      root.style.setProperty("--currency", localization.currency);
    }

    if (localization.dateFormat) {
      root.style.setProperty("--date-format", localization.dateFormat);
    }

    if (localization.timezone) {
      root.style.setProperty("--timezone", localization.timezone);
    }
  }
};

/* ================= PROVIDER ================= */

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const [config, setConfigState] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);

  const setConfig = (newConfig: TenantConfig) => {
    setConfigState(newConfig);
    applyThemeAndLocalization(newConfig);
    sessionStorage.setItem("tenantConfig", JSON.stringify(newConfig));
  };

  const fetchConfigBySubdomain = async (
    subDomain: string
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

  /* ================= INITIALIZATION ================= */

  useEffect(() => {
    const initializeTenant = async () => {
      try {
        const detectedSubdomain = extractSubdomainFromHost();
        setSubdomain(detectedSubdomain);

        if (detectedSubdomain) {
          await fetchConfigBySubdomain(detectedSubdomain);
        } else {
          const saved = sessionStorage.getItem("tenantConfig");
          if (saved) {
            const parsed = JSON.parse(saved);
            setConfig(parsed);
          }
          setLoading(false);
        }
      } catch {
        setError("Tenant configuration not found");
        setLoading(false);
      }
    };

    initializeTenant();
  }, []);

  useEffect(() => {
    if (config) {
      applyThemeAndLocalization(config);
    }
  }, [config]);

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
