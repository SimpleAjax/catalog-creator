// Seed data for initial app launch
import {getDatabase} from './database';
import {createProduct} from './products';
import {createCatalog} from './catalogs';
import {createTagPreset} from './tags';
import {ProductInput, CatalogInput} from '@/types';

export const seedDatabase = async (): Promise<void> => {
  const db = getDatabase();
  
  // Check if already seeded
  const result = db.getFirstSync<{count: number}>(
    'SELECT COUNT(*) as count FROM products;',
  );
  
  if (result && result.count > 0) {
    console.log('Database already seeded');
    return;
  }

  console.log('Seeding database...');

  // Sample products
  const sampleProducts: ProductInput[] = [
    {
      name: 'Red Silk Saree',
      price: 2499,
      mrp: 3999,
      description: 'Beautiful red silk saree with golden border',
      imageUri: 'https://placehold.co/400x400/DC2626/FFFFFF?text=Red+Saree',
      tags: ['saree', 'silk', 'red', 'festive', 'premium'],
      category: 'Sarees',
      source: 'Gallery',
      stockStatus: 'in-stock',
      archived: false,
    },
    {
      name: 'Blue Cotton Kurti',
      price: 899,
      mrp: 1299,
      description: 'Comfortable daily wear kurti',
      imageUri: 'https://placehold.co/400x400/2563EB/FFFFFF?text=Blue+Kurti',
      tags: ['kurti', 'cotton', 'blue', 'daily-wear'],
      category: 'Kurtis',
      source: 'Gallery',
      stockStatus: 'in-stock',
      archived: false,
    },
    {
      name: 'Gold Plated Earrings',
      price: 599,
      mrp: 999,
      description: 'Elegant gold plated jhumka earrings',
      imageUri: 'https://placehold.co/400x400/F59E0B/FFFFFF?text=Earrings',
      tags: ['jewelry', 'gold', 'earrings', 'festive'],
      category: 'Jewelry',
      source: 'Gallery',
      stockStatus: 'limited',
      archived: false,
    },
    {
      name: 'Green Lehenga',
      price: 4999,
      mrp: 7999,
      description: 'Designer bridal lehenga with embroidery',
      imageUri: 'https://placehold.co/400x400/16A34A/FFFFFF?text=Lehenga',
      tags: ['lehenga', 'bridal', 'green', 'premium', 'festive'],
      category: 'Lehengas',
      source: 'Gallery',
      stockStatus: 'in-stock',
      archived: false,
    },
    {
      name: 'Pink Salwar Suit',
      price: 1599,
      mrp: 2299,
      description: 'Cotton salwar suit for daily wear',
      imageUri: 'https://placehold.co/400x400/EC4899/FFFFFF?text=Salwar',
      tags: ['salwar', 'cotton', 'pink', 'daily-wear'],
      category: 'Salwar Suits',
      source: 'Gallery',
      stockStatus: 'in-stock',
      archived: false,
    },
    {
      name: 'Silver Anklet',
      price: 399,
      mrp: 599,
      description: 'Delicate silver anklet with charms',
      imageUri: 'https://placehold.co/400x400/9CA3AF/FFFFFF?text=Anklet',
      tags: ['jewelry', 'silver', 'anklet', 'accessories'],
      category: 'Jewelry',
      source: 'Gallery',
      stockStatus: 'in-stock',
      archived: false,
    },
    {
      name: 'Black Party Gown',
      price: 3299,
      mrp: 5499,
      description: 'Elegant evening gown for parties',
      imageUri: 'https://placehold.co/400x400/1F2937/FFFFFF?text=Gown',
      tags: ['gown', 'party', 'black', 'premium'],
      category: 'Gowns',
      source: 'Gallery',
      stockStatus: 'limited',
      archived: false,
    },
    {
      name: 'White Palazzo Pants',
      price: 699,
      mrp: 999,
      description: 'Comfortable palazzo pants in white',
      imageUri: 'https://placehold.co/400x400/F3F4F6/333333?text=Palazzo',
      tags: ['bottom-wear', 'white', 'casual', 'summer'],
      category: 'Bottom Wear',
      source: 'Gallery',
      stockStatus: 'in-stock',
      archived: false,
    },
  ];

  // Create products and store IDs
  const productIds: string[] = [];
  for (const product of sampleProducts) {
    const id = await createProduct(product);
    productIds.push(id);
  }

  // Sample catalogs
  const sampleCatalogs: CatalogInput[] = [
    {
      name: 'Festive Collection',
      template: 'festive',
      productIds: productIds.filter((_, i) => [0, 2, 3].includes(i)),
      primaryColor: '#D97706',
      secondaryColor: '#FEF3C7',
      storeName: 'My Store',
      status: 'published',
    },
    {
      name: 'Daily Wear',
      template: 'minimal',
      productIds: productIds.filter((_, i) => [1, 4, 7].includes(i)),
      primaryColor: '#374151',
      secondaryColor: '#F3F4F6',
      storeName: 'My Store',
      status: 'published',
    },
  ];

  for (const catalog of sampleCatalogs) {
    await createCatalog(catalog);
  }

  // Sample tag presets
  const tagPresets = [
    {name: 'Festive Collection', tags: ['festive', 'premium', 'new-arrival']},
    {name: 'Summer Special', tags: ['cotton', 'summer', 'light']},
    {name: 'Daily Wear', tags: ['daily-wear', 'comfortable', 'affordable']},
  ];

  for (const preset of tagPresets) {
    await createTagPreset(preset.name, preset.tags);
  }

  console.log('Database seeded successfully');
};
