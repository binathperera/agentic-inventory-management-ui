import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Navigation.css";
import {
  LayoutDashboard,
  Package,
  Building2,
  FileText,
  Layers,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h2 className="nav-title">ABC (Pvt) Ltd</h2>
        <div className="user-info-nav">
          <span className="user-name-nav">{user?.username}</span>
          <span className="user-role-nav">
            {user?.roles[1] ? user.roles[1] : user?.roles[0]}
          </span>
        </div>
      </div>
      <ul className="nav-menu">
        <li>
          <Link
            to="/dashboard"
            className={`nav-link ${isActive("/dashboard")}`}
          >
            <LayoutDashboard className="nav-icon" size={20} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/inventory"
            className={`nav-link ${isActive("/inventory")}`}
          >
            <Package className="nav-icon" size={20} />
            <span>Inventory</span>
          </Link>
        </li>
        <li>
          <Link
            to="/suppliers"
            className={`nav-link ${isActive("/suppliers")}`}
          >
            <Building2 className="nav-icon" size={20} />
            <span>Suppliers</span>
          </Link>
        </li>
        <li>
          <Link to="/invoices" className={`nav-link ${isActive("/invoices")}`}>
            <FileText className="nav-icon" size={20} />
            <span>Invoices</span>
          </Link>
        </li>
        <li>
          <Link to="/batches" className={`nav-link ${isActive("/batches")}`}>
            <Layers className="nav-icon" size={20} />
            <span>Product Batches</span>
          </Link>
        </li>
        <li>
          <Link to="/sales" className={`nav-link ${isActive("/sales")}`}>
            <ShoppingCart className="nav-icon" size={20} />
            <span>Sales</span>
          </Link>
        </li>
        {isAdmin() && (
          <>
            <li>
              <Link to="/users" className={`nav-link ${isActive("/users")}`}>
                <Users className="nav-icon" size={20} />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`nav-link ${isActive("/settings")}`}
              >
                <Settings className="nav-icon" size={20} />
                <span>Settings</span>
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className="nav-footer">
        <button onClick={logout} className="btn-logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
