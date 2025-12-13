import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  TrendingUp,
  AlertCircle,
  Info,
  DollarSign,
} from "lucide-react-native";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/api/notifications";
import { Loading, Card } from "@/components/ui";
import type { Notification } from "@/types/database";

export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.is_read) {
      markReadMutation.mutate(notification.id);
    }
  };

  const getNotificationIcon = (type: Notification["notification_type"]) => {
    switch (type) {
      case "transaction":
        return <DollarSign size={20} color="#4CAF50" />;
      case "dividend":
        return <TrendingUp size={20} color="#FFD700" />;
      case "warning":
        return <AlertCircle size={20} color="#F44336" />;
      case "success":
        return <CheckCheck size={20} color="#4CAF50" />;
      default:
        return <Info size={20} color="#4A90A4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  if (isLoading && !refreshing) {
    return <Loading fullScreen message="Loading notifications..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pt-6 pb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-white text-2xl font-bold">Notifications</Text>
          {unreadCount > 0 && (
            <Text className="text-text-secondary text-sm mt-1">
              {unreadCount} unread
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={() => markAllReadMutation.mutate()}
            className="px-3 py-2 bg-background-card rounded-lg"
          >
            <Text className="text-primary text-sm font-medium">Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4A90A4"
          />
        }
      >
        {notifications && notifications.length > 0 ? (
          <View className="gap-3 pb-6">
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.8}
              >
                <Card
                  className={`flex-row ${
                    !notification.is_read ? "border-l-4 border-l-primary" : ""
                  }`}
                >
                  <View className="w-10 h-10 rounded-full bg-background-elevated items-center justify-center mr-3">
                    {getNotificationIcon(notification.notification_type)}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                      <Text
                        className={`text-base font-semibold flex-1 ${
                          notification.is_read ? "text-text-secondary" : "text-white"
                        }`}
                        numberOfLines={1}
                      >
                        {notification.title}
                      </Text>
                      <Text className="text-text-muted text-xs ml-2">
                        {formatDate(notification.created_at)}
                      </Text>
                    </View>
                    <Text
                      className={`text-sm mt-1 ${
                        notification.is_read ? "text-text-muted" : "text-text-secondary"
                      }`}
                      numberOfLines={2}
                    >
                      {notification.message}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Card className="mt-4">
            <View className="items-center py-12">
              <Bell size={48} color="#718096" />
              <Text className="text-text-secondary text-base text-center mt-4">
                No notifications yet
              </Text>
              <Text className="text-text-muted text-sm mt-2 text-center">
                We'll notify you about important updates
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
