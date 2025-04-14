import { Stack } from "expo-router";
import { View, Text } from "react-native";
const LessonLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
};
export default LessonLayout;
