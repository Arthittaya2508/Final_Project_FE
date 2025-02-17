import React from 'react'


const orderStatuses = [
    { label: "ที่ยังไม่ได้รับ", count: 20, bgColor: "bg-yellow-400" },
    { label: "ที่กำลังจัดเตรียม", count: 15, bgColor: "bg-orange-400" },
    { label: "รอขนส่งมารับ", count: 10, bgColor: "bg-blue-400" },
    { label: "ที่จัดส่งแล้ว", count: 25, bgColor: "bg-indigo-400" },
    { label: "ที่ส่งเรียบร้อย", count: 18, bgColor: "bg-green-400" },
    { label: "ที่ยกเลิก", count: 5, bgColor: "bg-red-400" },
  ];

  const statusColorMap: { [key: string]: string } = {
    ที่ยังไม่ได้รับ: "bg-yellow-400",
    ที่กำลังจัดเตรียม: "bg-orange-400",
    รอขนส่งมารับ: "bg-blue-400",
    ที่จัดส่งแล้ว: "bg-indigo-400",
    ที่ส่งเรียบร้อย: "bg-green-400",
    ที่ยกเลิก: "bg-red-400",
  };
function Status() {
  return (
    <div>
              {/* Responsive Stepper */}
            <div className="overflow-x-auto mb-6">
              <div className="flex items-center min-w-[800px]">
                {orderStatuses.map((status, index) => (
                  <React.Fragment key={status.label}>
                    <div className="flex flex-col items-center cursor">
                      <div
                        className={`${status.bgColor} w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base cursor`}
                      >
                        {status.count}
                      </div>
                      <span className="text-xs lg:text-sm mt-2 text-center w-20 lg:w-24 cursor ">
                        {status.label}
                      </span>
                    </div>
                    {index < orderStatuses.length - 1 && (
                      <div className="h-[2px] bg-gray-300 flex-grow mx-2" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
    </div>
  )
}

export default Status
