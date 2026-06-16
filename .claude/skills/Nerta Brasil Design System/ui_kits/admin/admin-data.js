// Nerta Admin — sample data + helpers for the admin UI kit (fictional).
window.slugify = function (s) {
  return (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

window.ADMIN_CATEGORIES = [
  { id: 'c1', name: 'Detergente Espuma Ativa', slug: 'detergente-espuma-ativa', count: 2 },
  { id: 'c2', name: 'Detergente Concentrado', slug: 'detergente-concentrado', count: 1 },
  { id: 'c3', name: 'Desincrustante Agrícola', slug: 'desincrustante-agricola', count: 1 },
  { id: 'c4', name: 'Shampoo Premium', slug: 'shampoo-premium', count: 1 },
  { id: 'c5', name: 'Higiene Animal', slug: 'higiene-animal', count: 0 },
];

window.ADMIN_PRODUCTS = [
  { id: 'p1', name: 'Active Diamond Foam', line: 'Tecnologia Alcalina', category: 'Detergente Espuma Ativa', dilution: '3–5%', attributes: ['Touchless', 'Agro'], price: 489.90, stock: 24, active: true, featured: true, icon: 'sparkles' },
  { id: 'p2', name: 'Truck Wash Pro', line: 'Linha Frotas', category: 'Detergente Concentrado', dilution: '5–10%', attributes: ['pH Neutro', 'Frotas'], price: 412.00, stock: 11, active: true, featured: true, icon: 'truck' },
  { id: 'p3', name: 'Agro Power 25', line: 'Linha Agro', category: 'Desincrustante Agrícola', dilution: '8–12%', attributes: ['Agro', 'Alta Performance'], price: 538.50, stock: 7, active: true, featured: true, icon: 'tractor' },
  { id: 'p4', name: 'Detailing Gloss', line: 'Linha Detailing', category: 'Shampoo Premium', dilution: '1–3%', attributes: ['Detailing', 'pH Neutro'], price: 298.00, stock: 0, active: true, featured: false, icon: 'droplet' },
  { id: 'p5', name: 'Cutisall+', line: 'Linha Animal', category: 'Higiene Animal', dilution: '2–4%', attributes: ['Animal', 'Biodegradável'], price: 356.90, stock: 18, active: false, featured: false, icon: 'leaf' },
  { id: 'p6', name: 'Alkaline Degreaser HD', line: 'Linha Frotas', category: 'Detergente Concentrado', dilution: '10–20%', attributes: ['Frotas', 'Industrial'], price: 467.00, stock: 32, active: true, featured: false, icon: 'flask-conical' },
];

window.ADMIN_USERS = [
  { id: 'u1', name: 'Marina Albuquerque', email: 'marina@provisao.com.br', role: 'admin', created: '12 jan 2026', self: true },
  { id: 'u2', name: 'Rafael Tavares', email: 'rafael@provisao.com.br', role: 'admin', created: '03 fev 2026', self: false },
  { id: 'u3', name: 'Carla Menezes', email: 'carla@provisao.com.br', role: 'editor', created: '21 fev 2026', self: false },
  { id: 'u4', name: 'Diego Fonseca', email: 'diego@provisao.com.br', role: 'editor', created: '08 mar 2026', self: false },
];

window.brl = function (n) {
  return 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
