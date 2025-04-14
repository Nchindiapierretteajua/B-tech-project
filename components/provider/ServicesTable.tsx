import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
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

// Assuming Service type is defined
type Service = {
  id: string;
  name: string;
  category: string;
  area?: string; // Location field might vary
  status?: "Active" | "Inactive" | "Draft"; // Example statuses
};

interface ServicesTableProps {
  services: Service[];
  onDelete: (id: string) => void; // Propagate delete action
  isDeleting: string | null;
}

const ITEMS_PER_PAGE = 5; // Define items per page for pagination

export function ServicesTable({
  services,
  onDelete,
  isDeleting,
}: ServicesTableProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [page, setPage] = useState<number>(0);
  const [menuVisible, setMenuVisible] = useState<string | null>(null); // Track which menu is open by service ID

  const from = page * ITEMS_PER_PAGE;
  const to = Math.min((page + 1) * ITEMS_PER_PAGE, services.length);
  const paginatedServices = services.slice(from, to);

  const handleEdit = (id: string) => {
    closeMenu();
    router.push(`/(pubcam)/service-provider/services/edit/${id}`); // Adjust path as needed
  };

  const handleDeleteConfirm = (id: string) => {
    closeMenu();
    onDelete(id); // Call parent delete handler
  };

  const openMenu = (id: string) => setMenuVisible(id);
  const closeMenu = () => setMenuVisible(null);

  return (
    <View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Service Name</DataTable.Title>
          <DataTable.Title>Location</DataTable.Title>
          <DataTable.Title numeric>Actions</DataTable.Title>
        </DataTable.Header>

        {paginatedServices.length === 0 ? (
          <DataTable.Row>
            <DataTable.Cell>No services found.</DataTable.Cell>
          </DataTable.Row>
        ) : (
          paginatedServices.map((service) => (
            <DataTable.Row key={service.id}>
              <DataTable.Cell>{service.name}</DataTable.Cell>
              <DataTable.Cell>{service.area || "N/A"}</DataTable.Cell>
              <DataTable.Cell numeric>
                <Menu
                  visible={menuVisible === service.id}
                  onDismiss={closeMenu}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      onPress={() => openMenu(service.id)}
                      size={20}
                    />
                  }
                >
                  <Menu.Item
                    onPress={() => handleEdit(service.id)}
                    title="Edit"
                    leadingIcon="pencil"
                  />
                  <Divider />
                  <Menu.Item
                    onPress={() => handleDeleteConfirm(service.id)}
                    title="Delete"
                    leadingIcon="delete-outline"
                    titleStyle={{ color: colors.error }} // Use theme error color
                    disabled={isDeleting === service.id} // Disable while deleting this item
                  />
                </Menu>
                {/* Show loading state within IconButton space if deleting */}
                {isDeleting === service.id && (
                  <ActivityIndicator size="small" style={styles.deleteLoader} />
                )}
              </DataTable.Cell>
            </DataTable.Row>
          ))
        )}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(services.length / ITEMS_PER_PAGE)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${services.length}`}
          numberOfItemsPerPage={ITEMS_PER_PAGE}
          showFastPaginationControls // Optional
          selectPageDropdownLabel={"Rows per page"} // Optional
        />
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  deleteLoader: {
    // Styles to position the loader nicely, potentially absolute
    position: "absolute",
    right: 10, // Adjust as needed
    top: 10, // Adjust as needed
  },
});
