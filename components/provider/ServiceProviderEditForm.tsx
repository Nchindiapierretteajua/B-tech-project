import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TextInput,
  HelperText,
  Button,
  Menu,
  Divider,
  Text,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import type { RootState } from "@/lib/store"; // Adjust path

// --- Schema ---
// Example schema, adjust fields and validation as needed
const serviceProviderProfileSchema = z.object({
  organizationName: z.string().min(2, "Organization name required (min 2)"),
  organizationDescription: z
    .string()
    .min(20, "Description required (min 20)")
    .optional()
    .or(z.literal("")),
  sector: z.string().min(1, "Sector is required"), // Use dropdown
  officialAddress: z
    .string()
    .min(5, "Address required (min 5)")
    .optional()
    .or(z.literal("")),
  officialWebsite: z.string().url("Invalid URL").optional().or(z.literal("")),
  contactPersonName: z
    .string()
    .min(2, "Contact name required (min 2)")
    .optional()
    .or(z.literal("")),
  contactPersonEmail: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  // Add phone validation if needed
  contactPersonPhone: z.string().optional().or(z.literal("")),
});
type ServiceProviderFormValues = z.infer<typeof serviceProviderProfileSchema>;
// --- ---

// --- Options ---
// Fetch or define centrally
const SECTOR_OPTIONS = [
  { label: "Healthcare", value: "Health" },
  { label: "Education", value: "Education" },
  { label: "Government Admin", value: "Administration" },
  { label: "Finance", value: "Finance" },
  // Add more...
];
// --- ---

interface ServiceProviderEditFormProps {
  // Pass relevant org data, likely nested in user object
  orgData: RootState["auth"]["user"]; // Assuming org details are part of user
  onSubmit: (data: ServiceProviderFormValues) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export function ServiceProviderEditForm({
  orgData,
  onSubmit,
  onCancel,
  isSaving,
}: ServiceProviderEditFormProps) {
  const { colors } = useAppTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceProviderFormValues>({
    resolver: zodResolver(serviceProviderProfileSchema),
    defaultValues: {
      // Map user data to form fields
      organizationName: orgData?.organization || "",
      organizationDescription: orgData?.organizationDescription || "",
      sector: orgData?.sector || "",
      officialAddress: orgData?.officialAddress || "",
      officialWebsite: orgData?.officialWebsite || "",
      contactPersonName: orgData?.contactPersonName || "",
      contactPersonEmail: orgData?.contactPersonEmail || "",
      contactPersonPhone: orgData?.contactPersonPhone || "",
    },
  });
  const [sectorMenuVisible, setSectorMenuVisible] = React.useState(false);

  return (
    <View style={styles.formContainer}>
      {/* Organization Name */}
      <Controller
        control={control}
        name="organizationName"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Organization Name*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.organizationName}
            style={styles.input}
            left={<TextInput.Icon icon="domain" />}
          />
        )}
      />
      {errors.organizationName && (
        <HelperText type="error">{errors.organizationName.message}</HelperText>
      )}

      {/* Organization Description */}
      <Controller
        control={control}
        name="organizationDescription"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="About the Organization"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.organizationDescription}
            style={styles.input}
            multiline
            numberOfLines={4}
            left={<TextInput.Icon icon="text-long" />}
          />
        )}
      />
      {errors.organizationDescription && (
        <HelperText type="error">
          {errors.organizationDescription.message}
        </HelperText>
      )}

      {/* Sector Dropdown */}
      <Controller
        control={control}
        name="sector"
        render={({ field: { onChange, value } }) => (
          <View>
            <Menu
              visible={sectorMenuVisible}
              onDismiss={() => setSectorMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setSectorMenuVisible(true)}
                  style={styles.dropdownButton}
                  icon="chevron-down"
                >
                  {" "}
                  {SECTOR_OPTIONS.find((opt) => opt.value === value)?.label ||
                    "Select Sector*"}{" "}
                </Button>
              }
            >
              {SECTOR_OPTIONS.map((opt) => (
                <Menu.Item
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    setSectorMenuVisible(false);
                  }}
                  title={opt.label}
                />
              ))}
            </Menu>
            {errors.sector && (
              <HelperText type="error">{errors.sector.message}</HelperText>
            )}
          </View>
        )}
      />

      {/* Official Address */}
      <Controller
        control={control}
        name="officialAddress"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Official Address"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.officialAddress}
            style={styles.input}
            left={<TextInput.Icon icon="map-marker" />}
          />
        )}
      />
      {errors.officialAddress && (
        <HelperText type="error">{errors.officialAddress.message}</HelperText>
      )}

      {/* Official Website */}
      <Controller
        control={control}
        name="officialWebsite"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Official Website"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.officialWebsite}
            style={styles.input}
            keyboardType="url"
            autoCapitalize="none"
            left={<TextInput.Icon icon="web" />}
          />
        )}
      />
      {errors.officialWebsite && (
        <HelperText type="error">{errors.officialWebsite.message}</HelperText>
      )}

      <Divider style={styles.divider} />
      <Text variant="titleMedium">Contact Person</Text>

      {/* Contact Person Name */}
      <Controller
        control={control}
        name="contactPersonName"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Contact Name"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.contactPersonName}
            style={styles.input}
            left={<TextInput.Icon icon="account-tie" />}
          />
        )}
      />
      {errors.contactPersonName && (
        <HelperText type="error">{errors.contactPersonName.message}</HelperText>
      )}

      {/* Contact Person Email */}
      <Controller
        control={control}
        name="contactPersonEmail"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Contact Email"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.contactPersonEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email-outline" />}
          />
        )}
      />
      {errors.contactPersonEmail && (
        <HelperText type="error">
          {errors.contactPersonEmail.message}
        </HelperText>
      )}

      {/* Contact Person Phone */}
      <Controller
        control={control}
        name="contactPersonPhone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Contact Phone"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.contactPersonPhone}
            style={styles.input}
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone-outline" />}
          />
        )}
      />
      {errors.contactPersonPhone && (
        <HelperText type="error">
          {errors.contactPersonPhone.message}
        </HelperText>
      )}

      {/* Reusing FormActions from shared component */}
      {/* <FormActions onCancel={onCancel} onSubmit={handleSubmit(onSubmit)} isSubmitting={isSaving} /> */}
      {/* Or inline if preferred */}
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

// Reusing styles
const styles = StyleSheet.create({
  formContainer: { paddingTop: 10, gap: 12 },
  input: {},
  dropdownButton: {
    justifyContent: "flex-start",
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "grey",
    marginTop: 5,
  },
  divider: { marginVertical: 15 },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
});
