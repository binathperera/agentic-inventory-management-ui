import { useState, useEffect } from "react";
import { tenantConfigService } from "../services/api";
import type { TenantConfig } from "../types";
import Navigation from "../components/Navigation";
import TenantConfigModal from "../components/TenantConfigModal";
import { Building2 } from "lucide-react";
import "../styles/Suppliers.css";
import "../styles/TenantSettings.css";

const TenantSettings = () => {
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await tenantConfigService.getTenantConfig();
      setConfig(data);
      setError("");
    } catch (err: unknown) {
      // Handle 400 or 404 as config not found - this is expected for new tenants
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 400 || error.response?.status === 404) {
        setConfig(null);
        setError("");
      } else {
        const message =
          err instanceof Error ? err.message : "Failed to load configuration";
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditConfig = () => {
    setShowModal(true);
  };

  const handleUpdateConfig = async (updatedConfig: TenantConfig) => {
    try {
      const result = await tenantConfigService.updateTenantConfig(
        updatedConfig
      );
      setConfig(result);
      setSuccessMessage("Configuration updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setError("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update configuration";
      setError(message);
      throw err;
    }
  };

  const handleInitializeConfig = async () => {
    if (
      !window.confirm(
        "Are you sure you want to initialize the default configuration? This may overwrite existing settings."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const result = await tenantConfigService.initializeTenantConfig();
      setConfig(result);
      setSuccessMessage("Configuration initialized successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setError("");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      let message = "Failed to initialize configuration";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-with-nav">
      <Navigation />
      <div className="page-content">
        <div className="page-header">
          <h1>Tenant Configuration</h1>
        </div>

        <div className="content-wrapper">
          {error && <div className="error-message">{error}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {loading ? (
            <div className="loading">Loading configuration...</div>
          ) : config ? (
            <div className="config-display">
              <div className="config-card">
                <h3>Brand Settings</h3>
                <div className="config-section">
                  <div className="config-row">
                    <label>Name:</label>
                    <span>{config.brand?.name || "Not set"}</span>
                  </div>
                  <div className="config-row">
                    <label>Primary Color:</label>
                    <div className="color-display">
                      <div
                        className="color-box"
                        style={{
                          backgroundColor:
                            config.brand?.primaryColor || "#1976d2",
                        }}
                      />
                      <span>{config.brand?.primaryColor || "Not set"}</span>
                    </div>
                  </div>
                  <div className="config-row">
                    <label>Secondary Color:</label>
                    <div className="color-display">
                      <div
                        className="color-box"
                        style={{
                          backgroundColor:
                            config.brand?.secondaryColor || "#dc004e",
                        }}
                      />
                      <span>{config.brand?.secondaryColor || "Not set"}</span>
                    </div>
                  </div>
                  <div className="config-row">
                    <label>Font Family:</label>
                    <span>{config.brand?.fontFamily || "Not set"}</span>
                  </div>
                  <div className="config-row">
                    <label>Logo URL:</label>
                    <span className="url-text">
                      {config.brand?.logoUrl || "Not set"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="config-card">
                <h3>Theme Settings</h3>
                <div className="config-section">
                  <div className="config-row">
                    <label>Mode:</label>
                    <span>{config.uiTheme?.mode || "Not set"}</span>
                  </div>
                  <div className="config-row">
                    <label>Accent Color:</label>
                    <div className="color-display">
                      <div
                        className="color-box"
                        style={{
                          backgroundColor:
                            config.uiTheme?.accentColor || "#f50057",
                        }}
                      />
                      <span>{config.uiTheme?.accentColor || "Not set"}</span>
                    </div>
                  </div>
                  <div className="config-row">
                    <label>Layout Style:</label>
                    <span>{config.uiTheme?.layoutStyle || "Not set"}</span>
                  </div>
                  <div className="config-row">
                    <label>Corner Style:</label>
                    <span>{config.uiTheme?.cornerStyle || "Not set"}</span>
                  </div>
                </div>
              </div>

              <div className="config-card">
                <h3>Localization Settings</h3>
                <div className="config-section">
                  <div className="config-row">
                    <label>Language:</label>
                    <span>{config.localization?.language || "Not set"}</span>
                  </div>
                  <div className="config-row">
                    <label>Timezone:</label>
                    <span>{config.localization?.timezone || "Not set"}</span>
                  </div>
                  <div className="config-row">
                    <label>Currency:</label>
                    <span>{config.localization?.currency || "Not set"}</span>
                  </div>
                  <div className="config-row">
                    <label>Date Format:</label>
                    <span>{config.localization?.dateFormat || "Not set"}</span>
                  </div>
                </div>
              </div>

              <div className="config-card">
                <h3>Features</h3>
                <div className="config-section">
                  <div className="feature-row">
                    <label>Inventory Module:</label>
                    <span
                      className={`status ${
                        config.features?.inventoryModule
                          ? "enabled"
                          : "disabled"
                      }`}
                    >
                      {config.features?.inventoryModule
                        ? "✓ Enabled"
                        : "✗ Disabled"}
                    </span>
                  </div>
                  <div className="feature-row">
                    <label>Reporting Module:</label>
                    <span
                      className={`status ${
                        config.features?.reportingModule
                          ? "enabled"
                          : "disabled"
                      }`}
                    >
                      {config.features?.reportingModule
                        ? "✓ Enabled"
                        : "✗ Disabled"}
                    </span>
                  </div>
                  <div className="feature-row">
                    <label>Supplier Management:</label>
                    <span
                      className={`status ${
                        config.features?.supplierManagement
                          ? "enabled"
                          : "disabled"
                      }`}
                    >
                      {config.features?.supplierManagement
                        ? "✓ Enabled"
                        : "✗ Disabled"}
                    </span>
                  </div>
                  <div className="feature-row">
                    <label>Advanced Pricing:</label>
                    <span
                      className={`status ${
                        config.features?.advancedPricing
                          ? "enabled"
                          : "disabled"
                      }`}
                    >
                      {config.features?.advancedPricing
                        ? "✓ Enabled"
                        : "✗ Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="action-buttons" style={{ marginTop: "2rem" }}>
                <button onClick={handleEditConfig} className="btn btn-primary">
                  Edit Configuration
                </button>
                <button
                  onClick={handleInitializeConfig}
                  className="btn btn-secondary"
                >
                  Initialize Default Config
                </button>
              </div>
            </div>
          ) : (
            <div className="no-data">
              <div className="no-config-message">
                <Building2
                  size={48}
                  color="#3b82f6"
                  style={{ marginBottom: "16px" }}
                />
                <h3>No Configuration Found</h3>
                <p>Your tenant configuration hasn't been set up yet.</p>
                <p>
                  Click the button below to create a default configuration with
                  standard settings.
                </p>
              </div>
              <button
                onClick={handleInitializeConfig}
                className="btn btn-primary"
                style={{ marginTop: "20px" }}
              >
                Initialize Default Configuration
              </button>
            </div>
          )}
        </div>

        <TenantConfigModal
          isOpen={showModal}
          config={config}
          onClose={() => setShowModal(false)}
          onSubmit={handleUpdateConfig}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default TenantSettings;
