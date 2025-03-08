"use client";

import React from "react";
import TransportsTable from "./transportTable";

function Transport() {
  return (
    <div className="flex-1 p-4 ">
      <h1 className="text-xl lg:text-2xl font-bold ">Transport</h1>
      <div>
        <TransportsTable />
      </div>
    </div>
  );
}

export default Transport;
