// import React from "react";

// const DepositRequest = () => {
//   return (
//     <div>
//       <div>
//         <h1>Deposit Request</h1>
//         <p>
//           Fill in the details below to submit a new deposit request. Make sure
//           all information is accurate.
//         </p>
//         <hr />
//         <div>
//           <label>Amount:</label>
//           <input type="number" id="amount" name="amount" required />
//         </div>

//         <div>
//           <label>Payment Method:</label>
//           <select id="payment-method" name="payment-method" required>
//             {[
//               ".....",
//               "NRBC Bank PLC.",
//               "Nagad",
//               "Bkash",
//               "Rocket",
//               "Eastern Bank Limited.",
//               "Other or cash",
//               "Refund",
//             ].map((method) => (
//               <option key={method} value={method}>
//                 {method}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label>Reference No: </label>
//           <input type="text" id="reference-no" name="reference-no" required />
//         </div>
//         <div>
//           <label>Deposited Date & Time * </label>
//           <input type="date" />
//           <input type="time" />
//         </div>
//         <p className="text-sm text-gray-500">
//           Please enter the exact date and time of the deposit (e.g., 02/04/2025
//           04:30 PM).
//         </p>
//         <div>
//           <label>Deposit Slip:</label>
//           <input type="file" id="deposit-slip" name="deposit-slip" required />
//         </div>
//         <div>
//           <label>Remarks:</label>
//           <input type="text" id="remarks" name="remarks" required />
//         </div>

//         <button type="submit">Submit</button>
//       </div>
//     </div>
//   );
// };

// export default DepositRequest;




import React, { useState } from "react";

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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Simple validation
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (formData.paymentMethod === ".....") newErrors.paymentMethod = "Select payment method";
    if (!formData.referenceNo) newErrors.referenceNo = "Reference No is required";
    if (!formData.depositDate) newErrors.depositDate = "Deposit date is required";
    if (!formData.depositTime) newErrors.depositTime = "Deposit time is required";
    if (!formData.depositSlip) newErrors.depositSlip = "Deposit slip is required";
    if (!formData.remarks) newErrors.remarks = "Remarks are required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", formData);
      alert("Deposit request submitted successfully!");
      // Reset form if needed
      // setFormData({...initialState});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">
          Deposit Request
        </h1>
        <p className="text-gray-700 mb-4">
          Fill in the details below to submit a new deposit request. Make sure all information is accurate.
        </p>
        <hr className="mb-6" />

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Amount */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${errors.amount ? "border-red-500" : ""}`}
              placeholder="Enter amount"
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Payment Method *</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${errors.paymentMethod ? "border-red-500" : ""}`}
            >
              {[
                ".....",
                "NRBC Bank PLC.",
                "Nagad",
                "Bkash",
                "Rocket",
                "Eastern Bank Limited.",
                "Other or cash",
                "Refund",
              ].map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
          </div>

          {/* Reference No */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Reference No *</label>
            <input
              type="text"
              name="referenceNo"
              value={formData.referenceNo}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${errors.referenceNo ? "border-red-500" : ""}`}
              placeholder="Enter reference number"
            />
            {errors.referenceNo && <p className="text-red-500 text-sm mt-1">{errors.referenceNo}</p>}
          </div>

          {/* Deposit Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Deposit Date *</label>
              <input
                type="date"
                name="depositDate"
                value={formData.depositDate}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${errors.depositDate ? "border-red-500" : ""}`}
              />
              {errors.depositDate && <p className="text-red-500 text-sm mt-1">{errors.depositDate}</p>}
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Deposit Time *</label>
              <input
                type="time"
                name="depositTime"
                value={formData.depositTime}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${errors.depositTime ? "border-red-500" : ""}`}
              />
              {errors.depositTime && <p className="text-red-500 text-sm mt-1">{errors.depositTime}</p>}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Please enter the exact date and time of the deposit (e.g., 02/04/2025 04:30 PM).
          </p>

          {/* Deposit Slip */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Deposit Slip *</label>
            <input
              type="file"
              name="depositSlip"
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${errors.depositSlip ? "border-red-500" : ""}`}
            />
            {errors.depositSlip && <p className="text-red-500 text-sm mt-1">{errors.depositSlip}</p>}
          </div>

          {/* Remarks */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Remarks *</label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 ${errors.remarks ? "border-red-500" : ""}`}
              placeholder="Enter remarks"
            />
            {errors.remarks && <p className="text-red-500 text-sm mt-1">{errors.remarks}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
          >
            Submit
          </button>

        </form>
      </div>
    </div>
  );
};

export default DepositRequest;
