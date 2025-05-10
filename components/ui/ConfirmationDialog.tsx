import React from "react";
import { View } from "react-native";
import { Dialog, Button, Text, Portal } from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

interface ConfirmationDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
}

export function ConfirmationDialog({
  visible,
  onDismiss,
  onConfirm,
  title,
  content,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor,
}: ConfirmationDialogProps) {
  const { colors } = useAppTheme();
  const finalConfirmColor = confirmColor || colors.primary;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{content}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={colors.onSurfaceVariant}>
            {cancelText}
          </Button>
          <Button
            onPress={onConfirm}
            buttonColor={finalConfirmColor}
            textColor={colors.onPrimary}
          >
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
