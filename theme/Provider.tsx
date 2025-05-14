import {
  DarkTheme, DefaultTheme,
  ThemeProvider as NavProvider
} from '@react-navigation/native';
import { createContext, useContext } from 'react';
import { ColorSchemeName, StyleSheet, useColorScheme, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { getPaperTheme } from '.';

const ThemeCtx = createContext<ColorSchemeName>('light');
export const useThemeScheme = () => useContext(ThemeCtx);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const { setColorScheme } = useColorScheme(); // or state toggle
  const colorScheme = useColorScheme();

  // const [scheme, setScheme] = useState<ColorSchemeName>('light');

  // const toggleTheme = useCallback(() => {
  //   const newScheme = scheme === 'light' ? 'dark' : 'light';
  //   setScheme(newScheme);
  //   setColorScheme(newScheme);
  // }, [scheme]);

  // const theme = getCSSVars(colorScheme);


  return (
    <ThemeCtx.Provider value={colorScheme}>
      <NavProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <PaperProvider theme={getPaperTheme(colorScheme)}>
          <View style={styles.vars} data-theme={colorScheme}>
            {children}
          </View>
        </PaperProvider>
      </NavProvider>
    </ThemeCtx.Provider>
  );
};

const styles = StyleSheet.create({
  vars: { flex: 1 }, // host view holding CSS vars
});