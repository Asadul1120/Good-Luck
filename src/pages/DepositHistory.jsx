import React from "react";

const DepositHistory = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4"> Deposit Request History</h1>
      <div className="flex gap-4">
        <div >
          <label>Start Date:</label>
          <input type="date" />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" />
        </div>
        <div>
          <label>Status: </label>
          <select>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <button> Apply Filter</button>
        </div>
      </div>
    </div>
  );
};

export default DepositHistory;
