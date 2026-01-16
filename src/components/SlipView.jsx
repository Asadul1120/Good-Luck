import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../src/api/axios";


const SlipView = () => {
    const { id } = useParams();
  const [slip, setSlip] = useState(null);

  useEffect(() => {
    axios.get(`/slips/${id}`).then((res) => {
      setSlip(res.data);
    });
  }, [id]);
  if (!slip) return null;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-8">
      <div className="w-full max-w-4xl bg-white shadow border rounded">

        {/* HEADER BUTTONS */}
        <div className="flex justify-center gap-4 py-4 border-b">
          <button className="px-6 py-2 border rounded">Close</button>
          <button className="px-6 py-2 bg-black text-white rounded">
            PDF
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-black text-white rounded"
          >
            Print
          </button>
        </div>

        {/* TITLE */}
        <div className="text-center py-6">
          <h2 className="text-lg font-semibold">
            Medical Examination Appointment Slip
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Generated date <br />
            <span className="font-medium">
              {formatDate(slip.createdAt)}
            </span>
          </p>

          <p className="text-sm text-red-600 mt-2">
            Slip is valid only till undefined
          </p>
        </div>

        {/* BARCODE */}
        <div className="flex justify-center py-6 border-t border-b">
          <div className="h-12 w-72 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px)]" />
        </div>

        {/* MAIN INFO */}
        <div className="p-6 text-sm">
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">

            <Field label="First name" value={slip.firstName} />
            <Field label="Last name" value={slip.lastName} />

            <Field label="Nationality" value={slip.nationality} />
            <Field label="National ID" value={slip.nationalId} />

            <Field label="Gender" value={slip.gender} />
            <Field label="Date of Birth" value={formatDate(slip.dateOfBirth)} />

            <Field label="Marital status" value={slip.maritalStatus} />
            <Field label="Country traveling to" value={slip.travelCountry} />

            <Field label="Passport No" value={slip.passportNumber} />
            <Field label="Passport issues place" value={slip.city} />

            <Field
              label="Passport issue date"
              value={formatDate(slip.passportIssueDate)}
            />
            <Field
              label="Passport expiry date"
              value={formatDate(slip.passportExpiryDate)}
            />

            <Field label="Applied position" value={slip.positionAppliedFor} />
            <Field label="Appointment Type" value="Standard" />

            <Field label="Amount" value="10 USD" />
            <div>
              <p className="text-gray-500">Payment status</p>
              <p className="text-green-600 font-semibold flex items-center gap-1">
                ● PAID
              </p>
            </div>
          </div>
        </div>

        {/* MEDICAL CENTER */}
        <div className="bg-gray-50 p-6 border-t">
          <h3 className="font-semibold text-center mb-4">
            Medical center information
          </h3>

          <div className="text-sm space-y-2">
            <p>
              <span className="text-gray-500">Medical Center Name</span>
              <br />
              ALTASHKHIS MARKAZ LIMITED
            </p>

            <p>
              <span className="text-gray-500">Location</span>
              <br />
              Dhaka, Bangladesh
            </p>

            <p>
              <span className="text-gray-500">Mobile Number</span>
              <br />
              +8801712345678
            </p>

            <p>
              <span className="text-gray-500">Email</span>
              <br />
              altashkhismedical@gmail.com
            </p>

            <p>
              <span className="text-gray-500">Website</span>
              <br />
              www.altashkhismedical.com
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-500 py-4 border-t">
          © 2026 Gulf Health Council. All rights reserved
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

export default SlipView;


