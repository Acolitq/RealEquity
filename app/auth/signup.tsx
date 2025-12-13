import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User } from "lucide-react-native";
import { Button, Input } from "@/components/ui";
import { signUpWithEmail } from "@/lib/api/auth";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await signUpWithEmail(data.email, data.password, data.fullName);
      Alert.alert(
        "Success",
        "Account created! Please check your email to verify your account.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-12 pb-8">
            {/* Header */}
            <View className="items-center mb-12">
              <Text className="text-primary text-4xl font-bold">Real Equity</Text>
              <Text className="text-text-secondary text-base mt-2">
                Start your investment journey
              </Text>
            </View>

            {/* Signup Form */}
            <View className="mb-8">
              <Text className="text-white text-2xl font-bold mb-6">
                Create Account
              </Text>

              <View className="gap-4">
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      autoCapitalize="words"
                      autoComplete="name"
                      leftIcon={<User size={20} color="#718096" />}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.fullName?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Email"
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      leftIcon={<Mail size={20} color="#718096" />}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Password"
                      placeholder="Create a password"
                      secureTextEntry
                      autoComplete="new-password"
                      leftIcon={<Lock size={20} color="#718096" />}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.password?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      secureTextEntry
                      autoComplete="new-password"
                      leftIcon={<Lock size={20} color="#718096" />}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.confirmPassword?.message}
                    />
                  )}
                />
              </View>

              <Button
                title="Create Account"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                className="mt-6"
                size="lg"
              />
            </View>

            {/* Terms */}
            <Text className="text-text-muted text-center text-sm px-4">
              By signing up, you agree to our{" "}
              <Text className="text-primary">Terms of Service</Text> and{" "}
              <Text className="text-primary">Privacy Policy</Text>
            </Text>

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-auto pt-8">
              <Text className="text-text-secondary">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-primary font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
