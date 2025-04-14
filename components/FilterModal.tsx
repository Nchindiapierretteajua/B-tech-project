import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@/lib/features/services/servicesSlice"; // Adjust import path
import type { RootState, AppDispatch } from "@/lib/store"; // Adjust import path
import {
  Modal,
  Portal,
  Card,
  Text,
  Button,
  Checkbox,
  Divider,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout";

// Define options statically or fetch them if dynamic
const categoryOptions = [
  "Health",
  "Education",
  "Transportation",
  "Legal",
  "Financial",
];
const locationOptions = [
  "Downtown",
  "North Side",
  "South Side",
  "East Side",
  "West Side",
];

const filterSchema = z.object({
  categories: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  accessibility: z.boolean().optional(),
  onlineAvailable: z.boolean().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface FilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  // No need to pass current filters in if we fetch from store inside
}

export function FilterModal({ visible, onDismiss }: FilterModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  // Get current filters from store to initialize the form correctly
  const currentFilters = useSelector(
    (state: RootState) => state.services.filters
  );

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<FilterFormValues>({
      resolver: zodResolver(filterSchema),
      // Initialize with current filters from Redux store
      defaultValues: currentFilters || {
        categories: [],
        locations: [],
        accessibility: false,
        onlineAvailable: false,
      },
    });

  // Reset form if current filters in store change (e.g., external reset)
  useEffect(() => {
    reset(currentFilters);
  }, [currentFilters, reset]);

  const onSubmit = (data: FilterFormValues) => {
    console.log("Applying Filters:", data);
    dispatch(setFilters(data));
    onDismiss(); // Close modal after applying
  };

  const handleReset = () => {
    const defaultValues = {
      categories: [],
      locations: [],
      accessibility: false,
      onlineAvailable: false,
    };
    reset(defaultValues); // Reset RHF state
    dispatch(setFilters(defaultValues)); // Dispatch reset to Redux
    // Optionally close modal on reset, or keep it open to apply the cleared state
    // onDismiss();
  };

  // Helper for Checkbox array controllers
  const handleCheckboxArrayChange = (
    fieldValue: string[] | undefined,
    onChange: (...event: any[]) => void,
    itemValue: string
  ) => {
    const newValue = [...(fieldValue || [])];
    const itemIndex = newValue.indexOf(itemValue);
    if (itemIndex > -1) {
      newValue.splice(itemIndex, 1); // Remove if exists
    } else {
      newValue.push(itemValue); // Add if not exists
    }
    onChange(newValue); // Update RHF field state
  };

  const {
    colors: { background },
  } = useAppTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: background },
        ]}
      >
        <Card style={styles.card}>
          <Card.Title title="Filter Services" titleVariant="headlineSmall" />
          <ScrollView style={styles.scrollView}>
            <Card.Content style={styles.content}>
              {/* Categories */}
              <View style={styles.filterGroup}>
                <Text variant="titleMedium" style={styles.groupTitle}>
                  Categories
                </Text>
                <Controller
                  control={control}
                  name="categories"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      {categoryOptions.map((category) => (
                        <Checkbox.Item
                          key={category}
                          label={category}
                          status={
                            value?.includes(category.toLowerCase())
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() =>
                            handleCheckboxArrayChange(
                              value,
                              onChange,
                              category.toLowerCase()
                            )
                          }
                          mode="android" // or 'ios'
                        />
                      ))}
                    </View>
                  )}
                />
              </View>

              <Divider style={styles.divider} />

              {/* Locations */}
              <View style={styles.filterGroup}>
                <Text variant="titleMedium" style={styles.groupTitle}>
                  Locations
                </Text>
                <Controller
                  control={control}
                  name="locations"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      {locationOptions.map((location) => {
                        const locationValue = location
                          .toLowerCase()
                          .replace(" ", "-");
                        return (
                          <Checkbox.Item
                            key={location}
                            label={location}
                            status={
                              value?.includes(locationValue)
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() =>
                              handleCheckboxArrayChange(
                                value,
                                onChange,
                                locationValue
                              )
                            }
                            mode="android"
                          />
                        );
                      })}
                    </View>
                  )}
                />
              </View>

              <Divider style={styles.divider} />

              {/* Other Options */}
              <View style={styles.filterGroup}>
                <Text variant="titleMedium" style={styles.groupTitle}>
                  Other Options
                </Text>
                <Controller
                  control={control}
                  name="accessibility"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox.Item
                      label="Accessibility Features"
                      status={value ? "checked" : "unchecked"}
                      onPress={() => onChange(!value)}
                      mode="android"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="onlineAvailable"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox.Item
                      label="Available Online"
                      status={value ? "checked" : "unchecked"}
                      onPress={() => onChange(!value)}
                      mode="android"
                    />
                  )}
                />
              </View>
            </Card.Content>
          </ScrollView>
          <Card.Actions style={styles.actions}>
            <Button
              mode="outlined"
              onPress={handleReset}
              style={styles.actionButton}
            >
              Reset
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={styles.actionButton}
            >
              Apply Filters
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20, // Provides padding around the card
    borderRadius: 12, // Rounded corners for the modal pop-up
    maxHeight: "85%", // Limit height
  },
  card: {
    overflow: "hidden", // Ensures content respects border radius
  },
  scrollView: {
    // Max height calculation can be complex; often letting the modal container handle it is easier
    // Or set a fixed height if needed: maxHeight: Dimensions.get('window').height * 0.6,
  },
  content: {
    paddingBottom: 10, // Padding at the bottom of scroll content
  },
  filterGroup: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  groupTitle: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 10,
  },
  actions: {
    justifyContent: "space-around", // Space out buttons
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc", // Separator line
  },
  actionButton: {
    flex: 1, // Make buttons take equal space
    marginHorizontal: 5, // Space between buttons
  },
});
