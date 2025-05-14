/**
 * This is a full screen modal that is used to add a new todo.
 * It is used in the Today and Tomorrow tabs.
 * When the user swipes down, the modal is opened
 * This modal contains a sleek form that allows the user to add
 * a new todo with a title, note, recurrence, and category.
 * If the user taps anywhere outside the form input areas,
 * the modal is closed.
 */

import { Recurrence, useTodos } from "@/store/useTodos";
import { Palette } from "@/theme/tokens";
import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import type { TextInput as RNTextInput } from 'react-native';
import { Modal, SafeAreaView, Text, useColorScheme, View } from "react-native";
import { RadioButton, TextInput } from "react-native-paper";
import RecurrenceButton from "./buttons/RecurrenceButton";
// TODO: Add transitions so modal appears over 300ms and disappears over 300ms
export default function AddTodoModal({ visible, onDismiss, close, dateKey }: { visible: boolean, onDismiss: () => void, close: () => void, dateKey: string }) {
  const add = useTodos((s) => s.addTodo);

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [recurrence, setRecurrence] = useState<Recurrence>("none");

  const titleInputRef = useRef<RNTextInput>(null);
  const noteInputRef = useRef<RNTextInput>(null);

  // TODO: Focus on title input when modal is shown

  const resetForm = () => {
    setTitle("");
    setNote("");
    setCategory("");
    setRecurrence("none");
  }

  const save = () => {
    if (!title.trim() && !note.trim()) {
      close();
      return;
    } else if (title.trim() === "") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      titleInputRef.current?.focus();
      return;
    }
    add({
      title,
      note,
      category,
      date: dateKey,
      recurrence,
    });

    close();
    resetForm();
  };

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? Palette.dark.background : Palette.light.background;
  const textColor = colorScheme === "dark" ? Palette.dark.primary : Palette.light.primary;
  const textColorSecondary = colorScheme === "dark" ? Palette.dark.secondary : Palette.light.secondary;


  return (
    <Modal visible={visible}>
      <SafeAreaView className="flex-1" style={{ backgroundColor }}>
        <View className="flex todo-card" style={{ backgroundColor }}>
          <TextInput
            label="Task"
            mode="flat"
            underlineStyle={{ display: "none" }}
            value={title}
            onChangeText={setTitle}
            className="todo-title"
            onSubmitEditing={() => noteInputRef.current?.focus()}
            autoFocus={true}
            ref={titleInputRef}
            style={{ color: textColor, backgroundColor: backgroundColor }}
          />
          <TextInput
            label="Notes (optional)"
            mode="outlined"
            underlineStyle={{ display: "none" }}
            outlineStyle={{ display: "none" }}
            activeOutlineColor="transparent"
            activeUnderlineColor="transparent"
            multiline
            numberOfLines={3}
            value={note}
            onChangeText={setNote}
            className="todo-note"
            onSubmitEditing={save}
            ref={noteInputRef}
            style={{ color: textColor, backgroundColor: backgroundColor }}
          />

          <RadioButton.Group
            onValueChange={(val) => setRecurrence(val as Recurrence)}
            value={recurrence}
          >
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {(["none", "daily", "weekdays", "weekends"] as Recurrence[]).map((opt) => (
                <View key={opt} style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* <RadioButton value={opt} /> */}
                  <RecurrenceButton
                    onPress={() => setRecurrence(opt)}
                    className={`selection:bg-transparent px-3 py-2
                        ${opt == recurrence ? "text-gray-600" : "text-gray-400"}
                      `}
                  >
                    <Text
                      style={{ color: opt == recurrence ? textColor : textColorSecondary }}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </Text>
                  </RecurrenceButton>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        </View>
        <View className="flex-1" onTouchEnd={save} />
      </SafeAreaView>
    </Modal>
  )
}