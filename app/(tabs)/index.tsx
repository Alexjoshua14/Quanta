import TodoList from "@/components/TodoList";
import { Colors } from "@/constants/Colors";
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

  const backgroundColor = colorScheme === "dark" ? Colors.dark.background : Colors.light.background;

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ backgroundColor }}
      className="flex-1"
    >
      <TodoList dateKey={dateKey} />
    </SafeAreaView>
  )
}