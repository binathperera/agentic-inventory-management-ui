import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import "../styles/Marketing.css";

export default function Marketing() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">

      {/* ===== HEADER ===== */}
      <nav className="top-nav">
        <div className="nav-left">
          <div
            className="logo-click"
            onClick={() => setActiveSection(null)}
          >
            <Logo />
          </div>

          <ul className="nav-menu">
            <li onClick={() => setActiveSection("inventory")}>Inventory</li>
            <li onClick={() => setActiveSection("sales")}>Sales</li>
            <li onClick={() => setActiveSection("supplier")}>Suppliers</li>
            <li onClick={() => setActiveSection("reporting")}>Reports</li>
          </ul>
        </div>

        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </nav>

      {/* ===== HERO CONTENT ===== */}
      <section className="hero-container">

        {/* LEFT CONTENT */}
        <div className="hero-card-left">

          {/* DEFAULT CTA */}
          {activeSection === null && (
            <>
              <h2>Get Started Today</h2>
              <p>
                Inventra is a modern inventory management system designed to
                help businesses track stock, manage sales, coordinate suppliers,
                and gain valuable insights through analytics.
              </p>

              <a
                href="mailto:support@inventra.com"
                className="email-btn"
              >
                Email Us
              </a>
            </>
          )}

          {activeSection === "inventory" && (
            <>
              <h2>📦 Inventory Tracking</h2>
              <p>
                Monitor stock levels in real time to prevent shortages and
                overstocking while ensuring optimal product availability.
              </p>
            </>
          )}

          {activeSection === "sales" && (
            <>
              <h2>🛍️ Sales Management</h2>
              <p>
                Record and manage sales transactions accurately with automatic
                synchronization to inventory records.
              </p>
            </>
          )}

          {activeSection === "supplier" && (
            <>
              <h2>🤝 Supplier Management</h2>
              <p>
                Centralize supplier data and streamline procurement workflows
                for efficient supply chain operations.
              </p>
            </>
          )}

          {activeSection === "reporting" && (
            <>
              <h2>📊 Reporting & Analytics</h2>
              <p>
                Generate actionable insights through structured business reports
                to support data-driven decisions.
              </p>
            </>
          )}

        </div>

        {/* RIGHT VISUAL */}
        <div className="hero-card-right">
          <span>Agentic Inventory Management</span>
        </div>

      </section>
    </div>
  );
}
