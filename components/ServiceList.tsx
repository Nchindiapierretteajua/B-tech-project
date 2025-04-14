import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store"; // Adjust import path
import { ServiceCard } from "./ServiceCard"; // Use the RN ServiceCard
import { FilterModal } from "./FilterModal"; // Import the Filter Modal
import {
  Text,
  Card,
  ActivityIndicator,
  Button,
  Chip,
} from "react-native-paper";
import type { Service } from "@/lib/types"; // Adjust import path

export function ServicesList() {
  const { filteredServices, searchFilters, loading } = useSelector(
    (state: RootState) => state.services
  );
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const openFilterModal = () => setFilterModalVisible(true);
  const closeFilterModal = () => setFilterModalVisible(false);

  const renderServiceCard = ({ item }: { item: Service }) => (
    <View style={styles.cardWrapper}>
      <ServiceCard service={item} />
    </View>
  );

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text variant="bodyLarge" style={styles.resultsText}>
        {loading
          ? "Searching..."
          : `${filteredServices.length} Service${
              filteredServices.length !== 1 ? "s" : ""
            } Found`}
      </Text>
      <Button
        icon="filter-variant"
        mode="contained-tonal"
        onPress={openFilterModal}
        compact
      >
        Filters
      </Button>
    </View>
  );

  const EmptyList = () => (
    <Card style={styles.centeredCard}>
      <Card.Content style={styles.centeredContent}>
        <Text variant="titleMedium" style={styles.emptyTitle}>
          No services found
        </Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your search or filters.
        </Text>
        {/* Optionally add a button to clear filters directly */}
        <Button
          mode="outlined"
          onPress={openFilterModal} // Open modal to adjust/reset
          style={styles.adjustFilterButton}
        >
          Adjust Filters
        </Button>
      </Card.Content>
    </Card>
  );

  if (loading && filteredServices.length === 0) {
    // Show spinner only if initially loading
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search criteria display (Optional but nice UX) */}
      {(searchFilters.query || searchFilters.location) && (
        <View style={styles.searchCriteriaContainer}>
          {searchFilters.query && (
            <Chip icon="magnify" style={styles.chip}>
              "{searchFilters.query}"
            </Chip>
          )}
          {searchFilters.location && (
            <Chip icon="map-marker" style={styles.chip}>
              {searchFilters.location}
            </Chip>
          )}
        </View>
      )}

      <FlatList
        data={filteredServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyList}
        contentContainerStyle={styles.listContentContainer}
        // Optional: Add numColumns for grid layout
        // numColumns={2}
        // columnWrapperStyle={styles.row} // Add styles for rows if using numColumns
      />

      {/* Render the Filter Modal */}
      <FilterModal visible={filterModalVisible} onDismiss={closeFilterModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up available space
  },
  listContentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 8, // Padding for the list items
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8, // Align with list padding
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  resultsText: {
    flexShrink: 1, // Allow text to wrap if needed
    marginRight: 10,
  },
  searchCriteriaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  chip: {
    marginRight: 5,
    marginBottom: 5,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  centeredCard: {
    marginHorizontal: 10, // Consistent margin
    marginTop: 20,
  },
  centeredContent: {
    alignItems: "center", // Center content inside card
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  emptyTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    textAlign: "center",
    marginBottom: 15,
  },
  adjustFilterButton: {
    marginTop: 10,
  },
  cardWrapper: {
    padding: 8, // Space around each card
    // flex: 0.5, // Use for 2 columns with numColumns=2
  },
  row: {
    // Style for rows when using numColumns=2
    // justifyContent: 'space-between', // Or 'space-around'
  },
});
