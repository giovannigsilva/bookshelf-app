// app/page.tsx (Dashboard - Server Component)

import { getOverallStats, getBooks } from "@/data/book";  
import { Button } from "@/components/ui/button" 
import StartCard from '@/components/dashboard/StartCard';
import { BookOpen, Book, CheckSquare, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';


export default async function DashboardPage() {
  // Chamada direta ao banco de dados, utilizando Server Components
  const stats = await getOverallStats();

  // Lista de cards de estatísticas 
  const statCards = [
    { title: 'Total de Livros', value: stats.totalBooks, icon: Book, description: 'Livros cadastrados na sua biblioteca.' },
    { title: 'Sendo Lidos', value: stats.reading, icon: BookOpen, description: 'Livros em progresso de leitura.' },
    { title: 'Leituras Finalizadas', value: stats.finished, icon: CheckSquare, description: 'Livros já finalizados.' },
    { title: 'Páginas Lidas', value: stats.pagesRead.toLocaleString(), icon: TrendingUp, description: 'Total de páginas de livros finalizados.' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <section className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard Principal</h1>

        {/* Grid de Estatísticas (Design responsivo e atrativo) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <StartCard key={card.title} {...card} />
          ))}
        </div>

        {/* Navegação Rápida*/}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Navegação Rápida</h2>
          <div className='flex gap-4'>
            <Button size="lg" asChild>
              <Link href="/books">
                Minha Biblioteca
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/books/new">
                Adicionar Novo Livro
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
