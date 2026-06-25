-- Dados de exemplo para desenvolvimento local
-- Cobre os cenários de specs/001-vitrine-catalogo/quickstart.md §2

insert into categories (id, name, slug) values
  ('00000000-0000-0000-0000-000000000001', 'Frotas', 'frotas'),
  ('00000000-0000-0000-0000-000000000002', 'Agro', 'agro'),
  ('00000000-0000-0000-0000-000000000003', 'Detailing', 'detailing'),
  ('00000000-0000-0000-0000-000000000004', 'Animal', 'animal');

insert into products (
  id, slug, name, line, category_id, dilution, attributes,
  short_description, description, stock, featured, active, ml_url
) values
  (
    '00000000-0000-0000-0000-000000000101',
    'nerta-truck-clean-25l',
    'Nerta Truck Clean',
    'Linha Frotas',
    '00000000-0000-0000-0000-000000000001',
    '3-5%',
    array['Touchless', 'Concentrado'],
    'Detergente concentrado para lavagem de frotas pesadas.',
    'Detergente concentrado de alta performance para lavagem touchless de caminhões e frotas pesadas. Tecnologia química belga.',
    50, true, true, 'https://www.mercadolivre.com.br/exemplo-truck-clean'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'nerta-agro-power-25l',
    'Nerta Agro Power',
    'Linha Agro',
    '00000000-0000-0000-0000-000000000002',
    '5-10%',
    array['Agro', 'Biodegradável'],
    'Limpeza pesada para maquinário agrícola.',
    'Formulado para remover sujeira pesada de maquinário agrícola sem agredir superfícies pintadas.',
    30, true, true, 'https://www.mercadolivre.com.br/exemplo-agro-power'
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'nerta-shine-detailing-25l',
    'Nerta Shine Detailing',
    'Linha Detailing',
    '00000000-0000-0000-0000-000000000003',
    '2-3%',
    array['Brilho', 'Detailing'],
    'Acabamento premium para detailing automotivo.',
    'Produto de detailing com acabamento premium, indicado para finalização de veículos em estúdios profissionais.',
    0, false, true, 'https://www.mercadolivre.com.br/exemplo-shine-detailing'
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    'nerta-animal-care-25l',
    'Nerta Animal Care',
    'Linha Animal',
    '00000000-0000-0000-0000-000000000004',
    '3-5%',
    array['Animal', 'Suave'],
    'Higienização segura para ambientes com animais.',
    'Detergente de baixa agressividade para higienização de ambientes que abrigam animais, como granjas e transportes.',
    15, false, true, null
  ),
  (
    '00000000-0000-0000-0000-000000000105',
    'nerta-produto-descontinuado',
    'Nerta Produto Descontinuado',
    'Linha Frotas',
    '00000000-0000-0000-0000-000000000001',
    '3-5%',
    array[]::text[],
    'Produto descontinuado, não deve aparecer na vitrine.',
    'Produto inativo usado apenas para validar que a vitrine pública nunca retorna itens com active = false.',
    10, false, false, 'https://www.mercadolivre.com.br/exemplo-descontinuado'
  );

insert into product_images (product_id, storage_path, url, position) values
  ('00000000-0000-0000-0000-000000000101', 'products/101/1.png', 'https://placehold.co/600x600?text=Truck+Clean', 1),
  ('00000000-0000-0000-0000-000000000102', 'products/102/1.png', 'https://placehold.co/600x600?text=Agro+Power', 1),
  ('00000000-0000-0000-0000-000000000103', 'products/103/1.png', 'https://placehold.co/600x600?text=Shine+Detailing', 1);
-- nerta-animal-care-25l propositalmente sem imagem, para validar o placeholder "Sem imagem" do ProductCard

-- Produtos fictícios adicionais, com riqueza de detalhes e múltiplas imagens,
-- para validar visualmente as melhorias de UX/galeria (.notes/2026-06-24-melhorias-ux-admin-site.md)
insert into products (
  id, slug, name, line, category_id, dilution, attributes,
  short_description, description, stock, featured, active, purchase_mode, ml_url
) values
  (
    '00000000-0000-0000-0000-000000000106',
    'nerta-fleet-foam-25l',
    'Nerta Fleet Foam',
    'Linha Frotas',
    '00000000-0000-0000-0000-000000000001',
    '2-4%',
    array['Espuma ativa', 'Anticorrosivo', 'Touchless'],
    'Espuma ativa de alto rendimento para pré-lavagem de frotas pesadas.',
    'Espuma ativa desenvolvida para soltar sujeira pesada de estrada (graxa, asfalto, insetos) antes da lavagem touchless. Fórmula anticorrosiva, segura para pintura e cromados. Rendimento de até 1:50 em diluição, reduzindo o custo por veículo lavado em frotas de grande volume.',
    80, false, true, 'mercado_livre', 'https://www.mercadolivre.com.br/exemplo-fleet-foam'
  ),
  (
    '00000000-0000-0000-0000-000000000107',
    'nerta-agro-bio-20l',
    'Nerta Agro Bio',
    'Linha Agro',
    '00000000-0000-0000-0000-000000000002',
    '4-8%',
    array['Biodegradável', 'Concentrado', 'Multissuperfície'],
    'Detergente biodegradável para limpeza de implementos e silos.',
    'Detergente superconcentrado e biodegradável, formulado para limpeza de implementos agrícolas, silos e estruturas metálicas em contato com insumos. Não deixa resíduo agressivo ao solo. Disponível via parceria comercial — atendimento dedicado a cooperativas e distribuidores regionais.',
    45, false, true, 'formulario_parceria', null
  ),
  (
    '00000000-0000-0000-0000-000000000108',
    'nerta-glass-pro-1l',
    'Nerta Glass Pro',
    'Linha Detailing',
    '00000000-0000-0000-0000-000000000003',
    'Pronto uso',
    array['Antiembaçante', 'Sem amônia', 'Acabamento sem manchas'],
    'Limpa-vidros profissional sem amônia, com efeito antiembaçante.',
    'Fórmula pronta para uso, sem amônia, segura para vidros com película e plásticos internos. Efeito antiembaçante residual de até 48h. Indicado para estúdios de detailing e revenda em lojas de autopeças.',
    12, false, true, 'mercado_livre', 'https://www.mercadolivre.com.br/exemplo-glass-pro'
  ),
  (
    '00000000-0000-0000-0000-000000000109',
    'nerta-pet-fresh-5l',
    'Nerta Pet Fresh',
    'Linha Animal',
    '00000000-0000-0000-0000-000000000004',
    '3-6%',
    array['Hipoalergênico', 'Neutralizador de odor', 'Biodegradável'],
    'Higienizante hipoalergênico para ambientes com animais.',
    'Higienizante de baixa toxicidade formulado para canis, pet shops, granjas e veículos de transporte animal. Neutraliza odores na origem em vez de mascarar, e é seguro para contato indireto com animais após secagem. Fornecimento via parceria comercial, com suporte técnico para protocolo de uso.',
    60, false, true, 'formulario_parceria', null
  ),
  (
    '00000000-0000-0000-0000-000000000110',
    'nerta-moto-shine-500ml',
    'Nerta Moto Shine',
    'Linha Detailing',
    '00000000-0000-0000-0000-000000000003',
    'Pronto uso',
    array['Compacto', 'Acabamento espelhado', 'Proteção UV'],
    'Cera líquida compacta com proteção UV para motocicletas.',
    'Cera líquida de aplicação rápida, formulada para peças plásticas e metálicas de motocicletas. Acabamento espelhado e proteção UV que retarda o desbotamento de plásticos pretos. Frasco compacto, ideal para revenda em concessionárias e lojas de acessórios.',
    22, false, true, 'mercado_livre', 'https://www.mercadolivre.com.br/exemplo-moto-shine'
  ),
  (
    '00000000-0000-0000-0000-000000000111',
    'nerta-industrial-degreaser-25l',
    'Nerta Industrial Degreaser',
    'Linha Frotas',
    '00000000-0000-0000-0000-000000000001',
    '5-15%',
    array['Alta concentração', 'Remove graxa pesada', 'Uso industrial'],
    'Desengraxante industrial de alta concentração para manutenção de frotas.',
    'Desengraxante de uso industrial para remoção de óleo e graxa pesada em motores, chassi e pátios de manutenção de frotas. Alta concentração permite diluições de até 1:20 conforme o nível de sujidade. Fornecimento via parceria comercial, com volume mínimo para revenda.',
    5, false, true, 'formulario_parceria', null
  );

insert into product_images (product_id, storage_path, url, position) values
  ('00000000-0000-0000-0000-000000000106', 'products/106/1.png', 'https://placehold.co/1200x1200/0D1B2E/5BB8F5?text=Fleet+Foam', 1),
  ('00000000-0000-0000-0000-000000000106', 'products/106/2.png', 'https://placehold.co/1200x1200/0D1B2E/8A9BB0?text=Fleet+Foam+-+Aplicacao', 2),
  ('00000000-0000-0000-0000-000000000107', 'products/107/1.png', 'https://placehold.co/900x900/0D1B2E/1DB87E?text=Agro+Bio', 1),
  ('00000000-0000-0000-0000-000000000107', 'products/107/2.png', 'https://placehold.co/900x900/0D1B2E/8A9BB0?text=Agro+Bio+-+Rotulo', 2),
  ('00000000-0000-0000-0000-000000000108', 'products/108/1.png', 'https://placehold.co/600x600/0D1B2E/5BB8F5?text=Glass+Pro', 1),
  ('00000000-0000-0000-0000-000000000109', 'products/109/1.png', 'https://placehold.co/900x900/0D1B2E/1DB87E?text=Pet+Fresh', 1),
  ('00000000-0000-0000-0000-000000000109', 'products/109/2.png', 'https://placehold.co/900x900/0D1B2E/8A9BB0?text=Pet+Fresh+-+Uso', 2),
  ('00000000-0000-0000-0000-000000000110', 'products/110/1.png', 'https://placehold.co/600x600/0D1B2E/5BB8F5?text=Moto+Shine', 1),
  ('00000000-0000-0000-0000-000000000111', 'products/111/1.png', 'https://placehold.co/1200x1200/0D1B2E/8A9BB0?text=Industrial+Degreaser', 1),
  ('00000000-0000-0000-0000-000000000111', 'products/111/2.png', 'https://placehold.co/1200x1200/0D1B2E/5BB8F5?text=Industrial+Degreaser+-+Detalhe', 2);
