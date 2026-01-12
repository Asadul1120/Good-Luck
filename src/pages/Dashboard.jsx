import { Link } from "react-router-dom";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Dashboard() {
  const today = new Date();

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // mobile detection
  const isMobile = window.innerWidth < 768;

  const tableData = [
    {
      serial: 1,
      id: "SLP-1001",
      slipType: "Normal",
      dateTime: "2026-01-12 03:30 PM",
      slipStatus: "Pending",
      city: "Dhaka",
      travelingCountry: "Bangladesh",
      firstName: "Asadul",
      lastName: "Islam",
      dob: "1998-05-20",
      passport: "BA1234567",
      center: "Dhaka Center",
      allocateCenter: "Gulshan Center",
      remarks: "Documents OK",
      action: "View",
    },
    {
      serial: 2,
      id: "SLP-1002",
      slipType: "Normal",
      dateTime: "2026-01-12 03:30 PM",
      slipStatus: "Processed",
      city: "Dhaka",
      travelingCountry: "Bangladesh",
      firstName: "Muhammad",
      lastName: "Islam",
      dob: "1998-05-20",
      passport: "BA1234567",
      center: "Dhaka Center",
      allocateCenter: "Gulshan Center",
      remarks: "Documents OK",
      action: "View",
    },
  ];

  return (
    <div className="mt-4 px-3 sm:px-4 max-w-7xl mx-auto">
      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 mb-6">
        <Link
          to="/normal-slip"
          className="bg-indigo-500 text-white text-center px-3 py-2 rounded-lg font-semibold shadow hover:bg-indigo-600"
        >
          Normal Slip
        </Link>
        <Link
          to="/night-slip"
          className="bg-green-500 text-white text-center px-3 py-2 rounded-lg font-semibold shadow hover:bg-green-600"
        >
          Night Slip
        </Link>
        <Link
          to="/special-slip"
          className="bg-cyan-500 text-white text-center px-3 py-2 rounded-lg font-semibold shadow hover:bg-cyan-600"
        >
          Special Slip
        </Link>
        <Link
          to="/slip-payment"
          className="bg-amber-500 text-white text-center px-3 py-2 rounded-lg font-semibold shadow hover:bg-amber-600"
        >
          Slip Payment
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Type
            </label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="all">All</option>
              <option value="normal">Normal</option>
              <option value="night">Normal Night</option>
              <option value="special">Special</option>
              <option value="slip">Slip Payment</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Status
            </label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="all">All</option>
              <option value="canceled">CANCELLED</option>
              <option value="complete">COMPLETE</option>
              <option value="no-balance">NO-BALANCE</option>
              <option value="on-queue">ON QUEUE</option>
              <option value="processing">PROCESSING</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              isClearable
              showPopperArrow={false}
              maxDate={new Date()}
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              isClearable
              showPopperArrow={false}
              minDate={startDate}
              maxDate={new Date()}
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          {/* Button */}
          <div className="lg:col-span-2">
            <button className="w-full bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border border-gray-300">
            <thead className="bg-neutral-800 text-white uppercase">
              <tr>
                {[
                  "S/L",
                  "ID",
                  "Slip_Type",
                  "Date_Time",
                  "Slip Status",
                  "City",
                  "T.Country",
                  "First Name",
                  "Last Name",
                  "DOB",
                  "Passport",
                  "Center",
                  "Allocate Center",
                  "Remarks",
                  "Action",
                ].map((head) => (
                  <th key={head} className="px-4 py-2 border border-gray-300">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100 ">
                    <td className="border px-4 py-2">{row.serial}</td>
                    <td className="border px-4 py-2">{row.id}</td>
                    <td className="border px-4 py-2">{row.slipType}</td>
                    <td className="border px-4 py-2 ">{row.dateTime}</td>
                    <td className="border px-4 py-2 bg-green-600 text-white ">{row.slipStatus}</td>
                    <td className="border px-4 py-2">{row.city}</td>
                    <td className="border px-4 py-2">{row.travelingCountry}</td>
                    <td className="border px-4 py-2">{row.firstName}</td>
                    <td className="border px-4 py-2">{row.lastName}</td>
                    <td className="border px-4 py-2">{row.dob}</td>
                    <td className="border px-4 py-2">{row.passport}</td>
                    <td className="border px-4 py-2">{row.center}</td>
                    <td className="border px-4 py-2">{row.allocateCenter}</td>
                    <td className="border px-4 py-2">{row.remarks}</td>
                    <td className="border px-4 py-2 text-blue-600 font-medium">
                      {row.action}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="15" className="py-6 text-center text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
