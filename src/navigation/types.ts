// Navigation types
export type RootTabParamList = {
  Home: undefined;
  Products: undefined;
  Catalogs: undefined;
  Templates: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  AddProduct: {productId?: string};
  ProductDetail: {productId: string};
  CatalogBuilder: {catalogId?: string; template?: string};
  CatalogPreview: {catalogId: string};
  BulkTag: {productIds: string[]};
  Search: {initialQuery?: string};
  Settings: undefined;
};

export type ScreenName = keyof RootStackParamList;

export type Screen =
  | 'Home'
  | 'Products'
  | 'Catalogs'
  | 'Templates'
  | 'AddProduct'
  | 'ProductDetail'
  | 'CatalogBuilder'
  | 'CatalogPreview'
  | 'BulkTag'
  | 'Search'
  | 'Settings';
