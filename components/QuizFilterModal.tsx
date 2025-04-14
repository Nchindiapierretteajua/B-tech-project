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
import { useAppTheme } from "@/app/_layout";

interface QuizFilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  applyFilters: (filters: {
    category: string | null;
    difficulty: string | null;
  }) => void;
  initialFilters: { category: string | null; difficulty: string | null };
  categories: string[];
  difficulties: string[];
  categoryNames: { [key: string]: string };
}

export function QuizFilterModal({
  visible,
  onDismiss,
  applyFilters,
  initialFilters,
  categories,
  difficulties,
  categoryNames,
}: QuizFilterModalProps) {
  const { colors } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialFilters.category
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    initialFilters.difficulty
  );

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
    // Don't auto-apply on reset, let user press Apply
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Card style={styles.card}>
          <Card.Title title="Filter Quizzes" titleVariant="headlineSmall" />
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
                      label={categoryNames[category] || category}
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
              textColor={colors.error}
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

// Consistent Modal Styling
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
