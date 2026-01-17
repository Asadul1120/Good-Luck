import React, { useEffect, useState } from "react";
import axios from "../../src/api/axios";

const AdminDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1);

  // ✅ Filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [searchRef, setSearchRef] = useState("");

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const res = await axios.get("/deposits");
        setDeposits(res.data);
      } catch (err) {
        console.error("Error fetching deposits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeposits();
  }, []);

  const handleStatusChange = async (depositId, newStatus) => {
    try {
      await axios.patch(`/deposits/${depositId}/status`, {
        status: newStatus,
      });

      setDeposits((prev) =>
        prev.map((d) => (d._id === depositId ? { ...d, status: newStatus } : d))
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  const statusColor = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  // ✅ FILTER LOGIC (non-destructive)
  const filteredDeposits = deposits
    .filter((d) => (filterStatus === "all" ? true : d.status === filterStatus))
    .filter((d) =>
      filterMethod === "all" ? true : d.paymentMethod === filterMethod
    )
    .filter((d) =>
      d.referenceNo.toLowerCase().includes(searchRef.trim().toLowerCase())
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading deposits...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">
            Users Deposit Requests (Admin)
          </h1>

          {/* 🔍 FILTER BAR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Payment Method Filter */}
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Payment Methods</option>
              <option value="NRBC Bank PLC.">NRBC Bank PLC.</option>
              <option value="Nagad">Nagad</option>
              <option value="Bkash">Bkash</option>
              <option value="Rocket">Rocket</option>
              <option value="Eastern Bank Limited.">
                Eastern Bank Limited.
              </option>
              <option value="Other or cash">Other or cash</option>
              <option value="Refund">Refund</option>
            </select>

            {/* Reference Search */}
            <input
              type="text"
              placeholder="Search by Reference No"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm font-semibold text-gray-700">
                  <th className="p-3 border">Amount</th>
                  <th className="p-3 border">Method</th>
                  <th className="p-3 border">Reference</th>
                  <th className="p-3 border">Date & Time</th>
                  <th className="p-3 border">Slip</th>
                  <th className="p-3 border">Remarks</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredDeposits.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-gray-500">
                      No deposit requests found
                    </td>
                  </tr>
                )}

                {filteredDeposits.map((d) => (
                  <tr
                    key={d._id}
                    className="text-sm hover:bg-gray-50 transition"
                  >
                    <td className="p-3 border font-semibold">৳ {d.amount}</td>
                    <td className="p-3 border">{d.paymentMethod}</td>
                    <td className="p-3 border">{d.referenceNo}</td>
                    <td className="p-3 border">
                      {d.depositDate}
                      <br />
                      <span className="text-xs text-gray-500">
                        {d.depositTime}
                      </span>
                    </td>

                    <td className="border p-2">
                      <img
                        src={d.depositSlip}
                        alt="Deposit Slip"
                        className="w-14 h-14 object-cover rounded cursor-pointer border"
                        onClick={() => {
                          setSelectedImage(d.depositSlip);
                          setZoom(1);
                        }}
                      />
                    </td>

                    <td className="p-3 border">{d.remarks}</td>

                    <td className="p-3 border">
                      <select
                        value={d.status}
                        disabled={d.status !== "pending"}
                        onChange={(e) =>
                          handleStatusChange(d._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                          d.status
                        )} ${
                          d.status !== "pending"
                            ? "cursor-not-allowed opacity-70"
                            : ""
                        }`}
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-xl p-4 max-w-4xl w-full mx-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-3 text-2xl font-bold"
            >
              ×
            </button>

            <div className="flex justify-center gap-3 mb-3">
              <button onClick={() => setZoom((z) => Math.max(1, z - 0.2))}>
                −
              </button>
              <button onClick={() => setZoom(1)}>Reset</button>
              <button onClick={() => setZoom((z) => Math.min(3, z + 0.2))}>
                +
              </button>
            </div>

            <img
              src={selectedImage}
              alt="Deposit Slip Full"
              style={{ transform: `scale(${zoom})` }}
              className="max-h-[75vh] mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDeposits;
