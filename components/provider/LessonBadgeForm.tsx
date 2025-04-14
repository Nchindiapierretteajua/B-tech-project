import React from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";
import { TextInput, HelperText, Text, Avatar, Card } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";

interface BadgeData {
  badge: {
    name: string;
    icon: string;
    description: string;
  };
}

interface LessonBadgeFormProps {
  control: Control<any>;
  errors: FieldErrors<BadgeData>;
  watch: UseFormWatch<any>; // To watch icon changes for preview
}

const BADGE_ICONS = [
  "🎓",
  "📚",
  "🏆",
  "⭐",
  "🌟",
  "🔍",
  "📝",
  "✅",
  "🎯",
  "🚀",
  "💡",
  "🧠",
  "📊",
  "🔑",
  "🛠️",
  "📋",
];

export function LessonBadgeForm({
  control,
  errors,
  watch,
}: LessonBadgeFormProps) {
  const { colors } = useAppTheme();
  const watchedIcon = watch("badge.icon");
  const watchedName = watch("badge.name");
  const watchedDescription = watch("badge.description");

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="badge.name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Badge Name*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.badge?.name}
            style={styles.input}
          />
        )}
      />
      {errors.badge?.name && (
        <HelperText type="error" visible={!!errors.badge?.name}>
          {errors.badge.name.message}
        </HelperText>
      )}

      <Controller
        control={control}
        name="badge.description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Badge Description*"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.badge?.description}
            style={styles.input}
            multiline
            numberOfLines={2}
          />
        )}
      />
      {errors.badge?.description && (
        <HelperText type="error" visible={!!errors.badge?.description}>
          {errors.badge.description.message}
        </HelperText>
      )}

      <Text variant="labelLarge" style={styles.label}>
        Select Badge Icon*
      </Text>
      <Controller
        control={control}
        name="badge.icon"
        render={({ field: { onChange, value } }) => (
          <View style={styles.iconGrid}>
            {BADGE_ICONS.map((icon) => (
              <Pressable
                key={icon}
                onPress={() => onChange(icon)}
                style={[
                  styles.iconButton,
                  value === icon && styles.iconButtonSelected,
                ]}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </Pressable>
            ))}
          </View>
        )}
      />
      {errors.badge?.icon && (
        <HelperText type="error" visible={!!errors.badge?.icon}>
          {errors.badge.icon.message}
        </HelperText>
      )}

      {/* Badge Preview */}
      <Text variant="labelLarge" style={styles.label}>
        Badge Preview
      </Text>
      <Card style={styles.previewCard} mode="outlined">
        <Card.Title
          title={watchedName || "Badge Name"}
          subtitle={watchedDescription || "Description"}
          left={(props) => (
            <Avatar.Text
              {...props}
              size={40}
              label={watchedIcon || "❓"}
              style={{ backgroundColor: colors.surfaceVariant }}
            />
          )}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  input: {},
  label: { marginBottom: 5, marginTop: 10, fontWeight: "bold" },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginBottom: 10,
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "white",
  },
  iconButtonSelected: { borderColor: "blue", backgroundColor: "#DBEAFE" }, // Use theme.colors.primary etc.
  iconText: { fontSize: 24 },
  previewCard: { backgroundColor: "white", marginTop: 5 },
});
