import React, { useEffect, useState } from "react";
import axios from "../../src/api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import FeatureControl from "../../components/FeatureControl";


const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentLinks, setPaymentLinks] = useState({});
  const [amounts, setAmounts] = useState({}); // ✅ AMOUNT STATE
  const [allocateCenters, setAllocateCenters] = useState({}); // ✅ ALLOCATE CENTERS

  const [comments, setComments] = useState({}); // ✅ setComments

  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("/slips");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/slips/${id}/status`, { status: newStatus });
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item,
        ),
      );
    } catch (error) {
      alert("Status update failed");
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSlipType =
      filterType === "all" || item.slipType === filterType;

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    const search = searchTerm.toLowerCase();
    const matchesSearch =
      item.passportNumber?.toLowerCase().includes(search) ||
      item.firstName?.toLowerCase().includes(search) ||
      item.lastName?.toLowerCase().includes(search) ||
      item.nationalId?.toLowerCase().includes(search);

    // ✅ DATE FILTER
    const itemDate = item.createdAt ? new Date(item.createdAt) : null;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const matchesDate = !itemDate || (itemDate >= start && itemDate <= end);

    return matchesSlipType && matchesStatus && matchesSearch && matchesDate;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "no-balance":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "no-queue":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "processing-link":
        return "bg-indigo-100 text-indigo-700 border-indigo-300";
      case "complete":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      case "other":
        return "bg-gray-200 text-gray-700 border-gray-400";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Admin Dashboard – All Slips
      </h1>

      <FeatureControl />
     

      {/* FILTER BAR */}
      <div className="mb-5 bg-white p-4 rounded-xl shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          {/* SEARCH */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Passport / Name / NID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-sm
        focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* SLIP TYPE */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Slip Type
            </label>
            <select
              value={filterType}
              onChange={(e) => {
                const value = e.target.value;
                setFilterType(value);

                // 🔥 Redirect when Slip-Payment selected
                if (value === "Slip-Payment") {
                  navigate("/slipPayments");
                }
              }}
              className="w-full px-4 py-2 border rounded-lg text-sm
        focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="all">All</option>
              <option value="Normal-Slip">Normal</option>
              <option value="Special-Slip">Special</option>
              <option value="Night-Slip">Night</option>
              <option value="Slip-Payment">Slip-Payment</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border text-sm font-semibold
        outline-none focus:ring-2 focus:ring-indigo-400
        ${getStatusClass(statusFilter)}`}
            >
              <option value="all">All</option>
              <option value="no-balance">NO-BALANCE</option>
              <option value="no-queue">NO-QUEUE</option>
              <option value="processing">PROCESSING</option>
              <option value="processing-link">PROCESSING-LINK</option>
              <option value="complete">COMPLETE</option>
              <option value="cancelled">CANCELLED</option>
              <option value="other">OTHER</option>
            </select>
          </div>

          {/* START DATE */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
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
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500"
              wrapperClassName="w-full"
              showYearDropdown
              yearDropdownItemNumber={20}
              scrollableYearDropdown
              isClearable
            />
          </div>

          {/* END DATE */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || null}
              dateFormat="dd/MM/yyyy"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500"
              wrapperClassName="w-full"
              showYearDropdown
              yearDropdownItemNumber={20}
              scrollableYearDropdown
              isClearable
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-max w-full border-collapse text-sm text-center">
          <thead className="bg-gray-200">
            <tr>
              {[
                "S.N",
                "Slip Type",
                "User ID",
                "First_Name",
                "Last_Name",
                "Date of Birth",
                "Gender",
                "Marital status",
                "PassportNo",
                "Passport Issue Date",
                "PassportIssuePlace",
                "Passport Expiry Date",
                "VisaType",
                "EmailID",
                "PhoneNo",
                "National ID",
                "Position_Applied_For",
                "City",
                "Country",
                "Country Traveling To",
                "Nationality",
                "MEDICAL CENTER NAME",
                "Status",
                "Remarks",
                "URL1",
              ].map((h, i) => (
                <th key={i} className="border px-2 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item._id}>
                <td className="border px-2 py-1">{index + 1}</td>
                <td className="border px-2 py-1 text-blue-600 font-semibold">
                  {item.slipType}
                </td>
                <td className="border px-2 py-1 uppercase">
                  {typeof item.user === "string"
                    ? item.user?.slice(0, 6) || "-"
                    : item.user?._id?.slice(0, 6) || "-"}
                </td>

                <td className="border px-2 py-1">{item.firstName}</td>
                <td className="border px-2 py-1">{item.lastName}</td>
                <td className="border px-2 py-1">
                  {item.dateOfBirth
                    ? isValidDate(new Date(item.dateOfBirth))
                      ? new Date(item.dateOfBirth).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric", // 👈 full year
                        })
                      : item.dateOfBirth
                    : "-"}
                </td>

                <td className="border px-2 py-1">{item.gender}</td>
                <td className="border px-2 py-1">{item.maritalStatus}</td>
                <td className="border px-2 py-1">{item.passportNumber}</td>

                <td className="border px-2 py-1">
                  {item.passportIssueDate
                    ? isValidDate(new Date(item.passportIssueDate))
                      ? new Date(item.passportIssueDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric", // 👈 full year
                          },
                        )
                      : item.passportIssueDate
                    : "-"}
                </td>

                <td className="border px-2 py-1">
                  {item.passportIssuePlace || "-"}
                </td>

                <td className="border px-2 py-1">
                  {item.passportExpiryDate
                    ? isValidDate(new Date(item.passportExpiryDate))
                      ? new Date(item.passportExpiryDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric", // 👈 full year
                          },
                        )
                      : item.passportExpiryDate
                    : "-"}
                </td>

                <td className="border px-2 py-1">{item.visaType}</td>
                <td className="border px-2 py-1">{item.email}</td>
                <td className="border px-2 py-1">{item.phone}</td>
                <td className="border px-2 py-1">{item.nationalId}</td>
                <td className="border px-2 py-1">{item.positionAppliedFor}</td>
                <td className="border px-2 py-1">{item.city}</td>
                <td className="border px-2 py-1">{item.country}</td>
                <td className="border px-2 py-1">{item.travelCountry}</td>
                <td className="border px-2 py-1">{item.nationality}</td>
                <td className="border px-2 py-1">
                  {item.medicalCenter || "-"}
                </td>

                {/* STATUS */}
                <td className="border px-2 py-2">
                  <div className="flex flex-col gap-1">
                    <select
                      value={item.status}
                      disabled={item.status === "complete"}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      className={`w-full px-2 py-1.5 text-xs rounded-md font-semibold border focus:outline-none
        ${getStatusClass(item.status)}
        ${
          item.status === "complete"
            ? "cursor-not-allowed opacity-70"
            : "hover:brightness-110"
        }`}
                    >
                      {[
                        { value: "no-balance", label: "NO-BALANCE" },
                        { value: "no-queue", label: "NO-QUEUE" },
                        { value: "processing", label: "[PROCESSING]" },
                        {
                          value: "processing-link",
                          label: "[PROCESSING-LINK]",
                        },

                        ...(item.paymentLink
                          ? [{ value: "complete", label: "COMPLETE" }]
                          : []),

                        { value: "cancelled", label: "CANCELLED" },
                        { value: "other", label: "OTHER COMMENT ANY ISSUE" },
                      ].map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {item.status === "other" && (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          placeholder="Enter comment"
                          value={comments[item._id] || ""}
                          onChange={(e) =>
                            setComments((prev) => ({
                              ...prev,
                              [item._id]: e.target.value,
                            }))
                          }
                          className="flex-1 px-2 py-1 text-xs border rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                        <button
                          onClick={async () => {
                            try {
                              await axios.patch(`/slips/${item._id}/comment`, {
                                comment: comments[item._id],
                              });

                              setData((prev) =>
                                prev.map((s) =>
                                  s._id === item._id
                                    ? { ...s, comments: comments[item._id] }
                                    : s,
                                ),
                              );

                              alert("Comment saved ✅");
                            } catch (err) {
                              alert("Failed to save comment ❌");
                            }
                          }}
                          className="px-3 py-1 text-xs font-semibold bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                </td>

                <td className="border px-2 py-1">{item.remarks || "-"}</td>

                {/* AMOUNT + URL + ALLOCATE CENTER + SEND */}
                <td className="border px-2 py-1" colSpan={2}>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={amounts[item._id] || ""}
                      onChange={(e) =>
                        setAmounts((prev) => ({
                          ...prev,
                          [item._id]: e.target.value,
                        }))
                      }
                      className="w-20 px-2 py-1 border rounded text-xs"
                    />

                    <input
                      type="text"
                      placeholder="Payment URL"
                      value={paymentLinks[item._id] || ""}
                      onChange={(e) =>
                        setPaymentLinks((prev) => ({
                          ...prev,
                          [item._id]: e.target.value,
                        }))
                      }
                      className="px-2 py-1 border rounded text-xs flex-1"
                    />

                    <input
                      type="text"
                      placeholder="Allocate Center"
                      value={allocateCenters[item._id] || ""}
                      onChange={(e) =>
                        setAllocateCenters((prev) => ({
                          ...prev,
                          [item._id]: e.target.value,
                        }))
                      }
                      className="px-2 py-1 border rounded text-xs flex-1"
                    />

                    <button
                      disabled={item.status === "complete"}
                      onClick={async () => {
                        try {
                          await axios.patch(`/slips/${item._id}/payment-link`, {
                            paymentLink: paymentLinks[item._id],
                            amount: Number(amounts[item._id]),
                            allocateCenter: allocateCenters[item._id],
                          });

                          setData((prev) =>
                            prev.map((s) =>
                              s._id === item._id
                                ? { ...s, status: "complete" }
                                : s,
                            ),
                          );

                          alert("Payment link sent ✅");
                        } catch {
                          alert("Failed to send payment link");
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded font-semibold
        ${
          item.status === "complete"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600 text-white"
        }`}
                    >
                      Send
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="25" className="py-6 text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
