import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text, Icon, useTheme } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string; // Material Community Icon name
  color?: string; // Optional background color override
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  const theme = useAppTheme(); // Use AppTheme hook
  const cardColor = color || theme.colors.secondaryContainer; // Default color
  const textColor = theme.colors.onSecondaryContainer; // Or dynamically choose based on cardColor

  return (
    <Card
      style={[styles.card, { backgroundColor: cardColor }]}
      mode="contained"
    >
      <Card.Content style={styles.content}>
        <Icon source={icon} size={32} color={textColor} />
        <Text
          variant="titleMedium"
          style={[styles.title, { color: textColor }]}
        >
          {title}
        </Text>
        <Text
          variant="displayMedium"
          style={[styles.value, { color: textColor }]}
        >
          {value}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, // Allow cards to grow in a row/grid
    minHeight: 120, // Ensure decent height
  },
  content: {
    alignItems: "center", // Center content
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8, // Space between elements
  },
  title: {
    textAlign: "center",
  },
  value: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
