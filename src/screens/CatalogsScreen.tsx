// Catalogs Screen
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Plus} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useCatalogStore} from '@/store';
import {colors, semantic, spacing, textStyles, typography} from '@/theme';
import {Header} from '@/components/Header';
import {Catalog} from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const templateLabels: Record<string, string> = {
  minimal: 'Minimal',
  bold: 'Bold',
  elegant: 'Elegant',
  festive: 'Festive',
  modern: 'Modern',
};

export const CatalogsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const {catalogs, isLoading, loadCatalogs} = useCatalogStore();

  useEffect(() => {
    loadCatalogs();
  }, []);

  const handleCreateCatalog = () => {
    navigation.navigate('CatalogBuilder', {});
  };

  const handleCatalogPress = (catalogId: string) => {
    navigation.navigate('CatalogPreview', {catalogId});
  };

  const renderCatalogCard = ({item}: {item: Catalog}) => (
    <TouchableOpacity
      style={styles.catalogCard}
      onPress={() => handleCatalogPress(item.id)}>
      <View
        style={[
          styles.catalogThumbnail,
          {backgroundColor: item.primaryColor},
        ]}>
        <Text style={styles.catalogInitial}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.catalogInfo}>
        <Text style={styles.catalogName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.catalogMeta}>
          {templateLabels[item.template] || item.template} • {item.productIds.length}{' '}
          products
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Catalogs"
        showBack={false}
        rightAction={
          <TouchableOpacity onPress={handleCreateCatalog}>
            <Plus size={24} color={semantic.primary} />
          </TouchableOpacity>
        }
      />

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={semantic.primary} />
      ) : (
        <FlatList
          data={catalogs}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.list,
            {paddingBottom: insets.bottom + 100}
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No catalogs yet</Text>
              <Text style={styles.emptyText}>
                Create your first catalog to showcase your products
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateCatalog}>
                <Plus size={20} color={semantic.card} />
                <Text style={styles.createButtonText}>Create Catalog</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={renderCatalogCard}
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
  loader: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
  },
  catalogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  catalogThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catalogInitial: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  catalogInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  catalogName: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: semantic.text,
  },
  catalogMeta: {
    fontSize: typography.caption.fontSize,
    color: semantic.textSecondary,
    marginTop: 2,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    ...textStyles.sectionHeader,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  createButtonText: {
    color: semantic.card,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
});

export default CatalogsScreen;
