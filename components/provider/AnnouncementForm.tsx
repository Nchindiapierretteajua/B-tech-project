import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
  TextInput,
  HelperText,
  Button,
  Menu,
  Divider,
  Text,
  Checkbox,
  RadioButton,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import { Announcement, AnnouncementFormValues } from "@/lib/schemas";

// Example categories from schema
const CATEGORY_OPTIONS = [
  "General",
  "Education",
  "Health",
  "Security",
  "Events",
  "Opportunities",
];

interface AnnouncementFormProps {
  control: Control<AnnouncementFormValues>;
  errors: FieldErrors<AnnouncementFormValues>;
  // Add existingData for edit mode if needed
}

export function AnnouncementForm({ control, errors }: AnnouncementFormProps) {
  const { colors } = useAppTheme();
  const [categoryMenuVisible, setCategoryMenuVisible] = React.useState(false);
  // For expiry date (simple text input for now, can be upgraded to DatePicker)
  const [hasExpiry, setHasExpiry] = useState(false);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Announcement Title*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.title}
            style={styles.input}
          />
        )}
      />
      {errors.title && (
        <HelperText type="error">{errors.title.message}</HelperText>
      )}

      <Controller
        control={control}
        name="content"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Content*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.content}
            style={styles.input}
            multiline
            numberOfLines={6}
            placeholder="Enter full announcement details..."
          />
        )}
      />
      {errors.content && (
        <HelperText type="error">{errors.content.message}</HelperText>
      )}

      {/* Category Dropdown */}
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <View>
            <Menu
              visible={categoryMenuVisible}
              onDismiss={() => setCategoryMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setCategoryMenuVisible(true)}
                  style={styles.dropdownButton}
                  icon="chevron-down"
                >
                  {" "}
                  {CATEGORY_OPTIONS.find((opt) => opt === value) ||
                    "Select Category*"}{" "}
                </Button>
              }
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <Menu.Item
                  key={opt}
                  onPress={() => {
                    onChange(opt);
                    setCategoryMenuVisible(false);
                  }}
                  title={opt}
                />
              ))}
            </Menu>
            {errors.category && (
              <HelperText type="error">{errors.category.message}</HelperText>
            )}
          </View>
        )}
      />

      {/* Expiry Date (Optional) */}
      <View style={styles.checkboxContainer}>
        <Checkbox.Item
          label="Set Expiry Date?"
          status={hasExpiry ? "checked" : "unchecked"}
          onPress={() => setHasExpiry(!hasExpiry)}
          position="leading" // Puts checkbox before label
          labelStyle={styles.checkboxLabel}
          style={styles.checkboxItem}
        />
      </View>
      {hasExpiry && (
        <Controller
          control={control}
          name="expiryDate"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Expiry Date (YYYY-MM-DD)"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ""}
              error={!!errors.expiryDate}
              style={styles.input}
              placeholder="Optional: e.g., 2025-12-31"
              keyboardType="numeric"
            />
          )}
        />
      )}
      {errors.expiryDate && (
        <HelperText type="error">{errors.expiryDate.message}</HelperText>
      )}

      {/* Status (could be a dropdown too if more options than draft/publish) */}
      <Controller
        control={control}
        name="status"
        defaultValue="draft" // Set default here too
        render={({ field: { onChange, value } }) => (
          <View style={styles.radioContainer}>
            <Text variant="labelLarge">Initial Status:</Text>
            <RadioButton.Group onValueChange={onChange} value={value}>
              <View style={styles.radioOption}>
                <RadioButton value="draft" />
                <Text>Draft</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="published" />
                <Text>Publish Immediately</Text>
              </View>
            </RadioButton.Group>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  input: {},
  dropdownButton: {
    justifyContent: "flex-start",
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "grey",
    marginTop: 5,
  },
  checkboxContainer: { marginTop: 5 },
  checkboxItem: { paddingHorizontal: 0, paddingVertical: 0 }, // Adjust padding for better alignment
  checkboxLabel: { marginLeft: -8 }, // Adjust label alignment
  radioContainer: { marginTop: 10, marginBottom: 5 },
  radioOption: { flexDirection: "row", alignItems: "center" },
});
