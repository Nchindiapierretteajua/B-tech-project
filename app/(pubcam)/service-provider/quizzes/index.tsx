import React, { useEffect, useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, Stack } from "expo-router";
import type { RootState, AppDispatch } from "@/lib/store"; // Adjust path
import {
  Text,
  Button,
  Card,
  ActivityIndicator,
  Searchbar,
  Snackbar,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

import { QuizzesTable } from "@/components/provider/QuizzesTable";

// --- Mock Data ---
type Quiz = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  questions: number;
  createdAt: string;
  status: "Published" | "Draft" | string;
};
const MOCK_PROVIDER_QUIZZES: Quiz[] = [
  {
    id: "national-id-quiz",
    title: "National ID Card Quiz",
    category: "Documentation & ID",
    difficulty: "Beginner",
    questions: 5,
    createdAt: "2023-10-15",
    status: "Published",
  },
  {
    id: "tax-system-quiz",
    title: "Tax System Quiz",
    category: "Taxes & Finance",
    difficulty: "Advanced",
    questions: 12,
    createdAt: "2023-10-10",
    status: "Draft",
  },
  {
    id: "citizenship-rights-quiz",
    title: "Citizenship Rights Quiz",
    category: "Citizenship & Rights",
    difficulty: "Beginner",
    questions: 10,
    createdAt: "2023-09-28",
    status: "Published",
  },
];
const fetchProviderQuizzes = async (): Promise<Quiz[]> => {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_PROVIDER_QUIZZES;
};
const deleteQuizAPI = async (id: string): Promise<void> => {
  await new Promise((r) => setTimeout(r, 700));
  console.log("Deleted quiz:", id);
};
// --- End Mock Data ---

export default function ProviderQuizzesScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // --- Auth Check & Data Fetch ---
  useEffect(() => {
    if (
      isAuthenticated === false ||
      (isAuthenticated && user?.role !== "service-provider")
    ) {
      router.replace("/(auth)");
    } else if (isAuthenticated) {
      const loadData = async () => {
        setIsLoading(true);
        const quizzesData = await fetchProviderQuizzes();
        setQuizzes(quizzesData);
        setIsLoading(false);
      };
      loadData();
    }
  }, [isAuthenticated, user, router]);

  // --- Filtering ---
  const filteredQuizzes = useMemo(
    () =>
      quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [quizzes, searchTerm]
  );

  // --- Handlers ---
  const handleCreateQuiz = () =>
    router.push("/(pubcam)/service-provider/quizzes/create"); // Adjust path

  const handleDeleteQuiz = async (id: string) => {
    setIsDeleting(id);
    setSnackbarMessage("");
    try {
      await deleteQuizAPI(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      setSnackbarMessage("Quiz deleted successfully.");
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      setSnackbarMessage("Failed to delete quiz.");
    } finally {
      setIsDeleting(null);
      setSnackbarVisible(true);
    }
  };

  // --- Render Logic ---
  if (!isAuthenticated || user?.role !== "service-provider") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: "Manage Quizzes" }} />

      <View style={styles.container}>
        {/* Header Controls */}
        <View style={styles.headerControls}>
          <Searchbar
            placeholder="Search quizzes..."
            onChangeText={setSearchTerm}
            value={searchTerm}
            style={styles.searchBar}
            elevation={1}
            mode="bar"
          />
          <Button mode="contained" icon="plus" onPress={handleCreateQuiz}>
            {" "}
            Create Quiz{" "}
          </Button>
        </View>

        {/* Quizzes Table */}
        <Card style={styles.tableCard}>
          <Card.Content>
            {isLoading ? (
              <ActivityIndicator
                animating={true}
                color={colors.primary}
                style={{ marginVertical: 20 }}
              />
            ) : (
              <QuizzesTable // Create this component next
                quizzes={filteredQuizzes}
                onDelete={handleDeleteQuiz}
                isDeleting={isDeleting}
              />
            )}
          </Card.Content>
        </Card>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_MEDIUM}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

// Reusing styles from ProviderLessonsScreen
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16, gap: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerControls: { flexDirection: "row", alignItems: "center", gap: 10 },
  searchBar: { flex: 1 },
  tableCard: { flex: 1 }, // Allow table card to take remaining space
});
