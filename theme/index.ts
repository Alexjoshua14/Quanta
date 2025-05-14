import { ColorSchemeName } from "react-native";
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";
import { ThemeData } from "./themeData";
import { Palette } from "./tokens";
export const getPaperTheme = (scheme: ColorSchemeName): MD3Theme => {
  if (!scheme) {
    scheme = "light";
  }

  const c = Palette[scheme];
  return {
    ...(scheme === "dark" ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(scheme === "dark" ? MD3DarkTheme.colors : MD3LightTheme.colors),
      ...c,
    },
  };
};

export const getCSSVars = (scheme: ColorSchemeName): ThemeData => {
  if (!scheme) {
    scheme = "light";
  }

  const c = Palette[scheme];
  return {
    "--color-primary": c.primary,
    "--color-secondary": c.secondary,
    "--color-background": c.background,
    "--color-background-secondary": c.backgroundSecondary,
    "--color-tint": c.tint,
    "--color-accent": c.accent,
    "--color-icon": c.icon,
    "--color-tab-icon-default": c.tabIconDefault,
    "--color-tab-icon-selected": c.tabIconSelected,
  };
};
