import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  DataTable,
  IconButton,
  Chip,
  Menu,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/app/_layout";
import { LessonStatusChip } from "./LessonStatusChip"; // Import status chip

type Lesson = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  duration: string;
  createdAt: string; // Should ideally be Date object
  status: "Published" | "Draft" | string;
};

interface LessonsTableProps {
  lessons: Lesson[];
  onDelete: (id: string) => void;
  isDeleting: string | null;
}

const ITEMS_PER_PAGE = 5;

export function LessonsTable({
  lessons,
  onDelete,
  isDeleting,
}: LessonsTableProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [page, setPage] = useState<number>(0);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const from = page * ITEMS_PER_PAGE;
  const to = Math.min((page + 1) * ITEMS_PER_PAGE, lessons.length);
  const paginatedLessons = lessons.slice(from, to);

  const handleEdit = (id: string) => {
    closeMenu();
    // router.push(`/`); // Adjust path
  };

  const handleDeleteConfirm = (id: string) => {
    closeMenu();
    onDelete(id);
  };

  const openMenu = (id: string) => setMenuVisible(id);
  const closeMenu = () => setMenuVisible(null);

  return (
    <View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Lesson Title</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
          <DataTable.Title numeric>Actions</DataTable.Title>
        </DataTable.Header>

        {paginatedLessons.length === 0 ? (
          <DataTable.Row>
            <DataTable.Cell>No lessons found.</DataTable.Cell>
          </DataTable.Row>
        ) : (
          paginatedLessons.map((lesson) => (
            <DataTable.Row key={lesson.id}>
              <DataTable.Cell>{lesson.title}</DataTable.Cell>
              <DataTable.Cell>
                <LessonStatusChip status={lesson.status} />
              </DataTable.Cell>
              <DataTable.Cell numeric style={styles.actionsCell}>
                {isDeleting === lesson.id ? (
                  <ActivityIndicator size={20} style={styles.actionIcon} />
                ) : (
                  <Menu
                    visible={menuVisible === lesson.id}
                    onDismiss={closeMenu}
                    anchor={
                      <IconButton
                        icon="dots-vertical"
                        onPress={() => openMenu(lesson.id)}
                        size={20}
                        style={styles.actionIcon}
                      />
                    }
                  >
                    <Menu.Item
                      onPress={() => handleEdit(lesson.id)}
                      title="Edit"
                      leadingIcon="pencil"
                    />
                    <Divider />
                    <Menu.Item
                      onPress={() => handleDeleteConfirm(lesson.id)}
                      title="Delete"
                      leadingIcon="delete-outline"
                      titleStyle={{ color: colors.error }}
                    />
                  </Menu>
                )}
              </DataTable.Cell>
            </DataTable.Row>
          ))
        )}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(lessons.length / ITEMS_PER_PAGE)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${lessons.length}`}
          numberOfItemsPerPage={ITEMS_PER_PAGE}
        />
      </DataTable>
    </View>
  );
}
const styles = StyleSheet.create({
  actionsCell: {
    // Ensure enough space for icon/menu
    minWidth: 50,
  },
  actionIcon: {
    margin: 0, // Remove default margins if needed
  },
});
