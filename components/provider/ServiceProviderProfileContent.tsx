import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store"; // Adjust paths
// TODO: Import appropriate action for updating org profile
// import { updateOrganizationProfile } from '@/lib/features/auth/authSlice';
import { Card, Button, Snackbar, Text } from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

// Import display and edit form components
import { ServiceProviderDisplay } from "./ServiceProviderDisplay";
import { ServiceProviderEditForm } from "./ServiceProviderEditForm";

// Define the shape of data expected by the edit form submit handler
interface OrgProfileUpdateData {
  organizationName: string;
  organizationDescription?: string;
  sector: string;
  officialAddress?: string;
  officialWebsite?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
}

export function ServiceProviderProfileContent() {
  // Assuming organization details are part of the user object in auth state
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useAppTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleFormSubmit = async (data: OrgProfileUpdateData) => {
    setIsSaving(true);
    setSnackbarMessage("");

    try {
      console.log("Updating Org Profile:", data);
      // --- Simulate API Call ---
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // --- End Simulation ---

      // TODO: Dispatch action to update profile in Redux/API
      // dispatch(updateOrganizationProfile(data));

      // --- Temporary Mock Update (Remove when dispatching action) ---
      // This is just to show the change locally without real state update
      if (user) {
        // This is NOT how you should update Redux state directly
        // It's just to reflect changes in the Display component for demo
        Object.assign(user, {
          organization: data.organizationName,
          organizationDescription: data.organizationDescription,
          sector: data.sector,
          officialAddress: data.officialAddress,
          officialWebsite: data.officialWebsite,
          contactPersonName: data.contactPersonName,
          contactPersonEmail: data.contactPersonEmail,
          contactPersonPhone: data.contactPersonPhone,
        });
      }
      // --- End Temporary Mock Update ---

      setSnackbarMessage("Organization profile updated successfully!");
      setIsEditing(false); // Exit edit mode on success
    } catch (error) {
      console.error("Organization profile update failed:", error);
      setSnackbarMessage("Failed to update organization profile.");
    } finally {
      setIsSaving(false);
      setSnackbarVisible(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card mode="elevated">
        <Card.Title
          title="Organization Details"
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
            <ServiceProviderEditForm
              orgData={user} // Pass user object containing org details
              onSubmit={handleFormSubmit}
              onCancel={() => setIsEditing(false)}
              isSaving={isSaving}
            />
          ) : (
            // Pass user object, Display component will extract relevant fields
            <ServiceProviderDisplay orgData={user} />
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
