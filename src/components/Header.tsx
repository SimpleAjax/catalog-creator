// Reusable header component
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {ArrowLeft} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {semantic, textStyles, spacing} from '@/theme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  onBackPress?: () => void;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  rightAction,
  onBackPress,
  style,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}, style]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <ArrowLeft size={24} color={semantic.text} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: semantic.card,
    borderBottomWidth: 1,
    borderBottomColor: semantic.divider,
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    ...textStyles.screenTitle,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  right: {
    width: 44,
    alignItems: 'flex-end',
  },
});

export default Header;
