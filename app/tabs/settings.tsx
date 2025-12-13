import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  CreditCard,
  History,
} from "lucide-react-native";
import { useAuthStore } from "@/lib/store/auth";
import { signOut } from "@/lib/api/auth";
import { Card, Button } from "@/components/ui";

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  danger?: boolean;
}

function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  danger = false,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-border"
      activeOpacity={0.7}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
          danger ? "bg-accent-red/20" : "bg-background-elevated"
        }`}
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text className={`text-base font-medium ${danger ? "text-accent-red" : "text-white"}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-text-muted text-sm mt-0.5">{subtitle}</Text>
        )}
      </View>
      {showChevron && <ChevronRight size={20} color="#718096" />}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, user } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            await signOut();
            router.replace("/auth/login");
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to sign out");
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  const showComingSoon = () => {
    Alert.alert("Coming Soon", "This feature is coming soon!");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-6 pb-4">
          <Text className="text-white text-2xl font-bold">Settings</Text>
        </View>

        {/* Profile Section */}
        <View className="px-4 mb-6">
          <Card className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-primary items-center justify-center mr-4">
              {profile?.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <Text className="text-white text-2xl font-bold">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </Text>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">
                {profile?.full_name || "User"}
              </Text>
              <Text className="text-text-secondary text-sm">{user?.email}</Text>
            </View>
            <TouchableOpacity
              onPress={showComingSoon}
              className="px-3 py-2 bg-background-elevated rounded-lg"
            >
              <Text className="text-primary text-sm font-medium">Edit</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Account Section */}
        <View className="px-4 mb-6">
          <Text className="text-text-muted text-sm font-medium mb-2 uppercase">
            Account
          </Text>
          <Card className="py-0">
            <SettingsItem
              icon={<User size={20} color="#4A90A4" />}
              title="Personal Information"
              subtitle="Name, email, phone"
              onPress={showComingSoon}
            />
            <SettingsItem
              icon={<CreditCard size={20} color="#4A90A4" />}
              title="Payment Methods"
              subtitle="Manage your payment options"
              onPress={showComingSoon}
            />
            <SettingsItem
              icon={<History size={20} color="#4A90A4" />}
              title="Transaction History"
              subtitle="View all your transactions"
              onPress={showComingSoon}
            />
            <SettingsItem
              icon={<Shield size={20} color="#4A90A4" />}
              title="Security"
              subtitle="Password, 2FA"
              onPress={showComingSoon}
              showChevron={true}
            />
          </Card>
        </View>

        {/* Preferences Section */}
        <View className="px-4 mb-6">
          <Text className="text-text-muted text-sm font-medium mb-2 uppercase">
            Preferences
          </Text>
          <Card className="py-0">
            <SettingsItem
              icon={<Bell size={20} color="#4A90A4" />}
              title="Notifications"
              subtitle="Manage notification preferences"
              onPress={showComingSoon}
            />
          </Card>
        </View>

        {/* Support Section */}
        <View className="px-4 mb-6">
          <Text className="text-text-muted text-sm font-medium mb-2 uppercase">
            Support
          </Text>
          <Card className="py-0">
            <SettingsItem
              icon={<HelpCircle size={20} color="#4A90A4" />}
              title="Help Center"
              subtitle="FAQs and support"
              onPress={showComingSoon}
            />
            <SettingsItem
              icon={<Mail size={20} color="#4A90A4" />}
              title="Contact Us"
              subtitle="Get in touch with our team"
              onPress={showComingSoon}
            />
            <SettingsItem
              icon={<FileText size={20} color="#4A90A4" />}
              title="Legal"
              subtitle="Terms, privacy policy"
              onPress={showComingSoon}
            />
          </Card>
        </View>

        {/* Logout */}
        <View className="px-4 mb-8">
          <Card className="py-0">
            <SettingsItem
              icon={<LogOut size={20} color="#F44336" />}
              title="Sign Out"
              onPress={handleLogout}
              showChevron={false}
              danger
            />
          </Card>
        </View>

        {/* App Version */}
        <View className="items-center pb-8">
          <Text className="text-text-muted text-sm">Real Equity v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
