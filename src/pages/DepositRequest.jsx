import React, { useState, useEffect } from "react";
import axios from "../src/api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DepositRequest = () => {
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: ".....",
    referenceNo: "",
    depositDate: "",
    depositTime: "",
    depositSlip: null,
    remarks: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get("/payment-methods");
      const methods = response.data.data || [];
      setPaymentMethods(methods);
    } catch (error) {
      toast.error("Error fetching payment methods");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, depositSlip: "Max 5MB" }));
        toast.error("File size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, depositSlip: "Image only" }));
        toast.error("Please select an image file");
        return;
      }

      setFormData((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, depositSlip: "" }));

      const fileNameDisplay = document.getElementById("file-name");
      if (fileNameDisplay) {
        fileNameDisplay.textContent = file.name;
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "paymentMethod") {
        if (value === ".....") {
          setSelectedMethod(null);
        } else {
          const method = paymentMethods.find((m) => m._id === value);
          setSelectedMethod(method || null);
        }
        setErrors((prev) => ({ ...prev, paymentMethod: "" }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleDateChange = (date) => {
    if (!date) return;
    const formattedDate = formatDateForBackend(date);
    setFormData((prev) => ({ ...prev, depositDate: formattedDate }));
    setErrors((prev) => ({ ...prev, depositDate: "" }));
  };

  const handleTimeChange = (date) => {
    if (!date) return;
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    setFormData((prev) => ({ ...prev, depositTime: `${hours}:${minutes}` }));
    setErrors((prev) => ({ ...prev, depositTime: "" }));
  };

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || Number(formData.amount) <= 0)
      newErrors.amount = "Required";
    if (formData.paymentMethod === ".....")
      newErrors.paymentMethod = "Required";
    if (!formData.referenceNo?.trim()) newErrors.referenceNo = "Required";
    if (!formData.depositDate) newErrors.depositDate = "Required";
    if (!formData.depositTime) newErrors.depositTime = "Required";
    if (!formData.depositSlip) newErrors.depositSlip = "Required";
    if (!formData.remarks?.trim()) newErrors.remarks = "Required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      await axios.post("/deposits", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Deposit request submitted successfully!");
      navigate("/depositHistory");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to submit deposit request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-green-600 mb-2">
            Deposit Request
          </h1>
          <p className="text-gray-600">
            Fill in the details below to submit a new deposit request. Make sure
            all information is accurate.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit}>
            {/* Desktop Table Layout - Compact Version */}
            <div className="hidden md:block">
              {/* First Row - Amount, Payment, Reference */}
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-3 gap-0">
                  <div className="bg-gray-50 p-3 font-semibold text-gray-700 border-r border-gray-200 text-sm">
                    Amount (BDT):
                  </div>
                  <div className="bg-gray-50 p-3 font-semibold text-gray-700 border-r border-gray-200 text-sm">
                    Payment System:
                  </div>
                  <div className="bg-gray-50 p-3 font-semibold text-gray-700 text-sm">
                    Reference No:
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-0">
                  <div className="p-3 border-r border-gray-200">
                    <div className="relative">
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="1"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-sm ${
                          errors.amount ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter amount"
                      />
                    </div>
                    {errors.amount && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <div className="p-3 border-r border-gray-200">
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-sm ${
                        errors.paymentMethod
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value=".....">Select payment system</option>
                      {paymentMethods.map((method, index) => (
                        <option key={index} value={method.methodName}>
                          {method.methodName}
                        </option>
                      ))}
                    </select>
                    {errors.paymentMethod && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>

                  <div className="p-3">
                    <input
                      type="text"
                      name="referenceNo"
                      value={formData.referenceNo}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-sm ${
                        errors.referenceNo
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter reference number"
                    />
                    {errors.referenceNo && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.referenceNo}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Second Row - Compact Date/Time, Slip, Remarks */}
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-3 gap-0">
                  <div className="bg-gray-50 p-3 font-semibold text-gray-700 border-r border-gray-200 text-sm">
                    Deposited Date & Time *
                  </div>
                  <div className="bg-gray-50 p-3 font-semibold text-gray-700 border-r border-gray-200 text-sm">
                    Deposit Slip:
                  </div>
                  <div className="bg-gray-50 p-3 font-semibold text-gray-700 text-sm">
                    Remarks
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-0">
                  {/* Date & Time - Compact */}
                  <div className="p-3 border-r border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <DatePicker
                          selected={formatDateForInput(formData.depositDate)}
                          onChange={handleDateChange}
                          dateFormat="dd/MM/yyyy"
                          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-sm ${
                            errors.depositDate
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholderText="Date"
                          maxDate={new Date()}
                        />
                      </div>
                      <div>
                        <DatePicker
                          selected={
                            formData.depositTime
                              ? new Date(`1970-01-01T${formData.depositTime}`)
                              : null
                          }
                          onChange={handleTimeChange}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={5}
                          timeCaption="Time"
                          dateFormat="HH:mm"
                          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-sm ${
                            errors.depositTime
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholderText="Time (24h)"
                        />
                      </div>
                    </div>
                    {(errors.depositDate || errors.depositTime) && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.depositDate || errors.depositTime}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 leading-tight">
                      Enter exact date & time of deposit
                    </p>
                  </div>

                  {/* Deposit Slip - Compact */}
                  <div className="p-3 border-r border-gray-200">
                    <div className="relative">
                      <input
                        type="file"
                        name="depositSlip"
                        onChange={handleChange}
                        accept="image/*"
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 hover:bg-gray-50 transition duration-150">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-gray-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                              ></path>
                            </svg>
                            <span
                              className="text-sm text-gray-600 truncate max-w-[120px]"
                              id="file-name"
                            >
                              Choose File
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Browse
                          </span>
                        </div>
                      </label>
                    </div>
                    {errors.depositSlip && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.depositSlip}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Max 5MB, Image only
                    </p>
                  </div>

                  {/* Remarks - Compact */}
                  <div className="p-3">
                    <textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      rows="2"
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 resize-none text-sm ${
                        errors.remarks ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter remarks..."
                    />
                    {errors.remarks && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.remarks}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout - Compact */}
            <div className="md:hidden space-y-4 p-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Amount (BDT):
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  className={`w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-sm ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
                )}
              </div>

              {/* Payment System */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Payment System:
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-sm ${
                    errors.paymentMethod ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value=".....">Select payment system</option>
                  {paymentMethods.map((method) => (
                    <option key={method._id} value={method.methodName}>
                      {method.methodName}
                    </option>
                  ))}
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.paymentMethod}
                  </p>
                )}
              </div>

              {/* Reference No */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Reference No:
                </label>
                <input
                  type="text"
                  name="referenceNo"
                  value={formData.referenceNo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-sm ${
                    errors.referenceNo ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter reference number"
                />
                {errors.referenceNo && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.referenceNo}
                  </p>
                )}
              </div>

              {/* Date & Time - Compact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Deposited Date & Time *
                </label>
                <div className="flex justify-between">
                  <div>
                    <DatePicker
                      selected={formatDateForInput(formData.depositDate)}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yy"
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-sm ${
                        errors.depositDate
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholderText="Date"
                      maxDate={new Date()}
                    />
                  </div>
                  <div>
                    <DatePicker
                      selected={
                        formData.depositTime
                          ? new Date(`1970-01-01T${formData.depositTime}`)
                          : null
                      }
                      onChange={handleTimeChange}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={5}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-sm ${
                        errors.depositTime
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholderText="Time"
                    />
                  </div>
                </div>
                {(errors.depositDate || errors.depositTime) && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.depositDate || errors.depositTime}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter exact date & time
                </p>
              </div>

              {/* Deposit Slip - Compact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Deposit Slip:
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="depositSlip"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                    id="file-upload-mobile"
                  />
                  <label
                    htmlFor="file-upload-mobile"
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between border border-gray-300 rounded px-3 py-2.5 hover:bg-gray-50 transition duration-150">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          ></path>
                        </svg>
                        <span
                          className="text-sm text-gray-600 truncate max-w-[150px]"
                          id="file-name-mobile"
                        >
                          Choose File
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Browse
                      </span>
                    </div>
                  </label>
                </div>
                {errors.depositSlip && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.depositSlip}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Max 5MB, Image only
                </p>
              </div>

              {/* Remarks - Compact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="2"
                  className={`w-full px-3 py-2.5 border rounded focus:outline-none focus:ring-1 focus:ring-green-500 resize-none text-sm ${
                    errors.remarks ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter remarks..."
                />
                {errors.remarks && (
                  <p className="mt-1 text-xs text-red-600">{errors.remarks}</p>
                )}
              </div>
            </div>

            {/* Selected Account Info - Compact */}
            {selectedMethod && (
              <div className="border-t border-gray-200 p-3 bg-blue-50">
                <h3 className="font-semibold text-blue-800 mb-2 text-sm">
                  Account Details:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-600">Account:</p>
                    <p className="font-medium text-sm">
                      {selectedMethod.account}
                    </p>
                  </div>
                  {selectedMethod.methodName && (
                    <div>
                      <p className="text-xs text-gray-600">Method:</p>
                      <p className="font-medium text-sm">
                        {selectedMethod.methodName}
                      </p>
                    </div>
                  )}
                  {selectedMethod.name && (
                    <div>
                      <p className="text-xs text-gray-600">Name:</p>
                      <p className="font-medium text-sm">
                        {selectedMethod.name}
                      </p>
                    </div>
                  )}
                  {selectedMethod.branch && (
                    <div>
                      <p className="text-xs text-gray-600">Branch:</p>
                      <p className="font-medium text-sm">
                        {selectedMethod.branch}
                      </p>
                    </div>
                  )}
                  {selectedMethod.text && (
                    <div className="md:col-span-3">
                      <p className="text-xs text-gray-600">Note:</p>
                      <p className="font-medium text-sm italic">
                        {selectedMethod.text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 text-sm ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Submit Deposit Request"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositRequest;
