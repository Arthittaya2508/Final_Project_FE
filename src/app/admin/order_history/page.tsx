"use client";
import { useEffect, useState } from "react";

type Company = { company_id: number; company_name: string };
type Brand = { brand_id: number; brand_name: string; company_id: number };
type Product = { pro_id: number; pro_name: string; brand_id: number };
type Color = { color_id: number; color_name: string };
type Size = { size_id: number; size_name: string };

type CartItem = {
  company_id: number;
  brand_id: number;
  product_id: number;
  product_name: string;
  color_id: number;
  color_name: string;
  size_id: number;
  size_name: string;
  quantity: number;
  price: number;
  total: number;
};

const ReceiveProductPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setTotal(quantity * price);
  }, [quantity, price]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company`)
      .then((res) => res.json())
      .then(setCompanies);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`)
      .then((res) => res.json())
      .then(setBrands);
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      setFilteredBrands(brands.filter((b) => b.company_id === selectedCompany));
    }
  }, [selectedCompany, brands]);

  useEffect(() => {
    if (selectedBrand) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?brand_id=${selectedBrand}`
      )
        .then((res) => res.json())
        .then(setProducts);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedProduct) {
      Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/colors?product_id=${selectedProduct}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/sizes?product_id=${selectedProduct}`
        ),
      ])
        .then(([colorRes, sizeRes]) =>
          Promise.all([colorRes.json(), sizeRes.json()])
        )
        .then(([colors, sizes]) => {
          setColors(colors);
          setSizes(sizes);
        });
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (
      selectedCompany &&
      selectedBrand &&
      selectedProduct &&
      selectedColor &&
      selectedSize &&
      quantity > 0
    ) {
      const product = products.find((p) => p.pro_id === selectedProduct);
      const color = colors.find((c) => c.color_id === selectedColor);
      const size = sizes.find((s) => s.size_id === selectedSize);

      const newItem: CartItem = {
        company_id: selectedCompany,
        brand_id: selectedBrand,
        product_id: selectedProduct,
        product_name: product?.pro_name || "",
        color_id: selectedColor,
        color_name: color?.color_name || "",
        size_id: selectedSize,
        size_name: size?.size_name || "",
        quantity,
        price,
        total,
      };
      setCart((prev) => [...prev, newItem]);
    } else {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      alert("ยังไม่มีสินค้าที่จะสั่ง");
      return;
    }

    const total_quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total_price = cart.reduce((sum, item) => sum + item.total, 0);

    const body = {
      company_id: cart[0].company_id,
      quantity: total_quantity,
      total_price: total_price,
      details: cart.map((item) => ({
        pro_id: item.product_id,
        brand_id: item.brand_id,
        color_id: item.color_id,
        size_id: item.size_id,
        quantity: item.quantity,
        cost_price: item.price,
      })),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order_import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const { order_import_id } = await res.json();
      alert(`สั่งซื้อเรียบร้อยแล้ว (เลขที่: ${order_import_id})`);
      setCart([]);
    } else {
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        สั่งซื้อสินค้าเข้าร้าน
      </h1>

      {/* แบบฟอร์มเลือกสินค้า */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">บริษัท</label>
            <select
              onChange={(e) => setSelectedCompany(+e.target.value)}
              value={selectedCompany || ""}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">เลือกบริษัท</option>
              {companies.map((c) => (
                <option key={c.company_id} value={c.company_id}>
                  {c.company_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">แบรนด์</label>
            <select
              onChange={(e) => setSelectedBrand(+e.target.value)}
              value={selectedBrand || ""}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">เลือกแบรนด์</option>
              {filteredBrands.map((b) => (
                <option key={b.brand_id} value={b.brand_id}>
                  {b.brand_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">สินค้า</label>
            <select
              onChange={(e) => setSelectedProduct(+e.target.value)}
              value={selectedProduct || ""}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">เลือกสินค้า</option>
              {products.map((p) => (
                <option key={p.pro_id} value={p.pro_id}>
                  {p.pro_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">สี</label>
            <select
              onChange={(e) => setSelectedColor(+e.target.value)}
              value={selectedColor || ""}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">เลือกสี</option>
              {colors.map((c) => (
                <option key={c.color_id} value={c.color_id}>
                  {c.color_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ขนาด</label>
            <select
              onChange={(e) => setSelectedSize(+e.target.value)}
              value={selectedSize || ""}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">เลือกขนาด</option>
              {sizes.map((s) => (
                <option key={s.size_id} value={s.size_id}>
                  {s.size_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">จำนวน</label>
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(+e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">
                ราคาต่อหน่วย
              </label>
              <input
                type="number"
                value={price}
                min={0}
                onChange={(e) => setPrice(+e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            onClick={handleAddToCart}
          >
            + เพิ่มลงตะกร้า
          </button>
        </div>
      </div>

      {/* แสดงรายการสินค้า */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">รายการสินค้าในตะกร้า</h2>
        {cart.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">สินค้า</th>
                    <th className="border px-2 py-1">สี</th>
                    <th className="border px-2 py-1">ขนาด</th>
                    <th className="border px-2 py-1">จำนวน</th>
                    <th className="border px-2 py-1">ราคาต่อหน่วย</th>
                    <th className="border px-2 py-1">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="border px-2 py-1">{item.product_name}</td>
                      <td className="border px-2 py-1">{item.color_name}</td>
                      <td className="border px-2 py-1">{item.size_name}</td>
                      <td className="border px-2 py-1">{item.quantity}</td>
                      <td className="border px-2 py-1">
                        {item.price.toFixed(2)}
                      </td>
                      <td className="border px-2 py-1">
                        {item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right mt-4">
              <p className="text-lg font-semibold">
                ยอดรวม:{" "}
                {cart
                  .reduce((sum, item) => sum + item.total, 0)
                  .toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                บาท
              </p>
              <button
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
                onClick={handleSubmitOrder}
              >
                ✔ สั่งซื้อสินค้า
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600">ยังไม่มีรายการสินค้า</p>
        )}
      </div>
    </div>
  );
};
export default ReceiveProductPage;
