import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { TrendingUp, TrendingDown } from "lucide-react-native";
import type { Investment } from "@/types/database";
import { Card } from "../ui/Card";

interface PortfolioCardProps {
  investment: Investment;
}

export function PortfolioCard({ investment }: PortfolioCardProps) {
  const router = useRouter();
  const property = investment.property;

  if (!property) return null;

  const currentValue = investment.shares_owned * property.share_price;
  const gainLoss = currentValue - investment.total_invested;
  const gainLossPercentage = (gainLoss / investment.total_invested) * 100;
  const isPositive = gainLoss >= 0;

  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Card className="flex-row items-center">
        <Image
          source={{ uri: property.thumbnail_url || "https://via.placeholder.com/60" }}
          className="w-14 h-14 rounded-xl"
          resizeMode="cover"
        />
        <View className="flex-1 ml-3">
          <Text className="text-white font-semibold text-base" numberOfLines={1}>
            {property.name}
          </Text>
          <Text className="text-text-secondary text-sm">
            {investment.shares_owned} shares
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-white font-bold text-base">
            {formatCurrency(currentValue)}
          </Text>
          <View className="flex-row items-center">
            {isPositive ? (
              <TrendingUp size={12} color="#4CAF50" />
            ) : (
              <TrendingDown size={12} color="#F44336" />
            )}
            <Text
              className={`text-sm ml-1 font-medium ${
                isPositive ? "text-accent-green" : "text-accent-red"
              }`}
            >
              {isPositive ? "+" : ""}
              {gainLossPercentage.toFixed(2)}%
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
