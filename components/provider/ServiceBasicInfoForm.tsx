import React from "react";
import { View, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextInput, HelperText, Menu, Button } from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

// Example options (fetch or define centrally)
const CATEGORY_OPTIONS = [
  { label: "Health", value: "health" },
  { label: "Education", value: "education" },
  { label: "Transportation", value: "transportation" },
  { label: "Legal", value: "legal" },
  { label: "Financial", value: "financial" }, // Add more as needed
];

interface ServiceBasicInfoFormProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

export function ServiceBasicInfoForm({
  control,
  errors,
}: ServiceBasicInfoFormProps) {
  const { colors } = useAppTheme();
  const [categoryMenuVisible, setCategoryMenuVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Service Name*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.name}
            style={styles.input}
          />
        )}
      />
      {errors.name && (
        <HelperText type="error">{errors.name.message as string}</HelperText>
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
                  {CATEGORY_OPTIONS.find((opt) => opt.value === value)?.label ||
                    "Select Category*"}{" "}
                </Button>
              }
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <Menu.Item
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    setCategoryMenuVisible(false);
                  }}
                  title={opt.label}
                />
              ))}
            </Menu>
            {errors.category && (
              <HelperText type="error">
                {errors.category.message as string}
              </HelperText>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="shortDescription"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Short Description*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.shortDescription}
            style={styles.input}
            placeholder="Brief summary for cards"
          />
        )}
      />
      {errors.shortDescription && (
        <HelperText type="error">
          {errors.shortDescription.message as string}
        </HelperText>
      )}

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Full Description*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.description}
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Detailed service description"
          />
        )}
      />
      {errors.description && (
        <HelperText type="error">
          {errors.description.message as string}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  input: {},
  dropdownButton: {
    justifyContent: "flex-start",
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "grey",
    marginTop: 5,
  },
});
