import { Package, ShoppingCart, Handshake, TrendingUp } from "lucide-react";
import "../styles/Marketing.css";

export default function Marketing() {
  return (
    <div className="marketing-container">
      <div className="marketing-content">
        <h1>Inventory Management System</h1>
        <p className="subtitle">
          Professional inventory management made simple
        </p>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">
              <Package size={32} />
            </div>
            <h3>Inventory Tracking</h3>
            <p>Real-time tracking of your products and stock levels</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <ShoppingCart size={32} />
            </div>
            <h3>Sales Management</h3>
            <p>Manage sales transactions and maintain accurate records</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <Handshake size={32} />
            </div>
            <h3>Supplier Management</h3>
            <p>Organize supplier information and manage relationships</p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <TrendingUp size={32} />
            </div>
            <h3>Reporting & Analytics</h3>
            <p>Generate detailed reports and gain business insights</p>
          </div>
        </div>

        <div className="cta-section">
          <h2>Get Started Today!</h2>
          <p>
            Contact us to set up your personalized inventory management system.
          </p>
          <a href="mailto:support@inventorysystem.com">Email Us</a>
        </div>
      </div>
    </div>
  );
}
