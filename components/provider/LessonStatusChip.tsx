import React from "react";
import { Chip } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";

interface LessonStatusChipProps {
  status: "Published" | "Draft" | string; // Allow other potential statuses
}

export function LessonStatusChip({ status }: LessonStatusChipProps) {
  const { colors } = useAppTheme();

  const chipStyle = () => {
    switch (status) {
      case "Published":
        return {
          backgroundColor: colors.primaryContainer,
          textColor: colors.onPrimaryContainer,
        };
      case "Draft":
        return {
          backgroundColor: colors.secondaryContainer,
          textColor: colors.onSecondaryContainer,
        };
      default:
        return {
          backgroundColor: colors.surfaceVariant,
          textColor: colors.onSurfaceVariant,
        };
    }
  };

  const { backgroundColor, textColor } = chipStyle();

  return (
    <Chip
      style={{ backgroundColor }}
      textStyle={{ color: textColor, fontWeight: "bold" }}
      mode="flat" // Flat looks cleaner in tables
      compact // Make chip smaller
    >
      {status}
    </Chip>
  );
}
