// import React from "react";
// import {
//   DropdownTrigger,
//   Dropdown,
//   DropdownMenu,
//   DropdownItem,
//   Button,
// } from "@heroui/react";

// import { filters } from "@/lib/data";
// import { TbFilter, TbCaretDownFilled } from "react-icons/tb";
// // import { useTableContext } from "@/context/TableProvider";

// export default function Filter() {
// //   const { visibleColumns, setVisibleColumns } = useTableContext();
//   return (
//     <Dropdown className="flex justify-between">
//       <DropdownTrigger>
//         <Button
//           startContent={<TbFilter size={20} />}
//           endContent={<TbCaretDownFilled size={20} />}
//           className="w-44 rounded-lg border-primary-700 text-lg text-primary-700"
//           variant="bordered"
//         >
//           Filter
//         </Button>
//       </DropdownTrigger>
//       <DropdownMenu
//         variant="flat"
//         color="primary"
//         selectedKeys={visibleColumns}
//         selectionMode="multiple"
//         closeOnSelect={false}
//         onSelectionChange={setVisibleColumns}
//         className="h-[13rem] overflow-y-scroll"
//       >
//         {filters.map((filter) => (
//           <DropdownItem key={filter.uid} className="">
//             {filter.name}
//           </DropdownItem>
//         ))}
//       </DropdownMenu>
//     </Dropdown>
//   );
// }
