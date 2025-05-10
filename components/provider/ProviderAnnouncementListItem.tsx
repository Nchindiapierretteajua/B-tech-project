import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Card,
  IconButton,
  Chip,
  Menu,
  Divider,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/app/_layout"; // Corrected import path
import { Announcement } from "@/lib/schemas";

interface ProviderAnnouncementListItemProps {
  announcement: Announcement;
  onDeletePress: (id: string) => void; // Callback for delete action
  isDeletingThis: boolean;
}

export function ProviderAnnouncementListItem({
  announcement,
  onDeletePress,
  isDeletingThis,
}: ProviderAnnouncementListItemProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [menuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleEdit = () => {
    closeMenu();
    router.push(
      `/(pubcam)/service-provider/announcements/edit/${announcement.id}`
    );
  };

  const handleDelete = () => {
    closeMenu();
    onDeletePress(announcement.id); // Trigger confirmation in parent
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  const statusColors = {
    published: { bg: colors.primaryContainer, text: colors.onPrimaryContainer },
    draft: { bg: colors.secondaryContainer, text: colors.onSecondaryContainer },
    archived: { bg: colors.surfaceVariant, text: colors.onSurfaceVariant },
  };
  const currentStatusStyle =
    statusColors[announcement.status as keyof typeof statusColors] ||
    statusColors.draft;

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Title
        title={announcement.title}
        subtitle={`Category: ${announcement.category} · Created: ${formatDate(
          announcement.publicationDate
        )}`}
        titleNumberOfLines={2}
        subtitleNumberOfLines={1}
        right={(props) => (
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                {...props}
                icon="dots-vertical"
                onPress={openMenu}
                disabled={isDeletingThis}
              />
            }
          >
            <Menu.Item
              onPress={handleEdit}
              title="Edit"
              leadingIcon="pencil-outline"
            />
            <Divider />
            <Menu.Item
              onPress={handleDelete}
              title="Delete"
              leadingIcon="delete-outline"
              titleStyle={{ color: colors.error }}
            />
          </Menu>
        )}
      />
      <Card.Content>
        <Chip
          icon="information-outline"
          style={[
            styles.statusChip,
            { backgroundColor: currentStatusStyle.bg },
          ]}
          textStyle={{ color: currentStatusStyle.text, fontWeight: "bold" }}
        >
          {announcement.status.toUpperCase()}
        </Chip>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  statusChip: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
});
