import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store"; // Adjust paths
import { updateUserProfile } from "@/lib/features/auth/authSlice"; // Adjust paths
import {
  Card,
  Button,
  Snackbar,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

// Import display and edit form components
import { ProfileDisplay } from "./ProfileDisplay"; // Adjust path
import { ProfileEditForm, ProfileFormValues } from "./ProfileEditForm"; // Adjust path

export function UserProfileContent() {
  // Select user directly here or receive as prop if ProfileScreen fetches it
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useAppTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleFormSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    setSnackbarMessage("");

    try {
      // Ensure phone number always has +237 prefix for storage/API
      // Important: RHF value `data.phoneNumber` already excludes "+237"
      const formattedPhone = `+237${data.phoneNumber}`;

      console.log("Updating User Profile:", {
        ...data,
        phoneNumber: formattedPhone,
      });
      // --- Simulate API Call ---
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // --- End Simulation ---

      // Dispatch Redux action to update state and potentially API
      dispatch(
        updateUserProfile({
          // Assuming updateUserProfile payload matches this structure
          name: data.name,
          phoneNumber: formattedPhone,
          email: data.email || undefined, // Send undefined if empty
          address: data.address || undefined,
        })
      );

      setSnackbarMessage("Profile updated successfully!");
      setIsEditing(false); // Exit edit mode on success
    } catch (error) {
      console.error("Profile update failed:", error);
      setSnackbarMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
      setSnackbarVisible(true); // Show snackbar after operation
    }
  };

  if (!user) {
    // Should be caught by parent screen's auth check, but good fallback
    return <ActivityIndicator style={{ marginTop: 30 }} />;
  }

  return (
    // Use ScrollView if content might exceed screen height, otherwise View
    <ScrollView style={styles.container}>
      <Card mode="elevated">
        <Card.Title
          title="Personal Information"
          titleVariant="titleLarge"
          right={(props) => (
            <Button
              {...props}
              mode={isEditing ? "outlined" : "contained"}
              onPress={() => setIsEditing(!isEditing)}
              disabled={isSaving}
              icon={isEditing ? "close-circle-outline" : "pencil"}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          )}
          style={styles.cardTitle}
        />
        <Card.Content>
          {isEditing ? (
            <ProfileEditForm
              user={user}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsEditing(false)}
              isSaving={isSaving}
            />
          ) : (
            <ProfileDisplay user={user} />
          )}
        </Card.Content>
      </Card>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={{
          backgroundColor: snackbarMessage.includes("Failed")
            ? colors.errorContainer
            : colors.primaryContainer,
        }}
      >
        <Text
          style={{
            color: snackbarMessage.includes("Failed")
              ? colors.onErrorContainer
              : colors.onPrimaryContainer,
          }}
        >
          {snackbarMessage}
        </Text>
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardTitle: { marginBottom: 0, paddingBottom: 0 },
});
