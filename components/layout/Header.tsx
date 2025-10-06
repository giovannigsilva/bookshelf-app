// components/layout/Header.tsx
import Link from 'next/link';
import { BookOpenText, Home, List, PlusCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Minha Biblioteca', href: '/books', icon: List },
    { name: 'Adicionar Livro', href: '/books/new', icon: PlusCircle },
];

export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4">
                    <BookOpenText className="h-6 w-6 text-primary" />
                    <Link href="/" className="text-xl font-bold tracking-tight">
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