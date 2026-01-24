import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../src/api/axios";

function SlipUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    slipType: "",
    city: "",
    travelCountry: "",
    country: "",
    nationality: "",
    gender: "",
    positionAppliedFor: "",
    visaType: "",
    nationalId: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    passportNumber: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    maritalStatus: "",
    medicalCenter: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Date helpers (ADD THIS)
  const formatDateForInput = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day);
  };

  const formatDateForBackend = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 🔹 Fetch single slip
  useEffect(() => {
    const fetchSlip = async () => {
      try {
        const res = await axios.get(`/slips/${id}`);
        const slip = res.data;

        setFormData({
          slipType: slip.slipType || "",
          city: slip.city || "",
          travelCountry: slip.travelCountry || "",
          country: slip.country || "",
          nationality: slip.nationality || "",
          gender: slip.gender || "",
          positionAppliedFor: slip.positionAppliedFor || "",
          visaType: slip.visaType || "",
          nationalId: slip.nationalId || "",
          firstName: slip.firstName || "",
          lastName: slip.lastName || "",
          dateOfBirth: slip.dateOfBirth ? slip.dateOfBirth.split("T")[0] : "",
          passportNumber: slip.passportNumber || "",
          passportIssueDate: slip.passportIssueDate
            ? slip.passportIssueDate.split("T")[0]
            : "",
          passportExpiryDate: slip.passportExpiryDate
            ? slip.passportExpiryDate.split("T")[0]
            : "",
          maritalStatus: slip.maritalStatus || "",
          medicalCenter: slip.medicalCenter || "",
          remarks: slip.remarks || "",
        });

        setError(null);
      } catch (err) {
        setError("Failed to load slip data");
      } finally {
        setLoading(false);
      }
    };

    fetchSlip();
  }, [id]);

  // 🔹 Handle input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`/slips/${id}`, formData);
      alert("Slip updated successfully ✅");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update slip");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Update Slip</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* First Name */}
        <div>
          <label className="block text-sm mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* Last Name */}
        <div>
          <label className="block text-sm mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Slip Type */}
        <div>
          <label className="block text-sm mb-1">Slip Type</label>
          <select
            name="slipType"
            value={formData.slipType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Normal-Slip">Normal Slip</option>
            <option value="Night-Slip">Night Slip</option>
            <option value="Special-Slip">Special Slip</option>
          </select>
        </div>
        {/* Country */}
        <div>
          <label className="block text-sm mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Travel Country */}
        <div>
          <label className="block text-sm mb-1">Travel Country</label>
          <input
            type="text"
            name="travelCountry"
            value={formData.travelCountry}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm mb-1">Date of Birth</label>
          <DatePicker
            selected={formatDateForInput(formData.dateOfBirth)}
            onChange={(date) => {
              const formattedDate = formatDateForBackend(date);
              handleChange({
                target: { name: "dateOfBirth", value: formattedDate },
              });
            }}
            dateFormat="dd/MM/yyyy"
            className="w-full border rounded px-3 py-2"
            wrapperClassName="w-full"
            placeholderText="DD/MM/YYYY"
            showYearDropdown
            yearDropdownItemNumber={100}
            scrollableYearDropdown
            maxDate={new Date()}
          />
        </div>
        {/* Nationality */}
        <div>
          <label className="block text-sm mb-1">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 capitalize "
          >
            <option value={formData.gender}>{formData.gender}</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm mb-1">Marital Status</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 capitalize"
          >
            <option value={formData.maritalStatus} >{formData.maritalStatus}</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
          </select>
        </div>

        {/* Position Applied For */}

        <div>
          <label className="block text-sm mb-1">Position Applied For</label>
          <input
            type="text"
            name="positionAppliedFor"
            value={formData.positionAppliedFor}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Visa Type */}
        <div>
          <label className="block text-sm mb-1">Visa Type</label>
          <input
            type="text"
            name="visaType"
            value={formData.visaType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* National ID */}
        <div>
          <label className="block text-sm mb-1">National ID</label>
          <input
            type="text"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Passport */}
        <div>
          <label className="block text-sm mb-1">Passport</label>
          <input
            type="text"
            name="passportNumber"
            value={formData.passportNumber}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* Passport Issue Date */}
        <div>
          <label className="block text-sm mb-1">Passport Issue Date</label>
          <DatePicker
            selected={formatDateForInput(formData.passportIssueDate)}
            onChange={(date) =>
              handleChange({
                target: {
                  name: "passportIssueDate",
                  value: formatDateForBackend(date),
                },
              })
            }
            dateFormat="dd/MM/yyyy"
            className="w-full border rounded px-3 py-2"
            wrapperClassName="w-full"
            placeholderText="DD/MM/YYYY"
            showYearDropdown
            yearDropdownItemNumber={50}
            scrollableYearDropdown
            maxDate={new Date()}
          />
        </div>
        {/* Passport Expiry Date */}
        <div>
          <label className="block text-sm mb-1">Passport Expiry Date</label>
          <DatePicker
            selected={formatDateForInput(formData.passportExpiryDate)}
            onChange={(date) =>
              handleChange({
                target: {
                  name: "passportExpiryDate",
                  value: formatDateForBackend(date),
                },
              })
            }
            dateFormat="dd/MM/yyyy"
            className="w-full border rounded px-3 py-2"
            wrapperClassName="w-full"
            placeholderText="DD/MM/YYYY"
            minDate={new Date()} // ⛔ cannot expire in past
            showYearDropdown
            yearDropdownItemNumber={20} // future-focused
            scrollableYearDropdown
          />
        </div>

        {/* Medical Center */}
        <div>
          <label className="block text-sm mb-1">Center</label>
          <input
            type="text"
            name="medicalCenter"
            value={formData.medicalCenter}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Remarks */}
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="sm:col-span-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {saving ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SlipUpdate;
