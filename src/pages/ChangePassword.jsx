import React, { useState } from "react";

const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      setError("❌ New password and confirm password do not match");
      return;
    }

    setError("");
    alert("✅ Password changed successfully!");

    console.log("Old Password:", e.target.currentPassword.value);
    console.log("New Password:", newPassword);
    e.target.reset();
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
                placeholder="Enter old password"
              />
              <span
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {showCurrent ? "👤" : "👁️"}
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
                placeholder="Enter new password"
              />
              <span
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {showNew ? "👤" : "👁️"}
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
                placeholder="Confirm new password"
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {showConfirm ? "👤" : "👁️"}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm font-medium">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
