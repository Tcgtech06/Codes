export interface Book {
  id: string;
  title: string;
  price: number;
  edition: string;
  color: string;
  description: string;
  image: string;
  details?: string[];
}

export const books: Book[] = [
  { 
    id: 'textile-industry-guide',
    title: 'Textile Industry Guide', 
    price: 550, 
    edition: '2nd Edition', 
    color: 'bg-blue-600',
    description: 'A comprehensive guide covering all aspects of the textile industry, from raw materials to finished products. Perfect for professionals and students alike.',
    image: '/s1.jpg',
    details: [
      'Complete overview of textile manufacturing processes',
      'Industry standards and quality control',
      'Market trends and business insights',
      'Over 300 pages of detailed content',
      'Includes diagrams and illustrations'
    ]
  },
  { 
    id: 'advanced-knitting-techniques',
    title: 'Advanced Knitting Techniques', 
    price: 550, 
    edition: '1st Edition', 
    color: 'bg-emerald-600',
    description: 'Master advanced knitting techniques with detailed instructions and illustrations. Learn professional methods used in the industry.',
    image: '/s2.jpg',
    details: [
      'Step-by-step knitting instructions',
      'Professional techniques and patterns',
      'Machine and hand knitting methods',
      'Troubleshooting common issues',
      'Industry best practices'
    ]
  },
  { 
    id: 'fabric-science-technology',
    title: 'Fabric Science & Technology', 
    price: 550, 
    edition: '3rd Edition', 
    color: 'bg-purple-600',
    description: 'Explore the science behind fabrics and modern textile technology. Includes latest innovations and manufacturing processes.',
    image: '/s3.jpg',
    details: [
      'Fabric properties and characteristics',
      'Modern textile technologies',
      'Sustainable manufacturing practices',
      'Testing and quality assurance',
      'Latest industry innovations'
    ]
  },
];

export function getBookById(id: string): Book | undefined {
  return books.find(book => book.id === id);
}
