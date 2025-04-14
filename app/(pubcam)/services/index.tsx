import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Your RN Header component
import { ServicesList } from "@/components/ServiceList";
import { useAppTheme } from "@/app/_layout";

export default function ServicesScreen() {
  const {
    colors: { background },
  } = useAppTheme();
  return (
    <SafeAreaView style={styles.flex1}>
      <View style={[styles.container, { backgroundColor: background }]}>
        {/* ServicesList now contains the list and the filter trigger/modal */}
        <ServicesList />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1, // Make sure the list container takes remaining space
    // No padding here, let ServicesList handle its internal padding
  },
});
