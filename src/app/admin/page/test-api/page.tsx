"use client";
import React, { useEffect, useState } from "react";

const fetchOrders = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/employees`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return []; // คืนค่ากลับเป็นอาร์เรย์ว่างหากเกิดข้อผิดพลาด
  }
};

function AllProduct() {
  const [employees, setEmployees] = useState<any[]>([]); // เก็บข้อมูลจาก API
  const [isLoading, setIsLoading] = useState(true); // การแสดงสถานะการโหลด

  useEffect(() => {
    const getData = async () => {
      const data = await fetchOrders();
      setEmployees(data);
      setIsLoading(false);
    };

    getData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // แสดงข้อความโหลดขณะดึงข้อมูล
  }

  return (
    <div>
      <h1>All Products</h1>
      {employees.length === 0 ? (
        <p>No orders available</p> // ถ้าไม่มีข้อมูล
      ) : (
        <table>
          <thead>
            <tr>
              <th>employee ID</th>
              <th>Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Username</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.emp_id}>
                <td>{employee.emp_id}</td>
                <td>{employee.name}</td>
                <td>{employee.lastname}</td>
                <td>{employee.email}</td>
                <td>{employee.phoneNumber}</td>
                <td>{employee.username}</td>
                <td>{employee.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllProduct;
