import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { setSearchFilters } from "@/lib/features/services/servicesSlice"; // Adjust import path
import {
  Button,
  Card,
  TextInput,
  HelperText,
  Menu,
  Divider,
} from "react-native-paper";
import { AppDispatch } from "@/lib/store"; // Adjust import path
import { router } from "expo-router";

const searchSchema = z.object({
  query: z.string().optional(),
  location: z.string().min(2, "Please enter a valid location (min 2 chars)"),
  category: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

// Define category options for the dropdown
const categories = [
  { label: "All Categories", value: "" },
  { label: "Health", value: "health" },
  { label: "Education", value: "education" },
  { label: "Transportation", value: "transportation" },
  { label: "Legal", value: "legal" },
  { label: "Financial", value: "financial" },
];

export function SearchFilters() {
  const dispatch = useDispatch<AppDispatch>();
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue, // To set category value from menu
    watch, // To display selected category
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
      location: "",
      category: "",
    },
  });

  const currentCategoryValue = watch("category");
  const currentCategoryLabel =
    categories.find((c) => c.value === currentCategoryValue)?.label ||
    "Select Category";

  const onSubmit = (data: SearchFormValues) => {
    console.log("Search Data:", data); // For debugging
    dispatch(setSearchFilters(data));
    // Navigate to the services list screen
    // Adjust 'ServicesList' to your actual route name
    router.push("/(pubcam)/services");
  };

  const openCategoryMenu = () => setCategoryMenuVisible(true);
  const closeCategoryMenu = () => setCategoryMenuVisible(false);

  const selectCategory = (value: string) => {
    setValue("category", value, { shouldValidate: true }); // Set value in RHF
    closeCategoryMenu();
  };

  return (
    <Card mode="elevated">
      <Card.Content style={styles.cardContent}>
        {/* Query Input */}
        <Controller
          control={control}
          name="query"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label="Search for..."
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="e.g., Food bank, shelter"
                error={!!errors.query}
              />
              {errors.query && (
                <HelperText type="error">{errors.query.message}</HelperText>
              )}
            </View>
          )}
        />

        {/* Location Input */}
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                label="Location"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter city or zip code"
                error={!!errors.location}
              />
              {errors.location && (
                <HelperText type="error" visible={!!errors.location}>
                  {errors.location.message}
                </HelperText>
              )}
            </View>
          )}
        />

        {/* Category Selector (using Menu) */}
        <Controller
          control={control}
          name="category"
          render={(
            { field } // We don't directly use field here, but need it for RHF
          ) => (
            <View style={styles.inputContainer}>
              <Menu
                visible={categoryMenuVisible}
                onDismiss={closeCategoryMenu}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={openCategoryMenu}
                    icon="chevron-down"
                  >
                    {currentCategoryLabel}
                  </Button>
                }
              >
                {categories.map((category) => (
                  <Menu.Item
                    key={category.value}
                    onPress={() => selectCategory(category.value)}
                    title={category.label}
                  />
                ))}
              </Menu>
              {/* You might want error display for category if needed */}
            </View>
          )}
        />

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          icon="magnify" // search icon
        >
          Search Services
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 8, // Adjust padding as needed
  },
  inputContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  pickerStyle: {
    // Basic styling for the picker if you use @react-native-picker/picker
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "grey", // Adjust as needed
    borderRadius: 4, // Adjust as needed
  },
});
