import TodoList from "@/components/TodoList";
import { Palette } from "@/theme/tokens";
import dayjs from "dayjs";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tomorrow() {
  const dateKey = dayjs().add(1, "day").format("YYYY-MM-DD");

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? Palette.dark.background : Palette.light.background;
  const textColor = colorScheme === "dark" ? Palette.dark.primary : Palette.light.primary;

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="screen bg-background"
      style={{ backgroundColor }}
    >
      <TodoList dateKey={dateKey} />
    </SafeAreaView>
  )
}