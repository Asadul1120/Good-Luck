import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../src/api/axios"; // ✅ axios instance

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // ================= GET USER DATA =================
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("/users/me"); // ✅ correct
        setProfileData(res.data.user); // 🔥 backend sends { user }
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response?.data || error.message
        );
      }
    };
    fetchUserData();
  }, []);

  

  // ================= FILE CHANGE =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus("File size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadStatus("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setUploadStatus("");

    // 🔹 preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // ================= UPLOAD IMAGE =================
  const handleUpdateProfile = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus("Uploading...");

      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await axios.patch("/users/me/image", formData);

      setProfileData((prev) => ({
        ...prev,
        image: res.data.image, // ✅ cloudinary URL
      }));

      setUploadStatus("Profile picture updated successfully!");
      setSelectedFile(null);
    } catch (error) {
      setUploadStatus(error.response?.data?.message || "Image upload failed");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  const profileFields = [
    { label: "Name:", value: profileData.username },
    { label: "Email:", value: profileData.email },
    { label: "Phone:", value: profileData.phone },
    { label: "Address:", value: profileData.address },
    { label: "Amount from Submitted Work:", value: profileData.amount || "00" },
    { label: "Total Balance:", value: profileData.balance },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Profile Details</h1>
          <Link
            to="/change-password"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 text-sm py-1 rounded-lg"
          >
            Change Password
          </Link>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          {profileFields.map((field, index) => (
            <div key={index}>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">{field.label}</span>
                <span className="text-gray-900">{field.value || "00"}</span>
              </div>
              {index < profileFields.length - 1 && <hr className="mt-3" />}
            </div>
          ))}
        </div>

        {/* Profile Picture */}
        {/* Profile Picture */}
        <div className="border-t pt-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Profile Picture
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Image */}
            <div className="flex justify-center sm:justify-start">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border">
                <img
                  src={
                    profileData.image ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Upload */}
            <div className="flex-1 space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-blue-50 file:text-blue-600
                  hover:file:bg-blue-100"
              />

              <button
                onClick={handleUpdateProfile}
                disabled={!selectedFile || isUploading}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium transition ${
                  selectedFile
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isUploading ? "Uploading..." : "Update Picture"}
              </button>

              {uploadStatus && (
                <p className="text-sm text-gray-600">{uploadStatus}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
