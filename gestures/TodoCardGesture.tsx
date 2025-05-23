/**
 * All the gestures for the TodoCard
 */

import * as Haptic from "expo-haptics";
import { Dimensions, ScrollView } from "react-native";
import { Gesture, GestureDetector, SimultaneousGesture } from "react-native-gesture-handler";
import { GestureDetectorProps } from "react-native-gesture-handler/lib/typescript/handlers/gestures/GestureDetector";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";
/**
 * Props for the TodoCardGesture component
 * 
 * @param onSwipeLeft - Callback for when the user swipes left (delete)
 * @param onSwipeRight - Callback for when the user swipes right
 * @param onSwipeHorizontal - Callback for when the user swipes either direction horizontally
 * @param onLongPress - Callback for when the user long presses
 * @param onTap - Callback for when the user taps
 * @param onDoubleTap - Callback for when the user double taps
 */
type TodoCardGestureProps = {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeHorizontal?: () => void;
  onLongPress?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onForceTouch?: () => void;
  listRef?: React.RefObject<ScrollView | null>;
  scrollGesture?: SimultaneousGesture;
} & Omit<GestureDetectorProps, "gesture">;

// Gesture configuration
const SWIPE_THRESHOLD = 50;
const MAX_SWIPE_DISTANCE = 60;

const RESISTANCE_FACTOR = 0.3;
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.8,
  velocity: 0.5,
};

// Device screen width – used to slide card completely off‑screen on delete
const SCREEN_WIDTH = Dimensions.get("window").width;

// Animation configuration
const TAP_SCALE = 0.97;
const LONG_PRESS_SCALE = 0.95;
const SWIPE_SCALE = 0.95;
const ANIMATION_CONFIG = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export const TodoCardGesture = ({
  children,
  onTap,
  onDoubleTap,
  onForceTouch,
  onSwipeLeft,
  onSwipeRight,
  onSwipeHorizontal,
  onLongPress,
  scrollGesture,
  ...props
}: TodoCardGestureProps) => {
  // Shared values for animations
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const isPressed = useSharedValue(false);

  /**
   * Swipe horizontal gesture
   * Handles the swipe left and right gestures
   * Fails on vertical pan to allow todo Cards 
   * to handle pull down to add a todo gesture
   */
  const swipeHorizontal = Gesture.Pan()
    .failOffsetY([-10, 10])
    .activeOffsetX([-12, 12])
    .onStart(() => {
      isPressed.value = true;
      // Subtle scale down on start
      // scale.value = withSpring(SWIPE_SCALE, SPRING_CONFIG);
    })
    .onUpdate((event) => {
      // Apply resistance when exceeding max distance
      const resistance = Math.abs(event.translationX) > MAX_SWIPE_DISTANCE
        ? 1 - (Math.abs(event.translationX) - MAX_SWIPE_DISTANCE) * RESISTANCE_FACTOR
        : 1;

      // Cap the translation at the max swipe distance in either direction
      const translationDistance = Math.min(Math.max(event.translationX, -MAX_SWIPE_DISTANCE), MAX_SWIPE_DISTANCE);
      translateX.value = translationDistance;
    })
    .onEnd((event) => {
      isPressed.value = false;
      const { translationX } = event;

      if (translationX < -SWIPE_THRESHOLD) {
        // Swipe‑left → delete
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 250 }, (finished) => {
          if (finished) {
            onSwipeLeft && runOnJS(onSwipeLeft)();
            onSwipeHorizontal && runOnJS(onSwipeHorizontal)();
            // Reset for recycled render (in case list item persists in memory)
            translateX.value = 0;
            scale.value = 1;
          }
        });
        return;
      }

      if (translationX > SWIPE_THRESHOLD) {
        // Swipe‑right
        onSwipeRight && runOnJS(onSwipeRight)();
        onSwipeHorizontal && runOnJS(onSwipeHorizontal)();
      }

      // Not past threshold → snap back
      translateX.value = withSpring(0, SPRING_CONFIG);
      scale.value = withSpring(1, SPRING_CONFIG);
    });

  const tap = Gesture.Tap()
    .onStart(() => {
      scale.value = withSpring(TAP_SCALE, SPRING_CONFIG);
      console.log("tap start");
    })
    .onEnd(() => {
      scale.value = withSpring(1, SPRING_CONFIG);
      onTap && runOnJS(onTap)();
      console.log("tap end");
    })

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      onDoubleTap && runOnJS(onDoubleTap)();
      console.log("double tap start");
    })


  const longPress = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      scale.value = withSpring(LONG_PRESS_SCALE, SPRING_CONFIG);
      onLongPress && runOnJS(onLongPress)();
      runOnJS(Haptic.impactAsync)(Haptic.ImpactFeedbackStyle.Medium);
      console.log("long press start");
    })
    .onEnd(() => {
      scale.value = withSpring(1, SPRING_CONFIG);
      console.log("long press end");
    });

  const forceTouch = Gesture.ForceTouch()
    .onStart(() => {
      onForceTouch && runOnJS(onForceTouch)();
    })
    .feedbackOnActivation(true)

  const composedGesture = Gesture.Exclusive(
    swipeHorizontal,
    doubleTap,
    tap,
    longPress,
    forceTouch,
  );

  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value }
      ],
    };
  });

  return (
    <GestureDetector gesture={composedGesture} {...props}>
      <Animated.View style={animatedViewStyle}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
