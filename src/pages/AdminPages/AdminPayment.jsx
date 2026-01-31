import { useEffect, useState } from "react";
import axios from "../../src/api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiExternalLink, FiTrash2, FiCopy, FiCheck } from "react-icons/fi";
import { IoCardOutline } from "react-icons/io5";

const AdminPayment = () => {
  const today = new Date();

  const [form, setForm] = useState({
    bulkData: "",
    cardHolderName: "MD ZAHIRUL ISLAM",
    cardNumber: "4520 1724 0186 6116",
    cardExpiry: "12/26",
    cardCVV: "940",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [activeFilter, setActiveFilter] = useState("today");

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // Fetch data
  const fetchCenters = async () => {
    try {
      const res = await axios.get("/admin-payment-links");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Copy to clipboard
  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Quick filters
  const applyFilter = (filter) => {
    setActiveFilter(filter);
    const now = new Date();
    const start = new Date();

    switch (filter) {
      case "today":
        start.setHours(0, 0, 0, 0);
        setStartDate(start);
        setEndDate(now);
        break;
      case "week":
        start.setDate(now.getDate() - 7);
        setStartDate(start);
        setEndDate(now);
        break;
      case "month":
        start.setMonth(now.getMonth() - 1);
        setStartDate(start);
        setEndDate(now);
        break;
      case "all":
        setStartDate(new Date(0)); // Beginning of time
        setEndDate(now);
        break;
      default:
        break;
    }
  };

  // BULK ADD
  const handleAdd = async (e) => {
    e.preventDefault();

    if (
      !form.bulkData ||
      !form.cardHolderName ||
      !form.cardNumber ||
      !form.cardExpiry ||
      !form.cardCVV
    ) {
      return alert("All card fields & bulk data required");
    }

    const rows = form.bulkData
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const parsed = [];

    rows.forEach((row) => {
      let centerName = "";
      let remarks = "";
      let paymentLink = "";

      if (row.includes("\t")) {
        const parts = row.split("\t");
        centerName = parts[0];
        remarks = parts[1];
        paymentLink = parts[2];
      } else if (row.includes("|")) {
        const parts = row.split("|");
        centerName = parts[0];
        remarks = parts[1];
        paymentLink = parts[2];
      } else {
        return;
      }

      if (!centerName || !paymentLink) return;

      parsed.push({
        centerName: centerName.trim(),
        remarks: remarks?.trim(),
        paymentLink: paymentLink.trim(),
      });
    });

    if (parsed.length === 0) return alert("No valid rows found");

    try {
      setLoading(true);

      const res = await axios.post("/admin-payment-links/bulk", {
        data: parsed,
        cardHolderName: form.cardHolderName,
        cardNumber: form.cardNumber,
        cardExpiry: form.cardExpiry,
        cardCVV: form.cardCVV,
      });

      setData([...res.data.saved, ...data]);

      if (res.data.skipped?.length > 0) {
        alert(`${res.data.skipped.length} duplicate link skipped`);
      }

      setForm({ ...form, bulkData: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment link?")) return;

    try {
      await axios.delete(`/admin-payment-links/${id}`);
      setData(data.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Date filter
  const filteredData = data.filter((item) => {
    const d = new Date(item.createdAt);
    const s = new Date(startDate);
    const e = new Date(endDate);
    s.setHours(0, 0, 0, 0);
    e.setHours(23, 59, 59, 999);
    return d >= s && d <= e;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-3 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Payment Center Admin
            </h1>
            <p className="text-gray-600 mt-1">
              Manage payment links and card details
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <IoCardOutline className="text-blue-600 text-xl" />
            <span className="text-gray-700">
              {data.length} {data.length === 1 ? "Entry" : "Entries"}
            </span>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["today", "week", "month", "all"].map((filter) => (
            <button
              key={filter}
              onClick={() => applyFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Date Range Picker */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              className="w-full px-3 py-2 border rounded-lg"
              maxDate={endDate}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              className="w-full px-3 py-2 border rounded-lg"
              minDate={startDate}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* FORM CARD */}
        <div className="bg-white shadow-xl rounded-2xl p-4 md:p-6 border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Bulk Add Payment Links
            </h2>
            <p className="text-gray-600">
              Paste Excel data (Tab or Pipe separated): Center Name | Remarks |
              Payment Link
            </p>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Excel Data
              </label>
              <textarea
                name="bulkData"
                placeholder={`Example:\nCenter Name | Remarks | Payment Link\nCenter A \t- SIAM  \t-https://payment.link/1\nCenter B\t-\thttps://payment.link/2`}
                value={form.bulkData}
                onChange={handleChange}
                rows={5}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Card Holder
                </label>
                <input
                  name="cardHolderName"
                  value={form.cardHolderName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <IoCardOutline className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Expiry (MM/YY)
                </label>
                <input
                  name="cardExpiry"
                  value={form.cardExpiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  name="cardCVV"
                  value={form.cardCVV}
                  onChange={handleChange}
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span>Add Bulk Entries</span>
                  <span className="hidden md:inline">
                    ({filteredData.length} shown)
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800">
                Payment Links ({filteredData.length})
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Showing entries from {startDate.toLocaleDateString()} to{" "}
                {endDate.toLocaleDateString()}
              </p>
            </div>

            <button
              disabled={filteredData.length === 0}
              onClick={async () => {
                if (
                  !window.confirm(
                    "⚠️ This action will permanently delete ALL payment links.\nAre you absolutely sure?",
                  )
                )
                  return;

                try {
                  await axios.delete("/admin-payment-links");
                  setData([]);
                  alert("✅ All payment links deleted successfully");
                } catch (err) {
                  alert("❌ Failed to delete all payment links");
                  console.error(err);
                }
              }}
              className={`px-4 py-2 rounded-lg font-semibold text-white transition
      ${
        filteredData.length === 0
          ? "bg-red-300 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700"
      }`}
            >
              Delete All
            </button>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4 p-4">
            {filteredData.map((item, i) => (
              <div
                key={item._id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                      {i + 1}
                    </span>
                    <span className="font-bold text-gray-800">
                      {item.centerName}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Link:</span>
                    <a
                      href={item.paymentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Open <FiExternalLink className="text-sm" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Remarks:</span>
                    <span className="text-gray-800 font-medium">
                      {item.remarks || "-"}
                    </span>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        Card Holder:
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {item.cardHolderName}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              item.cardHolderName,
                              `holder-${item._id}`,
                            )
                          }
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {copiedField === `holder-${item._id}` ? (
                            <FiCheck className="text-green-500" />
                          ) : (
                            <FiCopy className="text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        Card Number:
                      </span>
                      <div className="flex items-center gap-1">
                        <code className="font-mono text-xs bg-white px-2 py-1 rounded">
                          {item.cardNumber}
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              item.cardNumber,
                              `number-${item._id}`,
                            )
                          }
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {copiedField === `number-${item._id}` ? (
                            <FiCheck className="text-green-500" />
                          ) : (
                            <FiCopy className="text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Expiry/CVV:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.cardExpiry}</span>
                        <span className="font-mono bg-white px-2 py-1 rounded">
                          {item.cardCVV}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    S.N
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Center
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Remarks
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Link
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Card Details
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item, i) => (
                  <tr
                    key={item._id}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-lg font-bold">
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-800">
                        {item.centerName}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {item.remarks || "No remarks"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={item.paymentLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium group/link"
                      >
                        Open Link
                        <FiExternalLink className="group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 min-w-[100px]">
                            Holder:
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {item.cardHolderName}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  item.cardHolderName,
                                  `holder-${item._id}`,
                                )
                              }
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                            >
                              {copiedField === `holder-${item._id}` ? (
                                <FiCheck className="text-green-500" />
                              ) : (
                                <FiCopy className="text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 min-w-[100px]">
                            Number:
                          </span>
                          <div className="flex items-center gap-1">
                            <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {item.cardNumber}
                            </code>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  item.cardNumber,
                                  `number-${item._id}`,
                                )
                              }
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                            >
                              {copiedField === `number-${item._id}` ? (
                                <FiCheck className="text-green-500" />
                              ) : (
                                <FiCopy className="text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 min-w-[100px]">
                            Expiry/CVV:
                          </span>
                          <span className="font-medium">{item.cardExpiry}</span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {item.cardCVV}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                No payment links found for selected period
              </div>
              <div className="text-gray-500 text-sm">
                Try changing the date range or add new entries using the form
                above
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayment;
