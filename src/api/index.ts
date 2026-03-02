// API exports
export {getDatabase, resetDatabase, closeDatabase} from './database';
export {seedDatabase} from './seed';

export {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  archiveProduct,
  restoreProduct,
  deleteProduct,
  getProductCount,
  getCategories,
  bulkUpdateProducts,
  bulkArchiveProducts,
} from './products';

export {
  createCatalog,
  getCatalogById,
  getCatalogs,
  updateCatalog,
  deleteCatalog,
  addProductsToCatalog,
  removeProductFromCatalog,
  reorderCatalogProducts,
  getCatalogProducts,
  getCatalogCount,
} from './catalogs';

export {
  getAllTags,
  getProductTags,
  searchTags,
  createTagPreset,
  getTagPresets,
  getTagPresetById,
  updateTagPreset,
  deleteTagPreset,
  applyTagPreset,
} from './tags';

export {
  searchProducts,
  advancedSearch,
  getSearchSuggestions,
  createSavedFilter,
  getSavedFilters,
  deleteSavedFilter,
} from './search';
