// Nerta Admin — sample data + helpers for the admin UI kit (fictional).
window.slugify = function (s) {
  return (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

window.ADMIN_CATEGORIES = [
  { id: 'c1', name: 'Detergente Espuma Ativa',  slug: 'detergente-espuma-ativa',   count: 2 },
  { id: 'c2', name: 'Detergente Concentrado',   slug: 'detergente-concentrado',    count: 1 },
  { id: 'c3', name: 'Desincrustante Agrícola',  slug: 'desincrustante-agricola',   count: 1 },
  { id: 'c4', name: 'Shampoo Premium',           slug: 'shampoo-premium',           count: 1 },
  { id: 'c5', name: 'Higiene Animal',            slug: 'higiene-animal',            count: 0 },
];

window.ADMIN_PRODUCTS = [
  {
    id: 'p1', name: 'Active Diamond Foam', line: 'Tecnologia Alcalina',
    category: 'Detergente Espuma Ativa', dilution: '3–5%',
    attributes: ['Touchless', 'Agro'], price: 489.90, stock: 24,
    active: true, featured: true, icon: 'sparkles',
    slug: 'active-diamond-foam',
    shortDesc: 'Formulação alcalina superconcentrada para lavagem touchless de veículos pesados e frotas.',
    fullDesc: '**Formulação alcalina superconcentrada** que dissolve sujeiras severas *sem necessidade de esfregação*.\n\nDesenvolvida para sistemas de lavagem touchless em frotas e agronegócio. Diluição de 3–5% garante o menor custo real por lavagem do mercado.',
    techSheet: 'pH (concentrado): 13,2\nDiluição recomendada: 3–5%\nAspecto: líquido viscoso azul\nDensidade: 1,05 g/cm³\nValidade: 24 meses\nEmbalagem: bombona 25 L',
    mlUrl: 'https://www.mercadolivre.com.br/',
  },
  {
    id: 'p2', name: 'Truck Wash Pro', line: 'Linha Frotas',
    category: 'Detergente Concentrado', dilution: '5–10%',
    attributes: ['pH Neutro', 'Frotas'], price: 412.00, stock: 11,
    active: true, featured: true, icon: 'truck',
    slug: 'truck-wash-pro',
    shortDesc: 'Detergente neutro concentrado para lavagem de caminhões e veículos pesados.',
    fullDesc: 'Formulação **pH neutro** ideal para lavagem manual e automatizada de caminhões, ônibus e veículos de frota.\n\nAlta espuma de curta duração. Não agride pintura nem borrachas.',
    techSheet: 'pH (uso): 7,0–7,5\nDiluição: 5–10%\nAspecto: líquido transparente\nBiodegradável: sim\nEmbalagem: bombona 25 L',
    mlUrl: 'https://www.mercadolivre.com.br/',
  },
  {
    id: 'p3', name: 'Agro Power 25', line: 'Linha Agro',
    category: 'Desincrustante Agrícola', dilution: '8–12%',
    attributes: ['Agro', 'Alta Performance'], price: 538.50, stock: 7,
    active: true, featured: true, icon: 'tractor',
    slug: 'agro-power-25',
    shortDesc: 'Desincrustante alcalino para maquinário agrícola com resíduos de terra e óleo.',
    fullDesc: 'Desenvolvido para remoção de incrustações de terra, lama, óleo e graxa em tratores, colheitadeiras e implementos agrícolas.\n\n**Alta concentração alcalina** permite uso em equipamentos de grande porte com alta contaminação.',
    techSheet: 'pH (concentrado): 13,8\nDiluição: 8–12%\nTipo: desincrustante alcalino\nTemperatura de uso: 10–60°C\nEmbalagem: bombona 25 L',
    mlUrl: 'https://www.mercadolivre.com.br/',
  },
  {
    id: 'p4', name: 'Detailing Gloss', line: 'Linha Detailing',
    category: 'Shampoo Premium', dilution: '1–3%',
    attributes: ['Detailing', 'pH Neutro'], price: 298.00, stock: 0,
    active: true, featured: false, icon: 'droplet',
    slug: 'detailing-gloss',
    shortDesc: 'Shampoo premium pH neutro para detalhamento automotivo profissional.',
    fullDesc: 'Fórmula pH neutro com **agentes brilhantes** para acabamento impecável em detalhamento automotivo.\n\nEspuma densa e controlada, rinse fácil, sem manchas em vidros e cromados.',
    techSheet: 'pH (uso): 7,0\nDiluição: 1–3%\nEspuma: alta densidade\nAcabamento: brilho intenso\nEmbalagem: bombona 25 L',
    mlUrl: '',
  },
  {
    id: 'p5', name: 'Cutisall+', line: 'Linha Animal',
    category: 'Higiene Animal', dilution: '2–4%',
    attributes: ['Animal', 'Biodegradável'], price: 356.90, stock: 18,
    active: false, featured: false, icon: 'leaf',
    slug: 'cutisall-plus',
    shortDesc: 'Shampoo veterinário concentrado para higiene de bovinos, equinos e suínos.',
    fullDesc: 'Formulação **suave e biodegradável** para banho de animais de médio e grande porte.\n\nSem parabenos, controle de odor por 72h, eficácia comprovada em ambiente de confinamento.',
    techSheet: 'pH (uso): 6,5–7,0\nDiluição: 2–4%\nBiodegradável: sim\nSem parabenos: sim\nEmbalagem: bombona 25 L',
    mlUrl: '',
  },
  {
    id: 'p6', name: 'Alkaline Degreaser HD', line: 'Linha Frotas',
    category: 'Detergente Concentrado', dilution: '10–20%',
    attributes: ['Frotas', 'Industrial'], price: 467.00, stock: 32,
    active: true, featured: false, icon: 'flask-conical',
    slug: 'alkaline-degreaser-hd',
    shortDesc: 'Desengraxante alcalino de alta diluição para oficinas e pátios de frotas.',
    fullDesc: '**Alta diluição de 10–20%** para remoção de graxa densa, óleo de motor e resíduos industriais.\n\nIndicado para pátios de caminhões, oficinas de frota e aplicações industriais com alta carga de contaminação.',
    techSheet: 'pH (concentrado): 14,0\nDiluição: 10–20%\nTipo: desengraxante alcalino HD\nTemperatura: 20–80°C\nEmbalagem: bombona 25 L',
    mlUrl: 'https://www.mercadolivre.com.br/',
  },
];

window.ADMIN_USERS = [
  { id: 'u1', name: 'Marina Albuquerque', email: 'marina@nerta.com.br', role: 'admin',  created: '12 jan 2026', self: true  },
  { id: 'u2', name: 'Rafael Tavares',     email: 'rafael@nerta.com.br',  role: 'admin',  created: '03 fev 2026', self: false },
  { id: 'u3', name: 'Carla Menezes',      email: 'carla@nerta.com.br',   role: 'editor', created: '21 fev 2026', self: false },
  { id: 'u4', name: 'Diego Fonseca',      email: 'diego@nerta.com.br',   role: 'editor', created: '08 mar 2026', self: false },
];

window.brl = function (n) {
  return 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
