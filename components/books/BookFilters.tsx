// components/books/BookFilters.tsx
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';

// Tipo simples para as props de Gênero (Client Component)
type Genre = {
  id: string;
  name: string;
};

export default function BookFilters({ genres }: { genres: Genre[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Inicializa o estado com os valores da URL
  const initialSearch = searchParams.get('search') || '';
  const initialGenre = searchParams.get('genre') || 'all'; 

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [genreFilter, setGenreFilter] = useState(initialGenre);
  const [isPending, startTransition] = useTransition();
  
  // --- FUNÇÃO CENTRAL: Atualiza a URL e força a re-execução do Server Component ---
  const applyFilters = (search: string, genre: string) => {
    startTransition(() => {
        const params = new URLSearchParams();
        
        if (search) {
            params.set('search', search);
        }
        
        // Se for o valor "all", não incluímos o parâmetro na URL
        if (genre && genre !== 'all') {
            params.set('genre', genre);
        }
        
        // router.replace é o método preferido para filtros, forçando uma nova busca
        router.replace(`/books?${params.toString()}`);
    });
  };

  // 2. Efeito para Busca Automática (Debounce - 300ms)
  useEffect(() => {
    // Se estiver em uma transição de gênero, não queremos disparar outro debounce
    if (isPending) return;

    // Define um temporizador (debounce)
    const delayDebounceFn = setTimeout(() => {
        // Aplica os filtros somente após o usuário parar de digitar por 300ms
        applyFilters(searchTerm, genreFilter);
    }, 300);

    // Limpa o temporizador se o componente for desmontado ou se o termo mudar
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Observa apenas o Input de busca

  // 3. Efeito para Filtro de Gênero (Aplicação Imediata)
  useEffect(() => {
    // Se o filtro de gênero mudar, aplica imediatamente os filtros com o termo de busca atual
    applyFilters(searchTerm, genreFilter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genreFilter]); // Observa a mudança do Select

  // Lógica de Reset
  const handleReset = () => {
    startTransition(() => {
        setSearchTerm('');
        setGenreFilter('all'); 
        router.replace('/books'); // Volta para a URL base
    });
  };

  return (
    <div className='flex justify-between items-center flex-wrap gap-4'>
        {/* Campo de Busca */}
        <div className="flex gap-2 max-w-lg flex-1">
            <Input
                placeholder="Buscar por título ou autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
                disabled={isPending}
            />
            {/* Botão de busca: desabilitado, pois a busca é automática */}
            <Button size="icon" disabled className='pointer-events-none' variant="outline">
                <Search className='h-4 w-4' />
            </Button>
        </div>
        
        {/* Filtro e Reset */}
        <div className='flex gap-2'>
            <Select value={genreFilter} onValueChange={setGenreFilter} disabled={isPending}>
                <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Filtrar por Gênero" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">Todos os Gêneros</SelectItem> {/* Valor 'all' corrige o erro do shadcn/ui */}
                {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>{genre.name}</SelectItem>
                ))}
                </SelectContent>
            </Select>
            
            <Button 
                variant="outline" 
                type="button" 
                onClick={handleReset} 
                disabled={isPending || (!searchTerm && genreFilter === 'all')}
                size="icon"
            >
                <RotateCcw className='h-4 w-4' />
            </Button>
        </div>
    </div>
  );
}