

# 📚 BookShelf: Gerenciamento de Biblioteca Pessoal

Este projeto é uma aplicação web moderna para catalogar, organizar e acompanhar o progresso de leitura de livros pessoais.

## 💻 Tecnologias e Arquitetura

BookShelf foi desenvolvido com um *stack* moderno e *type-safe* que utiliza a arquitetura Server/Client Component do Next.js App Router
| Categoria | Tecnologia | Versão | Propósito |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js** | 15 (App Router) | Roteamento, SSR e Server Actions. |
| **Linguagem** | **TypeScript** | - | Tipagem e segurança de código. |
| **Banco de Dados** | **SQLite** | - | Banco de dados leve para desenvolvimento e persistência. |
| **ORM** | **Prisma** | - | Camada de dados type-safe e ORM para SQLite. |
| **Estilização** | **Tailwind CSS** | - | Framework utilitário CSS para estilização rápida e responsiva[cite: 161]. |
| **Componentes** | **shadcn/ui** | - | Biblioteca de componentes acessíveis e customizáveis. |
| **Temas** | `next-themes` | - | Suporte a Dark/Light/System Mode. |

## 🌟 Funcionalidades Principais

| Seção | Funcionalidades |
| :--- | :--- |
| **Login** (`/`) | Página de login com toaster (erro/sucesso). |
| **Dashboard** (`/dash`) | Estatísticas gerais (Total de livros, Livros lendo, Páginas lidas) e navegação rápida. |
| **Biblioteca** (`/books`) | Listagem de livros em formato de cards, com sistema de **busca por título/autor** e **filtros por gênero**. |
| **CRUD** | Criação, Visualização, Edição e Exclusão de livros. |
| **CRUD** | Manutenção de Gêneros. |
| **Detalhes** | Exibição completa de informações, progresso de leitura, sinopse e notas pessoais. |
| **UX/UI** | Design responsivo, tema claro/escuro e feedback visual (Toasts/Dialogs). |

## 📁 Estrutura do Projeto

A estrutura de pastas segue as convenções do Next.js App Router, com foco na separação de responsabilidades (data access, components, layouts):

```
bookshelf-app/
├── app/
│   ├── (routes)/
│   │   ├── books/
│   │   │   ├── [bookId]/         # Página de Detalhes do Livro (READ)
│           ├── edit/
│           ├── └── [bookId]/     # Página de Edição (UPDATE)
│           ├── new/              # Página de Adição de Novo Livro (CREATE)
│           ├── dash/             # Dashboard Principal & Layout principal (Header, ThemeProvider)
│           ├── future/           # Implementações futuras
│               └── [slug]/           
│                   └── _components/    
│               └── page.tsx
│   │   │   ├── genres/
│   │   │   │   └── page.tsx      # Página de Manutenção de Gênero
│   ├── api/
│   │   ├── auth/                 # API routes
│   │   │   └── [...nextauth]/
│   │   │   └── [check-email]/
│   │   │   └── edit/
│   │   │   │   └── [id]/     
│   │   ├── layout.tsx            # Layout principal login
│   │   └── page.tsx              # Login Principal
│   │   └── middleware.tsx        # Controle de rota
│   └── components/
│       ├── auth/                 # Componentes específicos de login
│       ├── books/                # Componentes específicos de livros (BookCard, Filtros)
│       ├── dashboard/            # Componentes específicos do Dashboard (StatCard)
│       ├── forms/                # Componentes de Formulário (BookForm)
│       ├── layout/               # Componentes estruturais (Header, ThemeToggle)
│       └── ui/                   # Componentes do shadcn/ui
├── data/                         # Camada de Acesso a Dados (CRUD functions - usa Prisma)
│   ├── books.ts                  # Funções CRUD para Livros e Estatísticas
│   └── genres.ts                 # Funções CRUD para Gêneros
├── lib/
│   ├── prisma.ts                 # Cliente Prisma Singleton (conexão otimizada)
│   └── utils.ts                  # Funções utilitárias (cn, getStatusVariant)
├── prisma/
│   ├── schema.prisma             # Modelo de dados (Livro, Gênero, Enum Status)
│   └── seed.js                   # Script de população inicial do BD
└── tsconfig.json                 # Configurações do TypeScript (incluindo alias @/)
```

