import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isTaskModalOpen: boolean;
  activeColumn: "todo" | "in-progress" | "done" | null;
}

const initialState: UIState = {
  isTaskModalOpen: false,
  activeColumn: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openTaskModal: (
      state,
      action: PayloadAction<"todo" | "in-progress" | "done">,
    ) => {
      state.isTaskModalOpen = true;
      state.activeColumn = action.payload;
    },
    closeTaskModal: (state) => {
      state.isTaskModalOpen = false;
      state.activeColumn = null;
    },
  },
});

export default uiSlice;
export const { openTaskModal, closeTaskModal } = uiSlice.actions;
