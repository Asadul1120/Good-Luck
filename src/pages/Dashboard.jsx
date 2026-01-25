import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../src/api/axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?._id;
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickCounts, setClickCounts] = useState({});

  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  // Responsive check with debounce - কমিয়ে 576px করা হয়েছে
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`slips/user/${userId}`);
        setTableData(response.data.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const rowDate = new Date(row.createdAt);

      const start = startDate
        ? new Date(new Date(startDate).setHours(0, 0, 0, 0))
        : null;
      const end = endDate
        ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
        : null;

      const matchType =
        type === "all" ||
        row.slipType?.toLowerCase().includes(type.toLowerCase());

      const matchStatus =
        status === "all" || row.status?.toLowerCase() === status.toLowerCase();

      const matchStartDate = !start || rowDate >= start;
      const matchEndDate = !end || rowDate <= end;

      return matchType && matchStatus && matchStartDate && matchEndDate;
    });
  }, [tableData, type, status, startDate, endDate]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this slip?")) return;

    try {
      await axios.delete(`/slips/${id}`);
      setTableData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      alert("Delete failed. Please try again.");
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric", // 👈 full year
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }, []);

  const getStatusColor = useCallback((status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "complete":
        return "bg-green-600";
      case "approved":
        return "bg-blue-600";
      case "canceled":
        return "bg-red-600";
      case "no-balance":
        return "bg-orange-600";
      case "processing":
        return "bg-cyan-600";
      default:
        return "bg-yellow-500";
    }
  }, []);

  const getStatusText = useCallback((status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "no-balance":
        return "NO BALANCE";
      case "on-queue":
        return "ON QUEUE";
      default:
        return status?.toUpperCase();
    }
  }, []);

  // সব ডিভাইসে একই headers রাখছি
  const tableHeaders = [
    "S.N",
    "ID",
    "Slip_Type",
    "Date_Time",
    "Slip Status",
    "City",
    "T.Country",
    "First Name",
    "Last Name",
    "DOB",
    "Passport",
    "Center",
    "Allocate Center",
    "Remarks",
    "Action",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-2">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 px-2 sm:px-4 max-w-7xl mx-auto">
      {/* Navigation Buttons - মোবাইলের জন্য কল সাইজ */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3 mb-6">
        <Link
          to="/normal-slip"
          className="bg-indigo-500 text-white text-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-semibold shadow hover:bg-indigo-600 transition-colors duration-200 text-xs sm:text-sm"
        >
          Normal Slip
        </Link>
        <Link
          to="/night-slip"
          className="bg-green-500 text-white text-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-semibold shadow hover:bg-green-600 transition-colors duration-200 text-xs sm:text-sm"
        >
          Night Slip
        </Link>
        <Link
          to="/special-slip"
          className="bg-cyan-500 text-white text-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-semibold shadow hover:bg-cyan-600 transition-colors duration-200 text-xs sm:text-sm"
        >
          Special Slip
        </Link>
        <Link
          to="/slip-payment"
          className="bg-amber-500 text-white text-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-semibold shadow hover:bg-amber-600 transition-colors duration-200 text-xs sm:text-sm"
        >
          Slip Payment
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-end">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-600">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => {
                const type = e.target.value;
                setType(type);

                // 🔥 Redirect when Slip-Payment selected
                if (type === "Slip-Payment") {
                  navigate("/userSlipPayments");
                }
              }}
              className="w-full border rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-200"
            >
              <option value="all">All Types</option>
              <option value="Normal-Slip">Normal</option>
              <option value="night">Normal Night</option>
              <option value="special">Special</option>
              <option value="Slip-Payment">Slip Payment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-600">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors duration-200"
            >
              <option value="all">All Status</option>
              <option value="canceled">CANCELLED</option>
              <option value="complete">COMPLETE</option>
              <option value="no-balance">NO-BALANCE</option>
              <option value="on-queue">ON QUEUE</option>
              <option value="processing">PROCESSING</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              isClearable
              showPopperArrow={false}
              maxDate={new Date()}
              className="border rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 w-full text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholderText="Start date"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              isClearable
              showPopperArrow={false}
              minDate={startDate}
              maxDate={new Date()}
              className="border rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 w-full text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholderText="End date"
            />
          </div>

          <div className="lg:col-span-1">
            <button className="w-full bg-indigo-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors duration-200 shadow-sm text-xs sm:text-sm">
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
        Showing {filteredData.length} of {tableData.length} records
      </div>

      {/* Table Section - সব ডিভাইসে full table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm text-center border border-gray-300">
            <thead className="bg-neutral-500 text-white uppercase">
              <tr>
                {tableHeaders.map((head) => (
                  <th
                    key={head}
                    className="px-2 py-1.5 sm:px-4 sm:py-3 border border-gray-300 font-semibold whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr
                    key={row._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Serial Number */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3">
                      {index + 1}
                    </td>

                    {/* ID */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-xs uppercase">
                      {typeof row.user === "string"
                        ? row.user?.slice(0, 6)
                        : row.user?._id?.slice(0, 6)}
                    </td>

                    {/* Slip Type */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3">
                      {row.slipType}
                    </td>

                    {/* Date Time */}
                    <td className="border px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                      <div className="flex flex-col leading-tight items-center">
                        <span className="font-medium">
                          {new Date(row.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[11px] text-gray-600">
                          {new Date(row.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3">
                      <div className="flex flex-col gap-1 items-center">
                        <button
                          onClick={() => {
                            if (row.status !== "complete") return; // ⛔ do nothing

                            // 🔢 increase click count
                            setClickCounts((prev) => ({
                              ...prev,
                              [row._id]: (prev[row._id] || 0) + 1,
                            }));

                            // 🔗 open URL
                            window.open(row.paymentLink, "_blank");
                          }}
                          className={`inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded text-white font-semibold cursor-pointer ${getStatusColor(
                            row.status,
                          )}`}
                        >
                          {getStatusText(row.status)}
                        </button>

                        {row.comments && (
                          <span className="relative group text-[11px]  text-gray-600">
                            {row.comments.slice(0, 10)}...
                            <span className="absolute z-50 hidden group-hover:block bg-gray-200 text-red-500 top-0 left-12 mt-1 px-2 py-1 rounded text-xs max-w-[300px] truncate whitespace-nowrap shadow-lg">
                              {row.comments}
                            </span>
                          </span>
                        )}

                        {/* 🔢 Click count (only shows after click) */}
                        {clickCounts[row._id] > 0 && (
                          <span className="text-[11px] text-gray-500">
                            Clicked: {clickCounts[row._id]}
                            {clickCounts[row._id] > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* City */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3">
                      {row.city}
                    </td>

                    {/* Travel Country */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3">
                      {row.travelCountry}
                    </td>

                    {/* First Name */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3">
                      {row.firstName}
                    </td>

                    {/* Last Name */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3">
                      {row.lastName}
                    </td>

                    {/* Date of Birth */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3">
                      {row.dateOfBirth
                        ? new Date(row.dateOfBirth).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric", // 👈 full year (e.g. 1998)
                            },
                          )
                        : "-"}
                    </td>

                    {/* Passport */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3 font-mono">
                      {row.passportNumber}
                    </td>

                    {/* Center */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3">
                      {row.slipType === "Special-Slip"
                        ? row.medicalCenter
                        : "None"}
                      {/* {row.medicalCenter} */}
                    </td>

                    {/* Allocate Center */}
                    <td className="border px-2 py-1.5 sm:px-2 sm:py-3">
                      {row.allocateCenter}
                    </td>

                    {/* Remarks */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3 max-w-xs truncate">
                      {row.remarks || "-"}
                    </td>

                    {/* Action */}
                    <td className="border px-2 py-1.5 sm:px-4 sm:py-3">
                      {row.status === "complete" ? (
                        "None"
                      ) : (
                        <div className="flex justify-center space-x-1 sm:space-x-2">
                          <Link
                            to={`/slips/edit/${row._id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-xs sm:text-sm"
                          >
                            Edit
                          </Link>
                          <span className="text-gray-400">|</span>
                          <button
                            onClick={() => handleDelete(row._id)}
                            className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200 text-xs sm:text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableHeaders.length}
                    className="py-6 sm:py-8 text-center text-gray-500 text-xs sm:text-sm"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      No data found matching your criteria
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
