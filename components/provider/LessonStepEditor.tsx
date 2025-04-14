import React from "react";
import { View, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextInput, HelperText, Text } from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
// Optional: Import RenderHTML if adding preview here
// import RenderHTML from 'react-native-render-html';
// import { useWindowDimensions } from 'react-native';

interface StepData {
  steps: {
    title: string;
    content: string;
  }[];
}

interface LessonStepEditorProps {
  control: Control<any>;
  errors: FieldErrors<StepData>;
  index: number; // The index of the step being edited
}

export function LessonStepEditor({
  control,
  errors,
  index,
}: LessonStepEditorProps) {
  const { colors } = useAppTheme();
  // Optional: For preview
  // const { width } = useWindowDimensions();
  // const watchedContent = watch(`steps.${index}.content`); // Need watch from parent

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={`steps.${index}.title`}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={`Step ${index + 1} Title*`}
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.steps?.[index]?.title}
            style={styles.input}
          />
        )}
      />
      {errors.steps?.[index]?.title && (
        <HelperText type="error" visible={!!errors.steps?.[index]?.title}>
          {errors.steps?.[index]?.title?.message}
        </HelperText>
      )}

      <Controller
        control={control}
        name={`steps.${index}.content`}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={`Step ${index + 1} Content*`}
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.steps?.[index]?.content}
            style={[styles.input, styles.contentInput]}
            multiline
            placeholder="Write step content here. Basic markdown might be supported in display."
          />
        )}
      />
      {errors.steps?.[index]?.content && (
        <HelperText type="error" visible={!!errors.steps?.[index]?.content}>
          {errors.steps?.[index]?.content?.message}
        </HelperText>
      )}

      {/* Optional Preview Area
             <View style={styles.previewArea}>
                 <Text variant="labelLarge">Preview:</Text>
                 <Card mode="outlined" style={styles.previewCard}>
                     <Card.Content>
                         <RenderHTML contentWidth={width - 80} source={{ html: watchedContent || "<p>Start typing...</p>" }} />
                     </Card.Content>
                 </Card>
             </View>
             */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10, paddingVertical: 10 },
  input: {},
  contentInput: { minHeight: 200, textAlignVertical: "top" },
  previewArea: { marginTop: 15 },
  previewCard: { marginTop: 5, minHeight: 100 },
});
