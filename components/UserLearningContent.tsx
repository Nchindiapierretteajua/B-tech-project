import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import type { RootState } from "@/lib/store"; // Adjust path
import {
  Text,
  Card,
  List,
  Avatar,
  Chip,
  Divider,
  Button,
  ProgressBar,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import {
  MOCK_BADGES_DB,
  MOCK_LESSON_TITLES,
  MOCK_QUIZ_TITLES,
  mockUserLearning,
} from "@/lib/mock-data";

// --- Import or define Mock Data/Types ---
// Using the mock data defined above for demonstration
// In a real app, select this data from Redux state or fetch it
const userProgress = mockUserLearning;
const allBadges = MOCK_BADGES_DB;
const allLessonTitles = MOCK_LESSON_TITLES;
const allQuizTitles = MOCK_QUIZ_TITLES;
// --- ---

export function UserLearningContent() {
  const { colors } = useAppTheme();
  const router = useRouter();
  // TODO: Replace mockUserProgress with actual data from Redux/API
  // const userProgress = useSelector((state: RootState) => state.userLearning);

  const navigateToLearn = () => router.push("/learn");

  const earnedBadges = userProgress.earnedBadgeIds
    .map((id) => allBadges[id])
    .filter((badge) => !!badge); // Filter out any badges not found in our DB

  const completedLessons = userProgress.completedLessonIds
    .map((id) => ({ id, title: allLessonTitles[id] || `Lesson ID: ${id}` })) // Get title or show ID
    .filter((lesson) => !!lesson.title);

  const completedQuizzes = Object.entries(userProgress.completedQuizzes)
    .map(([id, score]) => ({
      id,
      score,
      title: allQuizTitles[id] || `Quiz ID: ${id}`,
    }))
    .filter((quiz) => !!quiz.title);

  // Example overall progress calculation (replace with real logic)
  const totalLessonsAvailable = Object.keys(allLessonTitles).length;
  const lessonProgress =
    totalLessonsAvailable > 0
      ? userProgress.completedLessonIds.length / totalLessonsAvailable
      : 0;

  return (
    <ScrollView style={styles.container}>
      {/* --- Stats Summary Card --- */}
      <Card style={styles.card} mode="elevated">
        <Card.Title title="Learning Summary" titleVariant="titleLarge" />
        <Card.Content style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Avatar.Icon
              size={48}
              icon="star-circle"
              style={{ backgroundColor: colors.primaryContainer }}
              color={colors.primary}
            />
            <Text variant="headlineSmall">{userProgress.totalPoints || 0}</Text>
            <Text variant="bodyMedium">Points Earned</Text>
          </View>
          <View style={styles.statItem}>
            <Avatar.Icon
              size={48}
              icon="trophy-variant"
              style={{ backgroundColor: colors.tertiaryContainer }}
              color={colors.tertiary}
            />
            <Text variant="headlineSmall">{earnedBadges.length || 0}</Text>
            <Text variant="bodyMedium">Badges Unlocked</Text>
          </View>
          <View style={styles.statItemFull}>
            <Text variant="labelLarge" style={{ marginBottom: 5 }}>
              Lesson Progress ({userProgress.completedLessonIds.length}/
              {totalLessonsAvailable})
            </Text>
            <ProgressBar
              progress={lessonProgress}
              color={colors.primary}
              style={styles.progressBar}
            />
          </View>
        </Card.Content>
      </Card>

      {/* --- Earned Badges Section --- */}
      <Card style={styles.card} mode="outlined">
        <Card.Title title="My Badges" titleVariant="titleLarge" />
        <Card.Content>
          {earnedBadges.length > 0 ? (
            <View style={styles.badgeGrid}>
              {earnedBadges.map((badge) => (
                <View key={badge.id} style={styles.badgeItem}>
                  <Avatar.Text
                    size={56}
                    label={badge.icon}
                    style={{ backgroundColor: colors.surfaceVariant }}
                  />
                  <Text
                    variant="labelMedium"
                    style={styles.badgeName}
                    numberOfLines={1}
                  >
                    {badge.name}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              No badges earned yet. Keep learning!
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* --- Completed Lessons Section --- */}
      <Card style={styles.card} mode="outlined">
        <Card.Title title="Completed Lessons" titleVariant="titleLarge" />
        <Card.Content>
          {completedLessons.length > 0 ? (
            <List.Section style={styles.listSection}>
              {completedLessons.map((lesson, index) => (
                <React.Fragment key={lesson.id}>
                  <List.Item
                    title={lesson.title}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon="check-circle"
                        color={colors.primary}
                      />
                    )}
                    onPress={() => router.push(`/learn/lesson/${lesson.id}`)} // Link to lesson
                    titleNumberOfLines={2}
                  />
                  {index < completedLessons.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List.Section>
          ) : (
            <Text style={styles.emptyText}>No lessons completed yet.</Text>
          )}
          <Button
            mode="contained-tonal"
            onPress={navigateToLearn}
            style={styles.actionButton}
          >
            Find Lessons
          </Button>
        </Card.Content>
      </Card>

      {/* --- Completed Quizzes Section --- */}
      <Card style={styles.card} mode="outlined">
        <Card.Title title="Completed Quizzes" titleVariant="titleLarge" />
        <Card.Content>
          {completedQuizzes.length > 0 ? (
            <List.Section style={styles.listSection}>
              {completedQuizzes.map((quiz, index) => (
                <React.Fragment key={quiz.id}>
                  <List.Item
                    title={quiz.title}
                    description={`Score: ${quiz.score}%`}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon={
                          quiz.score >= 70 ? "check-decagram" : "close-octagon"
                        }
                        color={quiz.score >= 70 ? colors.primary : colors.error}
                      />
                    )} // Assuming 70% passing
                    onPress={() => router.push(`/learn/quiz/${quiz.id}`)} // Link to quiz (maybe results?)
                    titleNumberOfLines={2}
                  />
                  {index < completedQuizzes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List.Section>
          ) : (
            <Text style={styles.emptyText}>No quizzes completed yet.</Text>
          )}
          <Button
            mode="contained-tonal"
            onPress={() => router.push("/(pubcam)/learn/quiz")}
            style={styles.actionButton}
          >
            Find Quizzes
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { marginBottom: 16 },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    gap: 15,
  },
  statItem: {
    alignItems: "center",
    minWidth: 120, // Ensure items don't get too squished
  },
  statItemFull: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    width: "90%",
    borderRadius: 4,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // Center badges if they don't fill row
    gap: 20,
    paddingVertical: 10,
  },
  badgeItem: {
    alignItems: "center",
    width: 80, // Fixed width for grid item
  },
  badgeName: {
    marginTop: 4,
    textAlign: "center",
  },
  listSection: {
    marginTop: 0, // Remove default top margin
    paddingTop: 0,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 15,
    color: "grey",
  },
  actionButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
});
