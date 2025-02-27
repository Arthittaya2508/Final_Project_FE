import React from "react";
import { Pagination as PaginationHeroUI } from "@heroui/react";
import type { PaginationProps } from "@heroui/react";

interface Props extends PaginationProps {}

export default function Pagination(props: Props) {
  return <PaginationHeroUI {...props} />;
}
