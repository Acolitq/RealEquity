import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MapPin, TrendingUp } from "lucide-react-native";
import type { Property } from "@/types/database";
import { Card } from "../ui/Card";

interface PropertyCardProps {
  property: Property;
  variant?: "default" | "compact" | "horizontal";
}

export function PropertyCard({ property, variant = "default" }: PropertyCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number | null) => {
    if (value === null) return "N/A";
    return `${value.toFixed(1)}%`;
  };

  const getStatusBadge = () => {
    switch (property.status) {
      case "coming_soon":
        return (
          <View className="absolute top-3 left-3 bg-accent-gold px-2 py-1 rounded-md">
            <Text className="text-xs font-semibold text-background">Coming Soon</Text>
          </View>
        );
      case "sold_out":
        return (
          <View className="absolute top-3 left-3 bg-accent-red px-2 py-1 rounded-md">
            <Text className="text-xs font-semibold text-white">Sold Out</Text>
          </View>
        );
      default:
        return null;
    }
  };

  if (variant === "horizontal") {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Card className="flex-row overflow-hidden p-0">
          <Image
            source={{ uri: property.thumbnail_url || "https://via.placeholder.com/120" }}
            className="w-28 h-28"
            resizeMode="cover"
          />
          <View className="flex-1 p-3 justify-between">
            <View>
              <Text className="text-white font-semibold text-base" numberOfLines={1}>
                {property.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <MapPin size={12} color="#A0AEC0" />
                <Text className="text-text-secondary text-xs ml-1">
                  {property.city}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between items-end">
              <Text className="text-primary font-bold text-base">
                {formatCurrency(property.share_price)}
                <Text className="text-text-muted text-xs font-normal">/share</Text>
              </Text>
              <View className="flex-row items-center">
                <TrendingUp size={12} color="#4CAF50" />
                <Text className="text-accent-green text-xs ml-1 font-medium">
                  {formatPercentage(property.annual_return_rate)}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  if (variant === "compact") {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8} className="w-40">
        <Card className="p-0 overflow-hidden">
          <View className="relative">
            <Image
              source={{ uri: property.thumbnail_url || "https://via.placeholder.com/160" }}
              className="w-full h-24"
              resizeMode="cover"
            />
            {getStatusBadge()}
          </View>
          <View className="p-3">
            <Text className="text-white font-semibold text-sm" numberOfLines={1}>
              {property.name}
            </Text>
            <Text className="text-text-secondary text-xs mt-1">{property.city}</Text>
            <Text className="text-primary font-bold text-sm mt-2">
              {formatCurrency(property.share_price)}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  // Default variant
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Card className="p-0 overflow-hidden">
        <View className="relative">
          <Image
            source={{ uri: property.thumbnail_url || "https://via.placeholder.com/400" }}
            className="w-full h-48"
            resizeMode="cover"
          />
          {getStatusBadge()}
          <View className="absolute bottom-3 right-3 bg-background/80 px-2 py-1 rounded-md">
            <Text className="text-white text-xs font-medium capitalize">
              {property.property_type}
            </Text>
          </View>
        </View>
        <View className="p-4">
          <Text className="text-white font-bold text-lg" numberOfLines={1}>
            {property.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <MapPin size={14} color="#A0AEC0" />
            <Text className="text-text-secondary text-sm ml-1">
              {property.address}, {property.city}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center mt-4">
            <View>
              <Text className="text-text-muted text-xs">Share Price</Text>
              <Text className="text-primary font-bold text-xl">
                {formatCurrency(property.share_price)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-text-muted text-xs">Annual Return</Text>
              <View className="flex-row items-center">
                <TrendingUp size={16} color="#4CAF50" />
                <Text className="text-accent-green font-bold text-xl ml-1">
                  {formatPercentage(property.annual_return_rate)}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-4 bg-background-elevated rounded-lg p-3">
            <View className="flex-row justify-between">
              <Text className="text-text-secondary text-sm">Available Shares</Text>
              <Text className="text-white text-sm font-medium">
                {property.available_shares.toLocaleString()} / {property.total_shares.toLocaleString()}
              </Text>
            </View>
            <View className="mt-2 h-2 bg-background rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${((property.total_shares - property.available_shares) / property.total_shares) * 100}%`,
                }}
              />
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
