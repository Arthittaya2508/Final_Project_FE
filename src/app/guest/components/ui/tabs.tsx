import React, { useState, ReactNode } from "react";
import { cn } from "../../../../lib/utils";

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  activeTab?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  children,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsList) {
          return React.cloneElement(child, {
            // activeTab,
            // setActiveTab,
          });
        }
        if (React.isValidElement(child) && child.type === TabsContent) {
          return React.cloneElement(child, {
            // activeTab,
          });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList: React.FC<{
  children: ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
  className?: string;
}> = ({ children, activeTab, setActiveTab, className }) => (
  <div className={cn("flex border-b border-gray-300", className)}>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === TabsTrigger) {
        return React.cloneElement(child, {
          //   isActive: activeTab === child.props.value,
          //   onClick: () => setActiveTab && setActiveTab(child.props.value),
        });
      }
      return child;
    })}
  </div>
);

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 transition-colors duration-150 focus:outline-none",
      isActive
        ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
        : "text-gray-600 hover:text-blue-600"
    )}
  >
    {children}
  </button>
);

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  activeTab,
  className,
}) => {
  if (activeTab !== value) return null;
  return <div className={cn("py-4", className)}>{children}</div>;
};
