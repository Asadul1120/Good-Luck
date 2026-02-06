import React, { useEffect, useState, useMemo } from "react";
import axios from "../src/api/axios";
import { useAuth } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const getStatusColor = (status) => {
  switch (status) {
    case "complete":
      return "bg-green-600";
    case "cancelled":
      return "bg-red-600";
    case "no-balance":
      return "bg-orange-600";
    case "processing":
      return "bg-cyan-600";
    case "processing-link":
      return "bg-blue-600";
    case "no-queue":
      return "bg-purple-600";
    default:
      return "bg-yellow-500";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "no-balance":
      return "NO BALANCE";
    case "no-queue":
      return "ON QUEUE";
    default:
      return status?.toUpperCase();
  }
};

function UserSlipPayments() {
  const { user } = useAuth();
  const userId = user?._id;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Filters
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("all");

  // 🔹 Click count for payment link
  const [clickCounts, setClickCounts] = useState({});

  // ================= FETCH =================
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/slipPayment/my/${userId}`);

        const sortedData = (res.data.slipPayments || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setData(sortedData);
        setError(null);
      } catch (err) {
        setError("Failed to load slip payments");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // ================= SMART DATE SYNC =================
  // Start date change → end date auto adjust
  useEffect(() => {
    if (!startDate) return;

    setEndDate((prevEnd) => {
      if (!prevEnd || prevEnd < startDate) {
        return startDate;
      }
      return prevEnd;
    });
  }, [startDate]);

  // ================= FILTER LOGIC =================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.createdAt);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (itemDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (itemDate > end) return false;
      }

      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [data, startDate, endDate, statusFilter]);

  const tableHeaders = [
    "S.N",
    "Slip Type",
    "Date & Time",
    "Status",
    "Allocate Center",
    "Username",
    "Email",
    "Phone",
    "Actions",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-4 px-2 sm:px-4 max-w-7xl mx-auto">
      <h1 className="text-lg sm:text-xl font-bold mb-4 text-center">
        My Slip Payments
      </h1>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
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

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              isClearable
              showPopperArrow={false}
              minDate={startDate || undefined}
              maxDate={new Date()}
              className="border rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 w-full text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholderText="End date"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">All</option>
              <option value="complete">Complete</option>
              <option value="no-balance">No Balance</option>
              <option value="no-queue">On Queue</option>
              <option value="processing">Processing</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-[900px] w-full text-xs sm:text-sm text-center border border-gray-300">
          <thead className="bg-neutral-500 text-white uppercase">
            <tr>
              {tableHeaders.map((head) => (
                <th key={head} className="px-2 py-2 border border-gray-300">
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  <td className="border px-2 py-2">{index + 1}</td>
                  <td className="border px-2 py-2 font-semibold">
                    {row.slipType}
                  </td>

                  <td className="border px-2 py-2">
                    <div className="flex flex-col items-center">
                      <span>
                        {new Date(row.createdAt).toLocaleDateString("en-GB")}
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

                  {/* Status Column */}
                  <td className="border px-2 py-1.5 sm:px-4 sm:py-3">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={async () => {
                          // ✅ COMPLETE → open payment link + click count
                          if (row.status === "complete") {
                            setClickCounts((prev) => ({
                              ...prev,
                              [row._id]: (prev[row._id] || 0) + 1,
                            }));

                            if (row.paymentLink) {
                              window.open(
                                row.paymentLink,
                                "_blank",
                                "noopener,noreferrer",
                              );
                            }
                            return;
                          }

                          // ⛔ locked statuses
                          if (
                            row.status === "processing" ||
                            row.status === "cancelled" ||
                            row.status === "other"
                          ) {
                            return;
                          }

                          // 🔄 no-balance → update status
                          try {
                            const res = await axios.patch(
                              `/slipPayment/${row._id}/user-update-status`,
                            );

                            const newStatus = res.data.data.newStatus;

                            setData((prev) =>
                              prev.map((item) =>
                                item._id === row._id
                                  ? { ...item, status: newStatus }
                                  : item,
                              ),
                            );
                          } catch (err) {
                            alert(
                              err.response?.data?.message ||
                                "Status update failed",
                            );
                          }
                        }}
                        className={`px-2 py-1 text-xs sm:text-sm rounded text-white font-semibold
        ${
          row.status === "complete"
            ? "cursor-pointer hover:opacity-90"
            : "cursor-not-allowed opacity-80"
        }
        ${getStatusColor(row.status)}
      `}
                      >
                        {getStatusText(row.status)}
                      </button>

                      {/* Comment Tooltip */}
                      {row.comment && (
                        <span className="relative group text-[11px] text-gray-600">
                          {row.comment.length > 10
                            ? `${row.comment.slice(0, 10)}...`
                            : row.comment}

                          <span
                            className="absolute z-50 hidden group-hover:block bg-gray-200 text-red-600
          top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded text-xs
          max-w-[260px] whitespace-normal shadow-lg"
                          >
                            {row.comment}
                          </span>
                        </span>
                      )}

                      {/* Click Count */}
                      {clickCounts[row._id] > 0 && (
                        <span className="text-[11px] text-gray-500">
                          Clicked: {clickCounts[row._id]}
                          {clickCounts[row._id] > 1 ? " times" : " time"}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="border px-2 py-2">
                    {row.allocateCenter || "-"}
                  </td>
                  <td className="border px-2 py-2">{row.username || "-"}</td>
                  <td className="border px-2 py-2">{row.email || "-"}</td>
                  <td className="border px-2 py-2">{row.phone || "-"}</td>

                  <td className="border px-2 py-2 ">None</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="py-8 text-center text-gray-500"
                >
                  No slip payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserSlipPayments;
