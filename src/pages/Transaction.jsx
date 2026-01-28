import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../src/api/axios";
import { useAuth } from "../context/AuthContext";

const Transaction = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [status, setStatus] = useState("all");
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  // Format date to DD/MM/YYYY HH:MM AM/PM
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`transaction/user/${user._id}`);

        // Check if response.data.data exists
        if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          const formattedData = response.data.data.map((item) => ({
            serial: item.serial || 0,
            txnId: item.transactionId || "-",
            user: item.username || "-",
            type: item.type || "-",
            created: formatDate(item.created),
            id: item.slipId || "-",
            slip: item.slipType || "-",
            center: item.assignedCenter || "-",
            remarks: item.remarks || "-",
            refDate: formatDate(item.refDate),
            amount: item.amount || "0.00",
            balance: item.balanceAfter || "0.00",
            rawCreated: item.created ? new Date(item.created) : null,
            rawType: item.type || "",
          }));

          setTableData(formattedData);
          // Apply filter immediately after fetching data
          applyFilterToData(formattedData);
        } else {
          setTableData([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load transactions. Please try again.");
        setTableData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  // Separate filter function that can be called with data
  const applyFilterToData = (data) => {
    let filtered = [...data];

    // Filter by type
    if (status !== "all") {
      filtered = filtered.filter((item) =>
        status === "slip"
          ? item.type === "Slip Payment"
          : item.type === "Deposit Request",
      );
    }

    // Filter by date range (default to today)
    if (startDate && filtered.length > 0) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      filtered = filtered.filter((item) => {
        if (!item.rawCreated) return false;
        const itemDate = new Date(item.rawCreated);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= start;
      });
    }

    if (endDate && filtered.length > 0) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        if (!item.rawCreated) return false;
        const itemDate = new Date(item.rawCreated);
        return itemDate <= end;
      });
    }

    setFilteredData(filtered);
  };

  // 🔍 FILTER LOGIC
  const applyFilter = () => {
    applyFilterToData(tableData);
  };

  // Apply filter when status, startDate, or endDate changes
  useEffect(() => {
    if (tableData.length > 0) {
      applyFilterToData(tableData);
    }
  }, [status, startDate, endDate, tableData]);

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

      {/* Loading/Error State */}
      {loading && (
        <div className="bg-white p-8 rounded-lg shadow mb-6 text-center">
          <div className="text-lg text-gray-600">Loading transactions...</div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-white p-8 rounded-lg shadow mb-6 text-center">
          <div className="text-lg text-red-600 mb-2">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
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
                      <td className="border px-4 py-2 uppercase">
                        {row.id.slice(0, 6)}
                      </td>
                      <td className="border px-4 py-2">{row.slip}</td>
                      <td className="border px-4 py-2">{row.center}</td>
                      <td className="border px-4 py-2">{row.remarks}</td>
                      <td className="border px-4 py-2">{row.refDate}</td>
                      <td
                        className={`border px-4 py-2 font-medium ${
                          row.amount.startsWith("+")
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
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
                      No transactions found for selected date range
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction;
