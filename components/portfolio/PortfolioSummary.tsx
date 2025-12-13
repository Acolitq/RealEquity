import { View, Text } from "react-native";
import { TrendingUp, TrendingDown, Building2, Wallet } from "lucide-react-native";
import type { PortfolioSummary as PortfolioSummaryType } from "@/types/database";
import { Card } from "../ui/Card";

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
}

export function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  const isPositive = summary.total_return >= 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="bg-gradient-to-br from-primary to-primary-dark">
      <View className="items-center mb-4">
        <Text className="text-white/70 text-sm">Total Portfolio Value</Text>
        <Text className="text-white font-bold text-4xl mt-1">
          {formatCurrency(summary.current_value)}
        </Text>
        <View className="flex-row items-center mt-2">
          {isPositive ? (
            <TrendingUp size={16} color="#4CAF50" />
          ) : (
            <TrendingDown size={16} color="#F44336" />
          )}
          <Text
            className={`ml-1 font-semibold ${
              isPositive ? "text-accent-green" : "text-accent-red"
            }`}
          >
            {isPositive ? "+" : ""}
            {formatCurrency(summary.total_return)} ({summary.return_percentage.toFixed(2)}%)
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mt-4 pt-4 border-t border-white/20">
        <View className="items-center flex-1">
          <View className="flex-row items-center">
            <Wallet size={14} color="rgba(255,255,255,0.7)" />
            <Text className="text-white/70 text-xs ml-1">Invested</Text>
          </View>
          <Text className="text-white font-semibold text-base mt-1">
            {formatCurrency(summary.total_invested)}
          </Text>
        </View>
        <View className="w-px bg-white/20" />
        <View className="items-center flex-1">
          <View className="flex-row items-center">
            <Building2 size={14} color="rgba(255,255,255,0.7)" />
            <Text className="text-white/70 text-xs ml-1">Properties</Text>
          </View>
          <Text className="text-white font-semibold text-base mt-1">
            {summary.total_properties}
          </Text>
        </View>
      </View>
    </Card>
  );
}
