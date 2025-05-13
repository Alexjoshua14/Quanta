import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// src/theme/colors.ts
const tintColorLight = "#8B5E34"; // primary rustic brown
const tintColorDark = "#C6A27A"; // lighter almond accent for dark mode

export const Colors = {
  light: {
    // Typography
    text: "#3F3D34", // main copy (near-black on parchment)
    textSecondary: "#687076", // subdued grey

    // Surfaces
    background: "#F6F1E9", // parchment canvas
    backgroundSecondary: "#FFFDFC", // card / sheet

    // Accents
    tint: tintColorLight, // primary brand color
    accent: "#6D8A5B", // sage-green secondary

    // Icons / tabs
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },

  dark: {
    // Typography
    text: "#E8E4D9", // cream on charcoal
    textSecondary: "#9BA1A6",

    // Surfaces
    background: "#1A1B1E", // matte obsidian
    // background: "#fb6f92", // pink
    backgroundSecondary: "#272724", // card / sheet

    // Accents
    tint: tintColorDark,
    accent: "#7FA16E", // lighter sage for dark mode

    // Icons / tabs
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const zenTheme = {
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

export function themeColors(scheme: "light" | "dark") {
  return scheme === "dark"
    ? { text: Colors.dark.text, textSecondary: Colors.dark.textSecondary }
    : { text: Colors.light.text, textSecondary: Colors.light.textSecondary };
}
