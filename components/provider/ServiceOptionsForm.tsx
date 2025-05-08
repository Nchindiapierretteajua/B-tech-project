import React from "react";
import { View, StyleSheet } from "react-native";
import { Control, Controller } from "react-hook-form";
import { Checkbox, Text } from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

interface ServiceOptionsFormProps {
  control: Control<any>;
}

export function ServiceOptionsForm({ control }: ServiceOptionsFormProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="accessibility"
        render={({ field: { onChange, value } }) => (
          <Checkbox.Item
            label="Accessibility Features Available"
            status={value ? "checked" : "unchecked"}
            onPress={() => onChange(!value)}
            mode="android" // or 'ios'
          />
        )}
      />
      <Controller
        control={control}
        name="onlineAvailable"
        render={({ field: { onChange, value } }) => (
          <Checkbox.Item
            label="Service Available Online"
            status={value ? "checked" : "unchecked"}
            onPress={() => onChange(!value)}
            mode="android"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 0 }, // Checkbox.Item has padding
});
