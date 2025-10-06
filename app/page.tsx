"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, signup } from '../lib/actions';


export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background bg-[url('/teste1.png')] bg-cover bg-center bg-no-repeat backdrop-blur-sm">
      <Card className="w-full max-w-sm">
        {/* O Header do Card muda de acordo com o estado */}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isLoginView ? 'Acessar Plataforma' : 'Criar uma Conta'}
          </CardTitle>
          <CardDescription>
            {isLoginView ? 'Entre com seu e-mail e senha' : 'Digite seus dados para se cadastrar'}
          </CardDescription>
        </CardHeader>

        {isLoginView ? (
         /* ==================== FORMULÁRIO DE LOGIN ==================== */
<form action={login}>
    <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
        </div>
        <div className="space-y-2">
            <div className="flex items-center justify-between">
           </div>
            <Input id="password" name="password" type="password" required />
        </div>
    </CardContent>
    {/* AQUI A MUDANÇA: Adicionei "pt-4" para criar o espaçamento */}
    <CardFooter className="flex flex-col gap-4 pt-4">
        <Button type="submit" className="w-full">Entrar</Button>
    </CardFooter>
</form>
) : (
          /* ==================== FORMULÁRIO DE CADASTRO ==================== */
          <form action={signup}>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" type="text" placeholder="Seu nome completo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-4">
              <Button type="submit" className="w-full">Cadastrar</Button>
            </CardFooter>
          </form>
          
        )}

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
