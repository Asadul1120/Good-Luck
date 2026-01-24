import React, { useEffect, useState } from "react";
import axios from "../../src/api/axios";

const AdminDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1);

  // FILTER STATES (already existed)
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [searchRef, setSearchRef] = useState("");

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

  const handleStatusChange = async (depositId, newStatus) => {
    await axios.patch(`/deposits/${depositId}/status`, { status: newStatus });

    setDeposits((prev) =>
      prev.map((d) =>
        d.id === depositId
          ? {
              ...d,
              statusRaw: newStatus,
              status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
            }
          : d,
      ),
    );
  };

  const statusColor = (s) => {
    if (s === "approved") return "bg-green-100 text-green-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  // FILTER LOGIC (unchanged)
  const filteredDeposits = deposits
    .filter((d) =>
      filterStatus === "all" ? true : d.statusRaw === filterStatus,
    )
    .filter((d) =>
      filterMethod === "all" ? true : d.paymentMethod === filterMethod,
    )
    .filter((d) =>
      d.referenceNo.toLowerCase().includes(searchRef.trim().toLowerCase()),
    );

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
        <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 overflow-x-auto">
          <h1 className="text-xl md:text-2xl font-bold text-blue-600 mb-4">
            User Deposit Requests
          </h1>

          {/* ================= FILTER BAR ================= */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* STATUS */}
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

              {/* PAYMENT METHOD */}
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
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
                className="border rounded-lg px-3 py-2 text-sm"
              />

              {/* RESET */}
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterMethod("all");
                  setSearchRef("");
                }}
                className="bg-blue-600 text-white rounded-lg px-3 py-2 text-sm hover:bg-blue-700 transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
          {/* ================= END FILTER BAR ================= */}

          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 text-xs md:text-sm text-gray-700">
              <tr>
                <th className="p-3 border">User</th>
                <th className="p-3 border hidden md:table-cell">User ID</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Method</th>
                <th className="p-3 border">Reference</th>
                <th className="p-3 border hidden sm:table-cell">Date</th>
                <th className="p-3 border">Slip</th>
                <th className="p-3 border hidden lg:table-cell">Remarks</th>
                <th className="p-3 border">Status</th>
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
                        className="w-9 h-9 rounded-full border"
                      />
                      <div>
                        <div className="font-semibold">{d.username}</div>
                        <div className="text-[10px] text-gray-400 md:hidden">
                          {d.userId?.slice(0, 6)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="border p-3 text-xs hidden md:table-cell uppercase">
                    {d.userId?.slice(0, 6)}
                  </td>

                  <td className="border p-3 font-semibold">৳ {d.amount}</td>
                  <td className="border p-3">{d.paymentMethod}</td>
                  <td className="border p-3">{d.referenceNo}</td>

                  <td className="border p-3 hidden sm:table-cell">
                    {d.paymentDate}
                    <div className="text-[10px] text-gray-400">
                      Req: {d.requestDate}
                    </div>
                  </td>

                  <td className="border p-2">
                    <img
                      src={d.depositSlip}
                      className="w-11 h-11 object-cover rounded-lg cursor-pointer mx-auto"
                      onClick={() => {
                        setSelectedImage(d.depositSlip);
                        setZoom(1);
                      }}
                    />
                  </td>

                  <td className="border p-3 hidden lg:table-cell">
                    {d.userRemarks}
                  </td>

                  <td className="border p-3">
                    <select
                      value={d.statusRaw}
                      disabled={d.statusRaw !== "pending"}
                      onChange={(e) => handleStatusChange(d.id, e.target.value)}
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
              <button onClick={() => setZoom((z) => z - 0.2)}>−</button>
              <button onClick={() => setZoom(1)}>Reset</button>
              <button onClick={() => setZoom((z) => z + 0.2)}>+</button>
            </div>

            <img
              src={selectedImage}
              style={{ transform: `scale(${zoom})` }}
              className="max-h-[75vh] mx-auto rounded"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDeposits;
