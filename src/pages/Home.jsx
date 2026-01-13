import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, loading } = useAuth();

  // ⏳ auth check চলাকালীন
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // ✅ user থাকলে dashboard এ redirect
  if (user?.role === "user") {
    return <Navigate to="/dashboard" replace />;
  }
  // ✅ admin থাকলে admin dashboard এ redirect
  if (user?.role === "admin") {
    return <Navigate to="/adminDashboard" replace />;
  }

  // ❌ user না থাকলে login UI
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 leading-relaxed">
          যদি আপনার একাউন্ট থাকে <br />
          <span className="text-gray-500 text-base">
            (If you already have an account)
          </span>
        </h1>

        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
        >
          লগইন করুন <span className="opacity-90">(Login)</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
