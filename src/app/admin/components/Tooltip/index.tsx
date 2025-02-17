import { TooltipIcon } from "./tooltipicons";
import { FaRegTrashCan } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";
import { BsArchive } from "react-icons/bs";

const icons = [
  { icon: <FaRegTrashCan />, tooltip: "Delete" },
  { icon: <SlOptions />, tooltip: "View" },
  { icon: <BsArchive />, tooltip: "Archive" },
];

export default function TooltipIconProps() {
  return (
    <div className="flex gap-4">
      {icons.map((item, index) => (
        <TooltipIcon key={index} icon={item.icon} tooltip={item.tooltip} />
      ))}
    </div>
  );
}
