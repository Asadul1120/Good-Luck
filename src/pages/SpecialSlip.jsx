// import { useState, useEffect } from "react";

// const SpecialSlip = () => {
//   const [formData, setFormData] = useState({
//     country: "Bangladesh",
//     city: "Dhaka",
//     countryTravelingTo: "Bangladesh",
//     firstName: "",
//     lastName: "",
//     dob: "",
//     nationality: "Bangladesh",
//     gender: "......",
//     maritalStatus: "......",
//     passportNumber: "",
//     confirmPassport: "",
//     visaType: "Work Visa",
//     passportIssueDate: "",
//     passportExpiryDate: "",
//     nationalId: "",
//     position: "---------",
//     medicalCenter: "",
//     remarks: "",
//     agreeTerms: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [passportMatchError, setPassportMatchError] = useState("");

//   // Passport confirmation validation
//   useEffect(() => {
//     if (formData.passportNumber && formData.confirmPassport) {
//       if (formData.passportNumber !== formData.confirmPassport) {
//         setPassportMatchError("Passport numbers do not match!");
//       } else {
//         setPassportMatchError("");
//       }
//     }
//   }, [formData.passportNumber, formData.confirmPassport]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Required field validation
//     const requiredFields = [
//       "firstName",
//       "lastName",
//       "dob",
//       "passportNumber",
//       "confirmPassport",
//       "passportIssueDate",
//       "passportExpiryDate",
//     ];

//     requiredFields.forEach((field) => {
//       if (!formData[field].trim()) {
//         newErrors[field] = "This field is required";
//       }
//     });

//     // Date validation
//     if (formData.passportIssueDate && formData.passportExpiryDate) {
//       const issueDate = new Date(formData.passportIssueDate);
//       const expiryDate = new Date(formData.passportExpiryDate);

//       if (expiryDate <= issueDate) {
//         newErrors.passportExpiryDate = "Expiry date must be after issue date";
//       }
//     }

//     // Gender and Marital Status validation
//     if (formData.gender === "......") {
//       newErrors.gender = "Please select gender";
//     }

//     if (formData.maritalStatus === "......") {
//       newErrors.maritalStatus = "Please select marital status";
//     }

//     // Position validation
//     if (formData.position === "---------") {
//       newErrors.position = "Please select a position";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();

//     if (!formData.agreeTerms) {
//       alert("Please agree to terms and conditions");
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     if (passportMatchError) {
//       alert(passportMatchError);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Simulate API call
//       console.log("Form submitted:", formData);
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       alert("Form submitted successfully!");
//       // Reset form or redirect here
//       // setFormData({...initialState});
//     } catch (error) {
//       console.error("Submission error:", error);
//       alert("Failed to submit form. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAddYears = (years) => {
//     if (!formData.passportIssueDate) {
//       alert("Please set issue date first");
//       return;
//     }

//     const issueDate = new Date(formData.passportIssueDate);
//     const newExpiryDate = new Date(issueDate);
//     newExpiryDate.setFullYear(issueDate.getFullYear() + years);

//     const formattedDate = newExpiryDate.toLocaleDateString("en-GB");
//     setFormData((prev) => ({
//       ...prev,
//       passportExpiryDate: formattedDate,
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-10">
//       <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
//         <h1 className="text-2xl md:text-3xl font-bold text-cyan-500 mb-6 ">
//           Special Slip
//         </h1>

//         <form onSubmit={handleFormSubmit} className="space-y-6">
//           {/* Country & City */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">
//                 Country
//               </label>
//               <select
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
//               >
//                 {["Bangladesh", "India", "Pakistan"].map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block font-medium text-gray-700 mb-1">
//                 City
//               </label>
//               <select
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
//               >
//                 {["Dhaka", "Chittagong", "Sylhet"].map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Country Traveling To */}
//           <div>
//             <label className="block font-medium text-gray-700 mb-1">
//               Country Traveling To
//             </label>
//             <select
//               name="countryTravelingTo"
//               value={formData.countryTravelingTo}
//               onChange={handleChange}
//               className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
//             >
//               {[
//                 "Select your Country",
//                 "Bahrain",
//                 "Kuwait",
//                 "Oman",
//                 "Qatar",
//                 "Saudi Arabia",
//                 "UAE",
//                 "Yemen",
//               ].map((item) => (
//                 <option key={item} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Name */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">
//                 First Name *
//               </label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 placeholder="First Name"
//                 className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
//                   errors.firstName ? "border-red-500" : ""
//                 }`}
//               />
//               {errors.firstName && (
//                 <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
//               )}
//             </div>
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">
//                 Last Name *
//               </label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 placeholder="Last Name"
//                 className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
//                   errors.lastName ? "border-red-500" : ""
//                 }`}
//               />
//               {errors.lastName && (
//                 <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
//               )}
//             </div>
//           </div>

//           {/* DOB & Nationality */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">
//                 Date of Birth *
//               </label>
//               <input
//                 type="date"
//                 name="dob"
//                 value={formData.dob}
//                 onChange={handleChange}
//                 className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
//                   errors.dob ? "border-red-500" : ""
//                 }`}
//               />
//               {errors.dob && (
//                 <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
//               )}
//             </div>
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">
//                 Nationality
//               </label>
//               <select
//                 name="nationality"
//                 value={formData.nationality}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
//               >
//                 {["Bangladesh", "India", "Pakistan"].map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Gender & Marital Status */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">
//                 Gender *
//               </label>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
//                   errors.gender ? "border-red-500" : ""
//                 }`}
//               >
//                 {["......", "Male", "Female", "Others"].map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//               {errors.gender && (
//                 <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
//               )}
//             </div>
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">
//                 Marital Status *
//               </label>
//               <select
//                 name="maritalStatus"
//                 value={formData.maritalStatus}
//                 onChange={handleChange}
//                 className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
//                   errors.maritalStatus ? "border-red-500" : ""
//                 }`}
//               >
//                 {["......", "Single", "Married"].map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//               {errors.maritalStatus && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.maritalStatus}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Passport Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">
//                 Passport Number № *
//               </label>
//               <input
//                 type="text"
//                 name="passportNumber"
//                 value={formData.passportNumber}
//                 onChange={handleChange}
//                 className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
//                   errors.passportNumber ? "border-red-500" : ""
//                 }`}
//               />
//               {errors.passportNumber && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.passportNumber}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">
//                 Confirm Passport *
//               </label>
//               <input
//                 type="text"
//                 name="confirmPassport"
//                 value={formData.confirmPassport}
//                 onChange={handleChange}
//                 className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
//                   errors.confirmPassport || passportMatchError
//                     ? "border-red-500"
//                     : ""
//                 }`}
//               />
//               {errors.confirmPassport && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.confirmPassport}
//                 </p>
//               )}
//               {passportMatchError && !errors.confirmPassport && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {passportMatchError}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Visa Type */}
//           <div>
//             <label className="block font-medium text-gray-700 mb-1">
//               Visa Type
//             </label>
//             <select
//               name="visaType"
//               value={formData.visaType}
//               onChange={handleChange}
//               className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
//             >
//               {["Work Visa", "Family Visa", "Tourist Visa"].map((item) => (
//                 <option key={item} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Passport Dates */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">
//                 Passport Issue Date *
//               </label>
//               <input
//                 type="date"
//                 name="passportIssueDate"
//                 value={formData.passportIssueDate}
//                 onChange={handleChange}
//                 className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
//                   errors.passportIssueDate ? "border-red-500" : ""
//                 }`}
//               />
//               {errors.passportIssueDate && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.passportIssueDate}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="block font-medium text-gray-700 mb-1">
//                 Passport Expiry Date *
//               </label>
//               <input
//                 type="date"
//                 name="passportExpiryDate"
//                 value={formData.passportExpiryDate}
//                 onChange={handleChange}
//                 className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
//                   errors.passportExpiryDate ? "border-red-500" : ""
//                 }`}
//               />
//               <div className="flex gap-2 mt-2">
//                 <button
//                   type="button"
//                   onClick={() => handleAddYears(5)}
//                   className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
//                 >
//                   +5 Years
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleAddYears(10)}
//                   className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
//                 >
//                   +10 Years
//                 </button>
//               </div>
//               {errors.passportExpiryDate && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.passportExpiryDate}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* National ID */}
//           <div>
//             <label className="block font-medium text-gray-700 mb-1">
//               National ID (Optional)
//             </label>
//             <input
//               type="text"
//               name="nationalId"
//               value={formData.nationalId}
//               onChange={handleChange}
//               className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* Position Applied For */}
//           <div>
//             <label className="block font-medium text-gray-700 mb-1">
//               Position Applied For *
//             </label>
//             <select
//               name="position"
//               value={formData.position}
//               onChange={handleChange}
//               className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${
//                 errors.position ? "border-red-500" : ""
//               }`}
//             >
//               {[
//                 "---------",
//                 "Banking & Finance",
//                 "Carpenter",
//                 "Cashier",
//                 "Electrician",
//                 "Engineer",
//                 "General Secretary",
//                 "Health & Medicine & Nursing",
//                 "Heavy Driver",
//                 "IT & Internet Engineer",
//                 "Leisure & Tourism",
//                 "Light Driver",
//                 "Mason",
//                 "President",
//                 "Labour",
//                 "Plumber",
//                 "Doctor",
//                 "Family",
//                 "Steel Fixer",
//                 "Aluminum Technician",
//                 "Nurse",
//                 "Male Nurse",
//                 "Ward Boy",
//                 "Shovel Operator",
//                 "Dozer Operator",
//                 "Car Mechanic",
//                 "Petrol Mechanic",
//                 "Diesel Mechanic",
//                 "Student",
//                 "Accountant",
//                 "Lab Technician",
//                 "Draftsman",
//                 "Auto-Cad Operator",
//                 "Painter",
//                 "Tailor",
//                 "Welder",
//                 "X-ray Technician",
//                 "Lecturer",
//                 "A.C Technician",
//                 "Business",
//                 "Cleaner",
//                 "Security Guard",
//                 "House Maid",
//                 "Manager",
//                 "Hospital Cleaning",
//                 "Mechanic",
//                 "Computer Operator",
//                 "House Driver",
//                 "Driver",
//                 "Cleaning Labour",
//                 "Building Electrician",
//                 "Salesman",
//                 "Plastermason",
//                 "Servant",
//                 "Barber",
//                 "Residence",
//                 "Shepherds",
//                 "Employment",
//                 "Fuel Filler",
//                 "Worker",
//                 "House Boy",
//                 "House Wife",
//                 "RCC Fitter",
//                 "Clerk",
//                 "Microbiologist",
//                 "Teacher",
//                 "Helper",
//                 "Hajj Duty",
//                 "Shuttering",
//                 "Supervisor",
//                 "Medical Specialist",
//                 "Office Secretary",
//                 "Technician",
//                 "Butcher",
//                 "Arabic Food Cook",
//                 "Agricultural Worker",
//                 "Service",
//                 "Studio CAD Designer",
//                 "Financial Analyst",
//                 "Cabin Appearance (AIR LINES)",
//                 "Car Washer",
//                 "Surveyor",
//                 "Electrical Technician",
//                 "Waiter",
//                 "Nursing helper",
//                 "Anesthesia technician",
//                 "Marvel",
//                 "Construction worker",
//               ].map((item) => (
//                 <option key={item} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//             {errors.position && (
//               <p className="text-red-500 text-sm mt-1">{errors.position}</p>
//             )}
//           </div>
//           <div>
//             <label className="block font-medium text-gray-700 mb-1">
//               Medical Center
//             </label>
//             <select
//               name="medicalCenter"
//               value={formData.medicalCenter}
//               onChange={handleChange}
//               className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
//             >
//               {[
//                 " -----",
//                 "Rangpur Medical Center",
//                 "Chittagong Medical Center",
//                 "Dhaka Medical Center",
//                 "Khulna Medical Center",
//                 "Rajshahi Medical Center",
//                 "Sylhet Medical Center",
//               ].map((item) => (
//                 <option key={item} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Remarks */}
//           <div>
//             <label className="block font-medium text-gray-700 mb-1">
//               Your Own Remarks (If Any)
//             </label>
//             <textarea
//               name="remarks"
//               value={formData.remarks}
//               onChange={handleChange}
//               placeholder="Write your own remarks here"
//               className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
//               rows="6"
//             ></textarea>
//           </div>

//           {/* Terms & Submit */}
//           <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 name="agreeTerms"
//                 checked={formData.agreeTerms}
//                 onChange={handleChange}
//                 className="w-5 h-5"
//               />
//               <p className="text-gray-700 text-sm">
//                 I confirm the information is accurate and agree to the{" "}
//                 <span className="text-blue-600 underline">
//                   Terms & Conditions
//                 </span>
//                 .
//               </p>
//             </div>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`ml-auto px-6 py-2 font-semibold rounded-lg shadow-md transition ${
//                 isSubmitting
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700 text-white"
//               }`}
//             >
//               {isSubmitting ? "Submitting..." : "Save And Continue"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SpecialSlip;
















import { useState, useEffect, useMemo } from "react";

const SpecialSlip = () => {
  const initialFormData = {
    country: "Bangladesh",
    city: "Dhaka",
    countryTravelingTo: "Bangladesh",
    firstName: "",
    lastName: "",
    dob: "",
    nationality: "Bangladesh",
    gender: "",
    maritalStatus: "",
    passportNumber: "",
    confirmPassport: "",
    visaType: "Work Visa",
    passportIssueDate: "",
    passportExpiryDate: "",
    nationalId: "",
    position: "",
    medicalCenter: "",
    remarks: "",
    agreeTerms: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Format date to YYYY-MM-DD for input[type="date"]
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return formatDateForInput(new Date());
  };

  // Memoized validation function
  const validateForm = useMemo(() => () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = [
      'firstName',
      'lastName',
      'dob',
      'gender',
      'maritalStatus',
      'passportNumber',
      'confirmPassport',
      'passportIssueDate',
      'passportExpiryDate',
      'position'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });

    // Name validation
    if (formData.firstName && formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (formData.lastName && formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Age validation (minimum 18 years)
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        newErrors.dob = "You must be at least 18 years old";
      }
    }

    // Passport number validation
    if (formData.passportNumber) {
      if (formData.passportNumber.length < 8) {
        newErrors.passportNumber = "Passport number must be at least 8 characters";
      }
      if (!/^[A-Z0-9]+$/i.test(formData.passportNumber)) {
        newErrors.passportNumber = "Passport number can only contain letters and numbers";
      }
    }

    // Passport confirmation match
    if (formData.confirmPassport && formData.passportNumber !== formData.confirmPassport) {
      newErrors.confirmPassport = "Passport numbers do not match";
    }

    // Date validation
    if (formData.passportIssueDate && formData.passportExpiryDate) {
      const issueDate = new Date(formData.passportIssueDate);
      const expiryDate = new Date(formData.passportExpiryDate);
      const today = new Date();

      if (issueDate > today) {
        newErrors.passportIssueDate = "Issue date cannot be in the future";
      }

      if (expiryDate <= issueDate) {
        newErrors.passportExpiryDate = "Expiry date must be after issue date";
      }

      if (expiryDate <= today) {
        newErrors.passportExpiryDate = "Passport has expired";
      }

      // Check passport validity period (typically 5-10 years)
      const yearsDifference = expiryDate.getFullYear() - issueDate.getFullYear();
      if (yearsDifference < 5) {
        newErrors.passportExpiryDate = "Passport must be valid for at least 5 years";
      }
    }

    // National ID validation (if provided)
    if (formData.nationalId && !/^\d+$/.test(formData.nationalId)) {
      newErrors.nationalId = "National ID must contain only numbers";
    }

    return newErrors;
  }, [formData]);

  // Update form validity on change
  useEffect(() => {
    const validationErrors = validateForm();
    setIsFormValid(Object.keys(validationErrors).length === 0 && formData.agreeTerms);
  }, [formData, validateForm]);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }

    // Clear specific error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle blur event for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }

    // Validate specific field
    const fieldErrors = validateForm();
    if (fieldErrors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name]
      }));
    }
  };

  // Calculate expiry date based on years
  const handleAddYears = (years) => {
    if (!formData.passportIssueDate) {
      setErrors(prev => ({
        ...prev,
        passportExpiryDate: "Please set issue date first"
      }));
      return;
    }

    try {
      const issueDate = new Date(formData.passportIssueDate);
      const newExpiryDate = new Date(issueDate);
      newExpiryDate.setFullYear(issueDate.getFullYear() + years);
      
      // Format to YYYY-MM-DD for input[type="date"]
      const formattedDate = formatDateForInput(newExpiryDate);
      
      setFormData(prev => ({
        ...prev,
        passportExpiryDate: formattedDate
      }));
    } catch (error) {
      console.error("Error calculating expiry date:", error);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  };

  // Submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!formData.agreeTerms) {
      alert("Please agree to terms and conditions");
      return;
    }

    // Final validation
    const finalErrors = validateForm();
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      
      // Scroll to first error
      const firstErrorField = Object.keys(finalErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Prepare submission data
      const submissionData = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        submittedAt: new Date().toISOString()
      };
      
      console.log("Form submitted successfully:", submissionData);
      
      // Show success message
      alert(`Form submitted successfully for ${submissionData.fullName}`);
      
      // Reset form after successful submission
      handleReset();
      
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Country options data
  const countries = ["Bangladesh", "India", "Pakistan"];
  const cities = {
    Bangladesh: ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi"],
    India: ["Delhi", "Mumbai", "Chennai"],
    Pakistan: ["Karachi", "Lahore", "Islamabad"]
  };
  
  const travelingCountries = [
    "Bahrain", "Kuwait", "Oman", "Qatar", "Saudi Arabia", 
    "UAE", "Yemen", "Bangladesh"
  ];

  // Helper function to render error message
  const renderError = (fieldName) => {
    if (errors[fieldName] && touched[fieldName]) {
      return <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 border border-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
              Special Slip Application
            </h1>
            <p className="text-gray-600">
              Complete all required fields marked with *
            </p>
          </div>
          
          {/* Form Status Indicator */}
          <div className="mt-4 md:mt-0">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${isFormValid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {isFormValid ? 'Ready to Submit' : 'Incomplete Form'}
            </div>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* Section 1: Personal Information */}
          <section className="bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country & City */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  {countries.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  {cities[formData.country]?.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Travel Destination */}
              <div className="md:col-span-2">
                <label className="block font-medium text-gray-700 mb-2">
                  Country Traveling To *
                </label>
                <select
                  name="countryTravelingTo"
                  value={formData.countryTravelingTo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select Destination Country</option>
                  {travelingCountries.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {renderError('countryTravelingTo')}
              </div>

              {/* First & Last Name */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter first name"
                  className={`w-full border ${errors.firstName && touched.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                />
                {renderError('firstName')}
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter last name"
                  className={`w-full border ${errors.lastName && touched.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                />
                {renderError('lastName')}
              </div>

              {/* DOB & Nationality */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  max={getTodayDate()}
                  className={`w-full border ${errors.dob && touched.dob ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                />
                {renderError('dob')}
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  {countries.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender & Marital Status */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border ${errors.gender && touched.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {renderError('gender')}
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Marital Status *
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border ${errors.maritalStatus && touched.maritalStatus ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
                {renderError('maritalStatus')}
              </div>
            </div>
          </section>

          {/* Section 2: Passport Information */}
          <section className="bg-green-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-green-700 mb-4 border-b pb-2">
              Passport Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Passport Numbers */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Passport Number *
                </label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., AB1234567"
                  className={`w-full border ${errors.passportNumber && touched.passportNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition uppercase`}
                />
                {renderError('passportNumber')}
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Confirm Passport *
                </label>
                <input
                  type="text"
                  name="confirmPassport"
                  value={formData.confirmPassport}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Re-enter passport number"
                  className={`w-full border ${errors.confirmPassport && touched.confirmPassport ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition uppercase`}
                />
                {renderError('confirmPassport')}
              </div>

              {/* Visa Type */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Visa Type
                </label>
                <select
                  name="visaType"
                  value={formData.visaType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="Work Visa">Work Visa</option>
                  <option value="Family Visa">Family Visa</option>
                  <option value="Tourist Visa">Tourist Visa</option>
                  <option value="Student Visa">Student Visa</option>
                  <option value="Business Visa">Business Visa</option>
                </select>
              </div>

              {/* National ID */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  National ID (Optional)
                </label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter national ID"
                  className={`w-full border ${errors.nationalId && touched.nationalId ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                />
                {renderError('nationalId')}
              </div>

              {/* Passport Dates */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Passport Issue Date *
                </label>
                <input
                  type="date"
                  name="passportIssueDate"
                  value={formData.passportIssueDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  max={getTodayDate()}
                  className={`w-full border ${errors.passportIssueDate && touched.passportIssueDate ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                />
                {renderError('passportIssueDate')}
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Passport Expiry Date *
                </label>
                <input
                  type="date"
                  name="passportExpiryDate"
                  value={formData.passportExpiryDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={formData.passportIssueDate || undefined}
                  className={`w-full border ${errors.passportExpiryDate && touched.passportExpiryDate ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => handleAddYears(5)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition font-medium"
                  >
                    +5 Years
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddYears(10)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition font-medium"
                  >
                    +10 Years
                  </button>
                </div>
                {renderError('passportExpiryDate')}
              </div>
            </div>
          </section>

          {/* Section 3: Application Details */}
          <section className="bg-purple-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-purple-700 mb-4 border-b pb-2">
              Application Details
            </h2>
            
            <div className="space-y-6">
              {/* Position */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Position Applied For *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border ${errors.position && touched.position ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                >
                  <option value="">Select a Position</option>
                  {[
                    "Banking & Finance", "Carpenter", "Cashier", "Electrician", 
                    "Engineer", "General Secretary", "Health & Medicine & Nursing",
                    "Heavy Driver", "IT & Internet Engineer", "Labour", "Plumber",
                    "Doctor", "Nurse", "Accountant", "Manager", "Teacher",
                    "Supervisor", "Technician", "Driver", "Security Guard"
                  ].sort().map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {renderError('position')}
              </div>

              {/* Medical Center */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Medical Center
                </label>
                <select
                  name="medicalCenter"
                  value={formData.medicalCenter}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select Medical Center</option>
                  {[
                    "Rangpur Medical Center", "Chittagong Medical Center", 
                    "Dhaka Medical Center", "Khulna Medical Center", 
                    "Rajshahi Medical Center", "Sylhet Medical Center"
                  ].map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Your Own Remarks (Optional)
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Write any additional information or remarks here..."
                  maxLength={500}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                  rows="4"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Maximum 500 characters: {formData.remarks.length}/500
                </p>
              </div>
            </div>
          </section>

          {/* Terms and Actions */}
          <div className="bg-gray-50 p-6 rounded-xl">
            {/* Terms Agreement */}
            <div className="mb-6">
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-5 h-5 mt-1"
                  id="termsCheckbox"
                />
                <label htmlFor="termsCheckbox" className="text-gray-700">
                  <span className="font-medium">Declaration:</span> I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that any false statement may result in the rejection of my application.
                </label>
              </div>
              {!formData.agreeTerms && touched.agreeTerms && (
                <p className="text-red-500 text-sm mt-2">You must agree to the terms to proceed</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Reset Form
              </button>
              
              <div className="flex gap-4">
                
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className={`px-8 py-3 rounded-lg font-semibold transition ${
                    isSubmitting || !isFormValid
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Submitting...
                    </span>
                  ) : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            Need help? Contact support at support@specialslip.com or call +880-XXXX-XXXXXX
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpecialSlip;








