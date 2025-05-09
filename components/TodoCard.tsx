import { Colors } from "@/constants/Colors";
import { TodoCardGesture } from "@/gestures/TodoCardGesture";
import { Todo, useTodos } from "@/store/useTodos";
import * as Haptic from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import Animated, { LinearTransition, runOnJS } from "react-native-reanimated";


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
  const [backgroundColor, setBackgroundColor] = useState(colorScheme === "dark" ? Colors.dark.background : Colors.light.background);
  const [backgroundColorSecondary, setBackgroundColorSecondary] = useState(colorScheme === "dark" ? Colors.dark.backgroundSecondary : Colors.light.backgroundSecondary);

  useEffect(() => {
    setTextColor(colorScheme === "dark" ? Colors.dark.text : Colors.light.text);
    setTextColorSecondary(colorScheme === "dark" ? Colors.dark.textSecondary : Colors.light.textSecondary);
  }, [colorScheme]);


  // Enable swipe to delete
  const { deleteTodo, updateTodo } = useTodos();

  const handleDelete = () => {
    deleteTodo(todo.date, todo.id);
  }

  // TODO: Set up swipe gesture


  const onLongPress = () => {
    setOpen((prev) => !prev);
    runOnJS(Haptic.impactAsync)(Haptic.ImpactFeedbackStyle.Heavy);
  }

  const onSwipeLeft = () => {
    handleDelete();
  }

  return (
    <TodoCardGesture onTap={() => onToggle(todo.id)} onLongPress={onLongPress} onSwipeLeft={handleDelete}>
      {/* <TouchableOpacity
      onPress={() => setOpen((prev) => !prev)}
      onLongPress={() => onToggle(todo.id)}
      className=""
    > */}
      <Animated.View
        layout={LinearTransition.springify().damping(10).stiffness(100)}
        style={{ backgroundColor: open ? backgroundColorSecondary : backgroundColor }}
        className={`todo-card ${todo.completed ? "opacity-50" : "opacity-100"
          }`}
      >
        <Text
          style={{ color: textColor }}
          className={`todo-title ${todo.completed ? "line-through" : ""
            }`}
        >
          {todo.title}
        </Text>

        {todo.note &&
          <Text
            style={{ color: textColorSecondary }}
            className={`todo-note 
              ${open ? "" : "line-clamp-1 text-ellipsis"}
              ${todo.completed ? "line-through" : ""}
              `}
          >
            {todo.note}
          </Text>}

      </Animated.View>
      {/* </TouchableOpacity> */}
      {/* TODO: MOVE this context menu to be like a little dropdown menu under note */}
      <Modal
        visible={contextMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setContextMenuOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setContextMenuOpen(false)} />
        <View style={[
          styles.menu,
          { backgroundColor: colorScheme === "dark" ? Colors.dark.backgroundSecondary : Colors.light.backgroundSecondary }
        ]}>
          <Pressable onPress={() => { onToggle(todo.id); setContextMenuOpen(false); }}>
            <Text style={styles.menuItem}>Toggle Complete</Text>
          </Pressable>
          <Pressable onPress={() => { handleDelete(); setContextMenuOpen(false); }}>
            <Text style={[styles.menuItem, styles.danger]}>Delete</Text>
          </Pressable>
        </View>
      </Modal>
    </TodoCardGesture>
  );
}
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  menu: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 8,
  },
  danger: {
    color: "#E74C3C",
  },
});