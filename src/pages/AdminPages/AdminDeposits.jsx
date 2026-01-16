import React, { useEffect, useState } from "react";
import axios from "../../src/api/axios";

const AdminDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await axios.get("/deposits");
        setDeposits(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching deposits:", error);
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  const statusColor = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

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
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-6">
            Deposit Requests (Admin)
          </h1>

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
                {deposits.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-gray-500">
                      No deposit requests found
                    </td>
                  </tr>
                )}

                {deposits.map((d) => (
                  <tr key={d._id} className="text-sm hover:bg-gray-50 transition">
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

                    {/* Thumbnail */}
                    <td className=" border p-2 ">
                      <img
                        src={d.depositSlip}
                        alt="Deposit Slip"
                        className="w-14 h-14 object-cover rounded cursor-pointer border hover:scale-105 transition"
                        onClick={() => {
                          setSelectedImage(d.depositSlip);
                          setZoom(1);
                        }}
                      />
                      
                    </td>

                    <td className="p-3 border">{d.remarks}</td>

                    <td className="p-3 border">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                          d.status
                        )}`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-xl p-4 max-w-4xl w-full mx-4">
            {/* Close */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-3 text-2xl font-bold text-gray-600 hover:text-red-600"
            >
              ×
            </button>

            {/* Controls */}
            <div className="flex justify-center gap-3 mb-3">
              <button
                onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                −
              </button>
              <button
                onClick={() => setZoom(1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Reset
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            {/* Image */}
            <div className="overflow-auto max-h-[75vh] flex justify-center">
              <img
                src={selectedImage}
                alt="Deposit Slip Full"
                style={{ transform: `scale(${zoom})` }}
                className="transition-transform duration-200 origin-center"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDeposits;
