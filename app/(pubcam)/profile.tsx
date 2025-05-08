import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useRouter, Stack } from "expo-router";
import type { RootState } from "@/lib/store";
import {
  SegmentedButtons,
  Text,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

// Import Tab Content Components
import { UserProfileContent } from "@/components/UserProfileContent";
import { ServiceProviderProfileContent } from "@/components/provider/ServiceProviderProfileContent";
import { UserLearningContent } from "@/components/UserLearningContent";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useSelector((state: RootState) => state.auth); // Add auth loading state
  const [activeTab, setActiveTab] = useState("profile");

  // --- Auth Check ---
  useEffect(() => {
    // Only redirect if auth check is done and user is not authenticated
    if (!authLoading && isAuthenticated === false) {
      router.replace("/(auth)");
    }
  }, [isAuthenticated, authLoading, router]);

  // --- Determine available tabs ---
  // Build the buttons array dynamically based on user role
  const profileTabs = React.useMemo(() => {
    if (!user) return []; // Return empty if user data isn't available yet

    const tabs = [
      { value: "profile", label: "My Details", icon: "account-circle" },
    ];

    if (user.role === "service-provider") {
      tabs.push({
        value: "organization",
        label: "Organization",
        icon: "domain",
      });
    }
    if (user.role === "citizen") {
      tabs.push({ value: "learning", label: "My Learning", icon: "school" });
    }
    return tabs;
  }, [user]); // Depend on user object

  // Update activeTab if the current one becomes invalid due to role change (unlikely but safe)
  useEffect(() => {
    if (!profileTabs.find((tab) => tab.value === activeTab)) {
      setActiveTab("profile"); // Default back to profile
    }
  }, [profileTabs, activeTab]);

  // --- Render Logic ---
  // Show loading indicator while auth state is loading or redirecting
  if (authLoading || !isAuthenticated || !user) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: "My Profile" }} />

      <View style={styles.container}>
        {/* Tab Switcher */}
        <View style={styles.tabsContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={profileTabs}
            // density="medium" // Adjust density for appearance
          />
        </View>
        <Divider />

        {/* Tab Content - Render based on activeTab */}
        {/* Use ScrollView here if tab content itself isn't scrollable */}
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {activeTab === "profile" && <UserProfileContent />}
          {activeTab === "organization" && user.role === "service-provider" && (
            <ServiceProviderProfileContent />
          )}
          {activeTab === "learning" && user.role === "citizen" && (
            <UserLearningContent />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1 },
  tabsContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  contentContainer: {
    flexGrow: 1, // Allow content to grow within ScrollView
    padding: 16,
  },
});
