"use client";
import { useEffect, useState } from "react";

type Company = {
  id: number;
  company_name: string;
  address: string;
  phone: string;
  brand_id: number;
};

export type Brands = {
  brand_id: number;
  brand_name: string;
};

export default function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [brands, setBrands] = useState<Brands[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    address: "",
    phone: "",
    brand_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/company`
        );
        const brandsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/brands`
        );

        if (!companyRes.ok || !brandsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [companyData, brandsData] = await Promise.all([
          companyRes.json(),
          brandsRes.json(),
        ]);

        setCompanies(companyData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          brand_id: parseInt(formData.brand_id),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add company");
      }

      const newCompany = await res.json();
      setCompanies((prev) => [...prev, newCompany]);
      setShowModal(false);
      setFormData({ company_name: "", address: "", phone: "", brand_id: "" });
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ข้อมูลบริษัท</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + เพิ่มข้อมูลบริษัท
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">ชื่อบริษัท</th>
              <th className="py-3 px-4 text-left">ที่อยู่</th>
              <th className="py-3 px-4 text-left">เบอร์โทร</th>
              <th className="py-3 px-4 text-left">แบรนด์</th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
              companies.map((company, index) => {
                const brandName =
                  brands.find((b) => b.brand_id === company.brand_id)
                    ?.brand_name || "ไม่ระบุ";

                return (
                  <tr key={company.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{company.company_name}</td>
                    <td className="py-3 px-4">{company.address}</td>
                    <td className="py-3 px-4">{company.phone}</td>
                    <td className="py-3 px-4">{brandName}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  ไม่มีข้อมูลบริษัท
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">เพิ่มข้อมูลบริษัท</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="company_name"
                placeholder="ชื่อบริษัท"
                value={formData.company_name}
                onChange={handleInputChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="ที่อยู่"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="เบอร์โทร"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="brand_id"
                value={formData.brand_id}
                onChange={handleInputChange}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">-- เลือกแบรนด์ --</option>
                {brands.map((brand) => (
                  <option key={brand.brand_id} value={brand.brand_id}>
                    {brand.brand_name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border border-gray-300"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
