import { fontSizes } from "@/constants/fontSizes";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
const AnnouncementLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontSize: fontSizes.large,
          fontWeight: "bold",
        },
        headerTitleAlign: "center",

        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Announcements",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Announcement Details",
        }}
      />
    </Stack>
  );
};
export default AnnouncementLayout;
