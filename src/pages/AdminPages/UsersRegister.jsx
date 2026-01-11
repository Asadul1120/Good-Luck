import { useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

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
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    if (!formData.password || formData.password.length < 6) {
      setMessage({
        text: "Password কমপক্ষে ৬ অক্ষরের হতে হবে",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/users/register`, formData, {
        withCredentials: true,
      });

      setMessage({
        text: "Account সফলভাবে তৈরি হয়েছে 🎉",
        type: "success",
      });
      setSuccess(true);

      setTimeout(() => {
        setFormData({
          username: "",
          email: "",
          phone: "",
          address: "",
          role: "user",
          password: "",
        });
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Registration ব্যর্থ হয়েছে",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    icon: Icon,
    name,
    type = "text",
    placeholder,
    required = true,
  }) => (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={formData[name]}
        onChange={handleChange}
        className="w-full text-base pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Shield className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Create User Account
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Form */}
            <div className="md:w-2/3 p-6 sm:p-8 md:p-10">
              {message.text && (
                <div
                  className={`mb-5 p-4 rounded-xl flex gap-3 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle />
                  ) : (
                    <AlertCircle />
                  )}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    icon={User}
                    name="username"
                    placeholder="Username"
                  />
                  <InputField
                    icon={Mail}
                    name="email"
                    type="email"
                    placeholder="Email"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField icon={Phone} name="phone" placeholder="Phone" />
                  <InputField
                    icon={MapPin}
                    name="address"
                    placeholder="Address"
                  />
                </div>

                {/* Role */}
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full text-base py-3 px-4 bg-gray-50 border rounded-xl"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                </select>

                {/* Password */}
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full text-base py-3 pl-4 pr-12 bg-gray-50 border rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                {/* Submit */}
                <button
                  disabled={loading || success}
                  className="w-full py-4 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> Creating...
                    </>
                  ) : success ? (
                    "Account Created!"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </div>

            {/* Info Panel (Desktop only) */}
            <div className="hidden md:block md:w-1/3 bg-gradient-to-b from-blue-600 to-purple-700 p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Benefits</h3>
              <ul className="space-y-3 text-sm">
                <li>✔ Secure Account</li>
                <li>✔ Full Access</li>
                <li>✔ Community Support</li>
                <li>✔ 24/7 Help</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {["Secure", "Fast", "Support"].map((t) => (
            <div
              key={t}
              className="bg-white/60 rounded-xl p-4 text-center text-sm font-medium"
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;
