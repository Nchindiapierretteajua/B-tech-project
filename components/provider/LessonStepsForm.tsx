import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Control,
  FieldErrors,
  UseFieldArrayReturn,
  UseFormWatch,
} from "react-hook-form";
import { Button, Text, Card, IconButton, HelperText } from "react-native-paper";
import { LessonStepEditor } from "./LessonStepEditor";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

interface LessonStepsFormProps {
  control: Control<any>;
  errors: FieldErrors<any>; // Adjust type based on full form shape
  fieldArray: UseFieldArrayReturn<any, "steps", "id">; // Adjust field name if needed
  watch: UseFormWatch<any>; // Pass watch down if needed by editor preview
}

export function LessonStepsForm({
  control,
  errors,
  fieldArray,
  watch,
}: LessonStepsFormProps) {
  const { colors } = useAppTheme();
  const { fields, append, remove } = fieldArray;
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const addStep = () => {
    append({ title: `Step ${fields.length + 1}`, content: "" });
    setActiveStepIndex(fields.length); // Activate the new step
  };

  const removeStep = (index: number) => {
    if (fields.length <= 1) return; // Don't remove the last step
    remove(index);
    // Adjust active step index if necessary
    setActiveStepIndex((prev) => Math.min(prev, fields.length - 2));
  };

  return (
    <View style={styles.container}>
      {/* Step Tabs/Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScrollView}
      >
        <View style={styles.tabsContainer}>
          {fields.map((field, index) => (
            <Button
              key={field.id}
              mode={activeStepIndex === index ? "contained" : "outlined"}
              onPress={() => setActiveStepIndex(index)}
              style={styles.tabButton}
              compact
            >
              Step {index + 1}
            </Button>
          ))}
          <Button
            mode="contained-tonal"
            icon="plus"
            onPress={addStep}
            style={styles.tabButton}
            compact
          >
            Add Step
          </Button>
        </View>
      </ScrollView>

      {/* Active Step Editor */}
      <Card style={styles.editorCard} mode="outlined">
        <Card.Title
          title={`Editing Step ${activeStepIndex + 1}`}
          right={(props) =>
            fields.length > 1 ? (
              <IconButton
                {...props}
                icon="delete"
                onPress={() => removeStep(activeStepIndex)}
                iconColor={colors.error}
              />
            ) : null
          }
        />
        <Card.Content>
          {/* Render only the active step editor */}
          <LessonStepEditor
            control={control}
            errors={errors}
            index={activeStepIndex}
            // watch={watch} // Pass watch if editor needs it
          />
        </Card.Content>
      </Card>
      {errors.steps && typeof errors.steps === "string" && (
        <HelperText type="error" visible={true}>
          {errors.steps.message}
        </HelperText>
      )}
      {errors.steps?.root && ( // For array-level errors like min length
        <HelperText type="error" visible={true}>
          {errors.steps.root.message}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 15 },
  tabsScrollView: { flexGrow: 0, marginBottom: 10 }, // Prevent scrollview from taking too much space
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  tabButton: { marginRight: 8 },
  editorCard: {},
});
