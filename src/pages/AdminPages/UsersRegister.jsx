import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    role: "user",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_URL}/users/register`,
        formData,
        { withCredentials: true }
      );

      setMessage("User created successfully 🎉");
      console.log(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm text-red-500">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" placeholder="Username" required onChange={handleChange} className="w-full px-4 py-2 border rounded" />
          <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full px-4 py-2 border rounded" />
          <input name="phone" placeholder="Phone" required onChange={handleChange} className="w-full px-4 py-2 border rounded" />
          <input name="address" placeholder="Address" required onChange={handleChange} className="w-full px-4 py-2 border rounded" />

          <select name="role" onChange={handleChange} className="w-full px-4 py-2 border rounded">
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>

          <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full px-4 py-2 border rounded" />

          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
