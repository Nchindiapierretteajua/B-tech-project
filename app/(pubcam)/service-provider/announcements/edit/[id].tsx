import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Snackbar,
  HelperText,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import type { RootState, AppDispatch } from "@/lib/store"; // Adjust path
import {
  Announcement,
  AnnouncementFormValues,
  announcementSchema,
} from "@/lib/schemas";
import {
  updateProviderAnnouncement,
  fetchProviderAnnouncements,
  selectAnnouncementById,
} from "@/lib/features/announcements/announcementSlice";
import { AnnouncementForm } from "@/components/provider/AnnouncementForm";
import { FormActions } from "@/components/provider/FormActions"; // Adjust path

export default function EditAnnouncementScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const announcementId = params.id;
  const { colors } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Select the specific announcement for editing
  // This selector might need to also check providerItems if not fetched into general items
  const announcementToEdit = useSelector(
    selectAnnouncementById(announcementId)
  );
  const { loading: announcementLoading, error: announcementError } =
    useSelector((state: RootState) => state.announcements);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  // --- React Hook Form Setup ---
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(
      announcementSchema.omit({
        // Omit fields set programmatically or not editable
        providerId: true,
        providerName: true,
        publicationDate: true,
        id: true,
      })
    ),
    defaultValues: {}, // Will be set by useEffect + reset
  });

  // --- Auth & Data Load ---
  useEffect(() => {
    if (
      isAuthenticated === false ||
      (isAuthenticated && user?.role !== "service-provider")
    ) {
      router.replace("/(auth)");
      return;
    }
    if (isAuthenticated && user && !announcementToEdit && announcementId) {
      // Attempt to fetch if not found in current state (e.g., direct navigation)
      dispatch(fetchProviderAnnouncements(user.id)).then(() => {
        setInitialLoading(false); // This might re-trigger the effect below
      });
    } else {
      setInitialLoading(false);
    }
  }, [
    isAuthenticated,
    user,
    router,
    announcementToEdit,
    announcementId,
    dispatch,
  ]);

  useEffect(() => {
    if (announcementToEdit) {
      reset({
        // Populate form with existing data
        title: announcementToEdit.title,
        content: announcementToEdit.content,
        category: announcementToEdit.category,
        expiryDate: announcementToEdit.expiryDate || "",
        status: announcementToEdit.status,
      });
      setInitialLoading(false);
    } else if (!initialLoading && announcementId) {
      // If still not found after potential fetch
      setSnackbarMessage("Announcement not found.");
      setSnackbarVisible(true);
      // setTimeout(() => router.back(), 1500);
    }
  }, [announcementToEdit, reset, initialLoading, announcementId, router]);

  // --- Submission Handler ---
  const onSubmit = async (data: AnnouncementFormValues) => {
    if (!announcementId || !user) {
      setSnackbarMessage("Cannot update. Announcement or user ID missing.");
      setSnackbarVisible(true);
      return;
    }
    setIsSubmitting(true);
    setSnackbarMessage("");

    const updatedData: Announcement = {
      ...announcementToEdit!, // Base on existing, only id, providerId, providerName, publicationDate should be from original
      id: announcementId,
      providerId: user.id,
      providerName: user.organization || user.name || "Unknown",
      publicationDate:
        announcementToEdit?.publicationDate || new Date().toISOString(), // Keep original or update if logic allows
      title: data.title,
      content: data.content,
      category: data.category,
      status: data.status,
      expiryDate: data.expiryDate || undefined,
    };

    try {
      await dispatch(updateProviderAnnouncement(updatedData)).unwrap();
      setSnackbarMessage("Announcement updated successfully!");
      setSnackbarVisible(true);
      setTimeout(
        () =>
          router.push(
            "/(pubcam)/service-provider/announcements/my-announcements"
          ),
        1000
      );
    } catch (err: any) {
      console.error("Error updating announcement:", err);
      setSnackbarMessage(err.message || "Failed to update announcement.");
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
  if (
    initialLoading ||
    (announcementLoading === "pending" && !announcementToEdit)
  ) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!announcementToEdit && !initialLoading) {
    // Data has loaded (or tried to) and it's not found
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ title: "Not Found" }} />
        <View style={styles.centered}>
          <Text variant="headlineSmall">Announcement not found.</Text>
          <Button onPress={() => router.back()}>Go Back</Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Edit Announcement" }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.formCard} mode="elevated">
          <Card.Title
            title="Edit Announcement Details"
            titleVariant="headlineSmall"
          />
          <Card.Content>
            <AnnouncementForm control={control} errors={errors} />
          </Card.Content>
        </Card>

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
          submitText="Save Changes"
        />
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

// Reusing styles from Create Announcement
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { padding: 16, gap: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  formCard: {},
  generalError: { fontSize: 14, textAlign: "center", marginTop: 10 },
});
