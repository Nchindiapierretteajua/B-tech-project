import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Chip, Button, Icon } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/app/_layout";

// Define the expected data structure for a quiz summary
interface QuizSummary {
  id: string;
  title: string;
  categoryName: string;
  difficulty: string;
  questions: number; // Renamed from questionsCount for clarity
  description: string;
  completed: boolean;
  score: number | null;
}

interface QuizCardProps {
  quiz: QuizSummary;
}

export function QuizCard({ quiz }: QuizCardProps) {
  const router = useRouter();
  const { colors } = useAppTheme();

  const handlePress = () => {
    router.push(`/(pubcam)/learn/quiz/${quiz.id}`);
  };

  return (
    <Card style={styles.card} mode="elevated" onPress={handlePress}>
      <Card.Content>
        {/* Optional: Display completion status prominently */}
        {quiz.completed && (
          <Chip
            icon={() => (
              <Icon source="check-decagram" size={16} color={colors.primary} />
            )}
            style={[
              styles.statusChip,
              { backgroundColor: colors.primaryContainer },
            ]}
            textStyle={{ color: colors.onPrimaryContainer }}
          >
            Completed: {quiz.score}%
          </Chip>
        )}

        <Text variant="titleLarge" style={styles.title} numberOfLines={2}>
          {quiz.title}
        </Text>
        <Text variant="bodyMedium" style={styles.description} numberOfLines={3}>
          {quiz.description}
        </Text>

        <View style={styles.metaRow}>
          <Chip icon="school-outline" compact>
            {quiz.difficulty}
          </Chip>
          <Chip icon="help-circle-outline" compact>
            {quiz.questions} Questions
          </Chip>
        </View>
        <Chip icon="tag-outline" style={styles.categoryChip} mode="outlined">
          {quiz.categoryName}
        </Chip>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={handlePress}
          icon={
            quiz.completed
              ? "arrow-right-circle-outline"
              : "play-circle-outline"
          } // Different icon if completed?
        >
          {quiz.completed ? "View Results / Retake" : "Take Quiz"}
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  statusChip: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1, // Ensure it's above other content if needed
  },
  title: {
    marginBottom: 8,
    fontWeight: "bold",
    lineHeight: 26, // Adjust for better spacing
    marginTop: 5, // Add margin if status chip is present
  },
  description: {
    marginBottom: 12,
    minHeight: 60, // Approx 3 lines
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  categoryChip: {
    alignSelf: "flex-start", // Keep category chip distinct
    marginTop: 4,
  },
});
