import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from 'next/link'; 

export default function FuturePage() {
  const features = [
    {
      title: "Login pelas redes sociais",
      slug: "login-social",
      description:
        "Permitir que os usuários se cadastrem e façam login na plataforma utilizando suas contas de redes sociais, como Google, Facebook ou GitHub.",
      status: "Em planejamento",
    },
    {
      title: " Metas de Leitura",
      slug: "metas-de-leitura",
      description:
        "Permitir que o usuário defina metas semanais ou mensais e acompanhe o progresso.",
      status: "Em desenvolvimento",
    },
    {
      title: "Adicionar amigos",
      slug: "adicionar-amigos",
      description:
        "Implementar um sistema de amizade que permita aos usuários encontrar, adicionar e interagir com outros leitores na plataforma.",
      status: "Planejado",
    },
    {
      title: "Ranking entre amigos",
      slug: "ranking-de-amigos",
      description:
        "Criar um sistema de ranking onde os usuários podem comparar seu progresso de leitura com o de seus amigos na plataforma.",
      status: "Planejado",
    },
    {
      title: "Tema Dark e Light",
      slug: "tema-dark-e-light",
      description:
        "Implementar alternância entre tema claro e escuro para personalizar a experiência do usuário.",
      status: "Concluído",
    },
  ];

  const statusStyles: { [key: string]: string } = {
    Concluído: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    "Em desenvolvimento": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    Planejado: "bg-gray-100 text-gray-800 dark:bg-zinc-700 dark:text-zinc-200",
    "Em planejamento": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  };

  return (
    <main className="min-h-screen py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-50">
        Implementações Futuras
      </h1>

      <div className="max-w-4xl mx-auto grid gap-8">
        {features.map((feature, index) => (
          // NOVO: Envolvemos o Card com o Link
          <Link key={index} href={`/future/${feature.slug}`}>
            {/* NOVO: Adicionamos classes para o Card parecer mais "clicável" */}
            <Card className="h-full hover:border-primary/80 transition-colors">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
              <CardFooter>
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    statusStyles[feature.status] || statusStyles['Planejado']
                  }`}
                >
                  {feature.status}
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}