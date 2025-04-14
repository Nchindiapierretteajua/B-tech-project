import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, Link, Stack } from "expo-router";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/lib/features/auth/authSlice"; // Adjust path
import type { AppDispatch, RootState } from "@/lib/store"; // Adjust path
import {
  Text,
  TextInput,
  Button,
  HelperText,
  RadioButton,
  ActivityIndicator,
} from "react-native-paper";
import { useAppTheme } from "../_layout";

// --- Schema and Types ---
const phoneRegex = /^(?:\+237)?[6-9]\d{8}$/;
const loginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Invalid Cameroon phone (e.g., 6XXXXXXXX)"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["citizen", "service-provider"]),
});
type LoginFormValues = z.infer<typeof loginSchema>;
// --- ---

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { error, loading } = useSelector((state: RootState) => state.auth); // Get error/loading state
  const [secureTextEntry, setSecureTextEntry] = useState(true); // For password visibility

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phoneNumber: "", password: "", role: "citizen" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    dispatch(loginStart()); // Indicate loading start
    try {
      let formattedPhone = data.phoneNumber.startsWith("+237")
        ? data.phoneNumber
        : `+237${data.phoneNumber}`;

      // --- Simulate API Call ---
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Replace with actual API call: const response = await api.login(...)
      // Mock success based on input for demo
      if (data.password === "password123") {
        // Simple mock check
        const mockUserData = {
          id: `user-${Math.random().toString(36).substring(7)}`,
          name:
            data.role === "citizen" ? "John Nkongho" : "Mock Service Provider",
          phoneNumber: formattedPhone,
          role: data.role,
          organization:
            data.role === "service-provider" ? "Mock Ministry" : undefined,
          favorites: [], // Example
        };
        dispatch(loginSuccess(mockUserData));

        // Redirect using Expo Router
        if (data.role === "citizen") {
          router.replace("/(pubcam)"); // Go to home tab/screen
        } else {
          // Redirect to the initial screen of the provider dashboard drawer
          router.replace("/(pubcam)/service-provider/dashboard"); // Path defined in (provider) layout
        }
      } else {
        throw new Error("Invalid credentials"); // Simulate API error
      }
      // --- End Simulation ---
    } catch (err: any) {
      console.error("Login failed:", err);
      dispatch(
        loginFailure(err.message || "Login failed. Please check credentials.")
      );
    }
    // Loading state is handled by Redux `loading` selector now
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: "Login", headerBackTitle: "Back" }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text
            variant="headlineLarge"
            style={[styles.title, { color: colors.primary }]}
          >
            Welcome Back!
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Login to continue.
          </Text>

          {/* Display Login Error */}
          {error && !loading && (
            <HelperText
              type="error"
              visible={!!error}
              style={styles.generalError}
            >
              {error}
            </HelperText>
          )}

          {/* Phone Number */}
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Phone Number"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.phoneNumber}
                style={styles.input}
                keyboardType="phone-pad"
                maxLength={9}
                left={<TextInput.Affix text="+237 " />}
              />
            )}
          />
          {errors.phoneNumber && (
            <HelperText type="error" visible={!!errors.phoneNumber}>
              {errors.phoneNumber.message}
            </HelperText>
          )}

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.password}
                style={styles.input}
                secureTextEntry={secureTextEntry}
                right={
                  <TextInput.Icon
                    icon={secureTextEntry ? "eye-off" : "eye"}
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                  />
                }
              />
            )}
          />
          {errors.password && (
            <HelperText type="error" visible={!!errors.password}>
              {errors.password.message}
            </HelperText>
          )}

          {/* Role Selection */}
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }) => (
              <View style={styles.radioContainer}>
                <Text variant="labelLarge">Login as:</Text>
                <RadioButton.Group onValueChange={onChange} value={value}>
                  <View style={styles.radioOption}>
                    <RadioButton value="citizen" />
                    <Text>Citizen</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton value="service-provider" />
                    <Text>Service Provider</Text>
                  </View>
                </RadioButton.Group>
              </View>
            )}
          />

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            icon="login"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Link to Register */}
          <View style={styles.linkContainer}>
            <Text>Don't have an account? </Text>
            <Link href="/register" asChild>
              <Button mode="text" compact disabled={loading}>
                Register
              </Button>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center" },
  container: { padding: 24, gap: 10 }, // Use gap for spacing
  title: { fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  subtitle: { textAlign: "center", marginBottom: 20 },
  input: {
    /* Default outlined is okay */
  },
  button: { marginTop: 20, paddingVertical: 8 },
  buttonLabel: { fontSize: 16 },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  radioContainer: { marginTop: 10, marginBottom: 5 },
  radioOption: { flexDirection: "row", alignItems: "center" },
  generalError: { fontSize: 14, textAlign: "center", marginBottom: 10 },
});
