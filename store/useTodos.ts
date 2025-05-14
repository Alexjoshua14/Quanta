import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import * as Crypto from "expo-crypto";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export type Recurrence = "none" | "daily" | "weekdays" | "weekends";

/**
 * Todo interface
 * @description The todo object
 * @property id - The id of the todo
 * @property title - The title of the todo
 * @property note - The note of the todo
 * @property category - The category of the todo
 * @property date - The date of the todo
 * @property recurrence - The recurrence of the todo
 * @property completed - Whether the todo is completed
 */
export interface Todo {
  id: string;
  title: string;
  note?: string;
  category: string;
  date: string;
  recurrence: Recurrence;
  completed: boolean;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

/**
 * State interface
 * @description The state of the todos
 * @property todos - The todos
 * @property addTodo - The function to add a todo
 * @property toggle - The function to toggle a todo
 * @property cleanupRecurrences - The function to cleanup the recurrences
 */
interface State {
  todos: Record<string, Todo[]>;
  addTodo: (todo: Omit<Todo, "id" | "completed">) => void;
  deleteTodo: (date: string, id: string) => void;
  updateTodo: (date: string, id: string, todo: Todo) => void;
  toggle: (date: string, id: string) => void;
  cleanupRecurrences: () => void;
}

/**
 * useTodos store
 * @description A store for managing todos
 * @returns A store with todos, addTodo, toggle, and cleanupRecurrences functions
 */
export const useTodos = create<State>()(
  persist(
    (set) => ({
      todos: {},
      addTodo: (todo: Omit<Todo, "id" | "completed">) => {
        set((state) => {
          const date = dayjs(todo.date).format("YYYY-MM-DD");
          const currentTodos = state.todos[date] || [];
          const newTodo = {
            ...todo,
            id: Crypto.randomUUID(),
            completed: false,
          };

          return {
            todos: {
              ...state.todos,
              [date]: [...currentTodos, newTodo],
            },
          };
        });
      },
      addSubtask: (
        date: string,
        todoId: string,
        subtask: Omit<Subtask, "id" | "completed">
      ) => {
        set((state) => {
          const currentTodos = state.todos[date] || [];
          const newSubtask = {
            ...subtask,
            id: Crypto.randomUUID(),
            completed: false,
          };

          const updatedTodos = currentTodos.map((todo) =>
            todo.id === todoId
              ? { ...todo, subtasks: [...(todo.subtasks || []), newSubtask] }
              : todo
          );

          return {
            todos: {
              ...state.todos,
              [date]: updatedTodos,
            },
          };
        });
      },
      deleteTodo: (date: string, id: string) => {
        set((state) => {
          const currentTodos = state.todos[date] || [];
          const updatedTodos = currentTodos.filter((todo) => todo.id !== id);
          return { todos: { ...state.todos, [date]: updatedTodos } };
        });
      },
      deleteSubtask: (date: string, todoId: string, subtaskId: string) => {
        set((state) => {
          const currentTodos = state.todos[date] || [];
          const updatedTodos = currentTodos.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  subtasks: todo.subtasks?.filter((s) => s.id !== subtaskId),
                }
              : todo
          );

          return {
            todos: {
              ...state.todos,
              [date]: updatedTodos,
            },
          };
        });
      },
      updateTodo: (date: string, id: string, todo: Todo) => {
        set((state) => {
          const currentTodos = state.todos[date] || [];
          const updatedTodos = currentTodos.map((t) =>
            t.id === id ? todo : t
          );
          return { todos: { ...state.todos, [date]: updatedTodos } };
        });
      },
      updateSubtask: (
        date: string,
        todoId: string,
        subtaskId: string,
        subtask: Subtask
      ) => {
        set((state) => {
          const currentTodos = state.todos[date] || [];
          const updatedTodos = currentTodos.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  subtasks: todo.subtasks?.map((s) =>
                    s.id === subtaskId ? subtask : s
                  ),
                }
              : todo
          );
          return { todos: { ...state.todos, [date]: updatedTodos } };
        });
      },
      toggle: (date: string, id: string) => {
        set((state) => {
          const currentTodos = state.todos[date] || [];
          const updatedTodos = currentTodos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          );

          return {
            todos: {
              ...state.todos,
              [date]: updatedTodos,
            },
          };
        });
      },
      toggleSubtask: (date: string, todoId: string, subtaskId: string) => {
        set((state) => {
          const currentTodos = state.todos[date] || [];
          const updatedTodos = currentTodos.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  subtasks: todo.subtasks?.map((s) =>
                    s.id === subtaskId ? { ...s, completed: !s.completed } : s
                  ),
                }
              : todo
          );
          return { todos: { ...state.todos, [date]: updatedTodos } };
        });
      },
      cleanupRecurrences: () => {
        set((state) => {
          const today = dayjs().format("YYYY-MM-DD");
          const nextDay = (d: string, offset: number) =>
            dayjs(d).add(offset, "day").format("YYYY-MM-DD");

          const updated = { ...state.todos };

          Object.values(state.todos)
            .flat()
            .forEach((todo: Todo) => {
              if (todo.recurrence === "none") return;

              const shouldCopy = todo.date < today && !todo.completed;

              // TODO: Clean this up and make sure it actually works logic might have holes
              const isWeekdayRule =
                todo.recurrence === "weekdays" &&
                ![0, 6].includes(dayjs(todo.date).day());
              const isWeekendRule =
                todo.recurrence === "weekends" &&
                [0, 6].includes(dayjs(todo.date).day());

              if (shouldCopy || todo.date === today) {
                const newDate =
                  todo.recurrence === "daily"
                    ? nextDay(todo.date, 1)
                    : isWeekdayRule
                    ? nextDay(todo.date, 1)
                    : isWeekendRule
                    ? nextDay(todo.date, 2)
                    : null;

                if (newDate) {
                  const todos = updated[newDate] ?? [];
                  updated[newDate] = [
                    ...todos,
                    {
                      ...todo,
                      id: Crypto.randomUUID(),
                      date: newDate,
                      completed: false,
                    },
                  ];
                }
              }
            });
          return { todos: updated };
        });
      },
    }),
    {
      name: "quanta-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
