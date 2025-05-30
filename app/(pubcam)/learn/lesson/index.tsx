import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import type { RootState } from "@/lib/store"; // Adjust path
import { LessonFilterModal } from "@/components/LessonFilterModal";
import { LessonCard } from "@/components/LessonCard";
import {
  Text,
  Searchbar,
  Button,
  Card,
  ActivityIndicator,
  Appbar,
} from "react-native-paper";
import { router } from "expo-router";
import { MOCK_ALL_LESSONS } from "@/lib/mock-data";

const fetchAllLessons = async (): Promise<any[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay
  return MOCK_ALL_LESSONS;
};

export default function AllLessonsScreen() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    category: string | null;
    difficulty: string | null;
  }>({ category: null, difficulty: null });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // --- Auth Check ---
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/(auth)"); // Redirect if not logged in
  //   }
  // }, [isAuthenticated]);

  // --- Fetch Lessons ---
  useEffect(() => {
    const loadLessons = async () => {
      setIsLoading(true);
      const data = await fetchAllLessons();
      setAllLessons(data);
      setIsLoading(false);
    };
    // if (isAuthenticated) {
    loadLessons();
    // }
  }, [isAuthenticated]);

  // --- Filtering Logic ---
  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchLower || // Match if search is empty
        lesson.title.toLowerCase().includes(searchLower) ||
        lesson.description.toLowerCase().includes(searchLower);
      const matchesCategory =
        !filters.category || lesson.category === filters.category;
      const matchesDifficulty =
        !filters.difficulty || lesson.difficulty === filters.difficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [allLessons, searchTerm, filters]);

  // --- Prepare Data for Filter Modal ---
  const { categories, difficulties, categoryNames } = useMemo(() => {
    const cats = new Set<string>();
    const diffs = new Set<string>();
    const catNames: { [key: string]: string } = {};
    allLessons.forEach((lesson) => {
      cats.add(lesson.category);
      diffs.add(lesson.difficulty);
      if (lesson.categoryName) {
        catNames[lesson.category] = lesson.categoryName;
      }
    });
    return {
      categories: Array.from(cats),
      difficulties: Array.from(diffs),
      categoryNames: catNames,
    };
  }, [allLessons]);

  // --- Handlers ---
  const openFilterModal = () => setIsFilterModalVisible(true);
  const closeFilterModal = () => setIsFilterModalVisible(false);
  const applyFilters = (newFilters: {
    category: string | null;
    difficulty: string | null;
  }) => {
    setFilters(newFilters);
  };
  const resetAll = () => {
    setSearchTerm("");
    setFilters({ category: null, difficulty: null });
  };

  const renderLessonItem = ({ item }: { item: any }) => (
    <LessonCard lesson={item} />
  );

  // // --- Render Logic ---
  // if (!isAuthenticated) {
  //   return (
  //     // Placeholder while redirecting
  //     <SafeAreaView style={styles.safeArea}>
  //       <View style={styles.centered}>
  //         <ActivityIndicator />
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Screen Header */}
        <Card style={styles.headerCard} mode="contained">
          <Card.Content>
            <Text variant="headlineMedium" style={styles.headerTitle}>
              Explore Lessons
            </Text>
            <Text variant="bodyLarge">
              Enhance your knowledge about public services.
            </Text>
          </Card.Content>
        </Card>

        {/* Search and Filter Controls */}
        <View style={styles.controlsContainer}>
          <Searchbar
            placeholder="Search lessons..."
            onChangeText={setSearchTerm}
            value={searchTerm}
            style={styles.searchBar}
            elevation={1}
          />
          <Button
            icon="filter-variant"
            mode="outlined"
            onPress={openFilterModal}
          >
            Filters
          </Button>
        </View>

        {/* Lesson List */}
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={filteredLessons}
            renderItem={renderLessonItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={styles.emptyText}>
                  No lessons found matching your criteria.
                </Text>
                <Button onPress={resetAll}>Clear Search & Filters</Button>
              </View>
            }
          />
        )}
      </View>

      {/* Filter Modal */}
      <LessonFilterModal
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerCard: { margin: 16, backgroundColor: "#DBEAFE" }, // Light blue background
  headerTitle: { fontWeight: "bold", marginBottom: 5 },
  controlsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 10,
    alignItems: "center",
    gap: 10, // Use gap for spacing
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  searchBar: {
    flex: 1, // Take remaining space
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 15,
    color: "grey",
  },
});
