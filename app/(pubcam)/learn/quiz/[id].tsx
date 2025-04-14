import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import type { RootState } from "@/lib/store"; // Adjust path
import {
  Appbar, // Keep Appbar for screen-specific header
  ProgressBar,
  Card,
  Text,
  Button,
  Chip,
  List,
  Avatar,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { useAppTheme } from "@/app/_layout";

// --- Mock Quiz Data (Replace with actual fetch/selector logic) ---
const MOCK_QUIZZES_DB: { [key: string]: any } = {
  "national-id": {
    id: "national-id",
    title: "National ID Card Quiz",
    description: "Test your knowledge...",
    points: 100,
    passingScore: 70,
    badge: {
      id: "id-master",
      name: "ID Master",
      icon: "🏆",
      description: "Passed the National ID Card quiz...",
    },
    questions: [
      {
        question: "What is the application fee...?",
        options: ["CFA 1,500", "CFA 2,800", "CFA 5,000", "CFA 10,000"],
        correctAnswer: 1,
        explanation: "The fee is CFA 2,800.",
      },
      {
        question: "Which document is NOT required...?",
        options: [
          "Birth certificate",
          "Certificate of nationality",
          "Passport",
          "Proof of residence",
        ],
        correctAnswer: 2,
        explanation: "A passport is not required...",
      },
      {
        question: "How many photos are needed...?",
        options: ["2 photos", "3 photos", "4 photos", "5 photos"],
        correctAnswer: 2,
        explanation: "You need 4 photos...",
      },
      {
        question: "Where can you apply...?",
        options: [
          "Only central office...",
          "Only municipal offices",
          "Local police stations or ID centers",
          "Only embassies...",
        ],
        correctAnswer: 2,
        explanation: "Apply at local police stations or ID centers.",
      },
      {
        question: "How long to receive ID...?",
        options: ["1-2 weeks", "1-3 months", "6-12 months", "2-3 years"],
        correctAnswer: 1,
        explanation: "Typically 1-3 months.",
      },
    ],
  },
  "citizenship-rights": {
    /* ... more quiz data ... */
  },
  "documentation-procedures": {
    /* ... more quiz data ... */
  },
};

const fetchQuizById = async (id: string): Promise<any | null> => {
  console.log("Fetching quiz:", id); // Simulate fetch
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
  return MOCK_QUIZZES_DB[id] || null;
};
// --- End Mock Data ---

export default function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const {
    colors: {
      primary,
      secondary,
      background,
      surfaceVariant,
      onPrimary,
      error,
    },
  } = useAppTheme();
  const quizId = params.id;
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [quiz, setQuiz] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]); // Use null for unanswered
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // --- Auth Check ---
  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/(auth)");
    }
  }, [isAuthenticated, router]);

  // --- Quiz Fetch ---
  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId) return;
      setIsLoading(true);
      const data = await fetchQuizById(quizId);
      setQuiz(data);
      if (data) {
        setSelectedAnswers(new Array(data.questions.length).fill(null)); // Initialize answers array
      }
      setCurrentQuestion(0);
      setShowResults(false);
      setScore(0);
      setIsLoading(false);
    };
    if (isAuthenticated && quizId) {
      loadQuiz();
    } else if (!isAuthenticated) {
      setIsLoading(false);
    }
  }, [quizId, isAuthenticated]);

  // --- Handlers ---
  const handleSelectAnswer = (answerIndex: number) => {
    if (showResults) return;
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let correctAnswers = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / quiz.questions.length) * 100);
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalScore = calculateScore();
      setScore(finalScore);
      setShowResults(true);
      console.log(`Quiz ${quizId} finished! Score: ${finalScore}%`);
      // TODO: Dispatch action to save quiz result, award points/badge if passed
      // if (finalScore >= quiz.passingScore) { dispatch(...) }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleTryAgain = () => {
    if (!quiz) return;
    setShowResults(false);
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setScore(0);
  };

  const navigateToLearn = () => router.push("/learn");

  // --- Render Logic ---
  if (!isAuthenticated)
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  if (isLoading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!quiz) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ title: "Error" }} />
        <View style={styles.centered}>
          <Text variant="headlineSmall">Quiz Not Found</Text>
          <Button onPress={() => router.back()} style={{ marginTop: 10 }}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const progress = (currentQuestion + 1) / quiz.questions.length;
  const isPassed = score >= quiz.passingScore;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{ title: quiz.title, headerTitleAlign: "center" }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!showResults ? (
          /* --- Quiz Taking View --- */
          <Card style={styles.card} mode="outlined">
            <Card.Content>
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <Text variant="labelMedium" style={styles.progressText}>
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </Text>
                <ProgressBar
                  progress={progress}
                  color={primary}
                  style={styles.progressBar}
                />
              </View>

              {/* Question */}
              <Text variant="headlineSmall" style={styles.questionText}>
                {currentQuestion + 1}.{" "}
                {quiz.questions[currentQuestion].question}
              </Text>

              {/* Options */}
              <View style={styles.optionsContainer}>
                {quiz.questions[currentQuestion].options.map(
                  (option: string, index: number) => (
                    <Pressable
                      key={index}
                      onPress={() => handleSelectAnswer(index)}
                    >
                      <Card
                        style={[
                          styles.optionCard,
                          selectedAnswers[currentQuestion] === index &&
                            styles.optionCardSelected,
                        ]}
                        mode={
                          selectedAnswers[currentQuestion] === index
                            ? "contained"
                            : "outlined"
                        }
                      >
                        <Card.Content style={styles.optionContent}>
                          <Avatar.Text
                            size={28}
                            label={String.fromCharCode(65 + index)}
                            style={[
                              styles.optionAvatar,
                              selectedAnswers[currentQuestion] === index &&
                                styles.optionAvatarSelected,
                            ]}
                            color={
                              selectedAnswers[currentQuestion] === index
                                ? onPrimary
                                : primary
                            }
                          />
                          <Text variant="bodyLarge" style={styles.optionText}>
                            {option}
                          </Text>
                        </Card.Content>
                      </Card>
                    </Pressable>
                  )
                )}
              </View>
            </Card.Content>
            <Card.Actions style={styles.navActions}>
              <Button
                icon="arrow-left"
                mode="outlined"
                onPress={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                icon={
                  currentQuestion < quiz.questions.length - 1
                    ? "arrow-right"
                    : "check-all"
                }
                mode="contained"
                onPress={handleNextQuestion}
                disabled={selectedAnswers[currentQuestion] === null} // Must select an answer
              >
                {currentQuestion < quiz.questions.length - 1
                  ? "Next"
                  : "Finish Quiz"}
              </Button>
            </Card.Actions>
          </Card>
        ) : (
          /* --- Quiz Results View --- */
          <Card style={styles.card} mode="outlined">
            <Card.Content style={styles.resultsContent}>
              <Text variant="headlineLarge" style={styles.resultsTitle}>
                Quiz Results
              </Text>
              <Text
                variant="displayMedium"
                style={[
                  styles.scoreText,
                  {
                    color: isPassed ? primary : error,
                  },
                ]}
              >
                {score}%
              </Text>
              <Text variant="titleLarge" style={styles.passFailText}>
                {isPassed
                  ? "Congratulations! You passed!"
                  : "Keep Learning! You didn't pass."}
              </Text>
              <Text variant="bodyLarge" style={styles.summaryText}>
                You answered{" "}
                {
                  selectedAnswers.filter(
                    (ans, i) => ans === quiz.questions[i].correctAnswer
                  ).length
                }{" "}
                out of {quiz.questions.length} correctly.
              </Text>

              {/* Rewards Section */}
              {isPassed && (
                <Card style={styles.resultsRewardCard} mode="contained">
                  <Card.Content style={styles.resultsRewardContent}>
                    <Avatar.Icon
                      size={54}
                      icon="trophy-award"
                      style={styles.resultsRewardIcon}
                    />
                    <Text
                      variant="titleLarge"
                      style={styles.resultsRewardTitle}
                    >
                      Rewards Earned!
                    </Text>
                    <Text variant="bodyLarge">+{quiz.points} Points</Text>
                    {quiz.badge && (
                      <View style={styles.badgeContainer}>
                        <Avatar.Text
                          size={40}
                          label={quiz.badge.icon}
                          style={styles.badgeIcon}
                        />
                        <View style={styles.badgeTextContainer}>
                          <Text variant="titleMedium">
                            {quiz.badge.name} Badge
                          </Text>
                          <Text variant="bodyMedium">
                            {quiz.badge.description}
                          </Text>
                        </View>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              )}

              {/* Review Answers Section */}
              <List.Section
                title="Review Your Answers"
                titleStyle={styles.reviewTitle}
              >
                {quiz.questions.map((question: any, qIndex: number) => {
                  const userAnswerIndex = selectedAnswers[qIndex];
                  const correctAnswerIndex = question.correctAnswer;
                  const isCorrect = userAnswerIndex === correctAnswerIndex;

                  return (
                    <List.Accordion
                      key={qIndex}
                      title={`${qIndex + 1}. ${question.question}`}
                      id={`review-${qIndex}`}
                      left={(props) => (
                        <List.Icon
                          {...props}
                          icon={isCorrect ? "check-circle" : "close-circle"}
                          color={isCorrect ? "green" : "red"}
                        />
                      )}
                      titleNumberOfLines={3}
                      style={styles.reviewAccordion}
                    >
                      <List.Item
                        title={`Your Answer: ${
                          userAnswerIndex !== null
                            ? question.options[userAnswerIndex]
                            : "Not Answered"
                        }`}
                        titleStyle={
                          !isCorrect && userAnswerIndex !== null
                            ? styles.incorrectAnswer
                            : null
                        }
                        style={styles.reviewDetailItem}
                      />
                      {!isCorrect && (
                        <List.Item
                          title={`Correct Answer: ${question.options[correctAnswerIndex]}`}
                          titleStyle={styles.correctAnswer}
                          style={styles.reviewDetailItem}
                        />
                      )}
                      <View style={styles.explanationBox}>
                        <Text variant="labelLarge">Explanation:</Text>
                        <Text variant="bodyMedium">{question.explanation}</Text>
                      </View>
                    </List.Accordion>
                  );
                })}
              </List.Section>

              {/* Action Buttons */}
              <View style={styles.resultsActions}>
                {!isPassed && (
                  <Button
                    mode="contained"
                    icon="refresh"
                    onPress={handleTryAgain}
                    style={styles.resultsButton}
                  >
                    Try Again
                  </Button>
                )}
                <Button
                  mode="outlined"
                  icon="arrow-left"
                  onPress={navigateToLearn}
                  style={styles.resultsButton}
                >
                  Back to Learning
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 16, paddingBottom: 30 },
  card: { marginBottom: 16 },
  progressContainer: { marginVertical: 10, marginBottom: 20 },
  progressBar: { height: 8, borderRadius: 4, marginTop: 4 },
  progressText: { textAlign: "center", marginBottom: 5 },
  questionText: { marginBottom: 20, fontWeight: "bold", lineHeight: 28 },
  optionsContainer: { gap: 12 }, // Use gap for spacing between options
  optionCard: { borderWidth: 1 },
  optionCardSelected: {
    // backgroundColor: primaryContainer,
    // borderColor: primary,
  },
  optionContent: { flexDirection: "row", alignItems: "center" },
  optionAvatar: {
    marginRight: 12,
    // backgroundColor: surfaceVariant,
  },
  optionAvatarSelected: {
    // backgroundColor: primary, // Add appropriate styling
  },
  optionText: { flexShrink: 1 }, // Allow text to wrap
  navActions: { justifyContent: "space-between", paddingVertical: 8 },
  // Results Styles
  resultsContent: { alignItems: "center", paddingBottom: 20 },
  resultsTitle: { marginBottom: 15, fontWeight: "bold" },
  scoreText: { fontWeight: "bold", marginBottom: 10 },
  passFailText: { marginBottom: 8, textAlign: "center" },
  summaryText: { marginBottom: 25, textAlign: "center" },
  resultsRewardCard: {
    backgroundColor: "#D1FAE5",
    width: "100%",
    marginBottom: 25,
  }, // Light green
  resultsRewardContent: { alignItems: "center", paddingVertical: 15 },
  resultsRewardIcon: { backgroundColor: "#10B981", marginBottom: 10 }, // Green
  resultsRewardTitle: { fontWeight: "bold", marginBottom: 10 },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    width: "95%",
  },
  badgeIcon: { backgroundColor: "#eee" },
  badgeTextContainer: { marginLeft: 15, flexShrink: 1 },
  reviewTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  reviewAccordion: {
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    marginBottom: 8,
  },
  reviewDetailItem: { paddingLeft: 20 },
  incorrectAnswer: { color: "red" },
  correctAnswer: { color: "green", fontWeight: "bold" },
  explanationBox: {
    backgroundColor: "#eee",
    padding: 10,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 4,
  },
  resultsActions: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 15,
    marginTop: 20,
    width: "100%",
  },
  resultsButton: { minWidth: 150 }, // Ensure buttons have decent width
});
