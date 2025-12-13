import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  TrendingUp,
  Building2,
  Heart,
  Share2,
  X,
  Plus,
  Minus,
} from "lucide-react-native";
import { getProperty } from "@/lib/api/properties";
import {
  getInvestmentForProperty,
  buyShares,
  sellShares,
} from "@/lib/api/portfolio";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/api/watchlist";
import { Loading, Button, Card } from "@/components/ui";

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [shares, setShares] = useState(1);

  const { data: property, isLoading: isLoadingProperty } = useQuery({
    queryKey: ["property", id],
    queryFn: () => getProperty(id!),
    enabled: !!id,
  });

  const { data: investment, isLoading: isLoadingInvestment } = useQuery({
    queryKey: ["investment", id],
    queryFn: () => getInvestmentForProperty(id!),
    enabled: !!id,
  });

  const { data: inWatchlist } = useQuery({
    queryKey: ["watchlist", id],
    queryFn: () => isInWatchlist(id!),
    enabled: !!id,
  });

  const buyMutation = useMutation({
    mutationFn: () => buyShares(id!, shares),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["property", id] });
      queryClient.invalidateQueries({ queryKey: ["investment", id] });
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      queryClient.invalidateQueries({ queryKey: ["portfolioSummary"] });
      setShowBuyModal(false);
      setShares(1);
      Alert.alert(
        "Purchase Successful!",
        `You bought ${shares} shares for $${data.total_amount.toFixed(2)}`
      );
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to buy shares");
    },
  });

  const sellMutation = useMutation({
    mutationFn: () => sellShares(id!, shares),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["property", id] });
      queryClient.invalidateQueries({ queryKey: ["investment", id] });
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      queryClient.invalidateQueries({ queryKey: ["portfolioSummary"] });
      setShowSellModal(false);
      setShares(1);
      Alert.alert(
        "Sale Successful!",
        `You sold ${shares} shares for $${data.total_amount.toFixed(2)}`
      );
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to sell shares");
    },
  });

  const watchlistMutation = useMutation({
    mutationFn: () =>
      inWatchlist ? removeFromWatchlist(id!) : addToWatchlist(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", id] });
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  if (isLoadingProperty) {
    return <Loading fullScreen message="Loading property..." />;
  }

  if (!property) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-white text-lg">Property not found</Text>
        <Button title="Go Back" onPress={() => router.back()} className="mt-4" />
      </SafeAreaView>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const totalCost = shares * property.share_price;
  const canBuy = property.status === "active" && shares <= property.available_shares;
  const canSell = investment && shares <= investment.shares_owned;

  const renderTransactionModal = (type: "buy" | "sell") => {
    const isOpen = type === "buy" ? showBuyModal : showSellModal;
    const setIsOpen = type === "buy" ? setShowBuyModal : setShowSellModal;
    const mutation = type === "buy" ? buyMutation : sellMutation;
    const maxShares =
      type === "buy" ? property.available_shares : investment?.shares_owned || 0;
    const canSubmit = type === "buy" ? canBuy : canSell;

    return (
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-background-card rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-bold">
                {type === "buy" ? "Buy Shares" : "Sell Shares"}
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <X size={24} color="#718096" />
              </TouchableOpacity>
            </View>

            <View className="items-center mb-6">
              <Text className="text-text-secondary mb-4">Number of Shares</Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => setShares(Math.max(1, shares - 1))}
                  className="w-12 h-12 bg-background-elevated rounded-full items-center justify-center"
                >
                  <Minus size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TextInput
                  className="text-white text-4xl font-bold mx-8 min-w-[80px] text-center"
                  value={shares.toString()}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 0;
                    setShares(Math.min(Math.max(0, num), maxShares));
                  }}
                  keyboardType="number-pad"
                />
                <TouchableOpacity
                  onPress={() => setShares(Math.min(maxShares, shares + 1))}
                  className="w-12 h-12 bg-background-elevated rounded-full items-center justify-center"
                >
                  <Plus size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <Text className="text-text-muted text-sm mt-2">
                Max: {maxShares.toLocaleString()} shares
              </Text>
            </View>

            <Card className="mb-6">
              <View className="flex-row justify-between mb-2">
                <Text className="text-text-secondary">Price per share</Text>
                <Text className="text-white font-medium">
                  {formatCurrency(property.share_price)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-text-secondary">Shares</Text>
                <Text className="text-white font-medium">×{shares}</Text>
              </View>
              <View className="h-px bg-border my-2" />
              <View className="flex-row justify-between">
                <Text className="text-white font-bold">Total</Text>
                <Text className="text-primary font-bold text-xl">
                  {formatCurrency(totalCost)}
                </Text>
              </View>
            </Card>

            <Button
              title={
                type === "buy"
                  ? `Buy ${shares} Share${shares > 1 ? "s" : ""}`
                  : `Sell ${shares} Share${shares > 1 ? "s" : ""}`
              }
              onPress={() => mutation.mutate()}
              isLoading={mutation.isPending}
              disabled={!canSubmit || shares === 0}
              variant={type === "buy" ? "primary" : "danger"}
              size="lg"
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Property Image */}
        <View className="relative">
          <Image
            source={{
              uri: property.thumbnail_url || "https://via.placeholder.com/400",
            }}
            className="w-full h-72"
            resizeMode="cover"
          />
          <View className="absolute top-12 right-4 flex-row gap-2">
            <TouchableOpacity
              onPress={() => watchlistMutation.mutate()}
              className="w-10 h-10 bg-background/80 rounded-full items-center justify-center"
            >
              <Heart
                size={20}
                color={inWatchlist ? "#F44336" : "#FFFFFF"}
                fill={inWatchlist ? "#F44336" : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-background/80 rounded-full items-center justify-center">
              <Share2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View className="absolute bottom-4 left-4 bg-background/80 px-3 py-1 rounded-lg">
            <Text className="text-white text-sm font-medium capitalize">
              {property.property_type}
            </Text>
          </View>
        </View>

        <View className="px-4 py-6">
          {/* Property Info */}
          <Text className="text-white text-2xl font-bold">{property.name}</Text>
          <View className="flex-row items-center mt-2">
            <MapPin size={16} color="#A0AEC0" />
            <Text className="text-text-secondary ml-1">
              {property.address}, {property.city}, {property.state}
            </Text>
          </View>

          {/* Key Metrics */}
          <View className="flex-row mt-6 gap-3">
            <Card className="flex-1 items-center">
              <Text className="text-text-muted text-xs">Share Price</Text>
              <Text className="text-primary font-bold text-xl mt-1">
                {formatCurrency(property.share_price)}
              </Text>
            </Card>
            <Card className="flex-1 items-center">
              <Text className="text-text-muted text-xs">Annual Return</Text>
              <View className="flex-row items-center mt-1">
                <TrendingUp size={16} color="#4CAF50" />
                <Text className="text-accent-green font-bold text-xl ml-1">
                  {property.annual_return_rate?.toFixed(1)}%
                </Text>
              </View>
            </Card>
            <Card className="flex-1 items-center">
              <Text className="text-text-muted text-xs">Total Value</Text>
              <Text className="text-white font-bold text-lg mt-1">
                ${(property.total_value / 1000000).toFixed(1)}M
              </Text>
            </Card>
          </View>

          {/* Your Investment */}
          {investment && (
            <Card className="mt-6 border border-primary">
              <Text className="text-white font-bold text-lg mb-3">
                Your Investment
              </Text>
              <View className="flex-row justify-between mb-2">
                <Text className="text-text-secondary">Shares Owned</Text>
                <Text className="text-white font-medium">
                  {investment.shares_owned.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-text-secondary">Total Invested</Text>
                <Text className="text-white font-medium">
                  {formatCurrency(investment.total_invested)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary">Current Value</Text>
                <Text className="text-primary font-bold">
                  {formatCurrency(investment.shares_owned * property.share_price)}
                </Text>
              </View>
            </Card>
          )}

          {/* Availability */}
          <Card className="mt-6">
            <Text className="text-white font-bold text-lg mb-3">
              Availability
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-text-secondary">Available Shares</Text>
              <Text className="text-white font-medium">
                {property.available_shares.toLocaleString()} /{" "}
                {property.total_shares.toLocaleString()}
              </Text>
            </View>
            <View className="mt-2 h-3 bg-background rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${
                    ((property.total_shares - property.available_shares) /
                      property.total_shares) *
                    100
                  }%`,
                }}
              />
            </View>
            <Text className="text-text-muted text-sm mt-2">
              {(
                ((property.total_shares - property.available_shares) /
                  property.total_shares) *
                100
              ).toFixed(1)}
              % funded
            </Text>
          </Card>

          {/* Description */}
          <Card className="mt-6">
            <Text className="text-white font-bold text-lg mb-3">About</Text>
            <Text className="text-text-secondary leading-6">
              {property.description}
            </Text>
          </Card>

          {/* Spacer for bottom buttons */}
          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-background-card border-t border-border px-4 py-4 pb-8">
        <View className="flex-row gap-3">
          {investment && investment.shares_owned > 0 && (
            <Button
              title="Sell"
              variant="outline"
              onPress={() => {
                setShares(1);
                setShowSellModal(true);
              }}
              className="flex-1"
              size="lg"
            />
          )}
          <Button
            title="Buy Shares"
            onPress={() => {
              setShares(1);
              setShowBuyModal(true);
            }}
            disabled={property.status !== "active" || property.available_shares === 0}
            className="flex-1"
            size="lg"
          />
        </View>
      </View>

      {/* Modals */}
      {renderTransactionModal("buy")}
      {renderTransactionModal("sell")}
    </View>
  );
}
