// import React, { useMemo, useState, useEffect } from "react";
// import axios from "../src/api/axios";

// /* 🔹 Mock Data (replace with API later) */

// const medicalCenters = [
//   {
//     id: "1ew65a4",
//     name: "Al Noor Medical Center",
//     country: "Bangladesh",
//     city: "Dhaka",
//     price: "1000",
//     Quota: "5",
//   },
//   {
//     id: "1ew65a5",
//     name: "Care Plus Hospital",
//     country: "India",
//     city: "Delhi",
//     price: "1000",
//     Quota: "5",
//   },
// ];

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
//     "Comilla",
//   ],
//   India: ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad"],
//   Pakistan: ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"],
//   Nepal: ["Kathmandu", "Biratnagar", "Pokhara", "Butwal", "Jhapa"],
// };

// const tableHeaders = ["S.L", "Name", "Country", "City", "Price", "Quota"];

// const MedicalCenter = () => {
//   const [country, setCountry] = useState("");
//   const [city, setCity] = useState("");
//   const [centerName, setCenterName] = useState("");
//   const [medicalCenters, setMedicalCenters] = useState([]);

//   useEffect(() => {
//     try {
//       axios
//         .get("/medicalCenters")
//         .then((res) => setMedicalCenters(res.data.centers))
//         .catch((err) => console.log(err));
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

//   /* 🔹 Cities based on selected country */
//   const cities = useMemo(() => {
//     return country ? countryCityMap[country] || [] : [];
//   }, [country]);

//   /* 🔹 Filtered Results */
//   const filteredCenters = useMemo(() => {
//     return medicalCenters.filter((center) => {
//       return (
//         (!country || center.country === country) &&
//         (!city || center.city === city) &&
//         (!centerName ||
//           center.name?.toLowerCase().includes(centerName.toLowerCase()))
//       );
//     });
//   }, [country, city, centerName]);

//   const handleReset = () => {
//     setCountry("");
//     setCity("");
//     setCenterName("");
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
//                 onChange={(e) => {
//                   setCountry(e.target.value);
//                   setCity("");
//                 }}
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
//                 onChange={(e) => setCity(e.target.value)}
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

//             {/* Center Name */}
//             <div>
//               <label className="text-sm text-gray-600">
//                 Medical Center Name
//               </label>
//               <input
//                 type="text"
//                 value={centerName}
//                 onChange={(e) => setCenterName(e.target.value)}
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
//           <table className="min-w-full text-sm text-center border">
//             <thead className="bg-gray-50">
//               <tr>
//                 {tableHeaders.map((h) => (
//                   <th key={h} className="border px-3 py-2 font-semibold">
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {filteredCenters.length === 0 ? (
//                 <tr>
//                   <td colSpan="9" className="py-4 text-gray-500">
//                     No medical centers found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredCenters.map((c, index) => (
//                   <tr key={index}>
//                     <td className="border px-3 py-2">{index + 1}</td>
//                     <td className="border px-3 py-2">{c.name}</td>
//                     <td className="border px-3 py-2">{c.country}</td>
//                     <td className="border px-3 py-2">{c.city}</td>
//                     <td className="border px-3 py-2">{c.price}</td>
//                     <td className="border px-3 py-2">{c.Quota}</td>
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






import React, { useMemo, useState, useEffect } from "react";
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
    "Comilla",
  ],
  India: ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad"],
  Pakistan: ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"],
  Nepal: ["Kathmandu", "Biratnagar", "Pokhara", "Butwal", "Jhapa"],
};

const tableHeaders = ["S.L", "Name", "Country", "City", "Price", "Quota"];

const MedicalCenter = () => {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [centerName, setCenterName] = useState("");
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 Fetch from API */
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get("/medicalCenters");
        setMedicalCenters(res.data.centers || []);
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
    return country ? countryCityMap[country] || [] : [];
  }, [country]);

  /* 🔹 Filtered Results */
  const filteredCenters = useMemo(() => {
    return medicalCenters.filter((center) => {
      return (
        (!country || center.country === country) &&
        (!city || center.city === city) &&
        (!centerName ||
          center.name?.toLowerCase().includes(centerName.toLowerCase()))
      );
    });
  }, [country, city, centerName, medicalCenters]);

  const handleReset = () => {
    setCountry("");
    setCity("");
    setCenterName("");
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
                onChange={(e) => {
                  setCountry(e.target.value);
                  setCity("");
                }}
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
                onChange={(e) => setCity(e.target.value)}
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

            {/* Center Name */}
            <div>
              <label className="text-sm text-gray-600">
                Medical Center Name
              </label>
              <input
                type="text"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
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
          <table className="min-w-full text-sm text-center border">
            <thead className="bg-gray-50">
              <tr>
                {tableHeaders.map((h) => (
                  <th key={h} className="border px-3 py-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
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
                filteredCenters.map((c, index) => (
                  <tr key={c._id}>
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2">{c.name}</td>
                    <td className="border px-3 py-2">{c.country}</td>
                    <td className="border px-3 py-2">{c.city}</td>
                    <td className="border px-3 py-2">{c.price}</td>
                    <td className="border px-3 py-2">{c.quota}</td>
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
