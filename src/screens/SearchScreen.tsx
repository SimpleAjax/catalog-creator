// Search Screen
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Search, X, Clock, TrendingUp} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useProductStore, useAppStore} from '@/store';
import {colors, semantic, spacing, typography} from '@/theme';
import {Product} from '@/types';
import {ProductCard} from '@/components/ProductCard';
import {getSearchSuggestions} from '@/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'Search'>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const {filteredProducts, search} = useProductStore();
  const {recentSearches, addRecentSearch} = useAppStore();

  const [query, setQuery] = useState(route.params?.initialQuery || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      const timer = setTimeout(() => {
        search(query);
        loadSuggestions(query);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const loadSuggestions = async (text: string) => {
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }
    const result = await getSearchSuggestions(text);
    setSuggestions(result);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    addRecentSearch(searchQuery);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', {productId});
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={20} color={semantic.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={text => {
              setQuery(text);
              setShowSuggestions(true);
            }}
            onSubmitEditing={() => handleSearch(query)}
            placeholder="Search products, tags..."
            placeholderTextColor={semantic.textSecondary}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={semantic.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Suggestions */}
      {showSuggestions && query.length >= 2 && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleSearch(suggestion)}>
              <Search size={16} color={semantic.textSecondary} />
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recent Searches */}
      {!query && recentSearches.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={useAppStore.getState().clearRecentSearches}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
          {recentSearches.map((searchQuery, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentItem}
              onPress={() => handleSearch(searchQuery)}>
              <Clock size={16} color={semantic.textSecondary} />
              <Text style={styles.recentText}>{searchQuery}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results */}
      {query.trim() && (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          numColumns={3}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
          renderItem={({item}) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item.id)}
              style={styles.productCard}
            />
          )}
          contentContainerStyle={{paddingBottom: insets.bottom + 20}}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.card,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: semantic.text,
  },
  cancelButton: {
    fontSize: typography.body.fontSize,
    color: semantic.primary,
  },
  suggestionsContainer: {
    backgroundColor: semantic.card,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border,
  },
  suggestionText: {
    fontSize: typography.body.fontSize,
    color: semantic.text,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: semantic.text,
  },
  clearText: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.primary,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border,
  },
  recentText: {
    fontSize: typography.body.fontSize,
    color: semantic.text,
  },
  resultsList: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  productRow: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  productCard: {
    flex: 1,
    maxWidth: '31%',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: semantic.textSecondary,
  },
});

export default SearchScreen;
