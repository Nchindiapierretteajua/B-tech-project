import { MOCK_CATEGORIES } from "@/app/(pubcam)/learn";
import { useAppTheme } from "@/app/_layout";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Chip, Text } from "react-native-paper";

interface CategoryCardProps {
  category: (typeof MOCK_CATEGORIES)[0];
  onPress: () => void;
}

export const CategoryCard = ({ category, onPress }: CategoryCardProps) => {
  const {
    colors: {
      primaryContainer,
      secondaryContainer,
      errorContainer,
      tertiaryContainer,
    },
  } = useAppTheme();
  // Basic color mapping (adapt as needed)
  const getBackgroundColor = (colorScheme: string | undefined) => {
    switch (colorScheme) {
      case "blue":
        return primaryContainer;
      case "green":
        return tertiaryContainer;
      case "yellow":
        return "#FEF9C3"; // Lighter Yellow
      case "red":
        return errorContainer;
      case "purple":
        return "#F3E8FF"; // Lighter Purple
      case "cyan":
        return "#CFFAFE"; // Lighter Cyan
      default:
        return secondaryContainer;
    }
  };

  return (
    <Card
      style={[
        styles.categoryCard,
        { backgroundColor: getBackgroundColor(category.colorScheme) },
      ]}
      onPress={onPress}
      mode="contained"
    >
      <Card.Content>
        <Avatar.Text
          size={48}
          label={category.icon}
          style={styles.categoryIcon}
        />
        <Text
          variant="titleLarge"
          style={styles.categoryTitle}
          numberOfLines={2}
        >
          {category.title}
        </Text>
        <Text
          variant="bodyMedium"
          style={styles.categoryDescription}
          numberOfLines={3}
        >
          {category.description}
        </Text>
        <View style={styles.categoryMeta}>
          <Chip icon="book-open-variant" compact>
            {category.lessons} Lessons
          </Chip>
          <Chip icon="head-question-outline" compact>
            {category.quizzes} Quizzes
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  categoryCard: { height: "100%" }, // Make cards in a row equal height (may need tweaking)
  categoryIcon: {
    alignSelf: "center",
    marginBottom: 12,
    backgroundColor: "white",
  },
  categoryTitle: { fontWeight: "bold", marginBottom: 4, textAlign: "center" },
  categoryDescription: { marginBottom: 10, textAlign: "center", minHeight: 60 },
  categoryMeta: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "auto",
    paddingTop: 10,
  },
});
