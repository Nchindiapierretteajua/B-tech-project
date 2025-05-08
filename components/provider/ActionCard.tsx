import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text, Avatar, Button } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";

interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  buttonText: string;
  onPress: () => void;
  iconBackgroundColor?: string; // Optional background for the icon
}

export function ActionCard({
  title,
  description,
  icon,
  buttonText,
  onPress,
  iconBackgroundColor,
}: ActionCardProps) {
  const { colors } = useAppTheme();
  const bg = iconBackgroundColor || colors.primaryContainer;

  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Card.Title
        title={title}
        titleVariant="titleLarge"
        left={(props) => (
          <Avatar.Icon {...props} icon={icon} style={{ backgroundColor: bg }} />
        )}
        titleStyle={styles.title}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={styles.description}>
          {description}
        </Text>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button onPress={onPress} mode="contained">
          {buttonText}
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    // flex: 1, // Allow cards to take space in grid/row
    width: "100%",
  },
  title: {
    fontWeight: "bold",
  },
  description: {
    marginBottom: 10,
    minHeight: 40, // Ensure roughly 2 lines space
  },
  actions: {
    justifyContent: "flex-end",
  },
});
