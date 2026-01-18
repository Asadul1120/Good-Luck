// import React, { useMemo, useState } from "react";

// /* 🔹 Mock Data (replace with API later) */
// const medicalCenters = [
//   {
//     id: 1,
//     name: "Al Noor Medical Center",
//     country: "Bangladesh",
//     city: "Dhaka",
//     address1: "House 12, Road 5",
//     address2: "Dhanmondi",
//     phone: "+880123456789",
//     email: "info@alnoor.com",
//     website: "https://alnoor.com",
//     rating: 4.5,
//     time: "9AM - 10PM",
//   },
//   {
//     id: 2,
//     name: "Care Plus Hospital",
//     country: "India",
//     city: "Delhi",
//     address1: "Sector 21",
//     address2: "Near Metro",
//     phone: "+911234567890",
//     email: "contact@careplus.in",
//     website: "https://careplus.in",
//     rating: 4.2,
//     time: "24 Hours",
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

// const MedicalCenter = () => {
//   const [country, setCountry] = useState("");
//   const [city, setCity] = useState("");
//   const [centerName, setCenterName] = useState("");

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
//           center.name.toLowerCase().includes(centerName.toLowerCase()))
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
//                   <option key={c}>{c}</option>
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
//                   <option key={c}>{c}</option>
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

//             {/* Buttons */}
//             <div className="flex gap-3 items-end">
//               <button
//                 onClick={handleReset}
//                 className="w-full border px-4 py-2 rounded-md"
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
//                 {[
//                   "Name",
//                   "Country",
//                   "City",
//                   "Address",
//                   "Phone",
//                   "Email",
//                   "Website",
//                   "Rating",
//                   "Time",
//                 ].map((h) => (
//                   <th key={h} className="border px-3 py-2">
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
//                 filteredCenters.map((c) => (
//                   <tr key={c.id} className="hover:bg-gray-50">
//                     <td className="border px-2 py-1">{c.name}</td>
//                     <td className="border px-2 py-1">{c.country}</td>
//                     <td className="border px-2 py-1">{c.city}</td>
//                     <td className="border px-2 py-1">
//                       {c.address1}, {c.address2}
//                     </td>
//                     <td className="border px-2 py-1">{c.phone}</td>
//                     <td className="border px-2 py-1">{c.email}</td>
//                     <td className="border px-2 py-1">
//                       <a href={c.website} className="text-indigo-600 underline">
//                         Visit
//                       </a>
//                     </td>
//                     <td className="border px-2 py-1">{c.rating}</td>
//                     <td className="border px-2 py-1">{c.time}</td>
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

import React, { useMemo, useState } from "react";

/* 🔹 Mock Data (replace with API later) */
const medicalCenters = [
  {
    id: 1,
    name: "Al Noor Medical Center",
    country: "Bangladesh",
    city: "Dhaka",
    address1: "House 12, Road 5",
    address2: "Dhanmondi",
    phone: "+880123456789",
    email: "info@alnoor.com",
    website: "https://alnoor.com",
    rating: 4.5,
    time: "9AM - 10PM",
  },
  {
    id: 2,
    name: "Care Plus Hospital",
    country: "India",
    city: "Delhi",
    address1: "Sector 21",
    address2: "Near Metro",
    phone: "+911234567890",
    email: "contact@careplus.in",
    website: "https://careplus.in",
    rating: 4.2,
    time: "24 Hours",
  },
];

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
  }, [country, city, centerName]);

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
              {filteredCenters.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-4 text-gray-500">
                    No medical centers found
                  </td>
                </tr>
              ) : (
                filteredCenters.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{c.name}</td>
                    <td className="border px-2 py-1">{c.country}</td>
                    <td className="border px-2 py-1">{c.city}</td>
                    <td className="border px-2 py-1">
                      {c.address1}, {c.address2}
                    </td>
                    <td className="border px-2 py-1">
                      <a href={`tel:${c.phone}`} className="text-blue-600">
                        {c.phone}
                      </a>
                    </td>
                    <td className="border px-2 py-1">
                      <a href={`mailto:${c.email}`} className="text-blue-600">
                        {c.email}
                      </a>
                    </td>
                    <td className="border px-2 py-1">
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 underline"
                      >
                        Visit
                      </a>
                    </td>
                    <td className="border px-2 py-1">⭐ {c.rating}</td>
                    <td className="border px-2 py-1">{c.time}</td>
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
