import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth";
import { getPortfolioSummary, getInvestments } from "@/lib/api/portfolio";
import { getFeaturedProperties } from "@/lib/api/properties";
import { Loading, Card } from "@/components/ui";
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PropertyCard } from "@/components/property/PropertyCard";
import { useState } from "react";

export default function HomeScreen() {
  const { profile } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: portfolioSummary,
    isLoading: isLoadingPortfolio,
    refetch: refetchPortfolio,
  } = useQuery({
    queryKey: ["portfolioSummary"],
    queryFn: getPortfolioSummary,
  });

  const {
    data: investments,
    isLoading: isLoadingInvestments,
    refetch: refetchInvestments,
  } = useQuery({
    queryKey: ["investments"],
    queryFn: getInvestments,
  });

  const {
    data: featuredProperties,
    isLoading: isLoadingFeatured,
    refetch: refetchFeatured,
  } = useQuery({
    queryKey: ["featuredProperties"],
    queryFn: () => getFeaturedProperties(5),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchPortfolio(),
      refetchInvestments(),
      refetchFeatured(),
    ]);
    setRefreshing(false);
  };

  const isLoading = isLoadingPortfolio || isLoadingInvestments || isLoadingFeatured;

  if (isLoading && !refreshing) {
    return <Loading fullScreen message="Loading your portfolio..." />;
  }

  const firstName = profile?.full_name?.split(" ")[0] || "Investor";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4A90A4"
          />
        }
      >
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-text-secondary text-base">Welcome back,</Text>
            <Text className="text-white text-2xl font-bold">{firstName}</Text>
          </View>

          {/* Portfolio Summary */}
          {portfolioSummary && (
            <View className="mb-6">
              <PortfolioSummary summary={portfolioSummary} />
            </View>
          )}

          {/* Your Investments */}
          <View className="mb-6">
            <Text className="text-white text-lg font-bold mb-4">
              Your Investments
            </Text>
            {investments && investments.length > 0 ? (
              <View className="gap-3">
                {investments.slice(0, 5).map((investment) => (
                  <PortfolioCard key={investment.id} investment={investment} />
                ))}
              </View>
            ) : (
              <Card>
                <View className="items-center py-6">
                  <Text className="text-text-secondary text-base text-center">
                    You haven't invested in any properties yet.
                  </Text>
                  <Text className="text-primary text-sm mt-2">
                    Browse properties to get started →
                  </Text>
                </View>
              </Card>
            )}
          </View>

          {/* Featured Properties */}
          <View className="mb-6">
            <Text className="text-white text-lg font-bold mb-4">
              Featured Properties
            </Text>
            {featuredProperties && featuredProperties.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-4 px-4"
              >
                <View className="flex-row gap-3">
                  {featuredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      variant="compact"
                    />
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Card>
                <Text className="text-text-secondary text-center py-4">
                  No featured properties available
                </Text>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
