// import { useState } from "react";
// // import { tabs } from "../../../../lib/data";
// export const tabs = [
//   { id: 1, label: "ข้อมูลสี", content: "ข้อมูลสี" },
//   {
//     id: 2,
//     label: "ข้อมูลขนาด",
//     content: "This is the View Package tab content.",
//   },
//   { id: 3, label: "ข้อมูลประเภท", content: "This is the HR List tab content." },
//   {
//     id: 4,
//     label: "ข้อมูลแบรนด์",
//     content: "This is the HR List tab content.",
//   },
//   { id: 5, label: "ข้อมูลเพศ", content: "This is the HR List tab content." },
// ];
// export default function Tabbar() {
//   const [openTab, setOpenTab] = useState(1);

//   const activeClasses =
//     "border-l border-t border-r rounded-t-lg text-primary-800 bg-primary-400";
//   const inactiveClasses =
//     "text-primary-500 hover:text-primary-700 rounded-t-lg bg-primary-100";

//   return (
//     <div className="w-full p-6">
//       <ul className="flex">
//         {tabs.map((tab) => (
//           <li
//             key={tab.id}
//             onClick={() => setOpenTab(tab.id)}
//             className={` ${openTab === tab.id ? "-mb-px" : ""}`}
//           >
//             <a
//               className={`inline-block px-10 py-3 font-semibold ${
//                 openTab === tab.id ? activeClasses : inactiveClasses
//               }`}
//             >
//               {tab.label}
//             </a>
//           </li>
//         ))}
//       </ul>
//       <div className="h-50 rounded-tr-lg bg-primary-100/50">
//         {tabs.map(
//           (tab) =>
//             openTab === tab.id && (
//               <div key={tab.id} className="rounded p-4">
//                 {tab.content}
//               </div>
//             )
//         )}
//       </div>
//     </div>
//   );
// }