import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SetGoalForm } from "./_components/set-goal-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, UserPlus } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

const features = [
    {
        title: "Login pelas redes sociais",
        slug: "login-social",
        description: "Permitir que os usuários se cadastrem e façam login na plataforma utilizando suas contas de redes sociais, como Google, Facebook ou GitHub.",
    },
    {
        title: "Metas de Leitura",
        slug: "metas-de-leitura",
        description: "Funcionalidade para que o usuário possa definir metas de leitura (ex: livros por ano, páginas por mês) e acompanhar seu progresso através de gráficos.",
    },
    {
        title: "Ranking entre amigos",
        slug: "ranking-de-amigos",
        description: "Criar um sistema de ranking onde os usuários podem comparar seu progresso de leitura com o de seus amigos na plataforma.",
    },
    {
        title: "Adicionar amigos",
        slug: "adicionar-amigos",
        description: "Implementar um sistema de amizade que permita aos usuários encontrar, adicionar e interagir com outros leitores na plataforma.",
    },
    {
        title: "Tema Dark e Light",
        slug: "tema-dark-e-light",
        description: "Implementar alternância entre tema claro e escuro para personalizar a experiência do usuário.",
    },
];


// --- COMPONENTES DE MOCKUP ---

function MockupMetasDeLeitura() {
    return (
        <div className="space-y-8">
            <SetGoalForm />
            <Card>
                <CardHeader><CardTitle>Meta Anual: 30 Livros</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between"><p className="text-muted-foreground">Progresso: 18 de 30 livros</p><span className="font-bold">60%</span></div>
                    <Progress value={60} className="mt-2" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Últimos livros lidos</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Autor</TableHead><TableHead className="text-right">Data</TableHead></TableRow></TableHeader>
                        <TableBody>
                            <TableRow><TableCell>A Revolução dos Bichos</TableCell><TableCell>George Orwell</TableCell><TableCell className="text-right">25/09/2025</TableCell></TableRow>
                            <TableRow><TableCell>O Senhor dos Anéis</TableCell><TableCell>J.R.R. Tolkien</TableCell><TableCell className="text-right">12/08/2025</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function MockupRankingDeAmigos() {
    return (
        <Card>
            <CardHeader><CardTitle>Ranking de Leitura - Anual</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[{ name: 'Giovani', books: 21, avatar: 'A' }, { name: 'Você', books: 18, avatar: 'V' }, { name: 'Laise', books: 15, avatar: 'C' }, { name: 'Emele', books: 10, avatar: 'C' }].map((user, index) => (
                        <div key={index} className={`flex items-center p-2 rounded-md ${user.name === 'Você' ? 'bg-primary/10' : ''}`}>
                            <span className="font-bold mr-4 text-lg">{index + 1}º</span>
                            <Avatar className="h-9 w-9 mr-4"><AvatarFallback>{user.avatar}</AvatarFallback></Avatar>
                            <span className="flex-1 font-medium">{user.name}</span>
                            <span className="text-muted-foreground">{user.books} livros</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function MockupLoginSocial() {
    return (
        <Card className="w-full max-w-sm mx-auto">
            <CardHeader><CardTitle className="text-center">Acesse seu BookShelf </CardTitle></CardHeader>
            <CardContent className="grid gap-4">
                <Button variant="outline">Continuar com Google</Button>
                <Button variant="outline">Continuar com GitHub</Button>
            </CardContent>
        </Card>
    );
}

function MockupAdicionarAmigos() {
    const searchResults = [
        { name: 'Carolina Mendes', username: '@carolreads', avatar: 'CM' },
        { name: 'Lucas Andrade', username: '@lucas_andrade', avatar: 'LA' },
    ];
    const suggestedFriends = [
        { name: 'Sofia Pereira', username: '@sofiap', avatar: 'SP' },
        { name: 'Rafael Costa', username: '@rafacosta', avatar: 'RC' },
    ]
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Encontrar Leitores</CardTitle>
                    <CardDescription>
                        Procure por nome de usuário ou e-mail para se conectar com outros leitores.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input type="text" placeholder="Ex: @carolreads" />
                        <Button type="submit">Buscar</Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Resultados da Busca</CardTitle></CardHeader>
                <CardContent className="grid gap-6">
                    {searchResults.map((user) => (
                        <div key={user.username} className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-4">
                                <Avatar><AvatarFallback>{user.avatar}</AvatarFallback></Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.username}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm"><UserPlus className="mr-2 h-4 w-4" />Adicionar</Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Sugestões de Amizade</CardTitle>
                    <CardDescription>Pessoas que você talvez conheça.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {suggestedFriends.map((user) => (
                        <div key={user.username} className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-4">
                                <Avatar><AvatarFallback>{user.avatar}</AvatarFallback></Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.username}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm"><UserPlus className="mr-2 h-4 w-4" />Adicionar</Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

function MockupTemaDarkLight() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Demonstração do Tema</CardTitle>
                <CardDescription>
                    Esta funcionalidade já está disponível. Você pode alternar entre os temas claro e escuro usando o botão <Sun className="inline h-4 w-4" /> / <Moon className="inline h-4 w-4" /> no cabeçalho do site.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-4 rounded-lg bg-white border">
                        <h3 className="font-semibold mb-2 text-black">Light Mode</h3>
                        <Card>
                            <CardHeader><CardTitle className="text-sm">Card de Exemplo</CardTitle></CardHeader>
                            <CardContent><p className="text-xs text-muted-foreground">Este é um componente no modo claro.</p></CardContent>
                        </Card>
                    </div>
                    <div className="p-4 rounded-lg bg-zinc-900 border-zinc-700 border">
                        <h3 className="font-semibold mb-2 text-white">Dark</h3>
                        <Card className="bg-zinc-800 border-zinc-700">
                             <CardHeader><CardTitle className="text-sm text-zinc-50">Card de Exemplo</CardTitle></CardHeader>
                             <CardContent><p className="text-xs text-zinc-400">Este é um componente no modo escuro.</p></CardContent>
                        </Card>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function FeatureDetailPage({ params }: { params: { slug: string } }) {
    const feature = features.find(f => f.slug === params.slug);

    if (!feature) {
        notFound();
    }

    return (
        <main className="min-h-screen py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <BackButton />
                </div>
                <Badge variant="outline" className="mb-4">Conceito de Funcionalidade</Badge>
                <h1 className="text-4xl font-bold mb-2">{feature.title}</h1>
                <p className="text-lg text-muted-foreground mb-12">
                    Esta é uma demonstração visual de como a funcionalidade <strong>{`"${feature.title}"`}</strong> poderia ser na prática.
                </p>

                <div className="border-2 border-dashed rounded-lg p-4 md:p-8">
                    {feature.slug === 'metas-de-leitura' && <MockupMetasDeLeitura />}
                    {feature.slug === 'ranking-de-amigos' && <MockupRankingDeAmigos />}
                    {feature.slug === 'login-social' && <MockupLoginSocial />}
                    {feature.slug === 'adicionar-amigos' && <MockupAdicionarAmigos />}
                    {feature.slug === 'tema-dark-e-light' && <MockupTemaDarkLight />}
                </div>
            </div>
        </main>
    );
}

