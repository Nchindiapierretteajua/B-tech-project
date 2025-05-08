import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useRouter, Link } from "expo-router"; // Use Expo Router imports
import type { RootState } from "@/lib/store"; // Adjust path
import {
  Text,
  Card,
  Button,
  Avatar,
  List,
  Chip,
  ActivityIndicator,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout";
import { CategoryCard } from "@/components/learn/CategoryCard";
import { FeaturedLessonCard } from "@/components/learn/FeaturedLessonCard";
import { FeaturedQuizCard } from "@/components/learn/FeaturedQuizCard";

// --- Mock Data (Replace with API/Redux fetch) ---
export const MOCK_CATEGORIES = [
  {
    id: "citizenship",
    title: "Citizenship & Rights",
    description: "Learn about your rights and responsibilities...",
    icon: "🏛️",
    colorScheme: "blue",
    lessons: 5,
    quizzes: 2,
  },
  {
    id: "documentation",
    title: "Documentation & ID",
    description:
      "Understand the process of obtaining various official documents...",
    icon: "📄",
    colorScheme: "green",
    lessons: 4,
    quizzes: 3,
  },
  {
    id: "taxes",
    title: "Taxes & Finance",
    description: "Learn about tax obligations, financial services...",
    icon: "💰",
    colorScheme: "yellow",
    lessons: 3,
    quizzes: 2,
  },
  {
    id: "health",
    title: "Healthcare System",
    description: "Navigate the healthcare system and understand...",
    icon: "🏥",
    colorScheme: "red",
    lessons: 4,
    quizzes: 1,
  },
  {
    id: "education",
    title: "Education System",
    description: "Learn about the education system, scholarships...",
    icon: "🎓",
    colorScheme: "purple",
    lessons: 3,
    quizzes: 2,
  },
  {
    id: "legal",
    title: "Legal System",
    description: "Understand the legal system, courts, and legal processes...",
    icon: "⚖️",
    colorScheme: "cyan",
    lessons: 5,
    quizzes: 3,
  },
];

export const MOCK_FEATURED_LESSONS = [
  {
    id: "national-id",
    title: "How to Apply for a National ID Card",
    category: "documentation",
    difficulty: "Beginner",
    duration: "15 min",
    type: "lesson",
  },
  {
    id: "tax-registration",
    title: "Tax Registration Process",
    category: "taxes",
    difficulty: "Intermediate",
    duration: "20 min",
    type: "lesson",
  },
  {
    id: "voting-rights",
    title: "Understanding Your Voting Rights",
    category: "citizenship",
    difficulty: "Beginner",
    duration: "10 min",
    type: "lesson",
  },
];

export const MOCK_FEATURED_QUIZZES = [
  {
    id: "citizenship-rights",
    title: "Citizenship Rights Quiz",
    description: "Test your knowledge about citizen rights...",
    questionsCount: 10,
  },
  {
    id: "documentation-procedures",
    title: "Documentation Procedures Quiz",
    description: "Test your knowledge about official document...",
    questionsCount: 8,
  },
];

export default function LearnScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // --- Auth Check ---
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     // router.replace("/(auth)"); // Use replace to prevent going back to this screen
  //   }
  // }, [isAuthenticated, router]);

  // // TODO: Add loading state if fetching data
  const isLoading = false; // Replace with actual loading state

  // if (!isAuthenticated || !user) {
  //   // Render loading indicator or null while redirecting
  //   return (
  //     <SafeAreaView style={styles.safeArea}>
  //       <View style={styles.centered}>
  //         <ActivityIndicator />
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  // --- Navigation Handlers ---
  const handleCategoryPress = (categoryId: string) => {
    // Navigate to the lessons list screen, filtering by this category
    // router.push({ pathname: '/learn/lessons', params: { category: categoryId } });
  };
  const handleLessonPress = (lessonId: string) => {
    router.push(`/(pubcam)/learn/lesson/${lessonId}`);
  };
  const handleQuizPress = (quizId: string) => {
    router.push(`/(pubcam)/learn/quiz/${quizId}`);
  };
  const viewAllLessons = () => router.push("/(pubcam)/learn/lesson");
  const viewAllQuizzes = () => router.push("/(pubcam)/learn/quiz");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Hero Section */}
        <Card style={styles.heroCard} mode="contained">
          <Card.Content>
            <Text variant="headlineMedium" style={styles.heroTitle}>
              Learn About Public Services
            </Text>
            <Text variant="titleMedium" style={styles.heroSubtitle}>
              Enhance your knowledge about government processes and earn
              rewards.
            </Text>
            <View style={styles.heroStats}>
              <Chip icon="book-open-variant" selected>
                24 Lessons
              </Chip>
              <Chip icon="head-question-outline" selected>
                13 Quizzes
              </Chip>
              {/* <Chip icon="trophy-award" selected>
                10 Badges
              </Chip> */}
            </View>
          </Card.Content>
        </Card>

        {/* Categories Section */}
        {/* <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Explore Categories
          </Text>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={MOCK_CATEGORIES}
              renderItem={({ item }) => (
                <View style={styles.categoryItemContainer}>
                  <CategoryCard
                    category={item}
                    onPress={() => handleCategoryPress(item.id)}
                  />
                </View>
              )}
              keyExtractor={(item) => item.id}
              numColumns={2} // Adjust columns based on screen size if needed
              columnWrapperStyle={styles.categoryRow}
            />
          )}
        </View> */}

        {/* Featured Lessons Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="headlineSmall" style={styles.sectionTitle}>
              Featured Lessons
            </Text>
            <Button mode="contained-tonal" compact onPress={viewAllLessons}>
              View All
            </Button>
          </View>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={MOCK_FEATURED_LESSONS}
              renderItem={({ item }) => (
                <FeaturedLessonCard
                  lesson={item}
                  onPress={() => handleLessonPress(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          )}
        </View>

        {/* Quizzes Section */}
        <View style={styles.section}>
          <Card style={styles.quizSectionCard} mode="contained">
            <Card.Content>
              <View style={styles.sectionHeader}>
                <View>
                  <Text variant="headlineSmall" style={styles.quizSectionTitle}>
                    Test Your Knowledge
                  </Text>
                  <Text variant="bodyLarge">Take quizzes and earn badges.</Text>
                </View>
                <Button mode="contained-tonal" compact onPress={viewAllQuizzes}>
                  View All
                </Button>
              </View>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                // <View style={styles.featuredQuizzesContainer}>
                //   {MOCK_FEATURED_QUIZZES.map((quiz) => (
                //     <FeaturedQuizCard
                //       key={quiz.id}
                //       quiz={quiz}
                //       onPress={() => handleQuizPress(quiz.id)}
                //     />
                //   ))}
                // </View>
                <FlatList
                  data={MOCK_FEATURED_QUIZZES}
                  renderItem={({ item }) => (
                    <FeaturedQuizCard
                      // lesson={item}
                      quiz={item}
                      onPress={() => handleQuizPress(item.id)}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                />
              )}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { paddingBottom: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  heroCard: { margin: 16, backgroundColor: "#60A5FA" }, // Blue-400 approx
  heroTitle: { color: "white", fontWeight: "bold", marginBottom: 8 },
  heroSubtitle: { color: "white", marginBottom: 16 },
  heroStats: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  section: { marginBottom: 24, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontWeight: "bold" },
  categoryItemContainer: { flex: 0.5, padding: 6 }, // For 2 columns

  categoryRow: { justifyContent: "space-between" },

  horizontalList: { paddingVertical: 4 },

  quizSectionCard: { backgroundColor: "#E9D5FF" }, // Purple-100 approx
  quizSectionTitle: { fontWeight: "bold", marginBottom: 4 },
  featuredQuizzesContainer: { marginTop: 16, gap: 12 },
});
