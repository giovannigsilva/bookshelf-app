import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        return NextResponse.json({ exists: !!user });
    } catch (error) {
        console.error('Erro ao verificar email:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}