import { useState, useEffect } from "react";
import { tenantConfigService } from "../services/api";
import type { TenantConfig } from "../types";
import Navigation from "../components/Navigation";
import TenantConfigModal from "../components/TenantConfigModal";
import { Building2 } from "lucide-react";
import "../styles/Suppliers.css";
import "../styles/TenantSettings.css";
import { useTenant } from "../contexts/TenantContext";

const TenantSettings = () => {
  const { setConfig: setGlobalConfig } = useTenant();

  const [config, setLocalConfig] = useState<TenantConfig | null>(null);
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
      setLocalConfig(data);
      setGlobalConfig(data); // sync globally
      setError("");
    } catch (err: any) {
      if (err?.response?.status === 400 || err?.response?.status === 404) {
        setLocalConfig(null);
        setError("");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load configuration"
        );
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
      const result =
        await tenantConfigService.updateTenantConfig(updatedConfig);

      setLocalConfig(result);
      setGlobalConfig(result); // 🔥 update entire system instantly

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
        "Are you sure you want to initialize default configuration?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const result =
        await tenantConfigService.initializeTenantConfig();

      setLocalConfig(result);
      setGlobalConfig(result); // 🔥 sync globally

      setSuccessMessage("Configuration initialized successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setError("");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to initialize configuration"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-with-nav">
      <Navigation />

      <div className="page-content">
        <div className="page-header">
          <h1>Settings</h1>
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

              {/* ================= BRAND ================= */}
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

              {/* ================= THEME ================= */}
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
              <Building2 size={48} color="#3b82f6" />
              <h3>No Configuration Found</h3>
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
