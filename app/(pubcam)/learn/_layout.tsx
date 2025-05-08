import { fontSizes } from "@/constants/fontSizes";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
const LearnLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitleStyle: {
            fontSize: fontSizes.medium,
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
          title: "Learn",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="lesson"
        options={{
          title: "Lessons",
        }}
      />
      <Stack.Screen
        name="quiz"
        options={{
          title: "Quizzes",
        }}
      />
    </Stack>
  );
};
export default LearnLayout;
