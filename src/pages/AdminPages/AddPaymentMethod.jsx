// import React, { useEffect, useState } from "react";
// import axios from "../../src/api/axios";

// const PaymentMethodPage = () => {
//   const [methods, setMethods] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState({
//     methodName: "",
//     account: "",
//     name: "",
//     branch: "",
//     text: "",
//   });

//   // ================= FETCH LIST =================
//   const fetchMethods = async () => {
//     try {
//       const res = await axios.get("/payment-methods");
//       setMethods(res.data.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load payment methods");
//     }
//   };

//   useEffect(() => {
//     fetchMethods();
//   }, []);

//   // ================= FORM CHANGE =================
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ================= ADD =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.post("/payment-methods", form);
//       alert("Payment method added");

//       setForm({
//         methodName: "",
//         account: "",
//         name: "",
//         branch: "",
//         text: "",
//       });

//       fetchMethods();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add payment method");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= EDIT =================
//   const handleEdit = (m) => {
//     setEditingId(m._id);
//     setForm({
//       methodName: m.methodName,
//       account: m.account,
//       name: m.name || "",
//       branch: m.branch || "",
//       text: m.text || "",
//     });
//   };

//   // ================= UPDATE =================
//   const handleUpdate = async () => {
//     try {
//       await axios.put(`/payment-methods/${editingId}`, form);
//       alert("Payment method updated");
//       setEditingId(null);

//       setForm({
//         methodName: "",
//         account: "",
//         name: "",
//         branch: "",
//         text: "",
//       });

//       fetchMethods();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update payment method");
//     }
//   };

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this payment method?"))
//       return;

//     try {
//       await axios.delete(`/payment-methods/${id}`);
//       setMethods((prev) => prev.filter((m) => m._id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete payment method");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//       <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
//         <h1 className="text-xl font-bold text-blue-600 mb-6">
//           Payment Methods
//         </h1>

//         {/* ================= ADD / EDIT FORM ================= */}
//         <form
//           onSubmit={editingId ? (e) => e.preventDefault() : handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
//         >
//           <input
//             name="methodName"
//             value={form.methodName}
//             onChange={handleChange}
//             placeholder="Method Name"
//             className="border rounded-xl px-3 py-2 text-sm"
//             required
//           />

//           <input
//             name="account"
//             value={form.account}
//             onChange={handleChange}
//             placeholder="Account / Number"
//             className="border rounded-xl px-3 py-2 text-sm"
//             required
//           />

//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Name"
//             className="border rounded-xl px-3 py-2 text-sm"
//           />

//           <input
//             name="branch"
//             value={form.branch}
//             onChange={handleChange}
//             placeholder="Branch"
//             className="border rounded-xl px-3 py-2 text-sm"
//           />

//           <textarea
//             name="text"
//             value={form.text}
//             onChange={handleChange}
//             placeholder="Note / Instruction"
//             rows={2}
//             className="border rounded-xl px-3 py-2 text-sm md:col-span-2"
//           />

//           {editingId ? (
//             <div className="flex gap-2 md:col-span-2">
//               <button
//                 type="button"
//                 onClick={handleUpdate}
//                 className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
//               >
//                 Update
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setEditingId(null);
//                   setForm({
//                     methodName: "",
//                     account: "",
//                     name: "",
//                     branch: "",
//                     text: "",
//                   });
//                 }}
//                 className="bg-gray-300 px-4 py-2 rounded-xl text-sm"
//               >
//                 Cancel
//               </button>
//             </div>
//           ) : (
//             <button
//               disabled={loading}
//               className="bg-blue-600 text-white rounded-xl py-2 text-sm font-semibold md:col-span-2"
//             >
//               {loading ? "Saving..." : "Add Payment Method"}
//             </button>
//           )}
//         </form>

//         {/* ================= TABLE ================= */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full border text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="border p-2">Method</th>
//                 <th className="border p-2">Account</th>
//                 <th className="border p-2">Name</th>
//                 <th className="border p-2">Branch</th>
//                 <th className="border p-2">Note</th>
//                 <th className="border p-2">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {methods.length === 0 && (
//                 <tr>
//                   <td colSpan="6" className="p-6 text-center text-gray-400">
//                     No payment methods found
//                   </td>
//                 </tr>
//               )}

//               {methods.map((m) => (
//                 <tr key={m._id} className="hover:bg-gray-50">
//                   <td className="border p-2 font-semibold">{m.methodName}</td>
//                   <td className="border p-2">{m.account}</td>
//                   <td className="border p-2">{m.name || "-"}</td>
//                   <td className="border p-2">{m.branch || "-"}</td>
//                   <td className="border p-2">{m.text || "-"}</td>
//                   <td className="border p-2">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleEdit(m)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(m._id)}
//                         className="bg-red-600 text-white px-3 py-1 rounded text-xs"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentMethodPage;





import React, { useEffect, useState } from "react";
import axios from "../../src/api/axios";
import { toast } from "react-toastify";

const PaymentMethodPage = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    methodName: "",
    account: "",
    name: "",
    branch: "",
    text: "",
  });

  // ================= FETCH LIST =================
  const fetchMethods = async () => {
    try {
      const res = await axios.get("/payment-methods");
      setMethods(res.data.data);
    } catch (err) {
      toast.error("Failed to load payment methods");
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  // ================= FORM CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/payment-methods", form);
      toast.success("Payment method added");

      setForm({
        methodName: "",
        account: "",
        name: "",
        branch: "",
        text: "",
      });

      fetchMethods();
    } catch (err) {
      toast.error("Failed to add payment method");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (m) => {
    setEditingId(m._id);
    setForm({
      methodName: m.methodName,
      account: m.account,
      name: m.name || "",
      branch: m.branch || "",
      text: m.text || "",
    });
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      await axios.put(`/payment-methods/${editingId}`, form);
      toast.success("Payment method updated");
      setEditingId(null);

      setForm({
        methodName: "",
        account: "",
        name: "",
        branch: "",
        text: "",
      });

      fetchMethods();
    } catch (err) {
      toast.error("Failed to update payment method");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment method?"))
      return;

    try {
      await axios.delete(`/payment-methods/${id}`);
      setMethods((prev) => prev.filter((m) => m._id !== id));
      toast.success("Payment method deleted");
    } catch (err) {
      toast.error("Failed to delete payment method");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-bold text-blue-600 mb-6">
          Payment Methods
        </h1>

        {/* ================= ADD / EDIT FORM ================= */}
        <form
          onSubmit={editingId ? (e) => e.preventDefault() : handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <input
            name="methodName"
            value={form.methodName}
            onChange={handleChange}
            placeholder="Method Name"
            className="border rounded-xl px-3 py-2 text-sm"
            required
          />

          <input
            name="account"
            value={form.account}
            onChange={handleChange}
            placeholder="Account / Number"
            className="border rounded-xl px-3 py-2 text-sm"
            required
          />

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border rounded-xl px-3 py-2 text-sm"
          />

          <input
            name="branch"
            value={form.branch}
            onChange={handleChange}
            placeholder="Branch"
            className="border rounded-xl px-3 py-2 text-sm"
          />

          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            placeholder="Note / Instruction"
            rows={2}
            className="border rounded-xl px-3 py-2 text-sm md:col-span-2"
          />

          {editingId ? (
            <div className="flex gap-2 md:col-span-2">
              <button
                type="button"
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    methodName: "",
                    account: "",
                    name: "",
                    branch: "",
                    text: "",
                  });
                }}
                className="bg-gray-300 px-4 py-2 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              disabled={loading}
              className="bg-blue-600 text-white rounded-xl py-2 text-sm font-semibold md:col-span-2"
            >
              {loading ? "Saving..." : "Add Payment Method"}
            </button>
          )}
        </form>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border p-2">Method</th>
                <th className="border p-2">Account</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Branch</th>
                <th className="border p-2">Note</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {methods.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    No payment methods found
                  </td>
                </tr>
              )}

              {methods.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50">
                  <td className="border p-2 font-semibold">{m.methodName}</td>
                  <td className="border p-2">{m.account}</td>
                  <td className="border p-2">{m.name || "-"}</td>
                  <td className="border p-2">{m.branch || "-"}</td>
                  <td className="border p-2">{m.text || "-"}</td>
                  <td className="border p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPage;