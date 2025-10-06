'use client';

import { Book, Genre, ReadingStatus } from '@prisma/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BookDeleteDialog from './BookDeleteDialog';
import { Button } from '@/components/ui/button';
import { Star, BookOpen, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { getStatusVariant } from '@/lib/utils';

// Adiciona o tipo Genre ao Book para que o relacionamento seja reconhecido
type BookWithGenre = Book & { genre: Genre | null };

export default function BookCard({ book, onDelete }: { book: BookWithGenre, onDelete?: (id: string) => void }) {
    const renderStars = (rating: number | null) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`h-4 w-4 ${i <= (rating || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                    fill={i <= (rating || 0) ? 'currentColor' : 'none'}
                />
            );
        }
        return <div className="flex space-x-0.5">{stars}</div>;
    };

    const fallbackCoverUrl = '/bookplaceholder.png'; // Requisito: fallback para imagem padrão

    async function handleDelete() {
        if (!confirm('Tem certeza que deseja excluir este livro?')) return;
        const res = await fetch(`/api/books/${book.id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            if (onDelete) onDelete(book.id);
        } else {
            alert('Erro ao excluir livro.');
        }
    }
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader className="p-0 border-b relative">
                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-t-lg">
                  <Image
                      src={book.cover || fallbackCoverUrl}
                      alt={`Capa do livro ${book.title}`}
                      fill
                      className="object-cover"
                      onError={(e) => { e.currentTarget.src = fallbackCoverUrl; }}
                  />
                </div>
                {book.genre && (
                    <Badge variant="secondary" className="absolute top-2 left-2">{book.genre.name}</Badge>
                )}
            </CardHeader>

            <CardContent className="p-4 flex-grow space-y-2">
                <CardTitle className="text-lg leading-tight line-clamp-2">
                    <Link href={`/books/${book.id}`} className="hover:text-primary transition-colors">{book.title}</Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>

                {book.year && (<p className="text-xs text-muted-foreground">Publicação: {book.year}</p>)}

                {renderStars(book.rating)}

                <div className="pt-2">
                    <Badge variant={getStatusVariant(book.status)}>{book.status.replace('_', ' ')}</Badge>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2 pt-0">
                <Button size="icon" variant="outline" asChild>
                    <Link href={`/books/${book.id}`} title="Visualizar">
                        <BookOpen className="h-4 w-4" />
                    </Link>
                </Button>
                <Button size="icon" variant="outline" asChild>
                    <Link href={`/books/edit/${book.id}`} title="Editar">
                        <Edit className="h-4 w-4" />
                    </Link>
                </Button>
                <BookDeleteDialog bookId={book.id} bookTitle={book.title}>
                    {/* O botão de exclusão é o children que dispara o Dialog */}
                    <Button size="icon" variant="destructive" title="Excluir livro">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </BookDeleteDialog>
            </CardFooter>
        </Card>
    );
}