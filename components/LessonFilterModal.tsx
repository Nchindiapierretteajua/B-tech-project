import { useAppTheme } from "@/app/_layout";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Modal,
  Portal,
  Card,
  Text,
  Button,
  RadioButton,
  Divider,
} from "react-native-paper";

interface LessonFilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  applyFilters: (filters: {
    category: string | null;
    difficulty: string | null;
  }) => void;
  initialFilters: { category: string | null; difficulty: string | null };
  categories: string[]; // e.g., ['documentation', 'taxes', 'citizenship']
  difficulties: string[]; // e.g., ['Beginner', 'Intermediate', 'Advanced']
  // Add categoryName mapping if needed for display
  categoryNames: { [key: string]: string }; // e.g., { documentation: 'Documentation & ID' }
}

export function LessonFilterModal({
  visible,
  onDismiss,
  applyFilters,
  initialFilters,
  categories,
  difficulties,
  categoryNames,
}: LessonFilterModalProps) {
  const {
    colors: { background },
  } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialFilters.category
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    initialFilters.difficulty
  );

  // Update internal state if initial filters change from parent
  useEffect(() => {
    setSelectedCategory(initialFilters.category);
    setSelectedDifficulty(initialFilters.difficulty);
  }, [initialFilters]);

  const handleApply = () => {
    applyFilters({
      category: selectedCategory,
      difficulty: selectedDifficulty,
    });
    onDismiss();
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    // Apply immediately or let user press Apply after reset
    // applyFilters({ category: null, difficulty: null });
    // onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: background },
        ]}
      >
        <Card style={styles.card}>
          <Card.Title title="Filter Lessons" titleVariant="headlineSmall" />
          <ScrollView>
            <Card.Content>
              {/* Category Filter */}
              <View style={styles.filterGroup}>
                <Text variant="titleMedium" style={styles.groupTitle}>
                  Category
                </Text>
                <RadioButton.Group
                  onValueChange={(newValue) =>
                    setSelectedCategory(newValue === "all" ? null : newValue)
                  }
                  value={selectedCategory ?? "all"}
                >
                  <RadioButton.Item
                    label="All Categories"
                    value="all"
                    mode="android"
                  />
                  {categories.map((category) => (
                    <RadioButton.Item
                      key={category}
                      label={categoryNames[category] || category} // Use display name
                      value={category}
                      mode="android"
                    />
                  ))}
                </RadioButton.Group>
              </View>

              <Divider style={styles.divider} />

              {/* Difficulty Filter */}
              <View style={styles.filterGroup}>
                <Text variant="titleMedium" style={styles.groupTitle}>
                  Difficulty
                </Text>
                <RadioButton.Group
                  onValueChange={(newValue) =>
                    setSelectedDifficulty(newValue === "all" ? null : newValue)
                  }
                  value={selectedDifficulty ?? "all"}
                >
                  <RadioButton.Item
                    label="All Difficulties"
                    value="all"
                    mode="android"
                  />
                  {difficulties.map((difficulty) => (
                    <RadioButton.Item
                      key={difficulty}
                      label={difficulty}
                      value={difficulty}
                      mode="android"
                    />
                  ))}
                </RadioButton.Group>
              </View>
            </Card.Content>
          </ScrollView>
          <Card.Actions style={styles.actions}>
            <Button
              mode="outlined"
              onPress={handleReset}
              style={styles.actionButton}
            >
              Reset
            </Button>
            <Button
              mode="contained"
              onPress={handleApply}
              style={styles.actionButton}
            >
              Apply Filters
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}

// Use similar styling as FilterModal for Services, adjust if needed
const styles = StyleSheet.create({
  modalContainer: { margin: 20, borderRadius: 12, maxHeight: "85%" },
  card: { overflow: "hidden" },
  filterGroup: { marginBottom: 15, paddingHorizontal: 5 },
  groupTitle: { marginBottom: 8, fontWeight: "bold", marginLeft: 10 },
  divider: { marginVertical: 10 },
  actions: {
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
  },
  actionButton: { flex: 1, marginHorizontal: 5 },
});
