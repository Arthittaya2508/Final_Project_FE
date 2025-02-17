// "use client";

// import React, { useEffect, useState } from "react";

// function Page() {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//         if (!apiUrl) {
//           throw new Error(
//             "Environment variable NEXT_PUBLIC_API_URL is not set."
//           );
//         }

//         const fetchUrl = `${apiUrl}/employees`;
//         console.log("Fetching URL:", fetchUrl);

//         const response = await fetch(fetchUrl, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(
//             `Failed to fetch employees. Status: ${response.status} - ${response.statusText}`
//           );
//         }

//         const data = await response.json();
//         setEmployees(data);
//         console.log("Fetched employees data:", data);
//       } catch (err: any) {
//         console.error("Error fetching employees:", err);
//         setError(err.message || "An unknown error occurred.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div>
//         <h1>Error</h1>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Employees List</h1>
//       {employees.length > 0 ? (
//         <ul>
//           {employees.map(
//             (employee: { id: string; name: string; position: string }) => (
//               <li key={employee.id}>
//                 {employee.name} - {employee.position}
//               </li>
//             )
//           )}
//         </ul>
//       ) : (
//         <p>No employees found.</p>
//       )}
//     </div>
//   );
// }

// export default Page;
import Sidebar from "@/components/Sidebar";
import React from "react";

function Dashboard() {
  return (
    <div>
      <Sidebar />
    </div>
  );
}

export default Dashboard;
