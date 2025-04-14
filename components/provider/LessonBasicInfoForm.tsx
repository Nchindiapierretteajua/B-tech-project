import React from "react";
import { View, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
  TextInput,
  HelperText,
  Menu,
  Button,
  Divider,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout";

// Assuming LessonFormValues is defined in the main form component
// We only need the fields relevant to this section
interface BasicInfoData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  points: number;
}

interface LessonBasicInfoFormProps {
  control: Control<any>; // Use 'any' or the full form type
  errors: FieldErrors<BasicInfoData>;
}

// Example options (fetch or define centrally)
const CATEGORY_OPTIONS = [
  { label: "Citizenship & Rights", value: "citizenship" },
  { label: "Documentation & ID", value: "documentation" },
  { label: "Taxes & Finance", value: "taxes" },
  { label: "Healthcare System", value: "health" },
  { label: "Education System", value: "education" },
  { label: "Legal System", value: "legal" },
];

const DIFFICULTY_OPTIONS = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

export function LessonBasicInfoForm({
  control,
  errors,
}: LessonBasicInfoFormProps) {
  const { colors } = useAppTheme();
  const [categoryMenuVisible, setCategoryMenuVisible] = React.useState(false);
  const [difficultyMenuVisible, setDifficultyMenuVisible] =
    React.useState(false);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Lesson Title*"
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
        <HelperText type="error" visible={!!errors.title}>
          {errors.title.message}
        </HelperText>
      )}

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Description*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.description}
            style={styles.input}
            multiline
            numberOfLines={3}
          />
        )}
      />
      {errors.description && (
        <HelperText type="error" visible={!!errors.description}>
          {errors.description.message}
        </HelperText>
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
                  {CATEGORY_OPTIONS.find((opt) => opt.value === value)?.label ||
                    "Select Category*"}
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
              <HelperText type="error" visible={!!errors.category}>
                {errors.category.message}
              </HelperText>
            )}
          </View>
        )}
      />

      {/* Difficulty Dropdown */}
      <Controller
        control={control}
        name="difficulty"
        render={({ field: { onChange, value } }) => (
          <View>
            <Menu
              visible={difficultyMenuVisible}
              onDismiss={() => setDifficultyMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setDifficultyMenuVisible(true)}
                  style={styles.dropdownButton}
                  icon="chevron-down"
                >
                  {DIFFICULTY_OPTIONS.find((opt) => opt.value === value)
                    ?.label || "Select Difficulty*"}
                </Button>
              }
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <Menu.Item
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    setDifficultyMenuVisible(false);
                  }}
                  title={opt.label}
                />
              ))}
            </Menu>
            {errors.difficulty && (
              <HelperText type="error" visible={!!errors.difficulty}>
                {errors.difficulty.message}
              </HelperText>
            )}
          </View>
        )}
      />

      <View style={styles.row}>
        <View style={styles.flexInput}>
          <Controller
            control={control}
            name="duration"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Duration*"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.duration}
                placeholder="e.g., 15 min"
              />
            )}
          />
          {errors.duration && (
            <HelperText type="error" visible={!!errors.duration}>
              {errors.duration.message}
            </HelperText>
          )}
        </View>
        <View style={styles.flexInput}>
          <Controller
            control={control}
            name="points"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Points*"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text) || 0)} // Ensure number
                value={String(value || "")}
                error={!!errors.points}
                keyboardType="number-pad"
              />
            )}
          />
          {errors.points && (
            <HelperText type="error" visible={!!errors.points}>
              {errors.points.message}
            </HelperText>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  input: {},
  row: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  flexInput: { flex: 1 },
  dropdownButton: {
    justifyContent: "flex-start",
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "grey",
  }, // Basic styling
});
