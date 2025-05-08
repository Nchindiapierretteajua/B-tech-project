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
  Divider,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

// Import Form Section Components
import { ServiceBasicInfoForm } from "@/components/provider/ServiceBasicInfoForm";
import { ServiceContactInfoForm } from "@/components/provider/ServiceContactInfoForm";
import { ServiceHoursForm } from "@/components/provider/ServiceHoursForm";
import { DynamicArrayInput } from "@/components/provider/DynamicArrayInput";
import { ServiceStepsGuideForm } from "@/components/provider/ServiceStepsGuideForm";
import { ServiceOptionsForm } from "@/components/provider/ServiceOptionsForm";

import { FormActions } from "@/components/provider/FormActions"; // Reusable
import { serviceSchema } from "@/lib/schemas";

type ServiceFormValues = z.infer<typeof serviceSchema>;
// --- End Schema ---

export default function CreateServiceScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // --- Auth Check ---
  // useEffect(() => {
  //   if (
  //     isAuthenticated === false ||
  //     (isAuthenticated && user?.role !== "service-provider")
  //   ) {
  //     router.replace("/(auth)");
  //   }
  // }, [isAuthenticated, user, router]);

  // --- React Hook Form Setup ---
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      // Set comprehensive defaults
      name: "",
      shortDescription: "",
      description: "",
      category: "",
      address: "",
      area: "",
      phone: "",
      website: "https://",
      hours: {
        Monday: "9am - 5pm",
        Tuesday: "9am - 5pm",
        Wednesday: "9am - 5pm",
        Thursday: "9am - 5pm",
        Friday: "9am - 5pm",
        Saturday: "Closed",
        Sunday: "Closed",
      },
      requirements: [""],
      tags: [""],
      accessibility: false,
      onlineAvailable: false,
      latitude: "",
      longitude: "",
      steps: [{ title: "", description: "", tips: [""], documents: [""] }], // Start with one empty step if steps are added
    },
  });

  const requirementsFieldArray = useFieldArray({
    control,
    name: "requirements",
  });
  const tagsFieldArray = useFieldArray({ control, name: "tags" });
  const stepsFieldArray = useFieldArray({ control, name: "steps" });

  // --- Submission Handler ---
  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    setSnackbarMessage("");
    try {
      // Clean up empty optional array items before submission if needed
      const cleanedData = {
        ...data,
        steps: data.steps
          ?.map((step) => ({
            ...step,
            tips: step.tips?.filter((tip) => tip.trim() !== ""),
            documents: step.documents?.filter((doc) => doc.trim() !== ""),
          }))
          .filter(
            (step) => step.title.trim() !== "" || step.description.trim() !== ""
          ), // Remove empty steps if logic requires
      };
      console.log("Creating Service:", JSON.stringify(cleanedData, null, 2));
      // --- Simulate API Call ---
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // TODO: Replace with actual API call
      // await api.createService(cleanedData);
      // --- End Simulation ---

      setSnackbarMessage("Service created successfully!");
      setSnackbarVisible(true);
      setTimeout(
        () => router.push("/(pubcam)/service-provider/dashboard"),
        1000
      ); // Go to manage services list
    } catch (error) {
      console.error("Error creating service:", error);
      setSnackbarMessage("Failed to create service.");
      setSnackbarVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  // if (!isAuthenticated || user?.role !== "service-provider") {
  //   return (
  //     <View style={styles.centered}>
  //       <ActivityIndicator color={colors.primary} />
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Create New Service" }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- Form Sections --- */}
        <Card style={styles.sectionCard}>
          <Card.Title title="Basic Information" titleVariant="titleLarge" />
          <Card.Content>
            {" "}
            <ServiceBasicInfoForm control={control} errors={errors} />{" "}
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title title="Contact & Location" titleVariant="titleLarge" />
          <Card.Content>
            {" "}
            <ServiceContactInfoForm control={control} errors={errors} />{" "}
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title title="Hours of Operation" titleVariant="titleLarge" />
          <Card.Content>
            {" "}
            <ServiceHoursForm control={control} errors={errors} />{" "}
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title title="Requirements" titleVariant="titleLarge" />
          <Card.Content>
            <DynamicArrayInput
              control={control}
              errors={errors}
              fieldArray={requirementsFieldArray}
              fieldName="requirements"
              label="Requirement"
              placeholder="e.g., Photo ID"
              addLabel="Add Requirement"
              required={true}
            />
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title title="Tags" titleVariant="titleLarge" />
          <Card.Content>
            <DynamicArrayInput
              control={control}
              errors={errors}
              fieldArray={tagsFieldArray}
              fieldName="tags"
              label="Tag"
              placeholder="e.g., healthcare"
              addLabel="Add Tag"
              required={true}
            />
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title title="Additional Options" titleVariant="titleLarge" />
          <Card.Content>
            {" "}
            <ServiceOptionsForm control={control} />{" "}
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title
            title="Step-by-Step Guide (Optional)"
            titleVariant="titleLarge"
          />
          <Card.Content>
            {" "}
            <ServiceStepsGuideForm
              control={control}
              errors={errors}
              fieldArray={stepsFieldArray}
            />{" "}
          </Card.Content>
        </Card>

        {/* --- Actions --- */}
        <FormActions
          onCancel={() => router.back()}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          submitText="Create Service"
        />
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_MEDIUM}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

// Reusing styles from CreateLessonScreen
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { padding: 16, gap: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  sectionCard: {}, // Add elevation/outlines if desired
});
