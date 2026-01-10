import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const tableData = [
  {
    serial: 1,
    txnId: "4f71bdaf",
    user: "rabbi839",
    type: "Slip Payment",
    created: "27/11/2025 06:19 PM",
    id: "200427",
    slip: "Normal Night Slip A04830320",
    center: "PERFECT MEDICARE LTD.",
    remarks: "KABIR",
    refDate: "28/11/2025 12:31 AM",
    amount: "-400.00",
    balance: "93998.60",
  },
  {
    serial: 2,
    txnId: "4f71bdaf",
    user: "rabbi839",
    type: "Deposit Request",
    created: "26/11/2025 04:10 PM",
    id: "200428",
    slip: "-",
    center: "PERFECT MEDICARE LTD.",
    remarks: "AUTO",
    refDate: "26/11/2025 04:10 PM",
    amount: "+1000.00",
    balance: "94398.60",
  },
];

const Transaction = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("all");
  const [filteredData, setFilteredData] = useState(tableData);

  // 🔍 FILTER LOGIC
  const applyFilter = () => {
    let data = [...tableData];

    // Filter by type
    if (status !== "all") {
      data = data.filter((item) =>
        status === "slip"
          ? item.type === "Slip Payment"
          : item.type === "Deposit Request"
      );
    }

    // Filter by date range
    if (startDate) {
      data = data.filter(
        (item) =>
          new Date(item.created.split(" ")[0].split("/").reverse().join("-")) >=
          startDate
      );
    }

    if (endDate) {
      data = data.filter(
        (item) =>
          new Date(item.created.split(" ")[0].split("/").reverse().join("-")) <=
          endDate
      );
    }

    setFilteredData(data);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold text-indigo-600 mb-10">
        📊 Transaction Ledger
      </h1>
      {/* Filters */}
      <div className="bg-white p-4 md:p-5 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Transaction Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Transaction Type
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="deposit">Deposit Request</option>
              <option value="slip">Slip Payment</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              placeholderText="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              isClearable
              maxDate={new Date()}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              placeholderText="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              isClearable
              minDate={startDate}
              maxDate={new Date()}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Apply Button */}
          <div className="lg:col-span-2 flex items-end">
            <button
              onClick={applyFilter}
              className="w-full h-[42px] bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border border-gray-300">
            <thead className="bg-neutral-800 text-white">
              <tr>
                {[
                  "S/L",
                  "TXN ID",
                  "USER",
                  "TYPE",
                  "CREATED",
                  "ID",
                  "SLIP",
                  "ASSIGNED CENTER",
                  "REMARKS",
                  "REF DATE",
                  "AMOUNT",
                  "BALANCE",
                ].map((head) => (
                  <th key={head} className="px-4 py-2 border border-gray-300">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{row.serial}</td>
                    <td className="border px-4 py-2">{row.txnId}</td>
                    <td className="border px-4 py-2">{row.user}</td>
                    <td className="border px-4 py-2 text-green-600">
                      {row.type}
                    </td>
                    <td className="border px-4 py-2">{row.created}</td>
                    <td className="border px-4 py-2">{row.id}</td>
                    <td className="border px-4 py-2">{row.slip}</td>
                    <td className="border px-4 py-2">{row.center}</td>
                    <td className="border px-4 py-2">{row.remarks}</td>
                    <td className="border px-4 py-2">{row.refDate}</td>
                    <td className="border px-4 py-2 text-red-500 font-medium">
                      {row.amount}
                    </td>
                    <td className="border px-4 py-2 font-medium">
                      {row.balance}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="py-6 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
