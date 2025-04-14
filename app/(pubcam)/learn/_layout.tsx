import { Stack } from "expo-router";
import { View, Text } from "react-native";
const LearnLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="lesson" />
      <Stack.Screen name="quiz" />
    </Stack>
  );
};
export default LearnLayout;
