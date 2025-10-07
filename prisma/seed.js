// prisma/seed.js

// O Prisma Client deve ser importado usando require()
const { PrismaClient, ReadingStatus } = require('@prisma/client');

const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Gêneros disponíveis conforme requisitos
const availableGenres = [
    "Literatura Brasileira",
    "Ficção Científica",
    "Realismo Mágico",
    "Ficção",
    "Fantasia",
    "Romance",
    "Biografia",
    "História",
    "Autoajuda",
    "Tecnologia",
    "Programação",
    "Negócios",
    "Psicologia",
    "Filosofia",
    "Poesia"
];

async function main() {
    console.log('Iniciando o Seeding de dados...');

    // 1. Criar e Mapear Gêneros
    const genreData = await Promise.all(
        availableGenres.map(async (name) => {
            return prisma.genre.upsert({
                where: { name },
                update: {},
                create: { name },
            });
        })
    );
    console.log(`Criados ou atualizados ${genreData.length} Gêneros.`);

    const genreMap = genreData.reduce((acc, genre) => {
        acc[genre.name] = genre.id;
        return acc;
    }, {});

    // 2. ADICIONADO: Criar Usuário de Teste
    console.log('Criando usuário de teste...');
    const email = 'admin@admin.com.br';
    const plainPassword = 'P@ssword123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await prisma.user.upsert({
        where: { email: email },
        update: {},
        create: {
            email: email,
            name: 'Usuário de Teste',
            password: hashedPassword,
        },
    });
    console.log(`Criado ou atualizado o usuário: ${email}`);

    // 3. Dados Iniciais de Livros
    const booksToSeed = [
        {
            title: "O Senhor dos Anéis",
            author: "J.R.R. Tolkien",
            genreName: "Fantasia",
            year: 1954,
            pages: 1216,
            rating: 5,
            synopsis: "Uma jornada épica para destruir um anel maligno e salvar a Terra Média.",
            cover: "https://example.com/tolkien-cover.jpg",
            status: ReadingStatus.LIDO,
            currentPage: 1216,
        },
        {
            title: "1984",
            author: "George Orwell",
            genreName: "Ficção Científica",
            year: 1949,
            pages: 328,
            rating: 4,
            synopsis: "Um futuro distópico onde o Grande Irmão vigia a todos.",
            cover: "https://example.com/orwell-cover.jpg",
            status: ReadingStatus.LENDO,
            currentPage: 150,
        },
        {
            title: "Dom Casmurro",
            author: "Machado de Assis",
            genreName: "Literatura Brasileira",
            year: 1899,
            pages: 256,
            rating: 4,
            synopsis: "A história de Bento Santiago e a suspeita sobre Capitu.",
            cover: "https://example.com/machado-cover.jpg",
            status: ReadingStatus.QUERO_LER,
            currentPage: 0,
        },
        {
            title: "Clean Code",
            author: "Robert C. Martin",
            genreName: "Programação",
            year: 2008,
            pages: 464,
            rating: 5,
            synopsis: "Um guia fundamental para escrever código limpo e legível.",
            cover: "https://example.com/cleancode-cover.jpg",
            status: ReadingStatus.LENDO,
            currentPage: 50,
        },
        {
            title: "A Revolução dos Bichos",
            author: "George Orwell",
            genreName: "Ficção",
            year: 1945,
            pages: 152,
            rating: 5,
            synopsis: "Uma sátira política em forma de fábula sobre animais que se rebelam.",
            cover: "https://example.com/revolucao-bichos-cover.jpg",
            status: ReadingStatus.LIDO,
            currentPage: 152,
        }
    ];

    // 4. Inserir Livros no Banco
    for (const book of booksToSeed) {
        const genre = genreMap[book.genreName];

        await prisma.book.upsert({
            where: { id: book.title },
            update: {},
            create: {
                title: book.title,
                author: book.author,
                year: book.year,
                pages: book.pages,
                rating: book.rating,
                synopsis: book.synopsis,
                cover: book.cover,
                status: book.status,
                currentPage: book.currentPage,
                genreId: genre ? genre.id : null,
            },
        });
    }

    console.log('Seeding de dados finalizado com sucesso.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });