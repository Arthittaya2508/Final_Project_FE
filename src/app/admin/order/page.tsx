"use client";
import { useEffect, useState } from "react";

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

type orderData = {
  company_id: number | null;
  brand_id: number | null;
  product_id: number | null;
  color_id: number | null;
  size_id: number | null;
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

  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  // คำนวณราคารวมเมื่อ quantity หรือ price เปลี่ยน
  useEffect(() => {
    setTotal(quantity * price);
  }, [quantity, price]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company`);
      const data = await res.json();
      setCompanies(data);
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`);
      const data = await res.json();
      setBrands(data);
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const filtered = brands.filter(
        (brand) => brand.company_id === selectedCompany
      );
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands([]);
    }
  }, [selectedCompany, brands]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedBrand) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?brand_id=${selectedBrand}`
        );
        const data = await res.json();
        setProducts(data);
      }
    };
    fetchProducts();
  }, [selectedBrand]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (selectedProduct) {
        const [colorRes, sizeRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/colors?product_id=${selectedProduct}`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/sizes?product_id=${selectedProduct}`
          ),
        ]);
        const [colorData, sizeData] = await Promise.all([
          colorRes.json(),
          sizeRes.json(),
        ]);
        setColors(colorData);
        setSizes(sizeData);
      }
    };
    fetchProductDetails();
  }, [selectedProduct]);

  const handleCompanyChange = (value: number) => {
    setSelectedCompany(value);
    setSelectedBrand(null);
    setSelectedProduct(null);
    setSelectedColor(null);
    setSelectedSize(null);
    setProducts([]);
    setColors([]);
    setSizes([]);
  };

  const handleBrandChange = (value: number) => {
    setSelectedBrand(value);
    setSelectedProduct(null);
    setSelectedColor(null);
    setSelectedSize(null);
    setProducts([]);
    setColors([]);
    setSizes([]);
  };

  const handleProductChange = (value: number) => {
    setSelectedProduct(value);
    setSelectedColor(null);
    setSelectedSize(null);
    setColors([]);
    setSizes([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData: orderData = {
      company_id: selectedCompany,
      brand_id: selectedBrand,
      product_id: selectedProduct,
      color_id: selectedColor,
      size_id: selectedSize,
      quantity,
      price,
      total,
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
    } else {
      alert("ไม่สามารถสั่งสินค้าได้");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">
        สั่งซื้อสินค้าเข้าร้าน
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            เลือกบริษัท
          </label>
          <select
            id="company"
            onChange={(e) => handleCompanyChange(Number(e.target.value))}
            value={selectedCompany || ""}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
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
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700"
          >
            เลือกแบรนด์
          </label>
          <select
            id="brand"
            onChange={(e) => handleBrandChange(Number(e.target.value))}
            value={selectedBrand || ""}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
            disabled={!filteredBrands.length}
          >
            <option value="">--เลือกแบรนด์--</option>
            {filteredBrands.map((brand) => (
              <option key={brand.brand_id} value={brand.brand_id}>
                {brand.brand_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="product"
            className="block text-sm font-medium text-gray-700"
          >
            เลือกสินค้า
          </label>
          <select
            id="product"
            onChange={(e) => handleProductChange(Number(e.target.value))}
            value={selectedProduct || ""}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
            disabled={!products.length}
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
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700"
          >
            เลือกสี
          </label>
          <select
            id="color"
            onChange={(e) => setSelectedColor(Number(e.target.value))}
            value={selectedColor || ""}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
            disabled={!colors.length}
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
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-700"
          >
            เลือกขนาด
          </label>
          <select
            id="size"
            onChange={(e) => setSelectedSize(Number(e.target.value))}
            value={selectedSize || ""}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
            disabled={!sizes.length}
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
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            จำนวน
          </label>
          <input
            type="number"
            id="quantity"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            ราคาต่อหน่วย (บาท)
          </label>
          <input
            type="number"
            id="price"
            min="0"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 block w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="total"
            className="block text-sm font-medium text-gray-700"
          >
            ราคารวม (บาท)
          </label>
          <input
            type="number"
            id="total"
            value={total}
            readOnly
            className="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-100"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          ส่งคำสั่งซื้อ
        </button>
      </form>
    </div>
  );
};

export default ReceiveProductPage;
