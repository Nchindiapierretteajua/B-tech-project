import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Stack, useRouter } from "expo-router";
import {
  Text,
  Button,
  ActivityIndicator,
  Snackbar,
  FAB,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import type { RootState, AppDispatch } from "@/lib/store"; // Adjust path
import {
  fetchProviderAnnouncements,
  deleteProviderAnnouncement,
  selectProviderAnnouncementsError,
  selectProviderAnnouncementsList,
  selectProviderAnnouncementsLoading,
} from "@/lib/features/announcements/announcementSlice";
import { ProviderAnnouncementListItem } from "@/components/provider/ProviderAnnouncementListItem";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog"; // Adjust path

export default function MyAnnouncementsScreen() {
  const { colors } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const announcements = useSelector(selectProviderAnnouncementsList);
  const loading = useSelector(selectProviderAnnouncementsLoading);
  const error = useSelector(selectProviderAnnouncementsError);

  const [isDeletingId, setIsDeletingId] = useState<string | null>(null); // For loading state of specific delete
  const [dialogVisible, setDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (
      isAuthenticated === false ||
      (isAuthenticated && user?.role !== "service-provider")
    ) {
      router.replace("/(auth)");
    } else if (isAuthenticated && user) {
      // Fetch if list is empty or initial load
      if (announcements.length === 0 || loading === "idle") {
        dispatch(fetchProviderAnnouncements(user.id)); // Pass provider ID
      }
    }
  }, [dispatch, isAuthenticated, user, announcements.length, loading, router]);

  const onRefresh = () => {
    if (user) dispatch(fetchProviderAnnouncements(user.id));
  };

  const handleDeletePress = (id: string) => {
    setItemToDelete(id);
    setDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setIsDeletingId(itemToDelete);
      setDialogVisible(false);
      try {
        await dispatch(deleteProviderAnnouncement(itemToDelete)).unwrap();
        setSnackbarMessage("Announcement deleted successfully.");
      } catch (err: any) {
        setSnackbarMessage(err.message || "Failed to delete announcement.");
      } finally {
        setItemToDelete(null);
        setIsDeletingId(null);
        setSnackbarVisible(true);
      }
    }
  };

  if (loading === "pending" && announcements.length === 0 && !isDeletingId) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: "My Announcements" }} />

      {error && !loading && (
        <View style={styles.centered}>
          <Text style={{ color: colors.error }}>Error: {error}</Text>
          <Button onPress={onRefresh}>Retry</Button>
        </View>
      )}

      <FlatList
        data={announcements}
        renderItem={({ item }) => (
          <ProviderAnnouncementListItem
            announcement={item}
            onDeletePress={handleDeletePress}
            isDeletingThis={isDeletingId === item.id}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading &&
          !error && (
            <View style={styles.centered}>
              <Text
                variant="titleMedium"
                style={{ color: colors.onSurfaceVariant }}
              >
                You haven't created any announcements yet.
              </Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={loading === "pending" && !isDeletingId}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        color={colors.onPrimary}
        onPress={() =>
          router.push("/(pubcam)/service-provider/announcements/create")
        } // Navigate to create screen
        label="New Announcement"
      />

      <ConfirmationDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onConfirm={confirmDelete}
        title="Delete Announcement"
        content="Are you sure you want to delete this announcement? This action cannot be undone."
        confirmText="Delete"
        confirmColor={colors.error}
      />
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

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContainer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 80 }, // Padding for FAB
  fab: { position: "absolute", margin: 16, right: 0, bottom: 0 },
});
