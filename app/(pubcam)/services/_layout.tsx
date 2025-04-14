import { Stack } from "expo-router";
import { View, Text } from "react-native";
const ServicesLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
};
export default ServicesLayout;
