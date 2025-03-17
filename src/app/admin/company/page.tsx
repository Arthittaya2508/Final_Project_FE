"use client";
import { useEffect, useState } from "react";

type Company = {
  id: number;
  company_name: string;
  address: string;
  phone: string;
};

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/company`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch company data");
        return res.json();
      })
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching company data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center text-lg">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">ข้อมูลบริษัท</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-gray-600 font-medium"></th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">
                ชื่อบริษัท
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">
                ที่อยู่
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">
                เบอร์โทร
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
              companies.map((company, index) => (
                <tr key={company.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{company.company_name}</td>
                  <td className="py-3 px-4">{company.address}</td>
                  <td className="py-3 px-4">{company.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  ไม่มีข้อมูลบริษัท
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
