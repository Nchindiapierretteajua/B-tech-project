import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, Stack } from "expo-router";
import type { RootState, AppDispatch } from "@/lib/store"; // Adjust path
import { Text, Button, Card, ActivityIndicator } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";

// Import reusable components
import { StatCard } from "@/components/provider/StatCard"; // Adjust path
import { ActionCard } from "@/components/provider/ActionCard"; // Adjust path
import { ServicesTable } from "@/components/provider/ServicesTable"; // Adjust path
// Assuming Service type is defined
type Service = {
  id: string;
  name: string;
  category: string;
  area?: string;
  status?: "Active" | "Inactive" | "Draft";
};

// --- Mock Data ---
const MOCK_PROVIDER_SERVICES: Service[] = [
  {
    id: "svc1",
    name: "ID Card Application Point",
    category: "documentation",
    area: "Buea Town",
    status: "Active",
  },
  {
    id: "svc2",
    name: "Tax Help Desk",
    category: "taxes",
    area: "Molyko",
    status: "Active",
  },
  // Add more mock services...
];
const fetchProviderServices = async (): Promise<Service[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return MOCK_PROVIDER_SERVICES;
};
const deleteServiceAPI = async (id: string): Promise<void> => {
  await new Promise((r) => setTimeout(r, 800));
  console.log("Deleted service:", id);
};
// --- End Mock Data ---

export default function ProviderDashboardScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  // Use local state for services specific to this screen for now
  const [providerServices, setProviderServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track deleting service ID

  // --- Auth Check & Data Fetch ---
  // useEffect(() => {
  //   if (
  //     isAuthenticated === false ||
  //     (isAuthenticated && user?.role !== "service-provider")
  //   ) {
  //     router.replace("/(auth)"); // Redirect if not correct user type
  //   } else if (isAuthenticated) {
  //     const loadData = async () => {
  //       setIsLoading(true);
  //       const servicesData = await fetchProviderServices(); // Fetch provider's services
  //       setProviderServices(servicesData);
  //       setIsLoading(false);
  //     };
  //     loadData();
  //   }
  // }, [isAuthenticated, user, router]);

  // --- Handlers ---
  const handleAddService = () =>
    router.push("/(pubcam)/service-provider/services/create"); // Adjust path if needed
  const handleManageServices = () =>
    router.push("/(pubcam)/service-provider/services/index"); // Navigate within drawer
  const handleManageLessons = () =>
    router.push("/(pubcam)/service-provider/lessons");
  const handleManageQuizzes = () =>
    router.push("/(pubcam)/service-provider/quizzes");
  const handleViewAnalytics = () =>
    router.push("/(pubcam)/service-provider/dashboard"); // Example path

  const handleDeleteService = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteServiceAPI(id); // Call API to delete
      // Remove from local state on success
      setProviderServices((prev) => prev.filter((svc) => svc.id !== id));
      // TODO: Optionally dispatch action to update global state if needed
    } catch (error) {
      console.error("Failed to delete service:", error);
      // TODO: Show error message (e.g., Snackbar)
    } finally {
      setIsDeleting(null);
    }
  };

  // --- Render Logic ---
  // if (!isAuthenticated || user?.role !== "service-provider") {
  //   return (
  //     <View style={styles.centered}>
  //       <ActivityIndicator color={colors.primary} />
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      {/* Header is handled by Drawer Layout */}
      <Stack.Screen options={{ title: "Provider Dashboard" }} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text variant="headlineMedium">Welcome, {user.name}!</Text>
          <Button mode="contained" icon="plus" onPress={handleAddService}>
            Add New Service
          </Button>
        </View>

        {/* Stats Grid */}
        <View style={styles.gridContainer}>
          <StatCard
            title="Total Services"
            value={isLoading ? "..." : providerServices.length}
            icon="briefcase-outline"
            color={colors.primaryContainer}
          />
          <StatCard
            title="Locations"
            value={isLoading ? "..." : 5}
            icon="map-marker-multiple-outline"
            color={colors.secondaryContainer}
          />
          {/* Add more stats */}
          <StatCard
            title="Monthly Users"
            value={isLoading ? "..." : "1.2k"}
            icon="account-group-outline"
            color={colors.tertiaryContainer}
          />
          <StatCard
            title="Learning Content"
            value={isLoading ? "..." : 8}
            icon="book-open-page-variant-outline"
            color={colors.surfaceVariant}
          />
        </View>

        {/* Action Cards Grid */}
        <View style={styles.actionGridContainer}>
          <ActionCard
            title="Manage Services"
            description="Create, edit, and manage your public services."
            icon="briefcase-edit-outline"
            buttonText="View Services"
            onPress={handleManageServices}
            iconBackgroundColor={colors.primaryContainer}
          />
          <ActionCard
            title="Manage Lessons"
            description="Create and manage educational lessons for citizens."
            icon="book-edit-outline"
            buttonText="View Lessons"
            onPress={handleManageLessons}
            iconBackgroundColor={colors.tertiaryContainer}
          />
          <ActionCard
            title="Manage Quizzes"
            description="Create and manage quizzes to test citizens' knowledge."
            icon="frequently-asked-questions"
            buttonText="View Quizzes"
            onPress={handleManageQuizzes}
            iconBackgroundColor={colors.secondaryContainer}
          />
          {/* Add Analytics Card */}
          <ActionCard
            title="User Analytics"
            description="View analytics about how citizens use your services."
            icon="chart-bar"
            buttonText="View Analytics"
            onPress={handleViewAnalytics}
            iconBackgroundColor={colors.surfaceVariant}
          />
        </View>

        {/* Services Table Section */}
        <Card style={styles.tableCard}>
          <Card.Title title="My Services Overview" titleVariant="titleLarge" />
          <Card.Content>
            {isLoading ? (
              <ActivityIndicator
                animating={true}
                color={colors.primary}
                style={{ marginVertical: 20 }}
              />
            ) : (
              <ServicesTable
                services={providerServices}
                onDelete={handleDeleteService}
                isDeleting={isDeleting}
              />
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContainer: { padding: 16, gap: 24 }, // Add gap between sections
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  }, // Grid layout for stats
  actionGridContainer: { flexDirection: "row", flexWrap: "wrap", gap: 16 }, // Grid layout for actions
  tableCard: {
    /* No specific style needed? */
  },
});
