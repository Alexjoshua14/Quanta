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

  const backgroundColor = colorScheme === "dark" ? "#1E1F1D" : "#F6F1E9";
  const textColor = colorScheme === "dark" ? "#E8E4D9" : "#1E1F1D";

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1"
      style={{ backgroundColor }}
    >
      <TodoList dateKey={dateKey} />
    </SafeAreaView>
  )
}
