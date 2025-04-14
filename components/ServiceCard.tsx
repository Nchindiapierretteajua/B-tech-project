import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import type { Service } from "@/lib/types"; // Adjust import path
import type { RootState, AppDispatch } from "@/lib/store"; // Adjust import path
import { toggleFavorite } from "@/lib/features/auth/authSlice"; // Adjust import path
import {
  Card,
  Text,
  Chip,
  IconButton,
  Avatar,
  useTheme,
} from "react-native-paper";
import { router } from "expo-router";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const isFavorite = isAuthenticated && user?.favorites?.includes(service.id);

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      // Navigate to login screen
      router.push("/(auth)"); // Adjust route name
      return;
    }
    dispatch(toggleFavorite(service.id));
  };

  const handleCardPress = () => {
    // Navigate to service detail screen
    router.push(`/(pubcam)/services/${service.id}`); // Adjust route name and params
  };

  // Basic color mapping (expand or use a utility function)
  const getChipBackgroundColor = (colorScheme: string | undefined) => {
    // Use theme colors or fallback
    switch (colorScheme) {
      case "blue":
        return theme.colors.primaryContainer;
      case "green":
        return theme.colors.tertiaryContainer;
      case "red":
        return theme.colors.errorContainer;
      default:
        return theme.colors.secondaryContainer;
    }
  };
  const getAvatarBackgroundColor = (colorScheme: string | undefined) => {
    switch (colorScheme) {
      case "blue":
        return theme.colors.primary;
      case "green":
        return theme.colors.tertiary;
      case "red":
        return theme.colors.error;
      default:
        return theme.colors.secondary;
    }
  };

  return (
    <Card mode="elevated" onPress={handleCardPress} style={styles.card}>
      {/* Optional: Add Card.Cover here if you have images */}
      {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}

      <Card.Title
        title={service.name}
        titleVariant="titleMedium" // Adjust text style variant
        subtitle={service.address || "Location not specified"} // Example subtitle
        left={(props) => (
          <Avatar.Text
            {...props}
            label={service.icon || service.name.substring(0, 1)} // Use icon or initial
            style={{
              backgroundColor: getAvatarBackgroundColor(service.colorScheme),
            }}
            color={theme.colors.onPrimary} // Text color on avatar
          />
        )}
        right={(props) => (
          <IconButton
            {...props}
            icon={isFavorite ? "heart" : "heart-outline"}
            iconColor={isFavorite ? theme.colors.error : theme.colors.outline}
            onPress={handleFavoriteClick}
            size={24}
            accessibilityLabel={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          />
        )}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={styles.description}>
          {service.shortDescription}
        </Text>
        {service.tags && service.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {service.tags.map((tag) => (
              <Chip
                key={tag}
                mode="flat" // 'flat' or 'outlined'
                style={[
                  styles.chip,
                  {
                    backgroundColor: getChipBackgroundColor(
                      service.colorScheme
                    ),
                  },
                ]}
                textStyle={styles.chipText}
              >
                {tag}
              </Chip>
            ))}
          </View>
        )}
      </Card.Content>
      {/* Optional: Add Card.Actions here if needed */}
      {/* <Card.Actions>
                <Button>Details</Button>
             </Card.Actions> */}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    // Removed fixed height, let content define height
    // Add margin if not handled by FlatList container
    // marginBottom: 16, // If not using FlatList's container style
  },
  description: {
    marginBottom: 12,
    color: "#555", // Slightly muted text color
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
    // Ensure chip text color contrasts with chip background
  },
});
