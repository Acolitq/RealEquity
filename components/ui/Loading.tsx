import { View, ActivityIndicator, Text } from "react-native";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message, fullScreen = false }: LoadingProps) {
  if (fullScreen) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#4A90A4" />
        {message && (
          <Text className="text-text-secondary mt-4 text-base">{message}</Text>
        )}
      </View>
    );
  }

  return (
    <View className="items-center justify-center py-8">
      <ActivityIndicator size="large" color="#4A90A4" />
      {message && (
        <Text className="text-text-secondary mt-4 text-base">{message}</Text>
      )}
    </View>
  );
}
