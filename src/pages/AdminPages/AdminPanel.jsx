import { useEffect, useState } from "react";
import axios from "../../src/api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Filter,
  User,
  Shield,
  Users,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState("all");
  const [error, setError] = useState(null);
  const [updatingUser, setUpdatingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleRoleChange = async (id, role) => {
    setUpdatingUser(id);
    try {
      await axios.patch(`/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (error) {
      alert(error.response?.data?.message || "Role update failed");
    } finally {
      setUpdatingUser(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const roleMatch = activeRole === "all" || u.role === activeRole;
    const searchMatch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u._id.includes(search);
    return roleMatch && searchMatch;
  });

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalModerators = users.filter((u) => u.role === "moderator").length;
  const totalNormalUsers = users.filter((u) => u.role === "user").length;

  const roleBadge = (role) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold capitalize inline-flex items-center gap-1";
    if (role === "admin")
      return `${base} bg-red-50 text-red-700 border border-red-100`;
    if (role === "moderator")
      return `${base} bg-blue-50 text-blue-700 border border-blue-100`;
    return `${base} bg-green-50 text-green-700 border border-green-100`;
  };

  const RoleIcon = ({ role }) => {
    if (role === "admin") return <Shield className="w-3 h-3" />;
    if (role === "moderator") return <Users className="w-3 h-3" />;
    return <User className="w-3 h-3" />;
  };

  const RoleSelector = ({ userId, currentRole }) => (
    <div className="relative">
      <select
        value={currentRole}
        onChange={(e) => handleRoleChange(userId, e.target.value)}
        disabled={updatingUser === userId}
        className="appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
      >
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
      </select>
      {updatingUser === userId && (
        <RefreshCw className="w-4 h-4 animate-spin absolute right-2 top-2.5 text-gray-400" />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Admin Panel
              </h1>
              <p className="text-gray-600 mt-1">
                Logged in as{" "}
                <span className="font-semibold text-blue-600">
                  {user?.username}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchUsers}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <div className="hidden md:block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {totalUsers}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <h3 className="text-2xl font-bold text-red-600 mt-1">
                  {totalAdmins}
                </h3>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Moderators</p>
                <h3 className="text-2xl font-bold text-blue-600 mt-1">
                  {totalModerators}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Normal Users
                </p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">
                  {totalNormalUsers}
                </h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by username, email or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Filter by Role
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All Users" },
                  { value: "user", label: "Users" },
                  { value: "moderator", label: "Moderators" },
                  { value: "admin", label: "Admins" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setActiveRole(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeRole === value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {error ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">

                               <img src={u.image} alt="User" className="w-15 h-12 object-cover rounded-full " />


                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {u.username}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {u._id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {u.email}
                        </td>
                        <td className="px-6 py-4">
                          {u._id === user?.id ? (
                            <span className={roleBadge(u.role)}>
                              <RoleIcon role={u.role} />
                              {u.role} (You)
                            </span>
                          ) : (
                            <RoleSelector userId={u._id} currentRole={u.role} />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {u._id === user?.id ? (
                            <span className="text-sm text-gray-500">
                              Current user
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDelete(u._id)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden">
                {filteredUsers.map((u) => (
                  <div key={u._id} className="border-b border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <img src={u.image} alt="User" className="w-15 h-15 rounded-full" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">
                            {u.username}
                          </h3>
                          <p className="text-sm text-gray-600">{u.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {u._id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <span className={roleBadge(u.role)}>
                        <RoleIcon role={u.role} />
                        {u.role}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Change Role
                        </label>
                        {u._id === user?.id ? (
                          <div className="text-sm text-gray-500">
                            (You cannot change your own role)
                          </div>
                        ) : (
                          <RoleSelector userId={u._id} currentRole={u.role} />
                        )}
                      </div>

                      {u._id !== user?.id && (
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete User
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
              <div>
                Showing{" "}
                <span className="font-semibold">{filteredUsers.length}</span> of{" "}
                <span className="font-semibold">{users.length}</span> users
              </div>
              <div className="mt-2 sm:mt-0">
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
