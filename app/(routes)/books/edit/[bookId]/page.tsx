// app/(routes)/books/edit/[bookId]/page.tsx

import BookForm from '@/components/forms/BookForm';
import { getGenres } from '@/data/genres';
import { getBookById } from '@/data/book';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Server Component para buscar os dados do livro e gêneros
export default async function EditBookPage({
    params,
}: {
    params: { bookId: string };
}) {
    // Busca os dados necessários em paralelo (melhora a performance)
    const [book, genres] = await Promise.all([
        getBookById(params.bookId),
        getGenres(),
    ]);

    // Se o livro não for encontrado, exibe a página 404
    if (!book) {
        notFound();
    }

    // Formata os dados para o formulário
    const initialData = {
        ...book,
        year: book.year?.toString() || '',
        pages: book.pages?.toString() || '',
        currentPage: book.currentPage?.toString() || '0',
        rating: book.rating || 0, // O componente de Estrelas espera um number
    };

    return (
        <section className="space-y-6">
            <Button variant="outline" size="sm" asChild>
                <Link href="/books">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar para a Biblioteca
                </Link>
            </Button>

            {/* O formulário agora é usado em modo de edição */}
            <BookForm
                genres={genres}
                initialData={initialData}
                isEdit={true}
            />
        </section>
    );
}