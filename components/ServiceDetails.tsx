import React from "react";
import { View, StyleSheet, Linking, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store"; // Adjust paths
import { toggleFavorite } from "@/lib/features/auth/authSlice"; // Adjust paths
import {
  Card,
  Text,
  Button,
  Chip,
  List,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { ServiceComments } from "./ServiceComments";
// Assuming Service type is defined elsewhere
import type { Service } from "@/lib/types"; // Adjust path
import { router } from "expo-router";
import { useAppTheme } from "@/app/_layout";

interface ServiceDetailsProps {
  id: string | string[];
}

export function ServiceDetails({ id }: ServiceDetailsProps) {
  // Use selector to find the specific service by ID
  const service = useSelector((state: RootState) =>
    state.services.services.find((s) => s.id === id)
  );
  // Add loading state if services might not be loaded yet
  const loading = useSelector((state: RootState) => state.services.loading);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();

  const {
    colors: {
      primaryContainer,
      errorContainer,
      tertiaryContainer,
      secondaryContainer,
      primary,
      onErrorContainer,
    },
  } = useAppTheme();

  const isFavorite = isAuthenticated && user?.favorites?.includes(id);

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      router.push("/(auth)"); // Navigate to Login screen
      return;
    }
    dispatch(toggleFavorite(id));
  };

  const handleOpenWebsite = (url: string | undefined) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("Couldn't load page", err)
      );
    }
  };

  const handleMakeCall = (phoneNumber: string | undefined) => {
    if (phoneNumber) {
      let phoneUrl = "";
      if (Platform.OS === "android") {
        phoneUrl = `tel:${phoneNumber}`;
      } else {
        phoneUrl = `telprompt:${phoneNumber}`;
      }
      Linking.openURL(phoneUrl).catch((err) =>
        console.error("Couldn't make call", err)
      );
    }
  };

  // Basic color mapping (same as before, adapt if needed)
  const getCardBackgroundColor = (colorScheme: string | undefined) => {
    switch (colorScheme) {
      case "blue":
        return primaryContainer;
      case "green":
        return tertiaryContainer;
      case "red":
        return errorContainer;
      case "pink":
        return "#FCE7F3"; // Example custom pink
      case "orange":
        return "#FFEDD5"; // Example custom orange
      case "cyan":
        return "#CFFAFE"; // Example custom cyan
      default:
        return secondaryContainer;
    }
  };
  const getChipBackgroundColor = (colorScheme: string | undefined) => {
    // Use theme colors or fallback (adjust for contrast)
    switch (colorScheme) {
      case "blue":
        return primaryContainer;
      case "green":
        return tertiaryContainer;
      case "red":
        return errorContainer;
      case "pink":
        return "#FBCFE8"; // Example custom pink
      case "orange":
        return "#FED7AA"; // Example custom orange
      case "cyan":
        return "#A5F3FC"; // Example custom cyan
      default:
        return secondaryContainer;
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (!service) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.notFoundText}>Service not found</Text>
        </Card.Content>
      </Card>
    );
  }

  // Ensure hours is an object before trying Object.entries
  const serviceHours =
    typeof service.hours === "object" && service.hours !== null
      ? service.hours
      : {};

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <Card
        style={[
          styles.card,
          { backgroundColor: getCardBackgroundColor(service.colorScheme) },
        ]}
        mode="contained"
      >
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {service.name}
          </Text>
          <Text variant="titleMedium" style={styles.subtitle}>
            {service.shortDescription}
          </Text>
        </Card.Content>
        <Card.Actions>
          {/* Omit AR Navigation Button */}
          <Button
            icon={isFavorite ? "heart" : "heart-outline"}
            mode={isFavorite ? "contained" : "outlined"}
            onPress={handleFavoriteClick}
            textColor={isFavorite ? onErrorContainer : primary} // Adjust colors based on theme
            buttonColor={isFavorite ? errorContainer : undefined} // Fill background when favorited
          >
            {isFavorite ? "Favorited" : "Favorite"}
          </Button>
        </Card.Actions>
      </Card>

      {/* Details Section (Contact, Hours, Requirements) */}
      <View style={styles.detailsGrid}>
        {/* Contact Card */}
        <Card style={styles.card} mode="outlined">
          <Card.Title title="Contact Information" titleVariant="titleLarge" />
          <Card.Content>
            <List.Item
              title="Address"
              description={service.address || "Not specified"}
              left={(props) => <List.Icon {...props} icon="map-marker" />}
              titleStyle={styles.listItemTitle}
            />
            <Divider />
            <List.Item
              title="Phone"
              description={service.phone || "Not specified"}
              left={(props) => <List.Icon {...props} icon="phone" />}
              onPress={() => handleMakeCall(service.phone)}
              titleStyle={styles.listItemTitle}
              descriptionStyle={service.phone ? styles.linkText : null} // Style phone if callable
            />
            <Divider />
            <List.Item
              title="Website"
              description={service.website || "Not specified"}
              left={(props) => <List.Icon {...props} icon="web" />}
              onPress={() => handleOpenWebsite(service.website)}
              titleStyle={styles.listItemTitle}
              descriptionStyle={service.website ? styles.linkText : null} // Style link if available
            />
          </Card.Content>
        </Card>

        {/* Hours Card */}
        <Card style={styles.card} mode="outlined">
          <Card.Title title="Operating Hours" titleVariant="titleLarge" />
          <Card.Content>
            {Object.entries(serviceHours).length > 0 ? (
              Object.entries(serviceHours).map(([day, hours]) => (
                <View key={day} style={styles.hoursRow}>
                  <Text style={styles.dayText}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}:
                  </Text>
                  <Text>{hours}</Text>
                </View>
              ))
            ) : (
              <Text>Hours not available</Text>
            )}
          </Card.Content>
        </Card>

        {/* Requirements Card */}
        <Card style={styles.card} mode="outlined">
          <Card.Title title="Requirements" titleVariant="titleLarge" />
          <Card.Content>
            {service.requirements && service.requirements.length > 0 ? (
              service.requirements.map((req, index) => (
                <List.Item
                  key={index}
                  title={req}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="check-circle-outline"
                      color={primary}
                    />
                  )} // Checkmark icon
                  titleNumberOfLines={3} // Allow wrapping
                />
              ))
            ) : (
              <Text>No specific requirements listed.</Text>
            )}
          </Card.Content>
        </Card>
      </View>

      {/* About Section Card */}
      <Card style={styles.card} mode="outlined">
        <Card.Title title="About this Service" titleVariant="titleLarge" />
        <Card.Content>
          <Text style={styles.descriptionText}>
            {service.description || "No description available."}
          </Text>
          {service.tags && service.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {service.tags.map((tag) => (
                <Chip
                  key={tag}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: getChipBackgroundColor(
                        service.colorScheme
                      ),
                    },
                  ]}
                  textStyle={styles.chipText}
                  mode="flat"
                >
                  {tag}
                </Chip>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Comments Section - Rendered separately below details */}
      {/* <ServiceComments serviceId={id} /> */}
      {/* ServiceComments will be rendered by the parent screen after this component */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20, // Space before next major section (e.g., Steps)
  },
  card: {
    marginBottom: 16, // Spacing between cards
  },
  detailsGrid: {
    // No grid needed for vertical stacking on mobile
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 8,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    textAlign: "center",
    fontSize: 18,
    paddingVertical: 20,
  },
  listItemTitle: {
    fontWeight: "bold",
  },
  linkText: {
    color: "blue", // Standard link color
    textDecorationLine: "underline",
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  dayText: {
    fontWeight: "bold",
    marginRight: 8,
  },
  descriptionText: {
    lineHeight: 22, // Improve readability
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  chip: {
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    // Adjust if needed for contrast
  },
});
