import { z } from "zod";

function isAdult(dob: string): boolean {
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age >= 18;
}

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const onboardingAboutSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(isAdult, "You must be at least 18 years old to join"),
  gender: z.enum(["man", "woman", "nonbinary", "other"]),
  pronouns: z.string().max(30).optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
});

export const onboardingPreferencesSchema = z
  .object({
    interestedIn: z.enum(["men", "women", "everyone"]),
    minAge: z.number().min(18).max(99),
    maxAge: z.number().min(18).max(99),
    maxDistance: z.number().min(1).max(500),
  })
  .refine((data) => data.minAge <= data.maxAge, {
    message: "Minimum age must be less than or equal to maximum age",
    path: ["maxAge"],
  });

export const onboardingAboutYouSchema = z.object({
  bio: z.string().min(20, "Tell folks a bit more — at least 20 characters").max(500),
  occupation: z.string().max(80).optional(),
  heightCm: z.number().min(120).max(230).optional(),
  relationshipIntention: z.enum(["long_term", "marriage", "dating", "friendship", "not_sure"]),
});

export const onboardingInterestsSchema = z.object({
  interests: z.array(z.string()).min(3, "Pick at least 3 interests").max(10),
});

export const onboardingPromptsSchema = z.object({
  prompts: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1, "Answer required").max(300),
      }),
    )
    .length(3, "Answer exactly 3 prompts"),
});

export const profileEditSchema = z.object({
  bio: z.string().min(20).max(500),
  occupation: z.string().max(80).optional(),
  heightCm: z.number().min(120).max(230).optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  relationshipIntention: z.enum(["long_term", "marriage", "dating", "friendship", "not_sure"]),
  interests: z.array(z.string()).min(3).max(10),
});

export const preferencesSchema = z.object({
  interestedIn: z.enum(["men", "women", "everyone"]),
  minAge: z.number().min(18).max(99),
  maxAge: z.number().min(18).max(99),
  maxDistance: z.number().min(1).max(500),
  intentions: z.array(
    z.enum(["long_term", "marriage", "dating", "friendship", "not_sure"]),
  ),
  dealbreakerInterests: z.array(z.string()).optional(),
});

export const reportSchema = z.object({
  reason: z.string().min(1, "Select a reason"),
  details: z.string().max(500).optional(),
});

export const messageSchema = z.object({
  body: z.string().min(1).max(2000),
});
