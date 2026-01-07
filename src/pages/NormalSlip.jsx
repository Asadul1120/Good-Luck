import { useState, useEffect } from "react";

const NormalSlip = () => {
  const [formData, setFormData] = useState({
    country: "Bangladesh",
    city: "Dhaka",
    countryTravelingTo: "Bangladesh",
    firstName: "",
    lastName: "",
    dob: "",
    nationality: "Bangladesh",
    gender: "......",
    maritalStatus: "......",
    passportNumber: "",
    confirmPassport: "",
    visaType: "Work Visa",
    passportIssueDate: "",
    passportExpiryDate: "",
    nationalId: "",
    position: "---------",
    remarks: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passportMatchError, setPassportMatchError] = useState("");

  // Passport confirmation validation
  useEffect(() => {
    if (formData.passportNumber && formData.confirmPassport) {
      if (formData.passportNumber !== formData.confirmPassport) {
        setPassportMatchError("Passport numbers do not match!");
      } else {
        setPassportMatchError("");
      }
    }
  }, [formData.passportNumber, formData.confirmPassport]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    const requiredFields = [
      "firstName",
      "lastName",
      "dob",
      "passportNumber",
      "confirmPassport",
      "passportIssueDate",
      "passportExpiryDate",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    // Date validation
    if (formData.passportIssueDate && formData.passportExpiryDate) {
      const issueDate = new Date(formData.passportIssueDate);
      const expiryDate = new Date(formData.passportExpiryDate);

      if (expiryDate <= issueDate) {
        newErrors.passportExpiryDate = "Expiry date must be after issue date";
      }
    }

    // Gender and Marital Status validation
    if (formData.gender === "......") {
      newErrors.gender = "Please select gender";
    }

    if (formData.maritalStatus === "......") {
      newErrors.maritalStatus = "Please select marital status";
    }

    // Position validation
    if (formData.position === "---------") {
      newErrors.position = "Please select a position";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!formData.agreeTerms) {
      alert("Please agree to terms and conditions");
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (passportMatchError) {
      alert(passportMatchError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      console.log("Form submitted:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Form submitted successfully!");
      // Reset form or redirect here
      // setFormData({...initialState});
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddYears = (years) => {
    if (!formData.passportIssueDate) {
      alert("Please set issue date first");
      return;
    }

    const issueDate = new Date(formData.passportIssueDate);
    const newExpiryDate = new Date(issueDate);
    newExpiryDate.setFullYear(issueDate.getFullYear() + years);

    const formattedDate = newExpiryDate.toLocaleDateString("en-GB");
    setFormData((prev) => ({
      ...prev,
      passportExpiryDate: formattedDate,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-500 mb-6 ">
          Normal Slip
        </h1>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Country & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              >
                {["Select your Country", "India", "Bangladesh"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              >
                {["Dhaka", "Chittagong", "Sylhet"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Country Traveling To */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Country Traveling To
            </label>
            <select
              name="countryTravelingTo"
              value={formData.countryTravelingTo}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            >
              {[
                "Select your Country",
                "Bahrain",
                "Kuwait",
                "Oman",
                "Qatar",
                "Saudi Arabia",
                "UAE",
                "Yemen",
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.firstName ? "border-red-500" : ""
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.lastName ? "border-red-500" : ""
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* DOB & Nationality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.dob ? "border-red-500" : ""
                }`}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Nationality
              </label>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              >
                {["Bangladesh", "India", "Pakistan"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gender & Marital Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.gender ? "border-red-500" : ""
                }`}
              >
                {["......", "Male", "Female", "Others"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Marital Status *
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.maritalStatus ? "border-red-500" : ""
                }`}
              >
                {["......", "Single", "Married"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.maritalStatus && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maritalStatus}
                </p>
              )}
            </div>
          </div>

          {/* Passport Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Passport Number № *
              </label>
              <input
                type="text"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.passportNumber ? "border-red-500" : ""
                }`}
              />
              {errors.passportNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.passportNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Confirm Passport *
              </label>
              <input
                type="text"
                name="confirmPassport"
                value={formData.confirmPassport}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.confirmPassport || passportMatchError
                    ? "border-red-500"
                    : ""
                }`}
              />
              {errors.confirmPassport && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassport}
                </p>
              )}
              {passportMatchError && !errors.confirmPassport && (
                <p className="text-red-500 text-sm mt-1">
                  {passportMatchError}
                </p>
              )}
            </div>
          </div>

          {/* Visa Type */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Visa Type
            </label>
            <select
              name="visaType"
              value={formData.visaType}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            >
              {["Work Visa", "Family Visa", "Tourist Visa"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Passport Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Passport Issue Date *
              </label>
              <input
                type="date"
                name="passportIssueDate"
                value={formData.passportIssueDate}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.passportIssueDate ? "border-red-500" : ""
                }`}
              />
              {errors.passportIssueDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.passportIssueDate}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Passport Expiry Date *
              </label>
              <input
                type="date"
                name="passportExpiryDate"
                value={formData.passportExpiryDate}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.passportExpiryDate ? "border-red-500" : ""
                }`}
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleAddYears(5)}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                >
                  +5 Years
                </button>
                <button
                  type="button"
                  onClick={() => handleAddYears(10)}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                >
                  +10 Years
                </button>
              </div>
              {errors.passportExpiryDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.passportExpiryDate}
                </p>
              )}
            </div>
          </div>

          {/* National ID */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              National ID (Optional)
            </label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Position Applied For */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Position Applied For *
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
                errors.position ? "border-red-500" : ""
              }`}
            >
              {[
                "---------",
                "Banking & Finance",
                "Carpenter",
                "Cashier",
                "Electrician",
                "Engineer",
                "General Secretary",
                "Health & Medicine & Nursing",
                "Heavy Driver",
                "IT & Internet Engineer",
                "Leisure & Tourism",
                "Light Driver",
                "Mason",
                "President",
                "Labour",
                "Plumber",
                "Doctor",
                "Family",
                "Steel Fixer",
                "Aluminum Technician",
                "Nurse",
                "Male Nurse",
                "Ward Boy",
                "Shovel Operator",
                "Dozer Operator",
                "Car Mechanic",
                "Petrol Mechanic",
                "Diesel Mechanic",
                "Student",
                "Accountant",
                "Lab Technician",
                "Draftsman",
                "Auto-Cad Operator",
                "Painter",
                "Tailor",
                "Welder",
                "X-ray Technician",
                "Lecturer",
                "A.C Technician",
                "Business",
                "Cleaner",
                "Security Guard",
                "House Maid",
                "Manager",
                "Hospital Cleaning",
                "Mechanic",
                "Computer Operator",
                "House Driver",
                "Driver",
                "Cleaning Labour",
                "Building Electrician",
                "Salesman",
                "Plastermason",
                "Servant",
                "Barber",
                "Residence",
                "Shepherds",
                "Employment",
                "Fuel Filler",
                "Worker",
                "House Boy",
                "House Wife",
                "RCC Fitter",
                "Clerk",
                "Microbiologist",
                "Teacher",
                "Helper",
                "Hajj Duty",
                "Shuttering",
                "Supervisor",
                "Medical Specialist",
                "Office Secretary",
                "Technician",
                "Butcher",
                "Arabic Food Cook",
                "Agricultural Worker",
                "Service",
                "Studio CAD Designer",
                "Financial Analyst",
                "Cabin Appearance (AIR LINES)",
                "Car Washer",
                "Surveyor",
                "Electrical Technician",
                "Waiter",
                "Nursing helper",
                "Anesthesia technician",
                "Marvel",
                "Construction worker",
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.position && (
              <p className="text-red-500 text-sm mt-1">{errors.position}</p>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Your Own Remarks (If Any)
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Write your own remarks here"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              rows="6"
            ></textarea>
          </div>

          {/* Terms & Submit */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <p className="text-gray-700 text-sm">
                I confirm the information is accurate and agree to the{" "}
                <span className="text-blue-600 underline">
                  Terms & Conditions
                </span>
                .
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`ml-auto px-6 py-2 font-semibold rounded-lg shadow-md transition ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Save And Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NormalSlip;
