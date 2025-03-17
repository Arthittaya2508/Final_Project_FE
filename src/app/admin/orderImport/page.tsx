"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@heroui/react";
import { Input } from "@/components/ui/input";

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`border rounded-lg shadow-md p-4 bg-white ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-2">{children}</div>
);

const companies = [
  {
    id: "1",
    name: "บริษัท A",
    products: [
      { sku: "A001", name: "เสื้อกีฬา", color: "แดง", size: "M", price: 300 },
      { sku: "A002", name: "กางเกงกีฬา", color: "ดำ", size: "L", price: 500 },
    ],
  },
  {
    id: "2",
    name: "บริษัท B",
    products: [
      {
        sku: "B001",
        name: "รองเท้ากีฬา",
        color: "ขาว",
        size: "42",
        price: 1200,
      },
    ],
  },
];

export default function NewOrder() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  const handleAddProduct = (product: any) => {
    setOrderItems([
      ...orderItems,
      { ...product, quantity: 1, total: product.price },
    ]);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">สร้างคำสั่งซื้อใหม่</h1>
      <Select
        onVolumeChange={(event) =>
          setSelectedCompany((event.target as HTMLSelectElement).value)
        }
      >
        {companies.map((company) => (
          <SelectItem key={company.id} value={company.id}>
            {company.name}
          </SelectItem>
        ))}
      </Select>
      {selectedCompany && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">สินค้า</h2>
          {companies
            .find((c) => c.id === selectedCompany)
            ?.products.map((product) => (
              <Card key={product.sku} className="my-2">
                <CardContent>
                  <p>
                    {product.name} - {product.color} - {product.size}
                  </p>
                </CardContent>
                <Button onClick={() => handleAddProduct(product)}>เพิ่ม</Button>
              </Card>
            ))}
        </div>
      )}
      <h2 className="text-lg font-semibold mt-6">รายการที่สั่ง</h2>
      {orderItems.length > 0 ? (
        <table className="w-full mt-2 border">
          <thead>
            <tr className="border-b">
              <th className="p-2">ลำดับ</th>
              <th className="p-2">รหัสสินค้า</th>
              <th className="p-2">ชื่อสินค้า</th>
              <th className="p-2">สี</th>
              <th className="p-2">ขนาด</th>
              <th className="p-2">จำนวน</th>
              <th className="p-2">ราคารวม</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={item.sku} className="border-b">
                <td className="p-2 text-center">{index + 1}</td>
                <td className="p-2 text-center">{item.sku}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-center">{item.color}</td>
                <td className="p-2 text-center">{item.size}</td>
                <td className="p-2 text-center">
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setOrderItems(
                        orderItems.map((order, i) =>
                          i === index
                            ? {
                                ...order,
                                quantity: qty,
                                total: qty * order.price,
                              }
                            : order
                        )
                      );
                    }}
                  />
                </td>
                <td className="p-2 text-center">{item.total} ฿</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">ยังไม่มีสินค้า</p>
      )}
      <Button className="mt-4 w-full">บันทึกคำสั่งซื้อ</Button>
    </div>
  );
}
