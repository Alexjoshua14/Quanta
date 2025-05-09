import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const paperTheme = {
  light: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#8B5E34",
      background: "#F6F1E9",
      surface: "#FFFDFC",
      onSurface: "#3F3D34",
    },
  },
  dark: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: "#556052",
      background: "1E1F1D",
      surface: "#FFFDFC",
      onSurface: "#3F3D34",
    },
  },
};
