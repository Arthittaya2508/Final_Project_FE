import { Tooltip } from "@heroui/react";
import React from "react";

interface TooltipIconProps {
  icon: React.JSX.Element;
  tooltip: string;
}

export function TooltipIcon({ icon, tooltip }: TooltipIconProps) {
  return (
    <Tooltip
      showArrow={true}
      content={tooltip}
      placement="top"
      color="foreground"
    >
      <div>{icon}</div>
    </Tooltip>
  );
}
