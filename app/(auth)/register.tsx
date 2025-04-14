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
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z
      .string()
      .regex(phoneRegex, "Invalid Cameroon phone (e.g., 6XXXXXXXX)"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    role: z.enum(["citizen", "service-provider"]),
    organization: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      !(
        data.role === "service-provider" &&
        (!data.organization || data.organization.trim().length < 2)
      ),
    {
      message: "Organization name required (min 2 chars)",
      path: ["organization"],
    }
  );
type RegisterFormValues = z.infer<typeof registerSchema>;
// --- ---

export default function RegisterScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { error, loading } = useSelector((state: RootState) => state.auth);
  const [securePasswordEntry, setSecurePasswordEntry] = useState(true);
  const [secureConfirmEntry, setSecureConfirmEntry] = useState(true);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: "citizen",
      organization: "",
    },
  });

  const selectedRole = watch("role"); // Watch role to conditionally show organization

  const onSubmit = async (data: RegisterFormValues) => {
    dispatch(loginStart());
    try {
      let formattedPhone = data.phoneNumber.startsWith("+237")
        ? data.phoneNumber
        : `+237${data.phoneNumber}`;

      // --- Simulate API Call ---
      console.log("Registering with:", {
        ...data,
        phoneNumber: formattedPhone,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Replace with actual API call: const response = await api.register(...)
      // Mock success
      const mockUserData = {
        id: `user-${Math.random().toString(36).substring(7)}`,
        name: data.name,
        phoneNumber: formattedPhone,
        role: data.role,
        organization:
          data.role === "service-provider" ? data.organization : undefined,
        favorites: [],
      };
      dispatch(loginSuccess(mockUserData));

      // Redirect using Expo Router
      if (data.role === "citizen") {
        router.replace("/");
      } else {
        router.replace("/(pubcam)/service-provider/dashboard"); // Go to provider dashboard
      }
      // --- End Simulation ---
    } catch (err: any) {
      console.error("Registration failed:", err);
      dispatch(
        loginFailure(err.message || "Registration failed. Please try again.")
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <Stack.Screen
        options={{ title: "Create Account", headerBackTitle: "Back" }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text
            variant="headlineLarge"
            style={[styles.title, { color: colors.primary }]}
          >
            Create Account
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Join the community.
          </Text>

          {error && !loading && (
            <HelperText
              type="error"
              visible={!!error}
              style={styles.generalError}
            >
              {error}
            </HelperText>
          )}

          {/* Name */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Full Name"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.name}
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
              />
            )}
          />
          {errors.name && (
            <HelperText type="error" visible={!!errors.name}>
              {errors.name.message}
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
                secureTextEntry={securePasswordEntry}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={securePasswordEntry ? "eye-off" : "eye"}
                    onPress={() => setSecurePasswordEntry(!securePasswordEntry)}
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

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Confirm Password"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.confirmPassword}
                style={styles.input}
                secureTextEntry={secureConfirmEntry}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={secureConfirmEntry ? "eye-off" : "eye"}
                    onPress={() => setSecureConfirmEntry(!secureConfirmEntry)}
                  />
                }
              />
            )}
          />
          {errors.confirmPassword && (
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword.message}
            </HelperText>
          )}

          {/* Role Selection */}
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }) => (
              <View style={styles.radioContainer}>
                <Text variant="labelLarge">Register as:</Text>
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

          {/* Organization (Conditional) */}
          {selectedRole === "service-provider" && (
            <>
              <Controller
                control={control}
                name="organization"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Organization Name"
                    mode="outlined"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={!!errors.organization}
                    style={styles.input}
                    left={<TextInput.Icon icon="domain" />}
                  />
                )}
              />
              {errors.organization && (
                <HelperText type="error" visible={!!errors.organization}>
                  {errors.organization.message}
                </HelperText>
              )}
            </>
          )}

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            icon="account-plus"
          >
            {loading ? "Creating Account..." : "Register"}
          </Button>

          {/* Link to Login */}
          <View style={styles.linkContainer}>
            <Text>Already have an account? </Text>
            <Link href="/(auth)" asChild>
              <Button mode="text" compact disabled={loading}>
                Login
              </Button>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Use similar styles as LoginScreen
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center" },
  container: { padding: 24, gap: 10 },
  title: { fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  subtitle: { textAlign: "center", marginBottom: 20 },
  input: {},
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
