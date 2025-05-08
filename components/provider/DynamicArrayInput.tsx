import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Control,
  Controller,
  FieldErrors,
  UseFieldArrayReturn,
} from "react-hook-form";
import {
  TextInput,
  HelperText,
  IconButton,
  Button,
  Text,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

interface DynamicArrayInputProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  fieldArray: UseFieldArrayReturn<any, any, "id">; // Generic field array name
  fieldName: string; // e.g., "requirements", "tags", "steps.0.tips"
  label: string; // e.g., "Requirement", "Tag", "Tip"
  placeholder: string;
  addLabel: string;
  required?: boolean;
}

export function DynamicArrayInput({
  control,
  errors,
  fieldArray,
  fieldName,
  label,
  placeholder,
  addLabel,
  required = false,
}: DynamicArrayInputProps) {
  const { colors } = useAppTheme();
  const { fields, append, remove } = fieldArray;

  // Function to safely get nested errors
  const getNestedError = (index: number) => {
    const nameParts = fieldName.split(".");
    let currentError: any = errors;
    try {
      for (const part of nameParts) {
        if (isNaN(Number(part))) {
          // Object key like 'requirements'
          currentError = currentError?.[part];
        } else {
          // Array index
          currentError = currentError?.[parseInt(part)];
        }
      }
      // Now access the specific index within the array
      currentError = currentError?.[index];
      return currentError;
    } catch (e) {
      return undefined;
    }
  };

  return (
    <View style={styles.container}>
      {fields.map((field, index) => {
        const itemFieldName = `${fieldName}.${index}` as const;
        const itemError = getNestedError(index);
        return (
          <View key={field.id} style={styles.itemRow}>
            <View style={styles.inputWrapper}>
              <Controller
                control={control}
                name={itemFieldName}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    dense
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={`${label} ${index + 1}${required ? "*" : ""}`}
                    error={!!itemError}
                  />
                )}
              />
              {itemError && (
                <HelperText type="error" visible={!!itemError}>
                  {itemError.message as string}
                </HelperText>
              )}
            </View>
            <IconButton
              icon="delete-outline"
              iconColor={colors.error}
              size={20}
              onPress={() => remove(index)}
              disabled={fields.length === 1 && required} // Don't remove if only 1 and required
              style={styles.removeButton}
            />
          </View>
        );
      })}
      <Button
        icon="plus"
        mode="outlined"
        onPress={() => append("")}
        style={styles.addButton}
      >
        {addLabel}
      </Button>
      {/* Display array level errors (like min length) */}
      {errors[fieldName]?.root && (
        <HelperText type="error" visible={true}>
          {errors[fieldName].root.message as string}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  inputWrapper: { flex: 1 },
  removeButton: { margin: 0 },
  addButton: { alignSelf: "flex-start", marginTop: 5 },
});
