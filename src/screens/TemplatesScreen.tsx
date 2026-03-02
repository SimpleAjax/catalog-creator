// Templates Screen
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
import {Plus, MoreVertical, Tag} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useTagPresetStore} from '@/store';
import {colors, semantic, spacing, textStyles, typography} from '@/theme';
import {Header} from '@/components/Header';
import {TagPreset} from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TemplatesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const {presets, isLoading, loadPresets} = useTagPresetStore();

  useEffect(() => {
    loadPresets();
  }, []);

  const handleCreatePreset = () => {
    // TODO: Show modal to create preset
  };

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

  const templates = [
    {id: 'minimal', name: 'Minimal', color: '#374151'},
    {id: 'bold', name: 'Bold', color: '#DC2626'},
    {id: 'elegant', name: 'Elegant', color: '#7C3AED'},
    {id: 'festive', name: 'Festive', color: '#D97706'},
    {id: 'modern', name: 'Modern', color: '#0891B2'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Templates" showBack={false} />

      <View style={[styles.content, {paddingBottom: insets.bottom + 100}]}>
        {/* Catalog Templates Section */}
        <Text style={textStyles.sectionHeader}>Catalog Templates</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={templates}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.templatesList}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[styles.templateCard, {backgroundColor: item.color}]}>
              <Text style={styles.templateName}>{item.name}</Text>
            </TouchableOpacity>
          )}
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
            showsVerticalScrollIndicator={false}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
  },
  templatesList: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  templateCard: {
    width: 120,
    height: 160,
    borderRadius: 16,
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  templateName: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.white,
  },
  presetsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
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
