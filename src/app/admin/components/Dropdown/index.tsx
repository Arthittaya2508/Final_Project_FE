import {
  Dropdown as DropdownHeroUI,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { TbDots } from "react-icons/tb";
import { MenuDropdown } from "@/types/common";
import Button from "../Buttons";
import React from "react";
import { TooltipIcon } from "../Tooltip/tooltipicons";

interface DropdownMenuComponentProps {
  items: MenuDropdown[];
}

function Dropdown({ items }: DropdownMenuComponentProps) {
  return (
    <DropdownHeroUI
      classNames={{
        content: "border border-primary-700 text-smaller2 text-black",
      }}
    >
      <DropdownTrigger>
        <Button
          size="icon"
          isIconOnly={true}
          className="rounded-sm bg-transparent"
        >
          <TooltipIcon icon={<TbDots />} tooltip="View" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label={`Dropdown`}>
        {items.map((menu, index) => (
          <DropdownSection key={index} title={menu?.section}>
            {menu.items.map((item) => (
              <DropdownItem
                aria-label={`dropdown`}
                key={item.key}
                startContent={item.icon}
                color="primary"
                classNames={{
                  base: [
                    "data-[hover=true]:bg-primary-100",
                    "data-[hover=true]:border-primary-100",
                    "data-[hover=true]:text-primary-700",
                  ],
                }}
                // onClick={() => {
                //   item.onClick?.();
                // }}
              >
                {item.label}
              </DropdownItem>
            ))}
          </DropdownSection>
        ))}
      </DropdownMenu>
    </DropdownHeroUI>
  );
}

export default Dropdown;
