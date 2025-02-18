// app/users/page.tsx
import React from "react";

interface Employee {
  emp_id: number;
  name: string;
  lastname: string;
  telephone: string;
  email: string;
  username: string;
  password: string;
  position: string;
}

async function fetchEmployee(): Promise<Employee[]> {
  const res = await fetch("http://localhost:3000/api/employee", {
    cache: "no-store", // This will ensure data is fetched on each request
  });
  if (!res.ok) {
    throw new Error("Failed to fetch Employee");
  }
  return res.json();
}

const EmployeePage: React.FC = async () => {
  const emp = await fetchEmployee();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Name
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Telephone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Username
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {emp.map((emp) => (
            <tr key={emp.emp_id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {emp.emp_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {emp.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {emp.lastname}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {emp.telephone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {emp.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {emp.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {emp.username}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeePage;
