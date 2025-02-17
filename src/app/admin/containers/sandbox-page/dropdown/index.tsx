"use client";

import Dropdown from "../../../components/Dropdown";
import SandBoxLayout from "../../../components/Layout/SandboxLayout";
// import { menuHr, menuOrganization } from "@/lib/data";
import { menuHr } from "../../../../../lib/data";
import { FC } from "react";

const DropdownSection: FC = (): React.JSX.Element => {
  return (
    <SandBoxLayout layoutId={"dropdown"}>
      <div className="flex gap-3">
        <div className="flex flex-col">
          <div>
            <Dropdown items={menuHr} />
          </div>
        </div>
        {/* <div className="flex flex-col">
          <div>
            <Dropdown items={menuOrganization} />
          </div>
        </div> */}
      </div>
    </SandBoxLayout>
  );
};

export default DropdownSection;
