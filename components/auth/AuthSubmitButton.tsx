// components/auth/AuthSubmitButton.tsx
'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AuthSubmitButtonProps {
    isLoginView: boolean;
}

export default function AuthSubmitButton({ isLoginView }: AuthSubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLoginView ? 'Entrando...' : 'Cadastrando...'}
                </>
            ) : (
                isLoginView ? 'Entrar' : 'Cadastrar'
            )}
        </Button>
    );
}