import { fontSizes } from "@/constants/fontSizes";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
const QuizLayout = () => {
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
      <Stack.Screen name="index" options={{ title: "All Quizzes" }} />
      {/* <Stack.Screen name="[id]" /> */}
    </Stack>
  );
};
export default QuizLayout;
