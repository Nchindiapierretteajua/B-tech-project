// TODO: Remove mock data and modify to accomodate fetch from backend
import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useRouter, useLocalSearchParams, Stack } from "expo-router"; // Use Expo Router hooks
import type { RootState } from "@/lib/store"; // Adjust path
import RenderHTML from "react-native-render-html";
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

// --- Mock Lesson Data (Keep or replace with fetch logic) ---
const MOCK_LESSONS_DB: { [key: string]: any } = {
  /* ... same as before ... */
  "national-id": {
    id: "national-id",
    title: "How to Apply for a National ID Card",
    description:
      "Learn the step-by-step process for applying for a National ID Card in Cameroon.",
    duration: "15 min",
    difficulty: "Beginner",
    category: "Documentation & ID",
    points: 50,
    badge: {
      id: "id-expert",
      name: "ID Expert",
      icon: "🪪",
      description: "Completed the National ID Card lesson",
    },
    steps: [
      {
        title: "Introduction",
        content: `<p>The National ID Card (Carte Nationale d'Identité) is an essential document... Needed for employment</li></ul>`,
      },
      {
        title: "Required Documents",
        content: `<p>Before starting the application process... Make sure all your documents are valid...</p><div class="info-box yellow"><p><strong>Important:</strong> Make sure all your documents are valid...</p></div>`,
      },
      {
        title: "Where to Apply",
        content: `<p>You can apply for a National ID Card at...<ul><li>Your local police station</li>...</ul></p><div class="info-box blue"><p><strong>Tip:</strong> Some centers are less crowded...</p></div>`,
      },
      {
        title: "Application Process",
        content: `<p>Once you have all your documents... <ol><li><strong>Fill out the application form</strong>...</li><li><strong>Receive an application receipt</strong>...</li></ol>...1-2 hours...</p>`,
      },
      {
        title: "Collection Process",
        content: `<p>After submitting your application:<ul><li>You'll be given a date...</li>...</li></ul></p><div class="info-box green"><p><strong>Good to know:</strong> If you can't collect your ID...</p></div>`,
      },
      {
        title: "Summary & Quiz",
        content: `<p>Congratulations! You've completed the lesson...<ul><li>The National ID Card is essential...</li>...</li></ul><p>Now, test your knowledge...</p><div class="quiz-link-placeholder" data-lesson-id="national-id"></div>`,
      }, // Pass ID
    ],
  },
};
const fetchLessonById = async (id: string): Promise<any | null> => {
  /* ... same as before ... */
  console.log("Fetching lesson:", id);
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_LESSONS_DB[id] || null;
};
// --- End Mock Data ---

// --- HTML Rendering Configuration (Keep as before) ---
const tagStyles = {
  /* ... same as before ... */ p: { marginVertical: 8, lineHeight: 21 },
  ul: { marginVertical: 8, marginLeft: 5 },
  ol: { marginVertical: 8, marginLeft: 5 },
  li: { marginVertical: 4, marginLeft: 10 },
  strong: { fontWeight: "bold" },
  h3: { fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  "info-box": {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  "info-box.yellow": { borderColor: "#F59E0B", backgroundColor: "#FEF3C7" },
  "info-box.blue": { borderColor: "#3B82F6", backgroundColor: "#DBEAFE" },
  "info-box.green": { borderColor: "#10B981", backgroundColor: "#D1FAE5" },
};

// Custom renderer example for the quiz link placeholder
const QuizLinkRenderer = ({ TDefaultRenderer, tnode, ...props }: any) => {
  const router = useRouter();
  const lessonId = tnode?.attributes?.["data-lesson-id"]; // Get ID from placeholder

  const handleQuizPress = () => {
    if (lessonId) {
      router.push(`/learn/quiz/${lessonId}`);
    } else {
      console.warn("Lesson ID missing for quiz link");
    }
  };
  return (
    <Button
      mode="contained"
      onPress={handleQuizPress}
      style={{ marginTop: 15 }}
    >
      Take the Quiz
    </Button>
  );
};

const renderers = {
  "quiz-link-placeholder": QuizLinkRenderer,
};
// --- End HTML Rendering Config ---

export default function LessonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>(); // Get ID from route params
  const {
    colors: { primary },
  } = useAppTheme();
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);

  const lessonId = params.id; // Renamed for clarity
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [lesson, setLesson] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  // --- Auth Check Effect ---
  useEffect(() => {
    if (isAuthenticated === false) {
      // Check explicit false after initial load
      router.replace("/(auth)");
    }
  }, [isAuthenticated, router]);

  // --- Lesson Fetch Effect ---
  useEffect(() => {
    const loadLesson = async () => {
      if (!lessonId) return; // Guard if ID is somehow missing
      setIsLoading(true);
      const data = await fetchLessonById(lessonId);
      setLesson(data);
      setCurrentStep(0);
      setCompleted(false);
      setIsLoading(false);
    };
    // if (isAuthenticated && lessonId) {
    loadLesson();
    // } else if (!isAuthenticated) {
    //   setIsLoading(false);
    // }
  }, [lessonId, isAuthenticated]);

  // --- Event Handlers (Keep as before, replace navigation) ---
  const handleComplete = () => {
    setCompleted(true);
    console.log(`Lesson ${lessonId} completed!`);
    // TODO: Dispatch action
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };
  const handleNext = () => {
    if (lesson && currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      handleComplete();
    }
  };
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };
  const goToStep = (index: number) => {
    if (index >= 0 && lesson && index < lesson.steps.length) {
      setCurrentStep(index);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };
  // Use router.back() instead of navigation.goBack()
  const navigateToLearn = () => router.push("/learn");

  // // --- Render Logic ---
  // if (!isAuthenticated)
  //   return (
  //     <View style={styles.centered}>
  //       <ActivityIndicator />
  //     </View>
  //   ); // Placeholder during redirect
  // if (isLoading)
  //   return (
  //     <View style={styles.centered}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* Use Stack Screen options for header */}
        <Stack.Screen options={{ title: "Error" }} />
        <View style={styles.centered}>
          <Text variant="headlineSmall">Lesson Not Found</Text>
          <Button onPress={() => router.back()} style={{ marginTop: 10 }}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const progress = (currentStep + 1) / lesson.steps.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{ title: lesson.title, headerTitleAlign: "center" }}
      />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Lesson Header Info Card (Keep as before) */}
        <Card style={styles.card} mode="outlined">
          {/* ... MetaRow, Progress Bar, Outline Accordion ... */}
          <Card.Content>
            <View style={styles.metaRow}>
              <Chip icon="clock-outline">{lesson.duration}</Chip>
              <Chip icon="school-outline">{lesson.difficulty}</Chip>
              <Chip icon="tag-outline">{lesson.category}</Chip>
            </View>
            <View style={styles.progressContainer}>
              <Text variant="labelMedium" style={styles.progressText}>
                Progress: Step {currentStep + 1} of {lesson.steps.length}
              </Text>
              <ProgressBar
                progress={progress}
                color={primary}
                style={styles.progressBar}
              />
            </View>
            <List.Accordion
              title="Lesson Outline"
              id="lesson-outline"
              left={(props) => (
                <List.Icon {...props} icon="format-list-bulleted" />
              )}
            >
              {lesson.steps.map((step: any, index: number) => (
                <List.Item
                  key={index}
                  title={step.title}
                  left={(props) => (
                    <Avatar.Text
                      {...props}
                      size={24}
                      label={`${index + 1}`}
                      style={styles.stepNumberAvatar}
                    />
                  )}
                  onPress={() => goToStep(index)}
                  style={[
                    styles.outlineItem,
                    currentStep === index && styles.outlineItemActive,
                  ]}
                  titleStyle={[
                    styles.outlineTitle,
                    currentStep === index && styles.outlineTitleActive,
                  ]}
                  right={(props) =>
                    index < currentStep ? (
                      <List.Icon
                        {...props}
                        icon="check-circle"
                        color={primary}
                      />
                    ) : null
                  }
                />
              ))}
            </List.Accordion>
          </Card.Content>
        </Card>

        {/* Current Step Content Card (Keep as before) */}
        <Card style={styles.card} mode="elevated">
          <Card.Title
            title={lesson.steps[currentStep].title}
            titleVariant="headlineSmall"
            titleStyle={styles.stepTitle}
          />
          <Card.Content>
            {/* Pass the router to the renderer props if needed */}
            <RenderHTML
              contentWidth={width - 64}
              source={{ html: lesson.steps[currentStep].content }}
              tagsStyles={tagStyles}
              renderers={renderers}
              baseStyle={styles.htmlBaseStyle}
            />
          </Card.Content>
          <Card.Actions style={styles.navActions}>
            <Button
              icon="arrow-left"
              mode="outlined"
              onPress={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              icon={
                completed
                  ? "check-circle"
                  : currentStep < lesson.steps.length - 1
                  ? "arrow-right"
                  : "check"
              }
              mode="contained"
              onPress={handleNext}
              disabled={completed}
            >
              {completed
                ? "Completed"
                : currentStep < lesson.steps.length - 1
                ? "Next"
                : "Complete Lesson"}
            </Button>
          </Card.Actions>
        </Card>

        {/* Completion Card (Keep as before, update navigation) */}
        {completed && (
          <Card style={[styles.card, styles.completionCard]} mode="contained">
            <Card.Content style={styles.completionContent}>
              <Avatar.Icon
                size={54}
                icon="check-decagram"
                style={styles.completionIcon}
              />
              <Text variant="headlineMedium" style={styles.completionTitle}>
                Lesson Completed!
              </Text>
              <Text variant="titleMedium" style={styles.completionSubtitle}>
                You've earned {lesson.points} learning points.
              </Text>
              {/* {lesson.badge &&  */}( /* Badge display */ ){/* } */}
              <View style={styles.completionActions}>
                {lesson.steps.some((step: any) =>
                  step.content?.includes("quiz-link-placeholder")
                ) && (
                  <Button
                    mode="contained"
                    icon="head-question"
                    style={styles.completionButton}
                    onPress={() => router.push(`/learn/quiz/${lessonId}`)}
                  >
                    Take the Quiz
                  </Button>
                )}
                <Button
                  mode="outlined"
                  icon="arrow-left"
                  style={styles.completionButton}
                  onPress={navigateToLearn}
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

// --- Styles (Keep styles from previous LessonScreen conversion) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 16 },
  card: { marginBottom: 16 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  progressContainer: { marginVertical: 10 },
  progressBar: { height: 8, borderRadius: 4, marginTop: 4 },
  progressText: { textAlign: "center" },
  stepTitle: { fontWeight: "bold", marginBottom: 10 },
  htmlBaseStyle: { color: "#333", fontSize: 16 }, // Base text color/size for HTML
  navActions: { justifyContent: "space-between", paddingVertical: 8 },
  completionCard: { backgroundColor: "#D1FAE5" }, // Light green background
  completionContent: { alignItems: "center", paddingVertical: 20 },
  completionIcon: { backgroundColor: "#10B981", marginBottom: 15 }, // Green icon bg
  completionTitle: { fontWeight: "bold", marginBottom: 5 },
  completionSubtitle: { marginBottom: 20 },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    width: "90%",
  },
  badgeIcon: { backgroundColor: "#eee" },
  badgeTextContainer: { marginLeft: 15, flexShrink: 1 },
  completionActions: { marginTop: 15, width: "90%" },
  completionButton: { marginVertical: 5 },
  outlineItem: { backgroundColor: "#f0f0f0", borderRadius: 4, marginBottom: 2 },
  outlineItemActive: { backgroundColor: "#DBEAFE" }, // Light blue for active
  outlineTitle: {},
  outlineTitleActive: { fontWeight: "bold" },
  stepNumberAvatar: { marginRight: 10 },
});
