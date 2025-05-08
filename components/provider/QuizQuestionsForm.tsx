import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Control,
  FieldErrors,
  UseFieldArrayReturn,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Button, Text, Card, IconButton, HelperText } from "react-native-paper";
import { QuizQuestionEditor } from "./QuizQuestionEditor";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

interface QuizQuestionsFormProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  fieldArray: UseFieldArrayReturn<any, "questions", "id">; // Adjust field name if needed
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export function QuizQuestionsForm({
  control,
  errors,
  fieldArray,
  watch,
  setValue,
}: QuizQuestionsFormProps) {
  const { colors } = useAppTheme();
  const { fields, append, remove } = fieldArray;
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const addQuestion = () => {
    append({
      question: "",
      options: ["", ""],
      correctAnswer: 0,
      explanation: "",
    });
    setActiveQuestionIndex(fields.length); // Activate the new question
  };

  const removeQuestion = (index: number) => {
    if (fields.length <= 1) return;
    remove(index);
    setActiveQuestionIndex((prev) => Math.min(prev, fields.length - 2));
  };

  return (
    <View style={styles.container}>
      {/* Question Tabs/Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScrollView}
      >
        <View style={styles.tabsContainer}>
          {fields.map((field, index) => (
            <Button
              key={field.id}
              mode={activeQuestionIndex === index ? "contained" : "outlined"}
              onPress={() => setActiveQuestionIndex(index)}
              style={styles.tabButton}
              compact
            >
              Q{index + 1}
            </Button>
          ))}
          <Button
            mode="contained-tonal"
            icon="plus"
            onPress={addQuestion}
            style={styles.tabButton}
            compact
          >
            Add Question
          </Button>
        </View>
      </ScrollView>

      {/* Active Question Editor */}
      <Card style={styles.editorCard} mode="outlined">
        <Card.Title
          title={`Editing Question ${activeQuestionIndex + 1}`}
          right={(props) =>
            fields.length > 1 ? (
              <IconButton
                {...props}
                icon="delete"
                onPress={() => removeQuestion(activeQuestionIndex)}
                iconColor={colors.error}
              />
            ) : null
          }
        />
        <Card.Content>
          <QuizQuestionEditor
            control={control}
            errors={errors}
            questionIndex={activeQuestionIndex}
            watch={watch}
            setValue={setValue}
          />
        </Card.Content>
      </Card>
      {errors.questions && typeof errors.questions === "string" && (
        <HelperText type="error" visible={true}>
          {errors.questions.message}
        </HelperText>
      )}
      {errors.questions?.root && (
        <HelperText type="error" visible={true}>
          {errors.questions.root.message}
        </HelperText>
      )}
    </View>
  );
}

// Reusing styles from LessonStepsForm
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
