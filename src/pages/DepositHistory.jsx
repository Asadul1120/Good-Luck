import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../src/api/axios";
import { useAuth } from "../context/AuthContext";

const DepositHistory = () => {
  const { user } = useAuth();
  const userId = user?._id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [status, setStatus] = useState("all");

  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlip, setActiveSlip] = useState(null);

  // ================= FETCH DATA =================
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/deposits/user/${userId}`);
        setTableData(res.data.data || []);
        setFilteredData(res.data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // ================= APPLY FILTER =================
  const applyFilter = () => {
    const start = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;

    const end = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;

    const result = tableData.filter((row) => {
      // status
      if (status !== "all" && row.statusRaw !== status) return false;

      const createdAt = new Date(row.createdAt);

      if (start && createdAt < start) return false;
      if (end && createdAt > end) return false;

      return true;
    });

    setFilteredData(result);
  };

  // ================= MODAL =================
  const openModal = (slipUrl) => {
    setActiveSlip(slipUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveSlip(null);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-indigo-500">
        🕒 Deposit Request History
      </h1>

      {/* ================= FILTERS ================= */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              maxDate={new Date()}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              minDate={startDate}
              maxDate={new Date()}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <button
              onClick={applyFilter}
              className="w-full bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white shadow overflow-x-auto">
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
                "Deposit request Date",
              ].map((h) => (
                <th key={h} className="border px-3 uppercase py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-6">
                  No records found
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2 uppercase">
                    {row.id.slice(0, 6)}
                  </td>
                  <td className="border px-3 py-2">
                    {row.username}{" "}
                    <span className="text-xs text-gray-500">
                      ({row.accountType})
                    </span>
                  </td>
                  <td className="border px-3 py-2 text-red-600 font-semibold">
                    {row.amount}
                  </td>
                  <td className="border px-3 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        row.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : row.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="border px-3 py-2">{row.adminRemarks}</td>
                  <td className="border px-3 py-2">{row.userRemarks}</td>
                  <td className="border px-3 py-2">
                    <button
                      onClick={() => openModal(row.depositSlip)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                  <td className="border px-3 py-2 whitespace-nowrap">
                    {row.paymentDate}
                  </td>
                  <td className="border px-3 py-2 whitespace-nowrap">
                    {row.requestDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-4 rounded-lg max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-center font-semibold mb-3">Deposit Slip</h2>
            <img
              src={activeSlip}
              alt="Deposit Slip"
              className="w-full rounded border"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositHistory;
