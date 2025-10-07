// data/genres.ts

import { prisma } from '@/lib/prisma';
import { ReadingStatus } from '@prisma/client';

// 1. Listar todos os gêneros (GET /api/categories)  ordenado por nome
export async function getGenres() {
    return prisma.genre.findMany({
        orderBy: {
            name: 'asc',
        }
    });
}

// 2. Criar novo gênero (POST /api/categories/genres)
export async function createGenre(name: string) {
    return prisma.genre.create({
        data: { name },
    });
}

// 3. Obter opções de status disponíveis
export function getReadingStatusOptions() {
    return Object.values(ReadingStatus);
}

// 4. Remover um gênero pelo ID (DELETE /api/categories/genres/[id])
export async function deleteGenre(id: string) {
    return prisma.genre.delete({
        where: { id },
    });
}