import React from "react";
import { View, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextInput, IconButton, Avatar } from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

interface QuizOptionInputProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  questionIndex: number;
  optionIndex: number;
  onRemove: () => void;
  canRemove: boolean; // Can this option be removed (e.g., need at least 2)
}

export function QuizOptionInput({
  control,
  errors,
  questionIndex,
  optionIndex,
  onRemove,
  canRemove,
}: QuizOptionInputProps) {
  const { colors } = useAppTheme();
  const fieldName =
    `questions.${questionIndex}.options.${optionIndex}` as const;

  return (
    <View style={styles.container}>
      <Avatar.Text
        size={32}
        label={String.fromCharCode(65 + optionIndex)} // A, B, C...
        style={styles.optionLabel}
        color={colors.onSecondaryContainer}
      />
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name={fieldName}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              mode="outlined"
              dense // Make input slightly smaller
              placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={
                !!errors.questions?.[questionIndex]?.options?.[optionIndex]
              }
              style={styles.input}
            />
          )}
        />
        {/* Note: Displaying errors for individual options might clutter UI, often parent array validation is enough */}
      </View>

      {canRemove && (
        <IconButton
          icon="delete-outline"
          iconColor={colors.error}
          size={20}
          onPress={onRemove}
          style={styles.removeButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  optionLabel: {
    backgroundColor: "#e0e0e0", // Use theme color like colors.surfaceVariant
  },
  inputContainer: {
    flex: 1,
  },
  input: {},
  removeButton: {
    margin: 0, // Remove default margin
  },
});
