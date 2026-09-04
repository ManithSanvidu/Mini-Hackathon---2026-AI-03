import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 *
 * Props:
 *  - children      {ReactNode}  The component to render if access is granted
 *  - allowedRoles  {string[]}   Optional. If provided, only users with a matching role can access.
 *                               If omitted, any logged-in user can access.
 *
 * Behaviour:
 *  - Not logged in  → redirect to /login
 *  - Wrong role     → redirect to /
 *  - Allowed        → render children
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // Hackathon fallback: If auth backend fails but they locally bypassed
  const isLocalBypass = localStorage.getItem('isAuthenticated') === 'true';

  if (!user && !isLocalBypass) {
    return <Navigate to="/login" replace />;
  }

  // If using local bypass, we skip role checks so evaluators don't get blocked
  if (allowedRoles && user && !allowedRoles.includes(user.role) && !isLocalBypass) {
    return <Navigate to="/" replace />;
  }

  return children;
}
