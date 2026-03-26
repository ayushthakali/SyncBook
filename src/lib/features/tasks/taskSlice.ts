import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

const tasksAdapter = createEntityAdapter<Task>({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt), // Keep tasks sorted by creation date automatically i.e. newer dates first
});

const initialState = tasksAdapter.getInitialState({
  isLoading: false,
  error: null as string | null,
});

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: tasksAdapter.addOne,
    removeTask: tasksAdapter.removeOne,
    updateTask: tasksAdapter.updateOne,
    setTasks: tasksAdapter.setAll, //For bulk loading from a database later
    moveTask: (state, action) => {
      const { id, newStatus } = action.payload;
      console.log("dropped");
      // createEntityAdapter makes this update extremely fast (O(1))
      tasksAdapter.updateOne(state, { id, changes: { status: newStatus } });
    },
  },
});

export const { addTask, removeTask, updateTask, setTasks, moveTask } =
  taskSlice.actions;
export const { selectAll: selectAllTasks, selectById: selectTaskById } =
  tasksAdapter.getSelectors((state: RootState) => state.tasks);

export default taskSlice.reducer;

// Create memoized selector
import { createSelector } from "@reduxjs/toolkit";

const { selectAll } = tasksAdapter.getSelectors(
  (state: RootState) => state.tasks,
);

//  Memoized Selector: Get tasks by status
export const selectTasksByStatus = createSelector([selectAll], (allTasks) => {
  return {
    todo: allTasks.filter((t) => t.status === "todo"),
    inProgress: allTasks.filter((t) => t.status === "in-progress"),
    done: allTasks.filter((t) => t.status === "done"),
  };
});
