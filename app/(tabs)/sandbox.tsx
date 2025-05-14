/**
 * This page is for listing out relevant information such as loaded fonts
 */

import { Colors } from "@/constants/Colors";
import { getLoadedFonts } from "expo-font";
import { useColorScheme, View } from "react-native";
import { Text } from "react-native-paper";
export default function Sandbox() {
  // function to change theme
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? Colors.dark.text : Colors.light.text;
  const textColorSecondary = colorScheme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary;

  // Function to actually set the applications theme


  const fonts = getLoadedFonts()
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text style={{ fontFamily: "Commissioner" }}>Loaded Fonts</Text>
      {fonts.map((font) => (
        <Text key={font}>{font}</Text>
      ))}
      <Text>Current Theme: {colorScheme === "dark" ? "Dark" : "Light"}</Text>
    </View>
  )
}
