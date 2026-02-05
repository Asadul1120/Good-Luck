// import React, { useEffect, useMemo, useState } from "react";
// import axios from "../src/api/axios";

// /* 🔹 Country → City mapping */
// const countryCityMap = {
//   Bangladesh: [
//     "Dhaka",
//     "Mymensingh",
//     "Rangpur",
//     "Chittagong",
//     "Sylhet",
//     "Khulna",
//     "Rajshahi",
//     "Barishal",
//     "Cumilla",
//   ],
//   India: ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad"],
//   Pakistan: ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"],
//   Nepal: ["Kathmandu", "Biratnagar", "Pokhara", "Butwal", "Jhapa"],
// };

// const TABLE_HEADERS = ["S.L", "Name", "Country", "City", "Price", "Quota"];

// const MedicalCenter = () => {
//   const [filters, setFilters] = useState({
//     country: "",
//     city: "",
//     centerName: "",
//   });

//   const [medicalCenters, setMedicalCenters] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const { country, city, centerName } = filters;

//   /* 🔹 Fetch medical centers */
//   useEffect(() => {
//     const fetchCenters = async () => {
//       try {
//         const res = await axios.get("/medicalCenters");
//         setMedicalCenters(res.data?.centers || []);
//       } catch (error) {
//         console.error("Failed to load medical centers", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCenters();
//   }, []);

//   /* 🔹 Cities based on country */
//   const cities = useMemo(
//     () => (country ? countryCityMap[country] || [] : []),
//     [country],
//   );

//   /* 🔹 Filtered medical centers */
//   const filteredCenters = useMemo(() => {
//     return medicalCenters.filter((center) => {
//       const matchCountry = !country || center.country === country;
//       const matchCity = !city || center.city === city;
//       const matchName =
//         !centerName ||
//         center.name?.toLowerCase().includes(centerName.toLowerCase());

//       return matchCountry && matchCity && matchName;
//     });
//   }, [medicalCenters, country, city, centerName]);

//   const handleChange = (field, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [field]: value,
//       ...(field === "country" && { city: "" }),
//     }));
//   };

//   const handleReset = () => {
//     setFilters({ country: "", city: "", centerName: "" });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-6">
//       <div className="bg-white rounded-lg shadow p-4 md:p-6">
//         <h1 className="text-2xl font-bold text-green-600 mb-6">
//           🏥 All Medical Centers
//         </h1>

//         {/* 🔍 Search Tools */}
//         <div className="mb-6">
//           <p className="text-lg font-semibold text-gray-600 mb-3">
//             Search Tools
//           </p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Country */}
//             <div>
//               <label className="text-sm text-gray-600">Country</label>
//               <select
//                 value={country}
//                 onChange={(e) => handleChange("country", e.target.value)}
//                 className="w-full border rounded-md px-3 py-2"
//               >
//                 <option value="">Select Country</option>
//                 {Object.keys(countryCityMap).map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* City */}
//             <div>
//               <label className="text-sm text-gray-600">City</label>
//               <select
//                 value={city}
//                 onChange={(e) => handleChange("city", e.target.value)}
//                 className="w-full border rounded-md px-3 py-2"
//                 disabled={!country}
//               >
//                 <option value="">Select City</option>
//                 {cities.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Medical Center Name */}
//             <div>
//               <label className="text-sm text-gray-600">
//                 Medical Center Name
//               </label>
//               <input
//                 type="text"
//                 value={centerName}
//                 onChange={(e) => handleChange("centerName", e.target.value)}
//                 placeholder="Enter medical center name"
//                 className="w-full border rounded-md px-3 py-2"
//               />
//             </div>

//             {/* Reset */}
//             <div className="flex items-end">
//               <button
//                 onClick={handleReset}
//                 className="w-full border px-4 py-2 rounded-md hover:bg-gray-100"
//               >
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* 📊 Results */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm text-left  border">
//             <thead className="bg-gray-50">
//               <tr>
//                 {TABLE_HEADERS.map((header) => (
//                   <th key={header} className="border px-3 py-2 font-semibold">
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody className="">
//               {loading ? (
//                 <tr >
//                   <td colSpan="6" className="py-4 text-gray-500">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filteredCenters.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="py-4 text-gray-500">
//                     No medical centers found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCenters.map((center, index) => (
//                   <tr key={center._id}>
//                     <td className="border px-3 py-2">{index + 1}</td>
//                     <td className="border px-3 py-2">{center.name}</td>
//                     <td className="border px-3 py-2">{center.country}</td>
//                     <td className="border px-3 py-2">{center.city}</td>
//                     <td className="border px-3 py-2">{center.price}</td>
//                     <td className="border px-3 py-2">{center.quota}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MedicalCenter;

import React, { useEffect, useMemo, useState } from "react";
import axios from "../src/api/axios";

const TABLE_HEADERS = ["S.L", "Name", "Country", "City", "Price", "Quota"];

const MedicalCenter = () => {
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    centerName: "",
  });

  const [medicalCenters, setMedicalCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countryCityMap, setCountryCityMap] = useState({});
  const [allCountries, setAllCountries] = useState([]);

  const { country, city, centerName } = filters;

  /* 🔹 Fetch medical centers and create country-city mapping */
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/medicalCenters");
        const centers = res.data?.centers || [];
        setMedicalCenters(centers);

        // Create country-city mapping from API data
        const map = {};
        const countriesSet = new Set();

        centers.forEach((center) => {
          if (center.country && center.city) {
            // Add country to set
            countriesSet.add(center.country.trim());

            // Add city to country's city list
            if (!map[center.country.trim()]) {
              map[center.country.trim()] = new Set();
            }
            map[center.country.trim()].add(center.city.trim());
          }
        });

        // Convert Set to Array for each country
        const finalMap = {};
        Object.keys(map).forEach((countryName) => {
          finalMap[countryName] = Array.from(map[countryName]).sort();
        });

        setCountryCityMap(finalMap);

        // Convert countries set to sorted array
        const sortedCountries = Array.from(countriesSet).sort();
        setAllCountries(sortedCountries);
      } catch (error) {
        console.error("Failed to load medical centers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  /* 🔹 Cities based on selected country */
  const cities = useMemo(() => {
    if (!country || !countryCityMap[country]) return [];
    return countryCityMap[country];
  }, [country, countryCityMap]);

  /* 🔹 Filtered medical centers */
  const filteredCenters = useMemo(() => {
    return medicalCenters.filter((center) => {
      const centerCountry = center.country?.trim() || "";
      const centerCity = center.city?.trim() || "";
      const centerNameLower = center.name?.toLowerCase() || "";

      const matchCountry = !country || centerCountry === country;
      const matchCity = !city || centerCity === city;
      const matchName =
        !centerName || centerNameLower.includes(centerName.toLowerCase());

      return matchCountry && matchCity && matchName;
    });
  }, [medicalCenters, country, city, centerName]);

  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "country" && { city: "" }), // Reset city when country changes
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => handleChange("country", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {allCountries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {allCountries.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {allCountries.length} countries available
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                value={city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!country || cities.length === 0}
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {country && (
                <p className="text-xs text-gray-500 mt-1">
                  {cities.length} {cities.length === 1 ? "city" : "cities"}{" "}
                  available
                </p>
              )}
            </div>

            {/* Medical Center Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Center Name
              </label>
              <input
                type="text"
                value={centerName}
                onChange={(e) => handleChange("centerName", e.target.value)}
                placeholder="Enter medical center name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 px-4 py-2 rounded-md transition duration-200 font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium">{filteredCenters.length}</span>{" "}
              medical centers found
              {(country || city || centerName) && (
                <span className="ml-2">
                  (filtered from {medicalCenters.length} total)
                </span>
              )}
            </div>
          )}
        </div>

        {/* 📊 Results Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 font-semibold text-gray-700 border-b"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                    <p className="mt-2 text-gray-500">
                      Loading medical centers...
                    </p>
                  </td>
                </tr>
              ) : filteredCenters.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="text-gray-400 mb-2">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    No medical centers found
                    {(country || city || centerName) && (
                      <p className="text-sm mt-1">Try changing your filters</p>
                    )}
                  </td>
                </tr>
              ) : (
                filteredCenters.map((center, index) => (
                  <tr
                    key={center._id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {center.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {center.country}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{center.city}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-green-600">
                        ${center.price}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {center.quota}
                      </span>
                    </td>
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
