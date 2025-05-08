import React from "react";
import { View, StyleSheet } from "react-native";
import { List, Text } from "react-native-paper";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import type { RootState } from "@/lib/store"; // Adjust path

// Define expected structure of organization data (subset of user)
interface OrganizationData {
  organization?: string; // Name
  organizationDescription?: string;
  sector?: string; // e.g., Health, Education
  officialAddress?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  officialWebsite?: string;
  // Add verification status etc. if needed
}

interface ServiceProviderDisplayProps {
  // Pass relevant data, likely nested within the main user object
  orgData: OrganizationData | null | undefined;
}

export function ServiceProviderDisplay({
  orgData,
}: ServiceProviderDisplayProps) {
  const { colors } = useAppTheme();

  if (!orgData) {
    return <Text>No organization details found.</Text>;
  }

  return (
    <View style={styles.container}>
      {orgData.organization && (
        <List.Item
          title={orgData.organization}
          description="Organization Name"
          left={(props) => (
            <List.Icon {...props} icon="domain" color={colors.primary} />
          )}
        />
      )}
      {orgData.organizationDescription && (
        <List.Item
          title={orgData.organizationDescription}
          description="About the Organization"
          left={(props) => (
            <List.Icon {...props} icon="text-long" color={colors.primary} />
          )}
          titleNumberOfLines={5} // Allow wrapping
        />
      )}
      {orgData.sector && (
        <List.Item
          title={orgData.sector}
          description="Sector / Category"
          left={(props) => (
            <List.Icon {...props} icon="tag-outline" color={colors.primary} />
          )}
        />
      )}
      {orgData.officialAddress && (
        <List.Item
          title={orgData.officialAddress}
          description="Official Address"
          left={(props) => (
            <List.Icon {...props} icon="map-marker" color={colors.primary} />
          )}
          titleNumberOfLines={3}
        />
      )}
      {orgData.officialWebsite && (
        <List.Item
          title={orgData.officialWebsite}
          description="Official Website"
          left={(props) => (
            <List.Icon {...props} icon="web" color={colors.primary} />
          )}
          // Add Linking.openURL onPress if needed
        />
      )}
      {/* Contact Person Details */}
      {(orgData.contactPersonName ||
        orgData.contactPersonEmail ||
        orgData.contactPersonPhone) && (
        <List.Subheader>Official Contact Person</List.Subheader>
      )}
      {orgData.contactPersonName && (
        <List.Item
          title={orgData.contactPersonName}
          left={(props) => (
            <List.Icon {...props} icon="account-tie" color={colors.primary} />
          )}
        />
      )}
      {orgData.contactPersonEmail && (
        <List.Item
          title={orgData.contactPersonEmail}
          left={(props) => (
            <List.Icon {...props} icon="email-outline" color={colors.primary} />
          )}
        />
      )}
      {orgData.contactPersonPhone && (
        <List.Item
          title={orgData.contactPersonPhone}
          left={(props) => (
            <List.Icon {...props} icon="phone-outline" color={colors.primary} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 10 },
});
