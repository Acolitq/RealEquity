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
import { Mail, Lock } from "lucide-react-native";
import { Button, Input } from "@/components/ui";
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
} from "@/lib/api/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      router.replace("/tabs");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSocialLoading("google");
    try {
      await signInWithGoogle();
      router.replace("/tabs");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in with Google");
    } finally {
      setSocialLoading(null);
    }
  };

  const handleAppleSignIn = async () => {
    setSocialLoading("apple");
    try {
      await signInWithApple();
      router.replace("/tabs");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in with Apple");
    } finally {
      setSocialLoading(null);
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
                Invest in real estate, simplified
              </Text>
            </View>

            {/* Login Form */}
            <View className="mb-8">
              <Text className="text-white text-2xl font-bold mb-6">
                Welcome back
              </Text>

              <View className="gap-4">
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
                      placeholder="Enter your password"
                      secureTextEntry
                      autoComplete="password"
                      leftIcon={<Lock size={20} color="#718096" />}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.password?.message}
                    />
                  )}
                />
              </View>

              <TouchableOpacity
                onPress={() => router.push("/auth/forgot-password")}
                className="mt-4 self-end"
              >
                <Text className="text-primary text-sm">Forgot password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                className="mt-6"
                size="lg"
              />
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-8">
              <View className="flex-1 h-px bg-border" />
              <Text className="text-text-muted mx-4">or continue with</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Social Login */}
            <View className="gap-3">
              <Button
                title="Continue with Google"
                variant="outline"
                onPress={handleGoogleSignIn}
                isLoading={socialLoading === "google"}
                size="lg"
              />
              {Platform.OS === "ios" && (
                <Button
                  title="Continue with Apple"
                  variant="secondary"
                  onPress={handleAppleSignIn}
                  isLoading={socialLoading === "apple"}
                  size="lg"
                />
              )}
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-auto pt-8">
              <Text className="text-text-secondary">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                <Text className="text-primary font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
