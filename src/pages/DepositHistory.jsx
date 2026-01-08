import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const tableData = [
  {
    serial: 1,
    id: "123456",
    username: "rabbi839",
    accountType: "PREPAID",
    amount: "-94,000.00",
    status: "Approved",
    adminRemarks: "None",
    userRemarks: "BILL",
    paymentDate: "Nov 16, 2025, 6:00 PM",
    requestDate: "Nov 16, 2025, 6:20 PM",
  },
  {
    serial: 2,
    id: "123457",
    username: "rabbi839",
    accountType: "PREPAID",
    amount: "-94,000.00",
    status: "Approved",
    adminRemarks: "Automatic Approved",
    userRemarks: "BILL 011",
    paymentDate: "Nov 16, 2025, 6:00 PM",
    requestDate: "Nov 16, 2025, 6:20 PM",
  },
  {
    serial: 3,
    id: "123458",
    username: "rabbi839",
    accountType: "PREPAID",
    amount: "-94,000.00",
    status: "Approved",
    adminRemarks: "Automatic Approved",
    userRemarks: "BILL",
    paymentDate: "Nov 16, 2025, 6:00 PM",
    requestDate: "Nov 16, 2025, 6:20 PM",
  },
];

const DepositHistory = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("all");

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-indigo-500">
       🕒 Deposit Request History
      </h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              isClearable
              showPopperArrow={false}
              maxDate={new Date()}
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              isClearable
              showPopperArrow={false}
              minDate={startDate}
              maxDate={new Date()}
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Button */}
          <div className="lg:col-span-2">
            <button className="w-full bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border border-gray-300">
            <thead className="bg-neutral-700 text-white">
              <tr>
                {[
                  "Serial",
                  "ID",
                  "Username",
                  "Amount",
                  "Status",
                  "Remarks By Admin",
                  "Remarks By User",
                  "Deposit Slip",
                  "Payment Submitted Date",
                  "Deposit Request Date",
                ].map((head) => (
                  <th key={head} className="px-4 py-2 border border-gray-300">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tableData.map((row) => (
                <tr key={row.serial} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    {row.serial}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">{row.id}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    {row.username}
                    <span className="text-xs text-gray-500 ml-1">
                      ({row.accountType})
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-red-600 font-semibold">
                    {row.amount}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {row.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {row.adminRemarks}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {row.userRemarks}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <button className="text-blue-600 hover:underline font-medium">
                      View
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">
                    {row.paymentDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 whitespace-nowrap">
                    {row.requestDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepositHistory;
