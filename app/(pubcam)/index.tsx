import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context"; // Recommended for handling notches/islands

// Import your converted components
import { SearchFilters } from "@/components/SearchFilters";
import { FeaturedServices } from "@/components/FeaturedServices";
import { useAppTheme } from "../_layout";

// Placeholder for ServicesMap
// const ServicesMapPlaceholder = () => (
//     <Card style={styles.placeholderCard}>
//         <Card.Title title="Map Area Placeholder" />
//         <Card.Content>
//             <Text>Services Map would be displayed here.</Text>
//         </Card.Content>
//     </Card>
// );

export default function HomeScreen() {
  const {
    colors: { background },
  } = useAppTheme();
  return (
    <SafeAreaView style={styles.flex1}>
      {/* <Header /> */}
      <ScrollView
        style={[styles.container, { backgroundColor: background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero Section */}
        <Card
          style={styles.heroCard}
          theme={{ colors: { primary: "#F472B6" } }}
        >
          <Card.Content>
            <Text variant="headlineLarge" style={styles.heroTitle}>
              Find Services Easily
            </Text>
            <Text variant="titleMedium" style={styles.heroSubtitle}>
              Your guide to essential community resources.
            </Text>
          </Card.Content>
        </Card>

        {/* Search Filters */}
        <View style={styles.section}>
          <SearchFilters />
        </View>

        {/* Featured Services Section */}
        <View style={styles.section}>
          <FeaturedServices />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16, // Consistent padding
  },
  section: {
    marginBottom: 24, // Space between sections
  },
  heroCard: {
    marginBottom: 24,
    backgroundColor: "#F472B6", // Example pink color
  },
  heroTitle: {
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    color: "white",
    textAlign: "center",
  },
  placeholderCard: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
    backgroundColor: "#e0e0e0",
  },
});
