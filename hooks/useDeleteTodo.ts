import { useTodos } from "@/store/useTodos";
import { useState } from "react";

export const useDeleteTodo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { todos, deleteTodo } = useTodos();

  return {
    isLoading,
    error,
    deleteTodo,
  };
};
