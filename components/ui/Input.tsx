import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextEntry,
  className = "",
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry !== undefined;

  return (
    <View className="w-full">
      {label && (
        <Text className="text-text-secondary text-sm mb-2 font-medium">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-background-card border rounded-xl px-4 ${
          error ? "border-accent-red" : "border-border"
        }`}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          className={`flex-1 text-white py-4 text-base ${className}`}
          placeholderTextColor="#718096"
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="ml-3"
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color="#718096" />
            ) : (
              <Eye size={20} color="#718096" />
            )}
          </TouchableOpacity>
        ) : (
          rightIcon && <View className="ml-3">{rightIcon}</View>
        )}
      </View>
      {error && (
        <Text className="text-accent-red text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}
