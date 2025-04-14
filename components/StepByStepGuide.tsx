import React from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store"; // Adjust path
import { Card, Text, List, Avatar, Divider } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";
// Define Step type if not already available
interface Step {
  title: string;
  description: string;
  tips?: string[];
  documents?: string[];
}

interface StepByStepGuideProps {
  id: string | string[];
}

export function StepByStepGuide({ id }: StepByStepGuideProps) {
  const service = useSelector((state: RootState) =>
    state.services.services.find((s) => s.id === id)
  );

  const {
    colors: { primary, primaryContainer, onPrimary },
  } = useAppTheme();

  // Assuming service.steps is the array of Step objects
  const steps: Step[] = service?.steps || [];

  if (!steps || steps.length === 0) {
    return null; // Don't render anything if there are no steps
  }

  // Basic color mapping (same as before, adapt if needed)
  const getHeaderBackgroundColor = (colorScheme: string | undefined) => {
    switch (colorScheme) {
      case "cyan":
        return "#CFFAFE"; // Example custom cyan
      default:
        return primaryContainer; // Fallback
    }
  };
  const getStepNumberBackgroundColor = (colorScheme: string | undefined) => {
    switch (colorScheme) {
      case "cyan":
        return "#67E8F9"; // Example custom cyan
      default:
        return primary; // Fallback
    }
  };

  return (
    <View style={styles.container}>
      {/* Optional Header Card for the Section */}
      <Card
        style={[
          styles.headerCard,
          { backgroundColor: getHeaderBackgroundColor(service?.colorScheme) },
        ]}
        mode="contained"
      >
        <Card.Content>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            How to Use This Service
          </Text>
          <Text variant="titleMedium">Follow these steps for success</Text>
        </Card.Content>
      </Card>

      {/* List of Step Cards */}
      {steps.map((step, index) => (
        <Card key={index} style={styles.stepCard} mode="outlined">
          <List.Item
            title={step.title}
            description={step.description}
            left={(props) => (
              <Avatar.Text
                {...props}
                size={40}
                label={`${index + 1}`}
                style={{
                  backgroundColor: getStepNumberBackgroundColor(
                    service?.colorScheme
                  ),
                }}
                color={onPrimary} // Text color on avatar
              />
            )}
            titleStyle={styles.stepTitle}
            descriptionStyle={styles.stepDescription}
            descriptionNumberOfLines={10} // Allow description to wrap
          />

          {/* Tips Section */}
          {step.tips && step.tips.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <List.Accordion
                title="Helpful Tips"
                id={`tips-${index}`} // Unique ID for accordion
                left={(props) => (
                  <List.Icon {...props} icon="lightbulb-on-outline" />
                )}
                style={styles.accordion}
              >
                {step.tips.map((tip, tipIndex) => (
                  <List.Item
                    key={`tip-${tipIndex}`}
                    title={tip}
                    left={(props) => (
                      <List.Icon {...props} icon="circle-small" />
                    )} // Bullet point
                    titleNumberOfLines={3}
                    style={styles.nestedListItem}
                  />
                ))}
              </List.Accordion>
            </>
          )}

          {/* Documents Section */}
          {step.documents && step.documents.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <List.Accordion
                title="Required Documents"
                id={`docs-${index}`} // Unique ID for accordion
                left={(props) => (
                  <List.Icon {...props} icon="file-document-outline" />
                )}
                style={styles.accordion}
              >
                {step.documents.map((doc, docIndex) => (
                  <List.Item
                    key={`doc-${docIndex}`}
                    title={doc}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon="check-circle"
                        color={primary}
                      />
                    )}
                    titleNumberOfLines={3}
                    style={styles.nestedListItem}
                  />
                ))}
              </List.Accordion>
            </>
          )}
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20, // Space above this section
  },
  headerCard: {
    marginBottom: 16,
  },
  headerTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  stepCard: {
    marginBottom: 12,
    overflow: "hidden", // Ensure content respects card boundaries for accordions
  },
  stepTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  stepDescription: {
    lineHeight: 20,
  },
  divider: {
    marginVertical: 0, // Remove default margin if inside card
  },
  accordion: {
    backgroundColor: "#f9f9f9", // Slight background tint for accordion header
    paddingVertical: 0, // Adjust padding
  },
  nestedListItem: {
    paddingLeft: 25, // Indent nested items
  },
});
