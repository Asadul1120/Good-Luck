import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ⏳ auth check চলাকালীন
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Checking permissions...</p>
      </div>
    );
  }

  // ❌ login নাই
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ admin না
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ admin access
  return children;
};

export default AdminRoute;
