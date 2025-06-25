
-- Permitir que o usuário veja apenas SEUS registros:
-- (Essas políticas são seguras, cada usuário só vê os próprios dados)

-- user_searches
alter table public.user_searches enable row level security;
create policy "Usuário vê suas próprias buscas" on public.user_searches
for select using (auth.uid() = user_id);

-- user_interactions
alter table public.user_interactions enable row level security;
create policy "Usuário vê suas próprias interações" on public.user_interactions
for select using (auth.uid() = user_id);

-- wishlist
alter table public.wishlist enable row level security;
create policy "Usuário vê sua própria wishlist" on public.wishlist
for select using (auth.uid() = user_id);

-- products (produtos devem ser públicos para leitura)
alter table public.products enable row level security;
create policy "Todos podem ver produtos" on public.products
for select using (true);

