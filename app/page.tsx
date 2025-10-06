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

  const handleAuth = async (formData: FormData) => {
    if (isLoginView) {
      // LOGIN CLIENT-SIDE
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const result = await signIn("credentials", {
        redirect: true,
        email,
        password,
        callbackUrl: "/dash",
      });

      if (result?.error) {
        toast.error("Falha no login: " + result.error);
      }
    } else {
      // CADASTRO SERVER-SIDE
      try {
        await signup(formData);
        // toast.success("Cadastro concluído! Faça login para acessar a plataforma.");
        // setIsLoginView(true);
      } catch (error: any) {
        if (error.message?.includes("NEXT_REDIRECT")) {
          // redirect lançado pelo Next.js, considerar sucesso
          toast.success("Cadastro concluído! Faça login para acessar a plataforma.");
          setIsLoginView(true);        
        } else {
          toast.error("Falha no cadastro: " + error.message);
        }
      }
    };
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
