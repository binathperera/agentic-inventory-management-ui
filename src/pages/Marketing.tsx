import {
  Package,
  ShoppingCart,
  Handshake,
  TrendingUp,
  ShieldCheck,
  Database,
  Users
} from "lucide-react";

import logo from "../assets/abc-logo.png";
import "../styles/Marketing.css";

export default function Marketing() {

  return (
    <div className="marketing-container">

      {/* ================= NAVBAR ================= */}
      <nav className="marketing-navbar">
        <div className="nav-logo">
          <img src={logo} alt="ABC Logo" />
          <span>ABC (Pvt) Ltd</span>
          
        </div>
        <div>
          <a href="http://abc.localhost:3000/login" className="nav-link">login</a>
        </div>
      </nav>

      
      <section className="marketing-hero">
        <h1>Inventory Management System</h1>
        <p>
          A complete business solution to manage products, suppliers,
          invoices, batches, sales, and users in one powerful platform.
        </p>
      </section>

   
      <section className="marketing-features">

        <div className="feature-card">
          <Package size={32} />
          <h3>Inventory Tracking</h3>
          <p>
            Monitor product quantities, manage stock levels,
            and track inventory in real time.
          </p>
        </div>

        <div className="feature-card">
          <ShoppingCart size={32} />
          <h3>Sales Management</h3>
          <p>
            Record transactions, calculate revenue,
            and monitor outstanding balances efficiently.
          </p>
        </div>

        <div className="feature-card">
          <Handshake size={32} />
          <h3>Supplier Management</h3>
          <p>
            Store supplier contact details, manage relationships,
            and track supplier performance.
          </p>
        </div>

        <div className="feature-card">
          <TrendingUp size={32} />
          <h3>Reporting & Analytics</h3>
          <p>
            Generate revenue reports, inventory valuation,
            and performance insights.
          </p>
        </div>

      </section>


      <section className="marketing-details">
        <h2>Why Choose Our System?</h2>

        <div className="details-grid">

          <div className="detail-box">
            <ShieldCheck size={28} />
            <h4>Secure Access Control</h4>
            <p>
              Role-based authentication ensures secure system usage
              with admin and user-level access.
            </p>
          </div>

          <div className="detail-box">
            <Database size={28} />
            <h4>Batch Management</h4>
            <p>
              Track product batches with quantity,
              expiry monitoring, and history logs.
            </p>
          </div>

          <div className="detail-box">
            <Users size={28} />
            <h4>User Management</h4>
            <p>
              Manage team members with controlled permissions
              and secure login authentication.
            </p>
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="marketing-cta">
        <h2>Get Started Today</h2>
        <p>
          Transform the way you manage inventory, suppliers, and sales.
        </p>
        <a
          href="mailto:support@inventorysystem.com"
          className="cta-button"
        >
          Email Us
        </a>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="marketing-footer">

        <div className="footer-section">
          <h3>ABC (Pvt) Ltd</h3>
          <p>Smart Inventory Solutions</p>
          <p>
            We provide reliable and scalable inventory management
            systems designed for modern businesses.
          </p>
        </div>

        <div className="footer-section">
          <h4>Our Services</h4>
          <p>Inventory Management</p>
          <p>Sales Tracking</p>
          <p>Supplier Monitoring</p>
          <p>Batch & Invoice Management</p>
        </div>

        <div className="footer-section">
          <h4>Contact Information</h4>

          <a
            href="mailto:support@inventorysystem.com"
            className="footer-link"
          >
            Email: support@inventorysystem.com
          </a>

          <a
            href="tel:+94771234567"
            className="footer-link"
          >
            Phone: +94 77 123 4567
          </a>

          <a
            href="https://maps.google.com/?q=Colombo,SriLanka"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Location: Colombo, Sri Lanka
          </a>

        </div>

      </footer>

      <div className="footer-bottom">
        © 2026 ABC (Pvt) Ltd | All Rights Reserved
      </div>

    </div>
  );
}
