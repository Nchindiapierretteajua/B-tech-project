import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useRouter, Stack } from "expo-router";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { RootState } from "@/lib/store"; // Adjust path
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Snackbar,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

// Import Form Section Components
import { LessonBasicInfoForm } from "@/components/provider/LessonBasicInfoForm";
import { LessonBadgeForm } from "@/components/provider/LessonBadgeForm";
import { LessonStepsForm } from "@/components/provider/LessonStepsForm";
import { FormActions } from "@/components/provider/FormActions";

// --- Validation Schema ---
const lessonSchema = z.object({
  title: z.string().min(3, "Title required (min 3 chars)"),
  description: z.string().min(20, "Description required (min 20 chars)"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  duration: z.string().min(1, "Duration is required"),
  points: z.number().min(1, "Min 1 point").max(1000, "Max 1000 points"),
  badge: z.object({
    name: z.string().min(2, "Badge name required (min 2 chars)"),
    icon: z.string().min(1, "Badge icon required"),
    description: z.string().min(5, "Badge description required (min 5 chars)"),
  }),
  steps: z
    .array(
      z.object({
        title: z.string().min(3, "Step title required (min 3 chars)"),
        content: z.string().min(20, "Step content required (min 20 chars)"),
      })
    )
    .min(1, "At least one step is required"),
});
type LessonFormValues = z.infer<typeof lessonSchema>;
// --- End Schema ---

export default function CreateLessonScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // --- Auth Check ---
  useEffect(() => {
    if (
      isAuthenticated === false ||
      (isAuthenticated && user?.role !== "service-provider")
    ) {
      router.replace("/(auth)");
    }
  }, [isAuthenticated, user, router]);

  // --- React Hook Form Setup ---
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      difficulty: "",
      duration: "",
      points: 50,
      badge: { name: "", icon: "🎓", description: "" },
      steps: [{ title: "Introduction", content: "" }],
    },
  });

  const fieldArray = useFieldArray({ control, name: "steps" });

  // --- Submission Handler ---
  const onSubmit = async (data: LessonFormValues) => {
    setIsSubmitting(true);
    setSnackbarMessage("");
    try {
      console.log("Creating Lesson:", JSON.stringify(data, null, 2));
      // --- Simulate API Call ---
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // TODO: Replace with actual API call to create lesson
      // await api.createLesson(data);
      // --- End Simulation ---

      setSnackbarMessage("Lesson created successfully!");
      setSnackbarVisible(true);
      // Navigate back to the lessons list after a short delay
      setTimeout(() => router.push("/(pubcam)/service-provider/lessons"), 1000); // Adjust path
    } catch (error) {
      console.error("Error creating lesson:", error);
      setSnackbarMessage("Failed to create lesson.");
      setSnackbarVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  if (!isAuthenticated || user?.role !== "service-provider") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Create New Lesson" }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.sectionCard}>
          <Card.Title title="Basic Information" titleVariant="headlineSmall" />
          <Card.Content>
            <LessonBasicInfoForm control={control} errors={errors} />
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title title="Badge Reward" titleVariant="headlineSmall" />
          <Card.Content>
            <LessonBadgeForm control={control} errors={errors} watch={watch} />
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title title="Lesson Steps" titleVariant="headlineSmall" />
          <Card.Content>
            <LessonStepsForm
              control={control}
              errors={errors}
              fieldArray={fieldArray}
              watch={watch}
            />
          </Card.Content>
        </Card>

        <FormActions
          onCancel={() => router.back()}
          onSubmit={handleSubmit(onSubmit)} // RHF's handleSubmit calls our onSubmit
          isSubmitting={isSubmitting}
          submitText="Create Lesson"
        />
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_MEDIUM}
        style={{
          backgroundColor: snackbarMessage.includes("Failed")
            ? colors.errorContainer
            : colors.primaryContainer,
        }}
      >
        <Text
          style={{
            color: snackbarMessage.includes("Failed")
              ? colors.onErrorContainer
              : colors.onPrimaryContainer,
          }}
        >
          {snackbarMessage}
        </Text>
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { padding: 16, gap: 20 }, // Add gap between cards
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  sectionCard: {}, // Add elevation or outlines if desired
});
