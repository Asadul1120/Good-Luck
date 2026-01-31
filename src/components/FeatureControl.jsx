import { useEffect, useState } from "react";
import axios from "../src/api/axios";
import { useAuth } from "../context/AuthContext";

const FeatureControl = () => {
  const { refreshFeatures } = useAuth();
  const [features, setFeatures] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadFeatures = async () => {
    const res = await axios.get("/features");
    setFeatures(res.data);
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const toggleFeature = async (key) => {
    if (!features) return;

    const updatedValue = !features[key];
    setSaving(true);

    try {
      await axios.patch("/features", {
        [key]: updatedValue,
      });

      setFeatures((prev) => ({
        ...prev,
        [key]: updatedValue,
      }));

      refreshFeatures(); // 🔄 frontend global update
    } finally {
      setSaving(false);
    }
  };

  if (!features)
    return (
      <div className="mb-4 bg-white p-3 rounded-lg shadow text-xs text-gray-500">
        Loading features...
      </div>
    );

  // 🔔 NOTICE যোগ করা হয়েছে
  const featureList = [
    { key: "normalSlip", label: "Normal Slip" },
    { key: "nightSlip", label: "Night Slip" },
    { key: "specialSlip", label: "Special Slip" },
    { key: "slipPayment", label: "Slip Payment" },
    { key: "noticeEnabled", label: "Notice Popup" },
    { key: "marqueeEnabled", label: "Heade Line" },
  ];

  return (
    <div className="mb-5 bg-white p-3 rounded-xl shadow">
      <div className="flex items-center gap-3 flex-nowrap overflow-x-auto text-xs">
        {featureList.map((item) => {
          const enabled = features[item.key];

          return (
            <div
              key={item.key}
              className="flex items-center gap-1 whitespace-nowrap border px-2 py-1 rounded-md"
            >
              <span className="font-semibold text-gray-700">{item.label}</span>

              <button
                disabled={saving}
                onClick={() => toggleFeature(item.key)}
                className={`
                  px-2 py-[2px]
                  text-[10px] font-bold
                  rounded
                  ${
                    enabled
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }
                  ${saving ? "opacity-60 cursor-not-allowed" : ""}
                `}
              >
                {enabled ? "ON" : "OFF"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureControl;
