import { useState } from "react";

const AdminPayment = () => {
  const [form, setForm] = useState({
    centerName: "",
    paymentLink: "",
    remarks: "",
  });

  const [data, setData] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (!form.centerName || !form.paymentLink) return;

    setData([
      ...data,
      {
        ...form,
        id: Date.now(),
      },
    ]);

    setForm({
      centerName: "",
      paymentLink: "",
      remarks: "",
    });
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          Admin Payment Center
        </h2>

        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            name="centerName"
            placeholder="Center Name"
            value={form.centerName}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="paymentLink"
            placeholder="Payment Link"
            value={form.paymentLink}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="remarks"
            placeholder="Remarks (optional)"
            value={form.remarks}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Add Center
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Added Centers
        </h3>

        {data.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No data added yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Center Name</th>
                  <th className="border px-4 py-2 text-left">Payment Link</th>
                  <th className="border px-4 py-2 text-left">Remarks</th>
                  <th className="border px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">
                      {item.centerName}
                    </td>
                    <td className="border px-4 py-2 text-blue-600 underline">
                      {item.paymentLink}
                    </td>
                    <td className="border px-4 py-2">
                      {item.remarks || "-"}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayment;
