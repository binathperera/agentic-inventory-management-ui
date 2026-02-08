import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Loading.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredRoles?: string[];
  requireAnyRole?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, requiredRoles, requireAnyRole = false }: ProtectedRouteProps) => {
  const { user, loading, hasRole, hasAnyRole } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is enabled
  if (user.enabled === false) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin access is required
  if (requireAdmin && !hasRole('ADMIN')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if specific roles are required
  if (requiredRoles && requiredRoles.length > 0) {
    if (requireAnyRole) {
      // User needs at least one of the specified roles
      if (!hasAnyRole(requiredRoles)) {
        return <Navigate to="/dashboard" replace />;
      }
    } else {
      // User needs all of the specified roles
      if (!requiredRoles.every(role => hasRole(role))) {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
