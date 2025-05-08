import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Control, FieldErrors, UseFieldArrayReturn } from "react-hook-form";
import { Button, Text, Card, IconButton, HelperText } from "react-native-paper";
import { ServiceStepEditor } from "./ServiceStepEditor";
import { useAppTheme } from "@/app/_layout";

interface ServiceStepsGuideFormProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  fieldArray: UseFieldArrayReturn<any, "steps", "id">; // Adjust field name if needed
}

export function ServiceStepsGuideForm({
  control,
  errors,
  fieldArray,
}: ServiceStepsGuideFormProps) {
  const { colors } = useAppTheme();
  const { fields, append, remove } = fieldArray;
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const addStep = () => {
    // Add default structure for a service step
    append({
      title: `Step ${fields.length + 1}`,
      description: "",
      tips: [""],
      documents: [""],
    });
    setActiveStepIndex(fields.length);
  };

  const removeStep = (index: number) => {
    // Allow removing the last step if steps are optional (check schema)
    // if (fields.length <= 1 && schemaRequiresOneStep) return;
    remove(index);
    setActiveStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <View style={styles.container}>
      {/* Step Tabs */}
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
              {" "}
              Step {index + 1}{" "}
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
      {fields.length > 0 && ( // Only render editor card if steps exist
        <Card style={styles.editorCard} mode="outlined">
          <Card.Title
            title={`Editing Step ${activeStepIndex + 1}`}
            right={(props) => (
              <IconButton
                {...props}
                icon="delete"
                onPress={() => removeStep(activeStepIndex)}
                iconColor={colors.error}
              />
            )}
          />
          <Card.Content>
            <ServiceStepEditor
              control={control}
              errors={errors}
              stepIndex={activeStepIndex}
            />
          </Card.Content>
        </Card>
      )}
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

// Reusing styles
const styles = StyleSheet.create({
  container: { gap: 15 },
  tabsScrollView: { flexGrow: 0, marginBottom: 10 },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  tabButton: { marginRight: 8 },
  editorCard: {},
});
