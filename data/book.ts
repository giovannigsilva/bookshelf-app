// data/books.ts

import { prisma } from '@/lib/prisma';
import { Book, ReadingStatus } from '@prisma/client';

// Tipos para garantir type safety no input
export type CreateBookData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookData = Partial<CreateBookData>; // Todos os campos são opcionais na atualização

// 1. Listar todos os livros (GET /api/books)
export async function getBooks(search?: string | undefined, genre?: string | undefined) {

    const where: any = {};

    if (genre && genre !== 'all') { // Garantir que 'all' é ignorado
        where.genreId = genre;
    }

    // 2. Busca por Título ou Autor
    if (search) {
        const lowerSearch = search.toLowerCase();
        // Usamos 'OR' para buscar tanto no título quanto no autor
        // O `mode: 'insensitive'` é CRUCIAL para o SQLite
        where.OR = [
            { title: { contains: lowerSearch } },
            { author: { contains: lowerSearch } },
        ];
    }

    // DEBUG: Se você quiser ver o que o filtro está aplicando:
    console.log("Prisma WHERE clause:", where);

    // Ordenação padrão por data de criação é um requisito de performance
    return prisma.book.findMany({
        where,
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
        genreId: data.genreId === '' ? null : data.genreId, // Permitir null se nenhum gênero for selecionado
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

// 6. Buscar livro por ID
export async function getBookById(id: string) {
    return prisma.book.findUnique({
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

// buscar livros por status
export async function getBooksByStatus(status: ReadingStatus) {
    return prisma.book.findMany({
        where: { status },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            genre: true,
        }
    });
}

// buscar livros por gênero
export async function getBooksByGenre(genreId: string) {
    return prisma.book.findMany({
        where: { genreId },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            genre: true,
        }
    });
}

// atualizar progresso de leitura
export async function updateReadingProgress(id: string, currentPage: number) {
    return prisma.book.update({
        where: { id },
        data: { currentPage },
    });
}

// marcar livro como lido
export async function markAsRead(id: string) {
    return prisma.book.update({
        where: { id },
        data: {
            status: ReadingStatus.LIDO,
            currentPage: { // Se quiser garantir que currentPage seja igual ao total de páginas
                // Esta lógica pode ser ajustada conforme necessário
            }
        },
    });
}


// --- FUNÇÕES CRUD (MUTAÇÕES - CREATE, UPDATE, DELETE) ---
// Estas serão chamadas pelas Server Actions. 
// export async function createBook(data: CreateBookData) { /* ... */ return null; }
// export async function updateBook(id: string, data: UpdateBookData) { /* ... */ return null; }
// export async function deleteBook(id: string) { /* ... */ }
