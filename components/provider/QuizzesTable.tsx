import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  DataTable,
  IconButton,
  Chip,
  Menu,
  Divider,
  ActivityIndicator,
  Text,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/app/_layout"; // Corrected import path

// Reusing LessonStatusChip for consistency, or create QuizStatusChip
import { LessonStatusChip } from "./LessonStatusChip";

type Quiz = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  questions: number;
  createdAt: string;
  status: "Published" | "Draft" | string;
};

interface QuizzesTableProps {
  quizzes: Quiz[];
  onDelete: (id: string) => void;
  isDeleting: string | null;
}

const ITEMS_PER_PAGE = 5;

export function QuizzesTable({
  quizzes,
  onDelete,
  isDeleting,
}: QuizzesTableProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [page, setPage] = useState<number>(0);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const from = page * ITEMS_PER_PAGE;
  const to = Math.min((page + 1) * ITEMS_PER_PAGE, quizzes.length);
  const paginatedQuizzes = quizzes.slice(from, to);

  const handleEdit = (id: string) => {
    closeMenu();
    // router.push(`/provider/quizzes/edit/${id}`); // Adjust path
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
          <DataTable.Title>Quiz Title</DataTable.Title>
          <DataTable.Title numeric>Questions</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
          <DataTable.Title numeric>Actions</DataTable.Title>
        </DataTable.Header>

        {paginatedQuizzes.length === 0 ? (
          <DataTable.Row>
            <DataTable.Cell>No quizzes found.</DataTable.Cell>
          </DataTable.Row>
        ) : (
          paginatedQuizzes.map((quiz) => (
            <DataTable.Row key={quiz.id}>
              <DataTable.Cell>{quiz.title}</DataTable.Cell>
              <DataTable.Cell numeric>{quiz.questions}</DataTable.Cell>
              <DataTable.Cell>
                <LessonStatusChip status={quiz.status} />
                {/* Reuse status chip */}
              </DataTable.Cell>
              <DataTable.Cell numeric style={styles.actionsCell}>
                {isDeleting === quiz.id ? (
                  <ActivityIndicator size={20} style={styles.actionIcon} />
                ) : (
                  <Menu
                    visible={menuVisible === quiz.id}
                    onDismiss={closeMenu}
                    anchor={
                      <IconButton
                        icon="dots-vertical"
                        onPress={() => openMenu(quiz.id)}
                        size={20}
                        style={styles.actionIcon}
                      />
                    }
                  >
                    <Menu.Item
                      onPress={() => handleEdit(quiz.id)}
                      title="Edit"
                      leadingIcon="pencil"
                    />
                    <Divider />
                    <Menu.Item
                      onPress={() => handleDeleteConfirm(quiz.id)}
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
          numberOfPages={Math.ceil(quizzes.length / ITEMS_PER_PAGE)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${quizzes.length}`}
          numberOfItemsPerPage={ITEMS_PER_PAGE}
        />
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsCell: { minWidth: 50, justifyContent: "flex-end" }, // Align actions right
  actionIcon: { margin: 0 },
});
