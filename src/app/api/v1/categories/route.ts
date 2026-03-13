import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    // Define categories with their slugs in the specified order
    const categories = [
      { id: 1, name: 'Yarn', slug: 'yarn' },
      { id: 2, name: 'Fabric Suppliers', slug: 'fabric-suppliers' },
      { id: 3, name: 'Knitting', slug: 'knitting' },
      { id: 4, name: 'Buying Agents', slug: 'buying-agents' },
      { id: 5, name: 'Printing', slug: 'printing' },
      { id: 6, name: 'Threads', slug: 'threads' },
      { id: 7, name: 'Trims & Accessories', slug: 'trims-accessories' },
      { id: 8, name: 'Dyes & Chemicals', slug: 'dyes-chemicals' },
      { id: 9, name: 'Machineries', slug: 'machineries' },
      { id: 10, name: 'Machine Spares', slug: 'machine-spares' }
    ];

    // Get company counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const { count, error } = await supabase
          .from('companies')
          .select('*', { count: 'exact', head: true })
          .eq('category', category.name);

        return {
          ...category,
          count: error ? 0 : (count || 0)
        };
      })
    );

    return NextResponse.json({ categories: categoriesWithCounts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
