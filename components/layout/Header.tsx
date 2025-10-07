// components/layout/Header.tsx
import Link from 'next/link';
import { BookOpenText, Home, List, PlusCircle, Menu, BookMarked, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// --- NOVOS IMPORTS ---
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logout } from '@/lib/actions';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// --------------------

const navItems = [
    { name: 'Dashboard', href: '/dash', icon: Home },
    { name: 'Minha Biblioteca', href: '/books', icon: List },
    { name: 'Adicionar Livro', href: '/books/new', icon: PlusCircle },
    { name:'Implementações Futuras', href:'/future', icon: BookMarked },
];

// ALTERADO: A função agora é 'async' para poder buscar a sessão
export default async function Header() {
    // NOVO: Busca a sessão do usuário no servidor
    const session = await getServerSession(authOptions);

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4">
                    <BookOpenText className="h-6 w-6 text-primary" />
                    <Link href="/dash" className="text-xl font-bold tracking-tight">
                        BookShelf
                    </Link>
                </div>
                {/* Navegação Desktop */}
                <nav className="hidden md:flex space-x-1">
                    {navItems.map((item) => (
                        <Button key={item.name} variant="ghost" asChild>
                            <Link href={item.href}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </Link>
                        </Button>
                    ))}
                </nav>

                <div className="flex items-center space-x-2">
                    <ThemeToggle />

                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {session?.user?.name ? 
                                                session.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
                                                : <User className="h-5 w-5" />
                                            }
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start" side="bottom" sideOffset={8} forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {session?.user?.name || 'Usuário'}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session?.user?.email || 'email@exemplo.com'}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <form action={logout}>
                                    <DropdownMenuItem asChild>
                                        <button type="submit" className="w-full text-left">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Sair</span>
                                        </button>
                                    </DropdownMenuItem>
                                </form>
                            </DropdownMenuContent>
                        </DropdownMenu>


                    {/* Menu Mobile */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <nav className="flex flex-col space-y-2 pt-6">
                                {navItems.map((item) => (
                                    <Link key={item.name} href={item.href} className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                                        <item.icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}