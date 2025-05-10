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
import { useAppTheme } from "@/app/_layout"; // Corrected import path

export interface AnnouncementFilters {
  category: string | null;
  // Add dateRange: 'last7days' | 'last30days' | null etc. later
}

interface AnnouncementFilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  applyFilters: (filters: AnnouncementFilters) => void;
  initialFilters: AnnouncementFilters;
  availableCategories: string[]; // e.g., ["General", "Education", "Health"]
}

export function AnnouncementFilterModal({
  visible,
  onDismiss,
  applyFilters,
  initialFilters,
  availableCategories,
}: AnnouncementFilterModalProps) {
  const { colors } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialFilters.category
  );

  useEffect(() => {
    setSelectedCategory(initialFilters.category);
  }, [initialFilters]);

  const handleApply = () => {
    applyFilters({ category: selectedCategory });
    onDismiss();
  };

  const handleReset = () => {
    setSelectedCategory(null);
    // Apply immediately on reset for simplicity here, or let user click Apply
    applyFilters({ category: null });
    onDismiss();
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
          <Card.Title
            title="Filter Announcements"
            titleVariant="headlineSmall"
          />
          <ScrollView>
            <Card.Content>
              {/* Category Filter */}
              <View style={styles.filterGroup}>
                <Text variant="titleMedium" style={styles.groupTitle}>
                  Category
                </Text>
                <RadioButton.Group
                  onValueChange={(newValue) =>
                    setSelectedCategory(
                      newValue === "all-cats" ? null : newValue
                    )
                  }
                  value={selectedCategory ?? "all-cats"}
                >
                  <RadioButton.Item
                    label="All Categories"
                    value="all-cats"
                    mode="android"
                  />
                  {availableCategories.map((category) => (
                    <RadioButton.Item
                      key={category}
                      label={category}
                      value={category}
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

const styles = StyleSheet.create({
  modalContainer: { margin: 20, borderRadius: 12, maxHeight: "70%" },
  card: { overflow: "hidden" },
  filterGroup: { marginBottom: 15, paddingHorizontal: 5 },
  groupTitle: { marginBottom: 8, fontWeight: "bold", marginLeft: 10 },
  actions: {
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
  },
  actionButton: { flex: 1, marginHorizontal: 5 },
});
