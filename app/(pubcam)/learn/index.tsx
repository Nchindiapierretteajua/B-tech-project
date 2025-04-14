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

// --- Mock Data (Replace with API/Redux fetch) ---
const MOCK_CATEGORIES = [
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

const MOCK_FEATURED_LESSONS = [
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

const MOCK_FEATURED_QUIZZES = [
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
// --- End Mock Data ---

// --- Reusable Components ---
interface CategoryCardProps {
  category: (typeof MOCK_CATEGORIES)[0];
  onPress: () => void;
}
const CategoryCard = ({ category, onPress }: CategoryCardProps) => {
  const {
    colors: {
      primaryContainer,
      secondaryContainer,
      errorContainer,
      tertiaryContainer,
    },
  } = useAppTheme();
  // Basic color mapping (adapt as needed)
  const getBackgroundColor = (colorScheme: string | undefined) => {
    switch (colorScheme) {
      case "blue":
        return primaryContainer;
      case "green":
        return tertiaryContainer;
      case "yellow":
        return "#FEF9C3"; // Lighter Yellow
      case "red":
        return errorContainer;
      case "purple":
        return "#F3E8FF"; // Lighter Purple
      case "cyan":
        return "#CFFAFE"; // Lighter Cyan
      default:
        return secondaryContainer;
    }
  };

  return (
    <Card
      style={[
        styles.categoryCard,
        { backgroundColor: getBackgroundColor(category.colorScheme) },
      ]}
      onPress={onPress}
      mode="contained"
    >
      <Card.Content>
        <Avatar.Text
          size={48}
          label={category.icon}
          style={styles.categoryIcon}
        />
        <Text
          variant="titleLarge"
          style={styles.categoryTitle}
          numberOfLines={2}
        >
          {category.title}
        </Text>
        <Text
          variant="bodyMedium"
          style={styles.categoryDescription}
          numberOfLines={3}
        >
          {category.description}
        </Text>
        <View style={styles.categoryMeta}>
          <Chip icon="book-open-variant" compact>
            {category.lessons} Lessons
          </Chip>
          <Chip icon="head-question-outline" compact>
            {category.quizzes} Quizzes
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );
};

interface FeaturedLessonCardProps {
  lesson: (typeof MOCK_FEATURED_LESSONS)[0];
  onPress: () => void;
}
const FeaturedLessonCard = ({ lesson, onPress }: FeaturedLessonCardProps) => (
  <Card style={styles.featuredCard} mode="outlined" onPress={onPress}>
    <Card.Title
      title={lesson.title}
      subtitle={`${lesson.difficulty} · ${lesson.duration}`}
      left={(props) => <List.Icon {...props} icon="book-open-variant" />}
      titleNumberOfLines={2}
    />
    <Card.Actions>
      <Button onPress={onPress}>Start Lesson</Button>
    </Card.Actions>
  </Card>
);

interface FeaturedQuizCardProps {
  quiz: (typeof MOCK_FEATURED_QUIZZES)[0];
  onPress: () => void;
}
const FeaturedQuizCard = ({ quiz, onPress }: FeaturedQuizCardProps) => (
  <Card style={styles.featuredCard} mode="outlined" onPress={onPress}>
    <Card.Title
      title={quiz.title}
      subtitle={`${quiz.questionsCount} Questions`}
      left={(props) => <List.Icon {...props} icon="head-question-outline" />}
      titleNumberOfLines={2}
    />
    <Card.Actions>
      <Button onPress={onPress}>Take Quiz</Button>
    </Card.Actions>
  </Card>
);
// --- End Reusable Components ---

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
    router.push(`/learn/lesson/${lessonId}`);
  };
  const handleQuizPress = (quizId: string) => {
    router.push(`/learn/quiz/${quizId}`);
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
              <Chip icon="trophy-award" selected>
                10 Badges
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Categories Section */}
        <View style={styles.section}>
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
        </View>

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
                <View style={styles.featuredQuizzesContainer}>
                  {MOCK_FEATURED_QUIZZES.map((quiz) => (
                    <FeaturedQuizCard
                      key={quiz.id}
                      quiz={quiz}
                      onPress={() => handleQuizPress(quiz.id)}
                    />
                  ))}
                </View>
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
  categoryCard: { height: "100%" }, // Make cards in a row equal height (may need tweaking)
  categoryIcon: {
    alignSelf: "center",
    marginBottom: 12,
    backgroundColor: "white",
  },
  categoryTitle: { fontWeight: "bold", marginBottom: 4, textAlign: "center" },
  categoryDescription: { marginBottom: 10, textAlign: "center", minHeight: 60 },
  categoryMeta: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "auto",
    paddingTop: 10,
  },
  horizontalList: { paddingVertical: 4 },
  featuredCard: { width: 300, marginRight: 12 }, // Fixed width for horizontal scroll
  quizSectionCard: { backgroundColor: "#E9D5FF" }, // Purple-100 approx
  quizSectionTitle: { fontWeight: "bold", marginBottom: 4 },
  featuredQuizzesContainer: { marginTop: 16, gap: 12 },
});
