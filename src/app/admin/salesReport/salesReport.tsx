import { useState, useEffect } from "react";
import Button from "@/components/ui/Buttons";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";
import { th } from "date-fns/locale";

ChartJS.register(CategoryScale, ArcElement, Tooltip, Legend);

type SalesData = {
  date: string;
  billNo: string;
  quantity: number;
  totalPrice: number;
  cost: number;
  profit: number;
};

const SalesReport = () => {
  const [selectedTab, setSelectedTab] = useState<"week" | "month">("week");
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      let data: SalesData[] = [];
      const currentDate = new Date();
      const dateRange = getDateRange(selectedTab, currentDate);

      for (let i = 0; i < dateRange.length; i++) {
        const quantity = Math.floor(Math.random() * 50) + 1;
        const totalPrice = quantity * (Math.floor(Math.random() * 500) + 50);
        const cost = totalPrice * 0.7;
        const profit = totalPrice - cost;
        data.push({
          date: dateRange[i],
          billNo: `BILL-${i + 1}`,
          quantity,
          totalPrice,
          cost,
          profit,
        });
      }

      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (tab: "week" | "month", currentDate: Date) => {
    const dateRange: string[] = [];
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDateOfMonth = currentDate.getDate();

    if (tab === "week") {
      const sunday = new Date(
        currentDate.setDate(currentDateOfMonth - currentDate.getDay())
      );
      for (let i = 0; i < 7; i++) {
        const date = new Date(sunday);
        date.setDate(sunday.getDate() + i);
        dateRange.push(format(date, "d MMMM yyyy", { locale: th }));
      }
    } else if (tab === "month") {
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      let date = new Date(firstDayOfMonth);
      while (date <= lastDayOfMonth) {
        dateRange.push(format(date, "d MMMM yyyy", { locale: th }));
        date.setDate(date.getDate() + 1);
      }
    }
    return dateRange;
  };

  useEffect(() => {
    fetchSalesData();
  }, [selectedTab, selectedDate]);

  return (
    <div className="p-4">
      <h1 className="text-xl lg:text-2xl font-bold ">รายงานการขายสินค้า</h1>
      <div className="flex gap-4 mb-6">
        <Button onClick={() => setSelectedTab("week")}>ประจำสัปดาห์</Button>
        <Button onClick={() => setSelectedTab("month")}>ประจำเดือน</Button>
      </div>

      <div className="mb-6">
        <label className="mr-2">เลือกวันที่:</label>
        <input
          type="date"
          value={format(selectedDate, "yyyy-MM-dd")}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex flex-row gap-6 mb-6">
        {loading ? (
          <div className="text-center">กำลังโหลดข้อมูล...</div>
        ) : (
          <div className="w-[550px] flex justify-center">
            <Doughnut
              data={{
                labels: salesData.map((item) => item.date),
                datasets: [
                  {
                    label: "กำไร (บาท)",
                    data: salesData.map((item) => item.profit),
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                    borderAlign: "inner",
                  },
                ],
              }}
            />
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">ข้อมูลรายได้</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ลำดับที่</th>
              <th className="border p-2">วันที่</th>
              <th className="border p-2">เลขที่บิล</th>
              <th className="border p-2">จำนวนสินค้า</th>
              <th className="border p-2">ราคารวม (บาท)</th>
              <th className="border p-2">ต้นทุน (บาท)</th>
              <th className="border p-2">กำไร (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((item, index) => (
              <tr key={index} className="text-center bg-white odd:bg-gray-100">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{item.date}</td>
                <td className="border p-2">{item.billNo}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">
                  {item.totalPrice.toLocaleString()}
                </td>
                <td className="border p-2">{item.cost.toLocaleString()}</td>
                <td className="border p-2 text-green-600 font-semibold">
                  {item.profit.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
