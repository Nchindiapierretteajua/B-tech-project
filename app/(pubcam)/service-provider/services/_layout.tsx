import { Stack } from "expo-router";
import { View, Text } from "react-native";
const ProviderServicesLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="edit/[id]" />
    </Stack>
  );
};
export default ProviderServicesLayout;
