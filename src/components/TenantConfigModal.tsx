import { useState, useEffect } from "react";
import type {
  TenantConfig,
  Brand,
  UiTheme
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
  
  });

  const [activeTab, setActiveTab] = useState<
    "brand" | "theme" 
  >("brand");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (config) {
      setFormData({
        ...config,
        brand: config.brand || {},
        uiTheme: config.uiTheme || {}
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
                <select
  id="font-family"
  value={formData.brand?.fontFamily || "Inter, sans-serif"}
  onChange={(e) =>
    handleBrandChange("fontFamily", e.target.value)
  }
  disabled={submitting || loading}
>
  <option value="Inter, sans-serif">Inter</option>
  <option value="Roboto, sans-serif">Roboto</option>
  <option value="Poppins, sans-serif">Poppins</option>
  <option value="Montserrat, sans-serif">Montserrat</option>
  <option value="Open Sans, sans-serif">Open Sans</option>
  <option value="Lato, sans-serif">Lato</option>
  <option value="Nunito, sans-serif">Nunito</option>
  <option value="Work Sans, sans-serif">Work Sans</option>
  <option value="Source Sans Pro, sans-serif">Source Sans Pro</option>
  <option value="DM Sans, sans-serif">DM Sans</option>
  <option value="Manrope, sans-serif">Manrope</option>
  <option value="Public Sans, sans-serif">Public Sans</option>
</select>

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
