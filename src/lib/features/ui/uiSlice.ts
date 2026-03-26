import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isTaskModalOpen: boolean;
  activeColumn: "todo" | "in-progress" | "done" | null;
  searchTerm: string;
  filterPriority: "all" | "low" | "medium" | "high";
}

const initialState: UIState = {
  isTaskModalOpen: false,
  activeColumn: null,
  searchTerm: "",
  filterPriority: "all",
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
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterPriority: (
      state,
      action: PayloadAction<UIState["filterPriority"]>,
    ) => {
      state.filterPriority = action.payload;
    },
  },
});

export default uiSlice;
export const {
  openTaskModal,
  closeTaskModal,
  setSearchTerm,
  setFilterPriority,
} = uiSlice.actions;
