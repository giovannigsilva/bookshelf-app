// app/(routes)/books/actions.ts

'use server'; //Server Action

import { createBook, CreateBookData, deleteBook, updateBook, UpdateBookData} from '@/data/book';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ReadingStatus } from '@prisma/client';
import { Update } from 'next/dist/build/swc/types';

// garante que os dados do formulário sejam strings
interface BookFormInput extends Omit<CreateBookData, 'year' | 'pages' | 'rating' | 'currentPage' | 'genreId' | 'status'> {
    year?: string;
    pages?: string;
    rating?: string;
    currentPage?: string;
    genreId?: string;
    status?: string;
}

// --- ACTION: CRIAÇÃO DE LIVRO ---
export async function createBookAction(formData: BookFormInput) {

    // Validação: Título e Autor são obrigatórios
    if (!formData.title || !formData.author) {
        throw new Error('Título e Autor são obrigatórios.');
    }

    try {
        // 1. Conversão de tipos de string (form data) para number (Prisma/DB)
        const data: CreateBookData = {
            title: formData.title,
            author: formData.author,
            synopsis: formData.synopsis || '',
            cover: formData.cover || '',
            isbn: formData.isbn || '',
            notes: formData.notes || '',

            // Tratamento de Status e Gênero
            status: (formData.status as ReadingStatus) || ReadingStatus.QUERO_LER,
            genreId: formData.genreId || null,

            // Campos numéricos (tratamento de null/vazio)
            year: formData.year ? parseInt(formData.year) : null,
            pages: formData.pages ? parseInt(formData.pages) : null,
            rating: formData.rating ? parseInt(formData.rating) : null,
            currentPage: formData.currentPage ? parseInt(formData.currentPage) : 0,

        } as CreateBookData;

        await createBook(data);

    } catch (error) {
        console.error('Erro ao criar o livro:', error);
        // lança o erro para que o componente cliente possa pegar
        throw new Error('Falha ao adicionar o livro. Verifique os dados.');
    }

    // 2. Para que a Dashboard e a lista de livros sejam atualizadas
    revalidatePath('/books');
    revalidatePath('/');

    // 3. Redireciona o usuário para a página de listagem
    redirect('/books');
}


// --- ACTION: EDIÇÃO DE LIVRO ---
export async function updateBookAction(bookId: string, formData: BookFormInput) {
    if (!formData.title || !formData.author) {
        throw new Error('Título e Autor são obrigatórios.');
    }   

    try {
        const data: UpdateBookData = {
            title: formData.title,
            author: formData.author,
            synopsis: formData.synopsis || '',
            cover: formData.cover || '',
            isbn: formData.isbn || '',
            notes: formData.notes || '',

            status: (formData.status as ReadingStatus),
            genreId: formData.genreId || null,

            year: formData.year ? parseInt(formData.year) : null,
            pages: formData.pages ? parseInt(formData.pages) : null,
            rating: formData.rating ? parseInt(formData.rating) : null,
            currentPage: formData.currentPage ? parseInt(formData.currentPage) : 0,
        } as UpdateBookData;

        await updateBook(bookId, data);
    } catch (error) {
        console.error(`Erro ao atualizar o livro ID:${bookId}`, error);
        throw new Error('Falha ao atualizar o livro. Verifique os dados.');
    }

    revalidatePath(`/books/edit/${bookId}`);
    revalidatePath('/books');
    revalidatePath('/');

    redirect('/books');
        
}

// --- ACTION: EXCLUSÃO DE LIVRO ---
export async function deleteBookAction(bookId: string) {
    try {
        // 1. Chama a função de exclusão do Prisma
        await deleteBook(bookId);

    } catch (error) {
        console.error(`Erro ao excluir o livro ID ${bookId}:`, error);
        throw new Error('Falha ao excluir o livro.');
    }

    // 2. Revalida o cache (para atualizar a lista de livros e o Dashboard)
    revalidatePath('/books');
    revalidatePath('/');

    redirect('/books');
}