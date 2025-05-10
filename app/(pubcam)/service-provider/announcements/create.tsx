import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, Stack } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Snackbar,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import type { RootState, AppDispatch } from "@/lib/store"; // Adjust path
import {
  Announcement,
  announcementSchema,
  AnnouncementFormValues,
} from "@/lib/schemas";
import { createProviderAnnouncement } from "@/lib/features/announcements/announcementSlice";

import { HelperText } from "react-native-paper";
import { AnnouncementForm } from "@/components/provider/AnnouncementForm";
import { FormActions } from "@/components/provider/FormActions";

export default function CreateAnnouncementScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { loading: announcementLoading, error: announcementError } =
    useSelector((state: RootState) => state.announcements);

  const [isSubmitting, setIsSubmitting] = useState(false); // Local submitting for button
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // --- Auth Check ---
  useEffect(() => {
    if (
      isAuthenticated === false ||
      (isAuthenticated && user?.role !== "service-provider")
    ) {
      router.replace("/(auth)");
    }
  }, [isAuthenticated, user, router]);

  // --- React Hook Form Setup ---
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(
      announcementSchema.omit({
        // Omit fields set programmatically
        providerId: true,
        providerName: true,
        publicationDate: true,
        id: true,
      })
    ),
    defaultValues: {
      title: "",
      content: "",
      category: "General",
      status: "draft",
      expiryDate: "",
    },
  });

  // --- Submission Handler ---
  const onSubmit = async (data: AnnouncementFormValues) => {
    if (!user) {
      setSnackbarMessage("User not found. Cannot create announcement.");
      setSnackbarVisible(true);
      return;
    }
    setIsSubmitting(true);
    setSnackbarMessage("");

    const finalData: Omit<Announcement, "id"> = {
      ...data,
      providerId: user.id, // Assuming user object has an ID
      providerName: user.organization || user.name || "Unknown Provider", // Prefer organization name
      publicationDate: new Date().toISOString(),
      // Zod default already handles status: 'draft'
    };

    try {
      await dispatch(createProviderAnnouncement(finalData)).unwrap(); // Use unwrap to catch rejections
      setSnackbarMessage("Announcement created successfully!");
      setSnackbarVisible(true);
      reset(); // Reset form on success
      // Navigate after a short delay to allow snackbar to be seen
      setTimeout(
        () => router.push("/(pubcam)/service-provider/dashboard"),
        1000
      ); // Adjust target path
    } catch (err: any) {
      console.error("Error creating announcement:", err);
      setSnackbarMessage(err.message || "Failed to create announcement.");
      setSnackbarVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  if (!isAuthenticated || user?.role !== "service-provider") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Create Announcement" }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.formCard} mode="elevated">
          <Card.Title
            title="New Public Announcement"
            titleVariant="headlineSmall"
          />
          <Card.Content>
            <AnnouncementForm control={control} errors={errors} />
          </Card.Content>
        </Card>

        {/* Display general error from Redux if any */}
        {announcementError &&
          announcementLoading === "failed" &&
          !isSubmitting && (
            <HelperText type="error" visible={true} style={styles.generalError}>
              {announcementError}
            </HelperText>
          )}

        <FormActions
          onCancel={() => router.back()}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting || announcementLoading === "pending"}
          submitText="Save Announcement"
        />
      </ScrollView>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { padding: 16, gap: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  formCard: {},
  generalError: { fontSize: 14, textAlign: "center", marginTop: 10 },
});
