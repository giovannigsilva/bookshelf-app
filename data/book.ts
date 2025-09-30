// data/books.ts

import { prisma } from '@/lib/prisma';
import { Book, ReadingStatus } from '@prisma/client';

// Tipos para garantir type safety no input
export type CreateBookData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookData = Partial<CreateBookData>; // Todos os campos são opcionais na atualização

// 1. Listar todos os livros (GET /api/books)
export async function getBooks(search: string | undefined, genre: string | undefined) {
    // Ordenação padrão por data de criação é um requisito de performance
    return prisma.book.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            genre: true, // Inclui os dados do Gênero
        }
    });
}

// 2. Buscar livro específico (GET /api/books/[id])
export async function getBook(id: string) {
    return prisma.book.findUnique({
        where: { id },
        include: {
            genre: true,
        }
    });
}

// 3. Criar novo livro (POST /api/books)
export async function createBook(data: CreateBookData) {
    // Garantir que o status de leitura tenha um valor padrão se não for fornecido
    const bookData = {
        ...data,
        status: data.status || ReadingStatus.QUERO_LER,
        currentPage: data.currentPage || 0,
    };

    return prisma.book.create({
        data: bookData,
    });
}

// 4. Atualizar livro existente (PUT /api/books/[id])
export async function updateBook(id: string, data: UpdateBookData) {
    return prisma.book.update({
        where: { id },
        data,
    });
}

// 5. Remover livro (DELETE /api/books/[id])
export async function deleteBook(id: string) {
    return prisma.book.delete({
        where: { id },
    });
}


// --- FUNÇÕES DE ESTATÍSTICAS (PARA O DASHBOARD) ---
// Função para contar livros com um status específico
export async function countBooksByStatus(status: ReadingStatus) {
  return prisma.book.count({
    where: { status: status },
  });
}

// Função principal para o Dashboard
export async function getOverallStats() {
    // Total de páginas lidas (apenas para status LIDO)
    const pagesReadResult = await prisma.book.aggregate({
        _sum: { pages: true },
        where: { status: ReadingStatus.LIDO },
    });

    // Total de livros cadastrados
    const totalBooks = await prisma.book.count();
    
    // Contagem de livros lendo e lido
    const reading = await countBooksByStatus(ReadingStatus.LENDO);
    const finished = await countBooksByStatus(ReadingStatus.LIDO);

    return {
        totalBooks,
        reading,
        finished,
        pagesRead: pagesReadResult._sum.pages || 0,
    };
}

// --- FUNÇÕES CRUD (MUTAÇÕES - CREATE, UPDATE, DELETE) ---
// Estas serão chamadas pelas Server Actions. 
// export async function createBook(data: CreateBookData) { /* ... */ return null; }
// export async function updateBook(id: string, data: UpdateBookData) { /* ... */ return null; }
// export async function deleteBook(id: string) { /* ... */ }
