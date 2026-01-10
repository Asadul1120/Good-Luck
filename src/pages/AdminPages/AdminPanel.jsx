import { useEffect, useState } from "react";
import axios from "../../src/api/axios";
import { useAuth } from "../../context/AuthContext";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🗑️ DELETE USER
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`/users/${userId}`);

      // 🔥 remove user from UI instantly
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  };

  if (loading) {
    return <p className="p-6">Loading users...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <p className="mb-4 text-gray-600">
        Logged in as:{" "}
        <span className="font-semibold">{user?.username}</span>
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>

                <td className="p-3">
                  {u._id === user?.id ? (
                    <span className="text-gray-400 text-sm">
                      (You)
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
