import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout";
import type { Lesson } from "@/lib/types";
import { MOCK_PROVIDER_LESSONS } from "@/lib/mock-data";

// Import reusable components
import { LessonsTable } from "@/components/provider/LessonTable";

const fetchProviderLessons = async (): Promise<Lesson[]> => {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_PROVIDER_LESSONS;
};
const deleteLessonAPI = async (id: string): Promise<void> => {
  await new Promise((r) => setTimeout(r, 700));
  console.log("Deleted lesson:", id);
};

export default function ProviderLessonsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // --- Auth Check & Data Fetch ---
  useEffect(() => {
    // if (
    //   isAuthenticated === false ||
    //   (isAuthenticated && user?.role !== "service-provider")
    // ) {
    //   router.replace("/(auth)");
    // } else if (isAuthenticated) {
    const loadData = async () => {
      setIsLoading(true);
      const lessonsData = await fetchProviderLessons();
      setLessons(lessonsData);
      setIsLoading(false);
    };
    loadData();
    // }
  }, [isAuthenticated, user, router]);

  // --- Filtering ---
  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Handlers ---
  const handleCreateLesson = () =>
    router.push("/(pubcam)/service-provider/lessons/create"); // Adjust path

  const handleDeleteLesson = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteLessonAPI(id);
      setLessons((prev) => prev.filter((l) => l.id !== id));
      // TODO: Show success (Snackbar?)
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      // TODO: Show error message
    } finally {
      setIsDeleting(null);
    }
  };

  // --- Render Logic ---
  // if (!isAuthenticated || user?.role !== "service-provider") {
  //   return (
  //     <View style={styles.centered}>
  //       <ActivityIndicator color={colors.primary} />
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: "Manage Lessons" }} />

      <View style={styles.container}>
        {/* Header Controls */}
        <View style={styles.headerControls}>
          <Searchbar
            placeholder="Search lessons..."
            onChangeText={setSearchTerm}
            value={searchTerm}
            style={styles.searchBar}
            elevation={1}
            mode="bar"
          />
          <Button mode="contained" icon="plus" onPress={handleCreateLesson}>
            Create Lesson
          </Button>
        </View>

        {/* Lessons Table */}
        <Card style={styles.tableCard}>
          <Card.Content>
            {isLoading ? (
              <ActivityIndicator
                animating={true}
                color={colors.primary}
                style={{ marginVertical: 20 }}
              />
            ) : (
              <LessonsTable
                lessons={filteredLessons}
                onDelete={handleDeleteLesson}
                isDeleting={isDeleting}
              />
            )}
          </Card.Content>
        </Card>
      </View>
      {/* Note: Use ScrollView if content might overflow vertically */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16, gap: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerControls: { flexDirection: "row", alignItems: "center", gap: 10 },
  searchBar: { flex: 1 },
  tableCard: { flex: 1 }, // Allow table card to take remaining space
});
