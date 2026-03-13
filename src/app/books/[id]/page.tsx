import { notFound } from 'next/navigation';
import { books } from '@/data/books';
import BookPageClient from './BookPageClient';

export async function generateStaticParams() {
  return books.map((book) => ({
    id: book.id,
  }));
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const book = books.find(b => b.id === resolvedParams.id);

  if (!book) {
    notFound();
  }

  return <BookPageClient book={book} />;
}
