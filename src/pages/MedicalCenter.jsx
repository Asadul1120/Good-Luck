import React, { useEffect, useMemo, useState } from "react";
import axios from "../src/api/axios";

/* 🔹 Country → City mapping */
const countryCityMap = {
  Bangladesh: [
    "Dhaka",
    "Mymensingh",
    "Rangpur",
    "Chittagong",
    "Sylhet",
    "Khulna",
    "Rajshahi",
    "Barishal",
    "Cumilla",
  ],
  India: ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad"],
  Pakistan: ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"],
  Nepal: ["Kathmandu", "Biratnagar", "Pokhara", "Butwal", "Jhapa"],
};

const TABLE_HEADERS = ["S.L", "Name", "Country", "City", "Price", "Quota"];

const MedicalCenter = () => {
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    centerName: "",
  });

  const [medicalCenters, setMedicalCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  const { country, city, centerName } = filters;

  /* 🔹 Fetch medical centers */
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get("/medicalCenters");
        setMedicalCenters(res.data?.centers || []);
      } catch (error) {
        console.error("Failed to load medical centers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  /* 🔹 Cities based on country */
  const cities = useMemo(
    () => (country ? countryCityMap[country] || [] : []),
    [country],
  );

  /* 🔹 Filtered medical centers */
  const filteredCenters = useMemo(() => {
    return medicalCenters.filter((center) => {
      const matchCountry = !country || center.country === country;
      const matchCity = !city || center.city === city;
      const matchName =
        !centerName ||
        center.name?.toLowerCase().includes(centerName.toLowerCase());

      return matchCountry && matchCity && matchName;
    });
  }, [medicalCenters, country, city, centerName]);

  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "country" && { city: "" }),
    }));
  };

  const handleReset = () => {
    setFilters({ country: "", city: "", centerName: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h1 className="text-2xl font-bold text-green-600 mb-6">
          🏥 All Medical Centers
        </h1>

        {/* 🔍 Search Tools */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-600 mb-3">
            Search Tools
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Country */}
            <div>
              <label className="text-sm text-gray-600">Country</label>
              <select
                value={country}
                onChange={(e) => handleChange("country", e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Select Country</option>
                {Object.keys(countryCityMap).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="text-sm text-gray-600">City</label>
              <select
                value={city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                disabled={!country}
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Medical Center Name */}
            <div>
              <label className="text-sm text-gray-600">
                Medical Center Name
              </label>
              <input
                type="text"
                value={centerName}
                onChange={(e) => handleChange("centerName", e.target.value)}
                placeholder="Enter medical center name"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Reset */}
            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="w-full border px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* 📊 Results */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left  border">
            <thead className="bg-gray-50">
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th key={header} className="border px-3 py-2 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="">
              {loading ? (
                <tr >
                  <td colSpan="6" className="py-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredCenters.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 text-gray-500">
                    No medical centers found
                  </td>
                </tr>
              ) : (
                filteredCenters.map((center, index) => (
                  <tr key={center._id}>
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2">{center.name}</td>
                    <td className="border px-3 py-2">{center.country}</td>
                    <td className="border px-3 py-2">{center.city}</td>
                    <td className="border px-3 py-2">{center.price}</td>
                    <td className="border px-3 py-2">{center.quota}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicalCenter;
