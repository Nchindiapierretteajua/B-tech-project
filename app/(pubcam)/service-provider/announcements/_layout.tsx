import { fontSizes } from "@/constants/fontSizes";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
const ProviderAnnouncementLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: fontSizes.large,
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Announcements",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "Create Announcement",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Announcement",
        }}
      />
    </Stack>
  );
};
export default ProviderAnnouncementLayout;
