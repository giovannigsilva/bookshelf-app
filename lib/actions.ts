'use server'; 

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { signIn } from './auth';

const prisma = new PrismaClient();

export async function signup(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) throw new Error('Todos os campos são obrigatórios.');
    if (password.length < 6) throw new Error('A senha deve ter no mínimo 6 caracteres.');

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('Este e-mail já está em uso.');

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({ data: { name, email, password: hashedPassword } });

  } catch (error) {
    if (error instanceof Error) {
        console.error('Erro no cadastro:', error.message);
    }
    // Em caso de erro, a função para aqui, mas não redireciona
    return; 
  }

  // Só redireciona em caso de sucesso
  redirect('/'); 
}

// AÇÃO DE LOGIN
export async function login(formData: FormData) {
  try {
    await signIn('credentials', formData);  
      
  } catch (error: any) {

    if (error.type === 'CredentialsSignin') {
      console.error('Credenciais inválidas.');    
  }

  redirect('/dash');
}
}