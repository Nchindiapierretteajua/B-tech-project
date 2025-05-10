import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Chip, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import { Announcement } from "@/lib/schemas";

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const router = useRouter();
  const { colors } = useAppTheme();

  const handlePress = () => {
    router.push(`/(pubcam)/announcements/${announcement.id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <Card style={styles.card} mode="elevated" onPress={handlePress}>
      <Card.Title
        title={announcement.title}
        subtitle={`By: ${announcement.providerName}`}
        left={(props) => (
          <Avatar.Icon {...props} icon="bullhorn-variant-outline" />
        )} // Or provider logo
        titleNumberOfLines={2}
        subtitleNumberOfLines={1}
      />
      <Card.Content>
        <Text
          variant="bodyMedium"
          numberOfLines={3}
          style={styles.contentSnippet}
        >
          {announcement.content}
        </Text>
        <View style={styles.metaContainer}>
          <Chip icon="tag-outline" compact style={styles.chip}>
            {announcement.category}
          </Chip>
          <Text variant="labelSmall" style={styles.dateText}>
            Published: {formatDate(announcement.publicationDate)}
          </Text>
        </View>
      </Card.Content>
      {/* Optional: Add an action to view details if card isn't fully pressable */}
      {/* <Card.Actions><Button onPress={handlePress}>Read More</Button></Card.Actions> */}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  contentSnippet: {
    marginVertical: 8,
    minHeight: 40, // Ensure some space even for short content
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  chip: {
    // backgroundColor might need adjustment for contrast with card
  },
  dateText: {
    color: "#6c757d", // Use theme color like colors.onSurfaceVariant
  },
});
