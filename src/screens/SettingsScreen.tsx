// Settings Screen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ChevronRight,
  Trash2,
  Info,
  FileText,
  Shield,
} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {semantic, spacing, typography} from '@/theme';
import {Header} from '@/components/Header';
import {resetDatabase, seedDatabase} from '@/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all products, catalogs, and settings. This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            resetDatabase();
            Alert.alert('Success', 'All data has been cleared');
          },
        },
      ],
    );
  };

  const handleResetData = async () => {
    resetDatabase();
    await seedDatabase();
    Alert.alert('Success', 'Sample data has been restored');
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    danger?: boolean,
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={[styles.iconContainer, danger && styles.dangerIcon]}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      <ChevronRight size={20} color={semantic.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{paddingBottom: insets.bottom + 20}}
        showsVerticalScrollIndicator={false}>
        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          {renderSettingItem(
            <FileText size={20} color={semantic.primary} />,
            'Restore Sample Data',
            'Reset to default sample products and catalogs',
            handleResetData,
          )}
          {renderSettingItem(
            <Trash2 size={20} color={semantic.error} />,
            'Clear All Data',
            'Delete all products and catalogs',
            handleClearData,
            true,
          )}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {renderSettingItem(
            <Info size={20} color={semantic.primary} />,
            'Version',
            '1.0.0',
          )}
          {renderSettingItem(
            <Shield size={20} color={semantic.primary} />,
            'Privacy Policy',
          )}
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Catalog Creator v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Built with ❤️ for small retailers
          </Text>
        </View>
      </ScrollView>
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
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: semantic.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 20,
    marginBottom: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.card,
    padding: spacing.md,
    marginHorizontal: 20,
    marginBottom: spacing.xs,
    borderRadius: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: semantic.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerIcon: {
    backgroundColor: colors.primary[100],
  },
  settingContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  settingTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: semantic.text,
  },
  dangerText: {
    color: semantic.error,
  },
  settingSubtitle: {
    fontSize: typography.caption.fontSize,
    color: semantic.textSecondary,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  footerText: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.textSecondary,
  },
  footerSubtext: {
    fontSize: typography.caption.fontSize,
    color: semantic.textTertiary,
    marginTop: 4,
  },
});

// Need to import colors for dangerIcon
import {colors} from '@/theme';

export default SettingsScreen;
