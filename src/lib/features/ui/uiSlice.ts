import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../tasks/taskSlice";

interface UIState {
  isModalOpen: boolean;
  modalType: "todo" | "in-progress" | "done" | null;
  searchTerm: string;
  editingTask: Task | null;
  filterPriority: "all" | "low" | "medium" | "high";
}

const initialState: UIState = {
  isModalOpen: false,
  modalType: null,
  searchTerm: "",
  editingTask: null,
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
      state.isModalOpen = true;
      state.modalType = action.payload;
      state.editingTask = null;
    },
    openEditModal: (state, action: PayloadAction<Task>) => {
      state.isModalOpen = true;
      state.modalType = action.payload.status;
      state.editingTask = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingTask = null;
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
  openEditModal,
  closeModal,
  setSearchTerm,
  setFilterPriority,
} = uiSlice.actions;
