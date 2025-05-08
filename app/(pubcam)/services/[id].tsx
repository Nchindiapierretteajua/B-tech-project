import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text } from "react-native-paper";
import { ServiceDetails } from "@/components/ServiceDetails";
import { StepByStepGuide } from "@/components/StepByStepGuide";
import { ServiceComments } from "@/components/ServiceComments";
import { RelatedServices } from "@/components/RelatedServices";
import { useAppTheme } from "@/app/_layout";

// Define the expected route params
type ServiceDetailRouteParams = {
  ServiceDetail: {
    serviceId: string;
  };
};

export default function ServiceDetailScreen() {
  const {
    colors: { background },
  } = useAppTheme();

  const { id } = useLocalSearchParams();

  if (!id) {
    // Handle case where serviceId is missing - maybe navigate back or show error
    return (
      <SafeAreaView style={styles.flex1}>
        <View
          style={[
            styles.container,
            styles.centered,
            { backgroundColor: background },
          ]}
        >
          <Text>Error: Service ID not provided.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex1}>
      <Stack.Screen options={{ title: "Service Details" }} />
      {/* FIXME: Hardcode back button from this screen to the service list screen */}
      {/* TODO: Fetch service details here and pass down to components here */}
      <ScrollView
        style={[styles.container, { backgroundColor: background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Pass serviceId down to child components */}
        <ServiceDetails id={id} />
        <StepByStepGuide id={id} />
        <ServiceComments id={id} />
        <RelatedServices id={id} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 16, // Add padding for the overall content
  },
});
