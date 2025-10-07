import { NextResponse } from 'next/server';
import { getGenres, createGenre } from '@/data/genres'; // Ajuste o caminho

// Lida com: GET /api/genres
export async function GET() {
    try {
        const genres = await getGenres();
        return NextResponse.json(genres);
    } catch (error) {
        return NextResponse.json(
            { message: 'Erro ao buscar gêneros.' },
            { status: 500 }
        );
    }
}

// Lida com: POST /api/genres
export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json(
                { message: 'O nome do gênero é obrigatório.' },
                { status: 400 }
            );
        }

        const newGenre = await createGenre(name);
        return NextResponse.json(newGenre, { status: 201 });

    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'Este gênero já existe.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { message: 'Erro ao criar gênero.' },
            { status: 500 }
        );
    }
}