import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Stack, useRouter } from "expo-router";
import { Text, ActivityIndicator, Button } from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import { AnnouncementCard } from "@/components/AnnouncementCard";
import {
  fetchPublicAnnouncements,
  selectAllPublicAnnouncements,
  selectAnnouncementsError,
  selectAnnouncementsLoading,
} from "@/lib/features/announcements/announcementSlice";
import type { AppDispatch } from "@/lib/store"; // Adjust path
import {
  AnnouncementFilterModal,
  AnnouncementFilters,
} from "@/components/AnnouncementFilterModal";

export default function AnnouncementsScreen() {
  const { colors } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();

  const allAnnouncements = useSelector(selectAllPublicAnnouncements);
  const loading = useSelector(selectAnnouncementsLoading);
  const error = useSelector(selectAnnouncementsError);

  const [filters, setFilters] = useState<AnnouncementFilters>({
    category: null,
  });
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    if (allAnnouncements.length === 0 || loading === "idle") {
      dispatch(fetchPublicAnnouncements());
    }
  }, [dispatch, allAnnouncements.length, loading]);

  const onRefresh = () => {
    dispatch(fetchPublicAnnouncements());
  };

  const availableCategories = useMemo(() => {
    const cats = new Set(allAnnouncements.map((a) => a.category));
    return Array.from(cats).sort();
  }, [allAnnouncements]);

  const filteredAnnouncements = useMemo(() => {
    return allAnnouncements.filter((announcement) => {
      if (filters.category && announcement.category !== filters.category) {
        return false;
      }
      // Add more filter conditions here (e.g., date range)
      return true;
    });
  }, [allAnnouncements, filters]);

  const openFilterModal = () => setFilterModalVisible(true);
  const closeFilterModal = () => setFilterModalVisible(false);
  const applyAnnouncementFilters = (newFilters: AnnouncementFilters) =>
    setFilters(newFilters);
  if (loading === "pending" && allAnnouncements.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator
          animating={true}
          size="large"
          color={colors.primary}
        />
      </SafeAreaView>
    );
  }

  if (error && allAnnouncements.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Text variant="titleMedium" style={{ color: colors.error }}>
          Failed to load announcements.
        </Text>
        <Button onPress={onRefresh} style={{ marginTop: 10 }}>
          Try Again
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: "Public Announcements" }} />
      <FlatList
        data={allAnnouncements}
        renderItem={({ item }) => <AnnouncementCard announcement={item} />}
        keyExtractor={(item) => item?.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text
              variant="titleMedium"
              style={{ color: colors.onSurfaceVariant }}
            >
              No announcements available right now.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={loading === "pending"}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
      <AnnouncementFilterModal
        visible={filterModalVisible}
        onDismiss={closeFilterModal}
        applyFilters={applyAnnouncementFilters}
        initialFilters={filters}
        availableCategories={availableCategories}
      />
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
  listContainer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },
});
