import { SPRING } from "@/constants/animation";
import { Colors } from "@/constants/Colors";
import { TodoCardGesture } from "@/gestures/TodoCardGesture";
import { Todo, useTodos } from "@/store/useTodos";
import * as Haptic from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Text, useColorScheme } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import Animated, { LinearTransition, runOnJS, useSharedValue, withSpring } from "react-native-reanimated";


/**
 * TodoCard component
 * 
 * WIP
 * Edit Todo section should look just like Add Todo
 * 
 * @param todo - The todo object
 * @param onToggle - The function to toggle the todo, marking it as completed
 * @returns A todo card component
 */
export default function TodoCard({
  todo,
  onToggle
}: {
  todo: Todo;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [todoNote, setTodoNote] = useState(todo.note);

  /** Theme colors */
  const colorScheme = useColorScheme();
  const [textColor, setTextColor] = useState(colorScheme === "dark" ? Colors.dark.text : Colors.light.text);
  const [textColorSecondary, setTextColorSecondary] = useState(colorScheme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary);
  const scale = useSharedValue(1);

  useEffect(() => {
    setTextColor(colorScheme === "dark" ? Colors.dark.text : Colors.light.text);
    setTextColorSecondary(colorScheme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary);
  }, [colorScheme]);


  // Enable swipe to delete
  const { deleteTodo, updateTodo } = useTodos();

  const handleDelete = () => {
    deleteTodo(todo.date, todo.id);
  }

  const swipeToDeleteGesture = Gesture.Pan()
    .onChange((event) => {
      console.log(event);
    })
    .onEnd((event) => {
      console.log(event);
    });

  const openMenuGesture = Gesture.LongPress()
    .minDuration(750)
    .onStart(() => {
      scale.value = withSpring(0.95, SPRING);
    })
    .onEnd(() => {
      runOnJS(Haptic.impactAsync)(Haptic.ImpactFeedbackStyle.Light);
      scale.value = withSpring(1, SPRING);
      runOnJS(setContextMenuOpen)(true);
    });


  const composedGesture = Gesture.Race(
    swipeToDeleteGesture,
    openMenuGesture
  );

  // TODO: Set up swipe gesture


  const openMenu = () => {
    setOpen((prev) => !prev);
  }

  const onDoubleTap = () => {

  }

  return (
    // <GestureDetector gesture={composedGesture}>
    <>
      <TodoCardGesture onTap={() => onToggle(todo.id)} onLongPress={openMenu} onDoubleTap={onDoubleTap}>
        {/* <TouchableOpacity
      onPress={() => setOpen((prev) => !prev)}
      onLongPress={() => onToggle(todo.id)}
      className=""
    > */}
        <Animated.View
          layout={LinearTransition.springify().damping(10).stiffness(100)}
          className={`todo-card ${todo.completed ? "" : ""
            }`}
        >
          <Text
            style={{ color: textColor }}
            className={`todo-title ${todo.completed ? "line-through" : ""
              }`}
          >
            {todo.title}
          </Text>

          {todo.note && <Text style={{ color: textColorSecondary }} className={`todo-note ${open ? "line-clamp-1" : "text-ellipsis"}`} >
            {todo.note}
          </Text>}

        </Animated.View>
        {/* </TouchableOpacity> */}
      </TodoCardGesture>
      {/* <Portal>
        <View className="absolute">
          <View className="bg-white rounded-lg p-4">
            <TextInput
              value={todoTitle}
              onChangeText={(text) => {
                setTodoTitle(text);
              }}
            />
            <TextInput
              value={todoNote}
              onChangeText={(text) => {
                setTodoNote(text);
              }}
            />
            <Button
              title="Save"
              onPress={() => {
                updateTodo(todo.date, todo.id, { ...todo, title: todoTitle, note: todoNote });
              }} />
            <Button
              title="Discard"
              onPress={() => {
                setTodoTitle(todo.title);
                setTodoNote(todo.note);
              }}
            />
          </View>
        </View>
      </Portal> */}
    </>
  );
}