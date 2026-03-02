// Bulk Tag Screen
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {X, Plus, Tag} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useProductStore, useTagPresetStore} from '@/store';
import {semantic, spacing, typography} from '@/theme';
import {Header} from '@/components/Header';
import {getAllTags} from '@/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'BulkTag'>;

export const BulkTagScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const {productIds} = route.params;
  const {bulkUpdateProducts} = useProductStore();
  const {presets, loadPresets, applyPreset} = useTagPresetStore();

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    loadExistingTags();
    loadPresets();
  }, []);

  const loadExistingTags = async () => {
    const tags = await getAllTags();
    setExistingTags(tags);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const applyPresetTags = async (presetId: string) => {
    setIsLoading(true);
    try {
      await applyPreset(presetId, productIds);
      Alert.alert('Success', 'Tags applied successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to apply tags');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (tags.length === 0) {
      Alert.alert('Error', 'Please add at least one tag');
      return;
    }

    setIsLoading(true);
    try {
      // Get current products and merge tags
      for (const productId of productIds) {
        const product = await useProductStore.getState().loadProduct(productId);
        if (product) {
          const mergedTags = [...new Set([...product.tags, ...tags])];
          await useProductStore.getState().updateProduct(productId, {
            tags: mergedTags,
          });
        }
      }
      Alert.alert('Success', 'Tags added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add tags');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={`Tag ${productIds.length} Products`}
        rightAction={
          <TouchableOpacity onPress={handleSave} disabled={isLoading}>
            <Text style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}>
              Apply
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{paddingBottom: insets.bottom + 20}}
        showsVerticalScrollIndicator={false}>
        {/* Tag Presets */}
        {presets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Apply Presets</Text>
            <View style={styles.presetsContainer}>
              {presets.map(preset => (
                <TouchableOpacity
                  key={preset.id}
                  style={styles.presetChip}
                  onPress={() => applyPresetTags(preset.id)}>
                  <Tag size={14} color={semantic.primary} />
                  <Text style={styles.presetText}>{preset.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Add New Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Tags</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Enter tag name"
              placeholderTextColor={semantic.textTertiary}
              onSubmitEditing={addTag}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTag}>
              <Plus size={20} color={semantic.card} />
            </TouchableOpacity>
          </View>

          {/* Selected Tags */}
          <View style={styles.tagsContainer}>
            {tags.map(tag => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => removeTag(tag)}>
                  <X size={14} color={semantic.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Existing Tags */}
        {existingTags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Existing Tags</Text>
            <View style={styles.tagsContainer}>
              {existingTags.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.existingTagChip,
                    tags.includes(tag) && styles.existingTagSelected,
                  ]}
                  onPress={() => {
                    if (!tags.includes(tag)) {
                      setTags([...tags, tag]);
                    }
                  }}>
                  <Text
                    style={[
                      styles.existingTagText,
                      tags.includes(tag) && styles.existingTagTextSelected,
                    ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
  saveButton: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: semantic.primary,
  },
  saveButtonDisabled: {
    color: semantic.textTertiary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: semantic.text,
    marginBottom: spacing.md,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: semantic.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 18,
  },
  presetText: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.primary,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: semantic.card,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: typography.body.fontSize,
    color: semantic.text,
    borderWidth: 1,
    borderColor: semantic.border,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: semantic.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: semantic.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 18,
  },
  tagText: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.primary,
    fontWeight: '500',
  },
  existingTagChip: {
    backgroundColor: semantic.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 18,
  },
  existingTagSelected: {
    backgroundColor: semantic.primaryLight,
  },
  existingTagText: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.textSecondary,
  },
  existingTagTextSelected: {
    color: semantic.primary,
  },
});

export default BulkTagScreen;
