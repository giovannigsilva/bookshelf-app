// lib/actions.ts
'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function signup(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) throw new Error('Todos os campos são obrigatórios.');
  if (password.length < 6) throw new Error('A senha deve ter no mínimo 6 caracteres.');

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Este e-mail já está em uso.');

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, password: hashedPassword } });

  redirect('/'); // redireciona para a página de login
}

// NOVA AÇÃO DE LOGOUT
export async function logout() {
  redirect('/');
}

