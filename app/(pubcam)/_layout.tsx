import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { fontSizes } from "@/constants/fontSizes";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      {user?.role === "service-provider" ? (
        <Tabs.Screen
          name="service-provider"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="chart.bar.fill" color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen name="service-provider" options={{ href: null }} />
      )}
      {/* // )} */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
          headerShown: true,
          headerTitleStyle: {
            fontSize: fontSizes.large,
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="list.dash" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          // title: "Learn",
          // tabBarIcon: ({ color }) => (
          //   <IconSymbol size={28} name="graduationcap.fill" color={color} />
          // ),
          href: null,
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          title: "Announcements",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="megaphone.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} />
          ),
          headerShown: true,
          headerTitleStyle: {
            fontSize: fontSizes.large,
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
        }}
      />
    </Tabs>
  );
}
