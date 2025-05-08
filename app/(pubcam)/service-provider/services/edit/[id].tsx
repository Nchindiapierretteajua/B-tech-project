import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { RootState, AppDispatch } from "@/lib/store"; // Adjust path
// TODO: Add updateService action import if using Redux for updates
// import { updateService } from '@/lib/features/services/servicesSlice';
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Snackbar,
  Divider,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

// Import Form Section Components (Reusing from Create)
import { ServiceBasicInfoForm } from "@/components/provider/ServiceBasicInfoForm";
import { ServiceContactInfoForm } from "@/components/provider/ServiceContactInfoForm";
import { ServiceHoursForm } from "@/components/provider/ServiceHoursForm";
import { DynamicArrayInput } from "@/components/provider/DynamicArrayInput";
import { ServiceStepsGuideForm } from "@/components/provider/ServiceStepsGuideForm";
import { ServiceOptionsForm } from "@/components/provider/ServiceOptionsForm";
import { FormActions } from "@/components/provider/FormActions";

// --- Validation Schema (Same as Create) ---
const serviceSchema = z.object({
  name: z.string().min(3, "Name required (min 3 chars)"),
  shortDescription: z
    .string()
    .min(10, "Short description required (min 10 chars)"),
  description: z.string().min(50, "Description required (min 50 chars)"),
  category: z.string().min(1, "Category is required"),
  address: z.string().min(5, "Address required (min 5 chars)"),
  area: z.string().min(2, "Area/District required (min 2 chars)"),
  phone: z.string().min(9, "Valid phone number required"),
  website: z.string().url("Please enter a valid URL (e.g., https://...)"),
  hours: z.record(
    z.string().min(1),
    z.string().min(1, "Please enter hours or 'Closed'")
  ),
  requirements: z
    .array(z.string().min(1, "Requirement cannot be empty"))
    .min(1, "At least one requirement needed"),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "At least one tag needed"),
  accessibility: z.boolean(),
  onlineAvailable: z.boolean(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  steps: z
    .array(
      z.object({
        title: z.string().min(3, "Step title required"),
        description: z.string().min(10, "Step description required"),
        tips: z.array(z.string().min(1, "Tip cannot be empty")).optional(),
        documents: z
          .array(z.string().min(1, "Document cannot be empty"))
          .optional(),
      })
    )
    .optional(),
});
type ServiceFormValues = z.infer<typeof serviceSchema>;
// --- End Schema ---

// --- Mock Data Fetch/Update ---
// TODO: Replace with actual API/Redux logic
const MOCK_SERVICES_DB: { [key: string]: ServiceFormValues } = {
  svc1: {
    name: "ID Card Application Point",
    shortDescription: "Get your national ID card here.",
    description:
      "Full description of the ID card application service, process, requirements, etc. Located centrally in Buea Town for easy access.",
    category: "documentation",
    address: "123 Gov. Street",
    area: "Buea Town",
    phone: "677112233",
    website: "https://example.gov.cm/id",
    hours: {
      Monday: "8am-4pm",
      Tuesday: "8am-4pm",
      Wednesday: "8am-4pm",
      Thursday: "8am-4pm",
      Friday: "8am-12pm",
      Saturday: "Closed",
      Sunday: "Closed",
    },
    requirements: ["Birth Certificate", "4 Photos"],
    tags: ["id card", "official document", "identity"],
    accessibility: true,
    onlineAvailable: false,
    latitude: "4.1555",
    longitude: "9.2444",
    steps: [
      {
        title: "Fill Form",
        description: "Get and fill the form.",
        tips: ["Use black pen"],
        documents: ["Copy of Birth Cert"],
      },
    ],
  },
  svc2: {
    name: "Tax Help Desk",
    shortDescription: "Assistance with tax registration.",
    description:
      "Get help understanding your tax obligations and registering your business or yourself.",
    category: "taxes",
    address: "456 Finance Road",
    area: "Molyko",
    phone: "677998877",
    website: "https://example.gov.cm/taxes",
    hours: {
      Monday: "9am-3pm",
      Tuesday: "9am-3pm",
      Wednesday: "9am-3pm",
      Thursday: "9am-3pm",
      Friday: "9am-3pm",
      Saturday: "Closed",
      Sunday: "Closed",
    },
    requirements: [
      "Business Registration Docs (if applicable)",
      "Previous Tax Info",
    ],
    tags: ["tax", "finance", "business"],
    accessibility: false,
    onlineAvailable: true,
  },
};
const fetchServiceById = async (
  id: string
): Promise<ServiceFormValues | null> => {
  console.log("Fetching service:", id);
  await new Promise((r) => setTimeout(r, 500));
  return MOCK_SERVICES_DB[id] || null;
};
const updateServiceAPI = async (
  id: string,
  data: ServiceFormValues
): Promise<void> => {
  console.log("Updating service:", id, data);
  await new Promise((r) => setTimeout(r, 1500));
  MOCK_SERVICES_DB[id] = data;
}; // Update mock DB
// --- End Mock Data ---

export default function EditServiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const serviceId = params.id;
  const { colors } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [isLoading, setIsLoading] = useState(true); // Loading existing data
  const [isSubmitting, setIsSubmitting] = useState(false); // Saving changes
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [serviceNotFound, setServiceNotFound] = useState(false);

  // --- React Hook Form Setup ---
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {}, // Initialize empty, load data in useEffect
  });

  const requirementsFieldArray = useFieldArray({
    control,
    name: "requirements",
  });
  const tagsFieldArray = useFieldArray({ control, name: "tags" });
  const stepsFieldArray = useFieldArray({ control, name: "steps" });

  // --- Auth Check & Data Load ---
  useEffect(() => {
    if (
      isAuthenticated === false ||
      (isAuthenticated && user?.role !== "service-provider")
    ) {
      router.replace("/login");
      return; // Stop execution if not authenticated
    }

    const loadServiceData = async () => {
      if (!serviceId) {
        setServiceNotFound(true);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchServiceById(serviceId);
        if (data) {
          // Ensure field arrays have at least one item if data is empty/null
          data.requirements = data.requirements?.length
            ? data.requirements
            : [""];
          data.tags = data.tags?.length ? data.tags : [""];
          data.steps = data.steps?.length
            ? data.steps.map((s) => ({
                ...s,
                tips: s.tips?.length ? s.tips : [""], // Ensure at least one tip input
                documents: s.documents?.length ? s.documents : [""], // Ensure at least one doc input
              }))
            : [{ title: "", description: "", tips: [""], documents: [""] }];

          reset(data); // Populate form with fetched data
          setServiceNotFound(false);
        } else {
          setServiceNotFound(true);
        }
      } catch (error) {
        console.error("Failed to load service data:", error);
        setServiceNotFound(true); // Or show specific fetch error
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadServiceData();
    }
  }, [isAuthenticated, user, router, serviceId, reset]);

  // --- Submission Handler ---
  const onSubmit = async (data: ServiceFormValues) => {
    if (!serviceId) return; // Should not happen if loaded correctly
    setIsSubmitting(true);
    setSnackbarMessage("");
    try {
      // Clean up empty optional array items
      const cleanedData = {
        /* ... same cleaning logic as create ... */
        ...data,
        steps: data.steps
          ?.map((step) => ({
            ...step,
            tips: step.tips?.filter((tip) => tip?.trim() !== ""), // Filter empty strings from optional arrays
            documents: step.documents?.filter((doc) => doc?.trim() !== ""),
          }))
          .filter(
            (step) => step.title.trim() !== "" || step.description.trim() !== ""
          ),
      };
      console.log(
        "Updating Service:",
        serviceId,
        JSON.stringify(cleanedData, null, 2)
      );
      await updateServiceAPI(serviceId, cleanedData); // Call update API
      // TODO: Dispatch Redux action if needed: dispatch(updateService({ id: serviceId, changes: cleanedData }));

      setSnackbarMessage("Service updated successfully!");
      setSnackbarVisible(true);
      setTimeout(
        () => router.push("/(pubcam)/service-provider/dashboard"),
        1000
      ); // Go back to list
    } catch (error) {
      console.error("Error updating service:", error);
      setSnackbarMessage("Failed to update service.");
      setSnackbarVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  if (!isAuthenticated || user?.role !== "service-provider") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (serviceNotFound) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ title: "Error" }} />
        <View style={styles.centered}>
          <Text variant="headlineSmall">Service Not Found</Text>
          <Button onPress={() => router.back()} style={{ marginTop: 10 }}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Edit Service" }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- Reuse Form Sections from Create --- */}
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
            {" "}
            <DynamicArrayInput
              control={control}
              errors={errors}
              fieldArray={requirementsFieldArray}
              fieldName="requirements"
              label="Requirement"
              placeholder="e.g., Photo ID"
              addLabel="Add Requirement"
              required={true}
            />{" "}
          </Card.Content>
        </Card>
        <Card style={styles.sectionCard}>
          <Card.Title title="Tags" titleVariant="titleLarge" />
          <Card.Content>
            {" "}
            <DynamicArrayInput
              control={control}
              errors={errors}
              fieldArray={tagsFieldArray}
              fieldName="tags"
              label="Tag"
              placeholder="e.g., healthcare"
              addLabel="Add Tag"
              required={true}
            />{" "}
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
          submitText="Save Changes" // Changed text for Edit
        />
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

// Reusing styles
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { padding: 16, gap: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  sectionCard: {},
});
