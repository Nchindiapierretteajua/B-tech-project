import React from "react";
import { Drawer } from "expo-router/drawer"; // Use Expo Router's Drawer component
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/app/_layout";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Required for drawer

export default function ProviderDrawerLayout() {
  const { colors } = useAppTheme();

  // This layout wraps all screens under app/(provider)/...
  // The `name` prop in Drawer.Screen refers to the file name (without extension)
  // in the corresponding directory relative to this layout.

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true, // Show header for drawer screens
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.onSurfaceVariant,
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.onPrimary,
          // You might want a custom drawer content component for more control
        }}
      >
        <Drawer.Screen
          name="dashboard/index" // Path: app/(provider)/dashboard/index.tsx
          options={{
            drawerLabel: "Dashboard Home",
            title: "Provider Dashboard",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="speedometer-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="services" // Path: app/(provider)/dashboard/my-services.tsx
          options={{
            drawerLabel: "Create Service",
            title: "Create Services",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="briefcase-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="lessons" // Path: app/(provider)/dashboard/provider-lessons.tsx
          options={{
            drawerLabel: "My Lessons", // Or specific provider lessons
            title: "Provider Lessons",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="quizzes" // Path: app/(provider)/dashboard/provider-quizzes.tsx
          options={{
            drawerLabel: "My Quizzes",
            title: "Provider Quizzes",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="help-circle-outline" size={size} color={color} />
            ),
          }}
        />
        {/* Add more screens relevant to service providers */}
        {/* <Drawer.Screen
          name="profile/index" // Path: app/(provider)/profile/index.tsx - reuse profile screen if needed
          options={{
            drawerLabel: "My Profile",
            title: "Profile",
            drawerIcon: ({ color, size }) => (
              <Ionicons
                name="person-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        /> */}
      </Drawer>
    </GestureHandlerRootView>
  );
}
