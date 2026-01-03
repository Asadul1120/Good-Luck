import { Link } from "react-router-dom";
import { useState, useRef } from "react";

function Home() {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const startRef = useRef(null);
  const endRef = useRef(null);

  return (
    <div className="mt-6 px-4 max-w-7xl mx-auto">
      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <Link
          to="/normal-slip"
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold transition shadow hover:bg-indigo-600"
        >
          Normal Slip
        </Link>
        <Link
          to="/night-slip"
          className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition shadow hover:bg-green-600"
        >
          Night Slip
        </Link>
        <Link
          to="/special-slip"
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-semibold transition shadow hover:bg-cyan-600"
        >
          Special Slip
        </Link>
        <Link
          to="/"
          className="bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold transition shadow hover:bg-amber-600"
        >
          Slip Payment
        </Link>
      </div>

      {/* Filter Card */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Filter Slips
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Type
            </label>
            <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
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
            <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="all">All</option>
              <option value="canceled">CANCELLED</option>
              <option value="complete">COMPLETE</option>
              <option value="no-balance">NO-BALANCE</option>
              <option value="on-queue">ON QUEUE</option>
              <option value="processing">PROCESSING</option>
            </select>
          </div>

          {/* Start Date */}
          <div
            className="cursor-pointer"
            onClick={() => startRef.current && startRef.current.showPicker()}
          >
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Start Date
            </label>
            <input
              ref={startRef}
              type="date"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>

          {/* End Date */}
          <div
            className="cursor-pointer"
            onClick={() => endRef.current && endRef.current.showPicker()}
          >
            <label className="block text-sm font-medium mb-1 text-gray-600">
              End Date
            </label>
            <input
              ref={endRef}
              type="date"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>

          {/* Apply Button */}
          <div className="flex items-end">
            <button className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold transition shadow hover:bg-indigo-600">
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
