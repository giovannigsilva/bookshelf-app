// components/books/BookDeleteDialog.tsx

'use client';

import * as React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteBookAction } from '@/app/(routes)/books/actions';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BookDeleteDialogProps {
    bookId: string;
    children: React.ReactNode;
    bookTitle: string;
}

export default function BookDeleteDialog({ bookId, children, bookTitle }: BookDeleteDialogProps) {

    const [isOpen, setIsOpen] = React.useState(false);
    const [isDeleting, startTransition] = React.useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await deleteBookAction(bookId);
                setIsOpen(false); // Fecha o modal

                // feedback visual claro
                toast.success('Livro excluído!', {
                    description: `"${bookTitle}" foi removido com sucesso da biblioteca.`,
                });

            } catch (error: any) {
                // feedback visual claro
                toast.error('Falha na Exclusão', {
                    description: error.message || 'Houve um problema ao remover o livro.',
                });
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* O children (o botão de lixeira) abre o diálogo */}
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-red-600 flex items-center">
                        <Trash2 className="mr-2 h-5 w-5" />
                        Confirmação de Exclusão
                    </DialogTitle>
                    <DialogDescription>
                        Você tem certeza que deseja excluir o livro <strong>"{bookTitle}"</strong>? <br></br>
                        Esta é uma ação irreversível.
                        {/* Prevenção de exclusões acidentais */}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        {isDeleting ? 'Excluindo...' : 'Sim, Excluir Livro'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}