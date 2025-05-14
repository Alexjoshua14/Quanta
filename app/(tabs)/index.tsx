import TodoList from "@/components/TodoList";
import { useColorScheme } from "@/hooks/useColorScheme";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Today() {
  const dateKey = dayjs().format("YYYY-MM-DD");

  const [addTodoModalVisible, setAddTodoModalVisible] = useState(false);

  const onPull = useCallback(() => {
    setAddTodoModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setAddTodoModalVisible(false);
  }, []);

  /** Theme colors */
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background"
    >
      <TodoList dateKey={dateKey} />
    </SafeAreaView>
  )
}