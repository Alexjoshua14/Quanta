import TodoList from "@/components/TodoList";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import dayjs from "dayjs";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tomorrow() {
  const dateKey = dayjs().add(1, "day").format("YYYY-MM-DD");

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? Colors.dark.background : Colors.light.background;

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ backgroundColor }}
      className="screen"
    >
      <TodoList dateKey={dateKey} />
    </SafeAreaView>
  )
}