/**
 * Recreate the Button component with customized configuration, removing the default styles
 * and the ripple effect. Starts from a very low level, never using react-native-paper.
 * Allows for haptic feedback control.
 * Allows to either display text or a custom component.
 */

import { GestureResponderEvent, Pressable, PressableProps, StyleProp, Text, ViewStyle } from "react-native";

// TODO: Add basic styling to make this more like the default button
interface RecurrenceButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  /**
   * Use a compact look, useful for `text` buttons in a row.
   */
  compact?: boolean;
  /**
   * Text to display inside the button.
   */
  text?: string;
}

export default function RecurrenceButton({
  onPress,
  text,
  children,
  ...props
}: RecurrenceButtonProps) {

  function onTap(event: GestureResponderEvent) {
    // Add haptic feedback

    onPress?.(event);
  }

  if (text) {
    return <Pressable
      onPress={onTap}
      {...props}>
      <Text>{text}</Text>
    </Pressable>;
  } else {
    return <Pressable onPress={onPress} {...props}>
      {children}
    </Pressable>;
  }

}