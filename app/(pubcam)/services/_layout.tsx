import { fontSizes } from "@/constants/fontSizes";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
const ServicesLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontSize: fontSizes.medium,
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Services",
        }}
      />
      {/* <Stack.Screen name="[id]" /> */}
    </Stack>
  );
};
export default ServicesLayout;
