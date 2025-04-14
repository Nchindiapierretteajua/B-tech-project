import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store"; // Adjust import path
import { ServiceCard } from "./ServiceCard";
import { Text, Button } from "react-native-paper";
import type { Service } from "@/lib/types"; // Adjust import path
import { router } from "expo-router";

export function FeaturedServices() {
  // Assuming featuredServices is already filtered/selected in your Redux state
  const { featuredServices } = useSelector(
    (state: RootState) => state.services
  );

  const renderService = ({ item }: { item: Service }) => (
    <View style={styles.cardContainer}>
      <ServiceCard service={item} />
    </View>
  );

  const handleViewAll = () => {
    // Navigate to the main services list screen
    router.push("/(pubcam)/services");
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text variant="headlineSmall" style={styles.title}>
          Featured Services
        </Text>
        <Button
          mode="contained-tonal"
          onPress={handleViewAll}
          compact // Makes the button smaller
          style={styles.viewAllButton}
        >
          View All
        </Button>
      </View>

      {/* Use FlatList for performance, especially with potentially long lists */}
      <FlatList
        data={featuredServices}
        renderItem={renderService}
        keyExtractor={(item) => item.id.toString()} // Ensure id is string or use String(item.id)
        // Use horizontal scroll or adjust numColumns for grid layout
        horizontal={false} // Set to true for a horizontal scroll
        // numColumns={2} // Uncomment for a 2-column grid
        // columnWrapperStyle={numColumns > 1 ? styles.row : null} // Style rows if using numColumns > 1
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No featured services available.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4, // Add slight padding if needed
  },
  title: {
    fontWeight: "bold",
  },
  viewAllButton: {
    // Add specific styling if needed
  },
  cardContainer: {
    marginBottom: 16, // Spacing between vertical cards
    // marginRight: 12, // Use if horizontal={true}
    // width: 250, // Fixed width if horizontal={true}
    // flex: 1 / numColumns - someMargin // Use for numColumns grid layout calculation
  },
  row: {
    // Style for rows when using numColumns
    flex: 1,
    justifyContent: "space-around",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});
