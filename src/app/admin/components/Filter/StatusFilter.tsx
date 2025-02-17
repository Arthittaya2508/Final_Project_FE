import { extendVariants, Select, SelectItem } from "@heroui/react";

export const status = [
  { key: "notyet", label: "ที่ยังไม่ได้รับ" },
  { key: "preparing", label: "ที่กำลังจัดเตรียม" },
  { key: "wait", label: "รอขนส่งมารับ" },
  { key: "derivery", label: "ที่จัดส่งแล้ว" },
  { key: "done", label: "ที่ส่งเรียบร้อย" },
  { key: "cancel", label: "ที่ยกเลิก" },
];

export default function App() {
  const variants = ["flat"];

  return (
    <div className="w-full flex flex-col gap-4">
      {variants.map((variant) => (
        <div
          key={variant}
          className="flex w-36 flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
        >
          <Select className="max-w-xs" label="Select status">
            {status.map((status) => (
              <SelectItem key={status.key}>{status.label}</SelectItem>
            ))}
          </Select>
        </div>
      ))}
    </div>
  );
}
