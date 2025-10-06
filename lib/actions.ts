'use server'; 

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import * as Auth from './auth';

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

  } catch (error: any) {
      throw new Error(error.message || 'Falha desconhecida no cadastro.');  
  }

  // Só redireciona em caso de sucesso
  redirect('/'); 
}

// AÇÃO DE LOGIN
export async function login(formData: FormData) {
  try {
    await Auth.signIn('credentials', formData);  
    
    redirect('/dash');    
  } catch (error: any) {
    // Trata o erro NEXT_REDIRECT (que é lançado pelo redirect, em caso de sucesso)
    if (error.message && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    if (error.type === 'CredentialsSignin') {
      console.error('Credenciais inválidas.');    
    }

    throw new Error('Falha no login. Tente novamente mais tarde.')  
  }
}