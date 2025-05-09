// Page to add a todo
// Styling matches todo list for seamless transition

import { Colors } from "@/constants/Colors";
import { TextInput, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


// TOOD: connect to themee
export default function AddTodo() {

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
  const textColor = colorScheme === "dark" ? Colors.dark.text : Colors.light.text;
  const textColorSecondary = colorScheme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary;

  return <SafeAreaView className="screen">
    <View className="flex-row justify-between" style={{ backgroundColor }}>
      <TextInput
        placeholder="Title"
        className="flex-1"
        style={{ color: textColor }}
      />
      <TextInput
        placeholder="Note"
        className="flex-1"
        style={{ color: textColorSecondary }}
      />
    </View>
  </SafeAreaView>
}