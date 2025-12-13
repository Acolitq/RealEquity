import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, X, MapPin } from "lucide-react-native";
import { getProperties, getCities } from "@/lib/api/properties";
import { Loading, Card } from "@/components/ui";
import { PropertyCard } from "@/components/property/PropertyCard";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const timer = setTimeout(() => {
      setDebouncedQuery(text);
    }, 300);
    
    setDebounceTimer(timer);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedCity(null);
  };

  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  });

  const {
    data: properties,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["searchProperties", debouncedQuery, selectedCity],
    queryFn: () =>
      getProperties({
        search: debouncedQuery || undefined,
        city: selectedCity || undefined,
      }),
    enabled: debouncedQuery.length > 0 || selectedCity !== null,
  });

  const { data: recentProperties } = useQuery({
    queryKey: ["recentProperties"],
    queryFn: () => getProperties({ limit: 5 }),
    enabled: debouncedQuery.length === 0 && selectedCity === null,
  });

  const showResults = debouncedQuery.length > 0 || selectedCity !== null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-4 pt-6 pb-4">
        <Text className="text-white text-2xl font-bold">Search</Text>
        <Text className="text-text-secondary text-base mt-1">
          Find your next investment
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 mb-4">
        <View className="flex-row items-center bg-background-card border border-border rounded-xl px-4">
          <SearchIcon size={20} color="#718096" />
          <TextInput
            className="flex-1 text-white py-4 px-3 text-base"
            placeholder="Search by name, city, or address..."
            placeholderTextColor="#718096"
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color="#718096" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* City Filter */}
      {cities && cities.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 mb-4"
        >
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSelectedCity(null)}
              className={`flex-row items-center px-3 py-2 rounded-full ${
                selectedCity === null
                  ? "bg-primary"
                  : "bg-background-card border border-border"
              }`}
            >
              <MapPin size={14} color={selectedCity === null ? "#FFFFFF" : "#A0AEC0"} />
              <Text
                className={`text-sm font-medium ml-1 ${
                  selectedCity === null ? "text-white" : "text-text-secondary"
                }`}
              >
                All Cities
              </Text>
            </TouchableOpacity>
            {cities.map((city) => (
              <TouchableOpacity
                key={city}
                onPress={() => setSelectedCity(city)}
                className={`px-3 py-2 rounded-full ${
                  selectedCity === city
                    ? "bg-primary"
                    : "bg-background-card border border-border"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedCity === city ? "text-white" : "text-text-secondary"
                  }`}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Results */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {isLoading || isFetching ? (
          <Loading message="Searching..." />
        ) : showResults ? (
          <>
            <Text className="text-text-secondary text-sm mb-4">
              {properties?.length || 0} results found
            </Text>
            {properties && properties.length > 0 ? (
              <View className="gap-4 pb-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    variant="horizontal"
                  />
                ))}
              </View>
            ) : (
              <Card className="mt-4">
                <View className="items-center py-8">
                  <Text className="text-text-secondary text-base text-center">
                    No properties match your search
                  </Text>
                  <Text className="text-text-muted text-sm mt-2 text-center">
                    Try different keywords or filters
                  </Text>
                </View>
              </Card>
            )}
          </>
        ) : (
          <>
            <Text className="text-white text-lg font-bold mb-4">
              Recent Properties
            </Text>
            {recentProperties && recentProperties.length > 0 ? (
              <View className="gap-4 pb-6">
                {recentProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    variant="horizontal"
                  />
                ))}
              </View>
            ) : (
              <Card>
                <Text className="text-text-secondary text-center py-4">
                  No recent properties
                </Text>
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
