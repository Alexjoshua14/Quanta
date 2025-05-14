import TodoList from "@/components/TodoList";
import dayjs from "dayjs";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tomorrow() {
  const dateKey = dayjs().add(1, "day").format("YYYY-MM-DD");

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="screen bg-background"
    >
      <TodoList dateKey={dateKey} />
    </SafeAreaView>
  )
}