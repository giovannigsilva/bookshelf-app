'use client';

import { useState, useEffect, FormEvent } from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Genre = {
    id: string;
    name: string;
};

export default function ManageGenresPage() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [newGenreName, setNewGenreName] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchGenres = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/genres');
            if (!response.ok) throw new Error('Falha ao buscar gêneros');
            const data: Genre[] = await response.json();
            setGenres(data);
        } catch (error) {
            setMessage('Erro ao carregar gêneros.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    const handleCreateGenre = async (e: FormEvent) => {
        e.preventDefault();
        if (!newGenreName.trim()) {
            setMessage('O nome do gênero não pode ser vazio.');
            return;
        }

        setMessage('Criando gênero...');
        try {
            const response = await fetch('/api/genres', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newGenreName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao criar gênero');
            }

            setNewGenreName('');
            setMessage('Gênero criado com sucesso!');
            setTimeout(() => setMessage(''), 3000);
            fetchGenres();
        } catch (error: any) {
            setMessage(error.message);
            console.error(error);
        }
    };

    const handleDeleteGenre = async (genreId: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este gênero?')) {
            return;
        }

        setMessage('Excluindo gênero...');
        try {
            const response = await fetch(`/api/genres/${genreId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao excluir gênero');
            }
            
            setMessage('Gênero excluído com sucesso!');
            setTimeout(() => setMessage(''), 3000);
            fetchGenres();
        } catch (error: any) {
            setMessage(error.message);
            console.error(error);
        }
    };

    return (
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                
                {/* Cabeçalho da página com título e botão de voltar */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Gerenciar Gêneros</h1>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/books"><ChevronLeft className="mr-2 h-4 w-4" />Voltar</Link>
                    </Button>
                </div>

                {/* Conteúdo unificado dentro de um único card escuro */}
                <div className=" p-6 rounded-lg shadow-md border">
                    {/* Formulário de Criação */}
                    <form onSubmit={handleCreateGenre} className="mb-8">
                        <label htmlFor="genre-name" className="block text-sm font-medium mb-2">
                            Adicionar Novo Gênero
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <input
                                id="genre-name"
                                type="text"
                                value={newGenreName}
                                onChange={(e) => setNewGenreName(e.target.value)}
                                placeholder="Nome do novo gênero"
                                className="px-4 py-2 border unded-md w-full focus:outline-none focus:ring-2 focus:ring-black-600 transition rounded-md"
                            />
                            <Button 
                                type="submit"
                                className="w-full sm:w-auto px-6 py-2 font-semibold rounded-md shadow-sm"
                            >
                                Adicionar
                            </Button>
                        </div>
                    </form>
                    {message && <p className="text-center text-sm  mb-4">{message}</p>}

                    <hr className="my-8 " />

                    {/* Lista de Gêneros Existentes */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Gêneros Existentes</h2>
                        {isLoading ? (
                            <p className="text-gray-600">Carregando...</p>
                        ) : (
                            <ul className="space-y-3">
                                {genres.length > 0 ? genres.map((genre) => (
                                    <li key={genre.id} className="flex items-center justify-between p-3 rounded-md hover:bg-gray-400 transition-colors border border-gray-700">
                                        <span className="">{genre.name}</span>
                                        <Button size="sm" variant="ghost" onClick={() => handleDeleteGenre(genre.id)} className="text-red-500 hover:text-red-400">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </li>
                                )) : <p className="text-gray-600">Nenhum gênero cadastrado.</p>}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}