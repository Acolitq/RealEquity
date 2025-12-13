import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft } from "lucide-react-native";
import { Button, Input } from "@/components/ui";
import { resetPassword } from "@/lib/api/auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      Alert.alert(
        "Email Sent",
        "Check your email for a link to reset your password.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send reset email");
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
        <View className="flex-1 px-6 pt-4 pb-8">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-8"
          >
            <ArrowLeft size={24} color="#4A90A4" />
            <Text className="text-primary ml-2 text-base">Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-white text-2xl font-bold">
              Reset Password
            </Text>
            <Text className="text-text-secondary text-base mt-2">
              Enter your email address and we'll send you a link to reset your
              password.
            </Text>
          </View>

          {/* Form */}
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

            <Button
              title="Send Reset Link"
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              className="mt-4"
              size="lg"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
