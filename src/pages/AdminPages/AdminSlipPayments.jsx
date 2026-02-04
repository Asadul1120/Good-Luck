import React, { useEffect, useState } from "react";
import axios from "../../src/api/axios";
import { toast } from "react-toastify";

const getStatusClass = (status) => {
  switch (status) {
    case "no-balance":
      return "bg-purple-100 text-purple-700";
    case "no-queue":
      return "bg-blue-100 text-blue-700";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "complete":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "other":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const AdminSlipPayments = () => {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [amounts, setAmounts] = useState({});
  const [paymentLinks, setPaymentLinks] = useState({});
  const [allocateCenters, setAllocateCenters] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetchSlipPayments();
  }, []);

  const fetchSlipPayments = async () => {
    try {
      const res = await axios.get("/slipPayment");
      setData(res.data.slipPayments || []);
    } catch (err) {
      toast.error("Failed to load slip payments");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/slipPayment/${id}/status`, { status });
      setData((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item)),
      );
      toast.success("Status updated successfully");
    } catch {
      toast.error("Status update failed");
    }
  };

  const filteredData = data.filter((item) => {
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    const q = search.toLowerCase();
    const matchesSearch =
      item.username?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.phone?.toLowerCase().includes(q) ||
      item.playLink?.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Admin – Slip Payments
      </h1>

      {/* FILTER BAR */}
      <div className="mb-4 bg-white p-4 rounded shadow flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search name / email / phone / link"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded text-sm"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded text-sm font-semibold"
        >
          <option value="all">ALL STATUS</option>
          <option value="no-balance">NO-BALANCE</option>
          <option value="no-queue">NO-QUEUE</option>
          <option value="processing">PROCESSING</option>
          <option value="cancelled">CANCELLED</option>
          <option value="other">OTHER</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-center border-collapse">
          <thead className="bg-gray-200">
            <tr>
              {[
                "S.N",
                "User",
                "Email",
                "Phone",
                "Play Link",
                "Remarks",
                "Status",
                "Amount / URL / Allocate",
                "Created At",
              ].map((h, i) => (
                <th key={i} className="border px-2 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={item._id}
                className={item.status === "complete" ? "bg-green-50" : ""}
              >
                <td className="border px-2 py-1">{index + 1}</td>

                {/* COMBINED USER COLUMN WITH IMAGE AND USERNAME */}
                <td className="border px-2 py-1">
                  <div className="flex items-center justify-start gap-2">
                    {/* USER IMAGE OR FALLBACK AVATAR */}
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt="user"
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                          {item.username?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>

                    {/* USERNAME */}
                    <div className="font-semibold text-left">
                      {item.username}
                    </div>
                  </div>
                </td>

                <td className="border px-2 py-1">{item.email}</td>
                <td className="border px-2 py-1">{item.phone}</td>

                <td className="border px-2 py-1 text-blue-600 break-all">
                  <a href={item.playLink} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </td>

                <td className="border px-2 py-1">{item.remarks || "-"}</td>

                {/* STATUS */}
                <td className="border px-2 py-2">
                  <div className="flex flex-col gap-1">
                    <select
                      value={item.status}
                      disabled={item.status === "complete"}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      className={`w-full px-2 py-1.5 text-xs rounded-md font-semibold border 
        focus:outline-none transition
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

                    {/* COMMENT BOX */}
                    {item.status === "other" && (
                      <div className="flex gap-1 mt-1">
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
                          className="flex-1 px-2 py-1 text-xs border rounded-md 
            focus:ring-1 focus:ring-indigo-500 outline-none"
                        />

                        <button
                          onClick={async () => {
                            if (!comments[item._id]?.trim()) {
                              toast.error("Please write a comment");
                              return;
                            }

                            try {
                              await axios.patch(
                                `/slipPayment/${item._id}/comment`,
                                { comment: comments[item._id] },
                              );

                              setData((prev) =>
                                prev.map((s) =>
                                  s._id === item._id
                                    ? { ...s, comment: comments[item._id] }
                                    : s,
                                ),
                              );

                              setComments((prev) => ({
                                ...prev,
                                [item._id]: "",
                              }));

                              toast.success("Comment saved ✅");
                            } catch {
                              toast.error("Failed to save comment ❌");
                            }
                          }}
                          className="px-3 py-1 text-xs font-semibold 
            bg-indigo-500 text-white rounded-md 
            hover:bg-indigo-600 transition"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                </td>

                {/* PAYMENT */}
                <td className="border px-2 py-1">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="number"
                      placeholder="Amount"
                      disabled={item.status === "complete"}
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
                      disabled={item.status === "complete"}
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
                      disabled={item.status === "complete"}
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
                          await axios.patch(
                            `/slipPayment/${item._id}/payment-link`,
                            {
                              paymentLink: paymentLinks[item._id],
                              amount: Number(amounts[item._id]),
                              allocateCenter: allocateCenters[item._id],
                            },
                          );

                          setData((prev) =>
                            prev.map((s) =>
                              s._id === item._id
                                ? { ...s, status: "complete" }
                                : s,
                            ),
                          );
                          toast.success("Payment link sent successfully");
                        } catch {
                          toast.error("Failed to send payment link ❌");
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded font-semibold ${
                        item.status === "complete"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }`}
                    >
                      Send
                    </button>
                  </div>
                </td>

                <td className="border px-2 py-1">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="9" className="py-6 text-gray-500">
                  No Slip Payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSlipPayments;
