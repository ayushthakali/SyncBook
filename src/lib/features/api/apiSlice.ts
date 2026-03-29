import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "@/lib/supabaseClient";
import { Task, TaskStatus } from "../tasks/taskSlice";

interface TaskColumns {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(), // Since we use the Supabase SDK, we use fakeBaseQuery cuz no real HTTP request exists and it provides dummyBaseQuery
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    // Get All Tasks
    getTasks: builder.query<
      { todo: Task[]; inProgress: Task[]; done: Task[] },
      void
    >({
      queryFn: async () => {
        const { data, error } = await supabase.from("tasks").select("*");
        if (error) return { error };
        const tasks = data as Task[];
        return {
          data: {
            todo: tasks.filter((t) => t.status === "todo"),
            inProgress: tasks.filter((t) => t.status === "in-progress"),
            done: tasks.filter((t) => t.status === "done"),
          },
        };
      },
      providesTags: ["Tasks"], // This tells Redux to re-fetch the list automatically!

      //runs when a query cache entry is created and stays active until it is removed.
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        // Create supabase channel
        const channel = supabase
          .channel("schema-db-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "tasks",
            },
            (payload) => {
              //When change happens, we manually update the RTK Query cache!
              updateCachedData((draft) => {
                const { eventType, new: newRow, old: oldRow } = payload;
                if (eventType === "INSERT") {
                  // Add the new task to the correct column
                  const newTask = newRow as Task;
                  const column =
                    newTask.status === "in-progress"
                      ? "inProgress"
                      : newTask.status;
                  draft[column].push(newTask);
                }

                if (eventType === "UPDATE") {
                  const updatedTask = newRow as Task; //this handles changes from OTHER devices!

                  //Remove from all columns first to be safe
                  for (const col in draft) {
                    draft[col as keyof TaskColumns] = draft[
                      col as keyof TaskColumns
                    ].filter((t) => t.id !== updatedTask.id);
                  }

                  //Add to new correct column
                  const column =
                    updatedTask.status === "in-progress"
                      ? "inProgress"
                      : updatedTask.status;
                  draft[column as keyof TaskColumns].push(updatedTask);
                }

                if (eventType === "DELETE") {
                  const deletedId = oldRow.id;
                  for (const col in draft) {
                    draft[col as keyof TaskColumns] = draft[
                      col as keyof TaskColumns
                    ].filter((t) => t.id !== deletedId);
                  }
                }
              });
            },
          )
          .subscribe();

        //Clean up the websocket if the user leaves the page
        await cacheEntryRemoved;
        supabase.removeChannel(channel);
      },
    }),

    // Create task
    createTask: builder.mutation<Task, Partial<Task>>({
      queryFn: async (newTask) => {
        const { data, error } = await supabase
          .from("tasks")
          .insert([newTask])
          .select() //coz postgreSQL doesn’t return inserted rows by default.
          .single();
        if (error) return { error };
        return { data: data as Task };
      },
      invalidatesTags: ["Tasks"],
    }),

    // Update task
    updateTask: builder.mutation<Task, Partial<Task> & { id: string }>({
      queryFn: async ({ id, ...patch }) => {
        const { data, error } = await supabase
          .from("tasks")
          .update(patch)
          .eq("id", id)
          .select()
          .single();
        if (error) return { error };
        return { data: data as Task };
      },
      invalidatesTags: ["Tasks"],
    }),

    //Update Task Status (For Drag and Drop)
    updateTaskStatus: builder.mutation<
      void,
      { id: string; status: TaskStatus }
    >({
      queryFn: async ({ id, status }) => {
        const { data, error } = await supabase
          .from("tasks")
          .update({ status })
          .eq("id", id)
          .select();
        if (error) return { error };
        return { data: data[0] };
      },

      // This is the Magic Part ✨
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        // 1. Manually update the cache BEFORE the server responds
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getTasks", undefined, (draft) => {
            //->manual cache update
            //find which column currently has the task
            let taskToMove: Task | undefined;
            let sourceColumn: keyof typeof draft | undefined;

            for (const col in draft) {
              const found = draft[col as keyof typeof draft].find(
                (t) => t.id === id,
              );
              if (found) {
                taskToMove = found;
                sourceColumn = col as keyof typeof draft;
              }
            }

            if (taskToMove && sourceColumn) {
              draft[sourceColumn] = draft[sourceColumn].filter(
                (t) => t.id !== id,
              );

              taskToMove.status = status;

              // Map our internal status to the column names in the draft
              const columnMap: Record<string, keyof typeof draft> = {
                todo: "todo",
                "in-progress": "inProgress", // Make sure these match your transformResponse keys!
                done: "done",
              };

              const targetCol = columnMap[status];
              draft[targetCol].push(taskToMove);
            }
          }),
        );

        try {
          // 2. Wait for the real server response
          await queryFulfilled; //querryFulfilled -> promise rep the actual API request: resolves on sucess and rejects on failed
        } catch {
          // 3. If the server fails (e.g., no internet), UNDO the move automatically!
          patchResult.undo();
        }
      },
    }),

    deleteTask: builder.mutation<string, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (error) return { error };
        return { data: id };
      },
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} = apiSlice;
