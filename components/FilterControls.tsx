import React from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar, Button } from "react-native-paper";

interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (query: string) => void;
  onFilterPress: () => void;
  searchPlaceholder?: string;
}

export function FilterControls({
  searchTerm,
  onSearchChange,
  onFilterPress,
  searchPlaceholder = "Search...",
}: FilterControlsProps) {
  return (
    <View style={styles.controlsContainer}>
      <Searchbar
        placeholder={searchPlaceholder}
        onChangeText={onSearchChange}
        value={searchTerm}
        style={styles.searchBar}
        elevation={1} // Use Paper's elevation
        mode="bar" // Or "view" for different style
      />
      <Button
        icon="filter-variant"
        mode="outlined"
        onPress={onFilterPress}
        style={styles.filterButton} // Ensure button doesn't squash
      >
        Filters
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc", // Use theme color if needed
  },
  searchBar: {
    flex: 1, // Takes most space
  },
  filterButton: {
    // Ensure button has enough space
  },
});
