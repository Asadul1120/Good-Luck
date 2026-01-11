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


console.log(profileData);

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
      setUploadStatus(
        error.response?.data?.message || "Image upload failed"
      );
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
    { label: "Total Balance:", value: profileData.balance },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Profile Details
          </h1>
          <Link
            to="/change-password"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Change Password
          </Link>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          {profileFields.map((field, index) => (
            <div key={index}>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  {field.label}
                </span>
                <span className="text-gray-900">
                  {field.value || "00" }
                </span>
              </div>
              {index < profileFields.length - 1 && (
                <hr className="mt-3" />
              )}
            </div>
          ))}
        </div>

        {/* Profile Picture */}
        <div className="border-t pt-6 space-y-6">
          <h2 className="font-medium text-lg">Profile Picture</h2>

          <div className="flex gap-8 items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border">
              <img
                src={profileData.image }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />

              <button
                onClick={handleUpdateProfile}
                disabled={!selectedFile || isUploading}
                className={`px-5 py-2 rounded-md ${
                  selectedFile
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {isUploading ? "Uploading..." : "Update Picture"}
              </button>

              {uploadStatus && (
                <p className="text-sm">{uploadStatus}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
