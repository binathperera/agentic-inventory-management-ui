import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TenantProvider } from "./contexts/TenantContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SubdomainValidator from "./components/SubdomainValidator";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Marketing from "./pages/Marketing";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import Invoices from "./pages/Invoices";
import ProductBatches from "./pages/ProductBatches";
import Sales from "./pages/Sales";
import UserManagement from "./pages/UserManagement";
import TenantSettings from "./pages/TenantSettings";

function App() {
  return (
    <Router>
      <TenantProvider>
        <SubdomainValidator>
          <AuthProvider>
            <Routes>
              <Route path="/index" element={<Marketing />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers"
                element={
                  <ProtectedRoute>
                    <Suppliers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <ProtectedRoute>
                    <Invoices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/batches"
                element={
                  <ProtectedRoute>
                    <ProductBatches />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sales"
                element={
                  <ProtectedRoute>
                    <Sales />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <TenantSettings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </SubdomainValidator>
      </TenantProvider>
    </Router>
  );
}

export default App;
