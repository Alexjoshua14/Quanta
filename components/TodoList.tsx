import { Colors } from "@/constants/Colors";
import { Recurrence, Todo, useTodos } from "@/store/useTodos";
import dayjs from "dayjs";
import * as Haptic from "expo-haptics";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  clamp,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from "react-native-reanimated";
import AddTodoModal from "./AddTodoModal";
import TodoCard from "./TodoCard";

const INITIAL_Y_POSITION = -50;
const INITIAL_Y_SCROLL_POSITION = 0;
const DELAY_RESET = 500;

// Temp data
const tempTodos: Todo[] = [
  { id: "1", title: "Todo 1", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "2", title: "Todo 2", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "3", title: "Todo 3", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "4", title: "Todo 4", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "5", title: "Todo 5", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "6", title: "Todo 6", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "7", title: "Todo 7", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "8", title: "Todo 8", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "9", title: "Todo 9", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "10", title: "Todo 10", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "11", title: "Todo 11", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "12", title: "Todo 12", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "13", title: "Todo 13", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "14", title: "Todo 14", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "15", title: "Todo 15", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "16", title: "Todo 16", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "17", title: "Todo 17", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "18", title: "Todo 18", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "19", title: "Todo 19", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
  { id: "20", title: "Todo 20", completed: false, category: "Work", date: dayjs().format("YYYY-MM-DD"), recurrence: "daily" as Recurrence },
]


/**
 * A list of todos for a given date.
 * Allows the user to pull down to add a todo.
 * @param dateKey - The date key to display todos for.
 * @returns A list of todos for a given date.
 */
export default function TodoList({ dateKey }: { dateKey: string }) {
  const currentDate = dayjs().format("YYYY-MM-DD")
  const todos = useTodos(s => s.todos[dateKey])
  const toggle = useTodos(s => s.toggle)

  const [addTodoModalVisible, setAddTodoModalVisible] = useState(false)
  const [isHapticTriggered, setIsHapticTriggered] = useState(false)
  const inputScrollValue = useSharedValue(INITIAL_Y_POSITION);
  const listScrollValue = useSharedValue(0)

  const listRef = useRef<Animated.ScrollView>(null)

  const [isPanEnabled, setIsPanEnabled] = useState(true)

  const updatePanState = (offset: number) => {
    'worklet';
    if (offset > 0) {
      runOnJS(setIsPanEnabled)(false)
    } else if (offset === 0) {
      runOnJS(setIsPanEnabled)(true)
    }
  }

  /**
   * Scroll pan gesture
   * Handles the pull down to add a todo gesture
   * Fails on horizontal pan to allow todo Cards 
   * to handle swipe left and right
   */
  const scrollPanGesture = Gesture.Pan()
    .failOffsetX([-15, 15])
    .activeOffsetY([-10, 10])
    .onUpdate(({ translationY, translationX }) => {
      console.log("translationY", translationY)
      console.log("translationX", translationX)
      // Fail on horizontal pan to allow todo Cards to handle swipe left and right

      const smoothedTranslationY = translationY * 0.4
      if (translationY > 0) {  // Only handle downward pulls
        // Smoothen 
        const clampedValue = clamp(smoothedTranslationY, 0, -INITIAL_Y_POSITION)
        inputScrollValue.value = interpolate(
          clampedValue,
          [0, -INITIAL_Y_POSITION],
          [INITIAL_Y_POSITION, 0]
        )
        listScrollValue.value = clampedValue
      }

      // If user pulls down to threshold, trigger haptic
      if (smoothedTranslationY >= -INITIAL_Y_POSITION && !isHapticTriggered) {
        runOnJS(Haptic.impactAsync)(Haptic.ImpactFeedbackStyle.Medium)
        runOnJS(setIsHapticTriggered)(true)
      }

    })
    .onFinalize(({ translationY }) => {
      runOnJS(setIsHapticTriggered)(false)
      const inputGoBackAnimation = withTiming(INITIAL_Y_POSITION)
      const scrollGoBackAnimation = withTiming(INITIAL_Y_SCROLL_POSITION)

      if (translationY >= -INITIAL_Y_POSITION) {
        runOnJS(setAddTodoModalVisible)(true)
        inputScrollValue.value = withDelay(DELAY_RESET, inputGoBackAnimation)
        listScrollValue.value = withDelay(DELAY_RESET, scrollGoBackAnimation)
      } else {
        inputScrollValue.value = inputGoBackAnimation
        listScrollValue.value = scrollGoBackAnimation
      }
    })
    .enabled(isPanEnabled && !addTodoModalVisible)

  const nativeGesture = Gesture.Native()

  const composedGesture = Gesture.Simultaneous(scrollPanGesture, nativeGesture)

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag({ contentOffset }) {
      updatePanState(contentOffset.y)
    },
    onEndDrag({ contentOffset }) {
      updatePanState(contentOffset.y)
    },
    onMomentumEnd({ contentOffset }) {
      updatePanState(contentOffset.y)
    }
  });

  const addTodoTextAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: inputScrollValue.value }],
      opacity: interpolate(inputScrollValue.value, [INITIAL_Y_POSITION, 0], [0, 1])
    }
  })

  const listAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: listScrollValue.value }]
    }
  })

  const closeModal = useCallback(() => {
    setAddTodoModalVisible(false)
  }, [setAddTodoModalVisible])


  const handleToggle = useCallback((id: string) => {
    toggle(dateKey, id);
  }, [dateKey, toggle]);

  /** Theme colors */
  const colorScheme = useColorScheme();

  const backgroundColor = colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
  const backgroundSecondaryColor = colorScheme === "dark" ? Colors.dark.backgroundSecondary : Colors.light.backgroundSecondary;
  const textColor = colorScheme === "dark" ? Colors.dark.text : Colors.light.text;
  const textColorSecondary = colorScheme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary;


  return (
    <View className="flex-1 p-4">
      <AddTodoModal visible={addTodoModalVisible} onDismiss={() => { }} close={closeModal} dateKey={dateKey} />
      <Animated.Text
        style={[addTodoTextAnimatedStyle, { color: textColorSecondary }]}
        className="absolute mt-4 mx-4"
      >
        Add a todo
      </Animated.Text>
      <GestureDetector gesture={composedGesture}>
        <Animated.ScrollView
          style={[listAnimatedStyle]}
          className="flex-1"
          onScroll={onScroll}
          bounces={false}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          ref={listRef}
        >
          {
            todos ? todos.map(todo => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                listRef={listRef}
                scrollGesture={composedGesture}
              />
            )) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-2xl text-center" style={{ fontFamily: "Commissioner", color: textColorSecondary }}>
                  {`No todos for ${currentDate == dateKey ? "Today" : dateKey == dayjs().add(1, "day").format("YYYY-MM-DD") ? "Tomorrow" : dateKey}`}
                </Text>
              </View>
            )
          }
        </Animated.ScrollView>
      </GestureDetector>

    </View>
    // <FlatList
    //   data={todos}
    //   keyExtractor={(t) => t.id}
    //   renderItem={({ item }) => (
    //     <TodoCard
    //       todo={item}
    //       onToggle={handleToggle}
    //     />
    //   )}
    //   ListEmptyComponent={
    //     <View className="flex-1 items-center justify-center">
    //       <Text className="text-2xl text-center text-gray-500 dark:text-neutral-400" style={{ fontFamily: "Commissioner" }}>
    //         {`No todos for ${currentDate == dateKey ? "Today" : dateKey == dayjs().add(1, "day").format("YYYY-MM-DD") ? "Tomorrow" : dateKey}`}
    //       </Text>
    //       <Button title="Pull down to add a todo" onPress={() => { console.log("Add todo button pressed") }} />
    //     </View>
    //   }
    // />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addTodoText: {
    position: 'absolute',
    marginTop: 20,
    marginHorizontal: 16,
  },
  list: {
    flex: 1,
  },
})