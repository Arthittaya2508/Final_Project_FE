"use client";
import SandBoxLayout from "../../../components/Layout/SandboxLayout";
import Tabs from "../../../components/Tabbar";
import { FC } from "react";

const TabbarSection: FC = (): React.JSX.Element => {
  return (
    <SandBoxLayout layoutId="tabs">
      <Tabs />
    </SandBoxLayout>
  );
};

export default TabbarSection;
