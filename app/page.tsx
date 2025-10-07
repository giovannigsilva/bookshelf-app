"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { signup } from '../lib/actions';
import { Input } from '@/components/ui/input';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleLogin = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Primeiro, verificar se o email existe
    try {
      const checkResponse = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const { exists } = await checkResponse.json();
      
      if (!exists) {
        toast.error("Este email não possui cadastro. Cadastre-se primeiro!");
        return;
      }
    } catch (error) {
      console.error("Erro ao verificar email:", error);
    }

    // Se o email existe, tentar fazer login
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error("Senha incorreta. Tente novamente.");
    } else if (result?.ok) {
      window.location.href = "/dash";
    }
  };

  const handleSignup = async (formData: FormData) => {
    try {
      await signup(formData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("NEXT_REDIRECT")) {
        // redirect lançado pelo Next.js, considerar sucesso
        toast.success("Cadastro concluído! Faça login para acessar a plataforma.");
        setIsLoginView(true);        
      } else {
        toast.error("Falha no cadastro: " + errorMessage);
      }
    }
  };

  const handleAuth = async (formData: FormData) => {
    if (isLoginView) {
      await handleLogin(formData);
    } else {
      await handleSignup(formData);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isLoginView ? "Acessar Plataforma" : "Criar uma Conta"}
          </CardTitle>
        </CardHeader>

        <form action={handleAuth}>
          <CardContent className="space-y-4">
            {!isLoginView && <Input name="name" type="text" placeholder="Nome" required />}
            <Input name="email" type="email" placeholder="E-mail" required />
            <Input name="password" type="password" placeholder="Senha" required />
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4">
            <AuthSubmitButton isLoginView={isLoginView} />
          </CardFooter>
        </form>

        <div className="p-6 pt-0 text-center text-sm text-muted-foreground">
          {isLoginView ? (
            <>
              Não possui uma conta?{" "}
              <button onClick={() => setIsLoginView(false)} className="underline underline-offset-2 hover:text-primary">
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
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

