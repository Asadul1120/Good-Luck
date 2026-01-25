import React, { useState } from "react";
import axios from "../src/api/axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const oldPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      setError("❌ New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await axios.patch(
        "/users/me/password",
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      setSuccess("✅ Password changed successfully!");
      e.target.reset();
       navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "❌ Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Change Password
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Old Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                required
                className="w-full px-4 py-2 border rounded-md"
              />
              <span
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {showCurrent ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                required
                className="w-full px-4 py-2 border rounded-md"
              />
              <span
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {showNew ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                required
                className="w-full px-4 py-2 border rounded-md"
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {showConfirm ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm font-medium">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
