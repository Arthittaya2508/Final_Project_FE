"use client";
// import StatusFilter from "../../components/Filter/StatusFilter";
// import Status from "../../components/Status";
import TabbarSection from "../../containers/sandbox-page/tabbar-section";
import TableSection from "../../containers/sandbox-page/table-section";

import React from "react";

function Products() {
  return (
    <div className="flex-1 p-4 ">
      <h1 className="text-xl lg:text-2xl font-bold ">Products Detail</h1>
      {/* <Status />
      <StatusFilter /> */}
      <div>
        <TabbarSection />
        {/* <TableSection /> */}
      </div>
    </div>
  );
}

export default Products;