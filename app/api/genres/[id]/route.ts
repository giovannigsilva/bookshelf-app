import { NextResponse } from 'next/server';
import { deleteGenre } from '@/data/genres'; // Ajuste o caminho

// Lida com: DELETE /api/genres/algum-id-aqui
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const genreId = params.id;
        await deleteGenre(genreId);
        return new NextResponse(null, { status: 204 }); // 204 No Content
    } catch (error: any) {
        // Erro do Prisma para "registro não encontrado para deletar"
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Gênero não encontrado.' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: 'Erro ao deletar gênero.' },
            { status: 500 }
        );
    }
}