"use client";
import Button from "../../../components/Buttons";
import SandBoxLayout from "../../../components/Layout/SandboxLayout";
// import useAxiosInstance from "@/hooks/use-axios-instance";
import React, { FC } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi2";
import { IoMdSettings } from "react-icons/io";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { SlOptions } from "react-icons/sl";

const ButtonSection: FC = (): React.JSX.Element => {
  //   const axiosInstance = useAxiosInstance();
  return (
    <SandBoxLayout layoutId="button">
      {/* Organization */}
      <div className="flex flex-row items-center gap-3">
        {/* Table */}
        <Button size="md" startContent={<FiPlusCircle size={20} />}>
          เพิ่มสินค้า
        </Button>
        <Button size="md" startContent={<FiPlusCircle size={20} />}>
          เพิ่มรายการสินค้า
        </Button>
        <Button size="md" startContent={<FiPlusCircle size={20} />}>
          เพิ่มหลายรายการ
        </Button>
        <Button size="md">บันทึก</Button>

        {/* Modal */}
        <Button size="xl" startContent={<IoCheckmarkOutline size={25} />}>
          บันทึก
        </Button>

        <Button
          size="xl"
          color="secondary"
          startContent={<HiChevronDoubleLeft size={25} />}
        >
          Back
        </Button>

        <Button size="xl" endContent={<HiChevronDoubleRight size={25} />}>
          Next
        </Button>
      </div>

      {/* General */}
      <div className="flex flex-row items-center gap-3">
        <Button size="xxl" color="secondary">
          Cancel
        </Button>

        <Button size="xxl">Save</Button>

        <Button
          size="xs"
          color="secondary"
          startContent={<MdOutlineModeEdit size={20} />}
        >
          Edit
        </Button>
      </div>

      {/* View Package */}
      <div className="flex flex-row gap-3">
        <Button size="lg" color="secondary">
          Extend
        </Button>
        <Button size="lg" color="secondary">
          Cancel
        </Button>

        <Button size="lg">Save</Button>
      </div>

      {/* HR List */}
      <div className="flex flex-row gap-3">
        <Button size="sm" startContent={<FiPlusCircle size={20} />}>
          Create HR
        </Button>
      </div>

      {/* modal edit  */}
      <div className="flex flex-row gap-3">
        <Button size="modal" color="secondary">
          No
        </Button>

        <Button size="modal">Yes</Button>
      </div>

      {/* modal warning  */}
      <div className="flex flex-row gap-3">
        <Button size="modal" color="warning2">
          Cancel
        </Button>

        <Button size="modal" color="warning">
          delete
        </Button>
      </div>

      {/* modal success */}
      <div className="flex flex-row gap-3">
        <Button size="modal" color="success">
          Close
        </Button>
      </div>

      {/* login */}
      <div className="flex flex-row gap-3">
        <Button size="xxxl" color="secondary">
          Log in
        </Button>

        {/* <Button
          size="xxxl"
          color="login"
          onClick={async () => {
            try {
              const res = axiosInstance.get("/test/error/401");
              console.log(res);
            } catch (error) {
              console.log(error, "check 401");
            }
          }}
        >
          Verify
        </Button> */}
      </div>

      {/* icon */}
      <div className="flex flex-row gap-3">
        {/* setting button */}
        <Button size="icon" isIconOnly={true} className="bg-grey-100">
          <IoMdSettings size={25} />
        </Button>

        {/* close button */}
        <Button size="icon" isIconOnly={true}>
          <IoCloseOutline size={25} />
        </Button>

        {/* action button */}
        <Button
          size="icon"
          isIconOnly={true}
          className="rounded-sm border-2 border-primary-700 bg-light"
        >
          <SlOptions size={20} />
        </Button>

        {/* delete button */}
        <Button
          size="icon"
          isIconOnly={true}
          className="rounded-sm bg-transparent"
        >
          <SlOptions size={20} />
        </Button>
      </div>
    </SandBoxLayout>
  );
};

export default ButtonSection;
