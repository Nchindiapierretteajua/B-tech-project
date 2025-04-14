import { Stack } from "expo-router";
import { View, Text } from "react-native";
const ProviderQuizzesLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
    </Stack>
  );
};
export default ProviderQuizzesLayout;
