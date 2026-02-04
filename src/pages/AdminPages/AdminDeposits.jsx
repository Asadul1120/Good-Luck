import React, { useEffect, useState } from "react";
import axios from "../../src/api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

const AdminDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1);

  // FILTER STATES
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [searchRef, setSearchRef] = useState("");

  // Date filter states
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const res = await axios.get("/deposits/admin");
        setDeposits(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeposits();
  }, []);

  // Amount cleaning helper function
  const cleanAmount = (amt) => {
    if (amt === null || amt === undefined) return 0;
    if (typeof amt === "number") return amt;
    if (typeof amt === "string") {
      // Remove commas and convert to number
      const cleaned = amt.replace(/,/g, "");
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const handleStatusChange = async (depositId, newStatus, amount) => {
    try {
      // Clean the amount before sending
      const cleanAmountValue = cleanAmount(amount);

      await axios.patch(`/deposits/${depositId}/status`, {
        status: newStatus,
        amount: cleanAmountValue,
      });

      setDeposits((prev) =>
        prev.map((d) =>
          d.id === depositId
            ? {
                ...d,
                statusRaw: newStatus,
                status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
                amount: cleanAmountValue,
                // Update formatted amount for display
                formattedAmount: cleanAmountValue.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }),
              }
            : d,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update deposit status");
    }
  };

  const statusColor = (s) => {
    if (s === "approved") return "bg-green-100 text-green-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  // Helper function to check if a date is within range
  const isDateInRange = (dateString) => {
    if (!dateString || !startDate || !endDate) return false;

    const depositDate = new Date(dateString);
    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return depositDate >= start && depositDate <= end;
  };

  // FILTER LOGIC with date filtering
  const filteredDeposits = deposits
    .filter((d) =>
      filterStatus === "all" ? true : d.statusRaw === filterStatus,
    )
    .filter((d) =>
      filterMethod === "all" ? true : d.paymentMethod === filterMethod,
    )
    .filter((d) =>
      d.referenceNo.toLowerCase().includes(searchRef.trim().toLowerCase()),
    )
    // Date filtering - check both paymentDate and requestDate
    .filter((d) => {
      // Use paymentDate first, fall back to requestDate
      const dateToCheck = d.paymentDate || d.requestDate;
      return isDateInRange(dateToCheck);
    });

  // Reset all filters including dates
  const resetAllFilters = () => {
    setFilterStatus("all");
    setFilterMethod("all");
    setSearchRef("");
    setStartDate(new Date());
    setEndDate(new Date());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading deposits...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 px-3 py-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-blue-600 mb-4">
            User Deposit Requests
          </h1>

          {/* ================= FILTER BAR ================= */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-200">
            {/* First row - main filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {/* STATUS */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* PAYMENT METHOD */}
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Methods</option>
                <option value="Bkash">Bkash</option>
                <option value="Nagad">Nagad</option>
                <option value="Bkash Payment">Bkash Payment</option>
                <option value="SOUTHEAST BANK LIMITED">
                  SOUTHEAST BANK LIMITED
                </option>
                <option value="Other or cash">Other or cash</option>
                <option value="Refund">Refund</option>
              </select>

              {/* REFERENCE SEARCH */}
              <input
                type="text"
                placeholder="Search by Reference No"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* RESET ALL */}
              <button
                onClick={resetAllFilters}
                className="w-full bg-blue-600 text-white rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-blue-700 transition"
              >
                Reset All Filters
              </button>
            </div>

            {/* Second row - date filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* START DATE */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Start Date
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={endDate || new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  wrapperClassName="w-full"
                  showYearDropdown
                  yearDropdownItemNumber={20}
                  scrollableYearDropdown
                  isClearable
                />
              </div>

              {/* END DATE */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  End Date
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || null}
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  wrapperClassName="w-full"
                  showYearDropdown
                  yearDropdownItemNumber={20}
                  scrollableYearDropdown
                  isClearable
                />
              </div>

              {/* RESET DATES */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStartDate(new Date());
                    setEndDate(new Date());
                  }}
                  className="w-full bg-gray-200 text-gray-700 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-gray-300 transition"
                >
                  Reset Dates to Today
                </button>
              </div>

              {/* ADD PAYMENT METHOD */}
              <div className="flex items-end">
                <Link to="/add-payment-method" className="w-full">
                  <button className="w-full bg-gray-200 text-gray-700 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-gray-300 transition">
                    Add Payment Method
                  </button>
                </Link>
              </div>
            </div>
          </div>
          {/* ================= END FILTER BAR ================= */}

          {/* Table for both desktop and mobile */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50 text-xs md:text-sm text-gray-700">
                <tr>
                  <th className="p-3 border min-w-[120px]">User</th>
                  <th className="p-3 border min-w-[80px] hidden md:table-cell">
                    User ID
                  </th>
                  <th className="p-3 border min-w-[100px]">Amount</th>
                  <th className="p-3 border min-w-[100px]">Method</th>
                  <th className="p-3 border min-w-[120px]">Reference</th>
                  <th className="p-3 border min-w-[120px] hidden sm:table-cell">
                    Date
                  </th>
                  <th className="p-3 border min-w-[80px]">Slip</th>
                  <th className="p-3 border min-w-[150px] hidden lg:table-cell">
                    Remarks
                  </th>
                  <th className="p-3 border min-w-[100px]">Status</th>
                </tr>
              </thead>

              <tbody className="text-xs md:text-sm">
                {filteredDeposits.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center p-6 text-gray-400">
                      No deposit requests found
                    </td>
                  </tr>
                )}

                {filteredDeposits.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition">
                    <td className="border p-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            d.image
                              ? d.image
                              : `https://ui-avatars.com/api/?name=${d.username}`
                          }
                          className="w-8 h-8 md:w-9 md:h-9 rounded-full border"
                          alt={d.username}
                        />
                        <div>
                          <div className="font-semibold text-xs md:text-sm">
                            {d.username}
                          </div>
                          <div className="text-[10px] text-gray-400 md:hidden">
                            ID: {d.userId?.slice(0, 6)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="border p-3 text-xs hidden md:table-cell uppercase">
                      {d.userId?.slice(0, 6)}
                    </td>

                    <td className="border p-3 font-semibold">
                      {d.statusRaw === "pending" ? (
                        <input
                          type="number"
                          value={cleanAmount(d.amount)}
                          onChange={(e) =>
                            setDeposits((prev) =>
                              prev.map((x) =>
                                x.id === d.id
                                  ? {
                                      ...x,
                                      amount: parseFloat(e.target.value) || 0,
                                    }
                                  : x,
                              ),
                            )
                          }
                          className="w-20 md:w-24 border rounded px-2 py-1 text-xs md:text-sm"
                        />
                      ) : (
                        <>৳ {d.formattedAmount || d.amount}</>
                      )}
                    </td>

                    <td className="border p-3 text-xs md:text-sm">
                      {d.paymentMethod}
                    </td>
                    <td className="border p-3 text-xs md:text-sm">
                      {d.referenceNo}
                    </td>

                    <td className="border p-3 hidden sm:table-cell">
                      <div className="text-xs md:text-sm">{d.paymentDate}</div>
                      <div className="text-[10px] md:text-xs text-gray-400">
                        Req: {d.requestDate}
                      </div>
                    </td>

                    <td className="border p-2">
                      <img
                        src={d.depositSlip}
                        className="w-10 h-10 md:w-11 md:h-11 object-cover rounded-lg cursor-pointer mx-auto"
                        onClick={() => {
                          setSelectedImage(d.depositSlip);
                          setZoom(1);
                        }}
                        alt="Deposit slip"
                      />
                    </td>

                    <td className="border p-3 text-xs md:text-sm hidden lg:table-cell">
                      {d.userRemarks}
                    </td>

                    <td className="border p-3">
                      <select
                        value={d.statusRaw}
                        disabled={d.statusRaw !== "pending"}
                        onChange={(e) =>
                          handleStatusChange(d.id, e.target.value, d.amount)
                        }
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(
                          d.statusRaw,
                        )}`}
                      >
                        <option value="pending">pending</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-xl p-4 relative max-w-3xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-3 text-2xl font-bold"
            >
              ×
            </button>

            <div className="flex justify-center gap-4 mb-3">
              <button
                onClick={() => setZoom((z) => z - 0.2)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                −
              </button>
              <button
                onClick={() => setZoom(1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Reset
              </button>
              <button
                onClick={() => setZoom((z) => z + 0.2)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>

            <img
              src={selectedImage}
              style={{ transform: `scale(${zoom})` }}
              className="max-h-[75vh] mx-auto rounded"
              alt="Enlarged deposit slip"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDeposits;
