import { MOCK_FEATURED_QUIZZES } from "@/app/(pubcam)/learn";
import { StyleSheet } from "react-native";
import { Button, Card, List } from "react-native-paper";

interface FeaturedQuizCardProps {
  quiz: (typeof MOCK_FEATURED_QUIZZES)[0];
  onPress: () => void;
}
export const FeaturedQuizCard = ({ quiz, onPress }: FeaturedQuizCardProps) => (
  <Card style={styles.featuredCard} mode="outlined" onPress={onPress}>
    <Card.Title
      title={quiz.title}
      subtitle={`${quiz.questionsCount} Questions`}
      left={(props) => <List.Icon {...props} icon="head-question-outline" />}
      titleNumberOfLines={2}
    />
    <Card.Actions>
      <Button onPress={onPress}>Take Quiz</Button>
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
  featuredCard: { width: 300, marginRight: 12 }, // Fixed width for horizontal scroll
});
