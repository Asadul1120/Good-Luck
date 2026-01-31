import { useEffect, useState } from "react";
import axios from "../../src/api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdminPayment = () => {
  // 🔹 Today
  const today = new Date();

  const [form, setForm] = useState({
    centerName: "",
    paymentLink: "",
    cardNumber: "",
    remarks: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Date filter (default today)
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // 🔹 Fetch data
  const fetchCenters = async () => {
    try {
      const res = await axios.get("/admin-payment-links");
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Add center
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.centerName || !form.paymentLink || !form.cardNumber) return;

    try {
      setLoading(true);
      const res = await axios.post("/admin-payment-links", form);
      setData([res.data, ...data]);

      setForm({
        centerName: "",
        paymentLink: "",
        cardNumber: "",
        remarks: "",
      });

    } catch (error) {
      
      alert(error.response.data.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete center
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment method?")) return;

    try {
      await axios.delete(`/admin-payment-links/${id}`);
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Date filter logic
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.createdAt);

    // same day comparison
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return itemDate >= start && itemDate <= end;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* FORM */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          Admin Payment Center
        </h2>

        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            name="centerName"
            placeholder="Center Name"
            value={form.centerName}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            name="paymentLink"
            placeholder="Payment Link"
            value={form.paymentLink}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={form.cardNumber}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            name="remarks"
            placeholder="Remarks (optional)"
            value={form.remarks}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Adding..." : "Add Center"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        {/* DATE FILTER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
              maxDate={endDate}
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
              minDate={startDate}
              maxDate={today}
              dateFormat="dd/MM/yyyy"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              wrapperClassName="w-full"
              showYearDropdown
              yearDropdownItemNumber={20}
              scrollableYearDropdown
              isClearable
            />
          </div>

          {/* RESET */}
          <div className="flex items-end">
            <button
              onClick={() => {
                const t = new Date();
                setStartDate(t);
                setEndDate(t);
              }}
              className="w-full bg-gray-200 text-gray-700 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-gray-300 transition"
            >
              Reset to Today
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Added Centers
        </h3>

        {filteredData.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No data found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">S.N</th>
                  <th className="border px-4 py-2">Center Name</th>
                  <th className="border px-4 py-2">Remarks</th>
                  <th className="border px-4 py-2">Payment Link</th>
                  <th className="border px-4 py-2">Card Number</th>
                  <th className="border px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 text-center">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{item.centerName}</td>
                    <td className="border px-4 py-2">{item.remarks || "-"}</td>
                    <td className="border px-4 py-2 text-blue-600 underline">
                      <a
                        href={item.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open
                      </a>
                    </td>
                    <td className="border px-4 py-2">{item.cardNumber}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(item._id)}
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
