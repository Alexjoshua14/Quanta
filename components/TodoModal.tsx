import { Recurrence, useTodos } from "@/store/useTodos";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, FAB, Modal, Portal, RadioButton, TextInput } from "react-native-paper";

export default function TodoModal({ dateKey }: { dateKey: string }) {
  const add = useTodos((s) => s.addTodo);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [recurrence, setRecurrence] = useState<Recurrence>("none");

  const resetForm = () => {
    setTitle("");
    setNote("");
    setCategory("");
    setRecurrence("none");
  }

  const save = () => {
    if (!title.trim()) return;
    add({
      title,
      note,
      category,
      date: dateKey,
      recurrence,
    });
    setOpen(false);
    resetForm();
  };

  return (
    <>
      <Portal>
        <Modal
          visible={open}
          onDismiss={() => setOpen(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            marginHorizontal: 20,
            borderRadius: 24,
          }}
        >
          <TextInput
            label="Task"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            className="mb-4"
          />
          <TextInput
            label="Notes (optional)"
            mode="outlined"
            multiline
            numberOfLines={3}
            value={note}
            onChangeText={setNote}
            className="mb-4"
          />

          <RadioButton.Group
            onValueChange={(val) => setRecurrence(val as Recurrence)}
            value={recurrence}
          >
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {(["none", "daily", "weekdays", "weekends"] as Recurrence[]).map((opt) => (
                <View key={opt} style={{ flexDirection: "row", alignItems: "center", marginRight: 16 }}>
                  <RadioButton value={opt} />
                  <Button onPress={() => setRecurrence(opt)} compact>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </Button>
                </View>
              ))}
            </View>
          </RadioButton.Group>

          <Button mode="contained" onPress={save} style={{ marginTop: 16 }}>
            Save
          </Button>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 14,
          bottom: 100,
        }}
        onPress={() => setOpen(true)}
      />
    </>
  )
}