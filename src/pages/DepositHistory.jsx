import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../src/api/axios";
import { useAuth } from "../context/AuthContext";

const DepositHistory = () => {
  const { user } = useAuth();
  const userId = user?._id;

  // FIX: Create today date safely without side effects
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
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
        const data = res.data.data || [];
        setTableData(data);
        setFilteredData(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setTableData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // ================= APPLY FILTER =================
  const applyFilter = useCallback(() => {
    // FIX: Clone dates to avoid mutating state
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    const result = tableData.filter((row) => {
      // status filter
      if (status !== "all" && row.statusRaw !== status) return false;

      // date filter
      if (row.createdAt) {
        const createdAt = new Date(row.createdAt);

        // FIX: Proper date comparison without mutating original dates
        if (start && createdAt < start) return false;
        if (end && createdAt > end) return false;
      }

      return true;
    });

    setFilteredData(result);
  }, [tableData, status, startDate, endDate]);

  // FIX: Apply filter when tableData or filters change
  useEffect(() => {
    if (tableData.length > 0) {
      applyFilter();
    }
  }, [tableData, applyFilter]);

  // ================= MODAL =================
  const openModal = useCallback((slipUrl) => {
    if (!slipUrl) return;
    setActiveSlip(slipUrl);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setActiveSlip(null);
  }, []);

  // FIX: Safe date change handlers to prevent date mutation
  const handleStartDateChange = useCallback((date) => {
    if (!date) return;
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    setStartDate(newDate);
  }, []);

  const handleEndDateChange = useCallback((date) => {
    if (!date) return;
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    setEndDate(newDate);
  }, []);

  // FIX: Reset dates to today safely
  const resetDatesToToday = useCallback(() => {
    setStartDate(getToday());
    setEndDate(getToday());
  }, []);

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
              onChange={handleStartDateChange}
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
              onChange={handleEndDateChange}
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
                <tr key={row.id || index} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2 uppercase">
                    {row.id ? row.id.slice(0, 6) : "N/A"}
                  </td>
                  <td className="border px-3 py-2">
                    {row.username || "N/A"}{" "}
                    <span className="text-xs text-gray-500">
                      ({row.accountType || "N/A"})
                    </span>
                  </td>
                  <td className="border px-3 py-2 text-red-600 font-semibold">
                    {row.amount || "0"}
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
                      {row.status || "Unknown"}
                    </span>
                  </td>
                  <td className="border px-3 py-2">
                    {row.adminRemarks || "-"}
                  </td>
                  <td className="border px-3 py-2">{row.userRemarks || "-"}</td>
                  <td className="border px-3 py-2">
                    <button
                      onClick={() => openModal(row.depositSlip)}
                      className="text-blue-600 hover:underline"
                      disabled={!row.depositSlip}
                    >
                      {row.depositSlip ? "View" : "N/A"}
                    </button>
                  </td>
                  <td className="border px-3 py-2 whitespace-nowrap">
                    {row.paymentDate || "-"}
                  </td>
                  <td className="border px-3 py-2 whitespace-nowrap">
                    {row.requestDate || "-"}
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
              className="absolute top-2 right-3 text-xl font-bold hover:text-gray-700"
            >
              ×
            </button>
            <h2 className="text-center font-semibold mb-3">Deposit Slip</h2>
            {activeSlip ? (
              <img
                src={activeSlip}
                alt="Deposit Slip"
                className="w-full rounded border max-h-[70vh] object-contain"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Image+Not+Found";
                }}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Image not available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositHistory;
