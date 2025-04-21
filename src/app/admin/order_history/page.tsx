"use client";
import { useState, useEffect } from "react";

type OrderImport = {
  order_import_id: number;
  company_id: number;
  brand_id: number;
  product_id: number;
  color_id: number;
  size_id: number;
  quantity: number;
  created_at: string;
};

type Company = {
  company_id: number;
  company_name: string;
};

type Brand = {
  brand_id: number;
  brand_name: string;
  company_id: number;
};

type Product = {
  pro_id: number;
  pro_name: string;
  brand_id: number;
};

type Color = {
  color_id: number;
  color_name: string;
};

type Size = {
  size_id: number;
  size_name: string;
};

const ReceiveProductHistoryPage = () => {
  const [orderHistory, setOrderHistory] = useState<OrderImport[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [orderRes, companyRes, brandRes, productRes, colorRes, sizeRes] =
          await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/order_import`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/company`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/colors`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/sizes`),
          ]);

        const [
          orderData,
          companyData,
          brandData,
          productData,
          colorData,
          sizeData,
        ] = await Promise.all([
          orderRes.json(),
          companyRes.json(),
          brandRes.json(),
          productRes.json(),
          colorRes.json(),
          sizeRes.json(),
        ]);

        setOrderHistory(orderData);
        setCompanies(companyData);
        setBrands(brandData);
        setProducts(productData);
        setColors(colorData);
        setSizes(sizeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAll();
  }, []);

  // const generateOrderCode = (id: number) => {
  //   const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  //   const randomLetters = Array.from({ length: 3 }, () =>
  //     letters.charAt(Math.floor(Math.random() * letters.length))
  //   ).join("");
  //   const randomNumbers = id.toString().padStart(4, "0");
  //   return `ORD-${randomLetters}${randomNumbers}`;
  // };

  const getCompanyName = (id: number) =>
    companies.find((c) => c.company_id === id)?.company_name || "-";

  const getBrandName = (id: number) =>
    brands.find((b) => b.brand_id === id)?.brand_name || "-";

  const getProductName = (id: number) =>
    products.find((p) => p.pro_id === id)?.pro_name || "-";

  const getColorName = (id: number) =>
    colors.find((c) => c.color_id === id)?.color_name || "-";

  const getSizeName = (id: number) =>
    sizes.find((s) => s.size_id === id)?.size_name || "-";

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      company_id: selectedCompany,
      brand_id: selectedBrand,
      product_id: selectedProduct,
      color_id: selectedColor,
      size_id: selectedSize,
      quantity,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order_import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      alert("สั่งสินค้าสำเร็จ");
      setIsModalOpen(false); // Close modal after successful order
    } else {
      alert("ไม่สามารถสั่งสินค้าได้");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">
        ประวัติการสั่งซื้อสินค้า
      </h1>

      {/* Button to open modal */}
      <div className="mb-4 text-right">
        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          สั่งซื้อสินค้า
        </button>
      </div>

      {/* Modal for placing order */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl font-semibold mb-4">สั่งซื้อสินค้า</h2>
            <form onSubmit={handleSubmitOrder}>
              <div>
                <label className="block text-sm font-medium">เลือกบริษัท</label>
                <select
                  value={selectedCompany || ""}
                  onChange={(e) => setSelectedCompany(Number(e.target.value))}
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                >
                  <option value="">--เลือกบริษัท--</option>
                  {companies.map((company) => (
                    <option key={company.company_id} value={company.company_id}>
                      {company.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">เลือกแบรนด์</label>
                <select
                  value={selectedBrand || ""}
                  onChange={(e) => setSelectedBrand(Number(e.target.value))}
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                  disabled={!selectedCompany}
                >
                  <option value="">--เลือกแบรนด์--</option>
                  {brands
                    .filter((brand) => brand.company_id === selectedCompany)
                    .map((brand) => (
                      <option key={brand.brand_id} value={brand.brand_id}>
                        {brand.brand_name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">เลือกสินค้า</label>
                <select
                  value={selectedProduct || ""}
                  onChange={(e) => setSelectedProduct(Number(e.target.value))}
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                  disabled={!selectedBrand}
                >
                  <option value="">--เลือกสินค้า--</option>
                  {products.map((product) => (
                    <option key={product.pro_id} value={product.pro_id}>
                      {product.pro_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">เลือกสี</label>
                <select
                  value={selectedColor || ""}
                  onChange={(e) => setSelectedColor(Number(e.target.value))}
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                  disabled={!selectedProduct}
                >
                  <option value="">--เลือกสี--</option>
                  {colors.map((color) => (
                    <option key={color.color_id} value={color.color_id}>
                      {color.color_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">เลือกขนาด</label>
                <select
                  value={selectedSize || ""}
                  onChange={(e) => setSelectedSize(Number(e.target.value))}
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                  disabled={!selectedColor}
                >
                  <option value="">--เลือกขนาด--</option>
                  {sizes.map((size) => (
                    <option key={size.size_id} value={size.size_id}>
                      {size.size_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">จำนวน</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2 mt-1 border rounded-md"
                />
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 bg-gray-400 text-white rounded-md"
                >
                  ปิด
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-md"
                >
                  สั่งซื้อ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">
                เลขที่
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                วันที่
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                บริษัท
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                แบรนด์
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">
                สินค้า
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium">สี</th>
              <th className="px-4 py-2 text-left text-sm font-medium">ขนาด</th>
              <th className="px-4 py-2 text-right text-sm font-medium">
                จำนวน
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderHistory.map((order) => (
              <tr key={order.order_import_id}>
                <td className="px-4 py-2">{order.order_import_id}</td>
                <td className="px-4 py-2">
                  {new Date(order.created_at).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  เวลา{" "}
                  {new Date(order.created_at).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </td>
                <td className="px-4 py-2">
                  {getCompanyName(order.company_id)}
                </td>
                <td className="px-4 py-2">{getBrandName(order.brand_id)}</td>
                <td className="px-4 py-2">
                  {getProductName(order.product_id)}
                </td>
                <td className="px-4 py-2">{getColorName(order.color_id)}</td>
                <td className="px-4 py-2">{getSizeName(order.size_id)}</td>
                <td className="px-4 py-2 text-right">{order.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiveProductHistoryPage;
