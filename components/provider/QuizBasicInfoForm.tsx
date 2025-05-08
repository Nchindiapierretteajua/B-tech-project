import React from "react";
import { View, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
  TextInput,
  HelperText,
  Menu,
  Button,
  Divider,
  Text,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

// Example options (fetch or define centrally)
// Reuse from Lesson form or define specifically for quizzes if different
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
const MOCK_LESSONS = [
  { id: "national-id", title: "How to Apply for a National ID Card" },
  { id: "tax-registration", title: "Tax Registration Process" },
  { id: "voting-rights", title: "Understanding Your Voting Rights" },
];

interface QuizBasicInfoFormProps {
  control: Control<any>;
  errors: FieldErrors<any>; // Use generic or define specific type for this section
}

export function QuizBasicInfoForm({ control, errors }: QuizBasicInfoFormProps) {
  const { colors } = useAppTheme();
  const [categoryMenuVisible, setCategoryMenuVisible] = React.useState(false);
  const [difficultyMenuVisible, setDifficultyMenuVisible] =
    React.useState(false);
  const [lessonMenuVisible, setLessonMenuVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Quiz Title*"
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
        <HelperText type="error">{errors.title.message as string}</HelperText>
      )}

      {/* Description */}
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
        <HelperText type="error">
          {errors.description.message as string}
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
                  {" "}
                  {DIFFICULTY_OPTIONS.find((opt) => opt.value === value)
                    ?.label || "Select Difficulty*"}{" "}
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
              <HelperText type="error">
                {errors.difficulty.message as string}
              </HelperText>
            )}
          </View>
        )}
      />

      {/* Passing Score & Points */}
      <View style={styles.row}>
        <View style={styles.flexInput}>
          <Controller
            control={control}
            name="passingScore"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Passing Score (%)*"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                value={String(value || "")}
                error={!!errors.passingScore}
                keyboardType="number-pad"
              />
            )}
          />
          {errors.passingScore && (
            <HelperText type="error">
              {errors.passingScore.message as string}
            </HelperText>
          )}
        </View>
        <View style={styles.flexInput}>
          <Controller
            control={control}
            name="points"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Points Reward*"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                value={String(value || "")}
                error={!!errors.points}
                keyboardType="number-pad"
              />
            )}
          />
          {errors.points && (
            <HelperText type="error">
              {errors.points.message as string}
            </HelperText>
          )}
        </View>
      </View>

      {/* Related Lesson Dropdown */}
      <Controller
        control={control}
        name="relatedLessonId"
        render={({ field: { onChange, value } }) => (
          <View>
            <Menu
              visible={lessonMenuVisible}
              onDismiss={() => setLessonMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setLessonMenuVisible(true)}
                  style={styles.dropdownButton}
                  icon="chevron-down"
                >
                  {" "}
                  {MOCK_LESSONS.find((opt) => opt.id === value)?.title ||
                    "Select Related Lesson (Optional)"}{" "}
                </Button>
              }
            >
              <Menu.Item
                onPress={() => {
                  onChange("");
                  setLessonMenuVisible(false);
                }}
                title="None"
              />
              <Divider />
              {MOCK_LESSONS.map((opt) => (
                <Menu.Item
                  key={opt.id}
                  onPress={() => {
                    onChange(opt.id);
                    setLessonMenuVisible(false);
                  }}
                  title={opt.title}
                />
              ))}
            </Menu>
            {/* No error display needed for optional field */}
          </View>
        )}
      />
    </View>
  );
}

// Reusing styles from LessonBasicInfoForm
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
    marginTop: 5,
  }, // Basic styling
});
