# PRD — Taberna Ti Maria

## Problema original
Website para taberna de petiscos, vinhos e cerveja em Lagos (Algarve). Logotipo anexado deve aparecer bem grande. Slogan oficial: "ÓOOOH Ti Maria, vem cá provar disto!". Tom: humor, ambiente leve, tranquilidade, convívio + profissionalismo. Espaço pequeno e acolhedor, elevado valor gastronómico, comida caseira. Cozinheiro/dono: Sr. Ângelo (40 anos a cozinhar, 20 como chefe). Inspiração: lenda algarvia da Maria de Lagos. Comida inspirada apenas no Algarve, produtos algarvios.

## Escolhas do utilizador
- One-page completo: herói, ementa, lenda, chef, contactos
- Ementa dinâmica em base de dados + painel admin
- Reservas só por telefone/morada
- Bilingue PT + EN
- Design ao critério do designer, com sardinhas como motivo decorativo

## Arquitetura
- Frontend: React + Tailwind + framer-motion + lenis (scroll suave). Páginas: `/` (landing), `/admin` (login + CRUD ementa). i18n próprio via contexto (`src/i18n.js`).
- Backend: FastAPI + MongoDB (motor). Rotas `/api/menu` (GET público; POST/PUT/DELETE protegidos) e `/api/auth/*` (login/logout/me/refresh, JWT em httpOnly cookies, bcrypt, proteção brute-force 5 tentativas/15 min).
- Seed automático no startup: admin + 18 itens de ementa (petiscos/vinhos/cervejas algarvios, PT+EN).

## Restyling (2026-09-02, pedido do utilizador)- Tema escuro substituído por tema claro e alegre inspirado nas fotos enviadas: sardinhas de cerâmica coloridas e azulejos portugueses.
- Nova paleta: creme (#FAF2DF) base, azul azulejo (#2B5FAB/#1C3A6B), terracota (#D96B43), rosa cerâmica (#E4607F), amarelo mostarda (#F0B429), menta, roxo, vinho.
- Padrão de azulejo português em SVG (gerado em código) como fundo do herói, divisores entre secções e parede de azulejos na secção da Lenda (fundo azul profundo).
- Sardinhas flutuantes multicoloridas no herói; faixa marquee terracota com sardinhas amarelas; secção do Chef em amarelo suave; secção de contactos em rosa com cartões translúcidos; rodapé azul profundo.
- Painel admin também passou a tema claro.

## Personas
- Visitante local/turista: quer ver ementa, história e telefone para reservar (PT ou EN).
- Sr. Ângelo (admin): edita pratos, preços e disponibilidade sem saber de tecnologia.

## Implementado (2026-09-02)
- Herói cinético: logotipo gigante em badge creme com anel de texto rotativo, slogan com reveal mascarado linha a linha, sardinhas flutuantes, parallax no scroll.
- Marquee editorial lento com motivos (sardinhas, vinho, cerveja...).
- Ementa dinâmica com tabs Petiscos/Vinhos/Cervejas, layout editorial com preços em mono, foto de sardinhas assadas em moldura com citação.
- Secção "A Lenda da Maria de Lagos" em 3 capítulos numerados romanos, layout alternado, sardinhas gigantes de fundo.
- Secção Sr. Ângelo: retrato em arco com spotlight, stats 40/20/1, citação.
- Contactos: botão telefónico grande, morada, horário, link Google Maps.
- Toggle PT/EN global; rodapé com slogan.
- Painel admin `/admin`: login JWT, listagem por categoria, criar/editar/apagar itens, toggle de disponibilidade.
- Placeholders a substituir: telefone (+351 282 123 456) e morada (Travessa da Ti Maria, nº 54) são fictícios; foto do chef é de stock.

## Credenciais
- Ver /app/memory/test_credentials.md (admin: angelo@timaria.pt / TiMaria1954!)

## Backlog
- P0: substituir telefone/morada pelos reais. (foto real aplicada; contactos ATUAIS: +351 927 915 314 e Tv. Dom Vasco da Gama 9, Lagos — WhatsApp wa.me/351927915314, atualizado 2026-09-24)
- P1: secção de galeria do espaço (sardinhas na decoração física).
- P1: destaque "Prato do dia" editável no admin.
- P2: Instagram feed ou link; reviews de clientes; versão impressa da ementa (PDF).
- P2: SEO/meta tags OG com o logotipo; favicon da marca.

## Alterações 2026-09-24
- Secção do Sr. Ângelo (história, stats, citação, foto) REMOVIDA a pedido do utilizador. Em seu lugar: secção "A Nossa Cozinha" com o vídeo enviado (Angelo 1.mov).
- Vídeo publicado SEM gradação de cor (o utilizador pediu para desfazer a melhoria). Apenas conversão: 1080p→720p, /assets/cozinha.webm (VP9, 5.9MB) + /assets/cozinha.mp4 (H.264, 9.4MB), poster /assets/cozinha-poster.jpg. Autoplay muted loop. Original guardado em /root/angelo_raw.mov.
- Nav: "O Cozinheiro" → "A Cozinha" (PT/EN).
- Galeria (2026-09-30): nova secção "Da Nossa Mesa" (bg menta) entre a ementa e a lenda, com 5 fotos reais dos pratos (g1-g5 em /assets) em molduras polaroid com fita amarela, legendas PT/EN. Imagens: g1 pimentos, g2 pastéis bacalhau, g3 tosta, g4 croquetes, g5 salada de polvo.
- Ementa substituída pelo menu real da taberna (2026-09-24): 8 categorias (pequeno-almoco, menu, almoco, petiscos, fritos, especialidades, frios, sandes), 27 itens, SEM preços. Frontend esconde linha de preço quando vazio. Tabs coloridas por categoria. Typos do original normalizados (à Guilho, orégãos, grão).
- Ementa em LIVRO (2026-09-30): menu completo com preços (99 itens, 8 categorias: cafes, pequeno-almoco, pratos, sobremesas, gelados, bebidas, vinhos, doses). Flipbook próprio em CSS 3D (book-leaf rotateY, sem react-pageflip — a lib falhava o primeiro render). Capa azul azulejo + contracapa terracota com WhatsApp. Pratos em 2 páginas. Campo `highlight` no modelo/backend/admin: favoritos marcados com sardinha terracota (Pastel de Nata, Bifana à Ti Maria, Prato do Dia, etc.). Mobile: página única com flip centrado e setas por baixo. StrictMode removido de index.js.

## Funcionalidades extra (2026-09-02)- SwimmingSardine: sardinha que nada da esquerda para a direita do ecrã conforme o scroll (framer-motion useScroll), trajetória ondulante, cauda a abanar (CSS tail-wag) e cor que muda por secção (terracota → azul → rosa → verde → roxo). Escondida em mobile.
