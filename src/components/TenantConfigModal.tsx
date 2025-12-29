import { useState, useEffect } from "react";
import type {
  TenantConfig,
  Brand,
  UiTheme,
  Localization,
  Features,
} from "../types";
import "../styles/Modal.css";

interface TenantConfigModalProps {
  isOpen: boolean;
  config: TenantConfig | null;
  onClose: () => void;
  onSubmit: (config: TenantConfig) => Promise<void>;
  loading?: boolean;
}

const TenantConfigModal = ({
  isOpen,
  config,
  onClose,
  onSubmit,
  loading = false,
}: TenantConfigModalProps) => {
  const [formData, setFormData] = useState<TenantConfig>({
    brand: {},
    uiTheme: {},
    localization: {},
    features: {},
  });

  const [activeTab, setActiveTab] = useState<
    "brand" | "theme" | "localization" | "features"
  >("brand");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (config) {
      setFormData({
        ...config,
        brand: config.brand || {},
        uiTheme: config.uiTheme || {},
        localization: config.localization || {},
        features: config.features || {},
      });
      setActiveTab("brand");
    }
  }, [config, isOpen]);

  const handleBrandChange = (field: keyof Brand, value: string) => {
    setFormData((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        [field]: value,
      },
    }));
  };

  const handleThemeChange = (field: keyof UiTheme, value: string) => {
    setFormData((prev) => ({
      ...prev,
      uiTheme: {
        ...prev.uiTheme,
        [field]: value,
      },
    }));
  };

  const handleLocalizationChange = (
    field: keyof Localization,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      localization: {
        ...prev.localization,
        [field]: value,
      },
    }));
  };

  const handleFeaturesChange = (field: keyof Features, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update configuration";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Tenant Configuration</h2>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={submitting || loading}
          >
            ✕
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="modal-tabs">
          <button
            className={`tab-button ${activeTab === "brand" ? "active" : ""}`}
            onClick={() => setActiveTab("brand")}
            disabled={submitting || loading}
          >
            Brand
          </button>
          <button
            className={`tab-button ${activeTab === "theme" ? "active" : ""}`}
            onClick={() => setActiveTab("theme")}
            disabled={submitting || loading}
          >
            Theme
          </button>
          <button
            className={`tab-button ${
              activeTab === "localization" ? "active" : ""
            }`}
            onClick={() => setActiveTab("localization")}
            disabled={submitting || loading}
          >
            Localization
          </button>
          <button
            className={`tab-button ${activeTab === "features" ? "active" : ""}`}
            onClick={() => setActiveTab("features")}
            disabled={submitting || loading}
          >
            Features
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Brand Tab */}
          {activeTab === "brand" && (
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="brand-name">Brand Name</label>
                <input
                  id="brand-name"
                  type="text"
                  value={formData.brand?.name || ""}
                  onChange={(e) => handleBrandChange("name", e.target.value)}
                  disabled={submitting || loading}
                  placeholder="Enter brand name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="logo-url">Logo URL</label>
                <input
                  id="logo-url"
                  type="text"
                  value={formData.brand?.logoUrl || ""}
                  onChange={(e) => handleBrandChange("logoUrl", e.target.value)}
                  disabled={submitting || loading}
                  placeholder="Enter logo URL"
                />
              </div>

              <div className="form-group">
                <label htmlFor="favicon-url">Favicon URL</label>
                <input
                  id="favicon-url"
                  type="text"
                  value={formData.brand?.faviconUrl || ""}
                  onChange={(e) =>
                    handleBrandChange("faviconUrl", e.target.value)
                  }
                  disabled={submitting || loading}
                  placeholder="Enter favicon URL"
                />
              </div>

              <div className="form-group">
                <label htmlFor="banner-url">Banner URL</label>
                <input
                  id="banner-url"
                  type="text"
                  value={formData.brand?.bannerUrl || ""}
                  onChange={(e) =>
                    handleBrandChange("bannerUrl", e.target.value)
                  }
                  disabled={submitting || loading}
                  placeholder="Enter banner URL"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="primary-color">Primary Color</label>
                  <div className="color-input-wrapper">
                    <input
                      id="primary-color"
                      type="color"
                      value={formData.brand?.primaryColor || "#1976d2"}
                      onChange={(e) =>
                        handleBrandChange("primaryColor", e.target.value)
                      }
                      disabled={submitting || loading}
                    />
                    <input
                      type="text"
                      value={formData.brand?.primaryColor || "#1976d2"}
                      onChange={(e) =>
                        handleBrandChange("primaryColor", e.target.value)
                      }
                      disabled={submitting || loading}
                      placeholder="#1976d2"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="secondary-color">Secondary Color</label>
                  <div className="color-input-wrapper">
                    <input
                      id="secondary-color"
                      type="color"
                      value={formData.brand?.secondaryColor || "#dc004e"}
                      onChange={(e) =>
                        handleBrandChange("secondaryColor", e.target.value)
                      }
                      disabled={submitting || loading}
                    />
                    <input
                      type="text"
                      value={formData.brand?.secondaryColor || "#dc004e"}
                      onChange={(e) =>
                        handleBrandChange("secondaryColor", e.target.value)
                      }
                      disabled={submitting || loading}
                      placeholder="#dc004e"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="font-family">Font Family</label>
                <input
                  id="font-family"
                  type="text"
                  value={formData.brand?.fontFamily || ""}
                  onChange={(e) =>
                    handleBrandChange("fontFamily", e.target.value)
                  }
                  disabled={submitting || loading}
                  placeholder="e.g., Roboto, sans-serif"
                />
              </div>
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === "theme" && (
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="theme-mode">Theme Mode</label>
                <select
                  id="theme-mode"
                  value={formData.uiTheme?.mode || "light"}
                  onChange={(e) => handleThemeChange("mode", e.target.value)}
                  disabled={submitting || loading}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="accent-color">Accent Color</label>
                <div className="color-input-wrapper">
                  <input
                    id="accent-color"
                    type="color"
                    value={formData.uiTheme?.accentColor || "#f50057"}
                    onChange={(e) =>
                      handleThemeChange("accentColor", e.target.value)
                    }
                    disabled={submitting || loading}
                  />
                  <input
                    type="text"
                    value={formData.uiTheme?.accentColor || "#f50057"}
                    onChange={(e) =>
                      handleThemeChange("accentColor", e.target.value)
                    }
                    disabled={submitting || loading}
                    placeholder="#f50057"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="layout-style">Layout Style</label>
                <select
                  id="layout-style"
                  value={formData.uiTheme?.layoutStyle || "comfortable"}
                  onChange={(e) =>
                    handleThemeChange("layoutStyle", e.target.value)
                  }
                  disabled={submitting || loading}
                >
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="corner-style">Corner Style</label>
                <select
                  id="corner-style"
                  value={formData.uiTheme?.cornerStyle || "rounded"}
                  onChange={(e) =>
                    handleThemeChange("cornerStyle", e.target.value)
                  }
                  disabled={submitting || loading}
                >
                  <option value="rounded">Rounded</option>
                  <option value="sharp">Sharp</option>
                  <option value="smooth">Smooth</option>
                </select>
              </div>
            </div>
          )}

          {/* Localization Tab */}
          {activeTab === "localization" && (
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="language">Language</label>
                <input
                  id="language"
                  type="text"
                  value={formData.localization?.language || ""}
                  onChange={(e) =>
                    handleLocalizationChange("language", e.target.value)
                  }
                  disabled={submitting || loading}
                  placeholder="e.g., en, es, fr"
                />
              </div>

              <div className="form-group">
                <label htmlFor="timezone">Timezone</label>
                <input
                  id="timezone"
                  type="text"
                  value={formData.localization?.timezone || ""}
                  onChange={(e) =>
                    handleLocalizationChange("timezone", e.target.value)
                  }
                  disabled={submitting || loading}
                  placeholder="e.g., America/New_York, UTC"
                />
              </div>

              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <input
                  id="currency"
                  type="text"
                  value={formData.localization?.currency || ""}
                  onChange={(e) =>
                    handleLocalizationChange("currency", e.target.value)
                  }
                  disabled={submitting || loading}
                  placeholder="e.g., USD, EUR, GBP"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date-format">Date Format</label>
                <input
                  id="date-format"
                  type="text"
                  value={formData.localization?.dateFormat || ""}
                  onChange={(e) =>
                    handleLocalizationChange("dateFormat", e.target.value)
                  }
                  disabled={submitting || loading}
                  placeholder="e.g., MM/DD/YYYY, DD/MM/YYYY"
                />
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === "features" && (
            <div className="form-section">
              <div className="form-group checkbox-group">
                <label htmlFor="inventory-module">
                  <input
                    id="inventory-module"
                    type="checkbox"
                    checked={formData.features?.inventoryModule || false}
                    onChange={(e) =>
                      handleFeaturesChange("inventoryModule", e.target.checked)
                    }
                    disabled={submitting || loading}
                  />
                  <span>Inventory Module</span>
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label htmlFor="reporting-module">
                  <input
                    id="reporting-module"
                    type="checkbox"
                    checked={formData.features?.reportingModule || false}
                    onChange={(e) =>
                      handleFeaturesChange("reportingModule", e.target.checked)
                    }
                    disabled={submitting || loading}
                  />
                  <span>Reporting Module</span>
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label htmlFor="supplier-management">
                  <input
                    id="supplier-management"
                    type="checkbox"
                    checked={formData.features?.supplierManagement || false}
                    onChange={(e) =>
                      handleFeaturesChange(
                        "supplierManagement",
                        e.target.checked
                      )
                    }
                    disabled={submitting || loading}
                  />
                  <span>Supplier Management</span>
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label htmlFor="advanced-pricing">
                  <input
                    id="advanced-pricing"
                    type="checkbox"
                    checked={formData.features?.advancedPricing || false}
                    onChange={(e) =>
                      handleFeaturesChange("advancedPricing", e.target.checked)
                    }
                    disabled={submitting || loading}
                  />
                  <span>Advanced Pricing</span>
                </label>
              </div>
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={submitting || loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || loading}
            >
              {submitting || loading ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantConfigModal;
