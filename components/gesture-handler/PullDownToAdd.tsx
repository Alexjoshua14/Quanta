/**
 * A component that allows the user to pull down to add a new todo item.
 */
import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface PullDownToAddProps {
  onAdd: () => void;
  children: ReactNode;
  threshold?: number;
}

// TODO: Add support for fling to add a todo
export function PullDownToAdd({ onAdd, children, threshold = 50 }: PullDownToAddProps) {
  const translateY = useSharedValue(0);
  const triggered = useSharedValue(false);

  const dragDown = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        // Dampen pull
        translateY.value = e.translationY * 0.4;
        console.log(translateY.value);
      }
    })
    .onEnd((e) => {
      console.log("onEnd", translateY.value);
      if (!triggered.value && translateY.value > threshold) {
        triggered.value = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onAdd();
      }
      translateY.value = withSpring(0, { stiffness: 100, damping: 18 });
      triggered.value = false;
    })
    .enabled(true);

  /** Animated Style */
  const style = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={dragDown}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  );
}