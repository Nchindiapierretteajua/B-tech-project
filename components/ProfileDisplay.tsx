import React from "react";
import { View, StyleSheet } from "react-native";
import { List, Text } from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import type { RootState } from "@/lib/store"; // Adjust path

interface ProfileDisplayProps {
  user: RootState["auth"]["user"];
}

export function ProfileDisplay({ user }: ProfileDisplayProps) {
  const { colors } = useAppTheme();
  if (!user) return null;

  // Remove +237 for display if present
  const displayPhone = user.phoneNumber?.startsWith("+237")
    ? user.phoneNumber.substring(4)
    : user.phoneNumber;

  return (
    <View style={styles.displayContainer}>
      <List.Item
        title={user.name}
        description="Full Name"
        left={(props) => (
          <List.Icon {...props} icon="account" color={colors.primary} />
        )}
      />
      <List.Item
        title={displayPhone}
        description="Phone Number (+237)" // Indicate prefix for clarity
        left={(props) => (
          <List.Icon {...props} icon="phone" color={colors.primary} />
        )}
      />
      {user.email && (
        <List.Item
          title={user.email}
          description="Email Address"
          left={(props) => (
            <List.Icon {...props} icon="email" color={colors.primary} />
          )}
        />
      )}
      {user.address && (
        <List.Item
          title={user.address}
          description="Address"
          left={(props) => (
            <List.Icon {...props} icon="map-marker" color={colors.primary} />
          )}
          titleNumberOfLines={3}
        />
      )}
      <List.Item
        title={user.role?.replace("-", " ")} // Handle potential missing role safely
        description="Account Type"
        left={(props) => (
          <List.Icon
            {...props}
            icon={user.role === "service-provider" ? "domain" : "school"}
            color={colors.primary}
          />
        )}
        titleStyle={styles.capitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  displayContainer: { paddingTop: 10 },
  capitalize: { textTransform: "capitalize" },
});
