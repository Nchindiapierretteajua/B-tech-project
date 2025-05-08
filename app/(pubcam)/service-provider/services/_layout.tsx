import { Stack } from "expo-router";
import { View, Text } from "react-native";
const ProviderServicesLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
    </Stack>
  );
};
export default ProviderServicesLayout;
