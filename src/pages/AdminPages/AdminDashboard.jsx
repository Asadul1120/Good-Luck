import React, { useEffect, useState } from "react";
import axios from "../../src/api/axios";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error(error);
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

    return matchesSlipType && matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Admin Dashboard – All Slips
      </h1>

      {/* FILTER BAR */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Search Passport / Name / NID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">All Slip Types</option>
          <option value="Normal-Slip">Normal Slip</option>
          <option value="Special-Slip">Special Slip</option>
          <option value="Night-Slip">Night Slip</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-max w-full border-collapse text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-2">#</th>
              <th className="border px-2 py-2">Slip Type</th>
              <th className="border px-2 py-2">User ID</th>
              <th className="border px-2 py-2">First Name</th>
              <th className="border px-2 py-2">Last Name</th>
              <th className="border px-2 py-2">Gender</th>
              <th className="border px-2 py-2">Marital</th>
              <th className="border px-2 py-2">DOB</th>
              <th className="border px-2 py-2">Nationality</th>
              <th className="border px-2 py-2">Passport</th>
              <th className="border px-2 py-2">Passport Issue</th>
              <th className="border px-2 py-2">Passport Expiry</th>
              <th className="border px-2 py-2">NID</th>
              <th className="border px-2 py-2">Visa</th>
              <th className="border px-2 py-2">Position</th>
              <th className="border px-2 py-2">Country</th>
              <th className="border px-2 py-2">City</th>
              <th className="border px-2 py-2">Travel Country</th>
              <th className="border px-2 py-2">Medical Center</th>
              <th className="border px-2 py-2">Remarks</th>
              <th className="border px-2 py-2">Status</th>
              <th className="border px-2 py-2">Created At</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                <td className="border px-2 py-1 font-semibold text-blue-600">
                  {item.slipType}
                </td>
                <td className="border px-2 py-1">{item.userId}</td>
                <td className="border px-2 py-1">{item.firstName}</td>
                <td className="border px-2 py-1">{item.lastName}</td>
                <td className="border px-2 py-1">{item.gender}</td>
                <td className="border px-2 py-1">{item.maritalStatus}</td>
                <td className="border px-2 py-1">
                  {new Date(item.dateOfBirth).toLocaleDateString()}
                </td>
                <td className="border px-2 py-1">{item.nationality}</td>
                <td className="border px-2 py-1">{item.passportNumber}</td>
                <td className="border px-2 py-1">
                  {new Date(item.passportIssueDate).toLocaleDateString()}
                </td>
                <td className="border px-2 py-1">
                  {new Date(item.passportExpiryDate).toLocaleDateString()}
                </td>
                <td className="border px-2 py-1">{item.nationalId}</td>
                <td className="border px-2 py-1">{item.visaType}</td>
                <td className="border px-2 py-1">
                  {item.positionAppliedFor}
                </td>
                <td className="border px-2 py-1">{item.country}</td>
                <td className="border px-2 py-1">{item.city}</td>
                <td className="border px-2 py-1">{item.travelCountry}</td>
                <td className="border px-2 py-1">
                  {item.medicalCenter || "-"}
                </td>
                <td className="border px-2 py-1">{item.remarks || "-"}</td>

                {/* INLINE STATUS UPDATE */}
                <td className="border px-2 py-1 text-center">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    className={`px-2 py-1 rounded text-xs font-semibold
                      ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>

                <td className="border px-2 py-1 text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="22" className="text-center py-6 text-gray-500">
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
