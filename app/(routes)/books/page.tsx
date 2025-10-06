// app/(routes)/books/page.tsx

export const dynamic = 'force-dynamic';

import { getBooks } from '@/data/book';
import { getGenres } from '@/data/genres'; // Assumindo que você recriará este arquivo depois
import BookCard from '@/components/books/BookCard';
import BookFilters from '@/components/books/BookFilters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpenText } from 'lucide-react';


// Este é um Server Component que busca os dados no servidor.
export default async function BookshelfPage({
    searchParams,
}: {
    searchParams: { search?: string; genre?: string };
}) {

    const search = searchParams.search;
    const genreId = searchParams.genre;

    // Busca os livros com base nos filtros (função getBooks já faz isso)
    const allBooks = await getBooks(search, genreId);
    const genres = await getGenres(); 

    // const genres = await getGenres(); // Usaríamos para o componente de filtro
    return (
        <section className="space-y-8">
            <h1 className="text-3xl font-bold flex items-center">
                <BookOpenText className="mr-3 h-7 w-7" />
                Minha Biblioteca
            </h1>
            {/* Área de Filtros e Busca */}
            <BookFilters genres={genres} />

            {/* Área de Filtros e Busca (O componente de filtros será implementado depois) */}
            <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <p className="text-muted-foreground">Exibindo {allBooks.length} livros.</p>
            </div>

            {/* Listagem de Livros (Grid adaptativo para listagem de livros) */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allBooks.length > 0 ? (
                    allBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-lg text-muted-foreground py-10">
                        Nenhum livro encontrado com os filtros atuais.
                    </p>
                )}
            </div>

            {/* Navegação rápida para Adicionar Novo Livro */}
            <div className="pt-8 text-center">
                <Button size="lg" asChild>
                    <Link href="/books/new">Adicionar Novo Livro</Link>
                </Button>
            </div>
        </section>
    );
}