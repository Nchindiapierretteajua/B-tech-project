import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Control,
  Controller,
  FieldErrors,
  useFieldArray,
  UseFieldArrayReturn,
} from "react-hook-form";
import { TextInput, HelperText, Text, Divider } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";
import { DynamicArrayInput } from "./DynamicArrayInput";

interface ServiceStepEditorProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  stepIndex: number;
}

export function ServiceStepEditor({
  control,
  errors,
  stepIndex,
}: ServiceStepEditorProps) {
  const { colors } = useAppTheme();
  const stepFieldName = `steps.${stepIndex}` as const;

  // Field array for Tips WITHIN this step
  const tipsFieldArray = useFieldArray({
    control,
    name: `${stepFieldName}.tips`,
  });

  // Field array for Documents WITHIN this step
  const docsFieldArray = useFieldArray({
    control,
    name: `${stepFieldName}.documents`,
  });

  return (
    <View style={styles.container}>
      {/* Step Title */}
      <Controller
        control={control}
        name={`${stepFieldName}.title`}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={`Step ${stepIndex + 1} Title*`}
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.steps?.[stepIndex]?.title}
            style={styles.input}
          />
        )}
      />
      {errors.steps?.[stepIndex]?.title && (
        <HelperText type="error">
          {errors.steps?.[stepIndex]?.title?.message as string}
        </HelperText>
      )}

      {/* Step Description */}
      <Controller
        control={control}
        name={`${stepFieldName}.description`}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={`Step ${stepIndex + 1} Description*`}
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.steps?.[stepIndex]?.description}
            style={styles.input}
            multiline
            numberOfLines={3}
          />
        )}
      />
      {errors.steps?.[stepIndex]?.description && (
        <HelperText type="error">
          {errors.steps?.[stepIndex]?.description?.message as string}
        </HelperText>
      )}

      <Divider style={styles.divider} />

      {/* Tips Section */}
      <View>
        <Text variant="titleMedium">Tips (Optional)</Text>
        <DynamicArrayInput
          control={control}
          errors={errors}
          fieldArray={tipsFieldArray}
          fieldName={`${stepFieldName}.tips`}
          label="Tip"
          placeholder="e.g., Bring original documents"
          addLabel="Add Tip"
        />
      </View>

      <Divider style={styles.divider} />

      {/* Documents Section */}
      <View>
        <Text variant="titleMedium">Required Documents (Optional)</Text>
        <DynamicArrayInput
          control={control}
          errors={errors}
          fieldArray={docsFieldArray}
          fieldName={`${stepFieldName}.documents`}
          label="Document"
          placeholder="e.g., Photo ID"
          addLabel="Add Document"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 15, paddingVertical: 10 },
  input: {},
  divider: { marginVertical: 15 },
});
