import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Color = {
  name: string;
  code: string;
};

// Define a type for the slice state
interface ProductsState {
  colorSelection: Color;
  sizeSelection: string;
  stock: Record<number, number>; // กำหนด stock เป็น object ที่มี key เป็น product ID และ value เป็นจำนวนสินค้า
}

// Define the initial state using that type
const initialState: ProductsState = {
  colorSelection: {
    name: "Brown",
    code: "bg-[#4F4631]",
  },
  sizeSelection: "Large",
  stock: {
    1: 10,
    2: 5,
    3: 8,
    4: 15,
    5: 20,
    6: 15,
    7: 30,
    8: 25,
    9: 18,
    10: 22,
    11: 12,
  },
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setColorSelection: (state, action: PayloadAction<Color>) => {
      state.colorSelection = action.payload;
    },
    setSizeSelection: (state, action: PayloadAction<string>) => {
      state.sizeSelection = action.payload;
    },
    updateStock: (
      state,
      action: PayloadAction<{ id: number; change: number }>
    ) => {
      const { id, change } = action.payload;
      if (state.stock[id] !== undefined) {
        const newStock = Math.max(state.stock[id] + change, 0); // ป้องกันค่าติดลบ
        console.log(`Updated stock for product ${id}: ${newStock}`); // เพิ่ม log เพื่อตรวจสอบ
        state.stock[id] = newStock;
      }
    },
  },
});

export const { setColorSelection, setSizeSelection, updateStock } =
  productsSlice.actions;

export default productsSlice.reducer;
