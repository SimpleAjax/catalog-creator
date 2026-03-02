// Dummy data for the prototype
// Using Unsplash image URLs for realistic product photos

export const UNSPLASH_PRODUCTS = [
  "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=400", // Saree
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400", // Silk fabric
  "https://images.unsplash.com/photo-1605763240004-7e93b172d754?w=400", // Jewelry
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400", // Necklace
  "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400", // Earrings
  "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=400", // Bangles
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", // Dupatta
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400", // Cotton fabric
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400", // Kurti
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400", // Dress
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", // Lehenga
  "https://images.unsplash.com/photo-1583391733955-1ea86c7c1a53?w=400", // Embroidery
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400", // Shoes
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400", // Handbag
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400", // Clutch
  "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400", // Scarf
  "https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?w=400", // Pashmina
  "https://images.unsplash.com/photo-1601999007938-507284a5cb85?w=400", // Fabric rolls
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400", // Shirt
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400", // T-shirt
];

export interface Product {
  id: string;
  name: string;
  price: number | null;
  mrp: number | null;
  description: string;
  image: string;
  tags: string[];
  category: string;
  source: string;
  stockStatus: 'in-stock' | 'limited' | 'out-of-stock';
  dateAdded: string;
  archived: boolean;
}

export interface Catalog {
  id: string;
  name: string;
  template: 'minimal' | 'bold' | 'elegant' | 'festive' | 'modern';
  productIds: string[];
  primaryColor: string;
  secondaryColor: string;
  storeName: string;
  status: 'draft' | 'published' | 'archived';
  dateCreated: string;
}

export interface TagPreset {
  id: string;
  name: string;
  tags: string[];
}

export interface ImportBatch {
  id: string;
  name: string;
  wholesaler: string;
  date: string;
  productIds: string[];
}

// Generate 50 dummy products
const categories = ['Sarees', 'Kurtis', 'Jewelry', 'Dupattas', 'Fabrics', 'Accessories'];
const subCategories: Record<string, string[]> = {
  'Sarees': ['Silk', 'Cotton', 'Banarasi', 'Printed'],
  'Kurtis': ['Long', 'Short', 'Anarkali', 'Straight'],
  'Jewelry': ['Earrings', 'Necklace', 'Bangles', 'Rings'],
  'Dupattas': ['Silk', 'Cotton', 'Embroidered', 'Printed'],
  'Fabrics': ['Cotton', 'Silk', 'Rayon', 'Linen'],
  'Accessories': ['Bags', 'Scarves', 'Belts', 'Hair Accessories']
};

const sources = ['Amit - Surat', 'Priya Textiles', 'Rajasthan Crafts', 'Mumbai Fashion Hub'];
const tags = ['festive', 'red', 'blue', 'green', 'cotton', 'silk', 'under-500', 'under-1000', 'new-arrival', 'bestseller', 'premium', 'daily-wear', 'wedding', 'party-wear'];

export const generateProducts = (): Product[] => {
  const products: Product[] = [];
  
  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subCategory = subCategories[category][Math.floor(Math.random() * subCategories[category].length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const numTags = Math.floor(Math.random() * 4) + 1;
    const productTags = Array.from({ length: numTags }, () => tags[Math.floor(Math.random() * tags.length)]);
    const uniqueTags = [...new Set(productTags)];
    
    const hasPrice = Math.random() > 0.2;
    const price = hasPrice ? Math.floor(Math.random() * 2000) + 299 : null;
    const mrp = price && Math.random() > 0.5 ? Math.floor(price * 1.3) : null;
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    products.push({
      id: `prod-${i + 1}`,
      name: `${subCategory} ${category.slice(0, -1)} ${i + 1}`,
      price,
      mrp,
      description: `Beautiful ${subCategory.toLowerCase()} ${category.slice(0, -1).toLowerCase()} perfect for any occasion.`,
      image: UNSPLASH_PRODUCTS[i % UNSPLASH_PRODUCTS.length],
      tags: uniqueTags,
      category: `${category} > ${subCategory}`,
      source,
      stockStatus: ['in-stock', 'limited', 'out-of-stock'][Math.floor(Math.random() * 3)] as Product['stockStatus'],
      dateAdded: date.toISOString().split('T')[0],
      archived: Math.random() > 0.9
    });
  }
  
  return products;
};

export const dummyProducts = generateProducts();

export const dummyCatalogs: Catalog[] = [
  {
    id: 'cat-1',
    name: 'Diwali Collection 2024',
    template: 'festive',
    productIds: dummyProducts.filter(p => p.tags.includes('festive')).slice(0, 20).map(p => p.id),
    primaryColor: '#dc2626',
    secondaryColor: '#fbbf24',
    storeName: 'Riya\'s Fashion',
    status: 'published',
    dateCreated: '2024-10-15'
  },
  {
    id: 'cat-2',
    name: 'Daily Wear Basics',
    template: 'minimal',
    productIds: dummyProducts.filter(p => p.tags.includes('daily-wear') || p.tags.includes('cotton')).slice(0, 15).map(p => p.id),
    primaryColor: '#374151',
    secondaryColor: '#f3f4f6',
    storeName: 'Riya\'s Fashion',
    status: 'published',
    dateCreated: '2024-10-20'
  },
  {
    id: 'cat-3',
    name: 'Draft: New Arrivals',
    template: 'modern',
    productIds: dummyProducts.filter(p => p.tags.includes('new-arrival')).slice(0, 10).map(p => p.id),
    primaryColor: '#0891b2',
    secondaryColor: '#cffafe',
    storeName: 'Riya\'s Fashion',
    status: 'draft',
    dateCreated: '2024-10-25'
  }
];

export const dummyTagPresets: TagPreset[] = [
  {
    id: 'preset-1',
    name: 'Festive Drop',
    tags: ['festive', 'premium', 'limited']
  },
  {
    id: 'preset-2',
    name: 'Cotton Basics',
    tags: ['cotton', 'daily-wear', 'under-500']
  },
  {
    id: 'preset-3',
    name: 'New Stock',
    tags: ['new-arrival', 'in-stock']
  }
];

export const dummyImportBatches: ImportBatch[] = [
  {
    id: 'batch-1',
    name: 'Amit - Feb 28',
    wholesaler: 'Amit - Surat',
    date: '2024-02-28',
    productIds: dummyProducts.slice(0, 23).map(p => p.id)
  },
  {
    id: 'batch-2',
    name: 'Surat Supplier - Feb 20',
    wholesaler: 'Priya Textiles',
    date: '2024-02-20',
    productIds: dummyProducts.slice(23, 41).map(p => p.id)
  }
];

export const savedFilters = [
  { id: 'filter-1', name: 'Red Sarees', query: 'red saree' },
  { id: 'filter-2', name: 'Under ₹500', query: 'under-500' },
  { id: 'filter-3', name: 'New Arrivals', query: 'new-arrival' },
  { id: 'filter-4', name: 'Festive', query: 'festive' }
];
