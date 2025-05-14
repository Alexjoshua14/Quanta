/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * NOTE: Colors need to be updated here and in the app/global.css file
 */
export const Palette = {
  light: {
    // Typography
    primary: "#3F3D34", // main copy (near-black on parchment)
    secondary: "#687076", // subdued grey

    // Surfaces
    background: "#F6F1E9", // parchment canvas
    backgroundSecondary: "#FFFDFC", // card / sheet

    // Accents
    tint: "#8B5E34", // primary brand color
    accent: "#6D8A5B", // sage-green secondary

    // Icons / tabs
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#8B5E34",
  },

  dark: {
    // Typography
    primary: "#E8E4D9", // cream on charcoal
    secondary: "#9BA1A6",

    // Surfaces
    background: "#1E1F1D", // matte obsidian
    // background: "#fb6f92", // pink
    backgroundSecondary: "#272724", // card / sheet

    // Accents
    tint: "#C6A27A",
    accent: "#7FA16E", // lighter sage for dark mode

    // Icons / tabs
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#C6A27A",
  },
};

export function themeColors(scheme: "light" | "dark") {
  return scheme === "dark" ? Palette.dark : Palette.light;
}
