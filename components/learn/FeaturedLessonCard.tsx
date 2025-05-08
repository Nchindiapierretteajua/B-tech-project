import { MOCK_FEATURED_LESSONS } from "@/app/(pubcam)/learn";
import { StyleSheet } from "react-native";
import { Button, Card, List } from "react-native-paper";

interface FeaturedLessonCardProps {
  lesson: (typeof MOCK_FEATURED_LESSONS)[0];
  onPress: () => void;
}

export const FeaturedLessonCard = ({
  lesson,
  onPress,
}: FeaturedLessonCardProps) => (
  <Card style={styles.featuredCard} mode="outlined" onPress={onPress}>
    <Card.Title
      title={lesson.title}
      subtitle={`${lesson.difficulty} · ${lesson.duration}`}
      left={(props) => <List.Icon {...props} icon="book-open-variant" />}
      titleNumberOfLines={2}
    />
    <Card.Actions>
      <Button onPress={onPress}>Start Lesson</Button>
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
  featuredCard: { width: 300, marginRight: 12 }, // Fixed width for horizontal scroll
});
