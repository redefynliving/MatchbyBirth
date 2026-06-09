create extension if not exists pgcrypto;

create table public.results (
  id uuid primary key default gen_random_uuid(),
  share_slug text not null unique,
  mode text not null check (mode in ('pair', 'group')),
  relationship_type text not null check (relationship_type in ('love', 'friendship', 'work')),
  result_payload jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz default (now() + interval '90 days')
);

create index results_expires_at_idx on public.results (expires_at)
  where expires_at is not null;

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.results(id) on delete restrict,
  email text not null,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  amount_cents integer not null default 999 check (amount_cents > 0),
  currency text not null default 'usd',
  status text not null default 'checkout_created'
    check (status in (
      'checkout_created',
      'paid',
      'generating',
      'delivered',
      'failed',
      'refunded'
    )),
  delivery_attempts integer not null default 0 check (delivery_attempts >= 0),
  last_error text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  delivered_at timestamptz,
  refunded_at timestamptz,
  updated_at timestamptz not null default now()
);

create index purchases_status_idx on public.purchases (status, updated_at);
create index purchases_result_id_idx on public.purchases (result_id);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null unique references public.purchases(id) on delete cascade,
  access_token_hash text not null unique,
  content jsonb not null,
  model text not null,
  prompt_version text not null,
  provider_email_id text,
  created_at timestamptz not null default now(),
  emailed_at timestamptz
);

create table public.webhook_events (
  stripe_event_id text primary key,
  event_type text not null,
  status text not null check (status in ('processing', 'processed', 'failed')),
  last_error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create table public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  result_id uuid references public.results(id) on delete set null,
  consent_source text not null,
  consented_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

alter table public.results enable row level security;
alter table public.purchases enable row level security;
alter table public.reports enable row level security;
alter table public.webhook_events enable row level security;
alter table public.email_subscribers enable row level security;

revoke all on public.results from anon, authenticated;
revoke all on public.purchases from anon, authenticated;
revoke all on public.reports from anon, authenticated;
revoke all on public.webhook_events from anon, authenticated;
revoke all on public.email_subscribers from anon, authenticated;

grant usage on schema public to service_role;
grant all on public.results to service_role;
grant all on public.purchases to service_role;
grant all on public.reports to service_role;
grant all on public.webhook_events to service_role;
grant all on public.email_subscribers to service_role;
