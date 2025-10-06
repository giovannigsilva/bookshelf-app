// app/(routes)/books/new/page.tsx

import BookForm from '@/components/forms/BookForm';
import { getGenres } from '@/data/genres';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Server Component para buscar os gêneros
export default async function AddNewBookPage() {
    const genres = await getGenres();

    return (
        <section className="space-y-6">
            {/* Botão de voltar em páginas internas */}
            <Button variant="outline" size="sm" asChild>
                <Link href="/books">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar para a Biblioteca
                </Link>
            </Button>

            {/* O formulário recebe os dados do servidor */}
            <BookForm genres={genres} />
        </section>
    );
}