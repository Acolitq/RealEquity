import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react-native";
import { getProperties, getPropertyTypes } from "@/lib/api/properties";
import { Loading, Card } from "@/components/ui";
import { PropertyCard } from "@/components/property/PropertyCard";

type PropertyType = "all" | "residential" | "commercial" | "industrial" | "mixed";

export default function PropertiesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<PropertyType>("all");

  const {
    data: properties,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["properties", selectedType],
    queryFn: () =>
      getProperties({
        propertyType: selectedType === "all" ? undefined : selectedType,
      }),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
    { value: "mixed", label: "Mixed Use" },
  ];

  if (isLoading && !refreshing) {
    return <Loading fullScreen message="Loading properties..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pt-6 pb-4">
        <Text className="text-white text-2xl font-bold">Properties</Text>
        <Text className="text-text-secondary text-base mt-1">
          Discover investment opportunities
        </Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mb-4"
      >
        <View className="flex-row gap-2">
          {propertyTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => setSelectedType(type.value)}
              className={`px-4 py-2 rounded-full ${
                selectedType === type.value
                  ? "bg-primary"
                  : "bg-background-card border border-border"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedType === type.value ? "text-white" : "text-text-secondary"
                }`}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Properties List */}
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
        {properties && properties.length > 0 ? (
          <View className="gap-4 pb-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </View>
        ) : (
          <Card className="mt-4">
            <View className="items-center py-8">
              <Text className="text-text-secondary text-base text-center">
                No properties found
              </Text>
              <Text className="text-text-muted text-sm mt-2 text-center">
                Try adjusting your filters
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
