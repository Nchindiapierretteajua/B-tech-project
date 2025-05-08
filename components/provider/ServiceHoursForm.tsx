import React from "react";
import { View, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextInput, HelperText, Text } from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface ServiceHoursFormProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

export function ServiceHoursForm({ control, errors }: ServiceHoursFormProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {DAYS.map((day) => (
        <View key={day} style={styles.dayRow}>
          <Text variant="bodyLarge" style={styles.dayLabel}>
            {day}
          </Text>
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name={`hours.${day}`} // RHF handles object keys
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  dense
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="e.g., 9am - 5pm or Closed"
                  error={!!errors.hours?.[day]} // Access nested error
                  style={styles.input}
                />
              )}
            />
            {/* Displaying error for each day might be too much? */}
          </View>
        </View>
      ))}
      {errors.hours &&
        typeof errors.hours === "object" &&
        !Array.isArray(errors.hours) &&
        Object.keys(errors.hours).length > 0 && (
          <HelperText type="error">Please check hours format.</HelperText>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  dayRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dayLabel: { width: 80, fontWeight: "bold" }, // Fixed width for alignment
  inputContainer: { flex: 1 },
  input: {},
});
