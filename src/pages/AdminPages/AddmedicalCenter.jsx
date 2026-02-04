import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "../../src/api/axios";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  MapPin,
  DollarSign,
  Users,
  Filter,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "react-toastify";

/* =====================
   CONSTANTS
===================== */
const EMPTY_FORM = {
  name: "",
  country: "",
  city: "",
  price: "",
  quota: "",
};

const EMPTY_FILTERS = {
  country: "all",
  city: "all",
  minPrice: "",
  maxPrice: "",
  minQuota: "",
};

const AdminMedicalCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [errors, setErrors] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  /* =====================
     HELPERS
  ===================== */
  const resetForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setErrors({});
  };

  /* =====================
     FETCH DATA
  ===================== */
  const fetchCenters = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/medicalCenters");
      setCenters(res.data.centers);
    } catch {
      toast.error("Failed to fetch medical centers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  /* =====================
     FORM LOGIC
  ===================== */
  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.country.trim()) errs.country = "Country is required";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.price || formData.price <= 0)
      errs.price = "Valid price required";
    if (!formData.quota || formData.quota <= 0)
      errs.quota = "Valid quota required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix form errors");
      return;
    }

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        quota: formData.quota.toString(),
      };

      editingId
        ? await axios.put(`/medicalCenters/${editingId}`, payload)
        : await axios.post("/medicalCenters/create", payload);

      toast.success(editingId ? "Updated successfully" : "Added successfully");
      resetForm();
      fetchCenters();
    } catch {
      toast.error("Action failed");
    }
  };

  /* =====================
     ACTIONS
  ===================== */
  const startEdit = (center) => {
    setEditingId(center._id);
    setFormData({
      name: center.name,
      country: center.country,
      city: center.city,
      price: center.price,
      quota: center.quota,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this medical center? This action cannot be undone.",
      )
    )
      return;
    try {
      await axios.delete(`/medicalCenters/${id}`);
      toast.success("Deleted successfully");
      fetchCenters();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =====================
     SORTING
  ===================== */
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  /* =====================
     FILTER LOGIC
  ===================== */
  const countries = useMemo(
    () => [...new Set(centers.map((c) => c.country))],
    [centers],
  );
  const cities = useMemo(
    () => [...new Set(centers.map((c) => c.city))],
    [centers],
  );

  const filteredAndSortedCenters = useMemo(() => {
    let filtered = centers.filter((c) => {
      const matchesSearch = [c.name, c.city, c.country]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCountry =
        filters.country === "all" || c.country === filters.country;

      const matchesCity = filters.city === "all" || c.city === filters.city;

      const matchesPrice =
        (!filters.minPrice || c.price >= Number(filters.minPrice)) &&
        (!filters.maxPrice || c.price <= Number(filters.maxPrice));

      const matchesQuota =
        !filters.minQuota || Number(c.quota) >= Number(filters.minQuota);

      return (
        matchesSearch &&
        matchesCountry &&
        matchesCity &&
        matchesPrice &&
        matchesQuota
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [centers, searchTerm, filters, sortConfig]);

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchTerm("");
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <header className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Medical Centers Admin
              </h1>
              <p className="text-gray-600 mt-1">
                Create, update, filter and manage medical centers
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {filteredAndSortedCenters.length} centers
              </span>
            </div>
          </div>
        </header>

        {/* SEARCH BAR */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, city, or country..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Filter size={18} />
              <span>Filters</span>
              {showFilters ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
          </div>

          {/* EXPANDABLE FILTERS */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.country}
                  onChange={(e) =>
                    setFilters({ ...filters, country: e.target.value })
                  }
                >
                  <option value="all">All Countries</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters({ ...filters, city: e.target.value })
                  }
                >
                  <option value="all">All Cities</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="$ Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="$ Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Quota
                </label>
                <input
                  type="number"
                  placeholder="Min Quota"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={filters.minQuota}
                  onChange={(e) =>
                    setFilters({ ...filters, minQuota: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingId ? (
                <>
                  <Edit2 className="inline-block mr-2" size={20} />
                  Edit Medical Center
                </>
              ) : (
                <>
                  <Plus className="inline-block mr-2" size={20} />
                  Add New Medical Center
                </>
              )}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["name", "country", "city", "price", "quota"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {["price"].includes(field) && " *"}
                  </label>
                  <input
                    type={["price"].includes(field) ? "number" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors[field]
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {errors[field] && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors ${
                  editingId
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {editingId ? "Update Center" : "Add New Center"}
              </button>
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center">
              <Loader2 className="animate-spin mx-auto text-blue-500 w-8 h-8" />
              <p className="mt-3 text-gray-500">Loading medical centers...</p>
            </div>
          ) : filteredAndSortedCenters.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No medical centers found
              </h3>
              <p className="text-gray-500">
                {searchTerm ||
                Object.values(filters).some((f) => f && f !== "all")
                  ? "Try adjusting your search or filters"
                  : "No medical centers available. Add your first one!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="p-4 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Center Name
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          ))}
                      </div>
                    </th>
                    <th
                      className="p-4 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("city")}
                    >
                      <div className="flex items-center gap-1">
                        Location
                        {sortConfig.key === "city" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          ))}
                      </div>
                    </th>
                    <th
                      className="p-4 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center gap-1">
                        Price / Quota
                        {sortConfig.key === "price" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          ))}
                      </div>
                    </th>
                    <th className="p-4 text-left font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedCenters.map((center) => (
                    <tr
                      key={center._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {center.name}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={14} />
                          <span>
                            {center.city}, {center.country}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-green-600" />
                            <span className="font-medium">
                              ${center.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-blue-600" />
                            <span>{center.quota.toLocaleString()} slots</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(center)}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(center._id)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SUMMARY */}
        {!loading && filteredAndSortedCenters.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
              <div>
                Showing{" "}
                <span className="font-medium">
                  {filteredAndSortedCenters.length}
                </span>{" "}
                of <span className="font-medium">{centers.length}</span> centers
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <DollarSign size={14} className="text-green-600" />
                  <span>
                    Average Price: $
                    {Math.round(
                      filteredAndSortedCenters.reduce(
                        (sum, c) => sum + c.price,
                        0,
                      ) / filteredAndSortedCenters.length,
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} className="text-blue-600" />
                  <span>
                    Total Quota:{" "}
                    {filteredAndSortedCenters
                      .reduce((sum, c) => sum + c.quota, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMedicalCenters;
