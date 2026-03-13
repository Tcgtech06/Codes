import CategoryPageClient from './CategoryPageClient';

// Generate static params for all categories
export function generateStaticParams() {
  return [
    { category: 'yarn' },
    { category: 'fabric-suppliers' },
    { category: 'knitting' },
    { category: 'buying-agents' },
    { category: 'printing' },
    { category: 'threads' },
    { category: 'trims-accessories' },
    { category: 'dyes-chemicals' },
    { category: 'machineries' },
    { category: 'machine-spares' }
  ];
}

// Convert slug to category name
const slugToCategoryMap: { [key: string]: string } = {
  'yarn': 'Yarn',
  'fabric-suppliers': 'Fabric Suppliers',
  'knitting': 'Knitting',
  'buying-agents': 'Buying Agents',
  'printing': 'Printing',
  'threads': 'Threads',
  'trims-accessories': 'Trims & Accessories',
  'dyes-chemicals': 'Dyes & Chemicals',
  'machineries': 'Machineries',
  'machine-spares': 'Machine Spares'
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;
  
  const categoryName = slugToCategoryMap[categorySlug] || categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return <CategoryPageClient categorySlug={categorySlug} categoryName={categoryName} />;
}
