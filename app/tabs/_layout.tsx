import { Tabs } from "expo-router";
import { Home, Building2, Search, Bell, Settings } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { View, Text } from "react-native";
import { getUnreadCount } from "@/lib/api/notifications";

export default function TabsLayout() {
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: getUnreadCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1B2838",
          borderTopColor: "#2D3748",
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#4A90A4",
        tabBarInactiveTintColor: "#718096",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="properties"
        options={{
          title: "Properties",
          tabBarIcon: ({ color, size }) => <Building2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Bell size={size} color={color} />
              {unreadCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-accent-red rounded-full w-4 h-4 items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
