import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput, HelperText, Button } from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import type { RootState } from "@/lib/store"; // Adjust path

// --- Validation Schema (Keep as before) ---
const phoneRegex = /^[6-9]\d{8}$/; // Matches 9 digits starting with 6-9
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  // Validate only the 9 digits here, prefix is handled separately
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Invalid Cameroon phone (e.g., 6XXXXXXXX)"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});
export type ProfileFormValues = z.infer<typeof profileSchema>; // Export type
// --- ---

interface ProfileEditFormProps {
  user: RootState["auth"]["user"];
  onSubmit: (data: ProfileFormValues) => Promise<void>; // Make submit async
  onCancel: () => void;
  isSaving: boolean;
}

export function ProfileEditForm({
  user,
  onSubmit,
  onCancel,
  isSaving,
}: ProfileEditFormProps) {
  const { colors } = useAppTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phoneNumber: user?.phoneNumber?.startsWith("+237")
        ? user.phoneNumber.substring(4)
        : user?.phoneNumber || "", // Remove +237 for editing
      email: user?.email || "",
      address: user?.address || "",
    },
  });

  return (
    <View style={styles.formContainer}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Full Name"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.name}
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />
        )}
      />
      {errors.name && (
        <HelperText type="error" visible={!!errors.name}>
          {errors.name.message}
        </HelperText>
      )}

      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Phone Number"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.phoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={9}
            left={<TextInput.Affix text="+237 " />}
          />
        )}
      />
      {errors.phoneNumber && (
        <HelperText type="error" visible={!!errors.phoneNumber}>
          {errors.phoneNumber.message}
        </HelperText>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Email (Optional)"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.email}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
          />
        )}
      />
      {errors.email && (
        <HelperText type="error" visible={!!errors.email}>
          {errors.email.message}
        </HelperText>
      )}

      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Address (Optional)"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.address}
            style={styles.input}
            multiline
            left={<TextInput.Icon icon="map-marker" />}
          />
        )}
      />
      {errors.address && (
        <HelperText type="error" visible={!!errors.address}>
          {errors.address.message}
        </HelperText>
      )}

      <View style={styles.formActions}>
        <Button mode="outlined" onPress={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSaving}
          disabled={isSaving}
          icon="content-save"
        >
          Save Changes
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { paddingTop: 10, gap: 12 },
  input: {}, // Add styling if needed
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
});
