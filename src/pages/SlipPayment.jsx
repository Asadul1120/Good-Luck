import React, { useState } from "react";

const SlipPayment = () => {
  const [paymentLink, setPaymentLink] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      paymentLink: paymentLink,
      remarks: remarks,
    };

    console.log("Slip Payment Data:", data);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-6">
      <div className="w-full bg-white rounded-xl shadow-lg p-6 md:p-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Slip Payment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Payment Link
            </label>
            <input
              type="text"
              value={paymentLink}
              onChange={(e) => setPaymentLink(e.target.value)}
              placeholder="Enter payment link"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Remarks if any"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>

          <button
            type="submit"
            className=" bg-stone-800 hover:bg-stone-900 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            Save and Progress
          </button>
        </form>
      </div>
    </div>
  );
};

export default SlipPayment;
