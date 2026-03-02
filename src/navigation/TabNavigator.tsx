// Bottom Tab Navigator
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Package, BookOpen, Palette} from 'lucide-react-native';

import {RootTabParamList} from './types';
import {semantic} from '@/theme';

// Screens
import HomeScreen from '@/screens/HomeScreen';
import ProductsScreen from '@/screens/ProductsScreen';
import CatalogsScreen from '@/screens/CatalogsScreen';
import TemplatesScreen from '@/screens/TemplatesScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabs = [
  {
    name: 'Home' as const,
    component: HomeScreen,
    icon: Home,
    label: 'Home',
  },
  {
    name: 'Products' as const,
    component: ProductsScreen,
    icon: Package,
    label: 'Products',
  },
  {
    name: 'Catalogs' as const,
    component: CatalogsScreen,
    icon: BookOpen,
    label: 'Catalogs',
  },
  {
    name: 'Templates' as const,
    component: TemplatesScreen,
    icon: Palette,
    label: 'Templates',
  },
];

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: semantic.border,
          backgroundColor: semantic.card,
        },
        tabBarActiveTintColor: semantic.primary,
        tabBarInactiveTintColor: semantic.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: ({color, size}) => (
              <tab.icon size={24} color={color} />
            ),
            tabBarLabel: tab.label,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};
