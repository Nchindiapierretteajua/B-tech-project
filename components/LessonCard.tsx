import { router } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Chip, Button } from "react-native-paper";

// Assuming LessonSummary type is defined (subset of full lesson)
interface LessonSummary {
  id: string;
  title: string;
  categoryName: string;
  difficulty: string;
  duration: string;
  description: string;
}

interface LessonCardProps {
  lesson: LessonSummary;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const handleStartLesson = () => {
    router.push(`/(pubcam)/learn/lesson/${lesson.id}`); // Navigate to the lesson details page
  };

  return (
    <Card style={styles.card} mode="elevated" onPress={handleStartLesson}>
      <Card.Content>
        {/* Optional: Add category chip */}
        {/* <Chip icon="tag" mode="outlined" style={styles.categoryChip}>{lesson.categoryName}</Chip> */}
        <Text variant="titleLarge" style={styles.title} numberOfLines={2}>
          {lesson.title}
        </Text>
        <Text variant="bodyMedium" style={styles.description} numberOfLines={3}>
          {lesson.description}
        </Text>
        <View style={styles.metaRow}>
          <Chip icon="school-outline" compact style={styles.chip}>
            {lesson.difficulty}
          </Chip>
          <Chip icon="clock-outline" compact style={styles.chip}>
            {lesson.duration}
          </Chip>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={handleStartLesson}>
          Start Lesson
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12, // Space between cards in the list
  },
  categoryChip: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  title: {
    marginBottom: 8,
    fontWeight: "bold",
    lineHeight: 24,
  },
  description: {
    marginBottom: 12,
    color: "#555",
    minHeight: 60, // Ensure roughly 3 lines space
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Use gap for spacing between chips
    marginBottom: 10,
  },
  chip: {
    // Allow chips to size naturally
  },
});
