import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // Você pode definir campos aqui para um formulário de login gerado automaticamente,
      // mas como já temos o nosso, vamos focar na lógica de autorização.
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // 1. Encontrar o usuário no banco de dados
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          console.error('Usuário não encontrado.');
          return null; // Usuário não encontrado
        }

        // 2. Verificar se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.error('Senha inválida.');
          return null; // Senha incorreta
        }

        // 3. Se tudo estiver correto, retorne o objeto do usuário
        // O NextAuth cuidará de criar a sessão com este objeto
        return user;
      },
    }),
  ],
  // Opcional: Defina a página de login customizada.
  // NextAuth redirecionará para cá automaticamente em caso de acesso negado.
  pages: {
    signIn: '/', // Sua página de login/cadastro é a raiz do site
  },
});