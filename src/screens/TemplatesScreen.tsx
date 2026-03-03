// Templates Screen - Beautiful Template Gallery
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Plus, MoreVertical, Tag, Sparkles, Palette} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useTagPresetStore} from '@/store';
import {colors, semantic, spacing, textStyles, typography} from '@/theme';
import {catalogTemplates, TemplateConfig} from '@/theme/templates';
import {Header} from '@/components/Header';
import {TagPreset} from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const {width} = Dimensions.get('window');
const TEMPLATE_CARD_WIDTH = (width - 60) / 2;

export const TemplatesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const {presets, isLoading, loadPresets} = useTagPresetStore();

  useEffect(() => {
    loadPresets();
  }, []);

  const handleCreatePreset = () => {
    navigation.navigate('BulkTag');
  };

  const handleTemplatePress = (templateId: string) => {
    navigation.navigate('CatalogBuilder', {template: templateId});
  };

  const getCategoryIcon = (category: TemplateConfig['category']) => {
    switch (category) {
      case 'minimal':
        return '◐';
      case 'elegant':
        return '◆';
      case 'warm':
        return '●';
      case 'playful':
        return '★';
      case 'dark':
        return '◼';
      case 'vibrant':
        return '◉';
      default:
        return '◆';
    }
  };

  const getCategoryLabel = (category: TemplateConfig['category']) => {
    switch (category) {
      case 'minimal':
        return 'Minimal';
      case 'elegant':
        return 'Elegant';
      case 'warm':
        return 'Warm';
      case 'playful':
        return 'Playful';
      case 'dark':
        return 'Dark';
      case 'vibrant':
        return 'Vibrant';
      default:
        return 'Elegant';
    }
  };

  const renderTemplateCard = ({item}: {item: TemplateConfig}) => (
    <TouchableOpacity
      style={[
        styles.templateCard,
        {
          backgroundColor: item.colors.cardBg,
          borderRadius: item.style.borderRadius + 4,
          shadowOpacity: item.style.shadowOpacity,
        },
      ]}
      onPress={() => handleTemplatePress(item.id)}>
      {/* Header Preview */}
      <View
        style={[
          styles.templateHeader,
          {
            backgroundColor: item.colors.primary,
            borderTopLeftRadius: item.style.borderRadius,
            borderTopRightRadius: item.style.borderRadius,
          },
        ]}>
        <Text style={styles.templateIcon}>{getCategoryIcon(item.category)}</Text>
      </View>

      {/* Preview Content */}
      <View style={styles.templatePreview}>
        {/* Product Card Preview */}
        <View
          style={[
            styles.productPreview,
            {
              backgroundColor: item.colors.cardBg,
              borderRadius: item.style.borderRadius,
              borderColor: item.colors.border,
              borderWidth: 1,
            },
          ]}>
          <View
            style={[
              styles.imagePreview,
              {
                backgroundColor: item.colors.secondary,
                borderRadius: item.style.borderRadius - 4,
              },
            ]}
          />
          <View style={styles.textPreview}>
            <View
              style={[
                styles.textLine,
                {backgroundColor: item.colors.border, width: '70%'},
              ]}
            />
            <View
              style={[
                styles.textLine,
                {backgroundColor: item.colors.primary, width: '40%', marginTop: 6},
              ]}
            />
          </View>
        </View>
      </View>

      {/* Template Info */}
      <View style={styles.templateInfo}>
        <Text style={[styles.templateName, {color: item.colors.text}]}>
          {item.name}
        </Text>
        <Text
          style={[styles.templateDescription, {color: item.colors.textMuted}]}
          numberOfLines={1}>
          {item.description}
        </Text>
        <View style={[styles.categoryBadge, {backgroundColor: item.colors.secondary}]}>
          <Text style={[styles.categoryText, {color: item.colors.textMuted}]}>
            {getCategoryLabel(item.category)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTagPreset = ({item}: {item: TagPreset}) => (
    <View style={styles.presetCard}>
      <View style={styles.presetIcon}>
        <Tag size={24} color={semantic.primary} />
      </View>
      <View style={styles.presetInfo}>
        <Text style={styles.presetName}>{item.name}</Text>
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTags}>+{item.tags.length - 3}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <MoreVertical size={20} color={semantic.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Templates" showBack={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{paddingBottom: insets.bottom + 100}}
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <Palette size={24} color={colors.white} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Choose Your Style</Text>
            <Text style={styles.headerSubtitle}>
              Elegant line sheet template for showcasing jewelry and accessories
            </Text>
          </View>
        </View>

        {/* Catalog Templates Grid */}
        <Text style={[textStyles.sectionHeader, styles.sectionTitle]}>
          <Sparkles size={16} color={semantic.primary} /> Catalog Templates
        </Text>

        <FlatList
          data={catalogTemplates}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.templatesRow}
          renderItem={renderTemplateCard}
        />

        {/* Tag Presets Section */}
        <View style={styles.presetsHeader}>
          <Text style={textStyles.sectionHeader}>Tag Presets</Text>
          <TouchableOpacity onPress={handleCreatePreset}>
            <Plus size={20} color={semantic.primary} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator color={semantic.primary} />
        ) : (
          <FlatList
            data={presets}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No tag presets yet</Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreatePreset}>
                  <Plus size={16} color={semantic.card} />
                  <Text style={styles.createButtonText}>Create Preset</Text>
                </TouchableOpacity>
              </View>
            }
            renderItem={renderTagPreset}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.card,
    padding: spacing.lg,
    borderRadius: 20,
    marginBottom: spacing.xxl,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: semantic.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: '700',
    color: semantic.text,
  },
  headerSubtitle: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  templatesRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  templateCard: {
    width: TEMPLATE_CARD_WIDTH,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 3,
  },
  templateHeader: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateIcon: {
    fontSize: 20,
    color: colors.white,
    opacity: 0.9,
  },
  templatePreview: {
    padding: 12,
    backgroundColor: semantic.background,
  },
  productPreview: {
    padding: 8,
  },
  imagePreview: {
    height: 60,
    width: '100%',
  },
  textPreview: {
    marginTop: 8,
  },
  textLine: {
    height: 6,
    borderRadius: 3,
  },
  templateInfo: {
    padding: 12,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
  },
  templateDescription: {
    fontSize: 11,
    marginTop: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  presetIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: semantic.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  presetName: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: semantic.text,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: 4,
  },
  tagChip: {
    backgroundColor: semantic.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    color: semantic.textSecondary,
  },
  moreTags: {
    fontSize: 11,
    color: semantic.textSecondary,
  },
  moreButton: {
    padding: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.textSecondary,
    marginBottom: spacing.md,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
  },
  createButtonText: {
    color: semantic.card,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
});

export default TemplatesScreen;
