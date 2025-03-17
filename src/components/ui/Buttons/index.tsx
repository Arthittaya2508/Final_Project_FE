"use client";
import { extendVariants, Button as ButtonHeroUI } from "@heroui/react";
import { ReactRef } from "@heroui/react-utils";
import React from "react";

const ExtendedButton = extendVariants(ButtonHeroUI, {
  variants: {
    color: {
      default:
        "text-primary-foreground bg-primary-700 hover:bg-primary-500 hover:text-light active:bg-primary-300 active:text-primary-800",
      secondary:
        "text-primary-500 bg-primary-100 border border-primary-500 hover:text-primary-700 hover:bg-primary-200 hover:bg-primary-200 active:text-primary-800 active:bg-primary-200 active:border-primary-800",
      success:
        "text-success-foreground bg-success-100 border border-success-700",
      warning: "text-danger-foreground bg-danger-500",
      warning2: "text-danger-600 bg-danger-100 border border-danger-600",
    },
    isDisabled: {
      true: "bg-grey-100 text-grey-300 cursor-not-allowed",
    },
    isIconOnly: {
      true: "text-black bg-transparent hover:bg-grey-200 hover:text-black active:bg-grey-300 active:text-black",
    },
    size: {
      icon: "rounded-full w-10 h-10 min-w-10",
      modal: "gap-2 rounded-md w-24 h-9",
      xxs: "p-0",
      xs: "text-lg font-semibold gap-2 rounded-md max-w-24 h-9",
      sm: "text-lg font-regular gap-2 rounded-lg max-w-42 h-10 justify-evenly",
      md: "text-lg font-regular gap-2 rounded-lg max-w-52 h-10 justify-evenly",
      lg: "text-2xl font-regular gap-2 rounded-md max-w-32 h-12 justify-evenly",
      xl: "text-xl font-regular gap-2 rounded-md w-40 h-12 justify-evenly",
      xxl: "text-2xl font-regular gap-2 rounded-md w-48 h-12",
      xxxl: "text-2xl font-bold uppercase gap-2 rounded-lg w-52 h-12",
      mxl: "text-xl font-regular gap-2 rounded-md w-35 h-12 justify-evenly",
    },
  },
  defaultVariants: {
    color: "default",
    size: "md",
  },
});

type ButtonProps = React.ComponentProps<typeof ExtendedButton>;

const Button = (
  props: ButtonProps,
  ref: ReactRef<HTMLButtonElement | null> | undefined
) => {
  return <ExtendedButton {...props} />;
  //   return <ExtendedButton {...props} ref={ref} />;
};

export default React.forwardRef(Button);
