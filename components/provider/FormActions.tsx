import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void; // Triggered by form's handleSubmit
  isSubmitting: boolean;
  submitText?: string;
  cancelText?: string;
}

export function FormActions({
  onCancel,
  onSubmit, // Note: RHF handles calling this via handleSubmit
  isSubmitting,
  submitText = "Save Changes",
  cancelText = "Cancel",
}: FormActionsProps) {
  return (
    <View style={styles.actionsContainer}>
      <Button mode="outlined" onPress={onCancel} disabled={isSubmitting}>
        {cancelText}
      </Button>
      <Button
        mode="contained"
        onPress={onSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
        icon="content-save"
      >
        {submitText}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc", // Use theme color
  },
});
