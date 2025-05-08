import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Control,
  Controller,
  FieldErrors,
  UseFieldArrayReturn,
  useFieldArray,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import {
  TextInput,
  HelperText,
  Text,
  RadioButton,
  Button,
} from "react-native-paper";
import { QuizOptionInput } from "./QuizOptionInput"; // Import option component
import { useAppTheme } from "@/app/_layout"; // Corrected import path

interface QuizQuestionEditorProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  questionIndex: number;
  watch: UseFormWatch<any>; // To watch options array for rendering
  setValue: UseFormSetValue<any>; // To set correct answer
}

export function QuizQuestionEditor({
  control,
  errors,
  questionIndex,
  watch,
  setValue,
}: QuizQuestionEditorProps) {
  const { colors } = useAppTheme();
  const questionFieldName = `questions.${questionIndex}` as const;

  const {
    fields: optionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `${questionFieldName}.options`,
  });

  const addOption = () => {
    // Limit number of options if desired (e.g., max 6)
    if (optionFields.length < 6) {
      append("");
    }
  };

  const removeOption = (index: number) => {
    if (optionFields.length > 2) {
      // Ensure at least 2 options remain
      remove(index);
      // Reset correct answer if the removed option was the correct one
      const currentCorrect = watch(`${questionFieldName}.correctAnswer`);
      if (currentCorrect === index) {
        setValue(`${questionFieldName}.correctAnswer`, 0); // Default to first option
      } else if (currentCorrect > index) {
        setValue(`${questionFieldName}.correctAnswer`, currentCorrect - 1); // Adjust index
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Question Input */}
      <Controller
        control={control}
        name={`${questionFieldName}.question`}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Question*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.questions?.[questionIndex]?.question}
            style={styles.input}
            multiline
          />
        )}
      />
      {errors.questions?.[questionIndex]?.question && (
        <HelperText type="error">
          {errors.questions?.[questionIndex]?.question?.message as string}
        </HelperText>
      )}

      {/* Options Management */}
      <Text variant="labelLarge" style={styles.label}>
        Answer Options*
      </Text>
      <View style={styles.optionsList}>
        {optionFields.map((option, index) => (
          <QuizOptionInput
            key={option.id}
            control={control}
            errors={errors}
            questionIndex={questionIndex}
            optionIndex={index}
            onRemove={() => removeOption(index)}
            canRemove={optionFields.length > 2} // Can remove if more than 2 exist
          />
        ))}
        {errors.questions?.[questionIndex]?.options && (
          <HelperText type="error">
            {errors.questions?.[questionIndex]?.options?.message ||
              (errors.questions?.[questionIndex]?.options?.root
                ?.message as string)}
          </HelperText>
        )}
      </View>
      {optionFields.length < 6 && (
        <Button
          icon="plus"
          mode="outlined"
          onPress={addOption}
          style={styles.addOptionButton}
        >
          Add Option
        </Button>
      )}

      {/* Correct Answer Selection */}
      <Text variant="labelLarge" style={styles.label}>
        Correct Answer*
      </Text>
      <Controller
        control={control}
        name={`${questionFieldName}.correctAnswer`}
        render={({ field: { onChange, value } }) => (
          <RadioButton.Group
            onValueChange={(val) => onChange(parseInt(val))}
            value={String(value ?? "0")}
          >
            <View style={styles.correctAnswerContainer}>
              {optionFields.map((option, index) => (
                <View key={`correct-${option.id}`} style={styles.radioOption}>
                  <RadioButton value={String(index)} />
                  <Text>{String.fromCharCode(65 + index)}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        )}
      />
      {errors.questions?.[questionIndex]?.correctAnswer && (
        <HelperText type="error">
          {errors.questions?.[questionIndex]?.correctAnswer?.message as string}
        </HelperText>
      )}

      {/* Explanation Input */}
      <Controller
        control={control}
        name={`${questionFieldName}.explanation`}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Explanation*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.questions?.[questionIndex]?.explanation}
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Explain why the answer is correct..."
          />
        )}
      />
      {errors.questions?.[questionIndex]?.explanation && (
        <HelperText type="error">
          {errors.questions?.[questionIndex]?.explanation?.message as string}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10, paddingVertical: 10 },
  input: {},
  label: { marginBottom: 5, marginTop: 10, fontWeight: "bold" },
  optionsList: { gap: 0 }, // Let QuizOptionInput handle its margin
  addOptionButton: { alignSelf: "flex-start", marginTop: 5 },
  correctAnswerContainer: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  radioOption: { flexDirection: "row", alignItems: "center", marginRight: 10 },
});
