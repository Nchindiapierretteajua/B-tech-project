import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(3, "Service name must be at least 3 characters"),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  area: z.string().min(2, "Area must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  website: z.string().url("Please enter a valid URL").optional(),
  hours: z.record(z.string(), z.string()),
  requirements: z.array(z.string().min(1, "Requirement cannot be empty")),
  tags: z.array(z.string().min(1, "Tag cannot be empty")),
  accessibility: z.boolean(),
  onlineAvailable: z.boolean(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  steps: z
    .array(
      z.object({
        title: z.string().min(3, "Step title must be at least 3 characters"),
        description: z
          .string()
          .min(10, "Step description must be at least 10 characters"),
        tips: z.array(z.string()).optional(),
        documents: z.array(z.string()).optional(),
      })
    )
    .optional(),
});

// Cameroon phone number validation
// Format: +237 6XXXXXXXX or 6XXXXXXXX
const phoneRegex = /^(?:\+237)?[6-9][0-9]{8}$/;

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z
      .string()
      .regex(phoneRegex, "Please enter a valid Cameroon phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
    role: z.enum(["citizen", "service-provider"]),
    ministry: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      !(
        data.role === "service-provider" &&
        (!data.ministry || data.ministry.length < 2)
      ),
    {
      message: "Ministry name is required for service providers",
      path: ["ministry"],
    }
  );

const loginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Please enter a valid Cameroon phone number"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["citizen", "service-provider"]),
});

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Please enter a valid Cameroon phone number"),
  email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

const searchSchema = z.object({
  query: z.string().optional(),
  location: z.string().min(2, "Please enter a valid location"),
  category: z.string().optional(),
});

const filterSchema = z.object({
  categories: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  accessibility: z.boolean().optional(),
  onlineAvailable: z.boolean().optional(),
});

const quizSchema = z.object({
  title: z.string().min(3, "Quiz title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  difficulty: z.string().min(1, "Please select a difficulty level"),
  passingScore: z
    .number()
    .min(1)
    .max(100, "Passing score must be between 1 and 100"),
  points: z.number().min(1, "Points must be at least 1"),
  relatedLessonId: z.string().optional(),
  badge: z.object({
    name: z.string().min(2, "Badge name must be at least 2 characters"),
    icon: z.string().min(1, "Please select an icon"),
    description: z
      .string()
      .min(5, "Badge description must be at least 5 characters"),
  }),
  questions: z
    .array(
      z.object({
        question: z.string().min(3, "Question must be at least 3 characters"),
        options: z
          .array(z.string().min(1, "Option cannot be empty"))
          .min(2, "At least 2 options are required"),
        correctAnswer: z.number().min(0, "Please select the correct answer"),
        explanation: z
          .string()
          .min(5, "Explanation must be at least 5 characters"),
      })
    )
    .min(1, "At least one question is required"),
});

const lessonSchema = z.object({
  title: z.string().min(3, "Lesson title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  difficulty: z.string().min(1, "Please select a difficulty level"),
  duration: z.string().min(1, "Please enter the estimated duration"),
  points: z.number().min(1, "Points must be at least 1"),
  badge: z.object({
    name: z.string().min(2, "Badge name must be at least 2 characters"),
    icon: z.string().min(1, "Please select an icon"),
    description: z
      .string()
      .min(5, "Badge description must be at least 5 characters"),
  }),
  steps: z
    .array(
      z.object({
        title: z.string().min(3, "Step title must be at least 3 characters"),
        content: z
          .string()
          .min(20, "Step content must be at least 20 characters"),
      })
    )
    .min(1, "At least one step is required"),
});
