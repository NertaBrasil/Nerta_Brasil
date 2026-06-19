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
