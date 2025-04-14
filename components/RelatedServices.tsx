import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { ServiceCard } from "./ServiceCard"; // Import RN ServiceCard
import { Text } from "react-native-paper";
import type { Service } from "@/lib/types";

interface RelatedServicesProps {
  id: string | string[];
}

export function RelatedServices({ id }: RelatedServicesProps) {
  const { services } = useSelector((state: RootState) => state.services);

  const currentService = services.find((s) => s.id === id);

  // Simple related logic: find up to 3 other services sharing at least one tag
  const relatedServices = currentService
    ? services
        .filter(
          (service) =>
            service.id !== id &&
            currentService.tags?.some((tag) => service.tags?.includes(tag))
        )
        .slice(0, 3) // Limit to 3 related services
    : [];

  if (!currentService || relatedServices.length === 0) {
    return null; // Don't render if no current service or no related found
  }

  const renderRelatedService = ({ item }: { item: Service }) => (
    <View style={styles.cardContainer}>
      <ServiceCard service={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        You Might Also Like
      </Text>
      <FlatList
        data={relatedServices}
        renderItem={renderRelatedService}
        keyExtractor={(item) => item.id.toString()}
        horizontal // Display related services horizontally
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20, // Space above this section
  },
  title: {
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 8, // Align with card margins if needed
  },
  listContainer: {
    paddingLeft: 8, // Start first card with padding
    paddingRight: 8, // Padding after last card
  },
  cardContainer: {
    width: 280, // Set a fixed width for horizontal cards
    marginRight: 12, // Space between horizontal cards
    marginBottom: 10, // Space below cards if they wrap strangely (unlikely in horizontal)
  },
});
