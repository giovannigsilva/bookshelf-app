// components/forms/BookForm.tsx
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useFormStatus } from 'react-dom'; // Hook do React para estado de submission
import { ReadingStatus } from '@prisma/client';
import { createBookAction } from '@/app/(routes)/books/actions';
import { updateBookAction } from '@/app/(routes)/books/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Star, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { toast } from 'sonner'; // Feedback visual

const ReadingStatusOptions = Object.values(ReadingStatus);

interface Genre { id: string; name: string; }

interface BookFormProps {
    genres: Genre[];
    initialData?: any;
    isEdit?: boolean;
}

// Componente para exibir o estado do botão de submissão
function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? 'Atualizando...' : 'Salvando...'}
                </>
            ) : (isEdit ? 'Salvar Alterações' : 'Adicionar Livro')}
        </Button>
    );
}

export default function BookForm({ genres, initialData, isEdit = false }: BookFormProps) {

    const [coverUrl, setCoverUrl] = useState(initialData?.cover || '');
    const [rating, setRating] = useState(initialData.rating || 0);
    const [formProgress, setFormProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Função para calcular a barra de progresso do preenchimento
    const calculateProgress = (form: HTMLFormElement) => {
        const fields = [
            'title', 'author', 'year', 'pages', 'synopsis',
            'status', 'genreId', 'cover', 'isbn', 'notes'
        ];
        let filledCount = 0;

        fields.forEach(field => {
            const input = form[field as keyof HTMLFormElement] as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            const value = input?.value;
            if (value && value.trim() !== '' && value !== '0' && value !== 'QUERO_LER') {
                filledCount++;
            }
        });

        if (rating > 0) filledCount++;

        setFormProgress(Math.round((filledCount / (fields.length + 1)) * 100));
    };

    // Função principal para lidar com a submissão
    const handleSubmit = async (formData: FormData) => {
        setError(null);

        // validação (Título, Autor)
        if (!formData.get('title') || !formData.get('author')) {
            setError('Título e Autor são campos obrigatórios.');
            return;
        }

        // add o rating ao FormData
        formData.set('rating', rating.toString());

        // Define qual Server Action chamar
        const action = isEdit
            ? () => updateBookAction(initialData.id, Object.fromEntries(formData.entries()) as any)
            : () => createBookAction(Object.fromEntries(formData.entries()) as any);


        try {
            // chama Server Action
            await action();

            // feedback visual de sucesso (Redirecionamento será feito pela Server Action)
            toast.success(`Livro ${isEdit ? 'atualizado' : 'adicionado'} com sucesso!`, {
                description: `"${formData.get('title')}" foi ${isEdit ? 'salvo' : 'registrado'}.`,
            });

        } catch (err: any) {
            // Feedback visual de erro
            setError(err.message || 'Ocorreu um erro desconhecido ao salvar o livro.');
            toast.error('Falha ao salvar', {
                description: err.message || 'Verifique sua conexão ou dados.',
            });
        }
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">{isEdit ? 'Editar Livro' : 'Adicionar Novo Livro'}</CardTitle>
                <CardDescription>{isEdit ? 'Altere os dados do livro e salve as modificações.' : 'Preencha os dados do livro para catalogá-lo na sua biblioteca.'}</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
                <div className="mb-4">
                    <Label>Progresso do Preenchimento:</Label>
                    {/* Barra de progresso do preenchimento do formulário */}
                    <Progress value={formProgress} className="h-2 mt-1" />
                </div>

                {error && (<div className="p-3 mb-4 text-sm font-medium text-red-700 bg-red-100 border border-red-200 rounded-md">{error}</div>)}

                {/* O 'action' do form chama a função handleSubmit */}
                <form action={handleSubmit} onChange={(e) => calculateProgress(e.currentTarget)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Preview da Capa em tempo real */}
                        <div className="md:col-span-1 space-y-4">
                            <Label htmlFor="cover">URL da Capa (Opcional)</Label>
                            <Input 
                            id="cover" 
                            name="cover" 
                            type="url" 
                            placeholder="cover-image-url.jpg" 
                            value={coverUrl} 
                            onChange={(e) => setCoverUrl(e.target.value)} />

                            <div className="aspect-[2/3] w-full border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                {coverUrl ? (<Image src={coverUrl} alt="Preview da capa" width={300} height={450} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />) : (<ImageIcon className="h-10 w-10 text-muted-foreground" />)}
                            </div>
                        </div>

                        {/* Colunas do Formulário Principal */}
                        <div className="md:col-span-2 space-y-4">

                            {/* Título e Autor (Obrigatórios) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título *</Label>
                                    <Input 
                                    id="title" 
                                    name="title" 
                                    placeholder="O Nome do Vento" 
                                    required defaultValue={initialData?.title} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="author">Autor *</Label>
                                    <Input 
                                    id="author" 
                                    name="author" 
                                    placeholder="Patrick Rothfuss" 
                                    required defaultValue={initialData?.author} />
                                </div>
                            </div>

                            {/* Status, Gênero e Ano */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status de Leitura</Label>
                                    <Select name="status" defaultValue={initialData?.status || ReadingStatus.QUERO_LER}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ReadingStatusOptions.map((status) => 
                                                (<SelectItem 
                                                    key={status} 
                                                    value={status}>{status.replace('_', ' ')}
                                                </SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="genreId">Gênero</Label>
                                    <Select name="genreId" defaultValue={initialData?.genreId || ''}>
                                        <SelectTrigger id="genreId">
                                            <SelectValue placeholder="Selecione um Gênero" />
                                        </SelectTrigger>
                                        <SelectContent>{genres.map((genre) => 
                                            (<SelectItem 
                                                key={genre.id} 
                                                value={genre.id}>{genre.name}
                                            </SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year">Ano de Publicação</Label>
                                    <Input 
                                    id="year" 
                                    name="year"
                                    type="number" 
                                    placeholder="2007" 
                                    min={1000} max={new Date().getFullYear()} 
                                    defaultValue={initialData?.year} />
                                </div>
                            </div>

                            {/* Páginas e ISBN */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pages">Total de Páginas</Label>
                                    <Input 
                                    id="pages" 
                                    name="pages" 
                                    type="number" 
                                    placeholder="672" min={1} 
                                    defaultValue={initialData?.pages} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currentPage">Página Atual</Label>
                                    <Input 
                                    id="currentPage" 
                                    name="currentPage" 
                                    type="number" 
                                    placeholder="0" min={0} 
                                    defaultValue={initialData?.currentPage} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="isbn">ISBN</Label>
                                    <Input 
                                    id="isbn" 
                                    name="isbn" 
                                    placeholder="978-8575086694" 
                                    defaultValue={initialData?.isbn} />
                                </div>
                            </div>

                            {/* Avaliação por estrelas (1-5) */}
                            <div className="space-y-2">
                                <Label>Avaliação por Estrelas ({rating} / 5)</Label>
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map((starValue) => 
                                        (<Star 
                                            key={starValue} 
                                            className={`h-6 w-6 cursor-pointer transition-colors ${starValue <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} 
                                            onClick={() => setRating(starValue)} 
                                        />))}
                                </div>
                            </div>

                            {/* Sinopse e Notas Pessoais */}
                            <div className="space-y-2">
                                <Label htmlFor="synopsis">Sinopse Detalhada</Label>
                                <Textarea 
                                id="synopsis" 
                                name="synopsis" 
                                rows={4} 
                                placeholder="Digite a sinopse do livro..." 
                                defaultValue={initialData?.synopsis} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notas Pessoais</Label>
                                <Textarea 
                                id="notes" 
                                name="notes" 
                                rows={4} placeholder="Seus pensamentos e anotações sobre a leitura..." 
                                defaultValue={initialData?.notes} />
                            </div>
                        </div>
                    </div>

                    <CardFooter className="flex justify-end p-0">
                        <SubmitButton isEdit={isEdit} />
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}