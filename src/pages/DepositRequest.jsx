import React, { useState } from "react";
import axios from "../src/api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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
      text: "নগদে পেমন্ট করলে অবশ্যই হাজারে 10 টাকা করে খরচ প্রদান করতে হবে।",
    },
    Bkash: {
      label: "Bkash personal",
      account: "01951337553",
      text: "বিকাশে পেমন্ট করলে অবশ্যই হাজারে 10 টাকা করে খরচ প্রদান করতে হবে।",
    },
    "Bkash Payment": {
      label: "Bkash Payment",
      account: "01634846064",
      text: "বিকাশে পেমন্ট করলে অবশ্যই হাজারে 10 টাকা করে খরচ প্রদান করতে হবে।",
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
      navigate("/depositHistory");

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
          "Something went wrong. Please try again.",
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
                "SOUTHEAST BANK LIMITED",
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
              <p className="text-gray-800">
                {paymentAccounts[formData.paymentMethod].Name}
              </p>
              <p className="text-gray-800">
                {paymentAccounts[formData.paymentMethod].Branch}
              </p>
              <p className="text-gray-800">
                {paymentAccounts[formData.paymentMethod].text}
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
            <DatePicker
              selected={formatDateForInput(formData.depositDate)}
              onChange={(date) => {
                const formattedDate = formatDateForBackend(date);
                handleChange({
                  target: { name: "depositDate", value: formattedDate },
                });
              }}
              dateFormat="dd/MM/yyyy"
              className={`w-full border rounded-lg p-2 ${
                errors.depositDate ? "border-red-500" : ""
              }`}
              wrapperClassName="w-full"
              placeholderText="DD/MM/YYYY"
            />

            <DatePicker
              selected={
                formData.depositTime
                  ? new Date(`1970-01-01T${formData.depositTime}`)
                  : null
              }
              onChange={(date) => {
                const hours = String(date.getHours()).padStart(2, "0"); // 24-hour
                const minutes = String(date.getMinutes()).padStart(2, "0");
                handleChange({
                  target: {
                    name: "depositTime",
                    value: `${hours}:${minutes}`,
                  },
                });
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={5}
              timeCaption="Time"
              dateFormat="hh:mm aa"
              className={`w-full border rounded-lg p-2 ${
                errors.depositTime ? "border-red-500" : ""
              }`}
              wrapperClassName="w-full"
              placeholderText="HH:MM AM/PM"
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
