import { getOverallStats } from "@/data/book";  
import { Button } from "@/components/ui/button" 
import StartCard from '@/components/dashboard/StartCard';
import { BookOpen, Book, CheckSquare, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
   // Buscar dados da sessão e estatísticas
   const session = await getServerSession(authOptions);
   const stats = await getOverallStats();

  // Lista de cards de estatísticas 
  const statCards = [
    { title: 'Total de Livros', value: stats.totalBooks, icon: Book, description: 'Livros cadastrados na sua biblioteca.' },
    { title: 'Sendo Lidos', value: stats.reading, icon: BookOpen, description: 'Livros em progresso de leitura.' },
    { title: 'Leituras Finalizadas', value: stats.finished, icon: CheckSquare, description: 'Livros já finalizados.' },
    { title: 'Páginas Lidas', value: stats.pagesRead.toLocaleString(), icon: TrendingUp, description: 'Total de páginas de livros finalizados.' },
  ];

  return (
    <main className="min-h-screen p-8 lg:p-24">
      
      <div className="w-full max-w-5xl mx-auto mb-30">
        <h1 className="text-2xl font-semibold">
          Bem-vindo(a), {session?.user?.name}!
        </h1>
      </div>
      
      <div className="w-full max-w-5xl mx-auto">
        <section className="space-y-8">
          <h1 className="text-3xl font-bold text-center">Dashboard Principal</h1>

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
            <Button size="lg" variant="secondary" asChild>
              <Link href="/genres">
                Editor de Gêneros
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        </section>
      </div>
    </main>
  );
}







