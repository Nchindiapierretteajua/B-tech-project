import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Text,
  Card,
  Chip,
  Avatar,
  ActivityIndicator,
  Button,
  Divider,
} from "react-native-paper";
import RenderHTML from "react-native-render-html"; // If content can be HTML
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import type { RootState } from "@/lib/store"; // Adjust path
import { Announcement } from "@/lib/schemas";

// HTML Rendering Config (Similar to Lesson Screen)
const tagStyles = {
  /* ... basic p, ul, li, strong styles ... */
  p: { marginVertical: 8, lineHeight: 22, fontSize: 16 },
  ul: { marginVertical: 8, marginLeft: 5 },
  li: { marginVertical: 4, marginLeft: 10, fontSize: 16 },
  strong: { fontWeight: "bold" },
  h3: { fontSize: 20, fontWeight: "bold", marginTop: 12, marginBottom: 6 },
};

export default function AnnouncementDetailScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const announcementId = params.id;
  const { width } = useWindowDimensions();

  // Select the specific announcement. In a real app, if not found, fetch it.
  // For this example, we assume it's in the 'items' list fetched by the list screen.
  const announcement = useSelector((state: RootState) =>
    state.announcements.items.find((item) => item.id === announcementId)
  );

  if (!announcement) {
    // Could show a loading state if fetching, or a not found message
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Stack.Screen options={{ title: "Announcement Not Found" }} />
        <Text>Announcement not found or still loading.</Text>
        <Button onPress={() => router.back()} style={{ marginTop: 10 }}>
          Go Back
        </Button>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: announcement.title }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Cover
            source={{
              uri: `https://picsum.photos/seed/${announcement.id}/700/300`,
            }} // Placeholder image
            style={styles.cardCover}
          />
          <Card.Title
            title={announcement.title}
            titleVariant="headlineMedium"
            subtitle={`By: ${announcement.providerName}`}
            subtitleStyle={styles.subtitle}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="bullhorn-variant-outline"
                style={{ backgroundColor: colors.primaryContainer }}
                color={colors.onPrimaryContainer}
              />
            )}
          />
          <Card.Content>
            <View style={styles.metaRow}>
              <Chip icon="tag-outline" style={styles.chip}>
                {announcement.category}
              </Chip>
              <Text variant="labelSmall" style={styles.dateText}>
                Published: {formatDate(announcement.publicationDate)}
              </Text>
            </View>
            {announcement.expiryDate && (
              <Text
                variant="labelSmall"
                style={[styles.dateText, { color: colors.error, marginTop: 4 }]}
              >
                Expires: {formatDate(announcement.expiryDate)}
              </Text>
            )}
            <Divider style={styles.divider} />
            {/* For simple text: <Text style={styles.contentText}>{announcement.content}</Text> */}
            {/* For HTML content: */}
            <View style={styles.htmlContainer}>
              <RenderHTML
                contentWidth={width - 64} // Adjust based on padding
                source={{
                  html: `<p>${announcement.content.replace(
                    /\n/g,
                    "</p><p>"
                  )}</p>`,
                }} // Basic \n to <p> conversion
                tagsStyles={tagStyles}
                baseStyle={{ color: colors.onSurface }}
              />
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scrollContainer: { padding: 16 },
  card: {},
  cardCover: { height: 180 },
  subtitle: { marginBottom: 10 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  chip: {},
  dateText: { color: "#6c757d" }, // Use theme color like colors.onSurfaceVariant
  divider: { marginVertical: 15 },
  htmlContainer: { marginTop: 5 },
  // contentText: { fontSize: 16, lineHeight: 24, color: colors.onSurface },
});
