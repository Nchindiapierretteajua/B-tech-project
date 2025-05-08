import { Stack } from "expo-router";
import { View, Text } from "react-native";
const LessonLayout = () => {
  return (
    <Stack
    // screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "All Lessons",
        }}
      />
    </Stack>
  );
};
export default LessonLayout;
