// import { useEffect, useRef, useState } from "react";
// import axios from "../src/api/axios";

// const AdminNoticeEditor = () => {
//   const editorRef = useRef(null);

//   const [title, setTitle] = useState("Important Notice");
//   const [active, setActive] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // 🔁 Load notice
//   useEffect(() => {
//     const loadNotice = async () => {
//       try {
//         const res = await axios.get("/notice");

//         if (res.data) {
//           setTitle(res.data.title || "Important Notice");
//           setActive(res.data.active !== false);

//           if (editorRef.current) {
//             editorRef.current.innerHTML = res.data.messageHtml || "";
//           }
//         }
//       } catch (err) {
//         console.error("Failed to load notice", err);
//       }
//     };

//     loadNotice();
//   }, []);

//   // 🖊️ formatting command
//   const exec = (cmd) => {
//     document.execCommand(cmd, false, null);
//   };

//   // 💾 Save notice
//   const saveNotice = async () => {
//     setSaving(true);
//     try {
//       await axios.patch("/notice", {
//         title,
//         active,
//         messageHtml: editorRef.current.innerHTML,
//       });
//       alert("✅ Notice saved successfully");
//     } catch (err) {
//       alert("❌ Failed to save notice");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-6">
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500">
//           <h2 className="text-white text-lg font-bold flex items-center gap-2">
//             🔔 Admin Notice Editor
//           </h2>
//           <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
//             Live Notice
//           </span>
//         </div>

//         {/* Body */}
//         <div className="p-6 space-y-4">
//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Notice Title
//             </label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//               placeholder="Notice title"
//             />
//           </div>

//           {/* Toolbar */}
//           <div className="flex gap-2 flex-wrap">
//             <button onClick={() => exec("bold")} className="tool-btn">
//               B
//             </button>
//             <button onClick={() => exec("italic")} className="tool-btn">
//               I
//             </button>
//             <button onClick={() => exec("underline")} className="tool-btn">
//               U
//             </button>
//             <button
//               onClick={() => exec("insertUnorderedList")}
//               className="tool-btn"
//             >
//               • List
//             </button>
//             <button
//               onClick={() => exec("insertOrderedList")}
//               className="tool-btn"
//             >
//               1. List
//             </button>
//           </div>

//           {/* Editor */}
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Notice Content
//             </label>
//             <div
//               ref={editorRef}
//               contentEditable
//               className="border rounded-lg p-4 min-h-[200px] text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end px-6 py-4 bg-gray-50 border-t">
//           <button
//             disabled={saving}
//             onClick={saveNotice}
//             className={`px-6 py-2 rounded-lg text-white text-sm font-semibold transition ${
//               saving
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-indigo-600 hover:bg-indigo-700"
//             }`}
//           >
//             {saving ? "Saving..." : "Save Notice"}
//           </button>
//         </div>
//       </div>

//       {/* Styles */}
//       <style>
//         {`
//           .tool-btn {
//             border: 1px solid #d1d5db;
//             padding: 6px 10px;
//             border-radius: 6px;
//             font-size: 13px;
//             background: #f9fafb;
//             cursor: pointer;
//           }
//           .tool-btn:hover {
//             background: #e5e7eb;
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default AdminNoticeEditor;




import { useEffect, useRef, useState } from "react";
import axios from "../src/api/axios";

const AdminNoticeEditor = () => {
  const editorRef = useRef(null);

  // Notice
  const [title, setTitle] = useState("Important Notice");
  const [savingNotice, setSavingNotice] = useState(false);

  // Marquee
  const [marquee1, setMarquee1] = useState("");
  const [marquee2, setMarquee2] = useState("");
  const [savingMarquee, setSavingMarquee] = useState(false);

  // 🔁 Load Notice + Marquee
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [noticeRes, marqueeRes] = await Promise.all([
          axios.get("/notice"),
          axios.get("/marquee"),
        ]);

        // Notice
        if (noticeRes.data) {
          setTitle(noticeRes.data.title || "Important Notice");
          if (editorRef.current) {
            editorRef.current.innerHTML =
              noticeRes.data.messageHtml || "";
          }
        }

        // Marquee
        if (marqueeRes.data) {
          setMarquee1(marqueeRes.data.text1 || "");
          setMarquee2(marqueeRes.data.text2 || "");
        }
      } catch (err) {
        console.error("Failed to load notice/marquee", err);
      }
    };

    loadAll();
  }, []);

  // 🖊️ formatting
  const exec = (cmd) => {
    document.execCommand(cmd, false, null);
  };

  // 💾 Save Notice
  const saveNotice = async () => {
    setSavingNotice(true);
    try {
      await axios.patch("/notice", {
        title,
        messageHtml: editorRef.current.innerHTML,
      });
      alert("✅ Notice saved");
    } catch {
      alert("❌ Failed to save notice");
    } finally {
      setSavingNotice(false);
    }
  };

  // 💾 Save Marquee
  const saveMarquee = async () => {
    setSavingMarquee(true);
    try {
      await axios.patch("/marquee", {
        text1: marquee1,
        text2: marquee2,
      });
      alert("✅ Marquee updated");
    } catch {
      alert("❌ Failed to save marquee");
    } finally {
      setSavingMarquee(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 space-y-6">
      {/* ================= NOTICE ================= */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold">
          🔔 Admin Notice Editor
        </div>

        <div className="p-6 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Notice title"
          />

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => exec("bold")} className="tool-btn">B</button>
            <button onClick={() => exec("italic")} className="tool-btn">I</button>
            <button onClick={() => exec("underline")} className="tool-btn">U</button>
            <button onClick={() => exec("insertUnorderedList")} className="tool-btn">• List</button>
            <button onClick={() => exec("insertOrderedList")} className="tool-btn">1. List</button>
          </div>

          <div
            ref={editorRef}
            contentEditable
            className="border rounded-lg p-4 min-h-[200px] text-sm outline-none"
          />
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={saveNotice}
            disabled={savingNotice}
            className={`px-6 py-2 rounded-lg text-white text-sm font-semibold ${
              savingNotice
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {savingNotice ? "Saving..." : "Save Notice"}
          </button>
        </div>
      </div>

      {/* ================= MARQUEE ================= */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold">
          📢 Marquee Text Editor
        </div>

        <div className="p-6 space-y-4">
          <input
            value={marquee1}
            onChange={(e) => setMarquee1(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Marquee Text 1 (empty = off)"
          />

          <input
            value={marquee2}
            onChange={(e) => setMarquee2(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Marquee Text 2 (optional)"
          />

          <p className="text-xs text-gray-500">
            ℹ️ Both empty → marquee hidden automatically
          </p>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={saveMarquee}
            disabled={savingMarquee}
            className={`px-6 py-2 rounded-lg text-white text-sm font-semibold ${
              savingMarquee
                ? "bg-gray-400"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {savingMarquee ? "Saving..." : "Save Marquee"}
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>
        {`
          .tool-btn {
            border: 1px solid #d1d5db;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 13px;
            background: #f9fafb;
            cursor: pointer;
          }
          .tool-btn:hover {
            background: #e5e7eb;
          }
        `}
      </style>
    </div>
  );
};

export default AdminNoticeEditor;
