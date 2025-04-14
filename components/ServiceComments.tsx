import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store"; // Adjust path
import {
  Card,
  Text,
  Button,
  TextInput,
  Avatar,
  Divider,
  IconButton,
  List,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { router } from "expo-router";

interface ServiceCommentsProps {
  serviceId: string;
}

// Keep the Comment type definition
interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  date: string; // Keep as string for display simplicity
  likes: number;
  userLiked: boolean; // Assuming this comes from API/state indicating if the current user liked it
  replies?: Comment[];
}

// --- Mock Data (Remove or replace with API call) ---
const initialComments: Comment[] = [
  {
    id: "comment1",
    userId: "user1",
    userName: "Marie Nguemo",
    text: "I recently used this service and it was much faster than I expected. The staff was helpful and guided me through the process.",
    date: "2023-10-15",
    likes: 12,
    userLiked: false,
  },
  {
    id: "comment2",
    userId: "user2",
    userName: "Jean-Pierre Kamdem",
    text: "Make sure to bring all your documents as listed. I had to come back twice because I was missing my proof of residence.",
    date: "2023-09-28",
    likes: 8,
    userLiked: true,
    replies: [
      {
        id: "reply1",
        userId: "user3",
        userName: "Service Provider",
        text: "Thank you for sharing your experience. We're working to make the document requirements clearer for everyone.",
        date: "2023-09-29",
        likes: 3,
        userLiked: false,
      },
    ],
  },
];
// --- End Mock Data ---

export function ServiceComments({ serviceId }: ServiceCommentsProps) {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const theme = useTheme();
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Replace local state with fetched comments from API or Redux state
  const [comments, setComments] = useState<Comment[]>(initialComments);
  // TODO: Add loading state for fetching comments
  const [commentsLoading, setCommentsLoading] = useState(false);

  const handleSubmitComment = () => {
    if (!isAuthenticated || !user) {
      router.push("/(auth)"); // Adjust navigation to your router setup
      return;
    }
    if (!commentInput.trim()) return;

    setIsSubmitting(true);
    // --- Simulate API call ---
    setTimeout(() => {
      const newComment: Comment = {
        id: `comment${Date.now()}`,
        userId: user.id, // Ensure user object has id and name
        userName: user.name || "Anonymous", // Fallback name
        text: commentInput,
        date: new Date().toISOString().split("T")[0], // Format date nicely later if needed
        likes: 0,
        userLiked: false,
      };
      setComments([newComment, ...comments]); // Add to top
      setCommentInput("");
      setIsSubmitting(false);
    }, 1000);
    // --- End Simulation ---
    // TODO: Replace simulation with actual API call
    // api.postComment(serviceId, commentInput).then(newComment => { ... });
  };

  // Simplified like handler for local state demo
  const handleLike = (targetId: string) => {
    if (!isAuthenticated) {
      router.push("/(auth)");
      return;
    }

    const updateRecursively = (items: Comment[]): Comment[] => {
      return items.map((item) => {
        if (item.id === targetId) {
          // Toggle like for the target item
          return {
            ...item,
            likes: item.userLiked ? item.likes - 1 : item.likes + 1,
            userLiked: !item.userLiked,
          };
        } else if (item.replies) {
          // If not the target, check its replies
          return { ...item, replies: updateRecursively(item.replies) };
        }
        // Not the target and no replies to check
        return item;
      });
    };

    setComments(updateRecursively(comments));
    // TODO: Add API call to persist like/unlike
    // api.toggleLike(targetId).then(...)
  };

  const handleReport = (commentId: string) => {
    console.log("Report comment:", commentId);
    // TODO: Implement reporting logic (e.g., show confirmation, call API)
    alert("Reporting functionality not yet implemented.");
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View>
      <Card style={styles.commentCard} mode="outlined">
        <Card.Title
          title={item.userName}
          subtitle={`Posted on ${item.date}`} // Simple date display
          left={(props) => (
            <Avatar.Text
              {...props}
              size={32}
              label={item.userName.substring(0, 1)}
            />
          )} // User initial
          titleStyle={styles.commentUser}
          subtitleStyle={styles.commentDate}
        />
        <Card.Content>
          <Text style={styles.commentText}>{item.text}</Text>
        </Card.Content>
        <Card.Actions style={styles.commentActions}>
          <Button
            icon={item.userLiked ? "thumb-up" : "thumb-up-outline"}
            onPress={() => handleLike(item.id)}
            compact // Smaller button
            disabled={!isAuthenticated} // Example: disable if not logged in
            textColor={
              item.userLiked
                ? theme.colors.primary
                : theme.colors.onSurfaceVariant
            }
          >
            {item.likes}
          </Button>
          <Button
            icon="flag-outline"
            onPress={() => handleReport(item.id)}
            compact
            textColor={theme.colors.onSurfaceVariant}
          >
            Report
          </Button>
          {/* Add Reply button if needed */}
          {/* <Button icon="reply" onPress={() => {}} compact>Reply</Button> */}
        </Card.Actions>

        {/* Render Replies */}
        {item.replies && item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {item.replies.map((reply) => (
              <View key={reply.id} style={styles.replyItem}>
                <List.Item
                  title={reply.userName}
                  description={reply.text}
                  left={(props) => (
                    <Avatar.Text
                      {...props}
                      size={24}
                      label={reply.userName.substring(0, 1)}
                    />
                  )}
                  titleStyle={styles.replyUser}
                  descriptionStyle={styles.replyText}
                  descriptionNumberOfLines={5} // Allow wrapping
                />
                <View style={styles.replyActions}>
                  <Text style={styles.replyDate}>{reply.date}</Text>
                  <Button
                    icon={reply.userLiked ? "thumb-up" : "thumb-up-outline"}
                    onPress={() => handleLike(reply.id)}
                    compact
                    disabled={!isAuthenticated}
                    textColor={
                      reply.userLiked
                        ? theme.colors.primary
                        : theme.colors.onSurfaceVariant
                    }
                  >
                    {reply.likes}
                  </Button>
                </View>
              </View>
            ))}
          </View>
        )}
      </Card>
    </View>
  );

  return (
    <Card style={styles.containerCard}>
      <Card.Title title="User Comments & Reviews" titleVariant="titleLarge" />
      <Card.Content>
        {/* Comment Input Form */}
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label="Share your experience"
            placeholder={
              isAuthenticated ? "Write a comment..." : "Please login to comment"
            }
            value={commentInput}
            onChangeText={setCommentInput}
            multiline
            numberOfLines={3}
            disabled={!isAuthenticated || isSubmitting}
            style={styles.textInput}
          />
          <Button
            mode="contained"
            onPress={handleSubmitComment}
            disabled={!isAuthenticated || !commentInput.trim() || isSubmitting}
            loading={isSubmitting}
            style={styles.submitButton}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </View>

        <Divider style={styles.divider} />

        {/* Comments List */}
        {commentsLoading ? (
          <ActivityIndicator animating={true} style={styles.listLoader} />
        ) : (
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Be the first to comment!</Text>
            }
            // Remove ScrollView nesting if FlatList is direct child of View/Screen
            // nestedScrollEnabled={true} // Use if necessary, but avoid if possible
          />
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  containerCard: {
    marginTop: 20, // Space above the comments section
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    marginBottom: 8,
  },
  submitButton: {
    alignSelf: "flex-end",
  },
  divider: {
    marginVertical: 16,
  },
  listLoader: {
    marginVertical: 20,
  },
  commentCard: {
    marginBottom: 12,
  },
  commentUser: {
    fontWeight: "bold",
  },
  commentDate: {
    fontSize: 12,
    color: "grey",
  },
  commentText: {
    lineHeight: 20,
  },
  commentActions: {
    justifyContent: "flex-start", // Align actions left
    paddingHorizontal: 8,
    paddingTop: 0,
  },
  repliesContainer: {
    marginTop: 10,
    marginLeft: 15, // Indent replies
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#eee",
  },
  replyItem: {
    marginBottom: 8,
  },
  replyUser: {
    fontWeight: "bold",
    fontSize: 13,
  },
  replyText: {
    fontSize: 14,
    lineHeight: 18,
  },
  replyActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 50, // Align roughly under the text
    marginTop: -5, // Adjust spacing
  },
  replyDate: {
    fontSize: 11,
    color: "grey",
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 20,
    color: "grey",
  },
});
