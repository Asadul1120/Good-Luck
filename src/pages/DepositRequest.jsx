import React, { useState } from "react";
import axios from "../src/api/axios";

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

  // Payment method wise account info
  const paymentAccounts = {
    "SOUTHEAST BANK LIMITED": {
      label: "SOUTHEAST BANK LIMITED",
      account: "A/C No:002712100017581",
      Name: "Md Zahirul Islam",
      Branch: "Motijheel Branch",
    },
    Nagad: {
      label: "Nagad personal",
      account: "01951337553",
    },
    Bkash: {
      label: "Bkash personal",
      account: "01951337553",
    },
    "Bkash Payment": {
      label: "Bkash Payment",
      account: "01634846064",
    },
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("Deposit slip must be under 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Only image files allowed");
        return;
      }

      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (formData.paymentMethod === ".....")
      newErrors.paymentMethod = "Select payment method";
    if (!formData.referenceNo)
      newErrors.referenceNo = "Reference No is required";
    if (!formData.depositDate)
      newErrors.depositDate = "Deposit date is required";
    if (!formData.depositTime)
      newErrors.depositTime = "Deposit time is required";
    if (!formData.depositSlip)
      newErrors.depositSlip = "Deposit slip is required";
    if (!formData.remarks) newErrors.remarks = "Remarks are required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) return;

    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      await axios.post("/deposits", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Deposit request submitted successfully!");

      // optional reset
      setFormData({
        amount: "",
        paymentMethod: ".....",
        referenceNo: "",
        depositDate: "",
        depositTime: "",
        depositSlip: null,
        remarks: "",
      });
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">
          Deposit Request
        </h1>
        <p className="text-gray-700 mb-4">
          Fill in the details below to submit a new deposit request. Make sure
          all information is accurate.
        </p>
        <hr className="mb-6" />

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 ${
                errors.amount ? "border-red-500" : ""
              }`}
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Payment Method *
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 ${
                errors.paymentMethod ? "border-red-500" : ""
              }`}
            >
              {[
                ".....",
                "SOUTHEAST BANK LIMITED.",
                "Nagad",
                "Bkash",
                "Bkash Payment",
                "Other or cash",
                "Refund",
              ].map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          {/* Auto account info */}
          {paymentAccounts[formData.paymentMethod] && (
            <div className="bg-gray-100 border rounded-lg p-3">
              <p className="text-sm font-semibold text-gray-700">
                {paymentAccounts[formData.paymentMethod].label}
              </p>
              <p className="text-gray-800">
                {paymentAccounts[formData.paymentMethod].account}
              </p>
            </div>
          )}

          {/* Reference No */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Reference No *
            </label>
            <input
              type="text"
              name="referenceNo"
              value={formData.referenceNo}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 ${
                errors.referenceNo ? "border-red-500" : ""
              }`}
              placeholder="Enter reference number"
            />
            {errors.referenceNo && (
              <p className="text-red-500 text-sm mt-1">{errors.referenceNo}</p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="depositDate"
              value={formData.depositDate}
              onChange={handleChange}
              className={`border rounded-lg p-2 ${
                errors.depositDate ? "border-red-500" : ""
              }`}
            />
            <input
              type="time"
              name="depositTime"
              value={formData.depositTime}
              onChange={handleChange}
              className={`border rounded-lg p-2 ${
                errors.depositTime ? "border-red-500" : ""
              }`}
            />
          </div>

          {/* Deposit Slip */}
          <input
            type="file"
            name="depositSlip"
            onChange={handleChange}
            className={`w-full border rounded-lg p-2 ${
              errors.depositSlip ? "border-red-500" : ""
            }`}
          />

          {/* Remarks */}
          <input
            type="text"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className={`w-full border rounded-lg p-2 ${
              errors.remarks ? "border-red-500" : ""
            }`}
            placeholder="Enter remarks"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositRequest;
