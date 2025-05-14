import { TodoCardGesture } from "@/gestures/TodoCardGesture";
import { Todo, useTodos } from "@/store/useTodos";
import * as Haptic from "expo-haptics";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SimultaneousGesture } from "react-native-gesture-handler";
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
  onToggle,
  listRef,
  scrollGesture
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  listRef?: React.RefObject<ScrollView | null>;
  scrollGesture: SimultaneousGesture;
}) {
  const [open, setOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);


  // Enable swipe to delete
  const { deleteTodo, updateTodo } = useTodos();

  const handleDelete = () => {
    deleteTodo(todo.date, todo.id);
  }

  /**
   * Gestures to handle the todo card
   */

  const onTap = () => {
    setOpen((prev) => !prev);
    runOnJS(Haptic.impactAsync)(Haptic.ImpactFeedbackStyle.Heavy);
  }

  const onDoubleTap = () => {
    // Open todo in edit mode
    console.log("TODO: Open todo in edit mode")

    runOnJS(Haptic.impactAsync)(Haptic.ImpactFeedbackStyle.Rigid);
    runOnJS(setTimeout)(() => {
      runOnJS(Haptic.impactAsync)(Haptic.ImpactFeedbackStyle.Rigid);
    }, 200);
    runOnJS(setTimeout)(() => {
      runOnJS(Haptic.impactAsync)(Haptic.ImpactFeedbackStyle.Rigid);
    }, 400);
  }


  const onLongPress = () => {
    setContextMenuOpen(true);
  }

  const onForceTouch = async () => {
    // Copy item to clipboard
    const item = `${todo.title}\n${todo.note}`;
    // Clipboard.setStringAsync(item);
    console.log(`TODO: Copy item to clipboard: ${item}`);
  }

  const onSwipeLeft = () => {
    handleDelete();
  }

  const onSwipeRight = () => {
    onToggle(todo.id);
  }

  return (
    <TodoCardGesture
      onTap={onTap}
      onDoubleTap={onDoubleTap}
      onLongPress={onLongPress}
      onForceTouch={onForceTouch}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      listRef={listRef}
      scrollGesture={scrollGesture}
    >
      <Animated.View
        layout={LinearTransition.springify().damping(10).stiffness(100)}
        className={`todo-card ${todo.completed ? "opacity-50" : "opacity-100"
          }`}
      >
        <Text
          className={`todo-title ${todo.completed ? "line-through" : ""
            }`}
        >
          {todo.title}
        </Text>

        {todo.note &&
          <Text
            className={`todo-note 
              ${open ? "" : "line-clamp-1 text-ellipsis"}
              ${todo.completed ? "line-through" : ""}
              `}
          >
            {todo.note}
          </Text>}

      </Animated.View>
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