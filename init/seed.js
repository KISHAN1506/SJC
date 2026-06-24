const path = require('path');
const { ensureJSON } = require('../utils/fileStore');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const enquiriesPath = path.join(__dirname, '..', 'data', 'enquiries.json');

const defaultProducts = [
  {
    id: 'sjc-001',
    name: 'Banarasi Royal Zari Saree',
    category: 'Banarasi',
    fabric: 'Silk',
    occasion: 'Wedding / Festive',
    moq: '12 pcs',
    price: 1899,
    featured: true,
    bestseller: true,
    description: 'Heavy zari weaving with a rich pallu, ideal for boutiques and festive counters.',
    image: '/images/product-banarasi.svg',
    gallery: ['/images/product-banarasi.svg', '/images/product-gold.svg'],
  },
  {
    id: 'sjc-002',
    name: 'Temple Border Kanjivaram',
    category: 'Silk',
    fabric: 'Art Silk',
    occasion: 'Marriage / Occasion',
    moq: '10 pcs',
    price: 1650,
    featured: true,
    bestseller: true,
    description: 'Traditional temple border styling with elegant contrast blouse options.',
    image: '/images/product-silk.svg',
    gallery: ['/images/product-silk.svg', '/images/product-gold.svg'],
  },
  {
    id: 'sjc-003',
    name: 'Everyday Cotton Elegance',
    category: 'Cotton',
    fabric: 'Pure Cotton',
    occasion: 'Daily Wear',
    moq: '20 pcs',
    price: 760,
    featured: true,
    bestseller: false,
    description: 'Comfort-first wholesale cotton sarees for boutique and reseller orders.',
    image: '/images/product-cotton.svg',
    gallery: ['/images/product-cotton.svg', '/images/product-printed.svg'],
  },
  {
    id: 'sjc-004',
    name: 'Designer Party Drape',
    category: 'Designer',
    fabric: 'Dola Silk',
    occasion: 'Party Wear',
    moq: '8 pcs',
    price: 1499,
    featured: false,
    bestseller: true,
    description: 'A polished designer range with subtle shine and versatile palette.',
    image: '/images/product-designer.svg',
    gallery: ['/images/product-designer.svg', '/images/product-printed.svg'],
  },
  {
    id: 'sjc-005',
    name: 'Printed Summer Saree',
    category: 'Printed',
    fabric: 'Linen Blend',
    occasion: 'Casual / Office',
    moq: '15 pcs',
    price: 840,
    featured: true,
    bestseller: false,
    description: 'Lightweight printed range suited for warm-weather wholesale demand.',
    image: '/images/product-printed.svg',
    gallery: ['/images/product-printed.svg', '/images/product-cotton.svg'],
  },
  {
    id: 'sjc-006',
    name: 'Gold Loom Festive Series',
    category: 'Silk',
    fabric: 'Silk with zari finish',
    occasion: 'Festival display',
    moq: '10 pcs',
    price: 2120,
    featured: false,
    bestseller: true,
    description: 'A bright festive saree series with a premium look for high-value wholesale assortments.',
    image: '/images/product-gold.svg',
    gallery: ['/images/product-gold.svg', '/images/product-banarasi.svg'],
  },
];

function ensureSeedData() {
  ensureJSON(productsPath, defaultProducts);
  ensureJSON(enquiriesPath, []);
}

module.exports = {
  ensureSeedData,
  productsPath,
  enquiriesPath,
  defaultProducts,
};
