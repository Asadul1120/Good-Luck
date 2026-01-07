import React, { useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "Mohammad Rabbi",
    email: "rabbi@gmail.com",
    phone: "01781901839",
    address: "GATAG NO: 0012281",
    submittedWorkAmount: "00.00",
    totalBalance: "00.00",
    profileImage: "https://via.placeholder.com/150",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setUploadStatus("File size should be less than 5MB");
        return;
      }

      if (!file.type.match("image.*")) {
        setUploadStatus("Please select an image file");
        return;
      }

      setSelectedFile(file);
      setUploadStatus("");

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first");
      return;
    }

    // Here you would typically upload to your backend
    setUploadStatus("Profile picture updated successfully!");
    setSelectedFile(null);

    // Reset status message after 3 seconds
    setTimeout(() => setUploadStatus(""), 3000);
  };

  const profileFields = [
    { label: "Name:", value: profileData.name },
    { label: "Email:", value: profileData.email },
    { label: "Phone:", value: profileData.phone },
    { label: "Address:", value: profileData.address },
    {
      label: "Amount from Submitted Work:",
      value: profileData.submittedWorkAmount,
    },
    { label: "Total Balance:", value: profileData.totalBalance },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Profile Details</h1>
          <Link
            to="/change-password"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            Change Password
          </Link>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          {profileFields.map((field, index) => (
            <div key={index}>
              <div className="flex justify-between items-center ">
                <span className="font-medium text-gray-700 mb-4 ">
                  {field.label}
                </span>
                <span className="text-gray-900 break-all">{field.value}</span>
              </div>
              {index < profileFields.length - 1 && (
                <hr className="border-gray-200" />
              )}
            </div>
          ))}
        </div>

        {/* Profile Picture Section */}
        <div className="border-t pt-6 space-y-6">
          <div>
            <h2 className="font-medium text-lg text-gray-800 mb-2">
              Profile Picture
            </h2>
            <p className="text-sm text-gray-500">
              Upload a new profile picture (Max 5MB)
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Current Profile Picture */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">Current Picture</p>
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-4">
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-600
                    file:mr-4 file:py-3 file:px-4
                    file:rounded-lg file:border-0
                    file:bg-blue-50 file:text-blue-600
                    hover:file:bg-blue-100
                    cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={!selectedFile}
                    className={`px-5 py-2.5 rounded-md font-medium transition duration-200 ${
                      selectedFile
                        ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Update Picture
                  </button>

                  <button
                    onClick={() => setSelectedFile(null)}
                    className="px-5 py-2.5 rounded-md font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {uploadStatus && (
                <div
                  className={`text-sm p-3 rounded-md ${
                    uploadStatus.includes("success")
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {uploadStatus}
                </div>
              )}

              <p className="text-xs text-gray-400">
                Supported formats: JPG, PNG, GIF • Max size: 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Additional Actions (Optional) */}
        <div className="border-t pt-6 flex justify-end">
          <button className="px-5 py-2.5 rounded-md font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 transition duration-200">
            Edit Profile Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
