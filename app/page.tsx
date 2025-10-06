"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner'
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import { login, signup } from '../lib/actions';


export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  // FUNÇÃO UNIFICADA PARA TRATAR O CADASTRO E LOGIN
  const handleAuth = async (formData: FormData): Promise<void> => {
    const action = isLoginView ? login : signup;
    const actionType = isLoginView ? 'Login' : 'Cadastro';

    try {
      // Await a Server Action (que fará o redirect em caso de sucesso)
      await action(formData);

      // --- CÓDIGO DE SUCESSO (EXECUTADO APÓS REDIRECT) ---

    } catch (error: any) {
      // Captura o erro, incluindo o sinal NEXT_REDIRECT
      const errorMessage = error.message.replace('NEXT_REDIRECT', '').trim();

      if (errorMessage) {
        // A. FALHA DE LÓGICA (ex: credenciais inválidas)
        toast.error(`Falha no ${actionType}`, {
          description: errorMessage,
        });

      } else if (!isLoginView) {
        // B. CADASTRO DEU CERTO (O erro é só o sinal de redirecionamento)

        // 1. Toaster de Sucesso (REQUISITO)
        toast.success('Cadastro Concluído!', {
          description: 'Sua conta foi criada! Faça login para acessar a plataforma.',
        });

        // 2. Redirecionamento de Visualização (REQUISITO)
        setIsLoginView(true);

      }
      // Para login (isLoginView=true), a falha já foi tratada acima. O sucesso é o redirect para /dash.
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isLoginView ? 'Acessar Plataforma' : 'Criar uma Conta'}
          </CardTitle>
        </CardHeader>

        {/* --- Formulários de Login e Cadastro usam handleAuth --- */}
        <form action={handleAuth}>
          {isLoginView ? (
            <>
              {/* Campos de Login */}
              <CardContent className="space-y-4">
                <Input name="email" type="email" placeholder="E-mail" required />
                <Input name="password" type="password" required />
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-4">
                <AuthSubmitButton isLoginView={true} />
              </CardFooter>
            </>
          ) : (
            <>
              {/* Campos de Cadastro */}
              <CardContent className="space-y-4">
                <Input name="name" type="text" placeholder="Nome" required />
                <Input name="email" type="email" placeholder="E-mail" required />
                <Input name="password" type="password" required />
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-4">
                <AuthSubmitButton isLoginView={false} />
              </CardFooter>
            </>
          )}
        </form>
        {/* ==================== BOTÃO PARA ALTERNAR ==================== */}
                <div className="p-6 pt-0 text-center text-sm text-muted-foreground">
          {isLoginView ? (
            <>
              Não possui uma conta?{' '}
              <button onClick={() => setIsLoginView(false)} className="underline underline-offset-2 hover:text-primary">
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{' '}
              <button onClick={() => setIsLoginView(true)} className="underline underline-offset-2 hover:text-primary">
                Faça login
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
