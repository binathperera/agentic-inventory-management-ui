import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";
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
  const { user, logout, isAdmin, hasRole } = useAuth();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  const getRoleName = () => {
    if (!user?.roles || user.roles.length === 0) return "User";
    const firstRole = user.roles[0];

    if (typeof firstRole === "string") {
      return firstRole;
    }

    return (firstRole as any).name || "User";
  };

  return (
    <nav className="navigation">
      {/* ================= HEADER ================= */}
      <div className="nav-header">
        <Logo />

        <div className="user-info-nav">
          <span className="user-name-nav">{user?.username}</span>
          <span className="user-role-nav">{getRoleName()}</span>
        </div>
      </div>

      {/* ================= MENU ================= */}
      <ul className="nav-menu">
        {/* Dashboard - All users */}
        <li>
          <Link
            to="/dashboard"
            className={`nav-link ${isActive("/dashboard")}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Inventory - Admin & Manager */}
        {(isAdmin() || hasRole("MANAGER")) && (
          <li>
            <Link
              to="/inventory"
              className={`nav-link ${isActive("/inventory")}`}
            >
              <Package size={20} />
              <span>Inventory</span>
            </Link>
          </li>
        )}

        {/* Suppliers - Admin & Manager */}
        {(isAdmin() || hasRole("MANAGER")) && (
          <li>
            <Link
              to="/suppliers"
              className={`nav-link ${isActive("/suppliers")}`}
            >
              <Building2 size={20} />
              <span>Suppliers</span>
            </Link>
          </li>
        )}

        {/* Invoices - Admin & Manager */}
        {(isAdmin() || hasRole("MANAGER")) && (
          <li>
            <Link
              to="/invoices"
              className={`nav-link ${isActive("/invoices")}`}
            >
              <FileText size={20} />
              <span>Invoices</span>
            </Link>
          </li>
        )}

        {/* Product Batches - Admin & Manager */}
        {(isAdmin() || hasRole("MANAGER")) && (
          <li>
            <Link
              to="/batches"
              className={`nav-link ${isActive("/batches")}`}
            >
              <Layers size={20} />
              <span>Product Batches</span>
            </Link>
          </li>
        )}

        {/* Sales - Admin, Manager, Cashier */}
        {(isAdmin() ||
          hasRole("MANAGER") ||
          hasRole("CASHIER")) && (
          <li>
            <Link
              to="/sales"
              className={`nav-link ${isActive("/sales")}`}
            >
              <ShoppingCart size={20} />
              <span>Sales</span>
            </Link>
          </li>
        )}

        {/* Users - Admin Only */}
        {isAdmin() && (
          <li>
            <Link
              to="/users"
              className={`nav-link ${isActive("/users")}`}
            >
              <Users size={20} />
              <span>Users</span>
            </Link>
          </li>
        )}

        {/* Settings - Admin Only */}
        {isAdmin() && (
          <li>
            <Link
              to="/settings"
              className={`nav-link ${isActive("/settings")}`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li>
        )}
      </ul>

      {/* ================= FOOTER ================= */}
<div className="nav-footer">
  <button onClick={logout} className="btn-logout">
    <LogOut size={18} />
    <span>Logout</span>
  </button>

  <div className="nav-copyright">
    © {new Date().getFullYear()} ABC (Pvt) Ltd
  </div>
</div>

    </nav>
  );
};

export default Navigation;
