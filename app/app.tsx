import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import Today from "./(tabs)/index";
import Tomorrow from "./(tabs)/tomorrow";
import "./global.css";

const Tab = createBottomTabNavigator();

/**
 * App component
 * @returns A navigation container with a bottom tab navigator
 */
export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Today" component={Today} />
        <Tab.Screen name="Tomorrow" component={Tomorrow} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}