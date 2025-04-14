import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useRouter, Stack } from "expo-router";
import type { RootState } from "@/lib/store"; // Adjust path
import { Text, Card, Button, ActivityIndicator } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";

// Import reusable components
import { QuizCard } from "@/components/QuizCard";
import { QuizFilterModal } from "@/components/QuizFilterModal";
import { FilterControls } from "@/components/FilterControls";
// --- Mock Data ---
const MOCK_ALL_QUIZZES = [
  // Ensure data structure matches QuizSummary interface in QuizCard
  {
    id: "citizenship-rights",
    title: "Citizenship Rights Quiz",
    category: "citizenship",
    categoryName: "Citizenship & Rights",
    difficulty: "Beginner",
    questions: 10,
    description: "Test your knowledge about citizen rights...",
    completed: true,
    score: 80,
  },
  {
    id: "documentation-procedures",
    title: "Documentation Procedures Quiz",
    category: "documentation",
    categoryName: "Documentation & ID",
    difficulty: "Intermediate",
    questions: 8,
    description: "Test your knowledge about official document...",
    completed: false,
    score: null,
  },
  {
    id: "tax-system",
    title: "Tax System Quiz",
    category: "taxes",
    categoryName: "Taxes & Finance",
    difficulty: "Advanced",
    questions: 12,
    description: "Test your understanding of the Cameroonian tax system...",
    completed: false,
    score: null,
  },
  // Add more...
  {
    id: "national-id",
    title: "National ID Card Quiz",
    category: "documentation",
    categoryName: "Documentation & ID",
    difficulty: "Beginner",
    questions: 5,
    description: "Test your knowledge about the National ID...",
    completed: false,
    score: null,
  },
];
const fetchAllQuizzes = async (): Promise<any[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_ALL_QUIZZES;
};
// --- End Mock Data ---

export default function AllQuizzesScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [allQuizzes, setAllQuizzes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    category: string | null;
    difficulty: string | null;
  }>({ category: null, difficulty: null });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // --- Auth Check ---
  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/(auth)");
    }
  }, [isAuthenticated, router]);

  // --- Fetch Quizzes ---
  useEffect(() => {
    const loadQuizzes = async () => {
      setIsLoading(true);
      const data = await fetchAllQuizzes();
      setAllQuizzes(data);
      setIsLoading(false);
    };
    if (isAuthenticated) {
      loadQuizzes();
    }
  }, [isAuthenticated]);

  // --- Filtering ---
  const filteredQuizzes = useMemo(() => {
    /* ... same filtering logic as before ... */
    return allQuizzes.filter((quiz) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchLower ||
        quiz.title.toLowerCase().includes(searchLower) ||
        quiz.description.toLowerCase().includes(searchLower);
      const matchesCategory =
        !filters.category || quiz.category === filters.category;
      const matchesDifficulty =
        !filters.difficulty || quiz.difficulty === filters.difficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [allQuizzes, searchTerm, filters]);

  // --- Prepare filter data ---
  const { categories, difficulties, categoryNames } = useMemo(() => {
    /* ... same logic as before ... */
    const cats = new Set<string>();
    const diffs = new Set<string>();
    const catNames: { [key: string]: string } = {};
    allQuizzes.forEach((quiz) => {
      cats.add(quiz.category);
      diffs.add(quiz.difficulty);
      if (quiz.categoryName) {
        catNames[quiz.category] = quiz.categoryName;
      }
    });
    return {
      categories: Array.from(cats),
      difficulties: Array.from(diffs),
      categoryNames: catNames,
    };
  }, [allQuizzes]);

  // --- Handlers ---
  const openFilterModal = () => setIsFilterModalVisible(true);
  const closeFilterModal = () => setIsFilterModalVisible(false);
  const applyFilters = (newFilters: {
    category: string | null;
    difficulty: string | null;
  }) => setFilters(newFilters);
  const resetAll = () => {
    setSearchTerm("");
    setFilters({ category: null, difficulty: null });
  };

  const renderQuizItem = ({ item }: { item: any }) => <QuizCard quiz={item} />;

  // --- Render ---
  if (!isAuthenticated)
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      {/* Configure header in layout or here */}
      <Stack.Screen options={{ title: "All Quizzes" }} />
      {/* <Header/> If not using layout header */}

      <View style={styles.container}>
        {/* Use the FilterControls component */}
        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFilterPress={openFilterModal}
          searchPlaceholder="Search quizzes..."
        />

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredQuizzes}
            renderItem={renderQuizItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={
              // Optional: Add a header inside the list
              <Text
                variant="headlineSmall"
                style={[styles.listTitle, { color: colors.onBackground }]}
              >
                Available Quizzes ({filteredQuizzes.length})
              </Text>
            }
            ListEmptyComponent={
              <View style={styles.centeredEmpty}>
                <Text style={styles.emptyText}>No quizzes found.</Text>
                <Button onPress={resetAll}>Clear Filters</Button>
              </View>
            }
          />
        )}
      </View>

      <QuizFilterModal
        visible={isFilterModalVisible}
        onDismiss={closeFilterModal}
        applyFilters={applyFilters}
        initialFilters={filters}
        categories={categories}
        difficulties={difficulties}
        categoryNames={categoryNames}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  centeredEmpty: { alignItems: "center", padding: 40 },
  listContainer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },
  listTitle: { fontWeight: "bold", marginBottom: 15 },
  emptyText: { fontSize: 16, marginBottom: 15, color: "grey" },
});
