import React from "react";
import { View, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextInput, HelperText } from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

interface ServiceContactInfoFormProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

export function ServiceContactInfoForm({
  control,
  errors,
}: ServiceContactInfoFormProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Address*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.address}
            style={styles.input}
          />
        )}
      />
      {errors.address && (
        <HelperText type="error">{errors.address.message as string}</HelperText>
      )}

      <Controller
        control={control}
        name="area"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Area/District*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.area}
            style={styles.input}
          />
        )}
      />
      {errors.area && (
        <HelperText type="error">{errors.area.message as string}</HelperText>
      )}

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Phone Number*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.phone}
            style={styles.input}
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.phone && (
        <HelperText type="error">{errors.phone.message as string}</HelperText>
      )}

      <Controller
        control={control}
        name="website"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Website URL*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.website}
            style={styles.input}
            keyboardType="url"
            autoCapitalize="none"
          />
        )}
      />
      {errors.website && (
        <HelperText type="error">{errors.website.message as string}</HelperText>
      )}

      {/* Lat/Lon - Could add validation or map picker later */}
      <View style={styles.row}>
        <View style={styles.flexInput}>
          <Controller
            control={control}
            name="latitude"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Latitude (Optional)"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || ""}
                keyboardType="numeric"
              />
            )}
          />
        </View>
        <View style={styles.flexInput}>
          <Controller
            control={control}
            name="longitude"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Longitude (Optional)"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || ""}
                keyboardType="numeric"
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  input: {},
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    marginTop: 5,
  },
  flexInput: { flex: 1 },
});
