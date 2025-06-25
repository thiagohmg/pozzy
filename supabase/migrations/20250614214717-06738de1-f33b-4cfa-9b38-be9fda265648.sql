
-- Tabela de notificações reais para usuários
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null, -- price_drop, back_in_stock, new_deal, etc
  product_id uuid,    -- opcional: para vincular notificação a um produto
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Habilita Row Level Security
alter table public.notifications enable row level security;

-- Usuário só pode ver suas próprias notificações
create policy "Usuários veem suas próprias notificações" on public.notifications
for select using (auth.uid() = user_id);

-- Usuário só pode inserir notificações para si
create policy "Usuário pode criar suas notificações" on public.notifications
for insert with check (auth.uid() = user_id);

-- Usuário só pode marcar suas próprias notificações como lidas/remover
create policy "Usuário pode atualizar/remover suas notificações" on public.notifications
for update using (auth.uid() = user_id);
create policy "Usuário pode deletar suas notificações" on public.notifications
for delete using (auth.uid() = user_id);
