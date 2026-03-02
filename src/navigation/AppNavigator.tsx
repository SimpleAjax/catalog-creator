// Root Stack Navigator
import React from 'react';
import {NavigationContainer, NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootStackParamList} from './types';
import {TabNavigator} from './TabNavigator';

// Export typed navigation hook for use in screens
export type StackNavigation = NavigationProp<RootStackParamList>;

// Screens
import AddProductScreen from '@/screens/AddProductScreen';
import ProductDetailScreen from '@/screens/ProductDetailScreen';
import CatalogBuilderScreen from '@/screens/CatalogBuilderScreen';
import CatalogPreviewScreen from '@/screens/CatalogPreviewScreen';
import BulkTagScreen from '@/screens/BulkTagScreen';
import SearchScreen from '@/screens/SearchScreen';
import SettingsScreen from '@/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="CatalogBuilder" component={CatalogBuilderScreen} />
        <Stack.Screen name="CatalogPreview" component={CatalogPreviewScreen} />
        <Stack.Screen name="BulkTag" component={BulkTagScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
