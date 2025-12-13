import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth";
import { Loading } from "@/components/ui/Loading";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function RootLayoutNav() {
  const { isLoading, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!isInitialized || isLoading) {
    return <Loading fullScreen message="Loading..." />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0D1B2A" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="tabs" />
        <Stack.Screen
          name="property/[id]"
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
            headerTintColor: "#FFFFFF",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}
