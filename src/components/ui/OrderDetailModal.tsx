import React, { useState, useEffect } from "react";

interface OrderDetailModalProps {
  selectedOrderId: number | null;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number | null>>;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  selectedOrderId,
  setSelectedOrderId,
}) => {
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ใช้ useEffect เพื่อดึงข้อมูลจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          orderDetailsRes,
          productsRes,
          productDetailsRes,
          colorsRes,
          sizesRes,
        ] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/order_details?order_id=${selectedOrderId}`
          ).then((res) => res.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`).then((res) =>
            res.json()
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/product_details`).then(
            (res) => res.json()
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/colors`).then((res) =>
            res.json()
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/sizes`).then((res) =>
            res.json()
          ),
        ]);
        setOrderDetails(orderDetailsRes);
        setProducts(productsRes);
        setProductDetails(productDetailsRes);
        setColors(colorsRes);
        setSizes(sizesRes);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // ถ้ามี selectedOrderId จึงเริ่มดึงข้อมูล
    if (selectedOrderId) {
      fetchData();
    }
  }, [selectedOrderId]);

  // ถ้ายังโหลดข้อมูลไม่เสร็จ ให้แสดงข้อความ Loading...
  if (isLoading) return <div>Loading...</div>;

  return (
    selectedOrderId && (
      <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-3/4">
          <h2 className="text-xl font-semibold mb-4">รายละเอียดคำสั่งซื้อ</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="p-2 border-b">ชื่อสินค้า</th>
                <th className="p-2 border-b">สี</th>
                <th className="p-2 border-b">ขนาด</th>
                <th className="p-2 border-b">จำนวน</th>
                <th className="p-2 border-b">ราคาขาย</th>
                <th className="p-2 border-b">ราคารวม</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((detail) => {
                const product = products.find(
                  (p: any) => p.pro_id === detail.pro_id
                );
                const productDetail = productDetails.find(
                  (pd: any) => pd.pro_detail_id === detail.pro_detail_id
                );
                const color = colors.find(
                  (c: any) => c.color_id === productDetail?.color_id
                );
                const size = sizes.find(
                  (s: any) => s.size_id === productDetail?.size_id
                );
                return (
                  <tr key={detail.order_detail_id}>
                    <td className="p-2 border-b">{product?.pro_name}</td>
                    <td className="p-2 border-b">{color?.color_name}</td>
                    <td className="p-2 border-b">{size?.size_name}</td>
                    <td className="p-2 border-b">{detail.quantity}</td>
                    <td className="p-2 border-b">
                      {detail.selling_price.toLocaleString()} บาท
                    </td>
                    <td className="p-2 border-b">
                      {detail.total_price.toLocaleString()} บาท
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            onClick={() => setSelectedOrderId(null)} // ปิด modal
          >
            ปิด
          </button>
        </div>
      </div>
    )
  );
};

export default OrderDetailModal;
